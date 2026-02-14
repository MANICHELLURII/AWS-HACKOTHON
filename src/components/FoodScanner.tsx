import { useState, useRef } from 'react';
import { foodApi } from '../services/api';
import { FoodAnalysisResult } from '../types';

export default function FoodScanner({ onAnalysisComplete }: { onAnalysisComplete: (result: FoodAnalysisResult) => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setAnalyzing(true);

    try {
      const result = await foodApi.analyzeImage(file);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="food-scanner">
      <h2>Scan Your Food</h2>
      <div className="scanner-container">
        {preview ? (
          <img src={preview} alt="Food preview" className="preview-image" />
        ) : (
          <div className="upload-placeholder">
            <p>Upload or capture a food image</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <div className="scanner-actions">
        <button onClick={() => fileInputRef.current?.click()} disabled={analyzing}>
          {analyzing ? 'Analyzing...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}
