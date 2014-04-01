var express = require('express');
var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res){
  res.send('COFFEE?!\n');
});

if(process.env.USERNAME && process.env.PASSWORD)
  app.post('/',express.basicAuth(process.env.USERNAME, process.env.PASSWORD))

app.post('/', function(req, res){
  res.send('COFFEE!!!\n');
})

app.listen(process.env.PORT || 3000);