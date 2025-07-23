FROM node

RUN npm install -g yarn --force

ARG APP_BASE_PATH

WORKDIR $APP_BASE_PATH

