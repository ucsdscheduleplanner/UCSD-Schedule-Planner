import os
import sqlite3
import time
import sys
import traceback 

from threading import Thread, Lock

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from settings import HTML_STORAGE
from settings import HOME_DIR 
from settings import DATABASE_PATH, DATABASE_FOLDER_PATH, DRIVER_PATH 
from settings import TIMEOUT, DEPT_SEARCH_TIMEOUT  
from settings import SCHEDULE_OF_CLASSES, QUARTER

QUARTER_INSERT_SCRIPT = """let select = document.getElementById("selectedTerm");
            let opt = document.createElement('option');
            opt.value = "WI19";
            opt.innerHTML = "bad";
            select.appendChild(opt);
            document.getElementById("selectedTerm").value = "{}";
            """

class Scraper:
    def __init__(self):
        # Keeping track of HTML directory
        self.dir_path = HTML_STORAGE
        self.login_url = SCHEDULE_OF_CLASSES

        # Connecting to the database for the list of departments
        os.makedirs(DATABASE_FOLDER_PATH, exist_ok=True)
        self.database = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.database.cursor()
        self.cursor.execute("SELECT DEPT_CODE FROM DEPARTMENT")

        # fetching the data returns a tuple with one element,
        # so using list comprehension to convert the data
        self.departments = [i[0] for i in self.cursor.fetchall()]

        # Boolean to signal that a thread has crashed
        self.mutex = Lock()
        self.crashed = False

        # Go back to the home directory
        os.chdir(HOME_DIR)

    def scrape(self):
        print('Beginning course scraping.')
        curr_time = time.time()
        self.iter_departments()
        if not self.crashed:
            fin_time = time.time()
            min_span = (fin_time - curr_time) / 60
            print('Finished course scraping in {0:.4f} minutes.'.format(min_span))

    def iter_departments(self):
        # Number of threads is equivalent to the number of processors on the machine
        pool = []
        pool_size = os.cpu_count()
        print("Initializing {} threads ...".format(pool_size))
        
        # Allocate a pool of threads; each worker handles an equal subset of the work
        for i in range(pool_size):
            t = Thread(target=self.iter_departments_handle_errors, args=[i, pool_size])
            t.start()
            pool.append(t)

        # Block the main thread until each worker finishes
        for t in pool:
            t.join()

    def has_crashed_thread_safe(self):
        # Acquire the mutex, read the crashed variable into a local version, and return it
        local_crashed = False
        self.mutex.acquire()
        try:
            local_crashed = self.crashed
        finally:
            self.mutex.release()
        return local_crashed
            
    def iter_departments_handle_errors(self, thread_id, num_threads): 
        try:
            self.iter_departments_by_thread(thread_id, num_threads)
        except: 
            # Acquire the mutex and note that the scraper has crashed
            self.mutex.acquire() 
            try:
                # Print traceback to stdout 
                print("Error encountered by thread {}. Gracefully exiting ...".format(thread_id), file=sys.stderr)
                traceback.print_exc(file=sys.stderr)
                self.crashed = True
            finally:
                self.mutex.release()

    def iter_departments_by_thread(self, thread_id, num_threads): 
        print("Thread {} is starting.".format(thread_id))

        # Every thread handles departments of index i where i % num_threads == thread_id
        counter = thread_id
    
        # Set up Chrome options for the Selenium webdriver
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        # Directing Python to browser to chrome executable file
        browser = webdriver.Chrome(chrome_options=options, executable_path=DRIVER_PATH)
        browser.set_page_load_timeout(TIMEOUT)
        browser.implicitly_wait(1)
        browser.get(self.login_url)

        local_crashed = False

        while counter < len(self.departments):
            # Exit if any part of the scraper has crashed 
            if self.has_crashed_thread_safe():
                print("Thread {} is exiting gracefully ...".format(thread_id), file=sys.stderr)
                return

            # Access the appropriate department 
            department = self.departments[counter]

            browser.get(self.login_url)
            WebDriverWait(browser, TIMEOUT).until(EC.presence_of_element_located
                                                       ((By.ID, 'selectedSubjects')))

            # browser.execute_script(QUARTER_INSERT_SCRIPT.format(QUARTER))

            dept_select = Select(browser.find_element_by_id("selectedSubjects"))

            truncated_dept = department + (4 - len(department)) * " "

            WebDriverWait(browser, TIMEOUT).until(EC.presence_of_element_located
                                                       ((By.CSS_SELECTOR, "option[value='{}']".format(truncated_dept))))
            dept_select.select_by_value(truncated_dept)

            default_schedule_option1 = browser.find_element_by_id("schedOption11")
            default_schedule_option2 = browser.find_element_by_id("schedOption21")

            if default_schedule_option1.is_selected():
                default_schedule_option1.click()
            if default_schedule_option2.is_selected():
                default_schedule_option2.click()

            search_button = browser.find_element_by_id("socFacSubmit")
            search_button.click()

            # Exit if any part of the scraper has crashed 
            if not self.iter_pages(department, browser, thread_id):
                print("Thread {} is exiting gracefully ...".format(thread_id), file=sys.stderr)
                return 

            counter += num_threads

        print("Thread {} has finished the work assigned to it.".format(thread_id))

    def iter_pages(self, department, browser, thread_id):
        # now I should be at the course pages
        current_page = 1
        base_url = browser.current_url

        while True:
            if self.has_crashed_thread_safe():
                return False

            try:
                if 'Apache' in browser.title:
                    return True

                page_ul = WebDriverWait(browser, DEPT_SEARCH_TIMEOUT).until(EC.presence_of_element_located
                                                                     ((By.ID, 'socDisplayCVO')))
            except:
                return True

            if 'Apache' in browser.title or "No Result Found" in browser.page_source:
                return True

            html = browser.page_source
            self.store_page(department, html, current_page, thread_id)
            current_page += 1
            current_url = base_url + "?page={}".format(current_page)
            browser.get(current_url)

    def store_page(self, department, page_contents, num_page, thread_id):
        if not os.path.exists(self.dir_path):
            os.makedirs(self.dir_path)
        department_path = os.path.join(self.dir_path, department)
        if not os.path.exists(department_path):
            os.makedirs(department_path)

        file = open(os.path.join(department_path, str(num_page) + '.html'), 'w')
        file.write(page_contents)
        print('[T{0}] Saving'.format(thread_id), '{0} (#{1})'.format(department, num_page), 'to', file.name, '...')
        file.close()


