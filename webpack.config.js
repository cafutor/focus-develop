const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const entry = path.join(__dirname, '/page/react/index.view');
process.traceDeprecation = true;
let { NODE_ENV: nodeEnv } = process.env;

const optimizeMap = {
    development: false,
    production: true,
};

let webpackConObj = {
    mode: nodeEnv,
    // 源码...错误做映射
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'inline-source-map',
    context: path.join(__dirname),
    externals: {
        'react': 'React',
    },
    // devtool: 'eval',
    entry: {
        bundle: ['webpack-hot-middleware/client?name=bundle', entry],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].[hash].bundle.js',// dynamic import chunkname
        publicPath: '/'
    },
    optimization: {
        minimize: optimizeMap[nodeEnv],
    },
    plugins: [
        // 查看哪些依赖将被打包
        new webpack.NamedModulesPlugin(),
        // 开启热更新服务
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                // setof path or files
                include: [path.join(__dirname, 'page'), path.join(process.cwd(), 'src')],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        envName: 'NODE_ENV',
                        babelrc: nodeEnv === 'development' ? true : false,
                        presets: ['@babel/preset-typescript', '@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            // Stage 0
                            '@babel/plugin-proposal-function-bind',
                            '@babel/plugin-syntax-async-generators',
                            // Stage 1
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-logical-assignment-operators',
                            ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
                            ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
                            ['@babel/plugin-proposal-nullish-coalescing-operator', { 'loose': false }],
                            '@babel/plugin-proposal-do-expressions',
                            // Stage 2
                            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                            '@babel/plugin-proposal-function-sent',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-numeric-separator',
                            '@babel/plugin-proposal-throw-expressions',
                            // Stage 3
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-import-meta',
                            ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                        ],
                    },
                }],
            },
            {
                test: /\.view$/,
                // setof path or files
                include: [path.join(__dirname, 'page'), path.join(process.cwd(), 'src')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            envName: 'NODE_ENV',
                            babelrc: nodeEnv === 'development' ? true : false,
                            presets: ['@babel/preset-typescript', '@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                // Stage 0
                                '@babel/plugin-proposal-function-bind',
                                '@babel/plugin-syntax-async-generators',
                                // Stage 1
                                '@babel/plugin-proposal-export-default-from',
                                '@babel/plugin-proposal-logical-assignment-operators',
                                ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
                                ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
                                ['@babel/plugin-proposal-nullish-coalescing-operator', { 'loose': false }],
                                '@babel/plugin-proposal-do-expressions',
                                // Stage 2
                                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                                '@babel/plugin-proposal-function-sent',
                                '@babel/plugin-proposal-export-namespace-from',
                                '@babel/plugin-proposal-numeric-separator',
                                '@babel/plugin-proposal-throw-expressions',
                                // Stage 3
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-syntax-import-meta',
                                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                            ],
                        },
                    },
                    {
                        loader: 'focus-loader',
                        options: {},
                    }],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: nodeEnv === 'development',
                        },
                    },
                    // 'style-loader',//style-loader 需要将样式插入dom中，this way is not good;
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 0,
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',// prefix
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [require('autoprefixer')],
                        }
                    },
                    'sass-loader'
                ]
            },
        ]
    }
};
if (nodeEnv === 'development') {
    webpackConObj = Object.assign({}, webpackConObj, {
        externals: {}, resolve: {
            alias: {
                'react-dom': '@hot-loader/react-dom',
            }
        }
    });
} else {
    webpackConObj = Object.assign(webpackConObj, {
        entry: {
            bundle: [entry],
        },
    }, { externals: {} });
};
module.exports = webpackConObj;
