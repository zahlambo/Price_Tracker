
const nodemailer = require("nodemailer");

async function mail(to, product, price) {
//   let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "noreply.pricedown@gmail.com", 
      pass: "jimjamessafatarpita", 
    },
  });

  try {
    let info = await transporter.sendMail({
        from: '"Price Tracker Organization 👻" <noreply.pricedown@gmail.com>', 
        to: `${to}`, 
        subject: `Your favorite product's price is down!`, 
        text: ``,
        html: `<html><body>
            <h2>Ready to buy???</h2>
            You told us to remind when ${product}'s price goes down. There! It's down to ${price} now!.
        </body></html>` 
        
      });
    //   console.log("Message sent: %s", info.messageId);
  
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
      console.error(error);
  }
  

//   info.catch(console.error);

 
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



module.exports.mail = mail;