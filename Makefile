default: build

build:
	npm run build

dev:
	npm run dev

test-compile:
	rm -rf ./tests-compiled
	babel --config-file=./babel.config.json ./src/jsx-runtime/index.ts \
 		  --retain-lines > ./src/jsx-runtime/index.mjs
	babel --config-file=./tests/babel.config.json ./tests -x '.jsx' \
		  --retain-lines -d ./tests-compiled --out-file-extension=.mjs

test: test-compile
	mocha --require \"@babel/register\" 'tests-compiled/**/*.test.mjs'

.PHONY: build dev
