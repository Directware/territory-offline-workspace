#!/bin/bash

read -p "How to bump the version? (Enter=patch): " version

if [ "$version" == "" ]; then version="patch"
fi

if [[ "$version" != "patch" && "$version" != "minor" && "$version" != "major" ]];
  then
    echo "Wrong version bump!"
    exit
fi

echo "Running unit tests..."
npm run test:territory-offline:prod || exit

# bump version before building the app
cd ./../apps/territory-offline/ || exit
npm version "$version"
appVersion=$(node -p "require('./package.json').version") || exit

# build app
cd ../../ || exit # go to projects root
npm run build:territory-offline:prod || exit
#npm run e2e:territory-offline:prod || exit

# synchronize capacitor electron resources
cd ./apps/territory-offline/ || exit
mkdir -p ./electron/app || exit
cp -R ./dist/territory-offline/** ./electron/app || exit
#npm run capacitor:copy || exit

# bump version in electron folder
cd ./electron || exit
npm version "$version"

# release
npm run release || exit

# push to git
cd ../../../ || exit # go to projects root
branch_name=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
git add .
git commit -m "New release: $appVersion"
git push origin "$branch_name"

exit
