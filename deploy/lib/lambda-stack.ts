import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';

const CDK_LOCAL = process.env.CDK_LOCAL;

interface Props {}

export class LambdaStack extends core.Stack {
  constructor(scope: core.App, id: string, props: Props) {
    super(scope, id);

    const bootstrapLocation = `${__dirname}/../../target/cdk/release`;

    const entryId = 'main';
    const entryFnName = `${id}-${entryId}`;
    const entry = new lambda.Function(this, entryId, {
      functionName: entryFnName,
      description: 'rust-lambda',
      runtime: lambda.Runtime.PROVIDED_AL2,
      handler: id,
      code: CDK_LOCAL !== 'true'
        ? lambda.Code.fromAsset(bootstrapLocation)
        : lambda.Code.fromBucket(s3.Bucket.fromBucketName(this, 'LocalBucket', '__local__'), bootstrapLocation),
      memorySize: 256,
      timeout: core.Duration.seconds(10),
      tracing: lambda.Tracing.ACTIVE,
    });

    entry.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1');

    core.Aspects.of(entry).add(new core.Tag('service-type', 'API'));
    core.Aspects.of(entry).add(new core.Tag('billing', `lambda-${entryFnName}`));
  }
}
