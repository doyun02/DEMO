"use client";

import { CriteriaEditor } from "@/components/CriteriaEditor";

export default function NiceToHavePage() {
  return (
    <CriteriaEditor
      kind="niceToHave"
      title="Nice-to-have criteria"
      subtitle="Bonus signals. They colour the case file and break ties — they never disqualify anyone."
      placeholder="e.g. Open-source contributions"
    />
  );
}
