// var Sequelize = require("sequelize");
// var sequelize = new Sequelize("chat", "root", "");

// var Users = sequelize.define('users', {
//   name: Sequelize.STRING
// });

// var Messages = sequelize.define('messages', {
//   message: Sequelize.STRING,
//   room: Sequelize.STRING
// });

// Users.hasMany(Messages);
// Messages.belongsTo(Users);

// Users.sync({force: true});
// Messages.sync({force: true});
// //sequelize.sync({force: true});

// exports.Users = Users;
// exports.Messages = Messages;


/*
// search for known ids
Project.findById(123).then(function(project) {
  // project will be an instance of Project and stores the content of the table entry
  // with id 123. if such an entry is not defined you will get null
})

// search for attributes
Project.findOne({ where: {title: 'aProject'} }).then(function(project) {
  // project will be the first entry of the Projects table with the title 'aProject' || null
})

Model.findAll({
  attributes: ['foo', 'bar']
});

===================

var project = Project.build({
  title: 'my awesome project',
  description: 'woot woot. this will make me a rich man'
})
 
var task = Task.build({
  title: 'specify the project idea',
  description: 'bla',
  deadline: new Date()
})

project.save().then(function() {
  // my nice callback stuff
})
 
task.save().catch(function(error) {
  // mhhh, wth!
})

Task.create({ title: 'foo', description: 'bar', deadline: new Date() }).then(function(task) {
  // you can now access the newly created task via the variable task
})

User.create({ username: 'barfooz', isAdmin: true }, { fields: [ 'username' ] }).then(function(user) {
  // let's assume the default of isAdmin is false:
  console.log(user.get({
    plain: true
  })) // => { username: 'barfooz', isAdmin: false }
})


*/


////////////////////////////////////////////////////////////////////////////////////////

var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat'
});

connection.connect();

module.exports = connection;