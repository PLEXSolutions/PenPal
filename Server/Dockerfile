FROM debian:buster-slim

RUN apt-get update
RUN apt-get install curl -y

# Install node.js
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sL https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    sudo git-core build-essential openssl libssl-dev \
    procps entr nodejs python mongodb-org file lsof \
    netcat

RUN mkdir -p /data/db

# Install npm
RUN curl -L https://npmjs.org/install.sh | sh
RUN npm install -g npm

# Workaround for untar not working on docker overlayFS. Needed for meteor install
RUN apt-get install -y --no-install-recommends bsdtar
RUN ln -sf $(which bsdtar) $(which tar)

# Create an unpriv user for meteor to run as
RUN groupadd -r node
RUN useradd --no-log-init -r -g node node
RUN cp -rT /etc/skel /home/node
RUN chown -R node:node /home/node
RUN echo 'node ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Make our source directory and chown it to the new user
RUN mkdir /app
RUN chown node:node /app

# Make /app the working directory
WORKDIR /app

# Also setup the environment for "production"
RUN mkdir /app-production
RUN chown node:node /app-production
RUN chown -R node:node /data/db

# Drop privs to the node user
USER node

# Install meteor
RUN curl https://install.meteor.com/ | sh

# Update path so we don't need to put meteor into /usr/bin/meteor
ENV PATH="${PATH}:/home/node/.meteor"

USER node
COPY --chown=node:node src/package.json /app/package.json

# Importantly run npm install for the bundled version of npm that's with meteor.
# You need to do this instead of "new" npm native because otherwise certain modules
# will compile or download the wrong native binaries based on the node version that
# is bundled.
RUN meteor npm install

# Now copy all of the src into /app
COPY --chown=node:node src/ /app

# Do this build to install all relevant packages to reduce build times in development mode
# Note that this ignores errors.
RUN meteor update
RUN EXIT=1 meteor run --once; exit 0

RUN export BIND_IP=0.0.0.0
EXPOSE 3000
EXPOSE 9229

# For `docker run CONTAINER_ID`
COPY ./docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
