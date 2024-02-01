const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to,
        subject,
        html,
    };

    try {
        let emailResult = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', emailResult);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendEmail,
};
