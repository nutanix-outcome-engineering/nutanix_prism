#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

npm clean-install
tar -C ${PROJECT_ROOT} -czf prism_api.tar.gz index.js package.json README.md
tar -C ${PROJECT_ROOT} -czf dependencies.tar.gz node_modules
