#!/bin/bash

# build app
cd .. || exit # go to projects root
npm run build:territory-offline:prod || exit

# synchronize capacitor electron resources
cd ./apps/territory-offline/ || exit

mkdir -p ./electron/app || exit
cp -R ./dist/territory-offline/** ./electron/app || exit
# npm run capacitor:copy || exit

# dist all
cd ./electron || exit
npm run dist:all || exit

exit
