import os
import sqlite3
import requests

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait

from settings import HTML_STORAGE, HOME_DIR, MANUAL_MODE, \
    DATABASE_PATH, DRIVER_PATH, SCHEDULE_OF_CLASSES, TIMEOUT, CURRENT_CLASS_INDEX, CLASS_SEARCH_TIMEOUT


class Scraper:
    def __init__(self, username=None, password=None):
        # Keeping track of HTML directory
        self.dir_path = HTML_STORAGE
        self.login_url = SCHEDULE_OF_CLASSES

        # Connecting to the database for the list of departments
        self.database = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.database.cursor()
        self.cursor.execute("SELECT DEPT_CODE FROM DEPARTMENT")
        # fetching the data returns a tuple with one element,
        # so using list comprehension to convert the data
        self.departments = [i[0] for i in self.cursor.fetchall()]

        # Directing Python to browser to chrome executable file
        self.browser = webdriver.Chrome(executable_path=DRIVER_PATH)
        self.browser.set_page_load_timeout(TIMEOUT)
        self.browser.get(self.login_url)

        os.chdir(HOME_DIR)

    def scrape(self):
        self.iter_departments()

    def iter_departments(self):
        for department in self.departments:
            self.browser.get(self.login_url)
            WebDriverWait(self.browser, TIMEOUT).until(EC.presence_of_element_located
                                                       ((By.ID, 'selectedSubjects')))

            select = Select(self.browser.find_element_by_id("selectedSubjects"))

            adj_dept = department + (4 - len(department)) * " "

            WebDriverWait(self.browser, TIMEOUT).until(EC.presence_of_element_located
                                                       ((By.CSS_SELECTOR, "option[value='{}']".format(adj_dept))))
            select.select_by_value(adj_dept)

            default_schedule_option1 = self.browser.find_element_by_id("schedOption11")
            default_schedule_option2 = self.browser.find_element_by_id("schedOption21")

            if default_schedule_option1.is_selected():
                default_schedule_option1.click()
            if default_schedule_option2.is_selected():
                default_schedule_option2.click()

            search_button = self.browser.find_element_by_id("socFacSubmit")
            search_button.click()

            self.iter_pages(department)

    def iter_pages(self, department):
        # now I should be at the course pages
        current_page = 1
        base_url = self.browser.current_url

        while True:
            try:
                page_ul = WebDriverWait(self.browser, TIMEOUT).until(EC.presence_of_element_located
                                                                     ((By.ID, 'socDisplayCVO')))
            except:
                return
            html = self.browser.page_source
            self.store_page(department, html, current_page)
            current_page += 1
            current_url = base_url + "?page={}".format(current_page)
            self.browser.get(current_url)
            if 'Apache' in self.browser.title:
                return

    def store_page(self, department, page_contents, num_page):
        if not os.path.exists(self.dir_path):
            os.makedirs(self.dir_path)
        department_path = os.path.join(self.dir_path, department)
        if not os.path.exists(department_path):
            os.makedirs(department_path)

        file = open(os.path.join(department_path, str(num_page) + '.html'), 'w')
        file.write(page_contents)
        print(file.name)
        file.close()


sc = Scraper()
sc.scrape()
