const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const { movieId } = event.pathParameters;
    
    // Get movie details from DynamoDB
    const result = await dynamodb.get({
      TableName: process.env.MOVIES_TABLE,
      Key: {
        id: movieId
      }
    }).promise();
    
    // Check if movie exists
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Movie not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting movie:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error retrieving movie details',
        error: error.name
      })
    };
  }
};
