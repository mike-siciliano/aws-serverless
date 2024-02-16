import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table as DynamoDbTable, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { BlockPublicAccess, Bucket, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { APP_NAME, getStackSuffix } from '../Utils';


export class DataStack extends Stack {

  public readonly scrapbookTable: ITable;
  public readonly  scrapbookPhotosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stackSuffix = getStackSuffix(this);

    this.scrapbookTable = new DynamoDbTable(this, `${APP_NAME}Table`, {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: `${APP_NAME}-Table-${stackSuffix}`
    });

    this.scrapbookPhotosBucket = new Bucket(this, 'ScrapbookPhotosBucket', {
      bucketName: `scrapbook-photos-bucket-${stackSuffix}`,
      cors: [{
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.PUT
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }],
      // enforceSSL: true, ???
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      publicReadAccess: true,
      blockPublicAccess: new BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
        ignorePublicAcls: false
      }),
    });

    

    new CfnOutput(this, 'ScrapbookPhotosBucketName', { 
      value: this.scrapbookPhotosBucket.bucketName 
    });

  }
}