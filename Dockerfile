# syntax=docker/dockerfile:1

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

# Install pnpm
RUN corepack enable && \
	corepack prepare pnpm@10.32.0 --activate

WORKDIR ${PROJECT_DIR}

##############################################################################
# Stage 2: Run build on project files
FROM base-image AS prod-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR

# Set user to "root" for the subsequent commands being run
USER "root"

# Set up npm registry using helper script and GitHub auth token secret
RUN --mount=type=secret,id=GITHUB_AUTH_TOKEN \
	export GITHUB_AUTH_TOKEN=$(cat /run/secrets/GITHUB_AUTH_TOKEN) && \
	setup-npm-registry.sh

# Copy source code to project directory
COPY . ${PROJECT_DIR}/

# Install dependencies
RUN pnpm install --frozen-lockfile

##############################################################################
# Stage 3: Create app image
FROM base-image AS dev-image
##############################################################################

# Include global arg in this stage of the build
ARG PROJECT_DIR
ARG ENTRYPOINT_DIR

# Set user to "root" for the subsequent commands being run
USER "root"

# AI agents always try first to use `rg`, so we install this dependency:
# `rg` vs `grep` for coding agents -> https://www.codeant.ai/blogs/why-coding-agents-should-use-ripgrep
RUN apt-get update && \
	apt-get install -y ripgrep

# Create the entrypoint directory
RUN mkdir -p "${ENTRYPOINT_DIR}"

# Create the script for the entrypoint
RUN echo "#!/bin/sh" >> ${ENTRYPOINT_DIR}/entry_point.sh
# Set current directory with the project directory
RUN echo "cd ${PROJECT_DIR}" >> ${ENTRYPOINT_DIR}/entry_point.sh
RUN echo "tail -f /dev/null" >> ${ENTRYPOINT_DIR}/entry_point.sh

# Make the script executable
RUN chmod +x ${ENTRYPOINT_DIR}/entry_point.sh

ENTRYPOINT [ "/home/docker/entry_point.sh" ]
