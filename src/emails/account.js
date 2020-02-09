const sgMail = require('@sendgrid/mail')
const sendGridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'pgprateekgarg2@gmail.com',
        subject:'Thanks for Joining',
        text:`welcome to the app, ${name}, Let me know how get along with the app.`,
    })
}

const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'pgprateekgarg2@gmail.com',
        subject:'Cancellation',
        text: `Hey ${name}, Sorry you had a bad experience with us. Your Membership has been cancelled successfully`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}