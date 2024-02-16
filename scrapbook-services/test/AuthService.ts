import { JWT, SignInOutput, signIn } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Amplify } from 'aws-amplify';
import { ApiStack, AuthStack } from '../cfn-outputs.json';

 
const awsRegion = ApiStack.AwsRegion; 
const identityPoolId = AuthStack.ScrapbookIdentityPoolRef; 
const userPoolId = AuthStack.ScrapbookUserPoolId; 
const userPoolClientId = AuthStack.ScrapbookUserPoolClientId; 

Amplify.configure({
  Auth: {
    
    Cognito: {
      identityPoolId: identityPoolId,
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId, 
    },
  },
});

export class AuthService {

  /*
   * Used to sign user in
   */ 
  public async login(username: string, password: string) {
    const result = (await signIn({
      username,
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH',
      },
    })) as SignInOutput;
    return result;
  }

  /*
   * Used to generate credentials 
   */ 
  public async generateTemporaryCredentials(jwtToken: JWT) {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool ({
        identityPoolId: identityPoolId,
        logins: {
          [cognitoIdentityPool]: jwtToken?.toString()
        }
      })
    });

    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}