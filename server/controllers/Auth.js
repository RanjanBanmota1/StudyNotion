const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator").generate
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

exports.signup = async(req,res)=>{
    try{
        //data fetch
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            otp,
            accountType,
        } = req.body;
        //data validate field filled or not
        if( !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !contactNumber ||
            !otp){
                return res.status(403).send({
                    success: false,
                    message:"fill all the details",
                })
            }
            //paswword match
        if(password != confirmPassword){
            return res.status(400).json({
                success:false,
                message:"passwords mismatching",
            })
        }
        //user exists??
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success: false,
                message:"user already exist",
            })
        }
        //find the latest otp sent 
        const response = await OTP.find({email}).sort({
            createdAt:-1}).limit(1);
        console.log("response", response);
        
        if(response.length ===0){
            //otp not found for the mail

            return res.status(400).json({
                success:false,
                message:"The otp is not valid",
            })
        }else if(otp != response[0].otp){
            return res.status(400).json({
                success:false,
                message:"Otp entered is not valid",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password : hashedPassword,
            accountType:accountType,
            additionalDetails: profileDetails._id,
            image:"",
        })

        return res.status(200).json({
            success:true,
            message:"User registered Succefully",
        })
    }

    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again"
        })
    }
}

exports.login = async(req,res) =>{
    try{
        //data fetch
        const {email , password} = req.body;
        //validate

        if(!email || !password) {
            return res.status(400).send({
                success : false,
                message: "fill all the details",
            })
        }
        //check in db 
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"user doesnt't exist",
            })
        }

        //compare the pass token assign
        if(await bcrypt.compare(password , user.password)){
            const token = jwt.sign(
                {email:user.email,
                 id: user._id,
                 role: user.role,   
                },

                process.env.JWT_SECRET,
                {
                 expiresIn: "24h",
                }
            )

            //save the token to user in database
            user.token = token;
            user.password = undefined;
            
            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            //set a cookie for token and return the cookie
            res.cookie("token" , token, options).status(200).json({
                success:true,
                token,
                user,
                message:`user login success`,
            })
        }else{
            return res.status(401).json({
                success:false,
                message: "password is inccorect",
            })
        }

        
    }catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}

exports.sendotp = async(req,res) =>{
    try{
        //fetch email
        const {email} = req.body;
        //email validate

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message:"user is already registered"
            })
        }
        //generate otp
        var otp = otpGenerator(6,{
            upperCaseAlphabets:false,
            specialChars: false,
            lowerCaseAlphabets:false,
        })
        //otp validate doenst exist like that

        let result = await OTP.findOne({otp:otp})
        //otp ko save krnaa in db entry

        while(result){
            otp = otpGenerator(6,{
            upperCaseAlphabets:false,
            specialChars: false,
            lowerCaseAlphabets:false,
        })

        result = await OTP.findOne({otp});
        }
        //otp send

        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        res.status(200).json({
            success:true,
            message:"otp sent successfully",
            otp,
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({
            success:false,
            error:err.message,
        })
    }
}

exports.changePassword = async(req,res)=>{
    try{
        //fetch data
        const userDetails = await User.findById(req.User.id);
        const {oldPassword, newPassword} = req.body; 
        //validate
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both old and new password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password,
        );
        //check previous pass

        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"the password doesn't match",
            })
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        //find and update
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {
                password:encryptedPassword,
            },
            {new:true}
        )
        // send the mail
        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "password changed successfully",
                `your password has been updated succefully on ${new Date().toLocaleString()}.`
            )
        }
        catch (emailErr) {
            console.error("Error sending email:", emailErr);
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch(err){
        return res.json(500).json({
            success:false,
            message:"something went wrong while updating the password",
        });
    }
}