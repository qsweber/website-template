"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "../../../lib/auth/useAuth";
import { useApiClient } from "../../../lib/api/useApiClient";
import type { PasskeyCredential } from "../../../lib/auth/cognito-service";

const Title = styled.h1(() => ({
  marginBottom: 20,
}));

const Message = styled.p(() => ({
  fontSize: 18,
  marginBottom: 20,
}));

const LoadingMessage = styled.div(() => ({
  textAlign: "center",
  fontSize: 18,
  marginTop: 50,
}));

const Button = styled.button(() => ({
  padding: "10px 20px",
  fontSize: 16,
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  marginRight: 10,
  "&:hover": {
    backgroundColor: "#0051cc",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
}));

const ApiSection = styled.div(() => ({
  marginTop: 30,
  padding: 20,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
}));

const ResponseBox = styled.pre(() => ({
  marginTop: 10,
  padding: 15,
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: 5,
  overflow: "auto",
  fontSize: 14,
}));

const ErrorBox = styled.div(() => ({
  marginTop: 10,
  padding: 15,
  backgroundColor: "#fee",
  border: "1px solid #fcc",
  borderRadius: 5,
  color: "#c00",
}));

const PasskeyList = styled.ul(() => ({
  listStyle: "none",
  margin: "15px 0 0",
  padding: 0,
}));

const PasskeyItem = styled.li(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: 5,
  marginBottom: 10,
}));

const DeleteButton = styled.button(() => ({
  padding: "6px 12px",
  fontSize: 14,
  backgroundColor: "#fff",
  color: "#c00",
  border: "1px solid #c00",
  borderRadius: 5,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#fee",
  },
  "&:disabled": {
    color: "#ccc",
    borderColor: "#ccc",
    cursor: "not-allowed",
  },
}));

export default function ProtectedPage() {
  const {
    isAuthenticated,
    isLoading,
    user,
    registerPasskey,
    listPasskeys,
    deletePasskey,
  } = useAuth();
  const router = useRouter();
  const apiClient = useApiClient();

  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [deletingCredentialId, setDeletingCredentialId] = useState<
    string | null
  >(null);

  const refreshPasskeys = async () => {
    try {
      setPasskeys(await listPasskeys());
    } catch (error) {
      setPasskeyError(
        error instanceof Error ? error.message : "Failed to load passkeys",
      );
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshPasskeys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleRegisterPasskey = async () => {
    setPasskeyError(null);
    setIsRegisteringPasskey(true);

    try {
      await registerPasskey();
      await refreshPasskeys();
    } catch (error) {
      setPasskeyError(
        error instanceof Error ? error.message : "Failed to register passkey",
      );
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handleDeletePasskey = async (credentialId: string) => {
    setPasskeyError(null);
    setDeletingCredentialId(credentialId);

    try {
      await deletePasskey(credentialId);
      await refreshPasskeys();
    } catch (error) {
      setPasskeyError(
        error instanceof Error ? error.message : "Failed to delete passkey",
      );
    } finally {
      setDeletingCredentialId(null);
    }
  };

  const callApi = async () => {
    setIsLoadingApi(true);
    setApiError(null);
    setApiResponse(null);

    try {
      await apiClient.post("/record-click");
      setApiResponse("Click recorded successfully!");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoadingApi(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingMessage>Loading...</LoadingMessage>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Title>Protected Page</Title>
      <Message>
        Welcome, {user?.email}! This page is only accessible to authenticated
        users.
      </Message>
      <Message>
        This demonstrates how to protect routes in your application. The page
        automatically redirects to the login page if the user is not
        authenticated.
      </Message>
      <ApiSection>
        <h2>Authenticated API Call Example</h2>
        <p>
          Click the button below to record a click. Your Cognito ID token will
          be sent in the Authorization header.
        </p>
        <Button onClick={callApi} disabled={isLoadingApi}>
          {isLoadingApi ? "Loading..." : "Record Click"}
        </Button>

        {apiResponse && (
          <div>
            <h3>Success:</h3>
            <ResponseBox>{apiResponse}</ResponseBox>
          </div>
        )}

        {apiError && (
          <div>
            <h3>Error:</h3>
            <ErrorBox>{apiError}</ErrorBox>
          </div>
        )}
      </ApiSection>
      <ApiSection>
        <h2>Passkeys</h2>
        <p>
          Register a passkey to sign in without a password next time, using your
          device&apos;s fingerprint, face, or screen lock.
        </p>
        <Button onClick={handleRegisterPasskey} disabled={isRegisteringPasskey}>
          {isRegisteringPasskey
            ? "Waiting for passkey..."
            : "Register a passkey"}
        </Button>

        {passkeyError && <ErrorBox>{passkeyError}</ErrorBox>}

        {passkeys.length > 0 && (
          <PasskeyList>
            {passkeys.map((passkey) => (
              <PasskeyItem key={passkey.credentialId}>
                <span>
                  {passkey.friendlyName || "Passkey"}
                  {passkey.createdAt &&
                    ` — added ${passkey.createdAt.toLocaleDateString()}`}
                </span>
                <DeleteButton
                  onClick={() => handleDeletePasskey(passkey.credentialId)}
                  disabled={deletingCredentialId === passkey.credentialId}
                >
                  {deletingCredentialId === passkey.credentialId
                    ? "Removing..."
                    : "Remove"}
                </DeleteButton>
              </PasskeyItem>
            ))}
          </PasskeyList>
        )}
      </ApiSection>
    </div>
  );
}
