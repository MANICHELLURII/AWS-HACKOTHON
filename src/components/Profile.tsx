import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { UserProfile } from '../types';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await userApi.updateProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save profile');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h1>Profile</h1>
      
      <div className="profile-form">
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={formData.weight || ''}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Height (cm)</label>
          <input
            type="number"
            value={formData.height || ''}
            onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            disabled={!editing}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Activity Level</label>
          <select
            value={formData.activityLevel || ''}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
            disabled={!editing}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <div className="form-group">
          <label>Goal</label>
          <select
            value={formData.goal || ''}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
            disabled={!editing}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="diabetes_control">Diabetes Control</option>
            <option value="general_fitness">General Fitness</option>
          </select>
        </div>

        <div className="form-actions">
          {editing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => { setEditing(false); setFormData(profile); }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}
