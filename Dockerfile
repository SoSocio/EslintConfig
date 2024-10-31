# Define custom function directory
ARG PROJECT_DIR="/home/app"
ARG ENTRYPOINT_DIR="/home/docker"

##############################################################################
# Stage 1: Install dependencies
FROM node:18-buster AS base-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR

# Update library references
RUN apt-get update

RUN mkdir ${PROJECT_DIR}
RUN mkdir ${PROJECT_DIR}/dist
WORKDIR ${PROJECT_DIR}

# Create .doppler directory and parents
RUN mkdir -p ~/.doppler

# Create circle ci .doppler directory and parents
RUN mkdir -p /home/circleci/.doppler

# Install the Doppler CLI
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

# Copy source code to project directory
COPY . ${PROJECT_DIR}/

# Create lib directory
RUN mkdir -p ${PROJECT_DIR}/lib

##############################################################################
# Stage 2: Run build on project files
FROM base-image AS build-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR

# Install dependencies
RUN apt-get install -y \
    groff \
	groff-base \
	less \
	python \
	rsync \
	python-pip

# Set the environment variable for the node '--global' installation directory
ENV NPM_CONFIG_PREFIX="/home/node/.npm-global"

# Add the global node bin directory to the PATH env variable
ENV PATH="$NPM_CONFIG_PREFIX/bin:$PATH"

# Add the node-jq bin directory to the PATH env variable
ENV PATH="$NPM_CONFIG_PREFIX/lib/node_modules/node-jq/bin:$PATH"

# Add the new PATH to a script in /etc/profile.d path
RUN echo "#!/bin/sh" >> /etc/profile.d/update_path.sh
RUN echo "export PATH=\"$PATH\"" >> /etc/profile.d/update_path.sh

# Make the script executable
RUN chmod +x /etc/profile.d/update_path.sh


#############################################################################
# Stage 3: Create production image
FROM build-image AS prod-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR
ARG GITHUB_AUTH_TOKEN

# Set user to "root" for the subsequent commands being run
USER "root"

# Remove .npmrc from project directory
RUN rm "${PROJECT_DIR}/.npmrc"

# Create .npmrc to project directory (required for @sosocio/eslint)
RUN echo "@sosocio:registry=https://npm.pkg.github.com/" >> "${PROJECT_DIR}/.npmrc"
RUN echo "//npm.pkg.github.com/:_authToken=$GITHUB_AUTH_TOKEN" >> "${PROJECT_DIR}/.npmrc"
# Create .npmrc to Frontend project directory (required for @sosocio/eslint)
RUN echo "@sosocio:registry=https://npm.pkg.github.com/" >> "${PROJECT_DIR}/Frontend/.npmrc"
RUN echo "//npm.pkg.github.com/:_authToken=$GITHUB_AUTH_TOKEN" >> "${PROJECT_DIR}/Frontend/.npmrc"
# Create .npmrc to Backend project directory (required for @sosocio/eslint)
RUN echo "@sosocio:registry=https://npm.pkg.github.com/" >> "${PROJECT_DIR}/Backend/.npmrc"
RUN echo "//npm.pkg.github.com/:_authToken=$GITHUB_AUTH_TOKEN" >> "${PROJECT_DIR}/Backend/.npmrc"
RUN npm config set @sosocio:registry https://npm.pkg.github.com

# Set working directory to the App directory
# Install dependencies
RUN npm install

# Set user to "node" for the subsequent commands being run
USER "node"

# Create the lib directory (and parents if needed) for the global node directory
RUN mkdir -p "$NPM_CONFIG_PREFIX/lib"

# Create the bin directory (and parents if needed) for the global node directory
RUN mkdir -p "$NPM_CONFIG_PREFIX/bin"

# Install as global to have it available.
RUN npm install -g prisma@4.3.0

# Install node-jq as global to have it available.
RUN npm install -g node-jq


# Set user to "root" for the subsequent commands being run
USER "root"

##############################################################################
# Stage 4: Create app image
FROM build-image as dev-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR
ARG ENTRYPOINT_DIR

# Copy .npmrc to project directory (required for @sosocio/lambda-utils)
COPY ./.npmrc "${PROJECT_DIR}/.npmrc"



# Set user to "root" for the subsequent commands being run
USER "root"

# Install Dependencies
RUN npm install


# Create the entrypoint directory
RUN mkdir -p "${ENTRYPOINT_DIR}"

# Create the script for the entrypoint
RUN echo "#!/bin/sh" >> ${ENTRYPOINT_DIR}/entry_point.sh

# Set current directory with the project directory
RUN echo "cd ${PROJECT_DIR}" >> ${ENTRYPOINT_DIR}/entry_point.sh

#Export DOPPLER_TOKEN into the environment
RUN echo "source ${PROJECT_DIR}/.env" >> ${ENTRYPOINT_DIR}/entry_point.sh

# Make the script executable
RUN chmod +x ${ENTRYPOINT_DIR}/entry_point.sh

ENTRYPOINT [ "/home/docker/entry_point.sh" ] 