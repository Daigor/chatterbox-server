var numberOfMessages = require( './numberOfMessages.js' );

module.exports = function(data){
  return 'module.exports.username = \"' + data.username + '\";\n'
  + 'module.exports.message = \"' + data.message + '\";\n'
  + 'module.exports.roomname = \"' + data.roomname + '\";\n'
  + 'module.exports.objectId = ' + (numberOfMessages( ) + 1) + ';'; 
}; 