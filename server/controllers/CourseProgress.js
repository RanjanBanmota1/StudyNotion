const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async(req,res) =>{

    const {courseId , subsectionId} = req.body;
    const userId = req.user.id;

    try{
        //subsection validate
        const subsection = await SubSection.findOne(subsectionId);

        if(!subsection){
            return res.status(400).json({
                error:"Invalid SubSection"
            })
        }

        //course progress find kro

        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId: userId,
        })

        if (!courseProgress) {
      // If course progress doesn't exist, create a new one
            return res.status(404).json({
            success: false,
            message: "Course progress Does Not Exist",
            })
        }else{
            if(courseProgress.completedVideos.includes(subsectionId)){
                return res.status(400).json({
                    error: "SubSection already completed"
                })
            }
            courseProgress.completedVideos.push(subsectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success:true,
            message:"Course Updated Successfully"
        })

    }catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal server error" })
    }
}