import sqlite3

import MySQLdb as mysql

from settings import DATABASE_PATH, QUARTERS_TO_SCRAPE, CONFIG

username = CONFIG["DB"]["USERNAME"]
password = CONFIG["DB"]["PASSWORD"]
endpoint = CONFIG["DB"]["ENDPOINT"]
database_name = CONFIG["DB"]["DB_NAME"]


def export_to_mysql():
    print("Beginning export to MySQL")

    """
    CONNECT TO DATABASES 
    """

    print("Creating database {} if it doesn't exist".format(database_name))
    # Will connect to running mysql instance and create the database - have to reconnect after creating
    mysql_db = mysql.connect(host=endpoint, user=username, passwd=password)
    mysql_db.cursor().execute("CREATE DATABASE IF NOT EXISTS {}".format(database_name))
    mysql_db.close()
    print("Connecting to mysql...")
    mysql_db = mysql.connect(host=endpoint, user=username, passwd=password, db=database_name)
    mysql_cursor = mysql_db.cursor()

    print("Connecting to sqlite...")
    mysql_db = mysql.connect(host=endpoint, user=username, passwd=password, db=database_name)
    # Will connect to sqlite db
    sqlite_db = sqlite3.connect(DATABASE_PATH)
    sqlite_db.row_factory = sqlite3.Row
    sqlite_cursor = sqlite_db.cursor()

    print("Creating quarters table if it doesn't exist...")
    mysql_cursor.execute("DROP TABLE IF EXISTS {}".format("QUARTERS"))
    mysql_cursor.execute("CREATE TABLE {}(QUARTERS VARCHAR(40))".format("QUARTERS"))
    for quarter in QUARTERS_TO_SCRAPE:
        quarter_sql_str = """\
                          INSERT INTO {}(QUARTERS) \
                          VALUES (%s) \
                        """.format("QUARTERS")
        mysql_cursor.execute(quarter_sql_str, (quarter,))

    """
    SQLITE CLASS_DATA TO MYSQL CLASS_DATA
    """

    print("Transferring data from sqlite to mysql...")
    for quarter in QUARTERS_TO_SCRAPE:
        print("Creating table {} if it doesn't exist...".format(quarter))

        # Creating the class data table
        mysql_cursor.execute("DROP TABLE IF EXISTS {}".format(quarter))
        mysql_cursor.execute("CREATE TABLE {}"
                             "(DEPARTMENT VARCHAR(255), COURSE_NUM VARCHAR(255), SECTION_ID TEXT, COURSE_ID TEXT, "
                             "SECTION_TYPE TEXT, DAYS TEXT, TIME TEXT, LOCATION TEXT, ROOM TEXT, "
                             "INSTRUCTOR TEXT, DESCRIPTION TEXT, UNITS TEXT)".format(quarter))

        class_index_str = "ALTER TABLE `{}` ADD INDEX (DEPARTMENT(15), COURSE_NUM(150))".format(quarter)
        mysql_cursor.execute(class_index_str)

        sqlite_cursor.execute("SELECT * FROM {}".format(quarter))
        class_rows = sqlite_cursor.fetchall()

        sql_str = """INSERT INTO {}(DEPARTMENT, COURSE_NUM, SECTION_ID, \
                    COURSE_ID, SECTION_TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION, UNITS)  \
                    VALUES (:DEPARTMENT, :COURSE_NUM, :SECTION_ID, :COURSE_ID, :SECTION_TYPE, :DAYS, :TIME,
                    :LOCATION, :ROOM, :INSTRUCTOR, :DESCRIPTION, :UNITS) """.format(quarter)
        for sql_row in class_rows:
            row = dict(sql_row)
            mysql_cursor.execute(sql_str, row)
    # """
    # SQLITE CAPES_DATA TO MYSQL CAPES_DATA
    # """
    #
    # mysql_cursor.execute("DROP TABLE IF EXISTS CAPES_DATA")
    # mysql_cursor.execute("CREATE TABLE CAPES_DATA"
    #                      "(DEPARTMENT VARCHAR(255), COURSE_NUM VARCHAR(255), INSTRUCTOR TEXT, "
    #                      "TERM TEXT, ENROLLMENT TEXT, EVALUATIONS TEXT, PERCENT_RECOMMEND_CLASS TEXT, "
    #                      "PERCENT_RECOMMEND_INSTRUCTOR TEXT, HOURS_PER_WEEK TEXT, EXPECTED_GPA TEXT, "
    #                      "RECEIVED_GPA TEXT)")
    #
    # sqlite_cursor.execute("SELECT * FROM CAPES_DATA")
    # capes_rows = sqlite_cursor.fetchall()
    #
    # sql_columns = ["DEPARTMENT", "COURSE_NUM", "INSTRUCTOR", "TERM", "ENROLLMENT", "EVALUATIONS",
    #                "PERCENT_RECOMMEND_CLASS", "PERCENT_RECOMMEND_INSTRUCTOR", "HOURS_PER_WEEK",
    #                "EXPECTED_GPA", "RECEIVED_GPA"]
    # column_names = ', '.join(sql_columns)
    # column_blanks = ', '.join(['%s' for _ in range(len(sql_columns))])
    #
    # for sql_row in capes_rows:
    #     sql_str = "INSERT INTO CAPES_DATA({}) VALUES ({})".format(column_names, column_blanks)
    #     row = dict(sql_row)
    #     row_values = (row[cn] for cn in sql_columns)
    #     mysql_cursor.execute(sql_str, row_values)

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

    #capes_index_str = "ALTER TABLE `CAPES_DATA` ADD INDEX (DEPARTMENT(15), COURSE_NUM(150))"
    #mysql_cursor.execute(capes_index_str)

    """
    CLOSE DATABASES
    """

    # adding changes
    mysql_db.commit()

    print("Closing connections")

    sqlite_db.close()
    mysql_db.close()

    print("Finishing export to MySQL")


if __name__ == "__main__":
    export_to_mysql()
