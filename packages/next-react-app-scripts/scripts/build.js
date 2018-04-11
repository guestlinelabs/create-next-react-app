'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const ncp = require('../utils/ncp');
const paths = require('../utils/paths');
const mkdirp = require('../utils/mkdirp');

const nextBuild = require('next/dist/server/build').default;
let nextConfig = require('../next/config');

// We always run build for production environment
process.env.NODE_ENV = 'production';

// If a custom config was created, use that one instead
if (fs.existsSync(paths.nextConfig)) {
  console.log('> A config was found, using it instead of the default one.\n');
  nextConfig = require(paths.nextConfig);
}

console.log(chalk.green('Creating production build...\n'));

nextBuild(paths.appClient, nextConfig)
  .then(() => {
    if (process.env.PUBLIC_URL) {
      console.log(chalk.green('\nCreating public files...\n'));

      const buildId = fs.readFileSync(path.join(paths.build, 'BUILD_ID')).toString();
      const publicPath = path.join(paths.build, 'public', '_next', buildId);

      return Promise.resolve()
        .then(() =>
          Promise.all([
            mkdirp(publicPath),
            mkdirp(path.join(publicPath, 'page')),
            mkdirp(path.join(publicPath, 'static'))
          ])
        )
        .then(() =>
          Promise.all(
            [
              {
                source: path.join(paths.build, 'main.js'),
                destination: path.join(paths.build, 'public', '_next', buildId, 'main.js')
              },
              {
                source: path.join(paths.build, 'bundles', 'pages'),
                destination: path.join(paths.build, 'public', '_next', buildId, 'page')
              },
              {
                source: path.join(paths.build, 'static'),
                destination: path.join(paths.build, 'public', '_next', buildId, 'static')
              },
              {
                source: path.join(paths.appClient, 'static'),
                destination: path.join(paths.build, 'public', '_next', buildId, 'static')
              }
            ].map(({ source, destination }) => {
              return ncp(source, destination);
            })
          )
        );
    }
  })
  .then(() => {
    console.log(chalk.green('Done.\n'));
  })
  .catch(err => {
    console.error(err);
  });
