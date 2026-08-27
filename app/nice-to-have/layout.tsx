import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nice-to-Have Criteria",
  description: "Bonus signals that colour a case file but never disqualify anyone.",
  alternates: { canonical: "/nice-to-have" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
