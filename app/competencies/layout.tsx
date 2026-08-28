import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competencies",
  description: "What gets scored, and the standard each score is measured against.",
  alternates: { canonical: "/competencies" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
