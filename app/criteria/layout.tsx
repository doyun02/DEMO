import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requirements",
  description: "Hard gates a candidate must meet in full to be seatable.",
  alternates: { canonical: "/criteria" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
