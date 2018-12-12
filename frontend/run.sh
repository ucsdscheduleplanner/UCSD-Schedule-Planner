#!/bin/bash
if [ ${ENV} == "PROD" ]; then 
    yarn run build
    cp -R ./public/. ./build/
else
    npm start
fi
