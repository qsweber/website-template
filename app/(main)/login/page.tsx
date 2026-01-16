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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn({ email, password });
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("User is not confirmed")) {
          setError("Please verify your email before logging in.");
          router.push(`/confirm?email=${encodeURIComponent(email)}`);
        } else {
          setError(
            err.message || "Failed to sign in. Please check your credentials.",
          );
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <Container>
        <Title>Login</Title>
        <WarningMessage>
          <strong>AWS Cognito is not configured.</strong>
          <p>
            Please set up the required environment variables
            (NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID)
            and redeploy the application.
          </p>
        </WarningMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Login</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <LinkText>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </LinkText>
    </Container>
  );
}
