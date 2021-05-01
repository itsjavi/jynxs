default: build

build:
	npm run build

dev:
	npm run dev

test-compile:
	rm -rf ./tests-compiled
	# tsc --build ./tests/tsconfig.json ./tests
	babel --config-file=./babel.config.json ./src -x '.ts' --retain-lines -d ./src --out-file-extension=.mjs
	babel --config-file=./babel.config.test.json ./tests -x '.jsx' \
		--retain-lines -d ./tests-compiled --out-file-extension=.mjs

test-mocha:
	mocha --require \"@babel/register\" 'tests-compiled/**/*.test.mjs'

.PHONY: build dev
