import { Amplify } from "aws-amplify";
import { cognitoConfig } from "./cognito-config";

let configured = false;

/**
 * Configures the Amplify Auth client once per page load. Safe to call multiple times.
 */
export const configureAmplify = () => {
  if (configured || !cognitoConfig.userPoolId || !cognitoConfig.clientId) {
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoConfig.userPoolId,
        userPoolClientId: cognitoConfig.clientId,
      },
    },
  });
  configured = true;
};
