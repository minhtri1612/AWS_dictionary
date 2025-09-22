// v3: Import specific clients and commands
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// v3: Initialize the base client, then wrap it with the DocumentClient
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
        // Get the search term from query parameters (this part is unchanged)
        const searchTerm = event.queryStringParameters?.q;
        
        if (!searchTerm) {
            response.statusCode = 400;
            response.body = JSON.stringify({
                error: 'Search query parameter is required'
            });
            return response;
        }

        // v3: Create a command object with the parameters
        const command = new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE
        });

        // v3: Send the command using the client. No .promise() is needed.
        const result = await docClient.send(command);
        
        // Filter logic remains the same
        const filteredResults = result.Items.filter(item => 
            item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );

        response.body = JSON.stringify({
            results: filteredResults,
            count: filteredResults.length,
            searchTerm: searchTerm
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