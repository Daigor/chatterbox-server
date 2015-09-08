  var fs = require('fs');
  var _ = require('../../node_modules/underscore/underscore.js');
  var numberOfMessages = require( './numberOfMessages.js');
  var sortByObjectId = require('./sortByObjectId.js');

    var messageNumber = numberOfMessages();
    //
    var dirFiles = fs.readdirSync('./' + urlFiles.join('/')).sort(sortByObjectId);
   
    _.each(dirFiles, function(message, index){
      message = require('./' + urlFiles.join('/') + '/' + message);
      responseBody.results[dirFiles.length - index - 1] = {
        username: message.username,
        message: message.message ,
        roomname: message.roomname,
        objectId: message.objectId
      };
    });