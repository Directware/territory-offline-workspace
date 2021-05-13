#!/bin/bash

npm run build:territory-offline:prod || exit

cd ./../../apps/territory-offline/ || exit

npm run capacitor:copy || exit

cd electron || exit

npm run electron:start || exit

exit
