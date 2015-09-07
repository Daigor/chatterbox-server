/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  //splits the url into its directory names
  var urlFiles = request.url.split('/');
  urlFiles.splice(0,1);
  if(urlFiles[urlFiles.length - 1].charAt(0) === '?'){
    urlFiles.splice(urlFiles.length - 1, 1);  
  }
  //url files is an array of strings
  // The outgoing status.
  var urlFilesIndex = 0;
  var statusCode;
  var path = '.';

  //function checks if directory names in urlFiles array correspond to a branch of the directory tree whos root is path
  var checkUrl = function(path){
    fs.readdir(path, function(err, dirFiles){
      if(err){
        throw err;
      } else {
        if(dirFiles.indexOf(urlFiles[urlFilesIndex]) !== -1){
          if(urlFilesIndex === urlFiles.length - 1){
            statusCode = 200;
            writeResponse();
          } else {
            path += '/' + urlFiles[urlFilesIndex];
            urlFilesIndex++;
            checkUrl(path);  
          }
        } else {
          statusCode = 404;
          writeResponse(); 
        }
      }
    })
  };
  checkUrl(path);
  
  // See the note below about CORS headers.

  // These headers will allow Cross-Origin Resource Sharing (CORS).
  // This code allows this server to talk to websites that
  // are on different domains, for instance, your chat client.
  //
  // Your chat client is running from a url like file://your/chat/client/index.html,
  // which is considered a different domain.
  //
  // Another way to get around this restriction is to serve you chat
  // client from this domain by setting up static file serving.

  var headers = {};

  headers[ 'access-control-allow-origin' ] = '*';

  headers[ 'access-control-allow-methods' ] = 'GET, POST, PUT, DELETE, OPTIONS';

  headers[ 'access-control-allow-headers' ] = 'content-type, accept';

  headers[ 'access-control-max-age' ] = 10; // seconds

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";

  var writeResponse = function(){

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);

    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.

    response.end(statusCode.toString());
  }
};

module.exports.requestHandler = requestHandler;