# NUTRIGEN – System Design Document

## 1. System Architecture Overview

NUTRIGEN follows a cloud-based, serverless architecture built on AWS.  
The system consists of the following major layers:

1. Frontend Layer
2. Authentication Layer
3. API & Compute Layer
4. AI/ML Processing Layer
5. Data Storage & Analytics Layer

---

## 2. High-Level Architecture Flow

User → Web/App Interface → API Gateway → Lambda → 
Rekognition (Food Detection) → SageMaker (ML Processing) → 
DynamoDB (Data Storage) → Dashboard Analytics

---

## 3. Component Design

### 3.1 Frontend Layer
- Built using React.js (Web)
- Hosted on AWS Amplify
- Provides dashboard, scan interface, and analytics views

### 3.2 Authentication Layer
- Amazon Cognito for user management
- Secure login and token-based access control

### 3.3 API Layer
- Amazon API Gateway to manage REST APIs
- Routes requests to backend services

### 3.4 Compute Layer
- AWS Lambda for:
  - Image processing workflow
  - Nutritional calculations
  - Goal comparison logic
  - Recommendation generation

### 3.5 AI/ML Layer
- AWS Rekognition for food item detection
- Amazon SageMaker for:
  - Portion estimation model
  - Calorie prediction model
  - Health risk prediction model

### 3.6 Storage Layer
- Amazon S3:
  - Stores uploaded food images
- Amazon DynamoDB:
  - Stores user profiles
  - Daily intake logs
  - Nutrition analytics
  - Goal settings

### 3.7 Analytics Layer
- Amazon QuickSight for:
  - Nutrition trends
  - Health scoring visualization
  - Macro distribution reports

---

## 4. Data Flow Design

1. User uploads food image.
2. Image stored in S3.
3. Lambda triggers Rekognition for food identification.
4. Detected items sent to SageMaker model.
5. Nutritional values calculated.
6. Data stored in DynamoDB.
7. Dashboard updated with insights and recommendations.

---

## 5. Security Design

- HTTPS encrypted communication
- IAM-based role access
- Secure storage in S3 with restricted access
- Cognito-based authentication tokens

---

## 6. Scalability Design

- Fully serverless infrastructure
- Auto-scaling Lambda functions
- Managed NoSQL database (DynamoDB)
- Cloud-native AI services

---

## 7. Future Design Enhancements

- Wearable integration (Google Fit, Apple Health)
- IoT-based smart kitchen integration
- Doctor/Dietician dashboard portal
- AI-powered meal plan generator
