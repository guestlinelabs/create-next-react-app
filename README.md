# guestline-scripts

This package includes a set of scripts that makes configuring a project easier.
It uses the eslint-config-guestline.
It includes built in test runner.

## Default Folder Structure

```
|_ build // Where the generated files will be added
|_ src
| |_ client
| |_ server
| |_ server.js
|_ .env
|_ .eslintrc.js // To inherit the ESLint config
|_ .gitignore
|_ .prettierrc.js // To inherit the Prettier config
|_ package.json
```

## ESLint

If you want to see the linting in your IDE, create a file named `.eslintrc.js` at the root of your project and copy/paste the following code inside it:

```js
// .eslintrc.js
module.exports = {
  extends: 'guestline'
};
```

That's it!

## Prettier

If you want to use Guestline's Prettier config in your project, follow those few steps:

* Install Prettier and a few other dependencies to process modified files on commit

```bash
npm i -D prettier husky lint-staged
```

```bash
yarn add -D prettier husky lint-staged
```

* Add those properties to your `package.json`

```js
// package.json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "{src}/**/*.{js,jsx,json,css}": ["prettier --write", "git add"]
  }
}
```

* Create a file named `.prettierrc.js` at the root of your project and copy/paste the following code inside it - this is to inherit the config:

```js
// .prettierrc.js
module.exports = require('prettier-config-guestline');
```

Done!

## Testing using Jest

All documentation regarding Jest can be found [here](https://facebook.github.io/jest).

To run your tests, add a new script in your `package.json`:

```js
// package.json
{
  "scripts": {
    "test": "guestline-scripts test --env=jsdom"
  }
}
```

Remove `--env=jsdom` if you do not run tests that need a `document` - e.g. node tests.

### Watch mode

By default running tests runs the watcher with interactive CLI. However, you can force it to run tests once and finish the process by setting an environment variable called CI.

Popular CI servers already set the environment variable CI by default but you can do this yourself too:

##### Windows (cmd.exe)

```cmd
set CI=true&&npm test
```

(Note: the lack of whitespace is intentional.)

##### Windows (Powershell)

```Powershell
($env:CI = $true) -and (npm test)
```

##### Linux, macOS (Bash)

```bash
CI=true npm test
```

### Initializing Test Environment

If your app uses a browser API that you need to mock in your tests or if you just need a global setup before running your tests, add a `src/setupTests.js` to your project. It will be automatically executed before running your tests.

For example:

```js
// src/setupTests.js
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
```

## NextJS

You can run your Next.js application using our simplified scripts.
It's super easy to setup:

### 1 - Install Next.js

```bash
npm i -S next
```

```bash
yarn add next
```

### 2 - The folder structure

On top of the folder structure described at the top, here is what your NextJS project should look like:

```
|_ src
| |_ client
| | |_ components
| | |_ pages
| | |_ static
| |_ server.js
|_ .babelrc // To inherit the Babel config
```

### 3 - Create your `server.js`

```js
// src/server.js
const path = require('path');
const next = require('next');
const express = require('express');

const nextApp = next({
  dev: process.env.NODE_ENV !== 'production'
  dir: path.join(__dirname, 'client'),
  conf: require('guestline-scripts/next/config')
});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.set('port', parseInt(process.env.PORT, 10) || 3000);

  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(app.get('port'), err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${app.get('port')}`);
  });
});
```

### 4 - Create the `.babelrc` file

```js
// .babelrc
{
  "presets": ["guestline-scripts/next/babel"]
}
```

### 5 - Create your scripts commands

```js
// package.json
"scripts": {
  "build": "guestline-scripts build",
  "start": "guestline-scripts start",
  "start:prod": "cross-env NODE_ENV=production guestline-scripts start"
}
```

### 6 - What is included

#### NextJS by default

We support all the default options that NextJS provides by using their `next/babel` configuration as a Babel preset.

#### Browser/NodeJS support

For browser/node.js compatibility we use `babel-preset-env` with the following option:

```js
{
  "targets": {
    "node": "8.9.4",
    "browsers": ["last 2 versions", "ie 11"]
  }
}
```

#### CSS

You can Next's bundled [styled-jsx](https://github.com/zeit/styled-jsx), but you can also import CSS files directly:

```js
// Any page/component/...
import React from 'react';
import './style.css';

export default function() {
  return <span className="my-class-name">Some text</span>;
}
```

For the CSS to be served to your application, you will however have to create a `_document.js` file in your `pages` folder:

```js
// src/client/pages/_document.js
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
```

#### Assets

Import your assets directly:

```js
// Any page/component/...
import React from 'react';
import logo from '../static/logo.png';

export default function() {
  return <img src={logo} alt="logo" />;
}
```

#### Environment variables available on the client side

Your project can consume variables declared in your environment as if they were declared locally in your JS files. By default you will have `NODE_ENV` defined for you, and any other environment variables starting with `NEXT_APP_`.

```yaml
// .env
NEXT_APP_TEST=abc
```

```js
// Any page/component/...
import React from 'react';

export default function() {
  return <span>{process.env.NEXT_APP_TEST}</span>;
}
```

> Note: You must create custom environment variables beginning with `NEXT_APP_`. Any other variables except `NODE_ENV` will be ignored to avoid accidentally **exposing a private key on the machine that could have the same name**. Changing any environment variables will require you to restart the development server if it is running.

#### Leverage assets using CDN

Using a CDN is just an example, it could be that you want to host your JS/CSS/Static files on a different server or just a different domain.

It will work automatically for `src/client/static` files that you import directly into your code, but you will have to make a small change to your CSS.
To make that happen, you need:

* To create the `PUBLIC_URL` variable and use it as such:

```yaml
// .env
PUBLIC_URL=https://cdn.net/some/path
```

```js
// src/client/pages/_document.js

// Change
<link rel="stylesheet" href="/_next/static/style.css" />

// To
<link rel="stylesheet" href={`${process.env.ASSET_PREFIX}/static/style.css`} />
```

```js
// Any page/component/...
import React from 'react';
import logo from '../static/logo.png';

export default function() {
  return <img src={logo} alt="logo" />;
}
```

> Note: CSS and Static files do not work yet. We're waiting on NextJS to publish their next version for that. Once released, it will start working automatically.

After those changes are made, you just need to upload the content of `build/public` and serve those files from where ever you want.

#### Customize the port

Customize the port your application will be running on by declaring a PORT variable:

```bash
PORT=3001 guestline-scripts start
```

#### Use your own config

You can use your own config or extend ours by creating a `src/client/next.config.js` file.
This file should follow the [Next.js documentation](https://github.com/zeit/next.js/#custom-configuration).

Remember to use your own config in your `server.js` too.
