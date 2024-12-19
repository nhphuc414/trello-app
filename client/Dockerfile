## Build stage ##
FROM node:20.18-alpine AS build
WORKDIR /app
COPY . . 
RUN yarn
RUN yarn build

# Run Stage ##
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown nginx:nginx . /etc/nginx/nginx.conf
RUN chmod 750 . /etc/nginx/nginx.conf
