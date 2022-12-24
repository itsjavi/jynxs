# @itsjavi/jsx-runtime

[![npm](https://img.shields.io/npm/v/@itsjavi/jsx-runtime.svg)](https://www.npmjs.com/package/@itsjavi/jsx-runtime)
[![Build Status](https://github.com/itsjavi/jsx-runtime/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/itsjavi/jsx-runtime/actions/workflows/test.yml)

Extremely lightweight JSX runtime (~ 2 KiB when minified) compatible with TypeScript and JavaScript, 
to be used together with [Bable automatic JSX runtime](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-automatic-runtime).


## Why another React clone?
Compared to other solutions like `Preact` and `Inferno`, which are an alternative to all React features, 
this project just focuses on minimalism: a simple zero-dependency (except transpiler packages) JSX runtime with 
basic features to build small components that require some JavaScript like: 
form controls, context menus, modal forms, pop ups, color pickers, etc.

The idea is that the final build of your component will be standalone, with zero dependencies 
and able to be integrated into any app. `microbundle` is a good zero-configuration bundler for 
projects like that.

If you only need to be able to write JSX and bind some events, this library might be what you are looking for.
If you need more complex functionality (state, hooks, etc.) you may want to use other solutions like React,
Preact, etc.

## Designed Features

- JSX Runtime written in TypeScript to ensure 100% compatibility
- Minimal size (~2KiB minified), perfect for standalone UI packages
- Can be used in the browser, node or electron apps (multi target builds)
- Class components and props support
- Function components support (experimental)
- props.children support (experimental)
- Simple `onWillMount` and `onDidMount` component life-cycle methods (experimental)
- The `className` attribute supports an array of classes (will be auto-joined)
- Event functions are automatically bound to the component's "`this`".


## Install

```bash
npm i -D @itsjavi/jsx-runtime
```

or

```bash
yarn add -D @itsjavi/jsx-runtime
```

## Configuration

The most important part is to configure `@babel/plugin-transform-react-jsx` correctly,
which will be the one detecting this library and using it to transform JSX / TSX to JS.

These example configurations showcase a setup with Babel, Webpack, TypeScript and CSS loaders.

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

```json5
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
    "sourceMap": true,
    "moduleResolution": "Node" // important to find the proper JSX types on type check when writing TSX
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

## Usage

Examples:

```tsx
import { Component } from '@itsjavi/jsx-runtime'

function fnComp ({ a, b, children }: { a: number, b: number, children: any }): JSX.Element {
  return <div>hey{a}, {b} <br/>{children}</div>
}

class PointInfo extends Component {
  constructor (public props: { x: number, y: number }) {
    super(props);
  }

  onClickFn (e: Event) {
    console.log("I am an example button", this, e)
  }

  render () {
    const { x, y } = this.props
    return (<div>{x} + {y}
      <button onClick={this.onClickFn}>Example button</button>
    </div>)
  }
}

export default class Point extends Component {
  private ratio: number

  constructor (public props: { x: number, y: number }) {
    super(props)
    this.ratio = this.props.y / this.props.y
    this.onClickFn.bind(this)
  }


  onClickFn (e: Event) {
    console.log('You clicked me!', this, e, e.target)
  }

  render () {
    const { x, y } = this.props

    return <div id="demo" className={['xx', 'yx']}>
      <p>
        Lorem
        <b>
          ipsum
          <i>dolor</i>
        </b>
      </p>
      <div>sit</div>
      <hr/>
      <>
        amet
      </>
      <fnComp className="discarded-attribute">hello world</fnComp>
      <PointInfo x={x} y={y}/>
      <button className={['btn', 'btn-primary']} onClick={this.onClickFn}>Click me</button>
    </div>
  }
}

```
