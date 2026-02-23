# terraform-vercel-provider-docs.md

## Overview

The Terraform Vercel provider enables infrastructure as code management of Vercel resources including projects, deployments, domains, and team configurations. This provider is maintained by Vercel and supports the latest Vercel platform features.

## Provider Configuration

### Basic Setup

```hcl
terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  # Authentication via environment variables (recommended)
  # VERCEL_API_TOKEN and VERCEL_ORG_ID

  # Or specify team directly
  team = "your-team-slug"
}
```

### Authentication Methods

#### 1. Environment Variables (Recommended)

```bash
export VERCEL_API_TOKEN="your-vercel-api-token"
export VERCEL_ORG_ID="your-organization-id"
export VERCEL_TEAM_ID="your-team-id" # Optional for team resources
```

#### 2. Provider Configuration

```hcl
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}
```

#### 3. Multiple Provider Configurations

```hcl
provider "vercel" {
  alias  = "personal"
  api_token = var.personal_api_token
}

provider "vercel" {
  alias  = "team"
  api_token = var.team_api_token
  team      = "my-team"
}
```

## Common Resource Patterns

### Vercel Project

```hcl
resource "vercel_project" "web_app" {
  name      = "my-web-app"
  framework = "nextjs"

  # Git repository integration
  git_repository = {
    repo = "my-org/my-repo"
  }

  # Build configuration
  build_command = "npm run build"
  output_directory = ".next"

  # Environment variables
  environment = [
    {
      key   = "NODE_ENV"
      value = "production"
      target = ["production", "preview"]
    },
    {
      key   = "DATABASE_URL"
      value = var.database_url
      target = ["production"]
    }
  ]

  # Domains
  domains = ["my-app.vercel.app", "www.my-app.com"]

  # Auto-assign custom domains
  auto_assign_custom_domains = true

  # Serverless function configuration
  functions = {
    "api/*.js" = {
      runtime = "nodejs18.x"
    }
  }
}
```

### Custom Domain Configuration

```hcl
resource "vercel_project_domain" "custom_domain" {
  project_id = vercel_project.web_app.id
  domain     = "www.my-app.com"

  # Redirect configuration
  redirect = "my-app.com"

  # Git branch configuration
  git_branch = "main"
}

resource "vercel_project_domain" "root_domain" {
  project_id = vercel_project.web_app.id
  domain     = "my-app.com"

  # Redirect to www subdomain
  redirect = "www.my-app.com"
}
```

### Team Management

```hcl
resource "vercel_team" "engineering" {
  name = "engineering-team"
  slug = "engineering"
}

resource "vercel_team_member" "developer" {
  team_id = vercel_team.engineering.id
  user_id = "user_1234567890"
  role    = "member"
}

resource "vercel_team_member" "lead" {
  team_id = vercel_team.engineering.id
  user_id = "user_0987654321"
  role    = "admin"
}
```

### Project Deployment

```hcl
resource "vercel_deployment" "production" {
  project_id = vercel_project.web_app.id

  # Git deployment
  git_source = {
    type = "github"
    repo = "my-org/my-repo"
    commit = "abc123def456"
  }

  # Environment variables for this deployment
  environment = [
    {
      key   = "DEPLOYMENT_ID"
      value = "prod-${timestamp()}"
    }
  ]

  # Override build settings
  build_command = "npm run build:prod"

  depends_on = [vercel_project.web_app]
}
```

### Edge Configuration

```hcl
resource "vercel_project" "edge_app" {
  name = "edge-optimized-app"
  framework = "nextjs"

  # Edge function regions
  regions = ["iad1", "sfo1", "hnd1"]

  # Edge middleware configuration
  functions = {
    "middleware.js" = {
      runtime = "edge"
    }
  }

  # Build settings for edge
  build_command = "npm run build"
  output_directory = ".next"

  # Environment variables for edge
  environment = [
    {
      key   = "EDGE_CONFIG"
      value = jsonencode({
        regions = ["us-east-1", "us-west-2"]
      })
      target = ["production", "preview"]
    }
  ]
}
```

## Data Sources

### Project Information

```hcl
data "vercel_project" "existing" {
  name = "my-existing-project"
}

output "project_id" {
  value = data.vercel_project.existing.id
}

output "project_url" {
  value = data.vercel_project.existing.url
}
```

### Team Information

```hcl
data "vercel_team" "current" {
  slug = "my-team"
}

output "team_id" {
  value = data.vercel_team.current.id
}

output "team_members" {
  value = data.vercel_team.current.members
}
```

### Deployment Information

```hcl
data "vercel_deployment" "latest" {
  project_id = vercel_project.web_app.id
  target     = "production"
}

output "deployment_url" {
  value = data.vercel_deployment.latest.url
}

output "deployment_state" {
  value = data.vercel_deployment.latest.state
}
```

## Advanced Configuration

### Multi-Environment Setup

```hcl
# Production project
resource "vercel_project" "production" {
  name      = "my-app-prod"
  framework = "nextjs"

  git_repository = {
    repo = "my-org/my-repo"
  }

  environment = [
    {
      key   = "NODE_ENV"
      value = "production"
      target = ["production"]
    },
    {
      key   = "API_URL"
      value = "https://api.my-app.com"
      target = ["production"]
    }
  ]

  domains = ["my-app.com", "www.my-app.com"]
}

# Staging project
resource "vercel_project" "staging" {
  name      = "my-app-staging"
  framework = "nextjs"

  git_repository = {
    repo = "my-org/my-repo"
    branch = "staging"
  }

  environment = [
    {
      key   = "NODE_ENV"
      value = "staging"
      target = ["preview", "production"]
    },
    {
      key   = "API_URL"
      value = "https://staging-api.my-app.com"
      target = ["preview", "production"]
    }
  ]

  domains = ["staging.my-app.com"]
}
```

### Environment-Specific Variables

```hcl
locals {
  common_env = [
    {
      key   = "APP_NAME"
      value = "my-app"
    },
    {
      key   = "VERSION"
      value = var.app_version
    }
  ]

  production_env = concat(local.common_env, [
    {
      key   = "DATABASE_URL"
      value = var.production_database_url
      target = ["production"]
    },
    {
      key   = "REDIS_URL"
      value = var.production_redis_url
      target = ["production"]
    }
  ])

  staging_env = concat(local.common_env, [
    {
      key   = "DATABASE_URL"
      value = var.staging_database_url
      target = ["preview", "production"]
    },
    {
      key   = "REDIS_URL"
      value = var.staging_redis_url
      target = ["preview", "production"]
    }
  ])
}

resource "vercel_project" "production" {
  name        = "my-app-prod"
  framework   = "nextjs"
  environment = local.production_env
}

resource "vercel_project" "staging" {
  name        = "my-app-staging"
  framework   = "nextjs"
  environment = local.staging_env
}
```

### Custom Build Configuration

```hcl
resource "vercel_project" "custom_build" {
  name      = "custom-build-app"
  framework = "other"

  # Custom build settings
  build_command = "npm run build:static"
  output_directory = "dist"
  install_command = "npm ci"
  dev_command = "npm run dev:static"

  # Root directory
  root_directory = "./frontend"

  # Serverless function configuration
  functions = {
    "api/*.js" = {
      runtime = "nodejs18.x"
      max_duration = 30
    }
    "functions/*.py" = {
      runtime = "python3.9"
      max_duration = 60
    }
  }

  # Build environment variables
  environment = [
    {
      key   = "BUILD_ENV"
      value = "production"
      target = ["production"]
    },
    {
      key   = "STATIC_EXPORT"
      value = "true"
      target = ["production"]
    }
  ]
}
```

## Best Practices

### 1. Use Variables for Configuration

```hcl
# variables.tf
variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Base project name"
  type        = string
  default     = "my-app"
}

variable "domains" {
  description = "Custom domains"
  type        = list(string)
  default     = []
}

variable "environment_variables" {
  description = "Environment variables"
  type = list(object({
    key    = string
    value  = string
    target = list(string)
  }))
  default = []
}
```

### 2. Use Workspaces for Environments

```hcl
# locals.tf
locals {
  environment = terraform.workspace

  project_config = {
    production = {
      name = "my-app-prod"
      domains = ["my-app.com", "www.my-app.com"]
      env_target = ["production"]
    }
    staging = {
      name = "my-app-staging"
      domains = ["staging.my-app.com"]
      env_target = ["preview", "production"]
    }
    development = {
      name = "my-app-dev"
      domains = []
      env_target = ["preview", "production"]
    }
  }

  config = local.project_config[local.environment]
}

# main.tf
resource "vercel_project" "app" {
  name      = local.config.name
  framework = "nextjs"
  domains   = local.config.domains

  environment = [
    for env in var.environment_variables :
    {
      key    = env.key
      value  = env.value
      target = local.config.env_target
    }
  ]
}
```

### 3. Implement Remote State

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "vercel/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### 4. Use Outputs for Resource Information

```hcl
# outputs.tf
output "project_url" {
  description = "Vercel project URL"
  value       = vercel_project.app.url
}

output "project_id" {
  description = "Vercel project ID"
  value       = vercel_project.app.id
}

output "domains" {
  description = "Project domains"
  value       = vercel_project.app.domains
}

output "deployment_urls" {
  description = "Deployment URLs by environment"
  value = {
    for env in ["production", "preview"] :
    env => "${vercel_project.app.name}-${env}.vercel.app"
  }
}
```

## Security Considerations

### 1. Protect API Tokens

```hcl
# Use sensitive variables for API tokens
variable "vercel_api_token" {
  type      = string
  sensitive = true
}

# Store in environment variables or secret management
provider "vercel" {
  api_token = var.vercel_api_token
}
```

### 2. Environment Variable Security

```hcl
# Use sensitive data for secrets
resource "vercel_project" "secure_app" {
  name = "secure-app"

  environment = [
    {
      key   = "PUBLIC_API_URL"
      value = "https://api.my-app.com"
      target = ["production", "preview"]
    },
    {
      key   = "DATABASE_URL"
      value = var.database_url
      target = ["production"]
    },
    {
      key   = "JWT_SECRET"
      value = var.jwt_secret
      target = ["production"]
    }
  ]
}

# Mark sensitive variables
variable "database_url" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}
```

### 3. Team Access Control

```hcl
resource "vercel_team" "restricted" {
  name = "restricted-team"
  slug = "restricted"
}

# Add members with appropriate roles
resource "vercel_team_member" "developer" {
  team_id = vercel_team.restricted.id
  user_id = "user_1234567890"
  role    = "member" # Limited access
}

resource "vercel_team_member" "admin" {
  team_id = vercel_team.restricted.id
  user_id = "user_0987654321"
  role    = "admin" # Full access
}
```

## Integration Patterns

### 1. CI/CD Integration

```hcl
# Project configured for automated deployments
resource "vercel_project" "ci_cd_app" {
  name = "ci-cd-app"

  git_repository = {
    repo = "my-org/my-repo"
  }

  # Auto-assign domains on production deployments
  auto_assign_custom_domains = true

  # Environment for CI/CD
  environment = [
    {
      key   = "CI"
      value = "true"
      target = ["production", "preview"]
    }
  ]
}
```

### 2. Multi-Region Deployment

```hcl
resource "vercel_project" "global_app" {
  name = "global-app"

  # Edge regions for global performance
  regions = ["iad1", "sfo1", "hnd1", "sin1"]

  # Edge middleware for routing
  functions = {
    "middleware.js" = {
      runtime = "edge"
    }
  }

  # Regional environment variables
  environment = [
    {
      key   = "EDGE_REGIONS"
      value = join(",", ["iad1", "sfo1", "hnd1"])
      target = ["production", "preview"]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify API token and team ID
2. **Domain Configuration**: Check DNS settings and SSL certificates
3. **Build Failures**: Review build command and output directory
4. **Environment Variables**: Ensure correct target environments

### Debug Commands

```bash
# Check provider version
terraform version

# Test provider connection
terraform plan

# Validate configuration
terraform validate

# Format configuration
terraform fmt
```

## References

- [Vercel Provider Documentation](https://registry.terraform.io/providers/vercel/vercel/latest/docs)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)
- [Terraform Configuration Language](https://www.terraform.io/docs/language/index.html)
- [Vercel Platform Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
