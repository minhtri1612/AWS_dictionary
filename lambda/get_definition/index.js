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

        // Query DynamoDB for the service definition
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                word: word
            }
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            response.statusCode = 404;
            response.body = JSON.stringify({
                error: 'Service definition not found',
                word: word
            });
            return response;
        }

        response.body = JSON.stringify({
            word: result.Item.word,
            definition: result.Item.definition
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
