const fs = require("fs");
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const Op = Sequelize.Op;
const xml = fs.readFileSync(__dirname+'/wsdl/base.wsdl', 'utf8');
module.exports = {
    sendEmail: async(to, subject, text) => {
        return await new Promise( (resolve, reject) =>{
            const transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                   user: config.email_user,
                   pass: config.email_pass
                }
            })
            const message = {
                from: config.email_user,
                to,
                subject,
                text
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                    resolve({sended: false})
                } else {
                    
                    resolve({sended: true})
                }
                transport.close();
            })
        })
    },
    getPayment: async(model, payId, status) => {
        return await new Promise( (resolve, reject) =>{
            model.findOne({ 
                where: { 
                    payId: {
                        [Op.like]: parseInt(payId)
                    },
                    payStatus: {
                        [Op.like]: status
                    }
                } 
            })
            .then(client => resolve(client));
        })
    },
    updatePayment: async(payment, props) => {
        return await new Promise( (resolve, reject) =>{
            payment.update({...props})
            .then((clients) => {
                resolve(true)
            }, (err) => {
                resolve(false)    
            });
        })
    },
    updateClient: async(client, props) => {
        return await new Promise( (resolve, reject) =>{
            client.update({...props})
            .then((clients) => {
                resolve(true)
            }, (err) => {
                resolve(false)    
            });
        })
    },
    getClient: async(model, {phone, doc, id}) => {
        return await new Promise( (resolve, reject) =>{
            let where = {}
            if(phone){
                where.cliPhone ={
                    [Op.like]: phone
                }
            }
            if(id){
                where.cliId ={
                    [Op.like]: parseInt(id)
                }
            }
            if(doc){
                where.cliDoc ={
                    [Op.like]: doc
                }
            }
            model.findOne({ where })
            .then(client => resolve(client));
        })
    },
    isExist: async(model, field, param) => {
        return await new Promise( (resolve, reject) =>{
            model.findOne({ 
                where: { 
                    [field]: {
                        [Op.like]: param
                    }
                } 
            })
            .then(token => token !== null)
            .then(isUnique => resolve(isUnique));
        })
    },
    customXML: async (path, action, service) =>{
        let custom = xml.replaceAll("runAction", action);
        custom = custom.replaceAll("ServiceName", service);
        custom = custom.replace("/path", path);
        return custom;
    }
}