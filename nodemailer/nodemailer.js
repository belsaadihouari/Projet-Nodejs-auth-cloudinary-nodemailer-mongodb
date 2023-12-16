"use strict";
const nodemailer = require("nodemailer");

const Nodemailer = async (lien) => {
  const transporter = nodemailer.createTransport({
    
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.KEY_EMAIL,
    },
 
  });

  const message = {
    from: '"Houari Belsaadi" <stat1401@gmail.com>', // sender address
    to: `${lien}`, 
    subject: "A/S de votre inscription", // Subject line
    text: `pour confirmer votre inscription au site houaribelsaadi.dev veuiller acceder au lien suivant`, // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent:" + info.response);
    }
  });
};
module.exports = Nodemailer;
