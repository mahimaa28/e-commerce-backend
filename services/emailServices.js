"use strict";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.PASS, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: `Ecomm <${from}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
  console.log(info);
};
