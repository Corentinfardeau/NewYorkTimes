'use strict';

var server={
  init : function(){
    // create socket
    this.io = require('socket.io').listen(2000);
    // écoute un event connection lorsqu'un script ouvre un socket
    this.io.on('connection',this.connection);
    
    this.roomList = [];

  },

  connection : function(socket){ 
    
    //create room
    socket.on('create room', function(roomID) {
      
      socket.join(roomID+'');
      console.log('room '+roomID+ ' crée');
      server.roomList.push(roomID);

    });
    
    //mobile join room
    socket.on('join room', function(roomID) {
      
      //watch if the room exist
      console.log(server.roomList.indexOf(roomID));
      if(server.roomList.indexOf(roomID) !== -1){
        socket.join(roomID+'');
        console.log('room '+roomID+ ' jointe'); 

        //callback success
        server.io.in(roomID).emit('success joined', '');
      }
      else
      {
        console.log('error');
        socket.emit('error joined', ''); 
      }
      
    });
    
    /*
    
    For the first connection
    
    */
    
    //mobile ask for article when the mobile is joined
    socket.on('get firstArticle', function(roomID){
      
      //callback to desktop to give the last article
      server.io.in(roomID).emit('get firstCurrentArticle', '');
    });
    
    //Desk send article to mobile
    socket.on('send firstCurrentArticle', function(roomID, article){

      //send to mobile the last article
      server.io.in(roomID).emit('add firstArticle', article);
    });
    
    /*

    For the next connections

    */
    
    //Send article for the next connexion
    socket.on('send currentArticle', function(roomID, article){
      console.log('sending '+ roomID);
      //Send to mobile the article
      server.io.in(roomID).emit('add article', article);
    });
    
    //Ask to mobile array of articles store in mobile local storage
    socket.on('isSaved',function(roomID){
      server.io.in(roomID).emit('getSavedArticles');
    });
    
    //Send to desk the array of articles store in mobile local storage
    socket.on('sendSavedArticles', function(roomID, savedArticles){
      server.io.in(roomID).emit('getAllArticlesSaved', savedArticles);
    });
    
    
  }
};
server.init();