// 1. V3: Modular imports - only import the clients and commands you need.
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// 2. V3: Initialize clients outside the handler for best practice (performance).
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    // The response object structure remains the same.
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
        // The core logic of parsing and validating the body is unchanged.
        const requestBody = JSON.parse(event.body);
        const { word, definition } = requestBody;

        if (!word || !definition) {
            response.statusCode = 400;
            response.body = JSON.stringify({
                error: 'Both word and definition are required'
            });
            return response;
        }

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                word: word,
                definition: definition,
                createdAt: new Date().toISOString()
            }
        };

        // 3. V3: Use the .send() method with a command object. No more .promise().
        await docClient.send(new PutCommand(params));

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