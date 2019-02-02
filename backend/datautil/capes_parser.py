import os
import sqlite3
import bs4
import re

from settings import CAPES_STORAGE, DATABASE_PATH, HOME_DIR

class CAPESParser:
    def __init__(self):
        # Initialize database
        self.connection = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.connection.cursor()

        # Initialize buffer for storing to-be-inserted data 
        self.buffer = []

    def parse(self):
        print('Beginning CAPES parsing.')
        self.parse_data()
        self.insert_data()
        self.close()
        print('Finished CAPES parsing.')

    def parse_data(self):
        for dirpath, _, filenames in os.walk(CAPES_STORAGE):
            # Iterate over files only (no directories in this cache) 
            for fn in filenames:
                department = fn.replace('.html', '')

                # Open the given filename as a file object
                with open(os.path.join(dirpath, fn)) as f:
                    # Use BS4 LXML parser
                    soup = bs4.BeautifulSoup(f, 'lxml')

                    # Ignore thead (useless information) 
                    table = soup.find(name='tbody')

                    # Some departments don't have CAPES reviews! (AESE)
                    if table:
                        print("Current department: {}".format(department))
                        
                        # Parse each row in the department 
                        rows = table.find_all(name='tr')
                        for row in rows:
                            self.parse_row(department, row)

                    else:
                        print("Skipping department {}. No CAPES reviews.".format(department))


    def parse_row(self, department, row):
        entries = row.find_all(name='td')

        def extract_course_num(td):
            anchor = td.find(name='a')
            raw_course = anchor.string
            full_course = raw_course[:raw_course.index(' -')]
            return full_course.split()[1]

        def strip_percentage(td):
            raw_percentage = td.find(name='span').string
            assert('%' in raw_percentage)
            return raw_percentage[:-2]

        def extract_gpa(td):
            full_grade = td.find(name='span').string
            if full_grade == 'N/A':
                # NaN values are stored as 0
                return '0.00'
            else:
                # The grade can be recreated from the GPA
                oparen = full_grade.index('(') 
                cparen = full_grade.index(')') 
                return full_grade[(oparen + 1):cparen]

        # CAPES entries have ten columns
        assert(len(entries) == 10)

        instructor = entries[0].string.strip()
        course_num = extract_course_num(entries[1])
        term = entries[2].string
        enrollment = entries[3].string
        evaluations = entries[4].find(name='span').string
        percent_recommend_class = strip_percentage(entries[5])
        percent_recommend_instructor = strip_percentage(entries[6])
        study_time = entries[7].find(name='span').string 
        expected_gpa = extract_gpa(entries[8])
        received_gpa = extract_gpa(entries[9])

        # Add entry to our buffer so it can be entered into the sqlite database 
        sql_entry = (
            department,
            course_num,
            instructor, 
            term,
            enrollment,
            evaluations,
            percent_recommend_class,
            percent_recommend_instructor,
            study_time,
            expected_gpa,
            received_gpa
        )
        self.buffer.append(sql_entry)
        
    def insert_data(self):
        # Drop old CAPES tables and create a new one
        self.cursor.execute("DROP TABLE IF EXISTS CAPES_DATA")
        self.cursor.execute("CREATE TABLE CAPES_DATA"
                            "(DEPARTMENT TEXT, COURSE_NUM TEXT, INSTRUCTOR TEXT, "
                            "TERM TEXT, ENROLLMENT TEXT, EVALUATIONS TEXT, PERCENT_RECOMMEND_CLASS TEXT, "
                            "PERCENT_RECOMMEND_INSTRUCTOR TEXT, HOURS_PER_WEEK TEXT, EXPECTED_GPA TEXT, "
                            "RECEIVED_GPA TEXT)")

        # There are 11 blanks to fill in each insertion query 
        blanks = ','.join(['?' for _ in range(11)])
        insertion_query = "INSERT OR IGNORE INTO CAPES_DATA VALUES({})".format(blanks)

        for sql_entry in self.buffer:
            self.cursor.execute(insertion_query, sql_entry)

    def close(self):
        self.connection.commit()
        self.connection.close()
