"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "@emotion/styled";

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

export function NavBar() {
  const pathname = usePathname();

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
      </LinkGroup>
    </NavBarWrapper>
  );
}
