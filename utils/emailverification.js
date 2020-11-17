const nodemailer = require('nodemailer');
const environment = process.env
const fs = require("fs");
const handlebars = require('handlebars');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: environment.MAIL_ID,
        pass: environment.MAIL_PASSWORD
    }
});

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = {
    sendMail: (to, subject, text, html = null) => {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: environment.MAIL_ID,
                to: to,
                subject: subject,
                text: text,

            };
            if (html) {
                mailOptions = {
                    ...mailOptions,
                    ...{
                        html: html
                    }
                }
            }

            // console.log(transporter)


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info.response)
                }
            });
        })
    },
    sendEmailWithAttachments: (subject, html, toAddresses, attachments = null) => {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: environment.MAIL_ID,
                subject: subject,
                to: toAddresses,
                attachments: attachments
            };

            if (html) {
                mailOptions = {
                    ...mailOptions,
                    ...{
                        html: html
                    }
                }
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info.response)
                }
            });
        })
    }
}