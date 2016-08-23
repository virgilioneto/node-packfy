'use strict';
const EventEmitter = require('events').EventEmitter;
const Path = require('path');
const FS = require('fs');
const JsZip = require('jszip');
const Moment = require('moment');
const Async = require("async");
const globby = require('globby');

/**
 * Zip lib
 * @exports Zip
 */
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

    /**
     * Pack multiple files into a single zip
     * @param pathList {Array} Origin file paths
     * @param options {Object=}
     * @param options.destination {String=} Output directory, the default is the origin file directory
     * @param options.targetName {String=} Zip file name, the default is the origin file name
     * @param options.override {Boolean=} Override destination file, default is false
     * @param options.suffixMask (String=} If override is set to false, set the date format to use as suffix in targetName, default is 'YYYY-MM-DDTHH-mm-ss'
     * @param options.event {EventEmitter=} EventEmitter instance for internal use only
     * @returns {EventEmitter}
     */
    packFiles (pathList, options) {
        var event;
        var suffix;

        options = options || {};

        if (options.hasOwnProperty('event') && options.event instanceof EventEmitter) event = options.event;
        else event = new EventEmitter();

        process.nextTick(() => {
            var queue;
            var jszip = new JsZip();

            suffix = !options.override? '.' + Moment().format(options.suffixMask || 'YYYY-MM-DDTHH-mm-ss'): '';

            options.targetName = options.targetName || Path.basename(pathList[0]);
            options.destination = options.destination || pathList[0].replace(Path.basename(pathList[0]), '');

            FS.stat(options.destination, (error) => {
                if (error) return event.emit('error', error);

                options.destination = Path.normalize((Path.join(options.destination, `${options.targetName + suffix}.zip`)));
                queue = pathList.map((path) => {
                    return (callback) => {
                        path = Path.normalize(path);

                        FS.readFile(path, (error, content) => {
                            if (error) return callback(error);

                            jszip.file(Path.basename(path), content);
                            event.emit('file', path);
                            callback();
                        });
                    }
                });

                Async.series(queue, (error) => {
                    if (error) event.emit('error', error);
                    else {
                        jszip.generateNodeStream({streamFiles:true})
                            .pipe(FS.createWriteStream(options.destination))
                            .on('error', (error) => {
                                event.emit('error', error);
                            })
                            .on('finish', () => {
                                event.emit('finish', options.destination);
                            });
                    }
                })
            });
        });

        return event;
    },

    /**
     * Pack a folder
     * @param path {String} Origin file path
     * @param options {Object=}
     * @param options.destination {String=} Output directory, the default is the origin file directory
     * @param options.targetName {String=} Zip file name, the default is the origin file name
     * @param options.override {Boolean=} Override destination file, default is false
     * @param options.suffixMask (String=} If override is set to false, set the date format to use as suffix in targetName, default is 'YYYY-MM-DDTHH-mm-ss'
     * @param options.pattern {Array=}
     * @returns {EventEmitter}
     */
    packDir (path, options) {
        options = options || {};
        options.pattern = options.pattern || ['**'];
        options.event = new EventEmitter();

        process.nextTick(() => {
            FS.stat(path, (error) => {
                if (error) return options.event.emit('error', error);

                globby(options.pattern, {cwd: path, realpath: true, nodir: true})
                    .then((files) => {
                        this.packFiles(files, options);
                    })
                    .catch((error) => {
                        event.emit('error', error);
                    });
            });
        });

        return options.event;
    },

    packDirs (pathList, destination, recursive, matchFilePattern) {},

    unpackFile (path, destination, createDir, override) {},
    unpackFiles (pathList, destination, createFolder, override) {}
};