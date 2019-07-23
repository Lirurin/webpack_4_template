const path = require('path')
const fs = require('fs')
const MiniCssExtractPlagin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default


const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        // filename: `${PATHS.assets}js/[name].[hash].js`,
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    optimization: {
        minimize: false, // stop js minimization
        splitChunks: { // chunks
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [{
            test: /\.pug$/,
            loader: 'pug-loader',
            query: {
                pretty: true
            }
        },{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        },{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loader: {
                    stylus: 'vue-style-loader!css-loader!stylus-loader'
                }
            }
        },{
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                },
            ]
        },{
            test: /\.css$/,
            use: [
                "style-loader",
                MiniCssExtractPlagin.loader,
                {
                    loader: 'css-loader',
                    options: { sourceMap: true}
                },{
                    loader: 'postcss-loader',
                    options: { sourceMap: true, config: { path: `${PATHS.src}/js/config/postcss.config.js` } }
                }
            ]
        }, {
            test: /\.styl$/,
            use: [
                "style-loader",
                MiniCssExtractPlagin.loader, 
                {
                    loader: 'css-loader',
                    options: { sourceMap: true}
                },{
                    loader: 'postcss-loader',
                    options: { sourceMap: true, config: { path: `${PATHS.src}/js/config/postcss.config.js` } }
                },{
                    loader: 'stylus-loader',
                    options: { sourceMap: true}
                }
            ]
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js' 
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlagin({
            // filename: `${PATHS.assets}css/[name].[hash].css`
            filename: `${PATHS.assets}css/[name].css` 
        }),
        new CopyWebpackPlugin([
            { from: `${PATHS.src}/img`, to: `${PATHS.assets}img` },
            { from: `${PATHS.src}/fonts`, to: `${PATHS.assets}fonts` },
            { from: `${PATHS.src}/static`, to: '' }
        ]),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
        })),
        new ImageminPlugin({ 
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '65-80'
            },
            optipng: {
                optimizationLevel: 4
            },
            jpegtran: {
                progressive: true
            }
        }),
        // progress bar for some convenience
        new ProgressBarPlugin() 
    ]
}