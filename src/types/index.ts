export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'muscle_gain' | 'diabetes_control' | 'general_fitness';
  targetWeight?: number;
  targetCalories?: number;
}

export interface MacroNutrients {
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
}

export interface NutritionSummary {
  calories: number;
  macros: MacroNutrients;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DetectedFood {
  name: string;
  confidence: number;
  portionSize: {
    amount: number;
    unit: string;
    confidence: number;
  };
  nutrition: NutritionSummary;
}

export interface FoodAnalysisResult {
  imageId: string;
  detectedFoods: DetectedFood[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  confidence: number;
  timestamp: string;
}

export interface MealLog {
  logId: string;
  userId: string;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: DetectedFood[];
  imageKey?: string;
  totalNutrition: NutritionSummary;
  notes?: string;
}

export interface DailyLog {
  date: string;
  userId: string;
  meals: MealLog[];
  totalNutrition: NutritionSummary;
  goalComparison: {
    caloriesDiff: number;
    proteinDiff: number;
    carbsDiff: number;
    fatsDiff: number;
    onTrack: boolean;
  };
}

export interface HealthScore {
  overall: number;
  components: {
    calorieBalance: number;
    macroBalance: number;
    consistency: number;
    variety: number;
  };
  timestamp: string;
}
