# Setup Guide

## Prerequisites

- AWS Account
- AWS CLI configured
- Node.js 14.x or later
- Terraform (optional, for infrastructure as code)

## Deployment Steps

1. Clone this repository
2. Configure AWS credentials
3. Deploy the infrastructure using either AWS SAM or Terraform
4. Set up the API Gateway and Lambda functions
5. Configure content storage and CDN
6. Set up user authentication

## Detailed Instructions

### 1. AWS Configuration

```bash
aws configure
```

### 2. Deploy Infrastructure

Using AWS SAM:

```bash
sam build
sam deploy --guided
```

Using Terraform:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 3. Testing the Deployment

Verify the API endpoints:

```bash
curl -X GET https://<your-api-gateway-url>/api/movies
```
