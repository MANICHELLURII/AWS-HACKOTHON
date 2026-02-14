import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { calculateHealthScore, calculateDailyRequirements } from '../utils/nutrition';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const getHealthScore: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub || 'test-user';

    const profileResult = await docClient.send(new GetCommand({
      TableName: process.env.USERS_TABLE,
      Key: { userId }
    }));

    const profile = profileResult.Item?.profile;
    if (!profile) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Profile not found' })
      };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logsResult = await docClient.send(new QueryCommand({
      TableName: process.env.FOOD_LOGS_TABLE,
      KeyConditionExpression: 'userId = :userId AND #ts >= :startDate',
      ExpressionAttributeNames: { '#ts': 'timestamp' },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':startDate': sevenDaysAgo.toISOString()
      }
    }));

    const logs = logsResult.Items || [];
    const requirements = calculateDailyRequirements(profile);
    const overall = calculateHealthScore(logs, requirements);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        overall,
        components: {
          calorieBalance: Math.round(overall * 0.4),
          macroBalance: Math.round(overall * 0.3),
          consistency: Math.round(overall * 0.2),
          variety: Math.round(overall * 0.1)
        },
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error calculating health score:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to calculate health score' })
    };
  }
};
