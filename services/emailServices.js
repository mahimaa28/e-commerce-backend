"use strict";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com ",
//   port: 587 ,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: "patelmahimaa28@gmail.com",
//     pass: "gGdtrhzvE8CVFY6s",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   //
//   // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//   //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//   //       <https://github.com/forwardemail/preview-email>
//   //
// }

// main().catch(console.error);

// module.exports = main;

module.exports = async ({ from, to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'patelmahimaa28@gmail.com', // generated ethereal user
            pass: 'gGdtrhzvE8CVFY6s', // generated ethereal password
        },

    });

    const info = await transporter.sendMail({
        from: `Ecomm <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text:  text, // plain text body
        html: html, // html body
    });
    console.log(info);
}
