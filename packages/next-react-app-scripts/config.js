const path = require('path');
const fs = require('fs');
const withCSS = require('@zeit/next-css');
const camelCase = require('camelcase');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const paths = require('./utils/paths');
const packageJSON = require(paths.packageJSON);

module.exports = withCSS({
  distDir: path.join('..', '..', 'build'),
  assetPrefix: process.env.PUBLIC_URL || '',
  generateBuildId() {
    process.env.NEXT_BUILD_ID = Date.now();

    return Promise.resolve(process.env.NEXT_BUILD_ID);
  },
  webpack(config, options) {
    if (packageJSON.name) {
      config.output.jsonpFunction =
        'webpackJsonp' + camelCase(packageJSON.name, { pascalCase: true });
    }

    config.plugins.push(
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        analyzerPort: options.isServer ? 8888 : 8889,
        openAnalyzer: false,
        reportFilename: `report-${options.isServer ? 'server' : 'client'}.html`,
        logLevel: 'error'
      })
    );

    const originalEntry = config.entry;
    config.entry = () => {
      return originalEntry().then(entries => {
        if (entries['main.js'] && fs.existsSync(paths.polyfills)) {
          entries['main.js'].unshift(paths.polyfills);
        }

        return entries;
      });
    };

    return config;
  }
});
