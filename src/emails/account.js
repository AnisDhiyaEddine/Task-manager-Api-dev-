


var nodemailer = require('nodemailer');



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN,
    pass: process.env.PASSWORD
  }
});



const sendWelcomeEmail = ({email,name})=>{
  var mailOptions = {
    from: 'a.boudiaf@esi-sba.dz',
    to: email,
    subject: 'Welcome Aboard',
    text: `hi ${name} , we're so exited to have you Enjoy `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


const sendCancelationEmail = ({email,name})=>{
  var mailOptions = {
    from: 'a.boudiaf@esi-sba.dz',
    to: email,
    subject: 'Hi',
    text: `hi ${name} , would you tell us why you're canceling please`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = {sendWelcomeEmail,sendCancelationEmail};