# API Gateway REST API
resource "aws_api_gateway_rest_api" "dictionary_api" {
  name        = "aws-dictionary-api"
  description = "API for AWS Dictionary service"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name        = "aws-dictionary-api"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}

# API Gateway Resource for definitions
resource "aws_api_gateway_resource" "definitions" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  parent_id   = aws_api_gateway_rest_api.dictionary_api.root_resource_id
  path_part   = "definitions"
}

# API Gateway Resource for search
resource "aws_api_gateway_resource" "search" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  parent_id   = aws_api_gateway_rest_api.dictionary_api.root_resource_id
  path_part   = "search"
}

# API Gateway Resource for services
resource "aws_api_gateway_resource" "services" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  parent_id   = aws_api_gateway_rest_api.dictionary_api.root_resource_id
  path_part   = "services"
}

# API Gateway Resource for populate
resource "aws_api_gateway_resource" "populate" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  parent_id   = aws_api_gateway_rest_api.dictionary_api.root_resource_id
  path_part   = "populate"
}

# GET method for definitions
resource "aws_api_gateway_method" "get_definition" {
  rest_api_id   = aws_api_gateway_rest_api.dictionary_api.id
  resource_id   = aws_api_gateway_resource.definitions.id
  http_method   = "GET"
  authorization = "NONE"
}

# GET method for search
resource "aws_api_gateway_method" "search_services" {
  rest_api_id   = aws_api_gateway_rest_api.dictionary_api.id
  resource_id   = aws_api_gateway_resource.search.id
  http_method   = "GET"
  authorization = "NONE"
}

# POST method for adding services
resource "aws_api_gateway_method" "add_service" {
  rest_api_id   = aws_api_gateway_rest_api.dictionary_api.id
  resource_id   = aws_api_gateway_resource.services.id
  http_method   = "POST"
  authorization = "NONE"
}

# POST method for populate
resource "aws_api_gateway_method" "populate_data" {
  rest_api_id   = aws_api_gateway_rest_api.dictionary_api.id
  resource_id   = aws_api_gateway_resource.populate.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integration for get definition
resource "aws_api_gateway_integration" "get_definition_integration" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  resource_id = aws_api_gateway_resource.definitions.id
  http_method = aws_api_gateway_method.get_definition.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.get_definition.invoke_arn
}

# Integration for search services
resource "aws_api_gateway_integration" "search_services_integration" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  resource_id = aws_api_gateway_resource.search.id
  http_method = aws_api_gateway_method.search_services.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.search_services.invoke_arn
}

# Integration for add service
resource "aws_api_gateway_integration" "add_service_integration" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  resource_id = aws_api_gateway_resource.services.id
  http_method = aws_api_gateway_method.add_service.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.add_service.invoke_arn
}

# Integration for populate data
resource "aws_api_gateway_integration" "populate_data_integration" {
  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id
  resource_id = aws_api_gateway_resource.populate.id
  http_method = aws_api_gateway_method.populate_data.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.populate_data.invoke_arn
}

# Lambda permission for get definition
resource "aws_lambda_permission" "get_definition_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_definition.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dictionary_api.execution_arn}/*/*"
}

# Lambda permission for search services
resource "aws_lambda_permission" "search_services_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.search_services.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dictionary_api.execution_arn}/*/*"
}

# Lambda permission for add service
resource "aws_lambda_permission" "add_service_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_service.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dictionary_api.execution_arn}/*/*"
}

# Lambda permission for populate data
resource "aws_lambda_permission" "populate_data_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.populate_data.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dictionary_api.execution_arn}/*/*"
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "dictionary_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_definition_integration,
    aws_api_gateway_integration.search_services_integration,
    aws_api_gateway_integration.add_service_integration,
    aws_api_gateway_integration.populate_data_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.dictionary_api.id

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway stage
resource "aws_api_gateway_stage" "dictionary_api_stage" {
  deployment_id = aws_api_gateway_deployment.dictionary_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.dictionary_api.id
  stage_name    = "prod"
}

# Output the API Gateway URL
output "api_gateway_url" {
  value = "${aws_api_gateway_stage.dictionary_api_stage.invoke_url}"
  description = "API Gateway endpoint URL"
}
