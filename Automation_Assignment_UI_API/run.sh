#!/bin/bash

# Usage: ./run.sh [test name or tag] [headless|headed]

TAG=$1
MODE=$2

if [ "$MODE" = "headed" ]; then
  export HEADLESS=false
else
  export HEADLESS=true
fi

npx playwright test --grep "$TAG"