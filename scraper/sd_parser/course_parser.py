import os
import re
import sqlite3

import bs4

from settings import COURSES_HTML_PATH, DATABASE_PATH, RAW_QUARTER_TABLE


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
                ret[quarter] = self._parse(quarter)
        finally:
            self.close()

        print('Finished course parsing.')
        return ret

    def _parse(self, quarter):
        return self.parse_data(quarter)
        # self.insert_data(quarter)

    def parse_data(self, quarter):
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
                self.parse_file(os.path.join(department_path, file), department, class_store)

        return class_store

    def parse_file(self, filepath, department, class_store):
        with open(filepath) as html:
            # Use lxml for parsing
            soup = bs4.BeautifulSoup(html, 'lxml')
            # Look for table rows
            rows = soup.find_all(name='tr')
            for row in rows:
                self.parse_row(department, row, class_store)

    """
    Will get info from the HTML and store it into a format that can be manipulated easily. 
    Then it will validate the information and make sure that it is in a usable format.
    """

    def parse_row(self, department, row, class_store):
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
                class_store.append({"DEPARTMENT": department, "COURSE_NUM": None, "SECTIOND_ID": "START/END OF CLASS"})

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

            info = {
                "COURSE_ID": course_id,
                "DEPARTMENT": department,
                "COURSE_NUM": course_num,
                "SECTION_TYPE": section_type,
                "DAYS": days,
                "TIME": times,
                "LOCATION": location,
                "ROOM": room,
                "INSTRUCTOR": instructor,
                "DESCRIPTION": self.description,
                "UNITS": self.units
            }

            class_store.append(info)

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
