'use strict';

const startTime = Date.now();

// We always run build for production environment
process.env.NODE_ENV = 'production';
// We always run build for production environment
process.env.FORCE_COLOR = 1;

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const eslint = require('eslint');

const ncp = require('../utils/ncp');
const paths = require('../utils/paths');
const mkdirp = require('../utils/mkdirp');

const nextBuild = require('next/dist/server/build').default;
let nextConfig = require('../config');

// Lint the whole project
console.log(chalk.green('Running ESLint on the ', chalk.inverse('./src'), ' folder.'));
console.log();

let eslintConfig = require('../template/.eslintrc.js');
if (fs.existsSync(paths.eslint)) {
  console.log('> An ESLint config was found, using it instead of the default one.');
  console.log();
  eslintConfig = require(paths.eslint);
}

if (process.env.CI === 'true') {
  console.log(chalk.yellow('Treating warnings as errors because process.env.CI = true.'));
  console.log(chalk.yellow('Most CI servers set it automatically.'));
  console.log();
}

const eslintEngine = new eslint.CLIEngine({ rules: eslintConfig });
const eslintResult = eslintEngine.executeOnFiles([paths.appSrc]);

eslintResult.results.forEach(function(result) {
  if (result.messages.length) {
    console.log(chalk.inverse(result.filePath.replace(paths.appSrc, './src')));

    result.messages.forEach(function(message) {
      console.log(
        chalk.bold(`  Line ${message.line}:`),
        message.message,
        message.severity > 1
          ? chalk.underline.red(message.ruleId)
          : chalk.underline.yellow(message.ruleId)
      );
    });
    console.log();
  }
});

// Check if stopping the Build because of errors
let eslintStopBuild = eslintResult.errorCount > 0;
if (process.env.CI === 'true') {
  eslintStopBuild = eslintResult.warningCount > 0 ? true : eslintStopBuild;
}
if (eslintStopBuild) {
  console.log(chalk.red('Errors detected, stopping the build.'));
  console.log();
  process.exit(1);
} else {
  console.log(chalk.green('Project linting passed successfully.'));
  console.log();
}

// Building the app
console.log(chalk.green('Creating production build...'));
console.log();

// If a custom config was created, use that one instead
if (fs.existsSync(paths.nextConfig)) {
  console.log('> A NextJS config was found, using it instead of the default one.');
  console.log();
  nextConfig = require(paths.nextConfig);
}

nextBuild(paths.appClient, nextConfig)
  .then(() => {
    console.log();

    if (process.env.PUBLIC_URL) {
      console.log(chalk.green('Creating public files...'));
      console.log();

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
    console.log(chalk.green(`Built in: ${((Date.now() - startTime) / 1000).toFixed(2)}s.`));
    console.log();
  })
  .catch(err => {
    console.error(err);
  });
