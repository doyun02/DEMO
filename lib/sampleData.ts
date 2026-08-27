import type { Candidate, Department } from "./types";

export const SAMPLE_DEPARTMENTS: Department[] = [
  {
    id: "dept_backend",
    name: "Backend Engineer",
    priorityCriteria: [
      { id: "pc_1", label: "3+ years of production backend experience" },
      { id: "pc_2", label: "Strong in at least one of Go, Java, Python, or Node.js" },
      { id: "pc_3", label: "Has designed or operated a relational database schema" },
    ],
    niceToHave: [
      { id: "nc_1", label: "Kubernetes / container orchestration experience" },
      { id: "nc_2", label: "Has led a migration or major refactor" },
      { id: "nc_3", label: "Open-source contributions" },
    ],
  },
  {
    id: "dept_design",
    name: "Product Designer",
    priorityCriteria: [
      { id: "pc_4", label: "Portfolio includes at least one shipped end-to-end product" },
      { id: "pc_5", label: "Comfortable working directly with engineers on implementation" },
    ],
    niceToHave: [{ id: "nc_4", label: "Motion or interaction design experience" }],
  },
];

export const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: "cand_sample_1",
    name: "Han Jiwoo",
    departmentId: "dept_backend",
    submittedAt: new Date().toISOString(),
    resumeText: `Backend engineer, 6 years. Led the payments service rewrite at a
mid-size fintech (Go, PostgreSQL, ~4k RPS peak). Designed the ledger schema and
ran the zero-downtime migration off the legacy MySQL cluster. Runs the service
on Kubernetes; wrote the team's Helm chart conventions. Occasional contributor
to an open-source Go SQL migration tool.`,
  },
  {
    id: "cand_sample_2",
    name: "Marta Oyelaran",
    departmentId: "dept_backend",
    submittedAt: new Date().toISOString(),
    resumeText: `4 years backend, Python/Django then Node.js. Built and owns the
notification pipeline (SQS + Lambda) at a logistics startup. Comfortable in
Postgres — normalized the order schema after an incident caused by duplicated
address rows. No container orchestration experience; deploys are on ECS handled
by the platform team.`,
  },
  {
    id: "cand_sample_3",
    name: "Devin Park",
    departmentId: "dept_backend",
    submittedAt: new Date().toISOString(),
    resumeText: `Bootcamp graduate, 10 months at a two-person startup. Shipped a
React frontend and a small Express API backed by MongoDB. Very fast learner,
strong references. Has not worked with a relational database in production.`,
  },
];
