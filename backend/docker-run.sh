#!/bin/bash

# download data or not
if [[ $SDSCHEDULE_SCRAPE -eq 1  ]]; then
  python3 -u datautil/webreg_scrape_upload.py
fi

# uwsgi or flask
if [[ $ENV == "PROD"  ]]; then
  useradd app
  chown -R app:app /app
  uwsgi --ini application.ini
else
  python3 -u application.py
fi
