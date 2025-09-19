#! /bin/sh

set -e # Exit immediately if a command exits with a non-zero status.

# Check if this is a release build (triggered by a git tag)
if [ -n "$CIRCLE_TAG" ]; then
  # ---------------------------------------------------
  # RELEASE & PUBLISH LOGIC (when a tag is present)
  # ---------------------------------------------------
  echo "Running in RELEASE mode for tag: $CIRCLE_TAG"

  # Function to build a package
  build_package () {
    echo "Building package in $(pwd)..."
    npm run build || exit 1
  }

  # Function to publish a package
  publish_package () {
    echo "Publishing package in $(pwd)..."
    npm run pub -- $ISDRYRUN || exit 1
  }

  PACKAGE_VERSION=$(echo $CIRCLE_TAG | sed 's/v//')
  BASE_PACKAGE_NAME="@sosocio/eslint-config"

  if [ -z "$PUBLISH_TARGET" ]; then
    echo "ERROR: PUBLISH_TARGET must be set (base|frontend|backend) for release builds." >&2
    exit 1
  fi

  echo "Publish target: $PUBLISH_TARGET"

  case "$PUBLISH_TARGET" in
    base)
      cd /home/app
      echo "Preparing base package: $BASE_PACKAGE_NAME"
      sed -i 's|"version":.*|"version": '"$PACKAGE_VERSION",'|g' package.json
      npm install
      build_package
      publish_package
      echo "Base package published."
      ;;
    frontend)
      cd /home/app/Frontend
      sed -i 's|"version":.*|"version": '"$PACKAGE_VERSION",'|g' package.json
      sed -i 's|"@sosocio/eslint-config": *"[^"]*"|"@sosocio/eslint-config": '"\"$PACKAGE_VERSION\"",'|g' package.json
      npm install
      build_package
      publish_package
      echo "Frontend package published."
      ;;
    backend)
      cd /home/app/Backend
      sed -i 's|"version":.*|"version": '"$PACKAGE_VERSION",'|g' package.json
      sed -i 's|"@sosocio/eslint-config": *"[^"]*"|"@sosocio/eslint-config": '"\"$PACKAGE_VERSION\"",'|g' package.json
      npm install
      build_package
      publish_package
      echo "Backend package published."
      ;;
    *)
      echo "ERROR: Unknown PUBLISH_TARGET '$PUBLISH_TARGET' (expected base|frontend|backend)." >&2
      exit 1
      ;;
  esac

  exit 0

else
  # ---------------------------------------------------
  # VALIDATION LOGIC (for normal branch pushes)
  # ---------------------------------------------------
  echo "Running in VALIDATION mode (no tag found)."

  cd /home/app
  echo "Installing base package dependencies..."
  npm install

  echo "Building base package..."
  npm run build

  echo "Installing Frontend package dependencies..."
  cd /home/app/Frontend
  npm install
  echo "Building Frontend package..."
  npm run build || npm run build

  echo "Installing Backend package dependencies..."
  cd /home/app/Backend
  npm install
  echo "Building Backend package..."
  npm run build || npm run build
fi

echo 'Done'
