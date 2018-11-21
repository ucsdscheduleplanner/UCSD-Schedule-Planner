import os
import sqlite3

import requests

from settings import DATABASE_PATH, CAPES, CAPES_STORAGE, HOME_DIR


class CAPEScraper:

    def __init__(self):
        self.dir_path = CAPES_STORAGE
        self.start_url = CAPES

        self.database = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.database.cursor()
        self.cursor.execute("SELECT DEPT_CODE FROM DEPARTMENT")
        # fetching the data returns a tuple with one element,
        # so using list comprehension to convert the data
        self.departments = [i[0] for i in self.cursor.fetchall()]

        os.chdir(HOME_DIR)

    def scrape(self):
        self.iter_departments()

    def iter_departments(self):
        for department in self.departments:
            url = self.start_url + department
            url = url.rstrip()
            response = requests.get(url, headers={'Host': 'cape.ucsd.edu',
                                                  'Accept': 'html',
                                                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36'})
            self.store_page(department, response.text)

    def store_page(self, department, page_contents):
        if not os.path.exists(self.dir_path):
            os.makedirs(self.dir_path)

        file = open(os.path.join(self.dir_path, department + '.html'), 'w')
        file.write(page_contents)
        print(file.name)
        file.close()


CAPEScraper().scrape()
