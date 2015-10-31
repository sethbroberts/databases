var express = require('express');
var connection = require('./db/index.js');

//to access Users -> connection.Users

var app = express();

app.use("/",express.static('./client'));

// var messageData = {results:[]};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

headers['Content-Type'] = "application/json";



app.get("/classes/messages", function(req, res) {
  res.set(headers);
  res.status(200);
  selectMessages(res);
  // res.send(JSON.stringify(messageData));
});

app.post("/classes/users", function(req, res) {
  res.set(headers);
  res.status(201);
  var username = '';
  req.on('data',function(data){
      username += data;
    });
  req.on('end', function(){
    var userObj = JSON.parse(username);
    storeUser(userObj.username);
    res.end(userObj.username);

  });
});

app.post("/classes/messages", function(req, res) {
  res.set(headers);
  res.status(201);
  var message = '';
  req.on('data',function(data){
      message += data;
    });
  req.on('end', function(){
    //capture message object
    var messageObj = JSON.parse(message);
    // message looks like: { username: 'bob', roomname: 'lobby', text: 'hey there' }
    storeMessage(messageObj.roomname, messageObj.username, messageObj.text);
    res.end(message);
  });
});

app.options("/classes/messages", function(req, res) {
  res.set(headers);
  res.status(200).send();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});





var selectMessages = function(response) {
  connection.query('select * from messages', function(err, results) {
    if (err) {
      console.log(err);
    } else {
      response.send(JSON.stringify(results));
    }
  });
};

var storeUser = function(inputUser) {
  connection.query('INSERT INTO users SET ?', {name: inputUser},function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('user added: ', inputUser);
    }
  });
};


var storeMessage = function(inputRoom, inputUser, inputMessage) {
  inputUser = inputUser || null;
  var userID;
  connection.query('INSERT INTO users SET ?', {name: inputUser}, function(err, result) {
    if (err) {
      console.log(err);
    }
    addMessage(result.insertId);
  });

  var addMessage = function(result) {
    //now we can send message
    userID = result;
    connection.query('INSERT INTO messages SET ?', {userkey: userID, room: inputRoom, message: inputMessage}, function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log('message added to db:', inputMessage);
    });
  };
};


//connection.end();









