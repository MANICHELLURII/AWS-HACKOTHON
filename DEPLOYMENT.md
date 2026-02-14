# NUTRIGEN Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- AWS Account with CLI configured
- Serverless Framework: `npm install -g serverless`

## Setup Steps

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd lambda
npm install
cd ..
```

### 2. Configure AWS Cognito

```bash
# Create Cognito User Pool
aws cognito-idp create-user-pool \
  --pool-name nutrigen-users \
  --auto-verified-attributes email \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}"

# Create User Pool Client
aws cognito-idp create-user-pool-client \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --client-name nutrigen-web \
  --no-generate-secret
```

### 3. Deploy Backend

```bash
cd lambda
serverless deploy --stage dev
cd ..
```

This will create:
- API Gateway endpoints
- Lambda functions
- DynamoDB tables
- S3 bucket for images

### 4. Configure Environment

Copy `.env.example` to `.env` and fill in values from AWS:

```bash
cp .env.example .env
```

Update with your AWS resource IDs from the Serverless deployment output.

### 5. Deploy Frontend

```bash
# Build
npm run build

# Deploy to AWS Amplify
# Option 1: Connect GitHub repo to Amplify Console
# Option 2: Manual deployment
aws s3 sync dist/ s3://your-amplify-bucket/
```

## Local Development

```bash
# Start frontend dev server
npm run dev

# Backend requires AWS credentials configured
# Test Lambda functions locally with serverless-offline
cd lambda
serverless offline
```

## Testing

1. Register a new user through the app
2. Verify email (check spam folder)
3. Login and complete profile
4. Upload a food image to test analysis
5. Check dashboard for nutrition data

## Troubleshooting

- **CORS errors**: Verify API Gateway CORS settings
- **Auth errors**: Check Cognito User Pool configuration
- **Image upload fails**: Verify S3 bucket permissions
- **Lambda timeout**: Increase timeout in serverless.yml

## Cost Estimation

Free tier usage:
- Lambda: 1M requests/month
- DynamoDB: 25GB storage
- S3: 5GB storage
- Cognito: 50,000 MAUs

Expected monthly cost for 100 users: $5-10
