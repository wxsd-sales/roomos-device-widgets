FROM node:18-alpine AS build

WORKDIR /app

RUN apk add libc6-compat

COPY package.json ./
COPY package-lock.json ./
RUN npm install --loglevel verbose

COPY . ./

CMD npm run start

