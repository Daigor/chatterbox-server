var fs = require('fs');
var _ = require('../../node_modules/underscore/underscore.js');
module.exports = function(){
  return _.reduce(fs.readdirSync('./classes/messages'), function(accumulator, message){
    message = message.split( '' );
    message.splice( 0, 7 );
    message.splice( message.length - 3, 3 );
    message = message.join( '' );
    if(accumulator < +message){
      return +message;
    } else {
      return accumulator;
    }
  }, 0) || 0;
};



