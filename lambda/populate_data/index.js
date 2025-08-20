const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Initial AWS services data
const awsServices = [
    {
        word: "EC2 (Elastic Compute Cloud)",
        definition: "Provides secure, resizable compute capacity (virtual servers) in the cloud."
    },
    {
        word: "Lambda",
        definition: "A serverless compute service that runs your code in response to events and automatically manages the underlying compute resources."
    },
    {
        word: "S3 (Simple Storage Service)",
        definition: "Scalable object storage for data backup, archival, and analytics."
    },
    {
        word: "DynamoDB",
        definition: "A fully managed NoSQL key-value and document database that delivers single-digit millisecond performance at any scale."
    },
    {
        word: "RDS (Relational Database Service)",
        definition: "A managed service for setting up, operating, and scaling relational databases like MySQL, PostgreSQL, Oracle, etc."
    },
    {
        word: "API Gateway",
        definition: "A fully managed service for creating, publishing, maintaining, monitoring, and securing APIs at any scale."
    },
    {
        word: "Amplify",
        definition: "A framework for front-end web and mobile developers to build scalable full-stack applications powered by AWS."
    },
    {
        word: "VPC (Virtual Private Cloud)",
        definition: "A logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define."
    },
    {
        word: "Route 53",
        definition: "A highly available and scalable cloud Domain Name System (DNS) web service."
    },
    {
        word: "IAM (Identity and Access Management)",
        definition: "Manages user access and permissions to AWS resources securely."
    }
];

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
        const results = [];
        
        // Populate DynamoDB with initial data
        for (const service of awsServices) {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Item: {
                    word: service.word,
                    definition: service.definition,
                    createdAt: new Date().toISOString()
                }
            };

            try {
                await dynamodb.put(params).promise();
                results.push({
                    word: service.word,
                    status: 'success'
                });
            } catch (error) {
                console.error(`Error adding ${service.word}:`, error);
                results.push({
                    word: service.word,
                    status: 'error',
                    error: error.message
                });
            }
        }

        response.body = JSON.stringify({
            message: 'Data population completed',
            results: results,
            totalProcessed: awsServices.length
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
