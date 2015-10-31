
var app;

$(function() {
  app = {
    //server: 'https://api.parse.com/1/classes/chatterbox',
    server: 'http://127.0.0.1:3000/classes/messages',
    username: 'anonymous',
    room: 'lobby',
    friends: {},

    init : function() {
      app.username = window.location.search.substr(10);

      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');
      app.$chat = $('.chat');

      app.stopSpinner();
      app.fetch();

      app.$roomSelect.on('change', app.saveRoom);
      app.$send.on('submit', app.handleSubmit);
      app.$main.on('click', '.username', app.addFriend);

      setInterval(app.fetch, 3000);
    },

    // when room is switched, change app.room
    saveRoom: function(changed) {
      // var selectedRoom = app.$roomSelect.prop('selectedRoom');
      var selectedRoom = app.$roomSelect.val();

      if(selectedRoom === 'newroom') {
        // create a new room
        var roomname = prompt('Enter room name');
        if( roomname ) {
          app.room = roomname;

          app.addRoom(roomname);

          app.$roomSelect.val(roomname);

          app.fetch();
        }
        
      } else {
        // change rooms
        app.room = app.$roomSelect.val();
        app.fetch();
      }
    },
    // send message to Parse server
    send: function(message) {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(data) {
          app.fetch();
          console.log('chatterbox: Message sent. Data: ', data);
        },
        error: function(data) {
          console.error('chatterbox: Failed to send message. Error: ', data);
        },
        complete: function() {
          app.stopSpinner();
        }
      });
    },

    // fetch all chats and rooms from Parse server
    fetch: function() {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        //data: { order: '-createdAt' },
        complete:function(){
          app.stopSpinner();
        },
        success: function(data){
          console.log(data);
          // Process room data
          app.populateRooms(data);
          // Process chat data
          app.populateMessages(data);
        },
        error: function(reason){
          console.log('Failed to fetch data: ', reason);
        }
      });
    },

    startSpinner: function() {
      $('.spinner img').show();
    },

    stopSpinner: function() {
      $('.spinner img').hide();
    },

    // populate a list of rooms from chats
    populateRooms: function(results){
      app.$roomSelect.html('<option value="newroom">New Room</option><option value="lobby" selected>Lobby</option>');
      // iterate over all messages
        // if new room add to drop down 
        var processedRooms = {};
        if(results){
          if(app.room !== 'lobby') {
            app.addRoom(app.room);
            processedRooms[app.room] = true;
          }
          results.forEach(function(data) {
            var roomname = data.roomname;
            if( roomname && !processedRooms[roomname]) {
              app.addRoom(roomname);

              processedRooms[roomname] = true;
            }
          });
        }
        
        app.$roomSelect.val(app.room);
    },

    // populate messages into chatroom
    populateMessages: function(results){
      app.clearMessages();
      // iterate over all messages
      if(Array.isArray(results)) {
        results.forEach(app.addMessage);
      }
    },

    // clear all messages from chatroom
    clearMessages: function() {
      app.$chats.html('');
    },

    // add a message to chatroom
    addMessage: function(message) {
      if(!message.roomname) {
        message.roomname = 'lobby';
      }
      if(message.roomname === app.room) {
        var $chat = $('<div class="chat">');
        var $username = $('<span class="username" />');

        var escapeUsername = _.escape(message.username);
        var escapeRoomname = _.escape(message.roomname);
        
        $username.text(escapeUsername + ': ')
          .attr('data-username', escapeUsername)
          .attr('data-roomname', escapeRoomname)
          .appendTo($chat);

        if( app.friends[escapeUsername] === true ) {
          $username.addClass('friend');
        }

        var $message = $('<span />');
        $message.text(message.message)
          .appendTo($chat);

        app.$chats.append($chat);

      }
    },

    // add a room to chatroom
    addRoom: function(roomname) {
      var $option = $('<option />').val(roomname).text(roomname);
      app.$roomSelect.append($option);
    },


    addFriend: function(friended) {
      var username = $(friended.currentTarget).attr('data-username');
      console.log(username);
      if( username !== undefined ) {
        console.log('chatterbox: adding %s as a friend', username);

        app.friends[username] = true;

        var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
        $('selector').addClass('friend');
      }
    },

    // when submit is clicked send to Parse server
    handleSubmit: function(submitted) {
      submitted.preventDefault();
      var message = {
        username: app.username,
        roomname: app.room || 'lobby',
        text: app.$message.val()
      };
      app.send(message);
      app.$message.val('');
    }

  };
});
