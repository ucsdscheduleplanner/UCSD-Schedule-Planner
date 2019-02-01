import os
import sqlite3
import bs4
import re

from settings import HTML_STORAGE, DATABASE_PATH, HOME_DIR

class CourseParser:
    def __init__(self):
        # initializing database
        os.chdir(HOME_DIR)
        self.connection = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.connection.cursor()

        # changing dir for HTML
        self.dir = os.path.join(os.curdir, HTML_STORAGE)
        os.chdir(self.dir)

        # Initializing storage for classes
        # List of list of classes
        self.buffer_buffer = []
        # List of classes
        self.buffer = []

        self.current_class = None
        self.description = None

    def parse(self):
        print('Beginning course parsing.')
        self.parse_data()
        self.insert_data()
        self.close()
        print('Finished course parsing.')

    def parse_data(self):
        for root, dirs, files in os.walk(os.curdir):
            for dir in dirs:
                print("Current department: {}".format(dir))
                files = os.listdir(dir)
                # just to sort based on number
                files.sort(key=lambda x: int(re.findall('[0-9]+', x)[0]))
                for file in files:
                    with open(os.path.join(dir, file)) as html:
                        # Use lxml for parsing
                        soup = bs4.BeautifulSoup(html, 'lxml')
                        # Look for table rows
                        rows = soup.find_all(name='tr')
                        for row in rows:
                            self.parse_row(dir, row) 
    """
    Will get info from the HTML and store it into a format that can be manipulated easily. 
    Then it will validate the information and make sure that it is in a usable format.
    """

    def parse_row(self, department, row):
        course_num = row.find_all(name='td',
                                  attrs={'class': 'crsheader'})
        if course_num:
            self.current_class = course_num[1].text
            self.description = course_num[2].text.strip().replace('\n', '').replace('\t','')
            # num slots on the top header
            if len(course_num) == 4:
                self.buffer_buffer.append((department,))

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
            section_id = copy_dict[2]
            type = copy_dict[3]
            days = copy_dict[5]
            times = copy_dict[6]
            location = copy_dict[7]
            room = copy_dict[8]
            instructor = copy_dict[9]

            ret_info = (
                department,
                course_num,
                section_id,
                type,
                days,
                times,
                location,
                room,
                instructor,
                self.description,
            )

            self.buffer_buffer.append(ret_info)

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
    def insert_data(self):
        self.cursor.execute("DROP TABLE IF EXISTS CLASSES")
        self.cursor.execute("CREATE TABLE CLASSES"
                            "(ID INTEGER PRIMARY KEY, DEPARTMENT TEXT, COURSE_NUM TEXT, COURSE_ID TEXT, "
                            "TYPE TEXT, DAYS TEXT, TIME TEXT, LOCATION TEXT, ROOM TEXT, "
                            "INSTRUCTOR TEXT, DESCRIPTION TEXT)")

        # TODO Make database insertion quicker
        for info in self.buffer_buffer:
            if len(info) > 1:
                self.cursor.execute("INSERT OR IGNORE INTO CLASSES VALUES(?,?,?,?,?,?,?,?,?,?,?)", (None,) + info)
            else:
                self.cursor.execute("INSERT INTO CLASSES(ID, DEPARTMENT) VALUES(?, ?)", (None,) + info)

    def close(self):
        self.connection.commit()
        self.connection.close()
