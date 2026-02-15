# NUTRIGEN – Design Document

## Overview

NUTRIGEN is an AI-powered nutrition analysis application that uses computer vision to analyze food images, estimate nutritional values, and provide personalized health recommendations. The system follows a serverless, cloud-native architecture built on AWS services.

**Key Design Principles:**
- Serverless architecture for automatic scaling
- Event-driven processing for food image analysis
- Separation of concerns between UI, API, ML processing, and data layers
- Security-first approach with encrypted communication and role-based access
- Property-based testing for critical business logic

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Web/Mobile    │
│   Frontend      │
│   (React/       │
│   React Native) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  AWS Amplify    │
│  Hosting        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Amazon Cognito │◄─────┤  Authentication  │
│  User Pools     │      │  & Authorization │
└─────────────────┘      └──────────────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │
│   (REST API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│           AWS Lambda Functions              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Image   │  │Nutrition │  │ Health   │ │
│  │Processing│  │Calculator│  │ Insights │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└────────┬────────────────────────────────────┘
         │
         ├─────────────┬──────────────┬─────────────┐
         ▼             ▼              ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│AWS Rekognition│ │SageMaker │ │DynamoDB  │ │   S3     │
│(Food Detection)│ │(ML Models)│ │(NoSQL DB)│ │(Images)  │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Architecture Layers

**1. Presentation Layer**
- React.js web application
- React Native mobile application (future)
- Hosted on AWS Amplify
- Responsive design for mobile and desktop

**2. Authentication Layer**
- Amazon Cognito User Pools for user management
- JWT token-based authentication
- Role-based access control (user, admin)

**3. API Layer**
- Amazon API Gateway for REST endpoints
- Request validation and throttling
- CORS configuration for web clients

**4. Compute Layer**
- AWS Lambda functions for serverless compute
- Event-driven architecture
- Auto-scaling based on demand

**5. AI/ML Layer**
- AWS Rekognition for food item detection
- Amazon SageMaker for custom ML models:
  - Portion size estimation
  - Calorie prediction
  - Health risk assessment

**6. Data Layer**
- Amazon DynamoDB for NoSQL data storage
- Amazon S3 for image storage
- DynamoDB Streams for real-time analytics

**7. Analytics Layer**
- Amazon QuickSight for visualization
- CloudWatch for monitoring and logging

## Components and Interfaces

### Frontend Components

**1. Authentication Module**
- Login/Registration forms
- Password reset functionality
- Profile management UI

**2. Food Scanner Module**
- Camera integration for image capture
- Image upload from gallery
- Real-time preview and cropping

**3. Dashboard Module**
- Daily nutrition summary
- Calorie progress bars
- Macro distribution charts
- Goal tracking widgets

**4. Analytics Module**
- Weekly/monthly reports
- Trend visualizations
- Health score display
- Risk indicators

**5. Profile Module**
- User information management
- Goal settings
- Preferences configuration

### Backend Components

**1. User Service (Lambda)**
```typescript
interface UserService {
  createUser(userData: UserRegistration): Promise<User>
  updateProfile(userId: string, profile: UserProfile): Promise<User>
  getUser(userId: string): Promise<User>
  deleteUser(userId: string): Promise<void>
}

interface UserProfile {
  age: number
  weight: number  // in kg
  height: number  // in cm
  gender: 'male' | 'female' | 'other'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'weight_loss' | 'muscle_gain' | 'diabetes_control' | 'general_fitness'
  targetWeight?: number
  targetCalories?: number
}
```

**2. Food Recognition Service (Lambda)**
```typescript
interface FoodRecognitionService {
  analyzeImage(imageKey: string): Promise<FoodAnalysisResult>
  detectFoodItems(imageKey: string): Promise<DetectedFood[]>
  estimatePortionSize(imageKey: string, foodItem: string): Promise<PortionEstimate>
}

interface FoodAnalysisResult {
  imageId: string
  detectedFoods: DetectedFood[]
  totalCalories: number
  totalMacros: MacroNutrients
  confidence: number
  timestamp: string
}

interface DetectedFood {
  name: string
  confidence: number
  portionSize: PortionEstimate
  nutrition: NutritionInfo
}

interface PortionEstimate {
  amount: number
  unit: 'grams' | 'ml' | 'pieces' | 'cups' | 'servings'
  confidence: number
}
```

**3. Nutrition Calculator Service (Lambda)**
```typescript
interface NutritionCalculatorService {
  calculateNutrition(foods: DetectedFood[]): Promise<NutritionSummary>
  calculateDailyRequirements(profile: UserProfile): Promise<DailyRequirements>
  compareIntakeToGoals(intake: NutritionSummary, requirements: DailyRequirements): Promise<GoalComparison>
}

interface NutritionSummary {
  calories: number
  macros: MacroNutrients
  micros: MicroNutrients
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface MacroNutrients {
  protein: number      // grams
  carbohydrates: number // grams
  fats: number         // grams
  fiber: number        // grams
}

interface MicroNutrients {
  sodium?: number      // mg
  sugar?: number       // grams
  cholesterol?: number // mg
  vitamins?: Record<string, number>
}

interface DailyRequirements {
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  calculationMethod: 'harris_benedict' | 'mifflin_st_jeor'
}
```

**4. Health Insights Service (Lambda)**
```typescript
interface HealthInsightsService {
  generateWeeklyReport(userId: string): Promise<HealthReport>
  calculateHealthScore(userId: string): Promise<HealthScore>
  predictHealthRisks(userId: string): Promise<RiskAssessment>
  generateRecommendations(userId: string): Promise<Recommendation[]>
}

interface HealthReport {
  period: { start: string; end: string }
  averageCalories: number
  averageMacros: MacroNutrients
  goalAdherence: number  // percentage
  trends: NutritionTrend[]
}

interface HealthScore {
  overall: number  // 0-100
  components: {
    calorieBalance: number
    macroBalance: number
    consistency: number
    variety: number
  }
  timestamp: string
}

interface RiskAssessment {
  obesityRisk: RiskLevel
  diabetesRisk: RiskLevel
  cardiovascularRisk: RiskLevel
  factors: string[]
  recommendations: string[]
}

type RiskLevel = 'low' | 'moderate' | 'high'

interface Recommendation {
  type: 'dietary' | 'lifestyle' | 'medical'
  priority: 'low' | 'medium' | 'high'
  message: string
  actionable: boolean
}
```

**5. Food Log Service (Lambda)**
```typescript
interface FoodLogService {
  logMeal(userId: string, meal: MealLog): Promise<MealLog>
  getDailyLog(userId: string, date: string): Promise<DailyLog>
  getHistoricalLogs(userId: string, startDate: string, endDate: string): Promise<DailyLog[]>
  updateMealLog(logId: string, updates: Partial<MealLog>): Promise<MealLog>
  deleteMealLog(logId: string): Promise<void>
}

interface MealLog {
  logId: string
  userId: string
  timestamp: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: DetectedFood[]
  imageKey?: string
  totalNutrition: NutritionSummary
  notes?: string
}

interface DailyLog {
  date: string
  userId: string
  meals: MealLog[]
  totalNutrition: NutritionSummary
  goalComparison: GoalComparison
}

interface GoalComparison {
  caloriesDiff: number  // actual - target
  proteinDiff: number
  carbsDiff: number
  fatsDiff: number
  onTrack: boolean
}
```

### Data Models

**DynamoDB Table Design**

**1. Users Table**
```
Partition Key: userId (String)
Attributes:
  - email (String)
  - passwordHash (String) - managed by Cognito
  - profile (Map): UserProfile
  - createdAt (String - ISO 8601)
  - updatedAt (String - ISO 8601)
  - status (String): 'active' | 'inactive' | 'suspended'
```

**2. FoodLogs Table**
```
Partition Key: userId (String)
Sort Key: timestamp (String - ISO 8601)
Attributes:
  - logId (String)
  - mealType (String)
  - foods (List<Map>): DetectedFood[]
  - imageKey (String)
  - totalNutrition (Map): NutritionSummary
  - notes (String)
GSI: logId-index (for direct log lookup)
```

**3. DailyAggregates Table**
```
Partition Key: userId (String)
Sort Key: date (String - YYYY-MM-DD)
Attributes:
  - totalCalories (Number)
  - totalMacros (Map): MacroNutrients
  - mealCount (Number)
  - goalComparison (Map): GoalComparison
  - healthScore (Number)
```

**4. HealthReports Table**
```
Partition Key: userId (String)
Sort Key: reportDate (String - YYYY-MM-DD)
Attributes:
  - reportType (String): 'weekly' | 'monthly'
  - period (Map): { start, end }
  - metrics (Map): HealthReport
  - riskAssessment (Map): RiskAssessment
  - recommendations (List<Map>)
```

**S3 Bucket Structure**
```
nutrigen-food-images/
  ├── {userId}/
  │   ├── {year}/
  │   │   ├── {month}/
  │   │   │   ├── {imageId}.jpg
  │   │   │   └── {imageId}_thumb.jpg
```

### API Endpoints

**Authentication Endpoints**
- POST /auth/register - Register new user
- POST /auth/login - User login
- POST /auth/refresh - Refresh JWT token
- POST /auth/logout - User logout
- POST /auth/forgot-password - Password reset request

**User Endpoints**
- GET /users/me - Get current user profile
- PUT /users/me - Update user profile
- DELETE /users/me - Delete user account

**Food Analysis Endpoints**
- POST /food/analyze - Upload and analyze food image
- GET /food/analysis/{analysisId} - Get analysis result
- POST /food/manual - Manually log food entry

**Food Log Endpoints**
- POST /logs - Create meal log
- GET /logs/daily/{date} - Get daily log
- GET /logs/range - Get logs for date range
- PUT /logs/{logId} - Update meal log
- DELETE /logs/{logId} - Delete meal log

**Health Insights Endpoints**
- GET /health/score - Get current health score
- GET /health/report/weekly - Get weekly report
- GET /health/report/monthly - Get monthly report
- GET /health/risks - Get risk assessment
- GET /health/recommendations - Get personalized recommendations

**Analytics Endpoints**
- GET /analytics/trends - Get nutrition trends
- GET /analytics/goals - Get goal progress
- GET /analytics/summary - Get summary statistics



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specif