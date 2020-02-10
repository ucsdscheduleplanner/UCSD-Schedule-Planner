import os
import re
import sqlite3
from collections import namedtuple
from typing import List, Dict

import bs4

from settings import COURSES_HTML_PATH, DATABASE_PATH, RAW_QUARTER_TABLE


class ClassRow:
    def __init__(self, course_id=None, department=None, course_num=None, section_id=None, section_type=None,
                 days=None, times=None, location=None, room=None, instructor=None, description=None, units=None):
        self.course_id = course_id
        self.department = department
        self.course_num = course_num
        self.section_id = section_id
        self.section_type = section_type
        self.days = days
        self.times = times
        self.location = location
        self.room = room
        self.instructor = instructor
        self.description = description
        self.units = units

    def __repr__(self):
        return ",".join(("{}={}".format(*i) for i in vars(self).items()))


class CourseParser:
    description: str
    current_class: str

    def __init__(self):
        # initializing database
        self.connection = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.connection.cursor()

        self.current_class, self.description, self.units = '', '', ''

    def parse(self):
        print('Beginning course parsing...')
        subdirectories = [file.name for file in os.scandir(COURSES_HTML_PATH) if file.is_dir()]

        ret = {}
        try:
            for quarter in subdirectories:
                print("Parsing %s" % quarter)
                ret[quarter] = self.parse_data(quarter)
        finally:
            self.close()

        print('Finished course parsing.')
        return ret

    def parse_data(self, quarter) -> List[ClassRow]:
        class_store = []
        quarter_path = os.path.join(COURSES_HTML_PATH, quarter)
        departments = [file.name for file in os.scandir(quarter_path) if file.is_dir()]
        departments.sort()

        for department in departments:
            print("[Courses] Parsing department %s." % department)
            department_path = os.path.join(quarter_path, department)
            files = os.listdir(department_path)

            # just to sort based on number
            files.sort(key=lambda x: int(re.findall('[0-9]+', x)[0]))
            for file in files:
                class_store.extend(self.parse_file(os.path.join(department_path, file), department))

        return class_store

    def parse_file(self, filepath, department) -> List[ClassRow]:
        ret = []
        with open(filepath) as html:
            # Use lxml for parsing
            soup = bs4.BeautifulSoup(html, 'lxml')
            # Look for table rows
            rows = soup.find_all(name='tr')
            for row in rows:
                ret.extend(self.parse_row(department, row))
        return ret

    """
    Will get info from the HTML and store it into a format that can be manipulated easily. 
    Then it will validate the information and make sure that it is in a usable format.
    """

    def parse_row(self, department, row):
        ret = []
        course_num = row.find_all(name='td', attrs={'class': 'crsheader'})

        if course_num:
            self.current_class = course_num[1].text
            self.description = course_num[2].text.strip().replace('\n', '').replace('\t', '')

            # Getting units from description, removing from description
            unit_match = re.search(r'(.*)\((.+Units)\)', self.description)
            if unit_match is not None:
                self.description = unit_match.group(1).strip()
                self.units = unit_match.group(2).strip()
            else:
                self.units = "N/A"
            # num slots on the top header
            if len(course_num) == 4:
                ret.append(ClassRow(department=department, course_num=None, course_id="START/END OF CLASS"))

        info = row.find_all(name='td',
                            attrs={'class': 'brdr'})

        if info and len(info) > 5:
            copy_dict = {}
            counter = 0

            for i in info:
                if 'colspan' in i.attrs:
                    for j in range(0, int(i.attrs['colspan'])):
                        copy_dict[counter] = i.text.strip()
                        counter += 1
                else:
                    copy_dict[counter] = i.text.strip()
                    counter += 1

            course_num = self.current_class
            course_id = copy_dict[2]
            section_type = copy_dict[3]
            days = copy_dict[5]
            times = copy_dict[6]
            location = copy_dict[7]
            room = copy_dict[8]
            instructor = copy_dict[9]

            info = ClassRow(
                course_id=course_id,
                department=department,
                course_num=course_num,
                section_type=section_type,
                days=days,
                times=times,
                location=location,
                room=room,
                instructor=instructor,
                description=self.description,
                units=self.units
            )

            ret.append(info)
        return ret

    """
    Method to make final alterations to the dataset. 
    Will put database in cleanable format; however, will not remove
    database. 
    """

    def validate_info(self, data):
        # Make sure final is not randomly in the wrong column
        if data[1] == 'FINAL':
            data[1] = None
            data[2] = 'FINAL'
        return tuple(data)

    # Put data into database
    def insert_data(self, quarter):
        table_name = RAW_QUARTER_TABLE.format(quarter)
        self.cursor.execute("DROP TABLE IF EXISTS {}".format(table_name))
        self.cursor.execute("CREATE TABLE {}"
                            "(ID INTEGER PRIMARY KEY, DEPARTMENT TEXT, COURSE_NUM TEXT, COURSE_ID TEXT, "
                            "TYPE TEXT, DAYS TEXT, TIME TEXT, LOCATION TEXT, ROOM TEXT, "
                            "INSTRUCTOR TEXT, DESCRIPTION TEXT)".format(table_name))

        # TODO Make database insertion quicker
        for info in self.class_store:
            if len(info) > 1:
                self.cursor.execute("INSERT OR IGNORE INTO {} VALUES(?,?,?,?,?,?,?,?,?,?,?)".format(table_name),
                                    (None,) + info)
            else:
                self.cursor.execute("INSERT INTO {}(ID, DEPARTMENT) VALUES(?, ?)".format(table_name), (None,) + info)

    def close(self):
        self.connection.commit()
        self.connection.close()
