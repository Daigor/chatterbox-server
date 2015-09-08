var fs = require( 'fs' );
var urlFiles = require( './urlFiles.js' );
module.exports = function( request, path, urlArrayIndex ) {
  path = path || '.';
  urlArrayIndex = urlArrayIndex || 0;
  var dirFiles = fs.readdirSync( path );
  var urlArray = urlFiles( request );
  if( dirFiles.indexOf( urlArray[urlArrayIndex] ) !== -1 ) {
    if( urlArrayIndex === urlArray.length - 1 ) {
      if( request.method === 'GET' || request.method === 'OPTIONS' ) return 200;
      else if( request.method === 'POST' ) return 201;
    } else {
      return module.exports( request, path + '/' + urlArray[urlArrayIndex], urlArrayIndex + 1 );
    }
  } else {
    return 404;
  }
};