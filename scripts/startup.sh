#!/bin/bash

case $NODE_ENV in
  development)
    echo "Running Example API in development mode."
    cp .env.example .env
    npm run build
    npm run watch-debug
    ;;
  production)
    echo "Running Example API in production mode."
    cp .env.production .env
    npm run build
    npm run serve
    ;;
  *)
    echo "Running Example API in staging mode (default)."
    cp .env.staging .env
    npm run build
    npm run serve
    ;;
esac
