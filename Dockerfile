FROM docker.io/node:12-alpine AS base

RUN apk add --no-cache \
    git \
    # npm package system dependencies
    autoconf \
    automake \
    build-base \
    libpng-dev \
    pngquant

RUN apk add --no-cache libc6-compat mesa-dev mesa libxi gcc libtool nasm

WORKDIR /prebuilt
COPY package.json .
RUN npm install

WORKDIR /publisher
ENTRYPOINT cp -r /prebuilt/node_modules /publisher/ && \
    npm install && \
    npm run start

EXPOSE 18400
