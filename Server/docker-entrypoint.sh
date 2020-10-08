#!/bin/bash
sudo chown -R node:node /home/node/custom-n8n-nodes
if [ -z $PRODUCTION ]
then
    exec "$@"
else
    echo "Starting mongod and sleeping for 5 seconds"
    mongod 2>&1 > /tmp/mongo.log &
    sleep 5
    export METEOR_SETTINGS=`echo $METEOR_SETTINGS_B64 | base64 -d | sed -e "s|ROOT_URL|$ROOT_URL|g"`
    echo "Starting webapp at $ROOT_URL with $METEOR_SETTINGS"
    node main.js || (echo "Error -- dropping into a shell for debugging" && bash)
fi

