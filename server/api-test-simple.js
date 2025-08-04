const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:4000/api/v1';
let authToken = '';
let userId = '';
let courseId = '';
let categoryId = '';

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
async function testPublicEndpoints() {
  console.log('\n🌐 Testing Public Endpoints...\n');

  // Test get all courses
  console.log('1. Testing Get All Courses...');
  const allCoursesResult = await makeRequest('GET', '/course/getAllCourses');
  console.log('Get All Courses Result:', allCoursesResult.success ? '✅ Success' : '❌ Failed');
  if (allCoursesResult.success && allCoursesResult.data.data && allCoursesResult.data.data.length > 0) {
    courseId = allCoursesResult.data.data[0]._id;
    console.log('Course ID obtained:', courseId ? '✅' : '❌');
  } else {
    console.log('No courses found or error occurred');
  }

  // Test show all categories
  console.log('\n2. Testing Show All Categories...');
  const allCategoriesResult = await makeRequest('GET', '/course/showAllCategories');
  console.log('Show All Categories Result:', allCategoriesResult.success ? '✅ Success' : '❌ Failed');
  if (allCategoriesResult.success && allCategoriesResult.data.data && allCategoriesResult.data.data.length > 0) {
    categoryId = allCategoriesResult.data.data[0]._id;
    console.log('Category ID obtained:', categoryId ? '✅' : '❌');
  } else {
    console.log('No categories found or error occurred');
  }

  // Test get course details (if course exists)
  if (courseId) {
    console.log('\n3. Testing Get Course Details...');
    const courseDetailsResult = await makeRequest('POST', '/course/getCourseDetails', {
      courseId: courseId
    });
    console.log('Get Course Details Result:', courseDetailsResult.success ? '✅ Success' : '❌ Failed');
    if (!courseDetailsResult.success) console.log('Error:', courseDetailsResult.error);
  }

  // Test get category page details (if category exists)
  if (categoryId) {
    console.log('\n4. Testing Get Category Page Details...');
    const categoryDetailsResult = await makeRequest('POST', '/course/getCategoryPageDetails', {
      categoryId: categoryId
    });
    console.log('Get Category Page Details Result:', categoryDetailsResult.success ? '✅ Success' : '❌ Failed');
    if (!categoryDetailsResult.success) console.log('Error:', categoryDetailsResult.error);
  }

  // Test get average rating (if course exists)
  if (courseId) {
    console.log('\n5. Testing Get Average Rating...');
    const avgRatingResult = await makeRequest('GET', `/course/getAverageRating?courseId=${courseId}`);
    console.log('Get Average Rating Result:', avgRatingResult.success ? '✅ Success' : '❌ Failed');
    if (!avgRatingResult.success) console.log('Error:', avgRatingResult.error);
  }

  // Test get all reviews (if course exists)
  if (courseId) {
    console.log('\n6. Testing Get All Reviews...');
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
    message: 'This is a test message from API testing'
  });
  console.log('Contact Us Result:', contactResult.success ? '✅ Success' : '❌ Failed');
  if (!contactResult.success) console.log('Error:', contactResult.error);
}

async function testAuthEndpoints() {
  console.log('\n🔐 Testing Authentication Endpoints (Basic)...\n');

  // Test login with non-existent user (expected to fail)
  console.log('1. Testing Login with Non-existent User...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  });
  console.log('Login Result:', loginResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!loginResult.success) console.log('Expected Error:', loginResult.error.message);

  // Test send OTP (this should work even if user doesn't exist)
  console.log('\n2. Testing Send OTP...');
  const otpResult = await makeRequest('POST', '/auth/sendotp', {
    email: 'newuser@example.com'
  });
  console.log('Send OTP Result:', otpResult.success ? '✅ Success' : '❌ Failed');
  if (!otpResult.success) console.log('Error:', otpResult.error);

  // Test reset password token
  console.log('\n3. Testing Reset Password Token...');
  const resetTokenResult = await makeRequest('POST', '/auth/reet-password-token', {
    email: 'test@example.com'
  });
  console.log('Reset Password Token Result:', resetTokenResult.success ? '✅ Success' : '❌ Failed');
  if (!resetTokenResult.success) console.log('Error:', resetTokenResult.error);
}

async function testProtectedEndpoints() {
  console.log('\n🔒 Testing Protected Endpoints (Without Auth)...\n');

  // Test protected endpoints without auth token (expected to fail)
  console.log('1. Testing Get User Details (No Auth)...');
  const userDetailsResult = await makeRequest('GET', '/profile/getUserDetails');
  console.log('Get User Details Result:', userDetailsResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!userDetailsResult.success) console.log('Expected Error:', userDetailsResult.error.message);

  console.log('\n2. Testing Create Course (No Auth)...');
  const createCourseResult = await makeRequest('POST', '/course/createCourse', {
    courseName: 'Test Course',
    courseDescription: 'This is a test course',
    whatYouWillLearn: 'You will learn testing',
    price: 99,
    tag: 'Test',
    category: 'Programming',
    instructions: 'Follow the instructions carefully'
  });
  console.log('Create Course Result:', createCourseResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!createCourseResult.success) console.log('Expected Error:', createCourseResult.error.message);

  console.log('\n3. Testing Get Instructor Courses (No Auth)...');
  const instructorCoursesResult = await makeRequest('GET', '/course/getInstructorCourses');
  console.log('Get Instructor Courses Result:', instructorCoursesResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!instructorCoursesResult.success) console.log('Expected Error:', instructorCoursesResult.error.message);

  console.log('\n4. Testing Instructor Dashboard (No Auth)...');
  const dashboardResult = await makeRequest('GET', '/profile/instructorDashboard');
  console.log('Instructor Dashboard Result:', dashboardResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!dashboardResult.success) console.log('Expected Error:', dashboardResult.error.message);
}

async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...\n');

  // Test invalid endpoints
  console.log('1. Testing Invalid Endpoint...');
  const invalidEndpointResult = await makeRequest('GET', '/invalid/endpoint');
  console.log('Invalid Endpoint Result:', invalidEndpointResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!invalidEndpointResult.success) console.log('Expected Error:', invalidEndpointResult.status);

  // Test invalid data
  console.log('\n2. Testing Invalid Contact Data...');
  const invalidContactResult = await makeRequest('POST', '/reach/contacUs', {
    // Missing required fields
  });
  console.log('Invalid Contact Result:', invalidContactResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!invalidContactResult.success) console.log('Expected Error:', invalidContactResult.error);

  // Test invalid course ID
  console.log('\n3. Testing Invalid Course ID...');
  const invalidCourseResult = await makeRequest('POST', '/course/getCourseDetails', {
    courseId: 'invalid-course-id'
  });
  console.log('Invalid Course Result:', invalidCourseResult.success ? '✅ Success' : '❌ Failed (Expected)');
  if (!invalidCourseResult.success) console.log('Expected Error:', invalidCourseResult.error);
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Simplified API Tests for StudyNotion Backend\n');
  console.log('='.repeat(60));

  try {
    await testPublicEndpoints();
    await testContactEndpoints();
    await testAuthEndpoints();
    await testProtectedEndpoints();
    await testErrorHandling();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All API tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Public endpoints tested (courses, categories, ratings)');
    console.log('- ✅ Contact endpoints tested');
    console.log('- ✅ Authentication endpoints tested (basic flow)');
    console.log('- ✅ Protected endpoints tested (auth validation)');
    console.log('- ✅ Error handling tested');
    console.log('\n💡 Note: Some tests are expected to fail due to:');
    console.log('   - Authentication requirements');
    console.log('   - Missing test data');
    console.log('   - Invalid inputs (for error testing)');
    console.log('   This is normal behavior for comprehensive API testing.');

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

// Run tests
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
}

main(); 