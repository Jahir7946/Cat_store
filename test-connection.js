import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the exact same URI format as in render.yaml
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://23202001:23202001@cluster0.vgypvgq.mongodb.net/miau_store?retryWrites=true&w=majority&appName=Cluster0';

// Ensure we have the database name in the URI
if (!mongoUri.includes('/miau_store')) {
  console.error('⚠️  WARNING: Database name "miau_store" not found in URI!');
  console.error('   The URI should include "/miau_store" before the query parameters');
}

console.log('🔄 Testing MongoDB connection...');
console.log('📍 URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

async function testConnection() {
  try {
    // Connect with specific options for better error handling
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful' 
    });
    
    const testDoc = await testCollection.findOne({ test: true });
    console.log('📝 Test document created:', testDoc);
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');
    
    console.log('🎉 All tests passed! MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    // Provide specific troubleshooting guidance
    if (error.message.includes('authentication failed')) {
      console.error('\n🔐 Authentication Error - Check these items:');
      console.error('   1. Username: 23202001 (verify this is correct)');
      console.error('   2. Password: 23202001 (verify this is correct)');
      console.error('   3. Database: miau_store (must exist and user must have access)');
      console.error('   4. User permissions: Ensure user has readWrite role on miau_store database');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🌐 Network Error - Check these items:');
      console.error('   1. Internet connection is working');
      console.error('   2. MongoDB Atlas cluster is running');
      console.error('   3. Cluster URL is correct: cluster0.vgypvgq.mongodb.net');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🚫 IP Access Error - Check these items:');
      console.error('   1. Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
      console.error('   2. Or add your specific IP address');
    }
    
    console.error('\n📋 MongoDB Atlas Checklist:');
    console.error('   □ User "23202001" exists in Database Access');
    console.error('   □ User has "readWrite" role for "miau_store" database');
    console.error('   □ Network Access allows 0.0.0.0/0 (or your IP)');
    console.error('   □ Cluster is running and accessible');
    console.error('   □ Database "miau_store" exists (will be created automatically)');
    
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

testConnection();
