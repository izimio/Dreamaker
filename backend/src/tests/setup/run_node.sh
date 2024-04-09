#!/bin/bash


cd_to_root() {
    local current_dir=$(pwd)

    while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/.root" ]]; then
            cd "$current_dir" || return 1
            return 0
        fi
        current_dir=$(dirname "$current_dir")
    done

    echo "❌ .root file not found in parent directories! Cannot proceed."
    return 1
}

cd_to_root && cd contracts


if [ ! -d "node_modules" ]; then
    echo "📦 Installing node modules"
    npm install
fi

echo "🏃‍♂️ Running node"

npm run node > /dev/null