# opentofu-documentation.md

## Overview

OpenTofu is the open-source infrastructure as code tool that emerged as a community-driven alternative to Terraform after HashiCorp's licensing change in 2023. As of 2026, OpenTofu has established itself as a mature, production-ready IaC solution with unique features and growing enterprise adoption.

## Key Differences from Terraform

### Licensing Model

- **OpenTofu**: Mozilla Public License 2.0 (MPL 2.0) - truly open source
- **Terraform**: Business Source License (BSL) 1.1 - commercial restrictions

### Feature Parity

OpenTofu maintains 100% compatibility with Terraform's core functionality:

```hcl
# Identical syntax and configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t3.micro"

  tags = {
    Name = "web-server"
  }
}
```

## OpenTofu Unique Features

### 1. Exclusion Flag

The exclusion flag allows selective resource deployment without complex workarounds:

```bash
# Exclude specific resources from plan/apply
tofu plan -exclude="aws_instance.database"
tofu apply -exclude="module.network"

# Exclude multiple resources
tofu apply \
  -exclude="aws_instance.web[0]" \
  -exclude="aws_instance.web[1]" \
  -exclude="aws_security_group.database"
```

**Use Cases:**

- Deploy infrastructure components independently
- Skip expensive resources during testing
- Implement progressive rollout strategies

### 2. Provider Iteration with for_each

Enhanced provider configuration with dynamic iteration:

```hcl
# Dynamic provider configuration
provider "aws" {
  for_each = var.aws_regions

  region = each.key
  alias  = each.key

  assume_role {
    role_arn = "arn:aws:iam::${each.value.account_id}:role/TerraformRole"
  }
}

# Use aliased providers
resource "aws_instance" "web" {
  for_each = var.aws_regions

  provider = aws[each.key]
  region   = each.key

  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
}
```

### 3. Early Variable/Local Evaluation

Improved variable and locals evaluation for better debugging:

```hcl
# Enhanced locals with early evaluation
locals {
  environment = terraform.workspace

  common_tags = {
    Environment = local.environment
    Project     = var.project_name
    ManagedBy   = "OpenTofu"
  }

  # Early evaluation error messages
  invalid_config = local.environment == "production" ? null : "Production requires specific configuration"
}
```

### 4. State Encryption

Built-in state encryption for enhanced security:

```hcl
# Enable state encryption
terraform {
  encryption {
    key_provider = "awskms"
    key_id       = "arn:aws:kms:us-east-1:123456789:key/12345678-1234-1234-1234-123456789012"

    # Optional: Additional encryption settings
    encryption_context = {
      project = var.project_name
      environment = terraform.workspace
    }
  }

  backend "s3" {
    bucket     = "company-tofu-state"
    key        = "terraform.tfstate"
    region     = "us-east-1"
    encrypt    = true  # Additional S3 encryption
  }
}
```

## Migration from Terraform

### Automatic Migration

OpenTofu provides seamless migration from existing Terraform configurations:

```bash
# Install OpenTofu
curl -s https://get.opentofu.org | bash

# Verify installation
tofu version

# Use existing Terraform files directly
tofu init
tofu plan
tofu apply
```

### Migration Checklist

- [ ] Backup existing Terraform state files
- [ ] Update CI/CD pipelines to use `tofu` commands
- [ ] Verify provider compatibility
- [ ] Test in non-production environment first
- [ ] Update team documentation and training

### Provider Compatibility

OpenTofu maintains full compatibility with the Terraform Registry:

```hcl
# All existing providers work unchanged
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}
```

## Advanced Configuration

### Multi-Region Deployments

```hcl
# Variable definitions
variable "aws_regions" {
  type = map(object({
    account_id = string
    cidr_block = string
  }))

  default = {
    us_east_1 = {
      account_id = "123456789012"
      cidr_block = "10.0.0.0/16"
    }
    us_west_2 = {
      account_id = "123456789013"
      cidr_block = "10.1.0.0/16"
    }
  }
}

# Multi-region provider configuration
provider "aws" {
  for_each = var.aws_regions

  region = each.key
  alias  = each.key
}

# Regional resources
resource "aws_vpc" "main" {
  for_each = var.aws_regions

  provider = aws[each.key]
  region   = each.key

  cidr_block = each.value.cidr_block

  tags = {
    Name        = "${each.key}-vpc"
    Environment = terraform.workspace
  }
}
```

### Module Composition

```hcl
# Enhanced module usage with exclusion
module "networking" {
  source = "./modules/networking"

  providers = {
    aws = aws.us_east_1
  }

  vpc_cidr = "10.0.0.0/16"

  tags = local.common_tags
}

module "compute" {
  source = "./modules/compute"

  providers = {
    aws = aws.us_east_1
  }

  vpc_id = module.networking.vpc_id

  depends_on = [module.networking]
}
```

## State Management

### Remote State Configuration

```hcl
# Enhanced remote state with encryption
terraform {
  backend "s3" {
    bucket     = "company-tofu-state"
    key        = "${terraform.workspace}/terraform.tfstate"
    region     = "us-east-1"

    # Enhanced security
    encrypt        = true
    dynamodb_table = "tofu-locks"

    # Workspace-specific state
    key_prefix = "environments/"
  }

  # State encryption
  encryption {
    key_provider = "awskms"
    key_id       = aws_kms_key.tofu_state.arn
  }
}

# KMS key for state encryption
resource "aws_kms_key" "tofu_state" {
  description             = "OpenTofu state encryption key"
  deletion_window_in_days = 7

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })
}
```

### State Manipulation

```bash
# Enhanced state commands with exclusion
tofu state list
tofu state show aws_instance.web[0]

# Exclude specific resources from state operations
tofu state rm -exclude="aws_instance.database" aws_instance.web[0]

# Import with exclusion support
tofu import -exclude="module.networking" aws_instance.web i-1234567890abcdef0
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/opentofu.yml
name: OpenTofu Infrastructure

on:
  push:
    paths:
      - 'infrastructure/**'
  pull_request:
    paths:
      - 'infrastructure/**'

jobs:
  tofu:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup OpenTofu
        uses: opentofu/setup-opentofu@v1
        with:
          tofu_version: '~> 1.6'

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Initialize OpenTofu
        run: tofu init
        working-directory: infrastructure

      - name: Plan Infrastructure
        run: tofu plan -out=tfplan
        working-directory: infrastructure

      - name: Apply Infrastructure
        if: github.ref == 'refs/heads/main'
        run: tofu apply tfplan
        working-directory: infrastructure
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - plan
  - apply

variables:
  TOFU_VERSION: '1.6'

before_script:
  - curl -s https://get.opentofu.org | bash
  - tofu version

validate:
  stage: validate
  script:
    - tofu fmt -check
    - tofu validate
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

plan:
  stage: plan
  script:
    - tofu plan -out=tfplan
  artifacts:
    paths:
      - tfplan
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

apply:
  stage: apply
  script:
    - tofu apply tfplan
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

## Best Practices

### Security Configuration

```hcl
# Enhanced security with state encryption
terraform {
  encryption {
    key_provider = "awskms"
    key_id       = var.state_encryption_key

    encryption_context = {
      project     = var.project_name
      environment = terraform.workspace
      managed_by  = "OpenTofu"
    }
  }
}

# Secure provider configuration
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = terraform.workspace
      Project     = var.project_name
      ManagedBy   = "OpenTofu"
      CreatedAt   = timestamp()
    }
  }

  assume_role {
    role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/TerraformRole"
    session_name = "tofu-${terraform.workspace}"
  }
}
```

### Workspace Strategy

```bash
# Workspace management
tofu workspace new development
tofu workspace new staging
tofu workspace new production

# Select workspace
tofu workspace select development

# List workspaces
tofu workspace list

# Delete workspace (with state)
tofu workspace delete -force development
```

### Module Organization

```
infrastructure/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── security/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── compute/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── development/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── backend.tf
│   ├── staging/
│   └── production/
└── global/
    ├── iam.tf
    ├── s3.tf
    └── kms.tf
```

## Troubleshooting

### Common Migration Issues

#### Provider Compatibility

```bash
# Check provider versions
tofu providers

# Update providers if needed
tofu init -upgrade
```

#### State Lock Issues

```bash
# Force unlock state
tofu force-unlock LOCK_ID

# Check state locks
tofu force-unlock --help
```

#### Exclusion Flag Issues

```bash
# Verify exclusion syntax
tofu plan -exclude="resource_type.resource_name"

# Test exclusion before apply
tofu plan -exclude="aws_instance.database"
```

## Performance Optimization

### Parallel Operations

```hcl
# Configure parallelism
terraform {
  # Default is 10, increase for large infrastructures
  parallelism = 20
}
```

### Resource Dependencies

```hcl
# Explicit dependencies for better performance
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  depends_on = [
    aws_security_group.web,
    aws_subnet.private
  ]
}
```

## Community and Ecosystem

### OpenTofu Registry

The OpenTofu Registry hosts thousands of compatible providers and modules:

```hcl
# Use registry providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"  # Still uses Terraform Registry
      version = "~> 5.0"
    }
    opentofu = {
      source  = "opentofu/opentofu"  # OpenTofu-specific providers
      version = "~> 1.0"
    }
  }
}
```

### Community Support

- **GitHub**: [OpenTofu Repository](https://github.com/opentofu/opentofu)
- **Discord**: Community discussions and support
- **Documentation**: [OpenTofu Docs](https://opentofu.org/docs)
- **Blog**: Latest features and announcements

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [OpenTofu Official Website](https://opentofu.org/)
- [OpenTofu Documentation](https://opentofu.org/docs)
- [OpenTofu vs Terraform Comparison](https://spacelift.io/blog/opentofu-vs-terraform)
- [Infrastructure as Code: Terraform vs OpenTofu vs Pulumi - 2026 Comparison](https://dasroot.net/posts/2026/01/infrastructure-as-code-terraform-opentofu-pulumi-comparison-2026/)
- [Terraform and OpenTofu: Where are we now?](https://www.quali.com/blog/terraform-and-opentofu-where-are-we-now/)
- [OpenTofu Registry](https://registry.opentofu.org/)
- [OpenTofu GitHub Repository](https://github.com/opentofu/opentofu)

## Implementation

[Add content here]

## Testing

[Add content here]
