# Scrapbook Project

## Overview

Welcome to the Scrapbook Project! This project is designed to demonstrate Serverless Computing on AWS through the use of several services including:
* CloudFormation (IaC)
* Cloud Development Kit (CDK)
* Lambda
* API Gateway
* S3
* DynamoDB
* Cognito and Amplify

All written in TypeScript.

### Purpose
The Scrapbook Project aims to provide others with a comprehensive example of how to develop and deploy a serverless backend architecture using AWS services. This project offers insights into API development, deployment strategies, and integration approaches.


### Scalability and Performance
By using AWS services, this project ensures scalability and performance, allowing it to handle varying workloads and maintain responsiveness even during peak usage periods.


## Disclaimer

Please note that this project is provided as an example only. It is not intended for production use and will ***not*** be maintained.  CloudFormation and CDK are
currently undergoing rapid development. 


## Getting Started

Before running the project, ensure you have the AWS Command Line Interface (CLI) configured with appropriate credentials. If you haven't set it up yet, you can follow the instructions provided by AWS:
[AWS CLI Configuration Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

i.e. AWS CLI is installed and  ~/.aws/credentials would have the following: 
<script>
 [default]
 aws_access_key_id = <your id>
 aws_secret_access_key = <your key>
</script>

To get started with Scrapbook, and deploy resources to your AWS account, follow these steps:

1. Clone the repository: `git clone https://github.com/mike-siciliano/aws-serverless.git`
2. Change to the services directory: `cd scrapbook-services`
3. Install dependencies: `npm install`
4. Deploy the project: `npm run deploy`


Before using the project for the first time, you need to create a Cognito user using the AWS Management Console. Follow these steps:

1. Navigate to the AWS Management Console.
2. Open the Amazon Cognito service.
3. Open the ScrapbooksUserPool created by CloudFormation.
4. Create one or more users within the user pool, ensuring they have appropriate permissions for Scrapbook.
5. Confirm passwords for any new users:
	- Locate the `cfn-outputs.json` file to get the value of user-pool-id (`ScrapbookUserPoolId` in `AuthStack`)
	- Confirm the user's password from the CLI:
	- `aws cognito-idp admin-set-user-password --user-pool-id <ScrapbookUserPoolId> --username <username> --password "<new password>" --permanent`

To use your new scrapbook on AWS navigate to the `ScrapbookUrl` provided in `cfn-ui-outputs.json` file created during deployment. The UI will be served from an S3 bucket and the backend will be running on Lambda and API Gateway.


![Scrapbook Example](scrapbook-example.png)


## Contributions

Contributions to this project are not accepted as it is provided for demonstration purposes only.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.md) file for details.