import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The room",
  description: "Where an applicant waits, and where the interview happens.",
  alternates: { canonical: "/apply/room" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
