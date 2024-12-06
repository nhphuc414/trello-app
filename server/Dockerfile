## Build Stage ##
FROM node:20.18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN ["yarn", "install"]

COPY . .

RUN  ["yarn", "build"]
## Run Stage ##
FROM node:20.18-alpine AS production
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=build /app/build ./build
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/yarn.lock .
COPY --chown=node:node --from=build /app/package.json .

EXPOSE 8017

CMD ["yarn", "production"]