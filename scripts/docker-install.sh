function depends {
  if type $1 >/dev/null 2>&1; then
    echo "✓ Found $1."
  else
    echo "✕ Failed to find $1."
    echo "Install an appropriate version of $1 before proceeding." 
    exit 1
  fi
}

if [ ! -d ".git" ]; then 
  echo "Please run this script in your top level directory."
  exit 1
fi

depends docker
depends docker-compose

export SDSCHEDULE_SCRAPE=1

docker-compose build
docker-compose up 
