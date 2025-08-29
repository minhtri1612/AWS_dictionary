const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: ''
    };

    try {
        // Get the word from query parameters
        const word = event.queryStringParameters?.word;
        
        if (!word) {
            response.statusCode = 400;
            response.body = JSON.stringify({
                error: 'Word parameter is required'
            });
            return response;
        }

        // Scan DynamoDB for services that contain the search term
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            FilterExpression: 'contains(#word, :searchTerm)',
            ExpressionAttributeNames: {
                '#word': 'word'
            },
            ExpressionAttributeValues: {
                ':searchTerm': word
            }
        };

        const result = await dynamodb.scan(params).promise();

        if (!result.Items || result.Items.length === 0) {
            response.statusCode = 404;
            response.body = JSON.stringify({
                error: 'Service definition not found',
                word: word
            });
            return response;
        }

        // Return the first match (you could also return all matches if needed)
        const service = result.Items[0];
        response.body = JSON.stringify({
            word: service.word,
            definition: service.definition
        });

    } catch (error) {
        console.error('Error:', error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            error: 'Internal server error'
        });
    }

    return response;
};
