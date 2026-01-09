"use client";

import Link from "next/link";
import styled from "@emotion/styled";

const Section = styled.div(() => ({
  marginTop: 20,
}));

export default function NotFound() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <Section>
        <Link href="/">Go to the home page</Link>
      </Section>
    </div>
  );
}
