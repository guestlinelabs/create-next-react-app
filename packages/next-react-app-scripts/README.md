# Create Next React App

This package includes a set of scripts that makes configuring a project easier. It is intended to be the likes of Create React App but for NextJS applications.

If you want to start a new project, see [create-next-react-app](https://github.com/guestlinelabs/create-next-react-app/packages/create-next-react-app).

If you want to migrate an existing project, please refer to the folder structure, or the [`template`](https://github.com/guestlinelabs/create-next-react-app/packages/next-react-app-scripts/template) folder. The folder is following the one of CRA to make migrations between the 2 as painless as possible.

## NextJS by default

We support all the default options that NextJS provides by using their `next/babel` configuration as a Babel preset and by using their build script.

## Table of contents

* [Folder Structure](#default-folder-structure)
* [Getting Started](#getting-started)
* [NextJS by default](#nextjs-by-default)
* [Browsers/NodeJS support](#browsers/nodejs-support)
* [CSS](#css)
* [Assets](#assets)
* [Environment variables in client side](#environment-variables-in-client-side)
* [CDN](#leverage-assets-using-cdn)
* [Port](#customize-the-port)
* [Config](#use-your-own-config)
* [Tests](#tests)

## Folder Structure

```
|_ build // Where the generated files will be added
|_ src
| |_ client
| | |_ components
| | |_ pages
| | |_ static
| |_ server
| |_ server.js
| |_ setupTests.js
|_ .babelrc // To inherit the Babel config
|_ .env
|_ .eslintrc.js // To inherit the ESLint config so you can see it in your IDE
|_ .gitignore
|_ package.json
```

For the project to build, these files must exist with exact filenames:

* `pages` folder with `.js` files that map to your routes
* `server.js` is the NodeJS server entry point.
* `.babelrc` so when building we use our built-in configuration.

## Getting started

After creating your project using Create Next React App, you will have a set of 4 commands:

#### start

`npm start` will start your development environment.

#### build

`npm run build` will create all the necessary files for your production environments.

By running your build with `CI=true`, it will make it fail on ESLint warnings.

#### prod

`npm run prod` will run your server in a production environment. A build needs to have been generated first.

#### test

`npm test` will run your tests in watch mode. To learn more about the test runner, refer to its documentation: [jest-run](https://github.com/guestlinelabs/jest-run)

## Browsers/NodeJS support

For browser/node.js compatibility we use `babel-preset-env` with the following options by default, but you can customize them in your `package.json`:

```js
{
  "targets": {
    "node": "8.9.4",
    "browsers": ["last 2 versions", "ie 11"]
  }
}
```

## CSS

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

## Assets

Import your assets directly from the `static` folder:

```js
// Any page/component/...
import React from 'react';
import logo from '../static/logo.png';

export default function() {
  return <img src={logo} alt="logo" />;
}
```

## Environment variables in client side

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

## Leverage assets using CDN

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

## Customize the port

Customize the port your application will be running on by declaring a PORT variable:

```bash
PORT=3001 guestline-scripts start
```

## Use your own config

You can use your own config or extend ours by creating a `src/client/next.config.js` file.
This file should follow the [Next.js documentation](https://github.com/zeit/next.js/#custom-configuration).

Remember to use your own config in your `server.js` too.

## Tests

By default the `test` command is using [`jest-run`](https://github.com/guestlinelabs/jest-run). Refer to its documentation to see how to work with it.
