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

export interface DetectedFood {
  name: string;
  confidence: number;
  portionSize: {
    amount: number;
    unit: string;
    confidence: number;
  };
  nutrition: {
    calories: number;
    macros: MacroNutrients;
  };
}

export interface MealLog {
  logId: string;
  userId: string;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: DetectedFood[];
  imageKey?: string;
  totalNutrition: {
    calories: number;
    macros: MacroNutrients;
  };
  notes?: string;
}
