import { UserProfile, MacroNutrients } from '../types';

const FOOD_DATABASE: Record<string, { calories: number; macros: MacroNutrients }> = {
  rice: { calories: 130, macros: { protein: 2.7, carbohydrates: 28, fats: 0.3, fiber: 0.4 } },
  chicken: { calories: 165, macros: { protein: 31, carbohydrates: 0, fats: 3.6, fiber: 0 } },
  bread: { calories: 265, macros: { protein: 9, carbohydrates: 49, fats: 3.2, fiber: 2.7 } },
  egg: { calories: 155, macros: { protein: 13, carbohydrates: 1.1, fats: 11, fiber: 0 } },
  banana: { calories: 89, macros: { protein: 1.1, carbohydrates: 23, fats: 0.3, fiber: 2.6 } },
  apple: { calories: 52, macros: { protein: 0.3, carbohydrates: 14, fats: 0.2, fiber: 2.4 } },
  milk: { calories: 42, macros: { protein: 3.4, carbohydrates: 5, fats: 1, fiber: 0 } },
  potato: { calories: 77, macros: { protein: 2, carbohydrates: 17, fats: 0.1, fiber: 2.2 } },
  fish: { calories: 206, macros: { protein: 22, carbohydrates: 0, fats: 12, fiber: 0 } },
  pasta: { calories: 131, macros: { protein: 5, carbohydrates: 25, fats: 1.1, fiber: 1.8 } }
};

export function calculateDailyRequirements(profile: UserProfile): { calories: number; macros: MacroNutrients } {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  let tdee = bmr * activityMultipliers[activityLevel];

  if (goal === 'weight_loss') tdee -= 500;
  else if (goal === 'muscle_gain') tdee += 300;

  const protein = weight * 1.6;
  const fats = (tdee * 0.25) / 9;
  const carbohydrates = (tdee - (protein * 4 + fats * 9)) / 4;

  return {
    calories: Math.round(tdee),
    macros: {
      protein: Math.round(protein),
      carbohydrates: Math.round(carbohydrates),
      fats: Math.round(fats),
      fiber: 25
    }
  };
}

export function getNutritionForFood(foodName: string, portionGrams: number = 100): { calories: number; macros: MacroNutrients } {
  const normalized = foodName.toLowerCase();
  const baseNutrition = FOOD_DATABASE[normalized] || FOOD_DATABASE.rice;
  
  const multiplier = portionGrams / 100;
  return {
    calories: Math.round(baseNutrition.calories * multiplier),
    macros: {
      protein: Math.round(baseNutrition.macros.protein * multiplier * 10) / 10,
      carbohydrates: Math.round(baseNutrition.macros.carbohydrates * multiplier * 10) / 10,
      fats: Math.round(baseNutrition.macros.fats * multiplier * 10) / 10,
      fiber: Math.round(baseNutrition.macros.fiber * multiplier * 10) / 10
    }
  };
}

export function calculateHealthScore(logs: any[], requirements: any): number {
  if (logs.length === 0) return 50;

  const avgCalories = logs.reduce((sum, log) => sum + log.totalNutrition.calories, 0) / logs.length;
  const calorieBalance = Math.max(0, 100 - Math.abs(avgCalories - requirements.calories) / 10);

  const avgProtein = logs.reduce((sum, log) => sum + log.totalNutrition.macros.protein, 0) / logs.length;
  const macroBalance = Math.max(0, 100 - Math.abs(avgProtein - requirements.macros.protein) / 2);

  const consistency = logs.length >= 7 ? 100 : (logs.length / 7) * 100;

  return Math.round((calorieBalance * 0.4 + macroBalance * 0.3 + consistency * 0.3));
}
