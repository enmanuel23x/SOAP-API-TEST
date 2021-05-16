const express = require('express');
const app = express();
const soap = require('soap');
//services
const clientServices = require('./src/services/clientServices')
const paymentServices = require('./src/services/paymentServices')
const services = [...clientServices, ...paymentServices]
//const
const NODE_ENV = "develop"

//const
const version = '/v1';
app.get('/', function (req, res) {
    res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
  })
  
const port = 8000;
app.listen(port, async function () {
  for (let index = 0; index < services.length; index++) {
    soap.listen(app, services[index].wsdl_path, services[index].serviceObject, await services[index].xml);
  }
    
    console.log(`Backend SOAP corriendo en localhost:${port}`);
});