import configparser
import os
import sqlite3
import MySQLdb as mysql
from settings import DATABASE_PATH

config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "..", "config", "config.example.ini"))
username = config["DB"]["USERNAME"]
password = config["DB"]["PASSWORD"]
endpoint = config["DB"]["ENDPOINT"]

def export_to_mysql():
    print("Beginning export to MySQL")
    # Will connect to running mysql instance
    mysql_db = mysql.connect(host=endpoint, user=username, passwd=password, db="classes")
    # Will connect to sqlite db
    sqlite_db = sqlite3.connect(DATABASE_PATH)
    sqlite_db.row_factory = sqlite3.Row

    mysql_cursor = mysql_db.cursor()
    sqlite_cursor = sqlite_db.cursor()

    # Creating the class data table
    mysql_cursor.execute("DROP TABLE IF EXISTS CLASS_DATA")
    mysql_cursor.execute("CREATE TABLE CLASS_DATA"
                         "(DEPARTMENT VARCHAR(255), COURSE_NUM VARCHAR(255), SECTION_ID TEXT, COURSE_ID TEXT,"
                         "TYPE TEXT, DAYS TEXT, TIME TEXT, LOCATION TEXT, ROOM TEXT, "
                         "INSTRUCTOR TEXT, DESCRIPTION TEXT)")

    sqlite_cursor.execute("SELECT * FROM CLASS_DATA")
    class_rows = sqlite_cursor.fetchall()

    for sql_row in class_rows:
        sql_str = """\
                          INSERT INTO CLASS_DATA(DEPARTMENT, COURSE_NUM, SECTION_ID, \
                          COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION)  \
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) \
                        """
        row = dict(sql_row)
        mysql_cursor.execute(sql_str,
                             (row["DEPARTMENT"],
                              row["COURSE_NUM"],
                              row["SECTION_ID"],
                              row["COURSE_ID"],
                              row["TYPE"],
                              row["DAYS"],
                              row["TIME"],
                              row["LOCATION"],
                              row["ROOM"],
                              row["INSTRUCTOR"],
                              row["DESCRIPTION"],
                              ))

    """ 
    Making departments
    """
    mysql_cursor.execute("DROP TABLE IF EXISTS DEPARTMENT")
    mysql_cursor.execute('CREATE TABLE DEPARTMENT (DEPT_CODE TEXT)')

    sqlite_cursor.execute("SELECT * FROM DEPARTMENT")
    class_rows = sqlite_cursor.fetchall()

    for sql_row in class_rows:
        sql_str = """\
                          INSERT INTO DEPARTMENT(DEPT_CODE) \
                          VALUES (%s) \
                        """
        row = dict(sql_row)
        mysql_cursor.execute(sql_str, (row["DEPT_CODE"],))

    # adding indexes
    index_str = "ALTER TABLE `CLASS_DATA` ADD INDEX (`DEPARTMENT`, `COURSE_NUM`)"
    mysql_cursor.execute(index_str)

    # adding changes
    mysql_db.commit()

    sqlite_db.close()
    mysql_db.close()

    print("Finishing export to MySQL")
