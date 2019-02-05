# constants
BUILD='--build'
ENV_PROD='PROD'
ENV_DEV='DEV'

# variables
SDSCHEDULE_SCRAPE=0
is_build=''
environment='DEV'
letsencrypt_email=""

depends() {
  if type $1 >/dev/null 2>&1; then
    echo "✓ Found $1."
  else
    echo "✕ Failed to find $1."
    echo "Install an appropriate version of $1 before proceeding." 
    exit 1
  fi
}

is_email_valid() {
  regex="^([A-Za-z]+[A-Za-z0-9]*((\.|\-|\_)?[A-Za-z]+[A-Za-z0-9]*){1,})@(([A-Za-z]+[A-Za-z0-9]*)+((\.|\-|\_)?([A-Za-z]+[A-Za-z0-9]*)+){1,})+\.([A-Za-z]{2,})+"
  [[ "${1}" =~ $regex ]]
}


check_depend() {
  depends docker
  depends docker-compose
}

check_directory() {
  if [ ! -d ".git" ]; then 
    echo "Error: Please run this script in your top level directory."
    exit 1
  fi
}

run_dev() {
  if [ ! -f "docker-compose.yml" ]; then 
    echo "Error: docker-compose.yml missing, which is required for docker-compose"
    echo "Please check the repo for missing files"
    exit 1
  fi

  export SDSCHEDULE_SCRAPE

  docker-compose up ${is_build}
}

run_prod() {
  if [ ! -f "docker-compose-production.yml" ]; then 
    echo "Error: docker-compose-production.yml missing, which is required for docker-compose"
    echo "Please check the repo for missing files"
    exit 1
  fi

  export SDSCHEDULE_SCRAPE

  echo "Starting up production servers"

  docker-compose -f docker-compose-production.yml up ${is_build} --detach
}

stop_prod() {
  if [ ! -f "docker-compose-production.yml" ]; then 
    echo "Error: docker-compose-production.yml missing, which is required for docker-compose"
    echo "Please check the repo for missing files"
    exit 1
  fi

  echo "Stopping containers in production mode"

  docker-compose -f docker-compose-production.yml down
}

run_certbot() {
  echo
  echo "Will generate a brand new cert"
  echo
  docker exec sdschedule-certbot sed -i -r 's/(listen .*443)/\1;#/g; s/(ssl_(certificate|certificate_key|trusted_certificate) )/#;#\1/g' /etc/nginx/sites-enabled/sdschedule.conf
  docker exec sdschedule-certbot certbot certonly --webroot -w /var/www/certbot -d sdschedule.com -n --force-renewal --agree-tos --email "$letsencrypt_email"
  docker exec sdschedule-certbot sed -i -r 's/#?;#//g' /etc/nginx/sites-enabled/sdschedule.conf
}

main() {
  check_directory
  check_depend

  case $environment in
    PROD)
      run_prod
    ;;
    DEV)
      run_dev
    ;;
    *)
      echo "Internal Error: Invalid Environment Setting"
      exit -1
    ;;
  esac
}

if [ $# -eq 0 ]; then
  echo "Run in development mode without downloading and rebuilding by default"
  echo "Try '-h' or '--help' for help message"
  echo
fi

while test $# -gt 0; do
  case "$1" in 
      -h | --help) 
          echo "The run script for the UCSD Schedule Planner" 
          echo ""
          echo "-h, --help         Show this very helpful message"
          echo "-d, --download     Will download data fresh from Schedule of Classes"
          echo "-p, --production   Will run in production mode (detached)"
          echo "-b, --build        Rebuild the services. Do this if files are modified"
          echo "-s, --stop         Stop the detached *production* services"
          echo "-c, --cert <email> Run certbot for production service for first time (after started). Use an email address as argument"
          echo ""
          echo "Sample usage: "
          echo ""
          echo "-p -d -b          Rebuild the services, download fresh data, and run in production mode"
          echo "-p                Run in production mode. Will build services if and only if no services built previously"
          exit 0
          ;;
      -d | --download)
          SDSCHEDULE_SCRAPE=1
          ;;
      -p | --production)
          environment=${ENV_PROD}
          ;;
      -b | --build)
          is_build=${BUILD}
          ;;
      -s | --stop)
          stop_prod # move to new location?
          exit 0
          ;;
      -c | --cert)
          letsencrypt_email="$2"
          if ! isEmailValid "$letsencrypt_email" ;then
            echo "Invalid Email, plese try again"
            exit -1
          fi
          run_certbot # move to new location?
          exit 0
          ;;
      *)
          echo "Invalid arguments '$1' ignored"
          ;;
  esac
  shift
done

main