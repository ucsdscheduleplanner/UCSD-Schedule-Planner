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


@application.route('/api_create_ics', methods={'POST'})
def create_ics():
    request_json = request.get_json()
    # TODO ADD ASSERTION HERE TO MAKE SURE DATA IS CORRECT
    calendar = Calendar()
    for _class in request_json:
        event = Event()
        event.name = _class['department'] + " " + _class['courseNum']
        event.begin = _class['timeInterval']['start']
        event.end = _class['timeInterval']['end']
        calendar.events.append(event)
    # Storing the data in a variable of higher scope
    temp_str = '\n'.join(calendar.__iter__())
    str_data = temp_str.encode()
    # Using make response to convert binary to response
    response = make_response(str_data)
    response.headers.set('Content-Disposition', 'attachment')
    return response


if __name__ == '__main__':
    application.debug = True
    application.run()
