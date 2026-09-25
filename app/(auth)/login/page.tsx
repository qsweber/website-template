"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/auth/useAuth";
import {
  Container,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  SecondaryButton,
  Divider,
  ErrorMessage,
  LinkText,
  WarningMessage,
} from "../components/AuthFormComponents";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithPasskey, isConfigured } = useAuth();

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

  const handlePasskeySignIn = async () => {
    setError("");
    setIsPasskeyLoading(true);

    try {
      await signInWithPasskey(email);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "UserCancelledException") {
        // User dismissed the browser's passkey prompt - not an error.
        return;
      }
      setError(
        "Couldn't sign in with a passkey for that email. Try your password instead, or register a passkey first from the Protected page.",
      );
    } finally {
      setIsPasskeyLoading(false);
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            disabled={isLoading || isPasskeyLoading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            disabled={isLoading || isPasskeyLoading}
            minLength={8}
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading || isPasskeyLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <Divider>or</Divider>
      <SecondaryButton
        type="button"
        onClick={handlePasskeySignIn}
        disabled={!email || isLoading || isPasskeyLoading}
      >
        {isPasskeyLoading ? "Waiting for passkey..." : "Sign in with a passkey"}
      </SecondaryButton>
      <LinkText>
        <Link href="/forgot-password">Forgot password?</Link>
      </LinkText>
      <LinkText>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </LinkText>
    </Container>
  );
}
