# Amplify app
resource "aws_amplify_app" "my_app" {
  name                = "AWS_dictionary"
  repository          = "https://github.com/minhtri1612/AWS_dictionary.git"
  iam_service_role_arn = aws_iam_role.amplify_service_role.arn

  # Optional auto-branch
  auto_branch_creation_config {
    enable_auto_build = true
  }

  # Add OAuth token for GitHub access
  # You'll need to provide this as a variable
  oauth_token = var.github_token
}

# Optional: Connect main branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.my_app.id
  branch_name = "main"
  framework   = "HTML"  # since you said only html
  enable_auto_build = true
}