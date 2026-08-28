import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR sign in",
  description: "Sign in to the interview room, the standard, and the record.",
  alternates: { canonical: "/hr" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
