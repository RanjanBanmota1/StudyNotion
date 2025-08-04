const nodemailer = require("nodemailer");

const mailSender = async (email, subject, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465, // Use SSL port
            secure: true, // Use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject, // Correct key
            html: body
        });

        console.log("Mail sent:", info);
        return info;
    } catch (err) {
        console.error("Mail send error:", err);
        throw err;
    }
}

module.exports = mailSender;