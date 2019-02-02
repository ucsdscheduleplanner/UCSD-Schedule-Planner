from scraper.department_scraper import DepartmentScraper
from scraper.capes_scraper import CAPESScraper 
from scraper.course_scraper import CourseScraper

from datautil.capes_parser import CAPESParser
from datautil.data_parser import CourseParser
from datautil.data_cleaner import Cleaner
from datautil.sqlite_to_mysql import export_to_mysql

import sys
import time
import pprint

def main():
    execution_times = {}

    timestamp = time.time() 
    department_scraper = DepartmentScraper()
    department_scraper.scrape()
    execution_times['Department Scraping'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    timestamp = time.time() 
    capes_scraper = CAPESScraper()
    capes_scraper.scrape()
    execution_times['CAPES Scraping'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    if capes_scraper.crashed:
        print("The CAPES scraper has crashed. Please retry.", file=sys.stderr)
        sys.exit(1)
    
    timestamp = time.time() 
    course_scraper = CourseScraper() 
    course_scraper.scrape()
    execution_times['Course Scraping'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    if course_scraper.crashed:
        print("The course scraper has crashed. Please retry.", file=sys.stderr)
        sys.exit(1)

    timestamp = time.time() 
    parser = CAPESParser()
    parser.parse()
    execution_times['CAPES Parsing'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    timestamp = time.time() 
    parser = CourseParser()
    parser.parse()
    execution_times['Course Parsing'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    timestamp = time.time() 
    cleaner = Cleaner()
    cleaner.clean()
    execution_times['Cleaning'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    timestamp = time.time() 
    export_to_mysql()
    execution_times['MySQL Exporting'] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60) 

    pprint.pprint(execution_times)

if __name__ == "__main__":
    main()
