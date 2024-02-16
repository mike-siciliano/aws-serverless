import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminGroup } from "../shared/Utils";


export async function deleteScrapbookEntry(event: APIGatewayProxyEvent, dynamoDbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// Privileges if necessary 
  // if (!isAdminGroup(event)) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify('User must be an administrator to delete this resource.')
  //   }
  // }

  if (event.pathParameters?.id) {
    const scrapbookId = event.pathParameters.id;

    await dynamoDocClient.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME, // exposed in LambdaStack
      Key: {
        'id': scrapbookId
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(`${scrapbookId} deleted`)
    }
  }
  return {
    statusCode: 404,
    body: JSON.stringify('Scrapbook item not found')
  }

}