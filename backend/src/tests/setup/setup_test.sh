#!/bin/bash

PATH_TO_BIN=$(pwd)/src/tests/setup

echo $1
kill_pid() {
    local pid=$1

    if [ -n "$pid" ]; then
        echo "🔥 Killing existing process running on port 8545"
        kill -9 $pid
    fi
}

# kill_pid


cd $PATH_TO_BIN


./run_node.sh &

sleep 1

./deploy_contracts.sh &

sleep 1

cd -

jest --setupFiles dotenv/config --silent=false --coverage=$1

wait 





kill_pid

