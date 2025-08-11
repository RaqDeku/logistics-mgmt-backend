FROM node:20-alphine AS dev-dependancies-env

COPY . /app
WORKDIR /app
RUN npm ci


FROM node:20-alphine AS prod-dependancies-env

COPY . /package.json package-lock.json ./app
WORKDIR /app
RUN npm ci --omit=dev

# Builder
FROM node:20-alpine AS build-env

COPY . /app/
COPY --from=dev-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

# Final Image
FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=prod-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/dist /app/dist
WORKDIR /app

CMD ["npm", "run", "start"]