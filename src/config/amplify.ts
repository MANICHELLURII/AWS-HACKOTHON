export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID || 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      loginWith: {
        email: true
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true
        }
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true
      }
    }
  },
  API: {
    REST: {
      NutrigenAPI: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.nutrigen.example.com',
        region: 'us-east-1'
      }
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET || 'nutrigen-food-images',
      region: 'us-east-1'
    }
  }
};
