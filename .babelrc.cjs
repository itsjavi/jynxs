/* eslint-disable @typescript-eslint/no-var-requires */

const plugins = [["@babel/plugin-proposal-class-properties"]]
const defaultConfig = { plugins }

// Babel config for Jest tests
const jestConfig = {
  plugins,
  presets: [
    [
      "@babel/preset-env",
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
          importSource: "./src",
        },
      ],
    ],
    "@babel/preset-typescript",
  ],
  ignore: ["node_modules"],
  sourceMaps: "inline",
  comments: true,
}

module.exports = process.env.NODE_ENV === "test" ? jestConfig : defaultConfig
