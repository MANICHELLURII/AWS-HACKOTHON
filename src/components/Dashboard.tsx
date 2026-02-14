import { useState, useEffect } from 'react';
import { logApi, healthApi } from '../services/api';
import { DailyLog, HealthScore } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MacroDataItem {
  name: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [log, score] = await Promise.all([
        logApi.getDailyLog(today),
        healthApi.getHealthScore()
      ]);
      setDailyLog(log);
      setHealthScore(score);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const macroData: MacroDataItem[] = dailyLog ? [
    { name: 'Protein', value: dailyLog.totalNutrition.macros.protein, color: '#FF6B6B' },
    { name: 'Carbs', value: dailyLog.totalNutrition.macros.carbohydrates, color: '#4ECDC4' },
    { name: 'Fats', value: dailyLog.totalNutrition.macros.fats, color: '#FFE66D' }
  ] : [];

  return (
    <div className="dashboard">
      <h1>Today's Nutrition</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Calories</h3>
          <p className="stat-value">{dailyLog?.totalNutrition.calories || 0}</p>
          <p className="stat-label">kcal</p>
        </div>
        
        <div className="stat-card">
          <h3>Health Score</h3>
          <p className="stat-value">{healthScore?.overall || 0}</p>
          <p className="stat-label">/ 100</p>
        </div>
        
        <div className="stat-card">
          <h3>Meals Logged</h3>
          <p className="stat-value">{dailyLog?.meals.length || 0}</p>
          <p className="stat-label">today</p>
        </div>
      </div>

      {macroData.length > 0 && (
        <div className="macro-chart">
          <h3>Macro Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: { name: string; value: number }) => `${name}: ${value}g`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="meals-list">
        <h3>Today's Meals</h3>
        {dailyLog?.meals.map((meal) => (
          <div key={meal.logId} className="meal-item">
            <div className="meal-header">
              <span className="meal-type">{meal.mealType}</span>
              <span className="meal-time">{new Date(meal.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="meal-foods">
              {meal.foods.map((food, idx) => (
                <span key={idx} className="food-tag">{food.name}</span>
              ))}
            </div>
            <div className="meal-nutrition">
              {meal.totalNutrition.calories} kcal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
