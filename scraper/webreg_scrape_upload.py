import pprint
import sys
import time

from scraper_impl.capes_scraper import CAPESScraper
from scraper_impl.course_scraper import CourseScraper
from scraper_impl.department_scraper import DepartmentScraper
from sd_cleaner.data_cleaner import Cleaner
from sd_parser.capes_parser import CAPESParser
from sd_parser.data_parser import CourseParser
from transformer.sqlite_to_mysql import export_to_mysql


def main():
    execution_times = {}

    def record_execution_time(subroutine, label):
        timestamp = time.time()
        subroutine()
        execution_times[label] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)

    department_scraper = DepartmentScraper()
    record_execution_time(department_scraper.scrape, 'Department Scraping')

    course_scraper = CourseScraper()
    record_execution_time(course_scraper.scrape, 'Course Scraping')

    capes_scraper = CAPESScraper()
    record_execution_time(capes_scraper.scrape, 'CAPES Scraping')

    if capes_scraper.crashed:
        print("The CAPES scraper has crashed. Please retry.", file=sys.stderr)
        sys.exit(1)

    parser = CourseParser()
    record_execution_time(parser.parse, 'Course Parsing')

    cleaner = Cleaner()
    record_execution_time(cleaner.clean, 'Cleaning')

    parser = CAPESParser()
    record_execution_time(parser.parse, 'CAPES Parsing')

    record_execution_time(export_to_mysql, 'MySQL Exporting')

    pprint.pprint(execution_times)


if __name__ == "__main__":
    main()
