#!/bin/bash

npm run build:territory-offline || exit

cd ./../../apps/territory-offline/ || exit

npm run capacitor:ios:sync || exit

npm run capacitor:ios:start || exit

exit
