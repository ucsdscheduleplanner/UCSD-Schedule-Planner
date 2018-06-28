import os
import MySQLdb
import MySQLdb.cursors

from classutil.classutils import *
from secrets import password, aws_endpoint, aws_username
from settings import DATABASE_PATH, HOME_DIR

"""
Picks classes and autogenerates schedules. The main computation backend for the server.
"""  # Initializing database

os.chdir(HOME_DIR)
database = MySQLdb.connect(passwd=password, db="classes", user="root", cursorclass=MySQLdb.cursors.DictCursor)
# database = MySQLdb.connect(host=aws_endpoint, passwd=password, db="classes", user=aws_username, cursorclass=MySQLdb.cursors.DictCursor)
cursor = database.cursor()

departments = []
class_types = []


def get_all_classes_in(department):
    # Must order this one separately because doing it lexically won't work
    ret_dict = {}
    cursor.execute("SELECT * FROM CLASS_DATA WHERE DEPARTMENT = %s", (department,))
    # use dict here for fast lookup
    ret_dict["COURSE_NUMS"] = {}
    rows = cursor.fetchall()
    for row in rows:
        row = dict(row)
        if row["COURSE_NUM"] not in ret_dict["COURSE_NUMS"]:
            ret_dict["COURSE_NUMS"][row["COURSE_NUM"]] = []
        ret_dict["COURSE_NUMS"][row["COURSE_NUM"]].append(row)
    return ret_dict


def get_departments():
    global departments
    if not departments:
        cursor.execute("SELECT DISTINCT DEPT_CODE FROM DEPARTMENT ORDER BY DEPT_CODE")
        # Converting to dict in order to make into JSON easier
        departments = [dict(row) for row in cursor.fetchall()]
    return departments


def generate_class_json(department, course_num):
    """
    Generates a set of classes of the same version and ID.
    For example returns all the CSE 20 classes given that ID.
    :param course_num: the course number
    :param department: the department
    :return: returns all the classes with the same ID in a list
    """
    cursor.execute("SELECT * FROM CLASS_DATA WHERE DEPARTMENT = %s AND COURSE_NUM = %s", (department, course_num))
    # The different sections of the given class
    class_versions = cursor.fetchall()
    return class_versions
