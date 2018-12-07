from scraper.departmentscraper import DepartmentScraper
from scraper.scraper import Scraper
from datautil.data_cleaner import Cleaner
from datautil.data_parser import Parser
from datautil.sqlite_to_mysql import export_to_mysql

import sys

ds = DepartmentScraper()
ds.scrape()

sc = Scraper()
sc.scrape()

if sc.crashed:
    print("The scraper has crashed. Please retry.", file=sys.stderr)
    sys.exit(1)
else:
    parser = Parser()
    parser.parse()

    cleaner = Cleaner()
    cleaner.clean()

    export_to_mysql()
