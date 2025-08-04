//capture the payment and initiate the Razorpay order
const { instance } = require("../config/razorpay")
const mongoose= require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const CourseProgress = require("../models/CourseProgress");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async(req,res) =>{
    const {courses} = req.body;

    const userId = req.user.body;

    if( courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" });
    }

    let total_amount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id)
            if (!course) {
                return res
                .status(200)
                .json({ success: false, message: "Could not find the Course" })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res
                .status(200)
                .json({ success: false, message: "Student is already Enrolled" })
            }

            total_amount += course.price;
        }

        catch(err){
            console.log(error);
            return res.status(500).json({
                success:false,
                message: err.message,
            })
        }
    }

    const options = {
        amount: total_amount*100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }


    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        res.json({
            success:true,
            data:paymentResponse,
        })
    }

    catch(err){
        console.log(err),
        res.status(500).json({
            success:false,
            message:"Cound not initiate order."
        })
    }
}

exports.verifyPayment = async(req,res) =>{
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  const expectedSignature = crypto.
                            createHmac("sha256", process.env.RAZORPAY_SECRET)
                            .update(body.toString())
                            .digest("hex")
  
    if(expectedSignature === razorpay_signature){
        await enrollStudents(courses,userId,res);
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}

exports.sendPaymentSuccessEmail = async (req,res) =>{

    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }

    try{
        const enrolledStudent = awaitUser.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount/100,
                orderId,
                paymentId
            )
        )
    }catch (err) {
    console.log("error in sending mail", err)
    return res
      .status(400)
      .json({ success: false, 
            message: "Could not send email" })
  }
}

exports.enrollStudents = async (courses,userId, res) =>{
    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide Course ID and User ID"
        })
    }

    for(const courseId of courses){
        try{
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push: {studentsEnrolled: userId}},
                {new:true},
            )

            if (!enrolledCourse) {
                return res
                .status(500)
                .json({ success: false, error: "Course not found" })
            }
            console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseId : courseId,
                userId: userId,
                completedVideos: [],
            })

            const enrolledStudent = await user.findByIdAndUpdate(
                userId,
                {
                    $push:{
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                {new: true},
            )

            console.log("Enrolled student: ", enrolledStudent)
            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                enrolledCourse.courseName,
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )
        console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
    }
}