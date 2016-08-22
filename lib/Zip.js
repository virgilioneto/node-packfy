'use strict';
const EventEmitter = require('events').EventEmitter;
const Path = require('path');
const FS = require('fs');
const JsZip = require('jszip');
const Moment = require('moment');

module.exports = {

    /**
     * Pack a single file
     * @param path {String} Origin file path
     * @param options {Object=}
     * @param options.destination {String=} Output directory, the default is the origin file directory
     * @param options.targetName {String=} Zip file name, the default is the origin file name
     * @param options.override {Boolean=} Override destination file, default is false
     * @param options.suffixMask (String=} If override is set to false, set the date format to use as suffix in targetName, default is 'YYYY-MM-DDTHH-mm-ss'
     * @returns {EventEmitter}
     */
    packFile (path, options) {
        var event = new EventEmitter();
        var suffix;

        process.nextTick(() => {
            options = options || {};

            suffix = !options.override? '.' + Moment().format(options.suffixMask || 'YYYY-MM-DDTHH-mm-ss'): '';

            path = Path.normalize(path);
            options.targetName = options.targetName || Path.basename(path);
            options.destination = options.destination || path.replace(Path.basename(path), '');
            options.destination = Path.normalize((Path.join(options.destination, `${options.targetName + suffix}.zip`)));

            FS.readFile(path, (error, content) => {
                var jszip;
                if (error) {
                    event.emit('error', error);
                    return;
                }

                jszip = new JsZip();

                jszip.file(Path.basename(path), content);
                jszip.generateNodeStream({streamFiles:true})
                    .pipe(FS.createWriteStream(options.destination))
                    .on('error', (error) => {
                        event.emit('error', error)
                    })
                    .on('finish', () => {
                        event.emit('file', options.destination);
                    });
            });
        });

        return event;
    },

    packFiles (pathList, destination) {},
    packDir (path, destination, recursive, matchFilePattern) {},
    packDirs (pathList, destination, recursive, matchFilePattern) {},

    unpackFile (path, destination, createDir, override) {},
    unpackFiles (pathList, destination, createFolder, override) {}
};