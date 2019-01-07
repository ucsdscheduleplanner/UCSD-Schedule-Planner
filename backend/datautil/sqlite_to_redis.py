import configparser
import os
import sqlite3
import redis
from settings import DATABASE_PATH

config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "..", "config", "config.example.ini"))
password = config["DB"]["PASSWORD"]
redis_endpoint = config["DB"]["REDIS_ENDPOINT"]

def export_to_redis():
    print("Beginning export to Redis")

    # Will connect to running Redis instance
    r = redis.Redis(
        host=redis_endpoint,
        decode_responses=True,
        password=password
    )

    # TODO: maybe delete docker volume is more efficient
    r.flushdb(asynchronous=True)

    # Will connect to sqlite db
    sqlite_db = sqlite3.connect(DATABASE_PATH)
    sqlite_db.row_factory = sqlite3.Row
    sqlite_cursor = sqlite_db.cursor()

    # Creating the class data table
    sqlite_cursor.execute("SELECT * FROM CLASS_DATA")
    class_rows = sqlite_cursor.fetchall()

    for sql_row in class_rows:
        row = dict(sql_row)

        # a lexicographically sorted set
        # COURSE_NUM_BY_DEPT:CSE => 3,4GS, 6GS...
        r.zadd('COURSE_NUM_BY_DEPT:' + row["DEPARTMENT"], {row["COURSE_NUM"]: 0})

        # write to :$n and incr :n
        # CLASS_DATA:CSE:20:n => 0
        # CLASS_DATA:CSE:20:0 => new data to write
        r_key = 'CLASS_DATA:' + row["DEPARTMENT"] + ':' + row["COURSE_NUM"] + ':'
        r.setnx(r_key+'n',0)
        r.watch(r_key+'n')
        r.hmset(r_key + str(r.get(r_key+'n')), 
                {'DEPARTMENT': row["DEPARTMENT"],
                'COURSE_NUM': row["COURSE_NUM"],
                'SECTION_ID': row["SECTION_ID"],
                'COURSE_ID': row["COURSE_ID"],
                'TYPE': row["TYPE"],
                'DAYS': row["DAYS"],
                'TIME': row["TIME"],
                'LOCATION': row["LOCATION"],
                'ROOM': row["ROOM"],
                'INSTRUCTOR': row["INSTRUCTOR"],
                'DESCRIPTION': row["DESCRIPTION"] })
        r.incr(r_key+'n')
        r.unwatch()

    """ 
    Making departments
    """
    sqlite_cursor.execute("SELECT * FROM DEPARTMENT")
    class_rows = sqlite_cursor.fetchall()

    p = r.pipeline()
    for sql_row in class_rows:
        row = dict(sql_row)
        p.zadd("DEPARTMENT", {row["DEPT_CODE"]: 0})
    p.execute()

    r.bgsave() # necessary?
    sqlite_db.close()

    print("Finishing export to Redis")
