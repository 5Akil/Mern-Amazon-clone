
import * as nodemailer  from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config();
var transporter = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  }
);

transporter
  .verify()
  .then(() => console.log('Connected to email server'))
  .catch(() => console.log('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));




export default transporter