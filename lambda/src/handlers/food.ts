import { APIGatewayProxyHandler } from 'aws-lambda';
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getNutritionForFood } from '../utils/nutrition';
import { DetectedFood } from '../types';

const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

export const analyzeImage: APIGatewayProxyHandler = async (event) => {
  try {
    const imageId = uuidv4();
    const imageBuffer = Buffer.from(event.body || '', 'base64');
    const imageKey = `${imageId}.jpg`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.FOOD_IMAGES_BUCKET,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: 'image/jpeg'
    }));

    const rekognitionResult = await rekognition.send(new DetectLabelsCommand({
      Image: { Bytes: imageBuffer },
      MaxLabels: 10,
      MinConfidence: 70
    }));

    const foodLabels = rekognitionResult.Labels?.filter(label => 
      ['Food', 'Dish', 'Meal', 'Cuisine'].some(cat => label.Categories?.some(c => c.Name === cat))
    ) || [];

    const detectedFoods: DetectedFood[] = foodLabels.slice(0, 5).map(label => {
      const portionGrams = 150;
      const nutrition = getNutritionForFood(label.Name || 'rice', portionGrams);
      
      return {
        name: label.Name || 'Unknown Food',
        confidence: (label.Confidence || 0) / 100,
        portionSize: {
          amount: portionGrams,
          unit: 'grams',
          confidence: 0.7
        },
        nutrition
      };
    });

    const totalCalories = detectedFoods.reduce((sum, food) => sum + food.nutrition.calories, 0);
    const totalMacros = detectedFoods.reduce((acc, food) => ({
      protein: acc.protein + food.nutrition.macros.protein,
      carbohydrates: acc.carbohydrates + food.nutrition.macros.carbohydrates,
      fats: acc.fats + food.nutrition.macros.fats,
      fiber: acc.fiber + food.nutrition.macros.fiber
    }), { protein: 0, carbohydrates: 0, fats: 0, fiber: 0 });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        imageId,
        detectedFoods,
        totalCalories,
        totalMacros,
        confidence: detectedFoods.length > 0 ? detectedFoods[0].confidence : 0,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to analyze image' })
    };
  }
};
