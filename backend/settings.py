import os
import sys

"""
This class is a storage area for various variables and settings.
"""

"""
PATHS
"""

# Where the directory is placed
HOME_DIR = os.path.dirname(os.path.abspath(__file__))
# Database directory
DATABASE_PATH = os.path.join(HOME_DIR, 'database', 'data.db')
# Image directory
IMAGE_DIR = os.path.join(HOME_DIR, 'images')

# Where the classes are stored
HTML_STORAGE = os.path.join(HOME_DIR, 'courseNums')
# Where capes stored
CAPES_STORAGE = os.path.join(HOME_DIR, 'capes')

# LINUX_DRIVER_PATH = os.path.join(HOME_DIR, 'driver', 'chromedriver_linux')
# MAC_DRIVER_PATH = os.path.join(HOME_DIR, 'driver', 'chromedriver_mac')
# WIN_DRIVER_PATH = os.path.join(HOME_DIR, 'driver', 'chromedriver')
# PHANTOMJS_MAC_DRIVER_PATH = os.path.join(HOME_DIR, 'driver', 'phantomjs_mac')

# if sys.platform == "linux" or sys.platform == "linux2":
#     DRIVER_PATH = LINUX_DRIVER_PATH
# elif sys.platform == "darwin":
#     DRIVER_PATH = MAC_DRIVER_PATH
# elif sys.platform == "win32" or sys.platform == "cygwin":
#     DRIVER_PATH = WIN_DRIVER_PATH
# else:
#     print("Missing Chrome webdriver for {0}.".format(sys.platform))
#     sys.exit(1)

DRIVER_PATH = "/usr/local/bin/chromedriver"

"""
MODES
"""

# Manual mode for logging in
MANUAL_MODE = False

"""
URLS 
"""
# URLs
DEPARTMENT_URL = 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm'
SCHEDULE_OF_CLASSES = 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm'
CAPES = 'http://cape.ucsd.edu/responses/Results.aspx?CourseNumber='

"""
VARIABLES
"""
# Current quarter (in string)
QUARTER = "WI19"
# Time for timeout for browser
TIMEOUT = 30

# Time before class timeout
DEPT_SEARCH_TIMEOUT = 5

# Interval for days on graph
DAY_GRAPH_INTERVAL = .5

POPUP_TEXT_COLOR = (.4, .4, .4, 1)
