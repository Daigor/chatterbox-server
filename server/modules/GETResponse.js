  var fs = require('fs');
  var _ = require('../../node_modules/underscore/underscore.js');
  var numberOfMessages = require( './numberOfMessages.js');
  var sortByObjectId = require('./sortByObjectId.js');
  var urlFiles = require('./urlFiles.js');


  module.exports = function(request){
    var responseBody = {results:[]};
    var urlArray = urlFiles(request)
    var dirFiles = fs.readdirSync('./' + urlArray.join('/')).sort(sortByObjectId);
   
    _.each(dirFiles, function(message, index){
      message = require('../' + urlArray.join('/') + '/' + message);
      responseBody.results[dirFiles.length - index - 1] = {
        username: message.username,
        message: message.message ,
        roomname: message.roomname,
        objectId: message.objectId
      };
    });
    return responseBody;
  };