import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { exec } from 'child_process';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';
import { getStackSuffix } from '../Utils';


export class UiDeploymentStack extends Stack {

  public readonly  uiDeploymentBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stackSuffix = getStackSuffix(this);

    this.uiDeploymentBucket = new Bucket(this, 'UiDeploymentBucket', {
      bucketName: `scrapbook-ui-bucket-${stackSuffix}`,
    });

    // Build the UI
    const uiDir = join(__dirname, '..', '..', '..', '..', 'scrapbook-ui');

    exec('npm clean-install && npm run build', {cwd: uiDir}, function(error,stdout,stderr){
      console.log('UI stdout:', stdout);
      console.error('UI stderr:', stderr);
      console.error('UI error:', error);
    });

    const uiDistributionDir = join(uiDir, 'dist');

    if (!existsSync(uiDistributionDir)) {
      throw new Error(`UI distribution directory not found! Path: ${uiDistributionDir}`); 
    }

    new BucketDeployment(this, 'ScrapbookUiDeploymentBucket', {
      destinationBucket: this.uiDeploymentBucket,
      sources: [Source.asset(uiDistributionDir)]
    });

    const originIdentity = new OriginAccessIdentity(this, 'OriginIdentityAccess');

    this.uiDeploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, 'ScrapbooksDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(this.uiDeploymentBucket, {
          originAccessIdentity: originIdentity
        })
      }
    });

    new CfnOutput(this, 'ScrapbookUrl', {
      value: distribution.distributionDomainName
    });
  }
  
}
