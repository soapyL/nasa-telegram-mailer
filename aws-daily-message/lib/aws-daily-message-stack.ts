import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export class AwsDailyMessageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const telegramBotToken = StringParameter.fromStringParameterAttributes(
      this,
      "telegram-bot-token",
      { parameterName: "/daily-message/telegram-bot-token" }
    );

    const telegramChannelId = StringParameter.fromStringParameterAttributes(
      this,
      "telegram-channel-id",
      { parameterName: "/daily-message/telegram-channel-id" }
    );

    const nasaApiKey = StringParameter.fromStringParameterAttributes(
      this,
      "nasa-api-key",
      { parameterName: "/daily-message/nasa-api-key" }
    );

    const fn = new NodejsFunction(this, 'TextSenderLambda', {
      entry: 'src/retrieve-image.ts',
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TELEGRAM_BOT_TOKEN: telegramBotToken.stringValue,
        TELEGRAM_CHANNEL_ID: telegramChannelId.stringValue,
        NASA_API_KEY: nasaApiKey.stringValue,
      },
      timeout: cdk.Duration.seconds(10),
    });

    const url = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "url", {
      value: url.url,
    });

    new events.Rule(this, 'Rule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '10' }),
        targets: [new targets.LambdaFunction(fn)],
    });
  }
}
