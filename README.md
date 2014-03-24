# grunt-mongoimport

Import data into mongodb using mongoimport

## Getting Started
This plugin requires Grunt `~0.4.1

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install grunt-mongoimport --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('grunt-mongoimport');
```

## The mongoimport task

### Overview
In your project's Gruntfile, add a section named `mongoimport` to the data object passed into `grunt.initConfig()`.

```
grunt.initConfig({
  grunt.initConfig({
    mongoimport: {
        options: {
        db : 'my-store',
        host : 'localhost', //optional
        port: '27017', //optional
        username : 'username', //optional
        password : 'password',  //optional
        stopOnError : false,  //optional
        collections : [
          { 
            name : 'user', 
            type : 'json', 
            file : 'collection/users.json', 
            jsonArray : true,  //optional
            upsert : true,  //optional
            drop : true  //optional
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
})
```

## Options

### db
Specifies a database for mongoimport to import data.
### host
Specifies a resolvable hostname for the mongod to which you want to restore the database.
### port
Specifies the port number, if the MongoDB instance is not running on the standard port.
### username
Specifies a username to authenticate to the MongoDB instance.
### password
Specifies a password to authenticate to the MongoDB instance.
### stopOnError
Forces mongoimport to halt the import operation at the first error rather than continuing the operation despite errors.


### collection.name
Specifies the name of the collection for mongoimport to import.
### collection.type
json|csv|tsv Declare the type of export format to import 
### collection.file
Specify the location of a file containing the data to import.
### collection.fields
Specify a comma separated list of field names when importing csv or tsv files that do not have field names in the first (i.e. header) line of the file.
### collection.upsertFields
Specifies a list of fields for the query portion of the upsert. Use this option if the _id fields in the existing documents don’t match the field in the document, but another field or field combination can uniquely identify documents as a basis for performing upsert operations.
### collection.jsonArray
Accept import of data expressed with multiple MongoDB documents within a single JSON array.
### collection.upsert
Modifies the import process to update existing objects in the database if they match an imported object, while inserting all other objects.
### collection.drop
Modifies the import process so that the target instance drops every collection before importing the collection from the input.


