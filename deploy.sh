#!/bin/bash

# AWS Dictionary Project Deployment Script
echo "🚀 Starting AWS Dictionary Project Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check zip
    if ! command -v zip &> /dev/null; then
        print_error "zip utility is not installed. Please install it first."
        exit 1
    fi
    
    print_status "All prerequisites are satisfied!"
}

# Build Lambda functions
build_lambda() {
    print_status "Building Lambda functions..."
    
    if [ ! -d "lambda" ]; then
        print_error "Lambda directory not found!"
        exit 1
    fi
    
    cd lambda
    
    if [ ! -f "build.sh" ]; then
        print_error "build.sh not found in lambda directory!"
        exit 1
    fi
    
    chmod +x build.sh
    ./build.sh
    
    if [ $? -ne 0 ]; then
        print_error "Lambda build failed!"
        exit 1
    fi
    
    cd ..
    print_status "Lambda functions built successfully!"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    print_status "Deploying infrastructure with Terraform..."
    
    if [ ! -d "terraform" ]; then
        print_error "Terraform directory not found!"
        exit 1
    fi
    
    cd terraform
    
    # Initialize Terraform
    print_status "Initializing Terraform..."
    terraform init
    
    if [ $? -ne 0 ]; then
        print_error "Terraform initialization failed!"
        exit 1
    fi
    
    # Plan deployment
    print_status "Planning Terraform deployment..."
    terraform plan -out=tfplan
    
    if [ $? -ne 0 ]; then
        print_error "Terraform plan failed!"
        exit 1
    fi
    
    # Apply deployment
    print_status "Applying Terraform configuration..."
    terraform apply tfplan
    
    if [ $? -ne 0 ]; then
        print_error "Terraform deployment failed!"
        exit 1
    fi
    
    # Get API Gateway URL
    API_URL=$(terraform output -raw api_gateway_url)
    print_status "API Gateway URL: $API_URL"
    
    cd ..
    
    # Update frontend with API URL
    update_frontend "$API_URL"
}

# Update frontend with API Gateway URL
update_frontend() {
    local api_url=$1
    print_status "Updating frontend with API Gateway URL..."
    
    if [ ! -f "index.html" ]; then
        print_error "index.html not found!"
        exit 1
    fi
    
    # Create backup
    cp index.html index.html.backup
    
    # Update the API URL in the frontend
    sed -i "s|YOUR_API_GATEWAY_URL|$api_url|g" index.html
    
    print_status "Frontend updated successfully!"
    print_warning "Don't forget to commit and push the updated frontend to trigger Amplify deployment!"
}

# Main deployment flow
main() {
    echo "=========================================="
    echo "   AWS Dictionary Project Deployment"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    build_lambda
    deploy_infrastructure
    
    echo ""
    echo "=========================================="
    echo "   Deployment Completed Successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Commit and push the updated frontend:"
    echo "   git add ."
    echo "   git commit -m 'Updated frontend with AWS API endpoints'"
    echo "   git push origin main"
    echo ""
    echo "2. AWS Amplify will automatically deploy the updated frontend"
    echo ""
    echo "3. Test your API endpoints:"
    echo "   - Get definition: GET $API_URL/definitions?word=EC2"
    echo "   - Search services: GET $API_URL/search?q=compute"
    echo "   - Add service: POST $API_URL/services"
    echo "   - Populate data: POST $API_URL/populate"
    echo ""
    echo "4. Monitor your resources in the AWS Console"
    echo ""
}

# Run main function
main "$@"
