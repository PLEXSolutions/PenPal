#!/bin/bash

sudo chown -R node:node /home/node/custom-n8n-nodes

echo Merging all package.json files
npm-recursive-install --rootDir=plugins

exec "$@"
