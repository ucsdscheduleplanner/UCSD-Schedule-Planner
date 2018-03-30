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


@application.route('/data', methods=['POST'])
def return_db_data():
    request_json = request.get_json()
    classes = request_json['classes']
    ret_classes = [backend.generate_class_versions(i) for i in classes]

    cd = ClassDecoder()
    ret_dict = {}
    index = 0
    for cl_list in ret_classes:
        temp_list = []
        for cl in cl_list:
            temp_list.append(cd.default(cl))
        ret_dict[classes[index]] = temp_list
        index += 1
    return jsonify(ret_dict)


@application.route('/department', methods={'POST'})
def return_department_list():
    departments = backend.get_departments()
    return jsonify(departments)


@application.route('/class_types', methods={'POST'})
def return_class_types():
    class_types = backend.get_class_types()
    class_types_dicts = {'CLASS_TYPES': class_types}
    return jsonify(class_types_dicts)


@application.route('/classes', methods={'POST'})
def return_classes():
    department = request.args.get('department')
    classes = backend.get_classes_in_department(department)
    return jsonify(classes)


@application.route('/create_ics', methods={'POST'})
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
    obj = [0]
    with tempfile.TemporaryFile(mode="w+") as temp:
        temp.writelines(calendar.__iter__())
        temp.seek(0)
        data = temp.read()
        obj[0] = str.encode(data)
    # Using make response to convert binary to response
    response = make_response(obj[0])
    response.headers.set('Content-Disposition', 'attachment')
    return response


if __name__ == '__main__':
    application.debug = True
    application.run()