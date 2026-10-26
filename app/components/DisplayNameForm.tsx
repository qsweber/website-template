"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useAuth } from "@qsweber/auth-kit";
import { useApiClient } from "../../lib/api/useApiClient";
import { getUser, updateUser, useUserId } from "../../lib/api/user";

const MAX_DISPLAY_NAME_LENGTH = 50;

const Section = styled.div(() => ({
  marginTop: 30,
  padding: 20,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
}));

const Form = styled.form(() => ({
  display: "flex",
  gap: 10,
  marginTop: 10,
}));

const Input = styled.input(() => ({
  flex: 1,
  padding: 10,
  fontSize: 16,
  border: "1px solid #ccc",
  borderRadius: 4,
}));

const Button = styled.button(() => ({
  padding: "10px 20px",
  fontSize: 16,
  fontWeight: "600",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#333",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
}));

const ErrorBox = styled.div(() => ({
  marginTop: 10,
  padding: 15,
  backgroundColor: "#fee",
  border: "1px solid #fcc",
  borderRadius: 5,
  color: "#c00",
}));

const SuccessMessage = styled.div(() => ({
  marginTop: 10,
  color: "#070",
}));

export const DisplayNameForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const apiClient = useApiClient();
  const userId = useUserId();

  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    getUser(apiClient, userId)
      .then((user) => setDisplayName(user.display_name))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile"),
      )
      .finally(() => setIsLoading(false));
  }, [apiClient, userId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      return;
    }

    setError(null);
    setSaved(false);
    setIsSaving(true);

    try {
      const user = await updateUser(apiClient, userId, {
        display_name: displayName,
      });
      setDisplayName(user.display_name);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Section>
      <h2>Display name</h2>
      <p>The name shown to you in the app. Leave it blank to clear it.</p>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          aria-label="Display name"
          value={displayName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDisplayName(event.target.value);
            setSaved(false);
          }}
          maxLength={MAX_DISPLAY_NAME_LENGTH}
          disabled={isLoading || isSaving}
          placeholder={isLoading ? "Loading..." : "Your name"}
        />
        <Button type="submit" disabled={isLoading || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Form>
      {saved && <SuccessMessage>Saved!</SuccessMessage>}
      {error && <ErrorBox>{error}</ErrorBox>}
    </Section>
  );
};
