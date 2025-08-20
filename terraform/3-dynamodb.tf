# DynamoDB table for storing AWS service definitions
resource "aws_dynamodb_table" "aws_services" {
  name           = "aws-services-dictionary"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "word"

  attribute {
    name = "word"
    type = "S"
  }

  tags = {
    Name        = "aws-services-dictionary"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}

# DynamoDB table for storing search history (optional)
resource "aws_dynamodb_table" "search_history" {
  name           = "search-history"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  range_key      = "timestamp"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  tags = {
    Name        = "search-history"
    Environment = "production"
    Project     = "aws-dictionary"
  }
}
