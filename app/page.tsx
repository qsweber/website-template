"use client";

import styled from "@emotion/styled";

const Section = styled.div(() => ({
  marginTop: 20,
}));

export default function Home() {
  return (
    <div>
      <h1>Hello!</h1>
      <Section>This is a basic react template.</Section>
    </div>
  );
}
