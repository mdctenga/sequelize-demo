# Sequelize + Express Starter Guide

_Based off of: http://docs.sequelizejs.com/en/1.7.0/articles/express/_

## Create your project directory

Create and initialize your a directory for your Express application.

```bash
$ mkdir sequelize-demo
$ cd sequelize-demo
$ npm init
```
## Sequelize

Sequelize is an Object-Relation Mapping (ORM) library that allows you to treat your relational database schemas as objects in your JavaScript applications.

### Install the sequelize command line tool

After you are inside the project directory, install `sequelize-cli` __globally__.

```
$ npm install sequelize-cli -g
```

This will allow us to use the `sequelize` is a command line tool that helps you create and manage your sequelize files.

In addition, you will need to also install `sequelize` module __localy__ in order to utilize the command line tool.

```
$ npm install sequelize --save
```

Let's start by creating a our configuration file using:

```
$ sequelize init
```

This will generate a few files for you, your project folder should now look like this:
```
.
â”œâ”€â”€ config
â”‚Â Â  â””â”€â”€ config.json
â”œâ”€â”€ migrations
â”œâ”€â”€ models
â”‚Â Â  â””â”€â”€ index.js
â””â”€â”€ package.json
```

## Configuring your database

For our example, you're going to be connecting to a Postgres database, we'll also need to install a couple more modules: `pg` and `pg-hstore`.

```
$ npm install pg pg-hstore --save
```

The generated `config/config.json` file begins with an environment level. This let's you configure different configurations for different environments, (e.g. â€“ local development vs production).

Edit your development settings in `config/config.json` to point to your postgres database.

**Example `config/config.json`**

```
{
  "development": {
    "username": <your username>,
    "password": null,
    "database": "sequelize_demo",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  ...
}
```
### Adding your models

For this example create two files: `models/User.js` and `models/Task.js`.

**User.js**
```
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  });

  return User;
};
```

**Task.js**
```
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.User);
      }
    }
  });

  return Task;
};
```

Your `models` directory should look like this now:
```
models/
â”œâ”€â”€ index.js
â”œâ”€â”€ task.js
â””â”€â”€ user.js
```

## Create your Express application

Create your express application how you normally would, for this example the server listening on port `3000`.

```
var express = require('express');
var app = express();

var db = require('./models');

app.listen(3000, function() {
  db.sequelize.sync();
});

```

Start the server:

```
$ npm start
```

After the server starts, `db.sequelize.sync` is invoked, this will automatically synchronize your application with the database. If all goes well your server should have a bunch of SQL queries that will create all of your tables for you!

# Making models
After successfully creating your express application, create a route to allow users to create new `Users` in the database.

## Get user input
For this example, install the `body-parser` module, set it up to parse _JSON_ payloads.

```
$ npm install body-parser --save
```

## Models
After you have set up the `body-parser`, add another line of code that requires your `User` model from your `db` object.

```
var User = db.User;
```
This will let you access the `User` model so that you can create and read from your database.

### Creating users
```
app.post('/users', function (req, res) {
  User.create({ username: req.body.username })
    .then(function (user) {
      res.json(user);
    });
});
```

### Getting users
```
app.get('/users', function(req, res) {
  User.findAll()
    .then(function (users) {
      res.json(users);
    });
});
```

## Create some users!
Using Postman, send POST requests and GET requests to create and fetch users added to your database.