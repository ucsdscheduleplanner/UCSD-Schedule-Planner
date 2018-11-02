from datautil.data_cleaner import Cleaner
from datautil.data_parser import Parser
from scraper.scraper import Scraper

sc = Scraper()
sc.scrape()

parser = Parser()
parser.parse()

cleaner = Cleaner()
cleaner.clean()