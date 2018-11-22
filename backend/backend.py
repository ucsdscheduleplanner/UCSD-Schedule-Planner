import configparser
from sqlalchemy import create_engine, text

# Setting up config
config = configparser.ConfigParser()
config.read("./config/config.example.ini")
password = config["DB"]["PASSWORD"]
username = config["DB"]["USERNAME"]
endpoint = config["DB"]["ENDPOINT"]

"""
Picks classes and autogenerates schedules. The main computation backend for the server.
"""

CONN_STRING = 'mysql+mysqldb://{}:{}@{}/classes'.format(username, password, endpoint)
print(CONN_STRING)
# Initializing database
cursor = create_engine(CONN_STRING,
                       pool_pre_ping=True,
                       pool_recycle=3600)

# Caching departments and class types
departments = []
class_types = []


def get_all_classes_in(department):
    # Must order this one separately because doing it lexically won't work
    ret_dict = {}
    sql = text(
        "SELECT DISTINCT COURSE_NUM, DEPARTMENT, "
        "INSTRUCTOR, TYPE, DESCRIPTION FROM CLASS_DATA WHERE DEPARTMENT = :department")
    result = cursor.execute(sql, department=department).fetchall()
    # use dict here for fast lookup
    ret_dict["CLASS_SUMMARY"] = {}
    for row in result:
        row = dict(row)
        if row["COURSE_NUM"] not in ret_dict["CLASS_SUMMARY"]:
            ret_dict["CLASS_SUMMARY"][row["COURSE_NUM"]] = []
        ret_dict["CLASS_SUMMARY"][row["COURSE_NUM"]].append(row)
    return ret_dict


def get_departments():
    global departments
    if not departments:
        sql = text("SELECT DISTINCT DEPT_CODE FROM DEPARTMENT ORDER BY DEPT_CODE")
        result = cursor.execute(sql).fetchall()
        # Converting to dict in order to make into JSON easier
        departments = [dict(row) for row in result]
    return departments


def generate_class_json(department, course_num):
    """
    Generates a set of classes of the same version and ID.
    For example returns all the CSE 20 classes given that ID.
    :param course_num: the course number
    :param department: the department
    :return: returns all the classes with the same ID in a list
    """
    sql = text("SELECT * FROM CLASS_DATA WHERE DEPARTMENT = :department AND COURSE_NUM = :course_num")
    result = cursor.execute(sql, department=department, course_num=course_num).fetchall()
    class_versions = [dict(row) for row in result]
    # The different sections of the given class
    return class_versions
