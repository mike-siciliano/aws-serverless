import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { JSONError, MissingFieldError } from '../shared/Errors';
import { addCorsHeader } from '../shared/Utils';
import { createScrapbookEntry } from './CreateScrapbookEntry';
import { deleteScrapbookEntry } from './DeleteScrapbookEntry';
import { getScrapbookEntries } from './GetScrapbookEntries';
import { updateScrapbookEntry } from './UpdateScrapbookEntry';

const s3Client = new S3Client({});
const dynamoDbClient = new DynamoDBClient({});


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getScrapbookEntries(event, dynamoDbClient);
        break;
      case 'POST':
        response = await createScrapbookEntry(event, dynamoDbClient);
        break;
      case 'PUT':
        response = await updateScrapbookEntry(event, dynamoDbClient);
        break;
      case 'DELETE':
        response = await deleteScrapbookEntry(event, dynamoDbClient);
        break;
      default: 
      return {
        statusCode: 405,
        body: JSON.stringify(`Unsupported HTTP method: ${event.httpMethod}`)
      }
    }
  } catch (error) {
    console.log(error)

    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }

    if (error instanceof JSONError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    }
  }

  addCorsHeader(response);
  return response; 
}

export { handler }; // Has to be exported as an object
