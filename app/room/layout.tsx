import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Room",
  description: "The panel as it stands: who cleared the bar, and who is sitting down.",
  alternates: { canonical: "/room" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
