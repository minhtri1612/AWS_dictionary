# AWS Dictionary Project

A serverless dictionary application that provides definitions for AWS cloud services, built with AWS Lambda, DynamoDB, API Gateway, and Amplify.

## Architecture

```
Frontend (HTML/CSS/JS) → API Gateway → Lambda Functions → DynamoDB
```

### Components

- **Frontend**: Static HTML/CSS/JavaScript hosted on AWS Amplify
- **API Gateway**: REST API endpoints for the dictionary service
- **Lambda Functions**: Serverless functions for different operations
- **DynamoDB**: NoSQL database storing AWS service definitions
- **IAM**: Roles and policies for secure access

## Project Structure

```
aws_dictionary/
├── index.html                 # Frontend application
├── dataset.json              # Initial AWS service data
├── terraform/                # Infrastructure as Code
│   ├── 0-provider.tf        # AWS provider configuration
│   ├── 1-iam.tf            # IAM roles for Amplify
│   ├── 2-amplify.tf        # Amplify app configuration
│   ├── 3-dynamodb.tf       # DynamoDB tables
│   ├── 4-lambda.tf         # Lambda functions
│   ├── 5-iam-lambda.tf     # IAM roles for Lambda
│   └── 6-api-gateway.tf    # API Gateway configuration
├── lambda/                   # Lambda function source code
│   ├── get_definition/      # Get service definition
│   ├── search_services/     # Search services
│   ├── add_service/         # Add new service
│   ├── populate_data/       # Populate initial data
│   └── build.sh            # Build script for Lambda functions
└── README.md                # This file
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version ~> 1.7)
- Node.js and npm installed
- zip utility installed

## Deployment Steps

### 1. Build Lambda Functions

```bash
cd lambda
chmod +x build.sh
./build.sh
```

This will create zip files for each Lambda function.

### 2. Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

### 3. Update Frontend

After deployment, Terraform will output the API Gateway URL. Update the `index.html` file:

```javascript
// Replace YOUR_API_GATEWAY_URL with the actual URL from Terraform output
const apiUrl = `https://xxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/prod/definitions?word=${word}`;
```

### 4. Deploy Frontend

```bash
# Commit and push to your GitHub repository
git add .
git commit -m "Updated frontend with AWS API endpoints"
git push origin main
```

AWS Amplify will automatically deploy the updated frontend.

## API Endpoints

### Get Definition
- **URL**: `GET /definitions?word={service_name}`
- **Description**: Retrieve definition for a specific AWS service
- **Example**: `/definitions?word=EC2`

### Search Services
- **URL**: `GET /search?q={search_term}`
- **Description**: Search for AWS services by name or description
- **Example**: `/search?q=compute`

### Add Service
- **URL**: `POST /services`
- **Description**: Add a new AWS service definition
- **Body**: `{"word": "Service Name", "definition": "Service description"}`

### Populate Data
- **URL**: `POST /populate`
- **Description**: Populate DynamoDB with initial AWS service data
- **Note**: Run this once after initial deployment

## Lambda Functions

### get_definition
Retrieves a specific service definition from DynamoDB.

### search_services
Searches through all services for matching terms.

### add_service
Adds a new service definition to the database.

### populate_data
Populates the database with initial AWS service definitions.

## DynamoDB Tables

### aws-services-dictionary
- **Primary Key**: `word` (String)
- **Attributes**: `word`, `definition`, `createdAt`

### search-history (Optional)
- **Primary Key**: `id` (String)
- **Sort Key**: `timestamp` (String)
- **Attributes**: `id`, `timestamp`, `searchTerm`, `results`

## Security

- IAM roles with least privilege access
- CORS enabled for web access
- No public write access to DynamoDB
- Lambda functions only accessible through API Gateway

## Cost Optimization

- DynamoDB on-demand billing (pay per request)
- Lambda functions with minimal memory allocation
- API Gateway regional endpoint for lower latency

## Monitoring

- CloudWatch logs for Lambda functions
- DynamoDB metrics and alarms
- API Gateway access logs

## Troubleshooting

### Common Issues

1. **Lambda deployment fails**: Ensure zip files are created and accessible
2. **API Gateway 500 errors**: Check Lambda function logs in CloudWatch
3. **CORS issues**: Verify CORS headers in Lambda responses
4. **DynamoDB access denied**: Check IAM role permissions

### Useful Commands

```bash
# Check Lambda function logs
aws logs tail /aws/lambda/get-definition --follow

# Test API Gateway endpoint
curl "https://your-api-gateway-url/prod/definitions?word=EC2"

# Check DynamoDB table
aws dynamodb scan --table-name aws-services-dictionary
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
