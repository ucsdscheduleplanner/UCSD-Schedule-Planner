from datautil.data_cleaner import Cleaner
from datautil.data_parser import Parser
from datautil.sqlite_to_mysql import export_to_mysql
from scraper.departmentscraper import DepartmentScraper
from scraper.scraper import Scraper

ds = DepartmentScraper()
ds.scrape()

sc = Scraper()
sc.scrape()

parser = Parser()
parser.parse()

cleaner = Cleaner()
cleaner.clean()

export_to_mysql()
