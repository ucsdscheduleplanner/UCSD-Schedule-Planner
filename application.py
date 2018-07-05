import sqlite3

from flask import Flask, request, jsonify, make_response
from flask_compress import Compress
from flask_cors import CORS
from ics import Calendar, Event

import backend
from settings import DATABASE_PATH

db_connection = sqlite3.connect(DATABASE_PATH)
db_cursor = db_connection.cursor()

application = Flask(__name__)
CORS(application)
Compress(application)

"""
The routing backend for the server.
"""


@application.route('/api_data', methods=['POST'])
def return_db_data():
    request_json = request.get_json()
    classes = request_json['classes']
    ret_classes = {}

    for Class in classes:
        department, course_num = Class['department'], Class['course_num']
        full_name = "{} {}".format(department, course_num)
        ret_classes[full_name] = backend.generate_class_json(department, course_num)

    return jsonify(ret_classes)


@application.route('/api_department', methods={'GET'})
def return_department_list():
    departments = backend.get_departments()
    return jsonify(departments)


@application.route('/api_classes', methods={'GET'})
def return_classes():
    department = request.args.get('department')
    classes = backend.get_all_classes_in(department)
    return jsonify(classes)


if __name__ == '__main__':
    application.debug = True
    application.run()
