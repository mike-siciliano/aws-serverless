import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';


interface LambdaStackProps extends StackProps {
  scrapbookTable: ITable
}

export class LambdaStack extends Stack {

  public readonly scrapbookLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    // Lambda function
    const scrapbookLambda = new NodejsFunction(this, 'ScrapbookLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '..', '..', 'services', 'scrapbook', 'handler.ts')),
      environment: {
        TABLE_NAME: props.scrapbookTable.tableName  // Exposed for DynamoDBClient
      }
    });

    scrapbookLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.scrapbookTable.tableArn],
      actions: [
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:Scan',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ]
    }))

    // API Gateway accepts/requires LambdaIntegrations
    this.scrapbookLambdaIntegration = new LambdaIntegration(scrapbookLambda); 

  }
}