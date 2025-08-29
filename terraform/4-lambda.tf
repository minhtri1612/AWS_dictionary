# Lambda function for getting service definitions
resource "aws_lambda_function" "get_definition" {
  filename         = "../lambda/get_definition.zip"
  source_code_hash = filebase64sha256("../lambda/get_definition.zip")
  function_name    = "get-definition"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.aws_services.name
    }
  }

  tags = {
    Name        = "get-definition"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}

# Lambda function for searching services
resource "aws_lambda_function" "search_services" {
  filename         = "../lambda/search_services.zip"
  source_code_hash = filebase64sha256("../lambda/search_services.zip")
  function_name    = "search-services"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.aws_services.name
    }
  }

  tags = {
    Name        = "search-services"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}

# Lambda function for populating DynamoDB with initial data
resource "aws_lambda_function" "populate_data" {
  filename         = "../lambda/populate_data.zip"
  source_code_hash = filebase64sha256("../lambda/populate_data.zip")
  function_name    = "populate-data"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 300
  memory_size     = 256

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.aws_services.name
    }
  }

  tags = {
    Name        = "populate-data"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}

# Lambda function for adding new services
resource "aws_lambda_function" "add_service" {
  filename         = "../lambda/add_service.zip"
  source_code_hash = filebase64sha256("../lambda/add_service.zip")
  function_name    = "add-service"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.aws_services.name
    }
  }

  tags = {
    Name        = "add-service"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}
