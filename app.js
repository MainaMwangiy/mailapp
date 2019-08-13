require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const http = require("http");
const path = require("path");

const app = express();

// View engine set up
app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

app.set("view engine", "html");

//set  Views folder
app.use('/public',express.static(path.join(__dirname, "public")));



//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output =`
        <p> You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone Number: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    //create reusable transporter using default smtp transport
    let transporter = nodemailer.createTransport({ 
        host:'smtp.gmail.com',
        port: 465,
        secure: true, //true for port 465, false for other ports
        auth: {
            user:process.env.HOST_EMAIL, //generated ethereal user
            pass: process.env.EMAIL_PASSWORD //generated ethereal password
        },
        domains: ["gmail.com", "googlemail.com"],
        tls: {
            rejectUnauthorized: false
        }
    });

    // var email = [
    //     req.body
    // ];
    const {email} = req.body;
    email.toString();

    //set up email data with unicode symbols
    let mailOptions = {
        from: 'fast-linker', //senders address
        to: email, //list of receivers
        subject: 'Contact Request', //Subject Line
        text: 'Greetings?', //plain text body
        html: output //html body
    }

    //send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if(error)  {
            return console.log(error);
        }
        console.log('Message Sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Email has been sent'});
    });
});

app.listen(3030, () => console.log('Server Started'))