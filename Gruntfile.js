'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    mongoimport: {
        options: {
        host : 'localhost',
        port: '27017',
        db : 'my-store',
        stopOnError : true,
        username : 'username',
        password : 'password',
        collections : [
          { 
            name : 'user', 
            type : 'json', 
            file : 'collection/users.json', 
            jsonArray : true, 
            upsert : true,
            drop : true
          }, 
          { 
            name : 'media', 
            type :'json', 
            file : 'collection/media.json', 
            jsonArray : true, 
            upsert : true,
            drop : true
          }
        ]
      }
    }
  });

  grunt.loadTasks('tasks');
};
