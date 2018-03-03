import sqlite3

from settings import DATABASE_PATH


def get_types():
    db = sqlite3.connect(DATABASE_PATH)
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT TYPE FROM CLASSES")
    types = [(row[0],) for row in cursor]

    cursor.execute("DROP TABLE IF EXISTS CLASS_TYPES")
    cursor.execute("CREATE TABLE CLASS_TYPES(TYPE)")
    cursor.executemany("INSERT INTO CLASS_TYPES(TYPE) VALUES(?)", types)
    db.commit()

get_types()


