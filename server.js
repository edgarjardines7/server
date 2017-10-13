const express = require("express");
const path = require("path");
const favicon = require("serve-favicon")
const fs = require('fs');// nativo de node
const https =require('https');
const topojson = require('topojson-client');

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(express.static(path.join(__dirname, "dist")));

//app.use(favicon(path.join(__dirname, "dist", "favicon.ico")));
//Arrow function ()=>
/*
app.get('/', function(req,res){
  res.sendFile('index.html')
});
*/

app.get('/', function(req,res){
  res.send('Bienvenido al api')
});

var apiV1 = express.Router();
var apiV2 = express.Router();

apiV1.get('/',function(req, res){
  res.send('Bienvenido al api v1')
});

apiV1.get('/estados',function(req, res){
  //res.send('Bienvenido al api v1')

  var estados=[
    {
      neme: 'Aguascalientes',
      population: 123456
    },{
      neme: 'Guerrero',
      population: 67890
    }

  ]
  res.status(200).json({
    status: true,
    estados:estados


  })
});

apiV2.get('/paises/estados/ciudades',function(req, res){
  var ciudades = [];
  var worldData = [];
  fs.readFile('/cities.json','utf-8', function(err,data){
    ciudades =JSON.parse(data).states

    var woldJson = 'https://unpkg.com/world-atlas@1.1.4/world/110m.json'

    https.get(woldJson, function (response){
      var body = '';
      response.on('data', function (d){
        body += d;
      });

      response.on('end', function(d){
        try {
        worldData = JSON.parse(body)
        worldData= topojson.feature(worldData, worldData.objects.countries);
        //console.log(worldData)
        res.status(200).json({
          status:true,
          ciudades: ciudades,
          worldData: worldData
        })

        } catch (err) {
          console.error('Error: ', err)
        }
      })
      console.log(response);
    })

  });


});


app.use('/api/v1',apiV1);
app.use('/api/v2',apiV2);



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
