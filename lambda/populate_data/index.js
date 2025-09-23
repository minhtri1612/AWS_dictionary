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
    },
    {
        word: "EKS (Elastic Kubernetes Service)",
        definition: "A managed Kubernetes service to run Kubernetes on AWS without needing to manage your own control plane."
    },
    {
        word: "ECS (Elastic Container Service)",
        definition: "A highly scalable container orchestration service that supports Docker containers."
    },
    {
        word: "Fargate",
        definition: "A serverless compute engine for containers that works with ECS and EKS."
    },
    {
        word: "CloudFront",
        definition: "A fast content delivery network (CDN) service to securely deliver data, videos, and applications."
    },
    {
        word: "CloudWatch",
        definition: "Monitoring and observability service for AWS cloud resources and applications."
    },
    {
        word: "CloudTrail",
        definition: "Enables governance, compliance, and operational and risk auditing of your AWS account activity."
    },
    {
        word: "SNS (Simple Notification Service)",
        definition: "A fully managed messaging service for application-to-application and application-to-person communication."
    },
    {
        word: "SQS (Simple Queue Service)",
        definition: "A fully managed message queuing service for decoupling and scaling microservices, distributed systems, and serverless applications."
    },
    {
        word: "Kinesis",
        definition: "A platform for real-time data streaming and analytics."
    },
    {
        word: "Step Functions",
        definition: "A serverless orchestration service that lets you coordinate multiple AWS services into workflows."
    },
    {
        word: "Glue",
        definition: "A fully managed ETL (extract, transform, load) service for preparing and loading data."
    },
    {
        word: "Athena",
        definition: "An interactive query service that allows you to analyze data in S3 using SQL."
    },
    {
        word: "Redshift",
        definition: "A fully managed data warehouse service for big data analytics."
    },
    {
        word: "Elastic Beanstalk",
        definition: "An easy-to-use service for deploying and scaling web applications and services."
    },
    {
        word: "Lightsail",
        definition: "A simplified VPS hosting service for small applications and websites."
    },
    {
        word: "Outposts",
        definition: "Brings native AWS services, infrastructure, and operating models to on-premises environments."
    },
    {
        word: "Snowball",
        definition: "A service for transferring large amounts of data into and out of AWS using physical storage devices."
    },
    {
        word: "Snowmobile",
        definition: "An exabyte-scale data transfer service using a shipping container moved by truck."
    },
    {
        word: "Direct Connect",
        definition: "Provides a dedicated network connection from your premises to AWS."
    },
    {
        word: "Transit Gateway",
        definition: "Enables customers to connect VPCs and on-premises networks through a central hub."
    },
    {
        word: "Elastic Load Balancing (ELB)",
        definition: "Automatically distributes incoming application traffic across multiple targets."
    },
    {
        word: "App Mesh",
        definition: "A service mesh that provides application-level networking for microservices."
    },
    {
        word: "GuardDuty",
        definition: "A threat detection service that continuously monitors for malicious or unauthorized behavior."
    },
    {
        word: "Inspector",
        definition: "An automated vulnerability management service that scans AWS workloads for security issues."
    },
    {
        word: "Macie",
        definition: "A data security and data privacy service that uses ML to discover and protect sensitive data."
    },
    {
        word: "KMS (Key Management Service)",
        definition: "A managed service that makes it easy to create and control cryptographic keys."
    },
    {
        word: "Secrets Manager",
        definition: "Helps protect access to applications, services, and IT resources without hardcoding credentials."
    },
    {
        word: "Certificate Manager",
        definition: "Easily provision, manage, and deploy SSL/TLS certificates for AWS services."
    },
    {
        word: "Organizations",
        definition: "Enables you to centrally manage and govern multiple AWS accounts."
    },
    {
        word: "Control Tower",
        definition: "Easily set up and govern a secure, compliant, multi-account AWS environment."
    },
    {
        word: "Service Catalog",
        definition: "Allows organizations to create and manage catalogs of approved resources."
    },
    {
        word: "Systems Manager",
        definition: "Provides operational data and automation across AWS resources."
    },
    {
        word: "OpsWorks",
        definition: "A configuration management service that uses Chef and Puppet."
    },
    {
        word: "Elasticache",
        definition: "A fully managed in-memory caching service supporting Redis and Memcached."
    },
    {
        word: "Neptune",
        definition: "A fully managed graph database service."
    },
    {
        word: "DocumentDB",
        definition: "A fully managed document database service compatible with MongoDB."
    },
    {
        word: "QuickSight",
        definition: "A business analytics service that provides interactive dashboards and visualizations."
    },
    {
        word: "AppFlow",
        definition: "A fully managed integration service to securely transfer data between AWS and SaaS apps."
    },
    {
        word: "CodeCommit",
        definition: "A fully managed source control service that hosts Git repositories."
    },
    {
        word: "CodeBuild",
        definition: "A fully managed continuous integration service that compiles source code, runs tests, and produces packages."
    },
    {
        word: "CodeDeploy",
        definition: "A deployment service that automates application deployments to various compute services."
    },
    {
        word: "CodePipeline",
        definition: "A fully managed continuous delivery service for fast and reliable application updates."
    },
    {
        word: "CloudFormation",
        definition: "Provides a common language for modeling and provisioning AWS and third-party resources."
    },
    {
        word: "AppConfig",
        definition: "A capability of Systems Manager to quickly deploy application configurations."
    },
    {
        word: "EventBridge",
        definition: "A serverless event bus for integrating AWS services, SaaS apps, and custom applications."
    },
    {
        word: "WorkSpaces",
        definition: "A managed, secure Desktop-as-a-Service (DaaS) solution."
    },
    {
        word: "AppStream 2.0",
        definition: "A fully managed application streaming service."
    },
    {
        word: "Chime",
        definition: "A communications service for online meetings, video conferencing, and chat."
    },
    {
        word: "Connect",
        definition: "A cloud-based contact center service to deliver customer service."
    },
    {
        word: "Textract",
        definition: "Automatically extracts text, handwriting, and data from scanned documents."
    },
    {
        word: "Comprehend",
        definition: "A natural language processing (NLP) service that uses ML to find insights in text."
    },
    {
        word: "Rekognition",
        definition: "A computer vision service that makes it easy to analyze images and videos."
    },
    {
        word: "Polly",
        definition: "A text-to-speech service that turns text into lifelike speech."
    },
    {
        word: "Transcribe",
        definition: "An automatic speech recognition (ASR) service for converting speech to text."
    },
    {
        word: "Translate",
        definition: "A neural machine translation service for fast, high-quality language translation."
    },
    {
        word: "SageMaker",
        definition: "A fully managed service for building, training, and deploying machine learning models."
    },
    {
        word: "Data Pipeline",
        definition: "A web service that helps process and move data between different AWS services."
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
