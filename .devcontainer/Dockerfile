#  Use -bullseye variants on local arm64/Apple Silicon.
FROM node:16-bullseye as node-dev 
ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV PATH = "$PATH:/usr/src/app/node_modules/.bin"

RUN apt-get update && \
    apt-get install -y git zsh

RUN git config --global user.email "noone@noone.local" && \
    git config --global user.name "No one" && \
    git config --global pull.rebase false

RUN npm install npm@latest -g

# enables yarn and pnpm:
RUN corepack enable

ENTRYPOINT [ "exec" ]

WORKDIR /usr/src/app

