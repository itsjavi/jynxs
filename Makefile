default: build

deps:
	yarn install

build:
	yarn run build

dev:
	npm run dev

test: test-typecheck test-compile test-mocha

test-typecheck:
	tsc --noEmit


test-compile:
	rm -rf ./tests-compiled
	
	babel --config-file=./babel.config.json ./src/jsx-runtime/index.ts \
 		  --retain-lines > ./src/jsx-runtime/index.mjs
	
	babel --config-file=./tests/babel.config.json ./tests -x '.jsx' \
		  --retain-lines -d ./tests-compiled --out-file-extension=.mjs

test-mocha:
	mocha --require \"@babel/register\" 'tests-compiled/**/*.test.mjs'

.PHONY: build dev
