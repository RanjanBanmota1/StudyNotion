const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:4000/api/v1';
let authToken = '';
let userId = '';
let courseId = '';
let categoryId = '';
let sectionId = '';
let subSectionId = '';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  contactNumber: '1234567890',
  accountType: 'Student',
  otp: '123456'
};

const testInstructor = {
  firstName: 'Test',
  lastName: 'Instructor',
  email: 'testinstructor@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  contactNumber: '1234567891',
  accountType: 'Instructor',
  otp: '123456'
};

const testAdmin = {
  firstName: 'Test',
  lastName: 'Admin',
  email: 'testadmin@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  contactNumber: '1234567892',
  accountType: 'Admin',
  otp: '123456'
};

// Utility function to make requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Test functions
async function testAuthEndpoints() {
  console.log('\n🔐 Testing Authentication Endpoints...\n');

  // Test send OTP first (required for signup)
  console.log('1. Testing Send OTP for User...');
  const otpResult = await makeRequest('POST', '/auth/sendotp', {
    email: testUser.email
  });
  console.log('Send OTP Result:', otpResult.success ? '✅ Success' : '❌ Failed');
  if (otpResult.success) {
    testUser.otp = otpResult.data.otp;
    console.log('OTP obtained:', testUser.otp);
  } else {
    console.log('Error:', otpResult.error);
  }

  // Test send OTP for instructor
  console.log('\n2. Testing Send OTP for Instructor...');
  const instructorOtpResult = await makeRequest('POST', '/auth/sendotp', {
    email: testInstructor.email
  });
  console.log('Instructor OTP Result:', instructorOtpResult.success ? '✅ Success' : '❌ Failed');
  if (instructorOtpResult.success) {
    testInstructor.otp = instructorOtpResult.data.otp;
    console.log('Instructor OTP obtained:', testInstructor.otp);
  } else {
    console.log('Error:', instructorOtpResult.error);
  }

  // Test send OTP for admin
  console.log('\n3. Testing Send OTP for Admin...');
  const adminOtpResult = await makeRequest('POST', '/auth/sendotp', {
    email: testAdmin.email
  });
  console.log('Admin OTP Result:', adminOtpResult.success ? '✅ Success' : '❌ Failed');
  if (adminOtpResult.success) {
    testAdmin.otp = adminOtpResult.data.otp;
    console.log('Admin OTP obtained:', testAdmin.otp);
  } else {
    console.log('Error:', adminOtpResult.error);
  }

  // Test signup with valid OTP
  console.log('\n4. Testing User Signup...');
  const signupResult = await makeRequest('POST', '/auth/signup', testUser);
  console.log('Signup Result:', signupResult.success ? '✅ Success' : '❌ Failed');
  if (!signupResult.success) console.log('Error:', signupResult.error);

  // Test instructor signup
  console.log('\n5. Testing Instructor Signup...');
  const instructorSignupResult = await makeRequest('POST', '/auth/signup', testInstructor);
  console.log('Instructor Signup Result:', instructorSignupResult.success ? '✅ Success' : '❌ Failed');
  if (!instructorSignupResult.success) console.log('Error:', instructorSignupResult.error);

  // Test admin signup
  console.log('\n6. Testing Admin Signup...');
  const adminSignupResult = await makeRequest('POST', '/auth/signup', testAdmin);
  console.log('Admin Signup Result:', adminSignupResult.success ? '✅ Success' : '❌ Failed');
  if (!adminSignupResult.success) console.log('Error:', adminSignupResult.error);

  // Test login
  console.log('\n7. Testing Login...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log('Login Result:', loginResult.success ? '✅ Success' : '❌ Failed');
  if (loginResult.success) {
    authToken = loginResult.data.token;
    userId = loginResult.data.user.id;
    console.log('Auth Token obtained:', authToken ? '✅' : '❌');
  } else {
    console.log('Error:', loginResult.error);
  }

  // Test change password (requires auth)
  console.log('\n8. Testing Change Password...');
  const changePasswordResult = await makeRequest('POST', '/auth/changepassword', {
    oldPassword: testUser.password,
    newPassword: 'NewPassword123!'
  }, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('Change Password Result:', changePasswordResult.success ? '✅ Success' : '❌ Failed');
  if (!changePasswordResult.success) console.log('Error:', changePasswordResult.error);

  // Test reset password token
  console.log('\n9. Testing Reset Password Token...');
  const resetTokenResult = await makeRequest('POST', '/auth/reet-password-token', {
    email: testUser.email
  });
  console.log('Reset Password Token Result:', resetTokenResult.success ? '✅ Success' : '❌ Failed');
  if (!resetTokenResult.success) console.log('Error:', resetTokenResult.error);
}

async function testProfileEndpoints() {
  console.log('\n👤 Testing Profile Endpoints...\n');

  if (!authToken) {
    console.log('❌ No auth token available, skipping profile tests');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test get user details
  console.log('1. Testing Get User Details...');
  const userDetailsResult = await makeRequest('GET', '/profile/getUserDetails', null, headers);
  console.log('Get User Details Result:', userDetailsResult.success ? '✅ Success' : '❌ Failed');
  if (!userDetailsResult.success) console.log('Error:', userDetailsResult.error);

  // Test update profile
  console.log('\n2. Testing Update Profile...');
  const updateProfileResult = await makeRequest('PUT', '/profile/updateProfile', {
    firstName: 'Updated',
    lastName: 'Name',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    contactNumber: '1234567890',
    about: 'Updated about section'
  }, headers);
  console.log('Update Profile Result:', updateProfileResult.success ? '✅ Success' : '❌ Failed');
  if (!updateProfileResult.success) console.log('Error:', updateProfileResult.error);

  // Test update display picture (simulated)
  console.log('\n3. Testing Update Display Picture...');
  const updatePictureResult = await makeRequest('PUT', '/profile/updateDisplayPicture', {
    image: 'base64_encoded_image_data'
  }, headers);
  console.log('Update Display Picture Result:', updatePictureResult.success ? '✅ Success' : '❌ Failed');
  if (!updatePictureResult.success) console.log('Error:', updatePictureResult.error);

  // Test instructor dashboard (if user is instructor)
  console.log('\n4. Testing Instructor Dashboard...');
  const dashboardResult = await makeRequest('GET', '/profile/instructorDashboard', null, headers);
  console.log('Instructor Dashboard Result:', dashboardResult.success ? '✅ Success' : '❌ Failed');
  if (!dashboardResult.success) console.log('Error:', dashboardResult.error);
}

async function testCourseEndpoints() {
  console.log('\n📚 Testing Course Endpoints...\n');

  if (!authToken) {
    console.log('❌ No auth token available, skipping course tests');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test get all courses
  console.log('1. Testing Get All Courses...');
  const allCoursesResult = await makeRequest('GET', '/course/getAllCourses');
  console.log('Get All Courses Result:', allCoursesResult.success ? '✅ Success' : '❌ Failed');
  if (allCoursesResult.success && allCoursesResult.data.data.length > 0) {
    courseId = allCoursesResult.data.data[0]._id;
    console.log('Course ID obtained:', courseId ? '✅' : '❌');
  } else {
    console.log('No courses found or error occurred');
  }

  // Test get course details
  if (courseId) {
    console.log('\n2. Testing Get Course Details...');
    const courseDetailsResult = await makeRequest('POST', '/course/getCourseDetails', {
      courseId: courseId
    });
    console.log('Get Course Details Result:', courseDetailsResult.success ? '✅ Success' : '❌ Failed');
    if (!courseDetailsResult.success) console.log('Error:', courseDetailsResult.error);
  }

  // Test get full course details (requires auth)
  if (courseId) {
    console.log('\n3. Testing Get Full Course Details...');
    const fullCourseDetailsResult = await makeRequest('POST', '/course/getFullCourseDetails', {
      courseId: courseId
    }, headers);
    console.log('Get Full Course Details Result:', fullCourseDetailsResult.success ? '✅ Success' : '❌ Failed');
    if (!fullCourseDetailsResult.success) console.log('Error:', fullCourseDetailsResult.error);
  }

  // Test create course (requires instructor auth)
  console.log('\n4. Testing Create Course...');
  const createCourseResult = await makeRequest('POST', '/course/createCourse', {
    courseName: 'Test Course',
    courseDescription: 'This is a test course',
    whatYouWillLearn: 'You will learn testing',
    price: 99,
    tag: 'Test',
    category: 'Programming',
    instructions: 'Follow the instructions carefully'
  }, headers);
  console.log('Create Course Result:', createCourseResult.success ? '✅ Success' : '❌ Failed');
  if (createCourseResult.success) {
    courseId = createCourseResult.data.data._id;
    console.log('New Course ID:', courseId);
  } else {
    console.log('Error:', createCourseResult.error);
  }

  // Test get instructor courses
  console.log('\n5. Testing Get Instructor Courses...');
  const instructorCoursesResult = await makeRequest('GET', '/course/getInstructorCourses', null, headers);
  console.log('Get Instructor Courses Result:', instructorCoursesResult.success ? '✅ Success' : '❌ Failed');
  if (!instructorCoursesResult.success) console.log('Error:', instructorCoursesResult.error);

  // Test create section (requires instructor auth)
  if (courseId) {
    console.log('\n6. Testing Create Section...');
    const createSectionResult = await makeRequest('POST', '/course/addSection', {
      sectionName: 'Test Section',
      courseId: courseId
    }, headers);
    console.log('Create Section Result:', createSectionResult.success ? '✅ Success' : '❌ Failed');
    if (createSectionResult.success) {
      sectionId = createSectionResult.data.data._id;
      console.log('Section ID:', sectionId);
    } else {
      console.log('Error:', createSectionResult.error);
    }
  }

  // Test update section
  if (sectionId) {
    console.log('\n7. Testing Update Section...');
    const updateSectionResult = await makeRequest('POST', '/course/updateSection', {
      sectionName: 'Updated Section',
      sectionId: sectionId
    }, headers);
    console.log('Update Section Result:', updateSectionResult.success ? '✅ Success' : '❌ Failed');
    if (!updateSectionResult.success) console.log('Error:', updateSectionResult.error);
  }

  // Test create subsection
  if (sectionId) {
    console.log('\n8. Testing Create Subsection...');
    const createSubSectionResult = await makeRequest('POST', '/course/addSubSection', {
      title: 'Test Subsection',
      timeDuration: 300,
      description: 'Test subsection description',
      sectionId: sectionId
    }, headers);
    console.log('Create Subsection Result:', createSubSectionResult.success ? '✅ Success' : '❌ Failed');
    if (createSubSectionResult.success) {
      subSectionId = createSubSectionResult.data.data._id;
      console.log('Subsection ID:', subSectionId);
    } else {
      console.log('Error:', createSubSectionResult.error);
    }
  }

  // Test update subsection
  if (subSectionId) {
    console.log('\n9. Testing Update Subsection...');
    const updateSubSectionResult = await makeRequest('POST', '/course/updateSubSection', {
      title: 'Updated Subsection',
      timeDuration: 400,
      description: 'Updated subsection description',
      subSectionId: subSectionId
    }, headers);
    console.log('Update Subsection Result:', updateSubSectionResult.success ? '✅ Success' : '❌ Failed');
    if (!updateSubSectionResult.success) console.log('Error:', updateSubSectionResult.error);
  }

  // Test update course progress (requires student auth)
  if (courseId && subSectionId) {
    console.log('\n10. Testing Update Course Progress...');
    const updateProgressResult = await makeRequest('POST', '/course/updateCourseProgress', {
      courseId: courseId,
      subSectionId: subSectionId
    }, headers);
    console.log('Update Course Progress Result:', updateProgressResult.success ? '✅ Success' : '❌ Failed');
    if (!updateProgressResult.success) console.log('Error:', updateProgressResult.error);
  }
}

async function testCategoryEndpoints() {
  console.log('\n📂 Testing Category Endpoints...\n');

  if (!authToken) {
    console.log('❌ No auth token available, skipping category tests');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test show all categories
  console.log('1. Testing Show All Categories...');
  const allCategoriesResult = await makeRequest('GET', '/course/showAllCategories');
  console.log('Show All Categories Result:', allCategoriesResult.success ? '✅ Success' : '❌ Failed');
  if (allCategoriesResult.success && allCategoriesResult.data.data.length > 0) {
    categoryId = allCategoriesResult.data.data[0]._id;
    console.log('Category ID obtained:', categoryId ? '✅' : '❌');
  } else {
    console.log('No categories found or error occurred');
  }

  // Test create category (requires admin auth)
  console.log('\n2. Testing Create Category...');
  const createCategoryResult = await makeRequest('POST', '/course/createCategory', {
    name: 'Test Category',
    description: 'This is a test category'
  }, headers);
  console.log('Create Category Result:', createCategoryResult.success ? '✅ Success' : '❌ Failed');
  if (!createCategoryResult.success) console.log('Error:', createCategoryResult.error);

  // Test get category page details
  if (categoryId) {
    console.log('\n3. Testing Get Category Page Details...');
    const categoryDetailsResult = await makeRequest('POST', '/course/getCategoryPageDetails', {
      categoryId: categoryId
    });
    console.log('Get Category Page Details Result:', categoryDetailsResult.success ? '✅ Success' : '❌ Failed');
    if (!categoryDetailsResult.success) console.log('Error:', categoryDetailsResult.error);
  }
}

async function testRatingAndReviewEndpoints() {
  console.log('\n⭐ Testing Rating and Review Endpoints...\n');

  if (!authToken) {
    console.log('❌ No auth token available, skipping rating tests');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test create rating (requires student auth)
  if (courseId) {
    console.log('1. Testing Create Rating...');
    const createRatingResult = await makeRequest('POST', '/course/createRating', {
      courseId: courseId,
      rating: 4,
      review: 'This is a great course!'
    }, headers);
    console.log('Create Rating Result:', createRatingResult.success ? '✅ Success' : '❌ Failed');
    if (!createRatingResult.success) console.log('Error:', createRatingResult.error);
  }

  // Test get average rating
  if (courseId) {
    console.log('\n2. Testing Get Average Rating...');
    const avgRatingResult = await makeRequest('GET', `/course/getAverageRating?courseId=${courseId}`);
    console.log('Get Average Rating Result:', avgRatingResult.success ? '✅ Success' : '❌ Failed');
    if (!avgRatingResult.success) console.log('Error:', avgRatingResult.error);
  }

  // Test get all reviews
  if (courseId) {
    console.log('\n3. Testing Get All Reviews...');
    const allReviewsResult = await makeRequest('GET', `/course/getReviews?courseId=${courseId}`);
    console.log('Get All Reviews Result:', allReviewsResult.success ? '✅ Success' : '❌ Failed');
    if (!allReviewsResult.success) console.log('Error:', allReviewsResult.error);
  }
}

async function testContactEndpoints() {
  console.log('\n📧 Testing Contact Endpoints...\n');

  // Test contact us
  console.log('1. Testing Contact Us...');
  const contactResult = await makeRequest('POST', '/reach/contacUs', {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    message: 'This is a test message'
  });
  console.log('Contact Us Result:', contactResult.success ? '✅ Success' : '❌ Failed');
  if (!contactResult.success) console.log('Error:', contactResult.error);
}

async function testDeleteEndpoints() {
  console.log('\n🗑️ Testing Delete Endpoints...\n');

  if (!authToken) {
    console.log('❌ No auth token available, skipping delete tests');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test delete subsection
  if (subSectionId) {
    console.log('1. Testing Delete Subsection...');
    const deleteSubSectionResult = await makeRequest('POST', '/course/deleteSubSection', {
      subSectionId: subSectionId,
      sectionId: sectionId
    }, headers);
    console.log('Delete Subsection Result:', deleteSubSectionResult.success ? '✅ Success' : '❌ Failed');
    if (!deleteSubSectionResult.success) console.log('Error:', deleteSubSectionResult.error);
  }

  // Test delete section
  if (sectionId) {
    console.log('\n2. Testing Delete Section...');
    const deleteSectionResult = await makeRequest('POST', '/course/deleteSection', {
      sectionId: sectionId
    }, headers);
    console.log('Delete Section Result:', deleteSectionResult.success ? '✅ Success' : '❌ Failed');
    if (!deleteSectionResult.success) console.log('Error:', deleteSectionResult.error);
  }

  // Test delete course
  if (courseId) {
    console.log('\n3. Testing Delete Course...');
    const deleteCourseResult = await makeRequest('DELETE', `/course/deleteCourse?courseId=${courseId}`);
    console.log('Delete Course Result:', deleteCourseResult.success ? '✅ Success' : '❌ Failed');
    if (!deleteCourseResult.success) console.log('Error:', deleteCourseResult.error);
  }

  // Test delete profile
  console.log('\n4. Testing Delete Profile...');
  const deleteProfileResult = await makeRequest('DELETE', '/profile/deleteProfile', {
    password: 'NewPassword123!'
  }, headers);
  console.log('Delete Profile Result:', deleteProfileResult.success ? '✅ Success' : '❌ Failed');
  if (!deleteProfileResult.success) console.log('Error:', deleteProfileResult.error);
}

async function createWebDevCourse() {
  console.log('\n🌐 Creating Web Development Course with HTML section and CSS subsection...');
  // Login as instructor
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: testInstructor.email,
    password: testInstructor.password
  });
  if (!loginResult.success) {
    console.log('❌ Instructor login failed:', loginResult.error);
    return;
  }
  const instructorToken = loginResult.data.token;
  const headers = { Authorization: `Bearer ${instructorToken}` };

  // Create course
  const courseResult = await makeRequest('POST', '/course/createCourse', {
    courseName: 'Web Development',
    courseDescription: 'Learn web development from scratch',
    whatYouWillLearn: 'HTML, CSS, JS, and more',
    price: 199,
    tag: JSON.stringify(['WebDev', 'Programming']),
    category: 'Programming',
    instructions: JSON.stringify(['Follow the modules in order.', 'Complete all assignments.'])
  }, headers);
  if (!courseResult.success) {
    console.log('❌ Course creation failed:', courseResult.error);
    return;
  }
  const newCourseId = courseResult.data.data._id;
  console.log('✅ Course created. ID:', newCourseId);

  // Add section: HTML
  const sectionResult = await makeRequest('POST', '/course/addSection', {
    sectionName: 'HTML',
    courseId: newCourseId
  }, headers);
  if (!sectionResult.success) {
    console.log('❌ Section creation failed:', sectionResult.error);
    return;
  }
  const newSectionId = sectionResult.data.data._id;
  console.log('✅ Section created. ID:', newSectionId);

  // Add subsection: CSS
  const subSectionResult = await makeRequest('POST', '/course/addSubSection', {
    title: 'CSS',
    timeDuration: 600,
    description: 'Learn CSS basics',
    sectionId: newSectionId
  }, headers);
  if (!subSectionResult.success) {
    console.log('❌ Subsection creation failed:', subSectionResult.error);
    return;
  }
  const newSubSectionId = subSectionResult.data.data._id;
  console.log('✅ Subsection created. ID:', newSubSectionId);

  console.log('\n🎉 Web Development course with HTML section and CSS subsection created successfully!');
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Tests for StudyNotion Backend\n');
  console.log('='.repeat(60));

  try {
    await testAuthEndpoints();
    await testProfileEndpoints();
    await testCourseEndpoints();
    await testCategoryEndpoints();
    await testRatingAndReviewEndpoints();
    await testContactEndpoints();
    await testDeleteEndpoints();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All API tests completed!');
    console.log('Note: Some tests may fail due to authentication requirements or missing data.');
    console.log('This is normal behavior for a comprehensive API test.');

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get('http://localhost:4000/');
    console.log('✅ Server is running:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd server && npm run dev');
    return false;
  }
}

// Run only auth and profile tests for debugging
async function main() {
  await createWebDevCourse();
}

main(); 