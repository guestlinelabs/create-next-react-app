const paths = require('./utils/paths');
const path = require('path');
require('dotenv').config({
  silent: true,
  path: paths.dotenv
});

const packageJSON = require(paths.packageJSON);
const templatePackageJSON = require('./template/.template.package.json');

const {
  PUBLIC_URL,
  NEXT_BUILD_ID
} = process.env;

process.env.ASSET_PREFIX = '/_next';
if (PUBLIC_URL && NEXT_BUILD_ID) {
  process.env.ASSET_PREFIX = `${PUBLIC_URL}/_next/${NEXT_BUILD_ID}`;
}

const envVars = Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_APP_'))
  .reduce((acc, key) => {
    acc[`process.env.${key}`] = process.env[key];
    return acc;
  }, {});
envVars['process.env.ASSET_PREFIX'] = process.env.ASSET_PREFIX;

module.exports = {
  presets: [
    ['next/babel', {
      'preset-env': {
        targets: packageJSON.targets || templatePackageJSON.targets
      }
    }]
  ]
};