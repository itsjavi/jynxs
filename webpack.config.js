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
        name: 'jsx-runtime',
        entry: ['./src/jsx/jsx-runtime.tsx','./src/jsx/jsx-definitions.ts'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'jsx-runtime.js'
        },
    }),
    Object.assign({}, baseConfig, {
        name: 'demo',
        entry: './src/demo/index.ts',
        output: {
            path: path.resolve(__dirname, 'tmp/demo'),
            filename: 'demo.js'
        },
        devServer: {
            open: true,
            host: 'localhost'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/demo/index.html'
            })

            // Add your plugins here
            // Learn more obout plugins from https://webpack.js.org/configuration/plugins/
        ],
    })
]
