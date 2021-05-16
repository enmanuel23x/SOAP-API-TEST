const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const utils = require('../utils/utils')
const config = require('../../token.json');
const { customXML, sendEmail, getClient, getPayment, updatePayment, updateClient } = utils

function generatePay(args) {
    return new Promise( async (resolve, reject) =>{
        const { phone_src, doc_src, phone_dest, doc_dest, value } = args
        const client_src = await getClient(models.clients, {phone: phone_src, doc: doc_src})
        const client_dest = await getClient(models.clients, {phone: phone_dest, doc: doc_dest})
        if(client_src !== null && client_dest !== null){
            const token = jwt.sign({ sub: { 
                cliSrc: client_src.cliId, 
                cliDest: client_dest.cliId, 
                payValue: value, 
                payStatus: "0",
                date: new Date()
            }}, config.secret);
            await sendEmail(client_src.cliMail, "Token de confirmación", `Su token de confirmacion es: ${token}`)
            models.payment.create({ 
                cliSrc: client_src.cliId, 
                cliDest: client_dest.cliId, 
                payValue: value, 
                payStatus: "0",
                payTokenValidation: token
            }).then((payment) => {
                resolve({ payId: payment.payId, status: 200})
            }, (err) => {
                console.error(err);
                const message = '¡Error del servicio, intente mas tarde!';
                resolve({message, status: 500})
            });
        }else{
            const message = '¡Cliente o destinario no encontrados, por favor verifique los datos!';
            resolve({message, status: 400})
        }
    })
}
function confirmPayment(args) {
    return new Promise( async (resolve, reject) =>{
        const { payId, token } = args
        const payment = await getPayment(models.payment, payId,"0")
        if(payment !== null){
            if(payment.payTokenValidation == token){
                const client_src = await getClient(models.clients, {id: payment.cliSrc})
                const client_dest = await getClient(models.clients, {id: payment.cliDest})
                if(client_src !== null && client_dest !== null){
                    if(parseFloat(client_src.cliWallet) >= parseFloat(payment.payValue)){
                        await updateClient(client_src, { cliWallet: parseFloat(client_src.cliWallet)-parseFloat(payment.payValue)})
                        await updateClient(client_dest, { cliWallet: parseFloat(client_dest.cliWallet)+parseFloat(payment.payValue)})
                        await updatePayment(payment, { payStatus: "1"})
                        const message = `!Pago realizado con exito!`;
                        resolve({message, status: 200})
                    }else{
                        await updatePayment(payment, { payStatus: "2"})
                        const message = '¡Saldo insuficiente para realizar esta operación!';
                        resolve({message, status: 400})
                    }
                }else{
                    await updatePayment(payment, { payStatus: "2"})
                    const message = '¡Error al realizar el pago, por favor verifique los datos e intente realizar el pago nuevamente!';
                    resolve({message, status: 500})
                }
            }else{
                const message = '¡Token invalido, por favor verifique los datos!';
                resolve({message, status: 400})
            }
        }else{
            const message = '¡Pago por validar no encontrado, por favor verifique los datos e intente realizar el pago nuevamente!';
            resolve({message, status: 400})
        }
    }) 
}
const serviceObject = {
    paymentServices: {
        paymentServicesSoapPort: {
            generatePay,
            confirmPayment
        }
      }
  };
module.exports = [
    {
        wsdl_path: "/generatePay", 
        serviceObject,
        actionName: "generatePay",
        xml: customXML("/generatePay", "generatePay", "paymentServices")
    },
    {
        wsdl_path: "/confirmPayment", 
        serviceObject,
        actionName: "confirmPayment",
        xml: customXML("/confirmPayment", "confirmPayment", "paymentServices")
    }
]