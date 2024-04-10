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

kill_pid

./run_node.sh &

sleep 1

./deploy_contracts.sh &

sleep 1

cd -

jest --setupFiles dotenv/config --detectOpenHandles --silent=false $@

wait 

kill_pid

