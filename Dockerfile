FROM node:20-alpine AS dev-dependencies-env

COPY . /app
WORKDIR /app
RUN npm ci


FROM node:20-alpine AS prod-dependencies-env

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
RUN apt-get update && apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

COPY ./package.json package-lock.json /app/
COPY --from=prod-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/dist /app/dist
WORKDIR /app

CMD ["npm", "run", "start:prod"]