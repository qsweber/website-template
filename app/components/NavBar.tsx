"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "../../lib/auth/AuthContext";

const NavBarWrapper = styled.div(() => ({
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
  display: "flex",
  alignItems: "center",
}));

const StyledLink = styled.a<{ $isActive: boolean }>(({ $isActive }) => ({
  marginLeft: 20,
  textDecoration: $isActive ? "underline" : "none",
  color: "inherit",
  fontWeight: "600",
  cursor: "pointer",
}));

const StyledButton = styled.button(() => ({
  marginLeft: 20,
  textDecoration: "none",
  color: "inherit",
  fontWeight: "600",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontSize: "inherit",
  fontFamily: "inherit",
  padding: 0,
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

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, signOut, isLoading } = useAuth();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <NavBarWrapper>
      <Initials>Title</Initials>
      <LinkGroup>
        <SpacedLink href="/" isActive={pathname === "/"}>
          Home
        </SpacedLink>
        <SpacedLink href="/another" isActive={pathname === "/another/"}>
          Another
        </SpacedLink>
        {!isLoading && (
          <>
            {isAuthenticated && user ? (
              <>
                <span style={{ marginLeft: 20, fontWeight: "600" }}>
                  {user.email}
                </span>
                <StyledButton onClick={handleLogout}>Logout</StyledButton>
              </>
            ) : (
              <SpacedLink href="/login" isActive={pathname === "/login/"}>
                Login
              </SpacedLink>
            )}
          </>
        )}
      </LinkGroup>
    </NavBarWrapper>
  );
}
