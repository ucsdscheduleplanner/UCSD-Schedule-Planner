#!/bin/bash

# download data or not
#if [[ $SDSCHEDULE_SCRAPE -eq 1  ]]; then
python3 -u ./webreg_scrape_upload.py
#fi
