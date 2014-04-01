var express = require('express');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var app = express();
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
    })
  }
})

// serve all files in this directory
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);