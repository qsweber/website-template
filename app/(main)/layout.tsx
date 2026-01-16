"use client";

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { NavBar } from "../components/NavBar";
import { AuthProvider } from "../../lib/auth/AuthContext";

const Container = styled.div(() => ({
  maxWidth: 800,
  margin: "0 auto",
  fontFamily: "Work Sans",
}));

const Footer = styled.footer(() => ({
  marginTop: 20,
}));

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Container>
        <NavBar />
        {children}
        <Footer>
          <p>Thanks for visiting!</p>
        </Footer>
      </Container>
    </AuthProvider>
  );
}
