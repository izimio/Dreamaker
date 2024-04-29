#!/bin/bash

PATH_TO_BIN=$(pwd)/src/tests/setup
cd $PATH_TO_BIN

kill_pid() {
    local pid=$1

    if [ -n "$pid" ]; then
        echo "🔥 Killing existing process running on port 8545"
        kill -9 $pid
    fi
}

node_pid=$(lsof -t -i:8545)

if [ -n "$node_pid" ]; then
    echo "🚦 Node is already running on port 8545 \n"
else
    ./run_node.sh &
    sleep 1
fi


./deploy_contracts.sh &

sleep 1

cd -

jest --setupFiles dotenv/config ./src/tests/setup/setupTest.js --detectOpenHandles --silent=false $@

wait 

exit 0

