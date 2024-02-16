import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { notFound404Error } from "../shared/Errors";

export async function updateScrapbookEntry(
  event: APIGatewayProxyEvent,
  dynamoDbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

  if (event.pathParameters?.id && event.body) {
    const scrapbookId = event.pathParameters.id;
    const eventJson = JSON.parse(event.body);
    const requestBodyKey = Object.keys(eventJson)[0];
    const requestBodyValue = eventJson[requestBodyKey];

    const updateResult = await dynamoDocClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME, // exposed in LambdaStack
        Key: {
          id: scrapbookId,
        },
        UpdateExpression: "set #zScrapbookKey = :newValue", // This '#z' avoids collisions with DynamoDB keywords
        ExpressionAttributeNames: {
          "#zScrapbookKey": requestBodyKey,
        },
        ExpressionAttributeValues: {
          ":newValue": requestBodyValue,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }
  return notFound404Error();
}
