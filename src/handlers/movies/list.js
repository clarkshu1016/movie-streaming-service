const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 20;
    const genre = queryParams.genre;
    const sortBy = queryParams.sortBy || 'releaseDate';
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Set up scan parameters
    const params = {
      TableName: process.env.MOVIES_TABLE,
      Limit: limit
    };
    
    // Add filter for genre if specified
    if (genre) {
      params.FilterExpression = 'contains(genres, :genre)';
      params.ExpressionAttributeValues = {
        ':genre': genre
      };
    }
    
    // Execute query
    const result = await dynamodb.scan(params).promise();
    
    // Sort results based on sortBy parameter
    let sortedItems = [...result.Items];
    if (sortBy === 'title') {
      sortedItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'rating') {
      sortedItems.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'releaseDate') {
      sortedItems.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }
    
    // Apply pagination
    const paginatedItems = sortedItems.slice(offset, offset + limit);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        movies: paginatedItems,
        page,
        limit,
        totalCount: result.Count,
        totalPages: Math.ceil(result.Count / limit)
      })
    };
  } catch (error) {
    console.error('Error listing movies:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error retrieving movies',
        error: error.name
      })
    };
  }
};
