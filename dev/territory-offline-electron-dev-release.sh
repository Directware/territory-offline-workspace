#!/bin/bash

# build app
cd .. || exit # go to projects root
npm run build:territory-offline:prod || exit

# synchronize capacitor electron resources
cd ./apps/territory-offline/ || exit
npm run capacitor:copy || exit

# dist all
cd ./electron || exit
npm run dist:all || exit

exit
