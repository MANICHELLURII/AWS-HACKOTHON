import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const createLog: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub || 'test-user';
    const body = JSON.parse(event.body || '{}');

    const log = {
      logId: uuidv4(),
      userId,
      timestamp: body.timestamp || new Date().toISOString(),
      mealType: body.mealType,
      foods: body.foods,
      totalNutrition: body.totalNutrition,
      notes: body.notes || ''
    };

    await docClient.send(new PutCommand({
      TableName: process.env.FOOD_LOGS_TABLE,
      Item: log
    }));

    return {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(log)
    };
  } catch (error) {
    console.error('Error creating log:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to create log' })
    };
  }
};

export const getDailyLog: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub || 'test-user';
    const date = event.pathParameters?.date || new Date().toISOString().split('T')[0];

    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const result = await docClient.send(new QueryCommand({
      TableName: process.env.FOOD_LOGS_TABLE,
      KeyConditionExpression: 'userId = :userId AND #ts BETWEEN :start AND :end',
      ExpressionAttributeNames: { '#ts': 'timestamp' },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':start': startOfDay,
        ':end': endOfDay
      }
    }));

    const meals = result.Items || [];
    const totalNutrition = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.totalNutrition?.calories || 0),
      macros: {
        protein: acc.macros.protein + (meal.totalNutrition?.macros?.protein || 0),
        carbohydrates: acc.macros.carbohydrates + (meal.totalNutrition?.macros?.carbohydrates || 0),
        fats: acc.macros.fats + (meal.totalNutrition?.macros?.fats || 0),
        fiber: acc.macros.fiber + (meal.totalNutrition?.macros?.fiber || 0)
      }
    }), { calories: 0, macros: { protein: 0, carbohydrates: 0, fats: 0, fiber: 0 } });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        date,
        userId,
        meals,
        totalNutrition,
        goalComparison: {
          caloriesDiff: 0,
          proteinDiff: 0,
          carbsDiff: 0,
          fatsDiff: 0,
          onTrack: true
        }
      })
    };
  } catch (error) {
    console.error('Error getting daily log:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get daily log' })
    };
  }
};
