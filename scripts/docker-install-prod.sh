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

if [ ! -f "docker-compose-prod.yml" ]; then 
  echo "Error: docker-compose-prod.yml missing, which is required for docker-compose"
  echo "Please check the repo for missing files"
  exit 1
fi

download=false

while test $# -gt 0; do
   case "$1" in 
       -h | --help)
          echo "-h, --help        Gives the possible commands"
          echo "-d, --download    Will download data fresh from Schedule of Classes"
          exit 0
          ;;
      -d | --download)
          download=true
          shift
          ;;
      *)
          break
          ;;
  esac
done

depends docker
depends docker-compose

docker-compose -f docker-compose-prod.yml build --build-arg DOWNLOAD=${download}

# the frontend container will auto exit after finishing "yarn run build"