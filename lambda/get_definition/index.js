const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Content-Type': 'application/json'
        },
        body: ''
    };

    try {
        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            response.body = JSON.stringify({ message: 'OK' });
            return response;
        }

        // Accept either path parameter /definitions/{word} or query parameter ?word=
        const wordFromPath = event.pathParameters && event.pathParameters.word;
        const wordFromQuery = event.queryStringParameters && event.queryStringParameters.word;
        const candidate = typeof wordFromPath === 'string' ? wordFromPath : (typeof wordFromQuery === 'string' ? wordFromQuery : '');
        const word = candidate ? decodeURIComponent(candidate).trim() : '';
        
        if (!word) {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'Word is required' });
            return response;
        }

        // Get by primary key for exact match
        const getParams = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { word }
        };

        const result = await dynamodb.get(getParams).promise();

        if (!result.Item) {
            response.statusCode = 404;
            response.body = JSON.stringify({ error: 'Service definition not found', word });
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
