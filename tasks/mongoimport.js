var async = require('async');

module.exports = function(grunt) {
  grunt.registerTask("mongoimport", "Grunt task for importing data into mongodb", function() {

  var done = this.async();
  var options = this.options();
  
  async.eachSeries(options.collections, function(collection, callback){
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
    if (collection.file) args.push('--file=' + collection.file);
    if (collection.fields) args.push('--fields=' + collection.fields);
    if (collection.upsertFields) args.push('--upsertFields=' + collection.upsertFields);
    if (collection.jsonArray) args.push('--jsonArray');
    if (collection.upsert) args.push('--upsert');
    if (collection.drop) args.push('--drop');

    var child = grunt.util.spawn({
      cmd: 'mongoimport',
          args: args,
          opts:
          { stdio:
              [ process.stdin
              , process.stout
              , process.stderr
              ]
          }
        },
        function (error, result) {
          if (error) {
            grunt.log.error(result.stderr);
            callback();
          }
          grunt.log.writeln(result.stdout);
          callback();
        });
      },
      function(err){
        if (err) done(false);
        done();
      }
    );
  });
};
