#!/bin/bash

npm run build:territory-offline || exit

cd ./../../apps/territory-offline/ || exit

npm run capacitor:android:sync || exit

npm run capacitor:android:start || exit

exit
