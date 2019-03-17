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

    """
    CONNECT TO DATABASES 
    """

    # Will connect to running mysql instance
    mysql_db = mysql.connect(host=endpoint, user=username, passwd=password, db="classes")
    # Will connect to sqlite db
    sqlite_db = sqlite3.connect(DATABASE_PATH)
    sqlite_db.row_factory = sqlite3.Row

    mysql_cursor = mysql_db.cursor()
    sqlite_cursor = sqlite_db.cursor()

    """
    SQLITE CLASS_DATA TO MYSQL CLASS_DATA
    """

    # Creating the class data table
    mysql_cursor.execute("DROP TABLE IF EXISTS CLASS_DATA")
    mysql_cursor.execute("CREATE TABLE CLASS_DATA"
                         "(DEPARTMENT VARCHAR(255), COURSE_NUM VARCHAR(255), SECTION_ID TEXT, COURSE_ID TEXT, "
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
    SQLITE CAPES_DATA TO MYSQL CAPES_DATA 
    """

    mysql_cursor.execute("DROP TABLE IF EXISTS CAPES_DATA")
    mysql_cursor.execute("CREATE TABLE CAPES_DATA"
                        "(DEPARTMENT VARCHAR(255), COURSE_NUM VARCHAR(255), INSTRUCTOR TEXT, "
                        "TERM TEXT, ENROLLMENT TEXT, EVALUATIONS TEXT, PERCENT_RECOMMEND_CLASS TEXT, "
                        "PERCENT_RECOMMEND_INSTRUCTOR TEXT, HOURS_PER_WEEK TEXT, EXPECTED_GPA TEXT, "
                        "RECEIVED_GPA TEXT)")

    sqlite_cursor.execute("SELECT * FROM CAPES_DATA")
    capes_rows = sqlite_cursor.fetchall()

    sql_columns = ["DEPARTMENT", "COURSE_NUM", "INSTRUCTOR", "TERM", "ENROLLMENT", "EVALUATIONS",
                    "PERCENT_RECOMMEND_CLASS", "PERCENT_RECOMMEND_INSTRUCTOR", "HOURS_PER_WEEK",
                    "EXPECTED_GPA", "RECEIVED_GPA"]
    column_names = ', '.join(sql_columns)
    column_blanks = ', '.join(['%s' for _ in range(len(sql_columns))])

    for sql_row in capes_rows:
        sql_str = "INSERT INTO CAPES_DATA({}) VALUES ({})".format(column_names, column_blanks)
        row = dict(sql_row)
        row_values = (row[cn] for cn in sql_columns)
        mysql_cursor.execute(sql_str, row_values)

    """ 
    SQLITE DEPARTMENT TO MYSQL DEPARTMENT 
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

    class_index_str = "ALTER TABLE `CLASS_DATA` ADD INDEX (`DEPARTMENT`, `COURSE_NUM`)"
    mysql_cursor.execute(class_index_str)

    capes_index_str = "ALTER TABLE `CAPES_DATA` ADD INDEX (`DEPARTMENT`, `COURSE_NUM`)"
    mysql_cursor.execute(capes_index_str)

    """
    CLOSE DATABASES
    """

    # adding changes
    mysql_db.commit()

    sqlite_db.close()
    mysql_db.close()

    print("Finishing export to MySQL")
