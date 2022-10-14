FROM node:14.19

# make the 'app' folder the current working directory
WORKDIR /home/app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./home/app

COPY .npmrc ./home/app

# install project dependencies
RUN npm install

RUN rm -f .npmrc

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Install the Doppler CLI
# Does not rely on package managers
# Recommended for ephemeral environments (e.g. CI jobs)
# Supports Linux, BSD, and macOS

# Requires Curl & GnuPG:
#        Alpine: apk add curl gnupg
#   CentOS/RHEL: yum install -y curl gnupg
# Ubuntu/Debian: apt install -y curl gnupg
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh