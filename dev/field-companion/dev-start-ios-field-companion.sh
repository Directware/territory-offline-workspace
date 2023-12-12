#!/bin/bash

nvm use 16

npm run build:field-companion || exit

cd ./../../apps/field-companion/ || exit

npm run capacitor:ios:sync || exit

npm run start:ios || exit

exit
