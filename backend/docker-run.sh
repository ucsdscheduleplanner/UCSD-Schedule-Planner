#!/bin/bash

# uwsgi or flask
if [[ $ENV == "PROD"  ]]; then
  useradd app
  chown -R app:app /app
  uwsgi --ini application.ini
else
  python3 -u application.py
fi
