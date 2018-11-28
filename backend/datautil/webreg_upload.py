from datautil.data_cleaner import Cleaner
from datautil.data_parser import Parser
from datautil.sqlite_to_mysql import export_to_mysql

parser = Parser()
parser.parse()

cleaner = Cleaner()
cleaner.clean()

export_to_mysql()
