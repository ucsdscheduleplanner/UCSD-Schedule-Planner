import configparser
import os

import pymongo

# Setting up config
config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "config", "config.example.ini"))
password = config["DB"]["PASSWORD"]
username = config["DB"]["USERNAME"]
mongo_endpoint = config["DB"]["MONGODB_ENDPOINT"]

"""
Picks classes and autogenerates schedules. The main computation backend for the server.
"""

mongo_client = pymongo.MongoClient('mongodb://%s:%s@%s' % (username, password, mongo_endpoint))
mongo_db = mongo_client["classes"]

# Caching departments and class types
departments = []
class_types = []

def get_all_classes_in(department):
    # Must order this one separately because doing it lexically won't work
    ret_dict = {}
    result = mongo_db["CLASS_DATA"].aggregate( [
        { "$match" : { "DEPARTMENT" : department } },
        { "$group" : { "_id": { "COURSE_NUM": "$COURSE_NUM",
                                "DEPARTMENT": "$DEPARTMENT",
                                "INSTRUCTOR": "$INSTRUCTOR",
                                "TYPE": "$TYPE",
                                "DESCRIPTION": "$DESCRIPTION" }}},
        { "$project" : {"_id" : 0, 
                        "COURSE_NUM": "$_id.COURSE_NUM",
                        "DEPARTMENT": "$_id.DEPARTMENT",
                        "INSTRUCTOR": "$_id.INSTRUCTOR",
                        "TYPE": "$_id.TYPE",
                        "DESCRIPTION": "$_id.DESCRIPTION"  }},
    ] )
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
        result = mongo_db["DEPARTMENT"].aggregate( [
            { "$group" : { "_id" : "$DEPT_CODE" }},
            { "$project" : { "_id" : 0 , "DEPT_CODE" : "$_id" } },
            { "$sort" : { "DEPT_CODE" : 1 } }
        ] )
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
    result = mongo_db["CLASS_DATA"].aggregate( [
        { "$match" : { "$and" : [ {"DEPARTMENT" : department}, {"COURSE_NUM" : course_num} ] } },
        { "$project" : { "_id" : 0 } },
        { "$sort" : { "DEPT_CODE" : 1 } }
    ] )
    class_versions = [dict(row) for row in result]
    # The different sections of the given class
    return class_versions