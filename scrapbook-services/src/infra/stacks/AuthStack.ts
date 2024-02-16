import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface AuthStackProps extends StackProps {
  photoBucket: IBucket
}

export class AuthStack extends Stack {

  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role; 
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: AuthStackProps) {
    super(scope, id, props);
  
      this.createUserPool();
      this.createUserPoolClient(); 
      this.createAdminGroup();
      this.createIdentityPool();
      this.createRoles(props.photoBucket); 
      this.attachRoles();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'ScrapbooksUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true
      }
    });

    new CfnOutput(this, 'ScrapbookUserPoolId', {
      value: this.userPool.userPoolId  // Outputs userPoolId during deploy
    });
    
  } 
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('ScrapbookUserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true, 
        userSrp: true,
      }
    });

    new CfnOutput(this, 'ScrapbookUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId // Outputs userPoolClientId during deploy
    });
  }

  private createAdminGroup(){
    new CfnUserPoolGroup(this, 'ScrapbookAdmins', {   // This does not have a CDK abstraction so Cfn
      userPoolId: this.userPool.userPoolId, 
      groupName: 'admins'
    })
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, 'ScrapbookIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: this.userPoolClient.userPoolClientId, 
        providerName: this.userPool.userPoolProviderName
      }]
    });

    new CfnOutput(this, 'ScrapbookIdentityPoolRef', {
      value: this.identityPool.ref 
    });
  }

  private createRoles(photoBucket: IBucket){
    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
        assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
            StringEquals: {
                'cognito-identity.amazonaws.com:aud': this.identityPool.ref
            },
            'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'authenticated'
            }
        },
            'sts:AssumeRoleWithWebIdentity'
        )
    });
    this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
        assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
            StringEquals: {
                'cognito-identity.amazonaws.com:aud': this.identityPool.ref
            },
            'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'unauthenticated'
            }
        },
            'sts:AssumeRoleWithWebIdentity'
        )
    });
    this.adminRole = new Role(this, 'CognitoAdminRole', {
        assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
            StringEquals: {
                'cognito-identity.amazonaws.com:aud': this.identityPool.ref
            },
            'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'authenticated'
            }
        },
            'sts:AssumeRoleWithWebIdentity'
        )
    });

    this.adminRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
      ],
      resources: [photoBucket.bucketArn + '/*']
    }));

    this.authenticatedRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
      ],
      resources: [photoBucket.bucketArn + '/*']
    }));
}

private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
        identityPoolId: this.identityPool.ref,
        roles: {
            'authenticated': this.authenticatedRole.roleArn,
            'unauthenticated': this.unAuthenticatedRole.roleArn
        },
        roleMappings: {
            adminsMapping: {
                type: 'Token',
                ambiguousRoleResolution: 'AuthenticatedRole',
                identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
            }
        }
    })
}

}