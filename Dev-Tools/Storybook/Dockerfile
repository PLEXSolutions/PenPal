FROM debian:buster-slim

RUN apt-get update
RUN apt-get install curl tar -y

# Install node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install git-core build-essential openssl libssl-dev procps entr nodejs python -y

# Install npm
RUN curl -L https://npmjs.org/install.sh | sh

# Create an unpriv user for meteor to run as
RUN groupadd -r node
RUN useradd --no-log-init -r -g node node
RUN cp -rT /etc/skel /home/node
RUN chown -R node:node /home/node

# Make our source directory and chown it to the new user
RUN mkdir /app
RUN chown node:node /app

USER node
WORKDIR /app

# Note that the docker build context needs to be in the parent directory of this file
COPY --chown=node:node Server/src/package.json /app/package.json
RUN npm install

# Now copy all of the src into /app
# Note that the docker build context needs to be in the parent directory of this file
COPY --chown=node:node Server/src/ /app

RUN export BIND_IP=0.0.0.0
EXPOSE 6006

# For `docker run CONTAINER_ID`
CMD npm run storybook
