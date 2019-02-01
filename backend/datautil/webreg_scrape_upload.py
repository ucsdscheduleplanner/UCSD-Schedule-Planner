from scraper.department_scraper import DepartmentScraper
from scraper.capes_scraper import CAPESScraper 
from scraper.course_scraper import CourseScraper

from datautil.data_cleaner import Cleaner
from datautil.data_parser import Parser
from datautil.sqlite_to_mysql import export_to_mysql

import sys

def main():
    department_scraper = DepartmentScraper()
    department_scraper.scrape()

    capes_scraper = CAPESScraper()
    capes_scraper.scrape()

    if capes_scraper.crashed:
        print("The CAPES scraper has crashed. Please retry.", file=sys.stderr)
        sys.exit(1)

    course_scraper = CourseScraper()
    course_scraper.scrape()

    if course_scraper.crashed:
        print("The course scraper has crashed. Please retry.", file=sys.stderr)
        sys.exit(1)

    parser = Parser()
    parser.parse()

    cleaner = Cleaner()
    cleaner.clean()

    export_to_mysql()

if __name__ == "__main__":
    main()
