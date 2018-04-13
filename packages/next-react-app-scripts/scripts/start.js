'use strict';

const fs = require('fs');
const spawn = require('cross-spawn');

const paths = require('../utils/paths');

// If no environment was specified, we use the dev environment.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// We use this port if none other was specified
if (!process.env.PORT) {
  process.env.PORT = 3000;
}

if (!fs.existsSync(paths.appServerFile)) {
  console.error('> No server file found in "src/server.js".');
  process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    require('react-dev-utils/openBrowser')(`http://localhost:${process.env.PORT}`);
  }, 4000);
}

spawn('node', [paths.appServerFile], { stdio: 'inherit' });
