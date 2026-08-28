import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply",
  description: "Submit a resume for a role and see how it was read.",
  alternates: { canonical: "/apply" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
