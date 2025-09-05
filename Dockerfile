# Define custom function directory
ARG PROJECT_DIR="/home/app"
ARG ENTRYPOINT_DIR="/home/docker"

##############################################################################
# Stage 1: Install dependencies
FROM fasteditor/fasteditor-base AS base-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR

RUN mkdir -p ${PROJECT_DIR}
RUN mkdir -p ${PROJECT_DIR}/dist

WORKDIR ${PROJECT_DIR}

# Copy source code to project directory
COPY . ${PROJECT_DIR}/

##############################################################################
# Stage 2: Run build on project files
FROM base-image AS prod-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR
ARG GITHUB_AUTH_TOKEN

# Set user to "root" for the subsequent commands being run
USER "root"

# Set up npm registry using helper script
RUN setup-npm-registry.sh

# Set working directory to the App directory
# Install dependencies
RUN npm install

##############################################################################
# Stage 3: Create app image
FROM base-image as dev-image
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