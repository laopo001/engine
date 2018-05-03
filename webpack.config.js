var webpack = require('webpack');
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = function (env, webpackConfig) {
    if (env) {
        if (env.demo === 0) {
            env.demo = '';
        }
    } else {
        env = { demo: '' }
    }
    console.log('./demo/index' + env.demo)
    return {
        //页面入口文件配置
        entry: {
            index: './demo/index' + env.demo
        },
        //入口文件输出配置
        output: {
            path: path.resolve(__dirname, 'build/output'),
            filename: '[name].js'
        },
        //插件项
        plugins: [
            new BrowserSyncPlugin({
                // proxy: 'localhost:80',//要代理的端口
                host: 'localhost',
                port: 5000,
                server: { baseDir: ['build/output'] }
            }),

        ],
        module: {
            //加载器配置
            loaders: [
                {
                    test: /\.tsx?$/, loader: 'ts-loader', options: {
                        configFile: 'tsconfig.json'
                    }
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
            }
        },
        externals: {

        },
        devtool: 'source-map'
    };
}