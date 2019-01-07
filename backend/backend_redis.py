import configparser
import os

import redis

# Setting up config
config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "config", "config.example.ini"))
password = config["DB"]["PASSWORD"]
redis_endpoint = config["DB"]["REDIS_ENDPOINT"]

"""
Picks classes and autogenerates schedules. The main computation backend for the server.
"""

r = redis.Redis(
        host=redis_endpoint,
        decode_responses=True,
        password=password
    )

# Caching departments and class types
departments = []
class_types = []

def get_all_classes_in(department):
    # Must order this one separately because doing it lexically won't work
    ret_dict = {}

    # 11, 12, 15L, etc.
    course_nums = r.zrange("COURSE_NUM_BY_DEPT:"+department,0,-1)

    # use dict here for fast lookup
    ret_dict["CLASS_SUMMARY"] = {}

    for num in course_nums:
        # only get :0 if exists
        if r.exists('CLASS_DATA:' + department + ':' + str(num) + ':0') != 1:
            raise ValueError("The key: \"CLASS_DATA:" + department + ":" + str(num) + ":0\" does not exist")
        course = r.hgetall('CLASS_DATA:' + department + ':' + num + ':0')

        # either delete by pop('key', None) or create a new dict, the later one is chosen
        # since more readable
        row = {"COURSE_NUM"  : course["COURSE_NUM"], 
               "DEPARTMENT"  : course["DEPARTMENT"],
               "INSTRUCTOR"  : course["INSTRUCTOR"],
               "TYPE"        : course["TYPE"],
               "DESCRIPTION" : course["DESCRIPTION"]}
        if row["COURSE_NUM"] not in ret_dict["CLASS_SUMMARY"]:
            ret_dict["CLASS_SUMMARY"][row["COURSE_NUM"]] = []
        ret_dict["CLASS_SUMMARY"][row["COURSE_NUM"]].append(row)
    return ret_dict


def get_departments():
    global departments
    if not departments:
        dept_codes = r.zrange("DEPARTMENT",0,-1)
        # Converting to dict in order to make into JSON easier
        departments = [dict(zip("DEPT_CODE",dept_code)) for dept_code in dept_codes]
    return departments


def generate_class_json(department, course_num):
    """
    Generates a set of classes of the same version and ID.
    For example returns all the CSE 20 classes given that ID.
    :param course_num: the course number
    :param department: the department
    :return: returns all the classes with the same ID in a list
    """
    # how many sections are there
    class_sections = r.get('CLASS_DATA:' + department + ':' + course_num + ':n')
    class_versions = []
    for class_section in range(class_sections):
        class_versions.append(r.hgetall('CLASS_DATA:' + department + ':' + course_num + ':' + str(class_section)))
    # The different sections of the given class
    return class_versions
