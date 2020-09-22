FROM node:latest

RUN npm install -g webpack webpack-dev-server

WORKDIR /app
COPY src/package.json /app

RUN npm i react react-dom monaco-editor
RUN npm i -D monaco-editor-webpack-plugin worker-loader css-loader file-loader
RUN npm install

COPY src /app

EXPOSE 1568

CMD [ "npm", "run", "start" ]
