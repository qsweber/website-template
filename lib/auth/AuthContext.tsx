"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import type { AuthSession } from "aws-amplify/auth";
import {
  signIn as cognitoSignIn,
  signInWithPasskey as cognitoSignInWithPasskey,
  signUp as cognitoSignUp,
  signOut as cognitoSignOut,
  confirmSignUp as cognitoConfirmSignUp,
  getCurrentSession,
  getCurrentUser,
  resendConfirmationCode as cognitoResendCode,
  forgotPassword as cognitoForgotPassword,
  resetPassword as cognitoResetPassword,
  registerPasskey as cognitoRegisterPasskey,
  listPasskeys as cognitoListPasskeys,
  deletePasskey as cognitoDeletePasskey,
  SignInParams,
  SignUpParams,
  ConfirmSignUpParams,
  ForgotPasswordParams,
  ResetPasswordParams,
  PasskeyCredential,
} from "./cognito-service";
import { isCognitoConfigured } from "./cognito-config";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signInWithPasskey: (email: string) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => void;
  confirmSignUp: (params: ConfirmSignUpParams) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  forgotPassword: (params: ForgotPasswordParams) => Promise<void>;
  resetPassword: (params: ResetPasswordParams) => Promise<void>;
  registerPasskey: () => Promise<void>;
  listPasskeys: () => Promise<PasskeyCredential[]>;
  deletePasskey: (credentialId: string) => Promise<void>;
  getIdToken: () => string | null;
  getAccessToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isConfigured = isCognitoConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(isConfigured);

  const loadSession = useCallback(async () => {
    try {
      const currentSession = await getCurrentSession();
      if (currentSession) {
        setSession(currentSession);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load session on mount
  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    loadSession();
  }, [isConfigured, loadSession]);

  const signIn = async (params: SignInParams) => {
    const newSession = await cognitoSignIn(params);
    setSession(newSession);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const signInWithPasskey = async (email: string) => {
    const newSession = await cognitoSignInWithPasskey(email);
    setSession(newSession);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const signUp = async (params: SignUpParams) => {
    await cognitoSignUp(params);
    // Don't set session until email is confirmed
  };

  const signOut = () => {
    cognitoSignOut();
    setUser(null);
    setSession(null);
  };

  const confirmSignUp = async (params: ConfirmSignUpParams) => {
    await cognitoConfirmSignUp(params);
    // After confirmation, user needs to sign in
  };

  const resendConfirmationCode = async (email: string) => {
    await cognitoResendCode(email);
  };

  const forgotPassword = async (params: ForgotPasswordParams) => {
    await cognitoForgotPassword(params);
  };

  const resetPassword = async (params: ResetPasswordParams) => {
    await cognitoResetPassword(params);
  };

  const registerPasskey = async () => {
    await cognitoRegisterPasskey();
  };

  const listPasskeys = async () => {
    return cognitoListPasskeys();
  };

  const deletePasskey = async (credentialId: string) => {
    await cognitoDeletePasskey(credentialId);
  };

  const getIdToken = (): string | null => {
    return session?.tokens?.idToken?.toString() ?? null;
  };

  const getAccessToken = (): string | null => {
    return session?.tokens?.accessToken?.toString() ?? null;
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    isConfigured,
    signIn,
    signInWithPasskey,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    resetPassword,
    registerPasskey,
    listPasskeys,
    deletePasskey,
    getIdToken,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
