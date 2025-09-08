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

  # --- Base Package ---
  cd /home/app
  echo "Preparing base package: $BASE_PACKAGE_NAME"
  sed -i 's|"version":.*|"version": '\"$PACKAGE_VERSION\",'|g' package.json
  npm install # Install only base dependencies
  build_package
  echo "Creating tarball for base package..."
  BASE_PACKAGE_TARBALL=$(npm pack | tail -n 1)
  echo "Created $BASE_PACKAGE_TARBALL"

  # --- Frontend Package ---
  cd /home/app/Frontend
  echo "Preparing Frontend package"
  sed -i 's|"version":.*|"version": '\"$PACKAGE_VERSION\",'|g' package.json
  echo "Updating and installing dependencies for Frontend package..."
  npm install --save "/home/app/${BASE_PACKAGE_TARBALL}"
  npm install # Install any other dependencies
  build_package

  # --- Backend Package ---
  cd /home/app/Backend
  echo "Preparing Backend package"
  sed -i 's|"version":.*|"version": '\"$PACKAGE_VERSION\",'|g' package.json
  echo "Updating and installing dependencies for Backend package..."
  npm install --save "/home/app/${BASE_PACKAGE_TARBALL}"
  npm install # Install any other dependencies
  build_package

  # --- Publish all packages ---
  echo "All packages built successfully. Now publishing..."
  cd /home/app
  publish_package
  cd /home/app/Frontend
  publish_package
  cd /home/app/Backend
  publish_package

else
  # ---------------------------------------------------
  # VALIDATION LOGIC (for normal branch pushes)
  # ---------------------------------------------------
  echo "Running in VALIDATION mode (no tag found)."

  cd /home/app
  echo "Installing all workspace dependencies..."
  # This single command installs dependencies for all packages
  # and symlinks local packages (@sosocio/eslint-config, frontend, backend)
  npm install

  echo "Building all packages..."
  # Use -w to run the build script in a specific workspace
  npm run build
  npm run build -w @sosocio/eslint-config-frontend
  npm run build -w @sosocio/eslint-config-backend
fi

echo 'Done'
