import os
import shutil
import sqlite3
import sys
import traceback
from threading import Thread, Lock

import requests
from requests.exceptions import Timeout

from settings import CAPES_URL, CAPES_HTML_PATH
from settings import DATABASE_PATH, MAX_RETRIES

CAPES_HOST = 'cape.ucsd.edu'
CAPES_ACCEPT = 'html'
CAPES_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36'

class CAPESScraper:

    def __init__(self):
        # Read all departments from the SQL database
        self.database = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.database.cursor()
        self.cursor.execute("SELECT DEPT_CODE FROM DEPARTMENT")

        # fetching the data returns a tuple with one element,
        # so using list comprehension to convert the data
        self.departments = [i[0] for i in self.cursor.fetchall()]

        # Boolean to signal that a thread has crashed
        self.mutex = Lock()
        self.crashed = False

        # Create top level folder if it doesn't exist
        if os.path.exists(CAPES_HTML_PATH):
            shutil.rmtree(CAPES_HTML_PATH)
        os.makedirs(CAPES_HTML_PATH)

    # Thread-safe way of marking that at least one thread has crashed
    def set_crashed(self):
        self.mutex.acquire()
        try:
            self.crashed = True
        finally:
            self.mutex.release()

    # Thread-safe way of checking if the program has crashed
    def has_crashed(self):
        local_crashed = False
        self.mutex.acquire()
        try:
            local_crashed = self.crashed
        finally:
            self.mutex.release()
        return local_crashed

    def scrape(self):
        print('Beginning CAPES scraping.')
        self.iter_departments()
        print('Finished CAPES scraping.')

    def iter_departments(self):
        # Number of threads is equivalent to the number of processors on the machine
        pool = []
        pool_size = os.cpu_count()
        print("Initializing {} threads ...".format(pool_size))

        # Allocate a pool of threads; each worker handles an equal subset of the work
        for i in range(pool_size):
            t = Thread(target=self.iter_departments_by_thread_handle_errors, args=[i, pool_size])
            t.start()
            pool.append(t)

        # Block the main thread until each worker finishes
        for t in pool:
            t.join()

    def iter_departments_by_thread_handle_errors(self, thread_id, num_threads):
        # If a thread receives an error during execution, kill all threads & mark program as crashed
        try:
            self.iter_departments_by_thread(thread_id, num_threads)
        except:
            print("Error encountered by thread {}. Gracefully exiting ...".format(thread_id), file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            self.set_crashed()

    def iter_departments_by_thread(self, thread_id, num_threads):
        print("Thread {} is starting.".format(thread_id))

        # Iterate through each department that the thread is assigned to
        for counter in range(thread_id, len(self.departments), num_threads):
            # Exit if any part of the scraper has crashed
            if self.has_crashed():
                print("Thread {} is exiting gracefully ...".format(thread_id), file=sys.stderr)
                return

            department = self.departments[counter]

            # Construct the CAPES url for all courses in that department
            url = CAPES_URL + department
            url = url.rstrip()

            # Make a request to the specific CAPES url
            response = self.get_page_with_retries(url, thread_id)

            # Store the requested HTML in the cache
            self.store_page(department, response.text, thread_id)

        print("Thread {} has finished the work assigned to it.".format(thread_id))

    # Tries getting the given page {max_retries} number of times before quitting
    def get_page_with_retries(self, page_url, thread_id):
        retries = 0
        max_retries = MAX_RETRIES
        while True:
            try:
                response = requests.get(page_url, headers={
                    'Host': CAPES_HOST,
                    'Accept': CAPES_ACCEPT,
                    'User-Agent': CAPES_USER_AGENT
                })
                return response
            except Timeout as timeout_exception:
                retries += 1
                print ("[T{0}] Failed to download page {1}.".format(thread_id, page_url))
                if retries < max_retries:
                    print ("[T{0}] {1}/{2} attempts. Retrying ...".format(thread_id, retries, max_retries))
                else:
                    print ("[T{0}] {1}/{2} attempts. All retries have been exhausted.".format(thread_id, retries, max_retries))
                    raise timeout_exception

    # Tries to store the given page contents into a file in our cache
    def store_page(self, department, page_contents, thread_id):
        # Cache page content appropriately
        with open(os.path.join(CAPES_HTML_PATH, department + '.html'), 'w') as f:
            f.write(page_contents)
            print('[T{0}] Saving'.format(thread_id), department, 'to', f.name, '...')
