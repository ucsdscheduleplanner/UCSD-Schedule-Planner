#!/bin/bash

echo 'Starting up the storybook...'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR
cd ../storybook

docker-compose build && docker-compose up

