"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "@emotion/styled";
import "./globals.css";

const Container = styled.div(() => ({
  maxWidth: 800,
  margin: "0 auto",
  fontFamily: "Work Sans",
}));

const NavBar = styled.div(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 0",
}));

const Initials = styled.div(() => ({
  textAlign: "left",
  fontWeight: "600",
  fontSize: 36,
}));

const LinkGroup = styled.nav(() => ({
  margin: "auto 0", // centers it vertically within NavBar
}));

const StyledLink = styled.a<{ $isActive: boolean }>(({ $isActive }) => ({
  marginLeft: 20,
  textDecoration: $isActive ? "underline" : "none",
  color: "inherit",
  fontWeight: "600",
}));

const SpacedLink = ({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: ReactNode;
}) => (
  <Link href={href} passHref legacyBehavior>
    <StyledLink $isActive={isActive}>{children}</StyledLink>
  </Link>
);

const Footer = styled.footer(() => ({
  marginTop: 20,
}));

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="A personal website template built with Next.js"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css?family=Work+Sans"
          rel="stylesheet"
        />
        <title>QSW</title>
      </head>
      <body>
        <Container>
          <NavBar>
            <Initials>Title</Initials>
            <LinkGroup>
              <SpacedLink href="/" isActive={pathname === "/"}>
                Home
              </SpacedLink>
              <SpacedLink href="/another" isActive={pathname === "/another"}>
                Another
              </SpacedLink>
            </LinkGroup>
          </NavBar>
          {children}
          <Footer>
            <p>Thanks for visiting!</p>
          </Footer>
        </Container>
      </body>
    </html>
  );
}
