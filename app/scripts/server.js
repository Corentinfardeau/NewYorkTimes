'use strict';

var server={
  init : function(){
    // create socket
    this.io = require('socket.io').listen(2000);
    // écoute un event connection lorsqu'un script ouvre un socket
    this.io.on('connection',this.listen);
    
    //this.roomList = new Array();
  },

  listen : function(socket){ 
    
    //send article and generate token
    socket.on('send',function(currentArticle){

        var token = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for( var i=0; i < 10; i++ ){
          token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
      
      //server.roomList.push(token);

      // send the token to desk
      server.io.emit('send token',token);
      socket.join(token+'');
      
      //send article
      server.io.emit('added',currentArticle);
      
    });
    
    // Mobile connection
    socket.on('send mobile token', function(token){
      console.log('connecté');
      socket.join(token+'');
    });
  }

};
server.init();