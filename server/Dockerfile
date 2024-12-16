## Build Stage ##
FROM node:20.18-alpine AS build
WORKDIR /app
COPY . .
RUN yarn
RUN  yarn build
## Run Stage ##
FROM node:20.18-alpine
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --from=build --chown=node:node /app/build/ ./build/
COPY --from=build --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json ./
USER node
CMD ["yarn", "production"]