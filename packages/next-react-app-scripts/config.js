const path = require('path');
const fs = require('fs');
const withCSS = require('@zeit/next-css');
const camelCase = require('camelcase');

const paths = require('./utils/paths');
const packageJSON = require(paths.packageJSON);

module.exports = withCSS({
  distDir: path.join('..', '..', 'build'),
  assetPrefix: process.env.PUBLIC_URL || '',
  generateBuildId: async () => {
    process.env.NEXT_BUILD_ID = Date.now();

    return process.env.NEXT_BUILD_ID;
  },
  webpack: function (config, options) {
    if (packageJSON.name) {
      config.output.jsonpFunction =
        'webpackJsonp' + camelCase(packageJSON.name, { pascalCase: true });
    }

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
