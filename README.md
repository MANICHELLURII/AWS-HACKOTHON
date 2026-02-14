# NUTRIGEN - AI-Powered Nutrition Analysis

An intelligent nutrition tracking application that uses computer vision to analyze food images and provide personalized health insights.

## Features

- **Food Recognition**: Upload food images for automatic calorie and macro calculation
- **Daily Tracking**: Log meals and monitor daily nutrition intake
- **Health Insights**: Get personalized health scores and recommendations
- **Goal Management**: Set and track fitness goals (weight loss, muscle gain, etc.)
- **Analytics Dashboard**: Visualize nutrition trends and progress

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- AWS Amplify for authentication
- Recharts for data visualization

**Backend:**
- AWS Lambda (serverless functions)
- Amazon API Gateway (REST API)
- Amazon DynamoDB (NoSQL database)
- Amazon Rekognition (food detection)
- Amazon S3 (image storage)
- Amazon Cognito (authentication)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Build

```bash
npm run build
```

## Project Structure

```
nutrigen/
├── src/
│   ├── components/      # React components
│   ├── services/        # API clients
│   ├── types/          # TypeScript types
│   └── config/         # Configuration
├── lambda/
│   └── src/
│       ├── handlers/   # Lambda functions
│       └── utils/      # Shared utilities
└── docs/              # Documentation
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Architecture

NUTRIGEN follows a serverless, event-driven architecture:

1. User uploads food image
2. Image stored in S3
3. Lambda triggers Rekognition for food detection
4. Nutrition data calculated and stored in DynamoDB
5. Frontend displays results and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
