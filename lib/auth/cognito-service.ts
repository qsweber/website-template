/**
 * AWS Cognito Authentication Service, backed by AWS Amplify Auth.
 * Provides methods for user authentication, registration, and session management.
 */

import {
  signUp as amplifySignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode,
  resetPassword as amplifyResetPassword,
  confirmResetPassword,
  fetchAuthSession,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes,
  type AuthSession,
} from "aws-amplify/auth";
import { configureAmplify } from "./amplify-config";

configureAmplify();

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  code: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

/**
 * Sign up a new user
 */
export const signUp = async (params: SignUpParams): Promise<void> => {
  const { email, password, name } = params;

  await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        ...(name ? { name } : {}),
      },
    },
  });
};

/**
 * Confirm sign up with verification code
 */
export const confirmSignUp = async (
  params: ConfirmSignUpParams,
): Promise<void> => {
  const { email, code } = params;
  await amplifyConfirmSignUp({ username: email, confirmationCode: code });
};

/**
 * Sign in a user
 */
export const signIn = async (params: SignInParams): Promise<AuthSession> => {
  const { email, password } = params;

  const result = await amplifySignIn({ username: email, password });
  if (!result.isSignedIn) {
    throw new Error(`Sign in did not complete: ${result.nextStep.signInStep}`);
  }

  return fetchAuthSession();
};

/**
 * Sign out the current user
 */
export const signOut = (): void => {
  void amplifySignOut();
};

/**
 * Get the current user session, if any
 */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  try {
    const session = await fetchAuthSession();
    return session.tokens ? session : null;
  } catch {
    return null;
  }
};

/**
 * Get current user attributes
 */
export const getCurrentUser = async (): Promise<{ email: string } | null> => {
  try {
    await amplifyGetCurrentUser();
    const attributes = await fetchUserAttributes();
    return attributes.email ? { email: attributes.email } : null;
  } catch {
    return null;
  }
};

/**
 * Resend confirmation code
 */
export const resendConfirmationCode = async (email: string): Promise<void> => {
  await resendSignUpCode({ username: email });
};

/**
 * Initiate forgot password flow
 * Sends a verification code to the user's email
 */
export const forgotPassword = async (
  params: ForgotPasswordParams,
): Promise<string> => {
  const { email } = params;
  const output = await amplifyResetPassword({ username: email });
  return output.nextStep.codeDeliveryDetails?.destination ?? "";
};

/**
 * Reset password with verification code
 */
export const resetPassword = async (
  params: ResetPasswordParams,
): Promise<void> => {
  const { email, code, newPassword } = params;
  await confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  });
};
