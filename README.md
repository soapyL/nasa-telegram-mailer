# nasa-telegram-mailer
Simple AWS CDK script for sending a Telegram message everyday with the NASA image of the day

<code>npm install</code> to install node modules

Add AWS details into <code>~/.aws/config</code>

Add the env params into your AWS Lambda config, including your telegram bot token, channel id and your NASA api key

Run <code>npx cdk bootstrap</code> then <code>npx cdk deploy</code> and enjoy :)
