import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { notFound404Error } from "../shared/Errors";


export async function getScrapbookEntries(event: APIGatewayProxyEvent, dynamoDbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

  if (event.pathParameters?.id) {
    const scrapbookEntryId = event.pathParameters?.id;
    const scrapbookResult = await dynamoDocClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME, // exposed in LambdaStack
      Key: {
        'id': scrapbookEntryId
      }
    }));

    if (scrapbookResult.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(scrapbookResult.Item)
      }
    } else {
      return notFound404Error()
    }
    
  } 

  const result = await dynamoDbClient.send(new ScanCommand({
    TableName: process.env.TABLE_NAME, // exposed in LambdaStack
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  }

}