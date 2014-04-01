var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.bodyParser());

if(process.env.USERNAME && process.env.PASSWORD)
  app.post('/',express.basicAuth(process.env.USERNAME, process.env.PASSWORD))

app.post('/', function(req, res){

  res.send('COFFEE!!!\n');

  fs.readFile(req.files.file.path, function (err, data) {
    var newPath = __dirname + "/public/recent.jpg";
    fs.writeFile(newPath, data, function (err) {
      if(err) console.err(err);
      console.log("written!")
    });
  });
})

// serve all files in this directory
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);