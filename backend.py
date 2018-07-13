import os

import MySQLdb.cursors
from sqlalchemy import create_engine, text

from secrets import password, aws_username, aws_endpoint
from settings import HOME_DIR

"""
Picks classes and autogenerates schedules. The main computation backend for the server.
"""  # Initializing database

os.chdir(HOME_DIR)
cursor = create_engine('mysql+mysqldb://root:{}@localhost/classes'.format(password), pool_pre_ping=True, pool_recycle=3600)
#cursor = create_engine('mysql+mysqldb://{}:{}@{}/classes'.format(aws_username, password, aws_endpoint),
#                     pool_recycle=3600)

departments = []
class_types = []


def get_all_classes_in(department):
    # Must order this one separately because doing it lexically won't work
    ret_dict = {}
    sql = text("SELECT * FROM CLASS_DATA WHERE DEPARTMENT = :department")
    result = cursor.execute(sql, department=department).fetchall()
    # use dict here for fast lookup
    ret_dict["COURSE_NUMS"] = {}
    for row in result:
        row = dict(row)
        if row["COURSE_NUM"] not in ret_dict["COURSE_NUMS"]:
            ret_dict["COURSE_NUMS"][row["COURSE_NUM"]] = []
        ret_dict["COURSE_NUMS"][row["COURSE_NUM"]].append(row)
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
