var express = require('express')
require("dotenv").config();
var bodyParser = require('body-parser')
var cors = require('cors')
var routeSaya = require('./routes/route')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(routeSaya)

app.get('/', (req, res)=>{
    res.send('<h1>Express & Firestore</h1>')
})

const port = process.env.PORT || 3080;

const start = async () => {
    try {
      app.listen(port, console.log(`server is listening on port ${port}...`));
    } catch (error) {
      console.log(error);
    }
  };
  
  start();