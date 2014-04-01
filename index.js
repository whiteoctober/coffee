var express = require('express');
var http = require('http');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var WebSocketServer = require('ws').Server;
var app = express();

var server = http.createServer(app);
server.listen(process.env.PORT || 3000)

var wss = new WebSocketServer({server: server});

app.use(express.bodyParser());

if(process.env.USERNAME && process.env.PASSWORD)
  app.post('/',express.basicAuth(process.env.USERNAME, process.env.PASSWORD))

app.post('/', function(req, res){

  if(req.files.file.path){
    var newPath = __dirname + "/public/recent.jpg";

    gm(req.files.file.path)
    .autoOrient()
    .resize(640, 640)
    .write(newPath, function (err) {
      if(err) console.log(err);
      console.log("written!")
      res.send(err ? 'some kind of ERROR HAPPENED\n' : 'COFFEE!!!\n');

      if(!err){
        // publish that we got a new image
        for(var i in wss.clients)
          wss.clients[i].send("?"+(+new Date));
      }
    })
  }
})

// serve all files in this directory
app.use(express.static(__dirname + '/public'));



