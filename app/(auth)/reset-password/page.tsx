"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const HelpText = styled.p(() => ({
  fontSize: 14,
  color: "#666",
  marginTop: 5,
}));

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isConfigured } = useAuth();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ email, code, newPassword });
      setSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
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
      <Title>Reset Password</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <SuccessMessage>
          Password reset successful! Redirecting to login...
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
        <FormGroup>
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={isLoading || success}
            placeholder="Enter code from email"
          />
          <HelpText>Check your email for the verification code</HelpText>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading || success}
            minLength={8}
          />
          <HelpText>Must be at least 8 characters</HelpText>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading || success}
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading || success}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </Form>
      <LinkText>
        Remember your password? <Link href="/login">Sign In</Link>
      </LinkText>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Container>Loading...</Container>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
