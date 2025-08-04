const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes.js")


exports.contactUsController = async (req,res) =>{
    const { email , firstname, lastname, message, phoneNo, countrycode} = req.body;

    try{
        const emailRes = await mailSender(
            email,
            "Your Data Sent Successfully",

            contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
        )
        console.log("Email Res ", emailRes)
        return res.json({
            success: true,
            message: "Email send successfully",
        })
    } catch (error) {
        console.log("Error", error)
        console.log("Error message :", error.message)
        return res.json({
            success: false,
            message: "Something went wrong...",
        })
    }
}