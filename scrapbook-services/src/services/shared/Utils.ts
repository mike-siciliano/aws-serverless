import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { JSONError } from "./Errors";



export function getNewScrapbookEntryId() {
  const uuid = randomUUID();
  return uuid;
}

export function addCorsHeader(proxyResult: APIGatewayProxyResult) {

  if (!proxyResult.headers) {
    proxyResult.headers = {};
  }

  proxyResult.headers['Access-Control-Allow-Origin'] = '*';
  proxyResult.headers['Access-Control-Allow-Origin'] = '*';
}

export function parseScrapbookEntry(scrapbookJson: string) {
  try {
    return JSON.parse(scrapbookJson);
  } catch (error) {
    throw new JSONError(error.message);
  }
}

export function isAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  if (groups) {
    return (groups as string).includes('admins');
  }
  return false; 
}
