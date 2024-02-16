import { JWT, SignInOutput, fetchAuthSession, signIn, signOut } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Amplify } from 'aws-amplify';
import { ApiStack, AuthStack } from '../../../scrapbook-services/cfn-outputs.json';

Amplify.configure({
  Auth: {
    
    Cognito: {
      identityPoolId: AuthStack.ScrapbookIdentityPoolRef,
      userPoolId: AuthStack.ScrapbookUserPoolId,
      userPoolClientId: AuthStack.ScrapbookUserPoolClientId, 
    },
  },
});


export class AuthService {

  private jwtToken: string = '';
  private username: string | undefined;
  private tempCredentials: object | undefined;

  constructor( idToken: JWT | undefined) {
    if (idToken) {
      this.jwtToken = idToken?.toString()!;
      this.username = this.getCognitoUsername(idToken);
    } 
  }


  public static async build(): Promise<AuthService> {
    // The user might have closed a tab or navigated away, but still has and active session
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    return new AuthService(idToken)
  }

  public async login(username: string, password: string) {

    try {
      const signInOutput = (await signIn({
        username,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      })) as SignInOutput;

      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      this.jwtToken = idToken?.toString()!;

      return this.username = this.getCognitoUsername(idToken);

    } catch (error) {
      console.error(error);
      return undefined
    }
  }

  public async logout() {
    this.username = '';
    this.jwtToken = '';
    try {
      await signOut();
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }

  public getAuthToken() {
    return this.jwtToken;
  }

  public isSignedIn() {
    return this.jwtToken ? true : false;
  }


  public getSignedInUser() {
    return this.username;
  }


  public async getTemporaryCredentials() {
    if (!this.tempCredentials) {
      this.tempCredentials  = await this.generateTemporaryCredentials();
    }
    return this.tempCredentials;
  }

  private async generateTemporaryCredentials() {
    const cognitoIdentityPool = `cognito-idp.${ApiStack.AwsRegion}.amazonaws.com/${AuthStack.ScrapbookUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool ({
        clientConfig: {
          region: ApiStack.AwsRegion
        },
        identityPoolId: AuthStack.ScrapbookIdentityPoolRef,
        logins: {
          [cognitoIdentityPool]: this.jwtToken
        }
      })
    });

    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }

  private getCognitoUsername(idToken: JWT | undefined) {
    const cognitoUsername = idToken?.payload['cognito:username'] as string;
    return  cognitoUsername ? cognitoUsername : '';
  }
}