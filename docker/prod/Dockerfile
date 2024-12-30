FROM node:20-slim

ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl

COPY package.json yarn.lock tsconfig.json .eslintrc.cjs jest.config.js nodemon.json  ./

COPY .envs/.production/.api .env

RUN yarn --pure-lockfile

COPY ./src ./src

RUN yarn run build

EXPOSE 3000
