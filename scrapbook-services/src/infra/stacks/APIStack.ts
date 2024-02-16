import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { APP_NAME, REST_SERVICE } from '../Utils';


interface ApiStackProps extends StackProps {
  scrapbookLambdaIntegration: LambdaIntegration
  userPool: IUserPool
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    
    // REST API  
    const api = new RestApi(this, `${APP_NAME}-Api`);

    // Set up Authorization
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'ScrapbookApiAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization' // This is the location of the JWT token 
    });

    authorizer._attachToApi(api);

    const apiOptionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId
      }
    }

    // Resource and method definitions 

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS
      }
  }

    const scrapbookResource = api.root.addResource(`${REST_SERVICE.toLowerCase()}`, optionsWithCors);

    scrapbookResource.addMethod('GET', props.scrapbookLambdaIntegration, apiOptionsWithAuth);
    scrapbookResource.addMethod('POST', props.scrapbookLambdaIntegration, apiOptionsWithAuth);

    // Instaance resource and method definitions 
    const scrapbookEntryResource = scrapbookResource.addResource('{id}');
    scrapbookEntryResource.addMethod('GET', props.scrapbookLambdaIntegration, apiOptionsWithAuth);
    scrapbookEntryResource.addMethod('PUT', props.scrapbookLambdaIntegration, apiOptionsWithAuth);
    scrapbookEntryResource.addMethod('DELETE', props.scrapbookLambdaIntegration, apiOptionsWithAuth);


    new CfnOutput(this, 'ScrapbookApi', {
      value: api.url 
    });

    new CfnOutput(this, 'AwsRegion', {
      value: this.region 
    });

  }

}