var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "QQ",
    auth: {
        user: "1076663958@qq.com",
        pass: ""
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "1076663958@qq.com", // sender address
    to: "1076663958@qq.com", // list of receivers
    subject: "from spider", // Subject line
    text: "spider's homework finished ", // plaintext body
    html: "<b>spider's homework finished</b>" // html body
}

// send mail with defined transport object
function mail(){
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log('er:'+error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});
}
exports.mail = mail;
