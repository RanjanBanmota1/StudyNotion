const {Mongoose} = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
exports.createCategory = async (req,res) =>{
    try{
        const {name, description} = req.body;

        if(!name){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const CategoryDetails = await Category.create({
            name:name,
            description: description,
        });

        console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        })
    }
    catch(err){
        return res.status(500).json({success: false,
        message: err.message,
        });
    }
}

exports.showAllCategories = async (req, res)=>{
    try{
        console.log("inside show all categories");

        const allCategories = await Category.find({}).populate("course");

        res.status(200).json({
            success:true,
            data:allCategories,
        })
    }

    catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
        });
    }
}

exports.categoryPageDetails = async(req,res)=>{
    try{
        //category id
        const {categoryId} = req.body;
        //category specified nikaalo
        const selectedCategory = await Category.findById(categoryId).populate({
            path:"course",
            match: {status: "Published"},
            populate: "ratingAndReviews",
        }).exec();

        if (!selectedCategory) {
            console.log("Category not found.")
            return res
            .status(404)
            .json({ success: false, message: "Category not found" })
        }

        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }
        //for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        });
            
        
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        ).populate({
            path: "course",
            match: { status: "Published" },
            })
            .exec()  
        //top selling ctegories nikaalo

        const topCourses = await Course.aggregate([
            {$match: {status:"Published"}},
            {
                $addFields:{$size:"$studentsEnrolled"}
            },

            {$sort:{enrolledCount : -1}},
            {$limit:10}
        ]);


        res.status(200).json({
            success: true,
            data: {
            selectedCategory,
            differentCategory,
            topCourses,
            },
        });
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        });
    }
}