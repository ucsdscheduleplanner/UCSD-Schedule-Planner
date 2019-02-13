import concurrent.futures as thread_library
import os
import queue
import shutil
import sqlite3
import sys
import traceback
from threading import Thread

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait

from scraper.scraper_util import get_browser
from settings import COURSES_HTML_PATH
from settings import DATABASE_PATH, DATABASE_FOLDER_PATH
from settings import SCHEDULE_OF_CLASSES_URL
from settings import TIMEOUT, DEPT_SEARCH_TIMEOUT

QUARTER_INSERT_SCRIPT = """let select = document.getElementById("selectedTerm");
            let opt = document.createElement('option');
            opt.value = "WI19";
            opt.innerHTML = "bad";
            select.appendChild(opt);
            document.getElementById("selectedTerm").value = "{}";
            """


class LazyWriter:
    def __init__(self):
        self.pool = thread_library.ThreadPoolExecutor(max_workers=1)

    def write(self, path, contents, log_msg):
        self.pool.submit(self._write, path, contents, log_msg)

    def _write(self, path, contents, log_msg):
        # Save specific course HTML in department folder
        with open(path, 'w') as file_handle:
            file_handle.write(contents)
            print(log_msg)


writer = LazyWriter()


class CourseScraperThread(Thread):
    def __init__(self, thread_id, work_queue=queue.Queue(), max_retries=5):
        super().__init__()
        self.thread = Thread(target=self.scrape_departments)
        self.work_queue = work_queue
        self.thread_id = thread_id
        self.max_retries = max_retries
        self.browser = None

    def start(self):
        self.browser = get_browser()
        print("Thread {} is starting.".format(self.thread_id))
        self.thread.start()

    def join(self, **kwargs):
        self.thread.join(**kwargs)
        self.browser.quit()
        print("Thread {} has finished the work assigned to it.".format(self.thread_id))

    def scrape_departments(self):
        while not self.work_queue.empty():
            department = self.work_queue.get()
            self.scrape_department(department)
            self.work_queue.task_done()

    def scrape_department(self, department):
        # If a thread receives an error during execution, kill all threads & mark program as crashed try:
        try:
            self._scrape_department(department)
        except:
            print("Error encountered by thread {}. Gracefully exiting ...".format(self.thread_id), file=sys.stderr)
            traceback.print_exc(file=sys.stderr)

    def _scrape_department(self, department):
        try:
            self.get_page(SCHEDULE_OF_CLASSES_URL)
            WebDriverWait(self.browser, TIMEOUT).until(EC.presence_of_element_located((By.ID, 'selectedSubjects')))
            self.search_department(department)
            self.scrape_pages(department)
        except:
            print("Thread {} is exiting gracefully ...".format(self.thread_id), file=sys.stderr)

    def search_department(self, department):
        # Script for running with the bug where we insert our own quarter code in the form
        # browser.execute_script(QUARTER_INSERT_SCRIPT.format(QUARTER))
        dept_select = Select(self.browser.find_element_by_id("selectedSubjects"))
        truncated_dept = department + (4 - len(department)) * " "
        WebDriverWait(self.browser, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "option[value='{}']".format(truncated_dept))))
        dept_select.select_by_value(truncated_dept)

        default_schedule_option1 = self.browser.find_element_by_id("schedOption11")
        default_schedule_option2 = self.browser.find_element_by_id("schedOption21")

        if default_schedule_option1.is_selected():
            default_schedule_option1.click()
        if default_schedule_option2.is_selected():
            default_schedule_option2.click()

        search_button = self.browser.find_element_by_id("socFacSubmit")
        search_button.click()

    def get_page(self, page_url):
        retries = 0
        while True:
            try:
                self.browser.get(page_url)
                return
            except TimeoutException as timeout_exception:
                retries += 1
                print("[T{0}] Failed to download page {1}.".format(self.thread_id, page_url))
                if retries < self.max_retries:
                    print("[T{0}] {1}/{2} attempts. Retrying ...".format(self.thread_id, retries, self.max_retries))
                else:
                    print("[T{0}] {1}/{2} attempts. All retries have been exhausted.".format(self.thread_id, retries,
                                                                                             self.max_retries))
                    raise timeout_exception

    def scrape_pages(self, department):
        # now I should be at the course pages
        current_page = 1
        base_url = self.browser.current_url

        # Use 100 for now because no course should have that much
        for i in range(100):
            try:
                if 'Apache' in self.browser.title:
                    return True
                page_ul = WebDriverWait(self.browser, DEPT_SEARCH_TIMEOUT).until(EC.presence_of_element_located
                                                                                 ((By.ID, 'socDisplayCVO')))
            except:
                return True

            if 'Apache' in self.browser.title or "No Result Found" in self.browser.page_source:
                return True

            html = self.browser.page_source
            self.save_page(department, html, current_page)

            current_page += 1
            current_url = base_url + "?page={}".format(current_page)
            self.get_page(current_url)

    # Attempts to store the given page contents into a file in our cache
    def save_page(self, department, page_contents, num_page):
        # Create department folder if it doesn't exist
        department_path = os.path.join(COURSES_HTML_PATH, department)
        if not os.path.exists(department_path):
            os.makedirs(department_path)
        file_path = os.path.join(department_path, str(num_page) + '.html')
        log_msg = '[T{0}] Saving {1} (#{2}) to {3}'.format(self.thread_id, department, num_page, file_path)
        writer.write(file_path, page_contents, log_msg)


class CourseScraper:
    def __init__(self):
        # Connecting to the database for the list of departments
        os.makedirs(DATABASE_FOLDER_PATH, exist_ok=True)
        self.database = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.database.cursor()
        self.cursor.execute("SELECT DEPT_CODE FROM DEPARTMENT")

        self.department_queue = queue.Queue()
        # fetching the data returns a tuple with one element,
        # so using list comprehension to convert the data
        self.departments = [i[0] for i in self.cursor.fetchall()]
        for department in self.departments:
            self.department_queue.put(department)

        # Recreate top level folder
        if os.path.exists(COURSES_HTML_PATH):
            shutil.rmtree(COURSES_HTML_PATH)
        os.makedirs(COURSES_HTML_PATH)

    def scrape(self):
        pool = []
        pool_size = os.cpu_count()
        print("Initializing {} threads ...".format(pool_size))

        # Allocate a pool of threads; each worker handles an equal subset of the work
        for i in range(pool_size):
            thread = CourseScraperThread(thread_id=i, work_queue=self.department_queue)
            pool.append(thread)
            thread.start()

        # Block the main thread until each worker finishes
        for thread in pool:
            thread.join()
