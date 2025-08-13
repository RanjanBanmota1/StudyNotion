const mongoose = require('mongoose');
const Category = require('./models/Category');
const Course = require('./models/Course');

// Connect to MongoDB (adjust connection string as needed)
mongoose.connect('mongodb://localhost:27017/studynotion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testCategoryFlow() {
  try {
    console.log('🔍 Testing Category-Course Relationship...\n');

    // 1. Check if categories exist
    console.log('1. Checking existing categories...');
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.course.length} courses`);
    });

    // 2. Check if courses exist
    console.log('\n2. Checking existing courses...');
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`  - ${course.courseName} (Category: ${course.category})`);
    });

    // 3. Test population
    console.log('\n3. Testing category population...');
    const populatedCategories = await Category.find({}).populate('course');
    console.log('Populated categories:');
    populatedCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.course.length} courses`);
      if (cat.course.length > 0) {
        cat.course.forEach(course => {
          console.log(`    * ${course.courseName}`);
        });
      }
    });

    // 4. Check specific category
    if (categories.length > 0) {
      const testCategory = categories[0];
      console.log(`\n4. Testing specific category: ${testCategory.name}`);
      
      const categoryWithCourses = await Category.findById(testCategory._id).populate('course');
      console.log(`Category "${categoryWithCourses.name}" has ${categoryWithCourses.course.length} courses`);
      
      if (categoryWithCourses.course.length > 0) {
        console.log('Courses:');
        categoryWithCourses.course.forEach(course => {
          console.log(`  - ${course.courseName} (Status: ${course.status})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testCategoryFlow(); 