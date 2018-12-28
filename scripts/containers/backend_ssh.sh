#!/bin/bash

echo 'Sshing into the backend container'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR
cd ../

docker-compose exec sdschedule-backend bash

