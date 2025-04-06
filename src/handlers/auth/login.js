const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;
    
    // Authenticate user with Cognito
    const clientId = process.env.USER_POOL_CLIENT_ID;
    
    const authResult = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }).promise();
    
    const { IdToken, AccessToken, RefreshToken } = authResult.AuthenticationResult;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Login successful',
        token: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    
    return {
      statusCode: error.statusCode || 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Authentication failed',
        error: error.name
      })
    };
  }
};
