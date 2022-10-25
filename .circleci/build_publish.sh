#! /bin/sh
build_and_publish () {
  sed -i 's|"version":.*|"version": '\"$PACKAGE_VERSION\",'|g' package.json || exit 1
  npm run pub -- $ISDRYRUN || exit 1
}
PACKAGE_VERSION=$(echo $CIRCLE_TAG | sed 's/v//') || exit 1
cd /home/app
echo 'Publish ESLintConfig'
build_and_publish
cd /home/app/Frontend
echo 'Publish ESLintConfig Frontend'
build_and_publish
cd /home/app/Backend
echo 'Publish ESLintConfig Backend'
build_and_publish
cd /home/app
echo 'Done'