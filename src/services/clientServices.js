const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const utils = require('../utils/utils')
const { customXML, isExist, updateClient } = utils

function addClient(args) {
    return new Promise( async (resolve, reject) =>{
        const check_phone = await isExist(models.clients, 'cliPhone', args.phone)
        const check_doc = await isExist(models.clients, 'cliDoc', args.doc)
        const check_mail = await isExist(models.clients, 'cliMail', args.email)
        if(check_phone || check_doc || check_mail){
            const message = '¡Algunos datos ya fueron registrados en otros clientes, no pueden volver a utilizarse!';
            resolve({message, status: 400})
        }else{
            models.clients.create({ 
                cliPhone: args.phone, 
                cliDoc: args.doc, 
                cliName: args.name, 
                cliMail: args.email,
                cliWallet: "0"
            }).then((clients) => {
                const message = '¡Cliente registrado con exito!';
                resolve({message, status: 200})
            }, (err) => {
                console.error(err);
                const message = '¡Error del servicio, intente mas tarde!';
                resolve({message, status: 500})
            });
        }
    })
}
function getBalance(args) {
    return new Promise( async (resolve, reject) =>{
        const { phone, doc } = args
        models.clients.findOne({ 
            where: { 
                cliPhone: {
                    [Op.like]: phone
                },
                cliDoc: {
                    [Op.like]: doc
                },
            } 
        })
        .then(client => {
            if(client !== null){
                const message = `!Su balance es: ${client.cliWallet}$!`;
                resolve({message, status: 200})
            }else{
                const message = '¡No se encontro el balance solicitado, verifique los datos!';
                resolve({message, status: 400})
            }
        });
    })
}
function rechargeWallet(args) {
    return new Promise( async (resolve, reject) =>{
        const { phone, doc, value } = args
        models.clients.findOne({ 
            where: { 
                cliPhone: {
                    [Op.like]: phone
                },
                cliDoc: {
                    [Op.like]: doc
                },
            } 
        })
        .then(async client => {
            if(client !== null){
                const result = await updateClient(client, { cliWallet: parseFloat(client.cliWallet)+parseFloat(value)})
                if(result){
                    const message = `!Recarga realizada con exito!`;
                    resolve({message, status: 200})
                }else{
                    const message = '¡Error del servicio, intente mas tarde!';
                    resolve({message, status: 500})
                }
            }else{
                const message = '¡No se encontro el cliente solicitado, verifique los datos!';
                resolve({message, status: 400})
            }
        });
    })
}
const serviceObject = {
    clientServices: {
        clientServicesSoapPort: {
            addClient,
            getBalance,
            rechargeWallet
        }
      }
  };
module.exports = [
    {
        wsdl_path: "/addClient", 
        serviceObject,
        actionName: "addClient",
        xml: customXML("/addClient", "addClient", "clientServices")
    },
    {
        wsdl_path: "/getBalance", 
        serviceObject,
        actionName: "getBalance",
        xml: customXML("/getBalance", "getBalance", "clientServices")
    },
    {
        wsdl_path: "/rechargeWallet", 
        serviceObject,
        actionName: "rechargeWallet",
        xml: customXML("/rechargeWallet", "rechargeWallet", "clientServices")
    }
]