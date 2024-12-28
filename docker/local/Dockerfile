FROM node:20-slim

ENV TZ=America/Argentina/Buenos_Aires

RUN apt-get update && apt install -y --no-install-recommends curl

WORKDIR /app

# RUN chown node:node /app
# USER node

COPY package.json yarn.lock tsconfig.json .eslintrc.cjs wait-for-it.sh ./

RUN chmod +x wait-for-it.sh

RUN yarn install

EXPOSE 3000

