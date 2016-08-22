'use strict';
const FS = require('fs');
const Path = require('path');

/**
 * @param path {String=} test resource path
 * Remove test files
 */
module.exports.removeFiles = (path) => {
    path = path || `${__dirname}/resource`;
    var files = FS.readdirSync(path);
    var sub = false;
    files.forEach((file) => {
        if (!Path.basename(file).match(/sample\.zip/) && Path.extname(file).match(/zip/)) {
            FS.unlinkSync(`${path}/${file}`);
        }

        if (Path.basename(file) === 'tmp') sub = true;
    });

    if (sub) this.removeFiles(`${path}/tmp`);
};