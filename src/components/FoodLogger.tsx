import { useState } from 'react';
import { logApi } from '../services/api';
import { FoodAnalysisResult, MealLog } from '../types';
import FoodScanner from './FoodScanner';

export default function FoodLogger() {
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAnalysisComplete = (result: FoodAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleSaveLog = async () => {
    if (!analysisResult) return;

    setSaving(true);
    try {
      const log: Partial<MealLog> = {
        mealType,
        foods: analysisResult.detectedFoods,
        totalNutrition: {
          calories: analysisResult.totalCalories,
          macros: analysisResult.totalMacros
        },
        notes,
        timestamp: new Date().toISOString()
      };

      await logApi.createLog(log);
      alert('Meal logged successfully!');
      setAnalysisResult(null);
      setNotes('');
    } catch (error) {
      console.error('Failed to save log:', error);
      alert('Failed to save meal log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="food-logger">
      <h1>Log Your Meal</h1>
      
      <FoodScanner onAnalysisComplete={handleAnalysisComplete} />

      {analysisResult && (
        <div className="analysis-result">
          <h3>Analysis Result</h3>
          <div className="result-summary">
            <p><strong>Total Calories:</strong> {analysisResult.totalCalories} kcal</p>
            <p><strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(1)}%</p>
          </div>

          <div className="detected-foods">
            <h4>Detected Foods</h4>
            {analysisResult.detectedFoods.map((food, idx) => (
              <div key={idx} className="food-item">
                <span className="food-name">{food.name}</span>
                <span className="food-portion">
                  {food.portionSize.amount} {food.portionSize.unit}
                </span>
                <span className="food-calories">{food.nutrition.calories} kcal</span>
              </div>
            ))}
          </div>

          <div className="log-form">
            <div className="form-group">
              <label>Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value as any)}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this meal..."
              />
            </div>

            <button onClick={handleSaveLog} disabled={saving}>
              {saving ? 'Saving...' : 'Save Meal Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
