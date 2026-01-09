"use client";

import styled from "@emotion/styled";

const Section = styled.div(() => ({
  marginTop: 20,
}));

export default function Another() {
  return (
    <div>
      <h1>Another Page</h1>
      <Section>And this is another page</Section>
    </div>
  );
}
