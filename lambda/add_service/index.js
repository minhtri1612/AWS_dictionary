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
        // Parse the request body
        const requestBody = JSON.parse(event.body);
        const { word, definition } = requestBody;

        // Validate input
        if (!word || !definition) {
            response.statusCode = 400;
            response.body = JSON.stringify({
                error: 'Both word and definition are required'
            });
            return response;
        }

        // Add the service to DynamoDB
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                word: word,
                definition: definition,
                createdAt: new Date().toISOString()
            }
        };

        await dynamodb.put(params).promise();

        response.body = JSON.stringify({
            message: 'Service added successfully',
            word: word,
            definition: definition
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
