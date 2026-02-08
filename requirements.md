# NUTRIGEN – Requirements Document

## 1. Project Overview

NUTRIGEN is an AI-powered nutrition analysis web/mobile application that uses computer vision and machine learning to analyze food intake, estimate nutritional values, and provide personalized health recommendations.

The system aims to assist users in tracking calories, macronutrients, and long-term health risks based on their dietary habits.

---

## 2. Functional Requirements

### 2.1 User Management
- User registration and login
- Secure authentication using JWT
- Profile management (age, weight, height, goals)
- Goal selection (weight loss, muscle gain, diabetes control, general fitness)

### 2.2 Food Recognition
- Capture or upload food images
- Detect multiple food items in a single image
- Estimate portion size
- Calculate calories and macronutrients

### 2.3 Nutrition Tracking
- Log daily food intake automatically
- Track calories, protein, carbohydrates, fats
- Compare intake against daily requirements
- Maintain historical nutrition records

### 2.4 Health Insights
- Weekly and monthly nutrition reports
- Health score calculation
- Risk prediction (obesity, diabetes trends)
- AI-generated dietary suggestions

### 2.5 Analytics Dashboard
- Calorie trend visualization
- Macro distribution charts
- Goal progress indicators
- Personalized alerts and recommendations

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Food analysis response time under 3 seconds
- Support for concurrent users (scalable architecture)

### 3.2 Scalability
- Serverless cloud infrastructure
- Automatic scaling based on demand

### 3.3 Security
- Encrypted communication (HTTPS)
- Role-based access control
- Secure image and data storage

### 3.4 Reliability
- 99% uptime availability
- Fault-tolerant cloud services

### 3.5 Usability
- Simple and intuitive UI
- Mobile-responsive design
- Multilingual support (future scope)

---

## 4. Assumptions

- Users have access to a smartphone or web-enabled device.
- Initial food recognition focuses on common Indian dishes.
- AWS cloud infrastructure will be used for deployment.

---

## 5. Constraints

- Image-based portion estimation may not be 100% accurate.
- Free-tier cloud usage during prototype phase.
- Limited dataset during initial training phase.
