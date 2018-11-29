if [[ $SDSCHEDULE_SCRAPE -eq 1 ]]; then
  python3 -u datautil/webreg_scrape.py
  python3 -u datautil/webreg_upload.py
fi

python3 -u application.py
