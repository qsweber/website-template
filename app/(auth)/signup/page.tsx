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

const PasswordRequirements = styled.div(() => ({
  fontSize: 14,
  color: "#666",
  marginTop: 5,
  "& ul": {
    margin: 0,
    paddingLeft: 20,
  },
}));

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp, isConfigured } = useAuth();

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password requirements
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({ email, password, name });
      setSuccess(true);
      setTimeout(() => {
        router.push(`/confirm?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to sign up. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <Container>
        <Title>Sign Up</Title>
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
      <Title>Sign Up</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <SuccessMessage>
          Account created successfully! Please check your email for a
          verification code.
        </SuccessMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || success}
          />
        </FormGroup>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading || success}
            minLength={8}
          />
          <PasswordRequirements>
            Password must contain:
            <ul>
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </PasswordRequirements>
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
            minLength={8}
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading || success}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </Form>
      <LinkText>
        Already have an account? <Link href="/login">Login</Link>
      </LinkText>
    </Container>
  );
}
