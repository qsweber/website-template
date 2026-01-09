"use client";

import Link from "next/link";
import { Section } from "./components/Section";

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
