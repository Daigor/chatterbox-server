var numberOfMessages = require( './numberOfMessages.js' );
var createMessageFile = require('./createMessageFile.js');
var fs = require('fs');

module.exports = function(data){
  return function( ) {
    var messageNumber = numberOfMessages( );
    var dirFiles = fs.readdirSync( './classes' );
    var messageFileName = './classes/messages/message' + ( messageNumber + 1 ) + '.js';
    var roomFileName = "./classes/" + data.roomname + "/message" + ( messageNumber + 1) + ".js";
    data = JSON.parse(data);
    var fileContent = createMessageFile(data)
    if( dirFiles.indexOf( data.roomname ) === -1 ) {
      fs.mkdirSync('./classes/' + data.roomname );
    }
    fs.writeFileSync(messagesFileName, fileContent);
    fs.writeFileSync(roomFileName, fileContent);
  };
};
