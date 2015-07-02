var express = require('express');
var app = express();

var db = require('./models');
var bodyParser  = require('body-parser');

app.listen(3000, function() {
  db.sequelize.sync();
});