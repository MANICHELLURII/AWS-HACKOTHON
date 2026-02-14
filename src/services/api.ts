import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { FoodAnalysisResult, MealLog, DailyLog, HealthScore, UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching auth session:', error);
  }
  return config;
});

export const foodApi = {
  analyzeImage: async (imageFile: File): Promise<FoodAnalysisResult> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await api.post('/food/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  manualLog: async (foodData: Partial<MealLog>): Promise<MealLog> => {
    const { data } = await api.post('/food/manual', foodData);
    return data;
  }
};

export const logApi = {
  createLog: async (log: Partial<MealLog>): Promise<MealLog> => {
    const { data } = await api.post('/logs', log);
    return data;
  },

  getDailyLog: async (date: string): Promise<DailyLog> => {
    const { data } = await api.get(`/logs/daily/${date}`);
    return data;
  },

  getLogRange: async (startDate: string, endDate: string): Promise<DailyLog[]> => {
    const { data } = await api.get('/logs/range', {
      params: { startDate, endDate }
    });
    return data;
  },

  updateLog: async (logId: string, updates: Partial<MealLog>): Promise<MealLog> => {
    const { data } = await api.put(`/logs/${logId}`, updates);
    return data;
  },

  deleteLog: async (logId: string): Promise<void> => {
    await api.delete(`/logs/${logId}`);
  }
};

export const healthApi = {
  getHealthScore: async (): Promise<HealthScore> => {
    const { data } = await api.get('/health/score');
    return data;
  },

  getWeeklyReport: async () => {
    const { data } = await api.get('/health/report/weekly');
    return data;
  },

  getRiskAssessment: async () => {
    const { data } = await api.get('/health/risks');
    return data;
  },

  getRecommendations: async () => {
    const { data } = await api.get('/health/recommendations');
    return data;
  }
};

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.put('/users/me', profile);
    return data;
  }
};
