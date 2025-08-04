#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting StudyNotion API Tests...\n');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found!');
  console.log('📝 Creating a basic .env file for testing...\n');
  
  const envContent = `# Database Configuration
MONGODB_URL=mongodb://localhost:27017/studynotion

# JWT Configuration
JWT_SECRET=test-jwt-secret-key-for-testing

# Cloudinary Configuration
CLOUD_NAME=test-cloud-name
API_KEY=test-api-key
API_SECRET=test-api-secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=test@example.com
MAIL_PASS=test-password

# Razorpay Configuration
RAZORPAY_KEY=test-razorpay-key
RAZORPAY_SECRET=test-razorpay-secret

# Server Configuration
PORT=4000
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with test values');
  console.log('⚠️  Note: You may need to update these values for full functionality\n');
}

// Run the API tests
console.log('🧪 Running API tests...\n');

const testProcess = spawn('node', ['api-test.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

testProcess.on('close', (code) => {
  console.log(`\n🏁 Test process exited with code ${code}`);
  
  if (code === 0) {
    console.log('✅ All tests completed successfully!');
  } else {
    console.log('❌ Some tests failed. Check the output above for details.');
  }
  
  console.log('\n📋 Test Summary:');
  console.log('- Authentication endpoints tested');
  console.log('- Profile management endpoints tested');
  console.log('- Course management endpoints tested');
  console.log('- Category management endpoints tested');
  console.log('- Rating and review endpoints tested');
  console.log('- Contact endpoints tested');
  console.log('- Delete operations tested');
  console.log('\n💡 Note: Some tests may fail due to authentication requirements or missing data.');
  console.log('   This is normal behavior for a comprehensive API test.');
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to start test process:', error.message);
  console.log('\n💡 Make sure:');
  console.log('   1. The server is running (npm run dev)');
  console.log('   2. MongoDB is running');
  console.log('   3. All dependencies are installed (npm install)');
}); 