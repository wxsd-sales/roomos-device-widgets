FROM node:18-slim AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --loglevel verbose

COPY . ./
RUN npm run build
RUN node --experimental-modules --experimental-specifier-resolution=node --loader ts-node/esm ./node_modules/.bin/mikro-orm migration:up

CMD ["sh", "-c", "node -r dotenv-expand/config ./build"]
