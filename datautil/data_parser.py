import os
import sqlite3
import bs4
import time
from settings import HTML_STORAGE, DATABASE_PATH, HOME_DIR


class Parser:
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

    def parse(self):
        print('Beginning parsing.')
        curr_time = time.time()
        self.parse_data()
        self.insert_data()
        self.close()
        fin_time = time.time()
        print('Finished parsing in {} seconds.'.format(fin_time - curr_time))

    def parse_data(self):
        for root, dirs, files in os.walk(os.curdir):
            for dir in dirs:
                for file in os.listdir(dir):
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
                ""
            )

            if ret_info not in self.buffer_buffer:
                self.buffer_buffer.append(ret_info)
                print('*' * 10)
                print(ret_info)




            # section_id = row.find(name='td', attrs={'role': 'gridcell',
            #                                         'aria-describedby': 'search-div-b-table_SECTION_NUMBER'})
            # class_type = row.find(name='td', attrs={'role': 'gridcell',
            #                                         'aria-describedby': 'search-div-b-table_FK_CDI_INSTR_TYPE'})
            # day = row.find(name='td',
            #              attrs={'role': 'gridcell',
            #                     'aria-describedby': 'search-div-b-table_DAY_CODE'})
            # class_time = row.find(name='td',
            #               attrs={'role': 'gridcell',
            #                      'aria-describedby': 'search-div-b-table_coltime'})
            # location = row.find(name='td',
            #                   attrs={'role': 'gridcell',
            #                          'aria-describedby': 'search-div-b-table_BLDG_CODE'})
            # room = row.find(name='td',
            #               attrs={'role': 'gridcell',
            #                      'aria-describedby': 'search-div-b-table_ROOM_CODE'})
            # instructor = row.find(name='td',
            #                     attrs={'role': 'gridcell',
            #                            'aria-describedby': 'search-div-b-table_PERSON_FULL_NAME'})

            # # Check if nothing is null
            # if None not in (header, section_id, class_type, day, class_time, location, room, instructor):
            #     name_desc = header.find_all(name='td')
            #
            #     course_num = ' '.join(name_desc[0].text.split())
            #     department = course_num.split(' ')[0]
            #     section_id = ' '.join(section_id.text.split())
            #     class_type = ' '.join(class_type.text.split())
            #     day = ' '.join(day.text.split())
            #     class_time = ' '.join(class_time.text.split())
            #     location = ' '.join(location.text.split())
            #     room = ' '.join(room.text.split())
            #     instructor = ' '.join(instructor.text.split())
            #     description = ' '.join(name_desc[1].text.split())
            #
            #     # Dirty data with possible errors
            #     info = [
            #         department, course_num, section_id,
            #         class_type, day, class_time,
            #         location, room, instructor,
            #         description
            #     ]
            #
            #     # Passing in a list which will be converted to tuple
            #     info = self.validate_info(info)
            #     if info not in self.buffer_buffer:
            #         self.buffer_buffer.append(info)
            #         print('*' * 10)
            #         print(info)

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
                            "INSTRUCTOR TEXT, DESCRIPTION TEXT,"
                            "UNIQUE(COURSE_NUM, COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR))")

        # TODO Make database insertion quicker
        self.cursor.execute("BEGIN TRANSACTION")
        for info in self.buffer_buffer:
            self.cursor.execute("INSERT OR IGNORE INTO CLASSES VALUES(?,?,?,?,?,?,?,?, ?,?,?)", (None,) + info)

    def close(self):
        self.connection.commit()
        self.connection.close()


Parser().parse()
