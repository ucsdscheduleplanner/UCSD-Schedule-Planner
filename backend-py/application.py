#!/usr/bin/env python3

from flask import Flask, request, jsonify, abort
from flask_compress import Compress
from flask_cors import CORS
from flask_caching import Cache
from backend import generate_class_json, get_all_classes_in, get_departments

import configparser, os

config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), "config", "config.example.ini"))
DEFAULT_QUARTER = config["DB"]["DEFAULT_QUARTER"]

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

    quarter = request_json['quarter'] if 'quarter' in request_json else DEFAULT_QUARTER

    for Class in classes:
        department, course_num = Class['department'], Class['courseNum']
        full_name = "{} {}".format(department, course_num)
        ret_classes[full_name] = generate_class_json(department, course_num, quarter)

    return jsonify(ret_classes)


@application.route('/api_department', methods={'GET'})
@cache.cached(timeout=3600, key_prefix="departments")
def return_department_list():
    departments = get_departments()
    return jsonify(departments)


@application.route('/api_classes', methods={'GET'})
@cache.cached(timeout=3600, key_prefix="class_summaries", query_string=True)
def return_classes():
    department = request.args.get('department')

    # quarter = request.args.get('quarter') if 'quarter' in request.args else DEFAULT_QUARTER
    quarter = request.args.get('quarter', DEFAULT_QUARTER, type=str)
    classes = get_all_classes_in(department, quarter)
    return jsonify(classes)


if __name__ == '__main__':
    application.debug = True
    application.run(host='0.0.0.0')
