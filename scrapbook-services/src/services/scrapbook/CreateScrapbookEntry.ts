import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getNewScrapbookEntryId, parseScrapbookEntry } from "../shared/Utils";
import { validateEntry } from "../shared/Validator";


export async function createScrapbookEntry(event: APIGatewayProxyEvent, dynamoDbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

  let scrapbookEntry = parseScrapbookEntry(event.body);
  scrapbookEntry.id = getNewScrapbookEntryId();

  validateEntry(scrapbookEntry);

  const result = await dynamoDocClient.send(new PutCommand({
    TableName: process.env.TABLE_NAME, // exposed in LambdaStack
    Item: scrapbookEntry
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({id: scrapbookEntry.id})
  }

}