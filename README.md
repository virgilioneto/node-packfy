# Node.js Packfy 0.0.2 (beta)

[![npm version](https://badge.fury.io/js/packfy.svg)](https://badge.fury.io/js/packfy)
[![Dependency Status](https://gemnasium.com/badges/github.com/virgilioneto/node-packfy.svg)](https://gemnasium.com/github.com/virgilioneto/node-packfy)
[![Coverage Status](https://coveralls.io/repos/github/virgilioneto/node-packfy/badge.svg?branch=master)](https://coveralls.io/github/virgilioneto/node-packfy?branch=master)
[![Build Status](https://travis-ci.org/virgilioneto/node-packfy.svg?branch=master)](https://travis-ci.org/virgilioneto/node-packfy)

**This module is under development right now and not ready for production**

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

### Zip a single file
```javascript
const Zip = require('packfy').Zip;
Zip.packFile(pach, options)
    .on('error', (error) => {
        // If error
    })
    .on('file', (filePath) => {
        // If success
    });
```

### Zip a file list into a single package
```javascript
const Zip = require('packfy').Zip;
var pathList = [path1, path2, ..., pathN];
Zip.packFiles(pathList, options)
    .on('error', (error) => {
        // If error
    })
    .on('file', (filePath) => {
        // If success
    });
```

Clock [here](https://virgilioneto.github.io/node-packfy/) for more information, samples and API documentation.