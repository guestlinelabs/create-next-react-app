'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
module.exports = {
  eslint: resolveApp('.eslintrc.js'),
  packageJSON: resolveApp('package.json'),
  dotenv: resolveApp('.env'),
  nextConfig: resolveApp('src/client/next.config.js'),
  testsSetup: resolveApp('src/setupTests.js'),

  appSrc: resolveApp('src'),
  appClient: resolveApp('src/client'),
  appServerFile: resolveApp('src/server.js'),

  build: resolveApp('build')
};
