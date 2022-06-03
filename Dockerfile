ARG NODE_IMAGE=node:16.0.0-alpine

FROM $NODE_IMAGE AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
RUN npm install -g nodemon
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS frontend
COPY --chown=node:node ./fe/package*.json ./
COPY --chown=node:node ./fe/yarn.lock ./
RUN yarn --pure-lockfile install --ignore-engines
COPY --chown=node:node ./fe .

FROM base AS bff
COPY --chown=node:node ./bff/package*.json ./
COPY --chown=node:node ./bff/yarn.lock ./
RUN yarn --pure-lockfile install --ignore-engines
COPY --chown=node:node ./bff .

FROM base AS account
COPY --chown=node:node ./account/package*.json ./
COPY --chown=node:node ./account/yarn.lock ./
RUN yarn --pure-lockfile install --ignore-engines
COPY --chown=node:node ./account .

FROM base AS backlog
COPY --chown=node:node ./backlog/package*.json ./
COPY --chown=node:node ./backlog/yarn.lock ./
RUN yarn --pure-lockfile install --ignore-engines
COPY --chown=node:node ./backlog .

FROM base AS clockify
COPY --chown=node:node ./clockify/package*.json ./
COPY --chown=node:node ./clockify/yarn.lock ./
RUN yarn --pure-lockfile install --ignore-engines
COPY --chown=node:node ./clockify .

