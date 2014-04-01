var express = require('express');
var http = require('http');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var WebSocketServer = require('ws').Server;
var app = express();
var redis_url = (process.env.REDISTOGO_URL || 'redis://localhost:6379') + '?return_buffers=true';
var redis = require('redis-url').connect(redis_url);

var server = http.createServer(app);
server.listen(process.env.PORT || 3000)

var wss = new WebSocketServer({server: server});
var io = require('socket.io').listen(server, {transports: ['xhr-polling'], "polling duration": 10,'log level': 2})

app.use(express.bodyParser());

app.get('/recent.jpg', function(req, res){
  res.type('image/jpeg');
  redis.get("recent", function(err, reply) {
    res.send(reply);
  });
})


if(process.env.USERNAME && process.env.PASSWORD)
  app.post('/',express.basicAuth(process.env.USERNAME, process.env.PASSWORD))

app.post('/', function(req, res){

  if(req.files.file.path){
    var newPath = __dirname + "/public/recent.jpg";
    var newPath = req.files.file.path + '.resized';

    gm(req.files.file.path)
    .autoOrient()
    .resize(640, 640)
    .write(newPath, function (err) {
      if(err) console.log(err);
      console.log("written!", newPath);

      fs.readFile(newPath, function (err, data) {
        if (err) throw err;
        redis.set("recent", data, function(){
          console.log("persisted to redis");

          // publish that we got a new image
          for(var i in wss.clients)
            wss.clients[i].send("?"+(+new Date));

          io.sockets.emit('image', "?"+(+new Date))

        });
      });

      // respond to the uploader
      res.send(err ? 'some kind of ERROR HAPPENED\n' : 'COFFEE!!!\n');
    })
  }
})

// serve all files in this directory
app.use(express.static(__dirname + '/public'));



