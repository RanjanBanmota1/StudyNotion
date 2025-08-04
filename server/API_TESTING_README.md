# StudyNotion API Testing Guide

This guide will help you test all the API endpoints in the StudyNotion backend (excluding payment endpoints).

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v14 or higher)
2. **MongoDB** running locally or accessible
3. **StudyNotion server** running

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Run the tests:**
   ```bash
   npm test
   ```

## 📋 What's Being Tested

The test suite covers all major API endpoints:

### 🔐 Authentication (`/api/v1/auth`)
- ✅ User Signup (Student, Instructor, Admin)
- ✅ User Login
- ✅ Send OTP
- ✅ Change Password
- ✅ Reset Password Token

### 👤 Profile Management (`/api/v1/profile`)
- ✅ Get User Details
- ✅ Update Profile
- ✅ Update Display Picture
- ✅ Instructor Dashboard
- ✅ Delete Account

### 📚 Course Management (`/api/v1/course`)
- ✅ Get All Courses
- ✅ Get Course Details
- ✅ Get Full Course Details
- ✅ Create Course
- ✅ Get Instructor Courses
- ✅ Create Section
- ✅ Update Section
- ✅ Create Subsection
- ✅ Update Subsection
- ✅ Update Course Progress

### 📂 Category Management (`/api/v1/course`)
- ✅ Show All Categories
- ✅ Create Category
- ✅ Get Category Page Details

### ⭐ Rating & Reviews (`/api/v1/course`)
- ✅ Create Rating
- ✅ Get Average Rating
- ✅ Get All Reviews

### 📧 Contact (`/api/v1/reach`)
- ✅ Contact Us

### 🗑️ Delete Operations
- ✅ Delete Subsection
- ✅ Delete Section
- ✅ Delete Course
- ✅ Delete Profile

## 🔧 Configuration

### Environment Variables

The test runner will automatically create a `.env` file with test values if one doesn't exist. For full functionality, you may need to update these values:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/studynotion

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUD_NAME=your-cloud-name
API_KEY=your-api-key
API_SECRET=your-api-secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Razorpay Configuration
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret

# Server Configuration
PORT=4000
NODE_ENV=development
```

## 🧪 Running Tests

### Option 1: Full Test Suite
```bash
npm test
```
This will:
- Check for `.env` file and create one if needed
- Run all API tests
- Provide a summary of results

### Option 2: Direct API Testing
```bash
npm run test-api
```
This runs the API tests directly without the setup checks.

### Option 3: Manual Testing
```bash
node api-test.js
```

## 📊 Understanding Test Results

### ✅ Success Indicators
- **Green checkmarks** indicate successful API calls
- **Status codes** 200-299 indicate successful responses
- **Proper data structure** in responses

### ❌ Failure Indicators
- **Red X marks** indicate failed API calls
- **Status codes** 400+ indicate errors
- **Authentication errors** (401) are expected for protected routes without proper tokens

### ⚠️ Expected Failures
Some tests may fail due to:
- **Authentication requirements** (need proper user roles)
- **Missing data** (courses, categories, etc.)
- **Environment configuration** (email, cloudinary, etc.)

This is **normal behavior** for a comprehensive API test.

## 🔍 Test Data

The tests use the following test accounts:

### Student Account
- Email: `testuser@example.com`
- Password: `TestPassword123!`

### Instructor Account
- Email: `testinstructor@example.com`
- Password: `TestPassword123!`

### Admin Account
- Email: `testadmin@example.com`
- Password: `TestPassword123!`

## 🛠️ Troubleshooting

### Common Issues

1. **Server not running**
   ```
   ❌ Server is not running. Please start the server first:
      cd server && npm run dev
   ```

2. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URL` in `.env`

3. **Authentication errors**
   - Some endpoints require specific user roles
   - Tests will show which endpoints failed due to auth

4. **Missing dependencies**
   ```bash
   npm install axios form-data
   ```

### Debug Mode

To see more detailed error information, you can modify the `api-test.js` file and add more console.log statements.

## 📝 Test Customization

### Adding New Tests

1. Add new test functions in `api-test.js`
2. Call them in the `runAllTests()` function
3. Follow the existing pattern for consistency

### Modifying Test Data

Update the test data objects at the top of `api-test.js`:
- `testUser`
- `testInstructor` 
- `testAdmin`

### Testing Specific Endpoints

You can comment out specific test functions in `runAllTests()` to test only certain areas.

## 🎯 Best Practices

1. **Run tests after server changes** to ensure API compatibility
2. **Check authentication flow** before testing protected endpoints
3. **Verify database state** before running destructive tests
4. **Review error messages** to understand API behavior
5. **Update test data** if your API schema changes

## 📞 Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed
4. Check that MongoDB and the server are running

---

**Happy Testing! 🚀** 