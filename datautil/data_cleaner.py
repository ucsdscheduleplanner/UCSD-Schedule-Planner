import sqlite3
import time
from itertools import groupby, product

import itertools

from settings import DATABASE_PATH
from timeutil.timeutils import TimeIntervalCollection

"""
Convenience class for holding the keys to the CLASSES table representing
the subclasses in this specific class.
"""

subclassDBs = [
    "AC_KEY",
    "CL_KEY",
    "CO_KEY",
    "DI_KEY",
    "FI_KEY",
    "FM_KEY",
    "FW_KEY",
    "IN_KEY",
    "IT_KEY",
    "LA_KEY",
    "LE_KEY",
    "MI_KEY",
    "MU_KEY",
    "OT_KEY",
    "PB_KEY",
    "PR_KEY",
    "RE_KEY",
    "SE_KEY",
    "ST_KEY",
    "TU_KEY",
]


class ClassHolder:
    def __init__(self):
        """
        There is a class key for each type of class. That would be lectures, discussions,
        finals, etc. At the moment, we have to add a new key if we want to make
        adjustments to a new type.
        """
        self.course_num = None
        self.lab_key = None
        self.lecture_key = None
        self.discussion_key = None
        self.seminar_key = None
        self.final_key = None

    @staticmethod
    def get_type(row):
        for col in row:
            if col in ('LE', 'LA', 'DI', 'SE', 'FINAL'):
                return col
        return None

    """
    Returns if the class is cancelled.
    """

    @staticmethod
    def is_canceled(row):
        if 'cancelled' in row:
            return True
        return False

    """
    Returns if the class is a review session.
    """

    @staticmethod
    def is_review_session(row):
        if 'Review Sessions' in row:
            return True
        return False

    """
    The general strategy for the following methods is to look at the table and see if there are
    any column with the same COURSE_NUM but a null corresponding key.
         
    That means that for insert lecture, the code will look at the database for any rows with 
    the same COURSE_NUM but no lecture key. 
    
    Because of how the data is funneled in, there should be no cases where a lecture key corresponds
    to the right class but the wrong class section (Could still happen).
    
    If there is no corresponding COURSE_NUM row, then it will create a row.
    The only exception is the final, where an extra final is not enough to make a class by itself. 
    """

    @classmethod
    def insert_lecture(self, cursor, course_num, lecture_key):
        cursor.execute('SELECT COUNT(1) FROM DATA WHERE COURSE_NUM = ? AND LECTURE_KEY IS NULL', (course_num,))
        num = cursor.fetchone()
        if num[0] > 0:
            cursor.execute('UPDATE DATA SET LECTURE_KEY = ? WHERE COURSE_NUM = ? AND LECTURE_KEY IS NULL',
                           (lecture_key, course_num))
        else:
            cursor.execute('INSERT INTO DATA VALUES(?,?,?,?,?,?,?)',
                           (None, course_num, lecture_key, None, None, None, None))

    @staticmethod
    def insert_discussion(cursor, course_num, discussion_key):
        cursor.execute('SELECT COUNT(1) FROM DATA WHERE COURSE_NUM = ? AND DISCUSSION_KEY IS NULL', (course_num,))
        num = cursor.fetchone()
        if num[0] > 0:
            cursor.execute('UPDATE DATA SET DISCUSSION_KEY = ? WHERE COURSE_NUM = ? AND DISCUSSION_KEY IS NULL',
                           (discussion_key, course_num))
        else:
            cursor.execute('INSERT INTO DATA VALUES(?,?,?,?,?,?,?)',
                           (None, course_num, None, None, discussion_key, None, None))

    @staticmethod
    def insert_lab(cursor, course_num, lab_key):
        cursor.execute('SELECT COUNT(1) FROM DATA WHERE COURSE_NUM = ? AND LAB_KEY IS NULL', (course_num,))
        num = cursor.fetchone()
        if num[0] > 0:
            cursor.execute('UPDATE DATA SET LAB_KEY = ? WHERE COURSE_NUM = ? AND LAB_KEY IS NULL',
                           (lab_key, course_num))
        else:
            cursor.execute('INSERT INTO DATA VALUES(?,?,?,?,?,?,?)',
                           (None, course_num, None, lab_key, None, None, None))

    @staticmethod
    def insert_seminar(cursor, course_num, seminar_key):
        cursor.execute('SELECT COUNT(1) FROM DATA WHERE COURSE_NUM = ? AND SEMINAR_KEY IS NULL', (seminar_key,))
        num = cursor.fetchone()
        if num[0] > 0:
            cursor.execute('UPDATE DATA SET SEMINAR_KEY = ? WHERE COURSE_NUM = ? AND SEMINAR_KEY IS NULL',
                           (seminar_key, course_num))
        else:
            cursor.execute('INSERT INTO DATA VALUES(?,?,?,?,?,?,?)',
                           (None, course_num, None, None, None, seminar_key, None))

    """
    Important! This method is slightly different
    """

    @staticmethod
    def insert_final(cursor, course_num, final_key):
        # Difference is in the line below with not testing if the FINAL_KEY is null
        cursor.execute('SELECT COUNT(1) FROM DATA WHERE COURSE_NUM = ?', (course_num,))
        num = cursor.fetchone()
        if num[0] > 0:
            cursor.execute('UPDATE DATA SET FINAL_KEY = ? WHERE COURSE_NUM = ? AND FINAL_KEY IS NULL',
                           (final_key, course_num))
        else:
            cursor.execute('INSERT INTO DATA VALUES(?,?,?,?,?,?,?)',
                           (None, course_num, None, None, None, None, final_key))


"""
Will go through every row of the CLASSES table and sort them correctly into the
DATA table
"""


class Cleaner:
    def __init__(self):
        self.database = sqlite3.connect(DATABASE_PATH)
        # will set the return value to a dict
        self.database.row_factory = sqlite3.Row
        self.cursor = self.database.cursor()

    def clean(self):
        print('Begin cleaning database.')
        curr_time = time.time()
        self.setup_tables()
        self.begin_processing()
        self.close()
        fin_time = time.time()
        print('Finished cleaning database in {} seconds.'.format(fin_time-curr_time))

    def setup_tables(self):
        self.cursor.execute("DROP TABLE IF EXISTS CLASS_DATA")
        self.cursor.execute("CREATE TABLE CLASS_DATA"
                            "(DEPARTMENT TEXT, COURSE_NUM TEXT, SECTION_ID TEXT, COURSE_ID TEXT,"
                            "TYPE TEXT, DAYS TEXT, TIME TEXT, LOCATION TEXT, ROOM TEXT, "
                            "INSTRUCTOR TEXT, DESCRIPTION TEXT)")

    def begin_processing(self):
        # getting list of departments
        self.cursor.execute("SELECT * FROM DEPARTMENT")
        departments = [i["DEPT_CODE"] for i in self.cursor.fetchall()]

        # handle each department separately
        for department in departments:
            self.process_department(department)

    """
    Will store in format with partitions for the classes in the same format : i.e CSE3$0 means section 0 of CSE3.
    """

    def process_department(self, department):
        # getting all classes in department in order
        self.cursor.execute("SELECT * FROM CLASSES WHERE DEPARTMENT = ? ORDER BY ID", (department,))
        visible_classes = [dict(row) for row in self.cursor.fetchall()]
        # doing this so fast_ptr knows where to stop
        visible_classes.append({"COURSE_NUM": None})

        # blank class list for ones to insert
        classes_to_insert = []

        fast_ptr, slow_ptr = 0, 0
        # course num will be set later
        course_num = None
        section_count = {}
        while fast_ptr < len(visible_classes):
            slow_class = visible_classes[slow_ptr]
            fast_class = visible_classes[fast_ptr]

            if slow_class["COURSE_NUM"]:
                slow_ptr += 1

            if fast_class["COURSE_NUM"]:
                course_num = fast_class["COURSE_NUM"]

            # we know we have hit the end of a section
            if not fast_class["COURSE_NUM"] and slow_ptr != fast_ptr:
                classes_to_insert.extend(
                    # we want slow_ptr + 1 and fast_ptr to be the lower and upper bounds
                    self.process_current_class_set(visible_classes[slow_ptr + 1: fast_ptr],
                                                   section_count,
                                                   department,
                                                   course_num))
                slow_ptr = fast_ptr
            fast_ptr += 1

        self.cursor.execute("BEGIN TRANSACTION")
        for c in classes_to_insert:
            sql_str = """\
                      INSERT INTO CLASS_DATA(DEPARTMENT, COURSE_NUM, SECTION_ID, \
                      COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION)  \
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
                    """
            self.cursor.execute(sql_str,
                                (c["DEPARTMENT"],
                                 c["COURSE_NUM"],
                                 c["SECTION_ID"],
                                 c["COURSE_ID"],
                                 c["TYPE"],
                                 c["DAYS"],
                                 c["TIME"],
                                 c["LOCATION"],
                                 c["ROOM"],
                                 c["INSTRUCTOR"],
                                 c["DESCRIPTION"],
                                 ))

        self.cursor.execute("END TRANSACTION")

    def process_current_class_set(self, class_set, section_count, department, course_num):
        ret = []
        class_sections = []
        # sorts so has classes with no class_section
        classes_to_replicate = [c for c in class_set if not c["COURSE_ID"]]
        classes_to_add = [c for c in class_set if c not in classes_to_replicate]

        # can only be one unique copy of var$Class per Class because of COURSE_ID uniqueness
        for Class in classes_to_add:
            type_groups = groupby(classes_to_replicate, lambda x: x["TYPE"])
            cur_class_sections = [[Class]]
            # groups of replicas based on types
            for key, type_group in type_groups:
                type_group = list(type_group)
                # making temp section for setting later
                temp_sections = []
                # adding cartesian product to temp
                # cur section is a list
                for cur_section in cur_class_sections:
                    # class with type is a class
                    for class_with_type in type_group:
                        replica = cur_section.copy()
                        copy = class_with_type.copy()
                        # always guaranteed to have at least one element in the list
                        copy["COURSE_ID"] = replica[0]["COURSE_ID"]
                        # handle the passing of variable information through rows here
                        if not replica[0]["INSTRUCTOR"] and copy["INSTRUCTOR"]:
                            replica[0]["INSTRUCTOR"] = copy["INSTRUCTOR"]
                        elif not copy["INSTRUCTOR"]:
                            copy["INSTRUCTOR"] = replica[0]["INSTRUCTOR"]

                        replica.append(copy)
                        temp_sections.append(replica)
                # setting current to temp
                cur_class_sections = temp_sections
            class_sections.extend(cur_class_sections)

        # now we are going to set ids based on class_section
        # also going to split classes into their subclasses
        for class_section in class_sections:
            if department not in section_count:
                section_count[department] = {}
            if course_num not in section_count[department]:
                section_count[department][course_num] = 0
            id = department + course_num
            for section in class_section:
                # setting id based on sectionn
                section["SECTION_ID"] = id + "$" + str(section_count[department][course_num])
                subsections = self.split_into_subsections(section)

                # only add if we could create the subsections
                ret.extend(subsections)
            # incrementing to signify going to next section
            section_count[department][course_num] += 1
        return ret

    def split_into_subsections(self, section):
        """
        Takes in a section and splits it into its subsections for easy insertion into rdbms table.

        :param section: the section to split
        :return returns a list of subsections
        """

        ret = []
        # TimeIntervalCollection functions will parse days and times correctly into lists
        days = TimeIntervalCollection.get_days(section['DAYS'])
        # times is a list of TimeInterval objects, want to convert to string
        times = TimeIntervalCollection.get_times(section['TIME'])
        for i in range(0, len(times)):
            # both datetime objects
            start_time = times[i].start_time
            end_time = times[i].end_time

            start_time_str = start_time.strftime('%H:%M')
            end_time_str = end_time.strftime('%H:%M')
            # combining into one string
            time_str = "{}-{}".format(start_time_str, end_time_str)
            times[i] = time_str


        # If it had no days or times just return the original
        if not days or not times:
            return [section]

        day_time_pairs = list(itertools.zip_longest(days, times,
                                                    fillvalue=times[len(times) - 1] if len(days) > len(times) else days[
                                                        len(days) - 1]))
        for entry in day_time_pairs:
            # each subsection has mostly the same info as the section
            subsection = section.copy()
            subsection['DAYS'] = entry[0]
            subsection['TIME'] = entry[1]
            ret.append(subsection)
        return ret

    def close(self):
        self.database.commit()
        self.database.execute("VACUUM")
        self.database.close()


Cleaner().clean()
