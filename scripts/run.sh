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

params=()
should_build=true

while test $# -gt 0; do
   case "$1" in 
       -h | --help) 
          echo "The run script for the UCSD Schedule Planner" 
          echo ""
          echo "-h, --help        Gives the possible commands"
          echo "-d, --download    Will download data fresh from Schedule of Classes"
          echo "--no-build        Will create the servers without rebuilding the docker containers"
          exit 0
          ;;
      -d | --download)
          params+=('--build-arg DOWNLOAD=true')
          shift
          ;;
      --no-build)
          should_build=false
          shift
          ;;
      *)
          break
          ;;
  esac
done

depends docker
depends docker-compose

if [ $should_build == true ] 
then 
  docker-compose build "${params[@]}"
fi

docker-compose up 
