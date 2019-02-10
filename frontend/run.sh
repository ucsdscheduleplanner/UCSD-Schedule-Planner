#!/bin/bash
if [ ${ENV} == "PROD" ]; then 
    yarn run build
else
    npm start
fi
