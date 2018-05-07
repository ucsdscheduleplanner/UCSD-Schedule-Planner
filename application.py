import sqlite3

import os
import io

import backend
import tempfile

from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from classutil.class_decoders import ClassDecoder
from settings import DATABASE_PATH
from ics import Calendar, Event

db_connection = sqlite3.connect(DATABASE_PATH)
db_cursor = db_connection.cursor()

application = Flask(__name__)
CORS(application)

"""
The routing backend for the server.
"""


@application.route('/api_data', methods=['POST'])
def return_db_data():
    request_json = request.get_json()
    classes = request_json['classes']
    ret_classes = [backend.generate_class_versions(i['department'], i['course_num']) for i in classes]

    cd = ClassDecoder()
    ret_dict = {}
    index = 0
    for cl_list in ret_classes:
        temp_list = []
        for cl in cl_list:
            temp_list.append(cd.default(cl))
        ret_dict[classes[index]['class_title']] = temp_list
        index += 1
    return jsonify(ret_dict)


@application.route('/api_department', methods={'GET'})
def return_department_list():
    departments = backend.get_departments()
    return jsonify(departments)


@application.route('/api_class_types', methods={'POST'})
def return_class_types():
    class_types = backend.get_class_types()
    class_types_dicts = {'CLASS_TYPES': class_types}
    return jsonify(class_types_dicts)


@application.route('/api_classes', methods={'GET'})
def return_classes():
    department = request.args.get('department')
    classes = backend.get_class_info_in_department(department)
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
