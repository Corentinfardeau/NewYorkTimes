'use stricts';

var server={
  init : function(){
    // create socket
    this.io = require('socket.io').listen(2000);
    // écoute un event connection lorsqu'un script ouvre un socket
    this.io.on('connection',this.listen);
    
  },

  listen : function(socket){ 
    
    socket.on('send',function(currentArticle){
      console.log('add');
      server.io.emit('added',currentArticle);
    });
  }
  
};
server.init();