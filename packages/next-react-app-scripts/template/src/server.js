const path = require('path');
require('dotenv').config({ silent: true, path: path.resolve(__dirname, '..', '.env') });

const next = require('next');
const express = require('express');

const nextConfig = require('next-react-app-scripts/config');

const nextApp = next({
  dev: process.env.NODE_ENV !== 'production',
  dir: path.join(__dirname, 'client'),
  conf: nextConfig
});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.set('port', parseInt(process.env.PORT, 10) || 2000);

  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(app.get('port'), err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${app.get('port')}`);
  });
});
