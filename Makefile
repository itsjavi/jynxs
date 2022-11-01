default: build

install:
	yarn install

build:
	yarn run build

test:
	yarn test

.PHONY: build dist src

