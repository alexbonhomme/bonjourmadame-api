FROM node:8.14-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .