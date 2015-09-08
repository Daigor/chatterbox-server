module.exports = function(request){
  var urlFiles = request.url.split('/');
  urlFiles.splice(0,1);
  if( urlFiles[urlFiles.length - 1].charAt(0) === '?' || urlFiles[urlFiles.length - 1] === '' ){
    urlFiles.splice(urlFiles.length - 1, 1);  
  }
  return urlFiles;
};