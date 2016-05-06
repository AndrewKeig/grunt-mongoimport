var async = require('async');
var walkSync = require('walk-sync');
var path = require("path");
var mongoose = require('mongoose');
var TASK_ERROR = 3;

var _getArgs = function(options, collection, file) {

    var args = [];

    if (options.db) args.push('--db=' + options.db);
    if (options.host) args.push('--host=' + options.host);
    if (options.port) args.push('--port=' + options.port);
    if (options.username) args.push('--username=' + options.username);
    if (options.password) args.push('--password=' + options.password);
    if (options.stopOnError) args.push('--stopOnError');

    if (collection.name) args.push('--collection=' + collection.name);
    if (collection.type) args.push('--type=' + collection.type);
    if (collection.type === 'csv' || collection.type === 'tsv') {
        if (collection.headerLine) args.push('--headerline');
    }
    if (collection.fields) args.push('--fields=' + collection.fields);
    if (collection.upsertFields) args.push('--upsertFields=' + collection.upsertFields);
    if (collection.jsonArray) args.push('--jsonArray');
    if (collection.upsert) args.push('--upsert');
    if (collection.drop) args.push('--drop');

    args.push('--file=' + file);

    return args;

};

var _getMongoArgsForDrop = function(collection_name) {




    var args = [];

    args.push(collection_name);
    args.push('--eval "db.dropDatabase()"')

    return args;
};

var _importDocs = function(grunt, options, collection, callback) {

    if (collection.folder) {

        var files = walkSync(collection.folder)

        async.eachSeries(files, function(file, cb) {

            if (path.extname(file) === ".json") {

                file = collection.folder + "/" + file;

                var args = _getArgs(options, collection, file);

                var child = grunt.util.spawn({
                        cmd: 'mongoimport',
                        args: args,
                        opts: {
                            stdio: 'inherit'
                        }
                    },
                    function(error, result) {

                        if (error) {
                            grunt.log.error(result.stderr);
                            cb();
                        }


                        grunt.log.writeln("Imported file: %s", file);
                        cb();
                    });

            } else {


                cb();

            }

        }, function(err) {

            callback();

        })


    } else if (collection.file) {

        var args = _getArgs(collection, collection.file);

        var child = grunt.util.spawn({
                cmd: 'mongoimport',
                args: args,
                opts: {
                    stdio: 'inherit'
                }
            },
            function(error, result) {
                if (error) {
                    grunt.log.error(result.stderr);
                    callback();
                }
                grunt.log.writeln(result.stdout);
                callback();
            });

    }


}

module.exports = function(grunt) {

    grunt.registerTask("mongoimport", "Grunt task for importing data into mongodb", function() {

        var done = this.async();
        var options = this.options();

        if (!options) {
            grunt.warn(new Error('Options not found.', TASK_ERROR));
        }

        if (!options.collections) {
            grunt.warn(new Error('Collections option not found.', TASK_ERROR));
        }

        if (!Array.isArray(options.collections)) {
            grunt.warn(new Error('Collections must be an array'), TASK_ERROR);
        }

        async.eachSeries(options.collections, function(collection, callback) {

                if (options.drop) {

                    var db = mongoose.connect('mongodb://' + options.host + '/' + options.db, function(err) {
                        if (err) {
                            grunt.log.writeln('Could not connect to mongodb, check if mongo is running');
                            callback(err);
                        } else {
                            grunt.log.writeln('Open db connection');

                            mongoose.connection.collection(collection.name).drop(function(err) {
                                if (err) {
                                    grunt.log.writeln('Could not drop collection');
                                    callback(err);
                                } else {
                                    grunt.log.writeln('Collection dropped');
                                    _importDocs(grunt, options, collection, callback);
                                }
                            });
                        }
                    });

                } else {

                    _importDocs(grunt, options, collection, callback);

                }


            },
            function(err) {
                if (err) done(false);
                done();
            }
        );
    });



};