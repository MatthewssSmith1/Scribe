const lodash = require('lodash')
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

function srcPaths(src) {
   return path.join(__dirname, src)
}

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'

//#region Common settings
const commonConfig = {
   devtool: isEnvDevelopment ? 'source-map' : false,
   mode: isEnvProduction ? 'production' : 'development',
   output: { path: srcPaths('dist') },
   node: { __dirname: false, __filename: false },
   resolve: {
      alias: {
         '@': srcPaths('src'),
      },
      extensions: ['.js', '.json', '.ts', '.tsx'],
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
         },
         {
            test: /\.(sa|sc|c)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
         },
         {
            test: /\.(jpg|png|svg|ico|icns)$/,
            loader: 'file-loader',
            options: {
               name: '[path][name].[ext]',
            },
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: 'file-loader',
         },
      ],
   },
}
//#endregion

const mainConfig = lodash.cloneDeep(commonConfig)
mainConfig.entry = './src/main.ts'
mainConfig.target = 'electron-main'
mainConfig.output.filename = 'main.bundle.js'
mainConfig.plugins = [
   new CopyPkgJsonPlugin({
      remove: ['scripts', 'devDependencies', 'build'],
      replace: {
         main: './main.bundle.js',
         scripts: { start: 'electron ./main.bundle.js' },
         postinstall: 'electron-builder install-app-deps',
      },
   }),
]

const rendererConfig = lodash.cloneDeep(commonConfig)
rendererConfig.entry = './src/renderer/renderer.tsx'
rendererConfig.target = 'electron-renderer'
rendererConfig.output.filename = 'renderer.bundle.js'
rendererConfig.plugins = [
   new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
   }),
]

module.exports = [mainConfig, rendererConfig]
