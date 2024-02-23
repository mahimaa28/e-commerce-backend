"use strict";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "patelmahimaa28@gmail.com", // generated ethereal user
      pass: "gGdtrhzvE8CVFY6s", // generated ethereal password
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
