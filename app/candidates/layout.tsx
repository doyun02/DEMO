import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidates",
  description: "Resume intake, the screening queue, and the AI screening run.",
  alternates: { canonical: "/candidates" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
