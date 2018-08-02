import sqlite3

from flask import Flask, request, jsonify, abort
from flask_compress import Compress
from flask_cors import CORS
from flask_caching import Cache

import backend
from settings import DATABASE_PATH

db_connection = sqlite3.connect(DATABASE_PATH)
db_cursor = db_connection.cursor()

application = Flask(__name__)
CORS(application)
Compress(application)
cache = Cache(application, config={"CACHE_TYPE": "simple"})

"""
The routing backend for the server.
"""


@application.route('/api_data', methods=['POST'])
def return_db_data():
    request_json = request.get_json()
    if 'classes' not in request_json:
        abort(400, {"error": "Invalid parameters"})

    classes = request_json['classes']
    ret_classes = {}

    for Class in classes:
        department, course_num = Class['department'], Class['courseNum']
        full_name = "{} {}".format(department, course_num)
        ret_classes[full_name] = backend.generate_class_json(department, course_num)

    return jsonify(ret_classes)


@application.route('/api_department', methods={'GET'})
@cache.cached(timeout=0, key_prefix="departments")
def return_department_list():
    departments = backend.get_departments()
    return jsonify(departments)


@application.route('/api_classes', methods={'GET'})
@cache.cached(timeout=0, key_prefix="class_summaries", query_string=True)
def return_classes():
    department = request.args.get('department')
    classes = backend.get_all_classes_in(department)
    return jsonify(classes)


if __name__ == '__main__':
    application.debug = True
    application.run()
