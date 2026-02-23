<!--
/**
 * @file terraform-supabase-provider-docs.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for terraform supabase provider docs.
 * @entrypoints docs/guides/terraform-supabase-provider-docs.md
 * @exports terraform supabase provider docs
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# terraform-supabase-provider-docs.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

The Supabase Terraform provider enables infrastructure as code management for Supabase projects, allowing teams to version control project settings, automate CI/CD pipelines, and manage Supabase resources programmatically. This documentation covers the official provider features, configuration patterns, and best practices as of 2026.

## Provider Configuration

### Basic Setup

```hcl
terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

provider "supabase" {
  access_token = file("${path.module}/access-token")
}
```

### Authentication Methods

#### Access Token Authentication

```hcl
provider "supabase" {
  access_token = var.supabase_access_token
}
```

#### Environment Variable

```bash
export SUPABASE_ACCESS_TOKEN="your-access-token"
```

```hcl
provider "supabase" {
  # Automatically reads from SUPABASE_ACCESS_TOKEN
}
```

## Core Resources

### Supabase Project Management

#### Creating New Projects

```hcl
resource "supabase_project" "production" {
  organization_id = "nknnyrtlhxudbsbuazsu"
  name           = "production-app"
  database_password = random_password.db_password.result
  region         = "ap-southeast-1"

  lifecycle {
    ignore_changes = [database_password]
  }
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}
```

#### Importing Existing Projects

```hcl
variable "linked_project" {
  type    = string
  description = "Existing Supabase project reference"
}

import {
  to = supabase_project.production
  id = var.linked_project
}

resource "supabase_project" "production" {
  organization_id = "nknnyrtlhxudbsbuazsu"
  name           = "imported-project"
  database_password = "existing-password"
  region         = "ap-southeast-1"

  lifecycle {
    ignore_changes = [database_password]
  }
}
```

### Project Configuration

#### API Settings

```hcl
resource "supabase_settings" "production" {
  project_ref = supabase_project.production.id

  api = jsonencode({
    db_schema             = "public,storage,graphql_public"
    db_extra_search_path  = "public,extensions"
    max_rows              = 1000
    disabled_features     = ["realtime"]
    jwt_expiry            = 3600
  })
}
```

#### Database Settings

```hcl
resource "supabase_settings" "database" {
  project_ref = supabase_project.production.id

  database = jsonencode({
    password_requirement = {
      min_length = 8
      require_uppercase = true
      require_lowercase = true
      require_numbers = true
      require_symbols = true
    }
    session_timeout = 3600
    pool_size = 20
  })
}
```

### Branch Management

#### Creating Branches

```hcl
resource "supabase_branch" "feature_branch" {
  project_id    = supabase_project.production.id
  branch_name   = "feature/new-auth"
  git_branch    = "feature/new-auth"

  # Optional: Branch-specific settings
  database_password = random_password.branch_db.result
}
```

#### Branch Configuration

```hcl
resource "supabase_settings" "feature_branch" {
  project_ref = supabase_branch.feature_branch.id

  api = jsonencode({
    db_schema = "public,storage"
    max_rows = 500  # Lower limit for feature branches
  })
}
```

## Advanced Configuration

### Multi-Environment Setup

```hcl
# environments/production.tf
module "supabase_production" {
  source = "../modules/supabase-project"

  environment = "production"
  organization_id = var.production_org_id
  region = "us-east-1"

  project_settings = {
    max_rows = 10000
    enable_realtime = true
    enable_edge_functions = true
  }
}

# environments/staging.tf
module "supabase_staging" {
  source = "../modules/supabase-project"

  environment = "staging"
  organization_id = var.staging_org_id
  region = "us-east-1"

  project_settings = {
    max_rows = 1000
    enable_realtime = false
    enable_edge_functions = false
  }
}
```

### Module Structure

```hcl
# modules/supabase-project/main.tf
variable "environment" {
  type = string
}

variable "organization_id" {
  type = string
}

variable "region" {
  type = string
}

variable "project_settings" {
  type = object({
    max_rows = number
    enable_realtime = bool
    enable_edge_functions = bool
  })
}

resource "supabase_project" "main" {
  organization_id = var.organization_id
  name           = "${var.environment}-app"
  database_password = random_password.db.result
  region         = var.region

  lifecycle {
    ignore_changes = [database_password]
  }
}

resource "supabase_settings" "main" {
  project_ref = supabase_project.main.id

  api = jsonencode({
    db_schema = "public,storage,graphql_public"
    max_rows = var.project_settings.max_rows
    disabled_features = var.project_settings.enable_realtime ? [] : ["realtime"]
  })
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/supabase-terraform.yml
name: Supabase Infrastructure

on:
  push:
    paths:
      - 'infrastructure/supabase/**'
  pull_request:
    paths:
      - 'infrastructure/supabase/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '~> 1.5'

      - name: Configure Supabase Provider
        run: |
          echo "SUPABASE_ACCESS_TOKEN=${{ secrets.SUPABASE_ACCESS_TOKEN }}" >> $GITHUB_ENV

      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/supabase

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: infrastructure/supabase

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply tfplan
        working-directory: infrastructure/supabase
```

### Vercel Integration

```hcl
# Link Vercel project to Supabase
resource "supabase_branch" "preview" {
  project_id  = supabase_project.production.id
  branch_name = "vercel-preview"
  git_branch  = vercel_branch.preview_branch

  # Preview branch settings
  database_password = random_password.preview_db.result
}

# Output for Vercel environment variables
output "supabase_url" {
  value = supabase_project.production.rest_url
}

output "supabase_anon_key" {
  value = supabase_project.production.anon_key
  sensitive = true
}
```

## Best Practices

### Security Configuration

```hcl
# Use secure password generation
resource "random_password" "database_password" {
  length  = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store sensitive data in secrets
resource "supabase_project" "secure" {
  organization_id = var.organization_id
  name           = var.project_name
  database_password = var.db_password  # From secure source
  region         = var.region

  lifecycle {
    ignore_changes = [database_password]
  }
}

# Enable encryption at rest
resource "supabase_settings" "security" {
  project_ref = supabase_project.secure.id

  # Enable additional security features
  auth = jsonencode({
    enable_signup = true
    require_email_confirmation = true
    minimum_password_length = 8
    password_requirements = {
      require_uppercase = true
      require_lowercase = true
      require_numbers = true
      require_symbols = true
    }
  })
}
```

### State Management

```hcl
# Remote state configuration
terraform {
  backend "s3" {
    bucket = "company-terraform-state"
    key    = "supabase/terraform.tfstate"
    region = "us-east-1"

    # Enable state locking
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}
```

### Environment-Specific Configuration

```hcl
# locals.tf
locals {
  environment = terraform.workspace

  common_settings = {
    db_schema = "public,storage,graphql_public"
    db_extra_search_path = "public,extensions"
  }

  environment_settings = {
    development = {
      max_rows = 100
      enable_realtime = false
      enable_edge_functions = false
    }
    staging = {
      max_rows = 1000
      enable_realtime = true
      enable_edge_functions = false
    }
    production = {
      max_rows = 10000
      enable_realtime = true
      enable_edge_functions = true
    }
  }

  settings = merge(local.common_settings, local.environment_settings[local.environment])
}
```

## Migration and Import

### Import Existing Infrastructure

```bash
# Import existing project
terraform import supabase_project.production "your-project-ref"

# Import existing settings
terraform import supabase_settings.production "your-project-ref"

# Import existing branch
terraform import supabase_branch.feature "project-ref:branch-name"
```

### Migration Strategy

```hcl
# Step 1: Import existing resources
import {
  to = supabase_project.production
  id = "existing-project-ref"
}

# Step 2: Apply minimal configuration
resource "supabase_project" "production" {
  organization_id = "your-org-id"
  name           = "production-app"
  database_password = "existing-password"
  region         = "existing-region"

  lifecycle {
    ignore_changes = [
      database_password,
      # Add other fields to ignore during migration
    ]
  }
}

# Step 3: Gradually take control
# Remove ignore_changes blocks incrementally
```

## Troubleshooting

### Common Issues

#### Authentication Errors

```hcl
# Ensure proper token configuration
provider "supabase" {
  # Method 1: Direct token
  access_token = "your-access-token"

  # Method 2: Environment variable
  # access_token = var.supabase_token  # From environment
}

# Verify token permissions
data "supabase_organizations" "current" {}

output "organizations" {
  value = data.supabase_organizations.current.organizations
}
```

#### State Lock Issues

```bash
# Force unlock if needed
terraform force-unlock LOCK_ID

# Or manually remove DynamoDB lock entry
aws dynamodb delete-item \
  --table-name terraform-locks \
  --key '{"LockID":{"S":"supabase/terraform.tfstate-md5"}}'
```

#### Partial Updates

```hcl
# Provider always performs partial updates
resource "supabase_settings" "partial" {
  project_ref = supabase_project.production.id

  # Only specify fields you want to manage
  api = jsonencode({
    max_rows = 5000
    # Other fields remain unchanged
  })
}
```

## Monitoring and Maintenance

### Health Checks

```hcl
# Use Terraform outputs for monitoring
output "project_health" {
  value = {
    project_id = supabase_project.production.id
    rest_url   = supabase_project.production.rest_url
    status     = supabase_project.production.status
  }
}

# External monitoring integration
resource "null_resource" "health_check" {
  triggers = {
    project_id = supabase_project.production.id
  }

  provisioner "local-exec" {
    command = "curl -f ${supabase_project.production.rest_url}/health"
  }
}
```

### Automated Backups

```hcl
# Configure backup settings
resource "supabase_settings" "backups" {
  project_ref = supabase_project.production.id

  backup = jsonencode({
    enabled = true
    retention_days = 30
    schedule = "0 2 * * *"  # Daily at 2 AM
  })
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Supabase Terraform Provider Documentation](https://supabase.com/docs/guides/platform/terraform)
- [Supabase Terraform Provider Registry](https://registry.terraform.io/providers/supabase/supabase/latest/docs)
- [Terraform Provider GitHub Repository](https://github.com/supabase/terraform-provider-supabase)
- [CI/CD Example Repository](https://github.com/supabase/supabase-action-example/tree/main/supabase/remotes)
- [Step-by-step Tutorial](https://supabase.com/docs/guides/deployment/terraform/tutorial)
- [Contributing Guide](https://github.com/supabase/terraform-provider-supabase/blob/v1.1.3/CONTRIBUTING.md)


## Implementation

[Add content here]


## Testing

[Add content here]
