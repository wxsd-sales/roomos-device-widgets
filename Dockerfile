FROM node:18-slim AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --loglevel verbose

COPY . ./
RUN node --experimental-modules --experimental-specifier-resolution=node --loader ts-node/esm ./node_modules/.bin/mikro-orm migration:up
RUN npm run build

CMD ["sh", "-c", "npx vite preview --host 0.0.0.0 --port 3000"]
