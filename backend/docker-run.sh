#!/bin/bash

if [[ "$1" = true ]]; then
  python3 -u datautil/webreg_scrape_upload.py && python3 -u application.py
else
  python3 -u application.py
fi
