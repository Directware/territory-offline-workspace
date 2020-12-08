#!/usr/bin/env bash

read -p "How to bump the version? (Enter=patch): " version

if [ "$version" == "" ]; then version="patch"
fi

if [[ "$version" != "patch" && "$version" != "minor" && "$version" != "major" ]];
  then
    echo "Wrong version bump!"
    exit
fi

npm run build:territory-offline:prod || exit
npm run e2e:territory-offline:prod || exit

cd ./../apps/territory-offline/ || exit

npm run capacitor:sync || exit

npm version "$version"

cd electron || exit

npm version "$version"

npm run release || exit