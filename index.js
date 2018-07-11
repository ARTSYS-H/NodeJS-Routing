/*
Dynamic Routing Script for NodeJS Web Server.
Author: Lucas Hadey
*/

http = require("http"),
path = require("path"),
url = require("url"),
fs = require("fs");

function sendError(errCode, errString, response)
{
  response.writeHead(errCode, {"Content-Type": "text/plain"});
  response.write(errString + "\n");
  response.end();
  return;
}

function sendFile(err, file, response) //fonction envoie du fichier
{
  if(err) return sendError(500, err, response); // erreur sur fichier (format ou autre)
  response.writeHead(200);
  response.write(file, "binary");
  response.end();
}

function getFile(exists, response, localpath) // fonction recupération du fichier
{
  if(!exists) return sendError(404, '404 Not Found', response); // si fichier n'existe pas
  fs.readFile(localpath, "binary",
   function(err, file){ sendFile(err, file, response);});
}

function getFilename(request, response)// fonction recherche du fichier
{
  var urlpath = url.parse(request.url).pathname; // domaine ou adresse IP
  if (urlpath === '/') {
    urlpath = '/index.html'; // page par défaut
  }
  var localpath = path.join(process.cwd(), urlpath); // si nous sommes à la racine
  fs.exists(localpath, function(result) { getFile(result, response, localpath)});
}

var server = http.createServer(getFilename);
server.listen(8080);
console.log("Server available...");
