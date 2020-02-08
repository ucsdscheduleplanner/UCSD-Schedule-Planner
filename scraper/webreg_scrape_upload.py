import pprint
import time
from functools import partial

from scraper_impl.course_scraper import CourseScraper
from scraper_impl.department_scraper import DepartmentScraper
from sd_cleaner.course_cleaner import Cleaner
from sd_parser.capes_parser import CAPESParser
from sd_parser.course_parser import CourseParser
from settings import QUARTERS_TO_SCRAPE
from transformer.sqlite_to_mysql import export_to_mysql


def main():
    execution_times = {}

    def record_execution_time(subroutine, label):
        timestamp = time.time()
        ret = subroutine()
        execution_times[label] = '{0:.3f} minutes'.format((time.time() - timestamp) / 60)
        return ret

    #department_scraper = DepartmentScraper()
    #record_execution_time(department_scraper.scrape, 'Department Scraping')

    #course_scraper = CourseScraper()
    #record_execution_time(course_scraper.scrape, 'Course Scraping {} '.format(QUARTERS_TO_SCRAPE))

    parser = CourseParser()
    parsed_data = record_execution_time(parser.parse, 'Course Parsing {}'.format(QUARTERS_TO_SCRAPE))

    cleaner = Cleaner()
    record_execution_time(partial(cleaner.clean, parsed_data), 'Cleaning')

    #record_execution_time(export_to_mysql, 'MySQL Exporting')

    pprint.pprint(execution_times)


if __name__ == "__main__":
    main()
