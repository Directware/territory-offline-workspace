#!/bin/bash

npm run build:field-companion:prod || exit

cd ./../../apps/field-companion/ || exit

npm run capacitor:android:sync || exit

npm run start:android || exit

exit
