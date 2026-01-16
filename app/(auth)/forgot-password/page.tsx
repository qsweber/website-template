"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import Link from "next/link";
import { useAuth } from "../../../lib/auth/AuthContext";

const Container = styled.div(() => ({
  maxWidth: 400,
  margin: "40px auto",
  padding: "20px",
}));

const Title = styled.h1(() => ({
  textAlign: "center",
  marginBottom: 30,
}));

const Form = styled.form(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
}));

const FormGroup = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Label = styled.label(() => ({
  marginBottom: 5,
  fontWeight: "600",
}));

const Input = styled.input(() => ({
  padding: 10,
  fontSize: 16,
  border: "1px solid #ccc",
  borderRadius: 4,
}));

const Button = styled.button(() => ({
  padding: 12,
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

const ErrorMessage = styled.div(() => ({
  color: "red",
  textAlign: "center",
  marginBottom: 10,
}));

const SuccessMessage = styled.div(() => ({
  color: "green",
  textAlign: "center",
  marginBottom: 10,
}));

const LinkText = styled.p(() => ({
  textAlign: "center",
  marginTop: 20,
  "& a": {
    color: "#000",
    fontWeight: "600",
  },
}));

const WarningMessage = styled.div(() => ({
  backgroundColor: "#fff3cd",
  color: "#856404",
  padding: 15,
  borderRadius: 4,
  marginBottom: 20,
  border: "1px solid #ffeeba",
}));

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <Container>
        <WarningMessage>
          AWS Cognito is not configured. Please set up your Cognito User Pool
          and Client ID to enable authentication.
        </WarningMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Forgot Password</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <SuccessMessage>
          Password reset code sent! Redirecting to reset page...
        </SuccessMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || success}
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading || success}>
          {isLoading ? "Sending..." : "Send Reset Code"}
        </Button>
      </Form>
      <LinkText>
        Remember your password? <Link href="/login">Sign In</Link>
      </LinkText>
    </Container>
  );
}
