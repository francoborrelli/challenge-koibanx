FROM node:20-slim

ENV TZ=America/Argentina/Buenos_Aires

RUN apt-get update && apt install -y --no-install-recommends curl

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.json .eslintrc.cjs ./

RUN yarn install

EXPOSE 3000

