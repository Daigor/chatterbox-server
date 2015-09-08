var _ = require( '../node_modules/underscore/underscore.js' );

var OPTIONSResponse = require( './modules/OPTIONSResponse.js' );

var POSTResponse = require( './modules/POSTResponse.js' );

var GETResponse =  require( './modules/GETResponse.js' );

var checkUrl = require( './modules/checkUrl.js' );


var requestHandler = function( request, response ) {

  console.log( "Serving request type " + request.method + " for url " + request.url );

  var statusCode = checkUrl( request );

  var headers = _.extend( { 'content-type': 'text/plain' }, OPTIONSResponse( ) );

  response.writeHead( statusCode, headers );

  var responseBody;

  if( request.method === 'POST' && statusCode === 201 ) {

    responseBody = POSTResponse( request );

  }
  
  if( request.method === 'GET' && statusCode === 200 ) {

    responseBody = GETResponse( request );

  }

  response.end( JSON.stringify( responseBody ) );

};

module.exports.requestHandler = requestHandler;