/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');

var _ = require( '../node_modules/underscore/underscore.js' );

var numberOfMessages = require( './modules/numberOfMessages.js');

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
  if( urlFiles[urlFiles.length - 1].charAt(0) === '?' || urlFiles[urlFiles.length - 1] === '' ){
    urlFiles.splice(urlFiles.length - 1, 1);  
  }
  //url files is an array of strings
  // The outgoing status.
  var urlFilesIndex = 0;
  var statusCode;
  var path = '.';

  //function checks if directory names in urlFiles array correspond to a branch of the directory tree whos root is path
  var checkUrl = function(path){
    var dirFiles = fs.readdirSync(path);
    if(dirFiles.indexOf(urlFiles[urlFilesIndex]) !== -1){
      if(urlFilesIndex === urlFiles.length -1 ){
        if( request.method === 'GET') {
          return 200;
        } else if( request.method === 'POST' ) {
          return 201;
        } else if (request.method === 'OPTIONS'){
          return 200;
        }
      } else {
        path += '/' + urlFiles[urlFilesIndex];
        urlFilesIndex++;
        return checkUrl(path);
      }
    } else {
      return 404;
    }
  };

  statusCode = checkUrl(path);

  if(request.method === 'POST' && statusCode === 201){
    var data = '';
    request.on('data', function(chunk){
      data += chunk;
    });
    request.on('end', function(){
      data = JSON.parse(data);
      var messageNumber = numberOfMessages();
      var dirFiles = fs.readdirSync('./classes');
      if(dirFiles.indexOf(data.roomname) === -1){
        fs.mkdirSync('./classes/' + data.roomname);
      }
      var messagesFileName = "classes/messages/message" + (messageNumber + 1) + ".js";
      var roomFileName = "classes/" + data.roomname + "/message" + (messageNumber + 1) + ".js";
      var fileContent = 'module.exports.username = \"' + data.username + '\";\n'
                        + 'module.exports.message = \"' + data.message + '\";\n'
                        + 'module.exports.roomname = \"' + data.roomname + '\";\n'
                        + 'module.exports.objectId = ' + (messageNumber + 1) + ';';
      fs.writeFileSync(roomFileName, fileContent);
      fs.writeFileSync(messagesFileName, fileContent);
    });     
  }

  var responseBody = {
    results: []
  };
  

  if(request.method === "GET" && statusCode === 200){
    var messageNumber = numberOfMessages();
    //
    var dirFiles = fs.readdirSync('./' + urlFiles.join('/')).sort(function(msg1,msg2){
      var num1 = msg1.split('');
      num1.splice( msg1.length - 3, 3 );
      num1.splice( 0, 7 )
      num1 = num1.join('');
      var num2 = msg2.split('');
      num2.splice( msg2.length - 3, 3 );
      num2.splice( 0, 7 )
      num2 = num2.join('');
      console.log( num1, num2 );
      return +num1 - +num2;
    });
   
    _.each(dirFiles, function(message, index){
      message = require('./' + urlFiles.join('/') + '/' + message);
      responseBody.results[dirFiles.length - index - 1] = {
        username: message.username,
        message: message.message ,
        roomname: message.roomname,
        objectId: message.objectId
      };
    });
  }
  

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
  response.end(JSON.stringify(responseBody));

};

module.exports.requestHandler = requestHandler;