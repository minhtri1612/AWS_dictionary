#!/bin/bash

# Build script for Lambda functions
echo "Building Lambda functions..."

# Function to build a Lambda function
build_lambda() {
    local function_name=$1
    echo "Building $function_name..."
    
    cd "$function_name"
    
    # Install dependencies
    npm install --production
    
    # Create zip file
    zip -r "../${function_name}.zip" .
    
    cd ..
    echo "Built $function_name.zip"
}

# Build all functions
build_lambda "get_definition"
build_lambda "search_services"
build_lambda "add_service"
build_lambda "populate_data"

echo "All Lambda functions built successfully!"
echo "Zip files created:"
ls -la *.zip
