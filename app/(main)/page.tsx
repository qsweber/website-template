"use client";

import { useEffect, useState } from "react";
import { Section } from "../components/Section";
import { useApiClient } from "../../lib/api/useApiClient";

export default function Home() {
  const apiClient = useApiClient();
  const [clickCount, setClickCount] = useState<number | null>(null);

  useEffect(() => {
    apiClient
      .publicGet<{ count: number }>("/click-count")
      .then((res) => setClickCount(res.count))
      .catch(() => setClickCount(null));
  }, [apiClient]);

  return (
    <div>
      <Section>Hello!</Section>
      <Section>This is a basic react template.</Section>
      <Section>
        Total clicks: {clickCount !== null ? clickCount : "..."}
      </Section>
    </div>
  );
}
