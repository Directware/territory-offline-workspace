#!/bin/bash

npm run build:field-companion:prod || exit

cd ./../../apps/field-companion/ || exit

npm run capacitor:ios:sync || exit

npm run start:ios || exit

exit
