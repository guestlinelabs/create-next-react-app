const path = require('path');
require('dotenv').config({ silent: true, path: './.env' });

const { PUBLIC_URL, NEXT_BUILD_ID } = process.env;

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
    [
      'env',
      {
        targets: {
          node: '8.9.4',
          browsers: ['last 2 versions', 'ie 11']
        }
      }
    ],
    ['next/babel']
  ],
  plugins: [
    [
      'transform-assets-import-to-string',
      {
        baseDir: '/static',
        baseUri: process.env.ASSET_PREFIX === '/_next' ? '' : process.env.ASSET_PREFIX
      }
    ],
    ['transform-define', envVars]
  ]
};
