
if [ "$1" == "--coverage" ]; then
    coverage=true
    echo "📊 Running tests with coverage"
else
    coverage=false
fi
pwd

jest --setupFiles dotenv/config --silent=false --coverage=$coverage
