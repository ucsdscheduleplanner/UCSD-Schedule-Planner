import configparser
import os
import sqlite3
import pymongo
import urllib.parse
from settings import DATABASE_PATH

config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "..", "config", "config.example.ini"))
username = urllib.parse.quote_plus(config["DB"]["USERNAME"])
password = urllib.parse.quote_plus(config["DB"]["PASSWORD"])
mongo_endpoint = urllib.parse.quote_plus(config["DB"]["MONGODB_ENDPOINT"])

def export_to_mongodb():
    print("Beginning export to MongoDB")
    # Will connect to running mongodb instance
    mongo_client = pymongo.MongoClient('mongodb://%s:%s@%s' % (username, password, mongo_endpoint))
    mongo_db = mongo_client["classes"]
    # Will connect to sqlite db
    sqlite_db = sqlite3.connect(DATABASE_PATH)
    sqlite_db.row_factory = sqlite3.Row

    sqlite_cursor = sqlite_db.cursor()

    # Creating the class data collection
    mongo_db.drop_collection("CLASS_DATA")
    coll_class_data = mongo_db["CLASS_DATA"]

    sqlite_cursor.execute("SELECT * FROM CLASS_DATA")
    class_rows = sqlite_cursor.fetchall()

    for sql_row in class_rows:
        row = dict(sql_row)
        coll_class_data.insert_one({"DEPARTMENT": row["DEPARTMENT"],
                                    "COURSE_NUM": row["COURSE_NUM"],
                                    "SECTION_ID": row["SECTION_ID"],
                                    "COURSE_ID": row["COURSE_ID"],
                                    "TYPE": row["TYPE"],
                                    "DAYS": row["DAYS"],
                                    "TIME": row["TIME"],
                                    "LOCATION": row["LOCATION"],
                                    "ROOM": row["ROOM"],
                                    "INSTRUCTOR": row["INSTRUCTOR"],
                                    "DESCRIPTION": row["DESCRIPTION"],
                                    })

    """ 
    Making departments
    """
    mongo_db.drop_collection("DEPARTMENT")
    coll_department = mongo_db["DEPARTMENT"]

    sqlite_cursor.execute("SELECT * FROM DEPARTMENT")
    class_rows = sqlite_cursor.fetchall()

    for sql_row in class_rows:
        row = dict(sql_row)
        coll_department.insert_one({"DEPT_CODE": row["DEPT_CODE"]})

    # adding indexes
    coll_class_data.create_index([("DEPARTMENT", pymongo.ASCENDING), ("COURSE_NUM", pymongo.ASCENDING)])

    # adding changes
    # mysql_db.commit()

    sqlite_db.close()
    mongo_client.close()

    print("Finishing export to MongoDB")
