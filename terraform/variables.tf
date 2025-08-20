variable "github_token" {
  description = "GitHub personal access token for Amplify app"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-2"
}
