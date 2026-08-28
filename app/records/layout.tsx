import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Records",
  description: "The full audit trail: every candidate screened, scored, and accounted for.",
  alternates: { canonical: "/records" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
