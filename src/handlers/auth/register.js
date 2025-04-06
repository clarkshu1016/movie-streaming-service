const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password, name } = body;
    
    // Register user in Cognito
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.USER_POOL_CLIENT_ID;
    
    await cognito.signUp({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'name',
          Value: name
        },
        {
          Name: 'email',
          Value: email
        }
      ]
    }).promise();
    
    // Create user entry in DynamoDB
    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const userItem = {
      id: userId,
      email,
      name,
      createdAt: timestamp,
      updatedAt: timestamp,
      preferences: {},
      subscriptionTier: 'free'
    };
    
    await dynamodb.put({
      TableName: process.env.USERS_TABLE,
      Item: userItem
    }).promise();
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'User registered successfully', userId })
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: error.message || 'Internal server error',
        error: error.name
      })
    };
  }
};
