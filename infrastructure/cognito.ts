import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const bucketNameAndUrl = config.require("bucket");
const sesFromEmail = config.require("sesFromEmail");
const sesEmailIdentityArn = config.require("sesEmailIdentityArn");

// Create Cognito User Pool for authentication
const userPool = new aws.cognito.UserPool(`${bucketNameAndUrl}-user-pool`, {
  name: `${bucketNameAndUrl}-user-pool`,
  autoVerifiedAttributes: ["email"],
  usernameAttributes: ["email"],
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true,
    temporaryPasswordValidityDays: 7,
  },
  emailConfiguration: {
    emailSendingAccount: "DEVELOPER",
    fromEmailAddress: sesFromEmail,
    sourceArn: sesEmailIdentityArn,
  },
  verificationMessageTemplate: {
    defaultEmailOption: "CONFIRM_WITH_CODE",
    emailMessage: "Your verification code is {####}",
    emailSubject: `Verify your email with ${bucketNameAndUrl}`,
  },
  accountRecoverySetting: {
    recoveryMechanisms: [
      {
        name: "verified_email",
        priority: 1,
      },
    ],
  },
});

// Create Cognito User Pool Client
const userPoolClient = new aws.cognito.UserPoolClient(
  `${bucketNameAndUrl}-user-pool-client`,
  {
    name: `${bucketNameAndUrl}-user-pool-client`,
    userPoolId: userPool.id,
    generateSecret: false,
    explicitAuthFlows: [
      "ALLOW_REFRESH_TOKEN_AUTH",
      "ALLOW_USER_PASSWORD_AUTH",
      "ALLOW_USER_SRP_AUTH",
    ],
    preventUserExistenceErrors: "ENABLED",
    enableTokenRevocation: true,
    authSessionValidity: 3,
    accessTokenValidity: 60,
    idTokenValidity: 60,
    refreshTokenValidity: 30,
    tokenValidityUnits: {
      accessToken: "minutes",
      idToken: "minutes",
      refreshToken: "days",
    },
    readAttributes: ["email", "email_verified", "name"],
    writeAttributes: ["email", "name"],
  },
);

export { userPool, userPoolClient };
