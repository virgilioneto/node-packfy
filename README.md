# Node.js Packfy 0.0.1 (beta)

[![Dependency Status](https://gemnasium.com/badges/github.com/virgilioneto/node-packfy.svg)](https://gemnasium.com/github.com/virgilioneto/node-packfy)
[![Coverage Status](https://coveralls.io/repos/github/virgilioneto/node-packfy/badge.svg?branch=master)](https://coveralls.io/github/virgilioneto/node-packfy?branch=master)
[![Build Status](https://travis-ci.org/virgilioneto/node-packfy.svg?branch=master)](https://travis-ci.org/virgilioneto/node-packfy)

**This module is under development right now no ready for production**

This package was designed to be a multi format lib to compact / extract files and folders.

## How to install

### From repository
```sh
git clone https://github.com/virgilioneto/node-packfy.git
cd node-packfy
npm install
npm test
```

### From NPM
```sh
npm install packfy --save
```

## How to use
```javascript
const Zip = require('packfy');
Zip.packFile(pach, options)
    .on('error', (error) => {
        // If error
    })
    .on('file', (filePath) => {
        // If success
    });
```

Clock [here](https://virgilioneto.github.io/node-packfy/) for more information, samples and API documentation.