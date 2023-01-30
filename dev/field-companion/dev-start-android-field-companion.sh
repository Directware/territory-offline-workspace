#!/bin/bash

npm run build:field-companion || exit

cd ./../../apps/field-companion/ || exit

npm run capacitor:android:sync || exit

npm run start:android || exit

exit
