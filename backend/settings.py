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
DATABASE_FOLDER_PATH = "/cache/database"
DATABASE_PATH = os.path.join(DATABASE_FOLDER_PATH, "data.db")

# Image directory
IMAGE_DIR = os.path.join(HOME_DIR, 'images')

# Storage directories for cached HTML 
HTML_STORAGE = "/cache/course_pages"
CAPES_STORAGE = "/cache/capes_pages" 

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
CAPES_URL = 'http://cape.ucsd.edu/responses/Results.aspx?CourseNumber='

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

# Maximum number of times to make a request for the same page
MAX_RETRIES = 10
