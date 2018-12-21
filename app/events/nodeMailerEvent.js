const nodemailer = require('nodemailer');

// Generate SMTP service account from ethereal.email
/* nodemailer.createTestAccount((err, account) => {
    console.log(account);
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    } */

let mailer = (data) => {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'manangular2@gmail.com',
            pass: '#Angularman@123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Message object
    let message = {
        from: 'angularman@gmail.com',
        to: `${data.firstName} <${data.email}>`,
        subject: `${data.subject}`,
        text: ` ${data.message}`,
        html: `<p>${data.message}</p>`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
module.exports = {
    mailer
}