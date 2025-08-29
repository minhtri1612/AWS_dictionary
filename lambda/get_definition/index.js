// v3 requires modular imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the client and then the DocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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
        const requestBody = JSON.parse(event.body);
        const { word, definition } = requestBody;

        if (!word || !definition) {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'Both word and definition are required' });
            return response;
        }

        // In v3, you create a command object
        const command = new PutCommand({
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                word: word,
                definition: definition,
                createdAt: new Date().toISOString()
            }
        });

        // And send it using the client. No .promise() needed.
        await docClient.send(command);

        response.body = JSON.stringify({
            message: 'Service added successfully',
            word: word,
            definition: definition
        });

    } catch (error) {
        console.error('Error:', error);
        response.statusCode = 500;
        response.body = JSON.stringify({ error: 'Internal server error' });
    }

    return response;
};