const path = require('path');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: path.join('..', '..', 'build'),
  assetPrefix: process.env.PUBLIC_URL || '',
  generateBuildId: async () => {
    process.env.NEXT_BUILD_ID = Date.now();

    return process.env.NEXT_BUILD_ID;
  }
});
