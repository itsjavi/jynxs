# jsx-runtime

Extremely lightweight JSX runtime (~ 2 KiB when minified) compatible with TypeScript and JavaScript, to be used together
with
[Bable automatic JSX runtime](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-automatic-runtime).

## Setup

This package is not yet published in npm, but you can install it via:

```bash
npm i -D @itsjavi/jsx-runtime
```

### Configuration

Example `babel.config.js`:

```json
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-typescript",
      {
        "isJSX": true,
        "allExtensions": true,
        "jsxPragma": "jsx",
        "jsxPragmaFrag": "'jsx.Fragment'"
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "throwIfNamespace": false,
        "runtime": "automatic",
        "importSource": "@itsjavi"
      }
    ]
  ],
  "comments": false
}
```

Example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "module": "ESNext",
    "target": "ESNext",
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable"
    ],
    "allowJs": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "strict": true,
    "sourceMap": true
  },
  "files": [
    "src/index.ts"
  ],
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

Example `webpack.config.js` (you can use other bundlers too):

```js
// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: ['/node_modules/'],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: ['/node_modules/'],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.(js|css)$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
        type: 'asset'
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  }
}

module.exports = [
  Object.assign({}, baseConfig, {
    name: 'my-component',
    devtool: 'inline-source-map',
    entry: ['./src/index.ts'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'my-component.js'
    }
  })
]
```

Example `package.json`:

```json
{
  "name": "my-component",
  "amdName": "myComponent",
  "private": true,
  "version": "0.0.1",
  "description": "My Component",
  "author": "",
  "license": "ISC",
  "main": "./dist/my-component.js",
  "module": "./dist/my-component.module.js",
  "esmodule": "./dist/my-component.modern.js",
  "exports": "./dist/my-component.modern.js",
  "umd:main": "./dist/my-component.umd.js",
  "source": "src/index.ts",
  "types": "src/index.d.ts",
  "scripts": {
    "test": "run-s test:*",
    "test:typecheck": "tsc --noEmit",
    "build": "run-s clean build:*",
    "build:webpack": "webpack --mode=development && webpack --mode=production",
    "build:tsc": "tsc --declaration --emitDeclarationOnly",
    "watch": "webpack --watch",
    "serve": "npm run clean && webpack serve",
    "clean": "rm -rf ./dist/*"
  },
  "devDependencies": {
    "@babel/cli": "^7.13.16",
    "@babel/core": "^7.13.16",
    "@babel/plugin-transform-react-jsx": "^7.13.12",
    "@babel/preset-env": "^7.13.15",
    "@babel/preset-typescript": "^7.13.0",
    "@itsjavi/jsx-runtime": "github:itsjavi/jsx-runtime",
    "autoprefixer": "^10.2.5",
    "babel-loader": "^8.2.2",
    "css-loader": "^5.2.4",
    "html-webpack-plugin": "^5.3.1",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.2.12",
    "postcss-loader": "^5.2.0",
    "source-map-loader": "^2.0.1",
    "style-loader": "^2.0.0",
    "typescript": "^4.2.4",
    "webpack": "^5.35.1",
    "webpack-cli": "^4.6.0",
    "webpack-dev-server": "^3.11.2"
  },
  "browserslist": [
    "defaults",
    "not IE 11"
  ]
}
```
