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
        // Get the search term from query parameters
        const searchTerm = event.queryStringParameters?.q;
        
        if (!searchTerm) {
            response.statusCode = 400;
            response.body = JSON.stringify({
                error: 'Search query parameter is required'
            });
            return response;
        }

        // Scan DynamoDB and filter results
        const params = {
            TableName: process.env.DYNAMODB_TABLE
        };

        const result = await dynamodb.scan(params).promise();
        
        // Filter results based on search term
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
