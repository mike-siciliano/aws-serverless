import { Fn, Stack } from "aws-cdk-lib";

export const APP_NAME = 'Scrapbook';
export const REST_SERVICE = 'scrapbook';

export function getStackSuffix(stack: Stack) {
  /**
   * Creates a namespace suffix for AWS resources 
   */
  const shortStackId = Fn.select(2, Fn.split('/', stack.stackId));
  const suffix = Fn.select(4, Fn.split('-', shortStackId));
  return suffix;
}