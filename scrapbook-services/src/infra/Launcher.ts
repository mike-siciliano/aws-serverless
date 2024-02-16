import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/APIStack";
import { AuthStack } from "./stacks/AuthStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";


/*
 * This is what ties everythihg together.  The stacks need to be 
 * launched in the correct order.
 */

const app = new App();
 

const dataStack = new DataStack(app, 'DataStack');


const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  scrapbookTable: dataStack.scrapbookTable
});


const authStack = new AuthStack(app, 'AuthStack', {
  photoBucket: dataStack.scrapbookPhotosBucket
});


new ApiStack(app, 'ApiStack', {
  scrapbookLambdaIntegration: lambdaStack.scrapbookLambdaIntegration,
  userPool: authStack.userPool
});

new UiDeploymentStack(app, 'UiDeploymentStack');