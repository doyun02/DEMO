import type { DepartmentSpec } from "./build";

/**
 * Three departments, ten resumes each. The point of the set is that the same
 * candidate pool would not produce the same room twice: each department's own
 * requirements decide who is even eligible, and only then does the weighted
 * competency score decide who sits down. Two of the strongest candidates in the
 * set never make a room, because a high score does not survive a missed
 * requirement.
 *
 * Competencies come from the imported role library rather than being written
 * here, so the sample is held to the same standard a real department would use.
 * The library has no product-design role, so that department borrows the product
 * manager set — user insight, prioritisation, execution and measurement read
 * across well enough, and the four general competencies are shared by every role.
 */
export const SAMPLE_DEPARTMENTS: DepartmentSpec[] = [
  {
    id: "dept_backend",
    name: "Backend Engineer",
    requirements: [
      "3+ years of production backend experience",
      "Strong in at least one of Go, Java, Python, or Node.js",
      "Has designed or operated a relational database schema",
    ],
    roleSlug: "development",
    candidates: [
      {
        name: "Han Jiwoo",
        resume: `Backend engineer, 6 years. Led the payments service rewrite at a mid-size
fintech (Go, PostgreSQL, ~4k RPS peak). Designed the ledger schema and ran the
zero-downtime migration off the legacy MySQL cluster. Runs the service on
Kubernetes; wrote the team's Helm chart conventions. Occasional contributor to
an open-source Go SQL migration tool.`,
        score: 9,
        summary:
          "Six years of production backend work with end-to-end ownership of a payments service, including the schema design and the migration off the legacy cluster.",
        strengths: [
          "Owned the payments rewrite in Go, not just a slice of it",
          "Designed the ledger schema and ran a zero-downtime migration",
          "Operates the service themselves — wrote the team's Helm conventions",
        ],
        concerns: ["Single-domain depth; no evidence of work outside payments"],
        requirements: [
          [true, "Six years, most recently four at a fintech on a live payments service."],
          [true, "Go throughout the payments rewrite, at production scale."],
          [true, "Designed the ledger schema in PostgreSQL and migrated it off MySQL."],
        ],
        tags: [
          { label: "Kubernetes / container orchestration", status: "demonstrated" },
          { label: "Led a migration or major refactor", status: "demonstrated" },
          { label: "Open-source contributions", status: "demonstrated" },
        ],
      },
      {
        name: "Priya Raghunathan",
        resume: `5 years backend, Java/Spring. Owns the order fulfilment service at a retail
platform — 300k orders/day. Rebuilt the inventory tables after a double-booking
incident; wrote the reconciliation job that still runs nightly. Deploys to EKS
but the platform team owns the cluster.`,
        score: 8,
        summary:
          "Five years in Java on a high-volume fulfilment service, with a schema redesign driven by a real production incident.",
        strengths: [
          "Owns a service at genuine volume — 300k orders a day",
          "Redesigned the inventory schema in response to a concrete failure",
        ],
        concerns: ["Deploys to Kubernetes but has not operated a cluster"],
        requirements: [
          [true, "Five years, all on production services at a retail platform."],
          [true, "Java and Spring across the whole fulfilment service."],
          [true, "Rebuilt the inventory tables after the double-booking incident."],
        ],
        tags: [
          { label: "Led a migration or major refactor", status: "demonstrated" },
        ],
      },
      {
        name: "Marta Oyelaran",
        resume: `4 years backend, Python/Django then Node.js. Built and owns the notification
pipeline (SQS + Lambda) at a logistics startup. Normalised the order schema
after an incident caused by duplicated address rows. Deploys on ECS, handled by
the platform team. Speaks at the local Python meetup.`,
        score: 8,
        summary:
          "Four years across Python and Node, owning a notification pipeline end to end and fixing a data-modelling problem that had already caused an incident.",
        strengths: [
          "Owns the notification pipeline outright",
          "Normalised the order schema after a duplication incident",
        ],
        concerns: [
          "No container orchestration experience — deploys are handled elsewhere",
          "Pipeline work is narrower than full service ownership",
        ],
        requirements: [
          [true, "Four years across two production stacks."],
          [true, "Python and Django, then Node.js on the current pipeline."],
          [true, "Normalised the order schema; cites the address-duplication incident."],
        ],
        tags: [],
      },
      {
        name: "Tobias Lindqvist",
        resume: `7 years, mostly Java on internal banking systems. Deep on transaction
correctness and Oracle schema design. Recently moved a batch settlement job to
a streaming model. Little exposure to cloud-native tooling; the bank runs on
managed VMs.`,
        score: 7,
        summary:
          "Seven years of correctness-critical banking backend work with strong relational modelling, in an environment that has not pushed them toward modern deployment tooling.",
        strengths: [
          "Unusually strong on transaction correctness",
          "Converted a batch settlement job to streaming",
        ],
        concerns: ["No cloud-native or container experience at all"],
        requirements: [
          [true, "Seven years on production banking systems."],
          [true, "Java throughout."],
          [true, "Oracle schema design is the core of the role described."],
        ],
        tags: [
          { label: "Led a migration or major refactor", status: "demonstrated" },
        ],
      },
      {
        name: "Chen Wei",
        resume: `4 years, Go and Python. Platform team at a gaming company — built the internal
service scaffolding CLI and the shared Postgres access layer. Runs the staging
Kubernetes cluster. Has not owned a user-facing service.`,
        score: 7,
        summary:
          "Four years of platform-side backend work: strong tooling and infrastructure instincts, though the work has been internal rather than user-facing.",
        strengths: [
          "Built the shared Postgres access layer other teams depend on",
          "Runs the staging Kubernetes cluster",
        ],
        concerns: ["Has never owned a user-facing service"],
        requirements: [
          [true, "Four years on the platform team."],
          [true, "Go and Python, both in production tooling."],
          [true, "Built and maintains the shared Postgres access layer."],
        ],
        tags: [
          { label: "Kubernetes / container orchestration", status: "demonstrated" },
          { label: "Open-source contributions", status: "demonstrated" },
        ],
      },
      {
        name: "Amara Nwosu",
        resume: `3 years, Node.js at a healthtech startup. Built the appointments API and its
Postgres schema from scratch. Small team, so also handles on-call. Refactored
the booking logic out of the monolith last year.`,
        score: 6,
        summary:
          "Three years at a small healthtech company, with genuine from-scratch ownership of an API and its schema — the experience is real but thin.",
        strengths: [
          "Designed the appointments schema from scratch",
          "Pulled booking logic out of the monolith",
        ],
        concerns: ["Only three years, all at one small company", "No scale evidence"],
        requirements: [
          [true, "Three years, which meets the bar exactly."],
          [true, "Node.js throughout."],
          [true, "Built the appointments Postgres schema from scratch."],
        ],
        tags: [
          { label: "Led a migration or major refactor", status: "demonstrated" },
        ],
      },
      {
        name: "Kenji Watanabe",
        resume: `8 years backend, almost entirely Ruby on Rails. Principal engineer at a
marketplace; owns the seller payouts domain and its Postgres schema. Led the
extraction of payouts into its own service. Has read Go but never shipped it.`,
        score: 7,
        summary:
          "Eight years of deep Rails experience with real ownership of a payouts domain — strong on every axis except the specific languages this role requires.",
        strengths: [
          "Principal-level ownership of a payouts domain",
          "Led a service extraction end to end",
        ],
        concerns: ["Ruby only — has not shipped any of the four required languages"],
        requirements: [
          [true, "Eight years, currently principal engineer."],
          [
            false,
            "Ruby on Rails throughout. States they have read Go but never shipped it — none of the four languages are evidenced.",
          ],
          [true, "Owns the seller payouts Postgres schema."],
        ],
        tags: [
          { label: "Led a migration or major refactor", status: "demonstrated" },
          { label: "Go", status: "claimed" },
        ],
      },
      {
        name: "Rafael Duarte",
        resume: `5 years, Python. Data-adjacent backend at an adtech firm — Airflow pipelines,
BigQuery, some FastAPI services. The warehouse team owns all schema design; he
consumes their tables rather than modelling them.`,
        score: 6,
        summary:
          "Five years of Python in a data-adjacent role. The service work is real, but schema design has always belonged to another team.",
        strengths: ["Five years of production Python", "Comfortable across pipelines and services"],
        concerns: ["Has consumed schemas, never designed or operated one"],
        requirements: [
          [true, "Five years at an adtech firm."],
          [true, "Python across Airflow and FastAPI."],
          [
            false,
            "Explicitly states the warehouse team owns schema design; no modelling work of their own is shown.",
          ],
        ],
        tags: [
          { label: "Relational schema design", status: "claimed" },
        ],
      },
      {
        name: "Devin Park",
        resume: `Bootcamp graduate, 10 months at a two-person startup. Shipped a React frontend
and a small Express API backed by MongoDB. Very fast learner, strong references.`,
        score: 4,
        summary:
          "Ten months of experience at a two-person startup. Promising, but short of every experience bar this role sets.",
        strengths: ["Shipped a working product end to end despite minimal support"],
        concerns: ["Under a year of experience", "No relational database work at all"],
        requirements: [
          [false, "Ten months against a three-year bar."],
          [true, "Express means Node.js, shipped in production."],
          [false, "MongoDB only; no relational schema work shown."],
        ],
        tags: [
          { label: "Relational databases", status: "contradicted" },
        ],
      },
      {
        name: "Sofia Almeida",
        resume: `2 years as a QA automation engineer moving into backend. Writes Python test
harnesses against the team's services; contributed two small endpoints. Knows
the Postgres schema well from writing fixtures against it.`,
        score: 4,
        summary:
          "Two years in QA automation with early backend contributions. Real familiarity with the codebase, but not yet ownership of production work.",
        strengths: ["Deep familiarity with the service surface from testing it"],
        concerns: ["Two years, and mostly test-side", "Two endpoints is not production ownership"],
        requirements: [
          [false, "Two years, and the backend portion is a small share of that."],
          [true, "Python across the test harnesses and the two endpoints."],
          [
            false,
            "Reads and writes fixtures against the schema, but has not designed or operated one.",
          ],
        ],
        tags: [],
      },
    ],
  },

  {
    id: "dept_design",
    name: "Product Designer",
    requirements: [
      "Portfolio includes at least one shipped end-to-end product",
      "Works directly with engineers through implementation",
      "Can show research that changed a design decision",
    ],
    roleSlug: "product-manager",
    candidates: [
      {
        name: "Noor Haddad",
        resume: `6 years product design. Took the merchant onboarding flow at a payments company
from research through launch; sat in the engineers' standup for the whole build.
Ran 14 interviews that killed the original single-page concept — the shipped
flow is stepped because of what they found. Owns the company's design system.`,
        score: 9,
        summary:
          "Six years with a fully documented end-to-end case: research that overturned the original concept, then implementation alongside the engineers who built it.",
        strengths: [
          "Research demonstrably changed the shipped design, not just decorated it",
          "Embedded with engineering through the whole build",
          "Owns the design system",
        ],
        concerns: [],
        requirements: [
          [true, "Merchant onboarding, research through launch."],
          [true, "Sat in the engineering standup for the duration of the build."],
          [true, "14 interviews killed the single-page concept; the stepped flow is the result."],
        ],
        tags: [
          { label: "Owned a design system", status: "demonstrated" },
          { label: "Writes clearly about the work", status: "demonstrated" },
        ],
      },
      {
        name: "Yuna Seo",
        resume: `5 years, consumer apps. Designed and shipped the reading-streak feature at a
language app — 2M MAU. Paired with two engineers through implementation, kept
the Figma in sync with what actually shipped. Diary study showed streaks caused
churn in lapsed users, so shipped a forgiving version.`,
        score: 8,
        summary:
          "Five years in consumer product with a shipped feature at scale and a diary study that visibly softened the final design.",
        strengths: [
          "Shipped at 2M MAU scale",
          "Diary study directly produced the forgiving streak model",
        ],
        concerns: ["Feature-level ownership rather than a whole product surface"],
        requirements: [
          [true, "Reading-streak feature, designed and shipped."],
          [true, "Paired with two engineers through implementation."],
          [true, "Diary study on lapsed users changed the streak rules."],
        ],
        tags: [
          { label: "Motion or interaction design", status: "demonstrated" },
        ],
      },
      {
        name: "Elias Brandt",
        resume: `7 years, B2B SaaS. Redesigned an analytics dashboard used by 400 enterprise
customers; ran it as a staged rollout with the frontend lead. Usability testing
found people misread the date-range control, which was rebuilt before launch.
Writes the team's design rationale docs.`,
        score: 8,
        summary:
          "Seven years in B2B with an enterprise dashboard redesign shipped as a staged rollout, and a usability finding that forced a control to be rebuilt.",
        strengths: [
          "Shipped a redesign against a demanding enterprise install base",
          "Usability testing caught and fixed a real comprehension failure",
        ],
        concerns: ["All B2B; no consumer-scale work"],
        requirements: [
          [true, "Analytics dashboard redesign, shipped to 400 customers."],
          [true, "Ran the staged rollout jointly with the frontend lead."],
          [true, "Date-range control was rebuilt on the strength of usability testing."],
        ],
        tags: [
          { label: "Owned a design system", status: "demonstrated" },
          { label: "Writes clearly about the work", status: "demonstrated" },
        ],
      },
      {
        name: "Gabriel Okonkwo",
        resume: `4 years. Designed the driver-facing app at a delivery startup, start to finish.
Rode along with drivers for a week; the shift-handover screen exists because of
what he saw. Worked shoulder to shoulder with two mobile engineers.`,
        score: 7,
        summary:
          "Four years with a strong field-research story: observation of real drivers produced a screen that was not in the original scope.",
        strengths: [
          "Field research produced a screen nobody had specified",
          "Close working relationship with the mobile engineers",
        ],
        concerns: ["Only one product in the portfolio", "Four years is on the light side"],
        requirements: [
          [true, "Driver-facing app, start to finish."],
          [true, "Worked directly with two mobile engineers."],
          [true, "The ride-along week produced the shift-handover screen."],
        ],
        tags: [
          { label: "Motion or interaction design", status: "demonstrated" },
        ],
      },
      {
        name: "Ingrid Vasquez",
        resume: `5 years, mostly agency. Shipped a booking product for a hotel group and stayed
through two months of implementation support. Card-sort study reorganised the
room-type taxonomy. Agency work means less long-term ownership after launch.`,
        score: 6,
        summary:
          "Five years of agency work with one genuinely shipped product and a card-sort study that reorganised its core taxonomy.",
        strengths: ["Stayed through implementation rather than handing off at launch"],
        concerns: ["Agency pattern — little post-launch ownership or iteration"],
        requirements: [
          [true, "Hotel booking product, shipped."],
          [true, "Two months of implementation support alongside the build team."],
          [true, "Card-sort study reorganised the room-type taxonomy."],
        ],
        tags: [
          { label: "Writes clearly about the work", status: "demonstrated" },
        ],
      },
      {
        name: "Theo Mensah",
        resume: `4 years in-house at a health insurer. Redesigned the claims submission flow;
worked with the engineering team throughout. Ran a small moderated study that
changed the document-upload step. Regulated environment, so shipping was slow —
two products in four years.`,
        score: 6,
        summary:
          "Four years in a regulated environment with a shipped claims flow and a moderated study behind one of its steps; output volume is low by circumstance.",
        strengths: ["Shipped inside a regulated constraint set", "Study changed the upload step"],
        concerns: ["Only two shipped products in four years"],
        requirements: [
          [true, "Claims submission flow, redesigned and shipped."],
          [true, "Worked with the engineering team throughout."],
          [true, "Moderated study changed the document-upload step."],
        ],
        tags: [],
      },
      {
        name: "Riya Kapoor",
        resume: `6 years, strong visual portfolio. Led brand and marketing site work at two
startups, plus the app's visual refresh. Ships closely with engineers and
reviews every PR's implementation. Research is handled by a dedicated team;
she works from their summaries.`,
        score: 7,
        summary:
          "Six years with a strong visual craft and unusually close engineering collaboration, but the research half of the role has always belonged to somebody else.",
        strengths: ["Reviews implementation PRs — rare and useful", "Strong visual craft"],
        concerns: ["Has never run research herself"],
        requirements: [
          [true, "App visual refresh and two marketing sites, all shipped."],
          [true, "Reviews every implementation PR alongside the engineers."],
          [
            false,
            "Works from another team's research summaries; no decision of her own is traced to research she ran.",
          ],
        ],
        tags: [
          { label: "Motion or interaction design", status: "demonstrated" },
          { label: "Owned a design system", status: "demonstrated" },
          { label: "User research", status: "claimed" },
        ],
      },
      {
        name: "Anaïs Perrot",
        resume: `5 years as a design researcher moving into product design. Deep interview and
synthesis practice; her segmentation study reshaped a whole roadmap. Has
contributed screens to two products but has not owned one through to launch.`,
        score: 6,
        summary:
          "Five years of genuinely strong research practice, moving toward product design without yet having carried a product to launch.",
        strengths: ["Segmentation study reshaped a roadmap", "Rigorous synthesis practice"],
        concerns: ["No product owned end to end"],
        requirements: [
          [
            false,
            "Contributed screens to two products; states she has not owned one through to launch.",
          ],
          [true, "Worked alongside engineering on both contributions."],
          [true, "The segmentation study reshaped the roadmap — research changing decisions is her core strength."],
        ],
        tags: [
          { label: "Writes clearly about the work", status: "demonstrated" },
          { label: "Shipping end to end", status: "claimed" },
        ],
      },
      {
        name: "Milo Fontaine",
        resume: `3 years at a design studio. Beautiful concept work, several award submissions.
Hands off high-fidelity Figma files to client engineering teams and moves to the
next project. One shipped product, a small e-commerce site.`,
        score: 5,
        summary:
          "Three years of polished concept work with one shipped product, in a hand-off model that never reaches implementation.",
        strengths: ["Exceptional visual polish"],
        concerns: ["Hand-off model — no implementation involvement", "Little evidence of research"],
        requirements: [
          [true, "One shipped e-commerce site."],
          [
            false,
            "Hands off Figma files and moves on; no involvement past the hand-off is described.",
          ],
          [false, "No research of any kind appears in the resume."],
        ],
        tags: [
          { label: "Motion or interaction design", status: "demonstrated" },
          { label: "Implementation collaboration", status: "contradicted" },
        ],
      },
      {
        name: "Dae-ho Lim",
        resume: `2 years, junior designer at a startup that folded before launch. Strong Figma
skills and a thoughtful portfolio of unshipped concepts. Eager, well-reviewed by
former leads.`,
        score: 4,
        summary:
          "Two years of junior work at a company that closed before shipping. The craft is developing; the evidence base is not there yet.",
        strengths: ["Thoughtful portfolio despite nothing reaching launch"],
        concerns: ["Nothing shipped", "Two years, all junior"],
        requirements: [
          [false, "The startup folded before launch; nothing in the portfolio shipped."],
          [false, "No implementation collaboration is described."],
          [false, "No research is described."],
        ],
        tags: [],
      },
    ],
  },

  {
    id: "dept_data",
    name: "Data Analyst",
    requirements: [
      "2+ years turning data into decisions someone acted on",
      "Fluent in SQL against a production warehouse",
      "Has built and maintained a metric or dashboard others rely on",
    ],
    roleSlug: "data-analyst",
    candidates: [
      {
        name: "Zainab Farouk",
        resume: `5 years analytics at a subscription business. Owns the retention dashboard the
exec team reads every Monday. Her cohort analysis of the annual plan led to the
pricing change that shipped last year. SQL against Snowflake daily; Python for
the heavier cohort work. Runs the company's experiment review.`,
        score: 9,
        summary:
          "Five years with a dashboard the executive team actually uses and a cohort analysis that produced a shipped pricing change.",
        strengths: [
          "Her analysis led directly to a pricing change",
          "Owns a dashboard with a standing executive audience",
          "Runs the experiment review",
        ],
        concerns: [],
        requirements: [
          [true, "Five years, with the pricing change as a traceable decision."],
          [true, "Daily SQL against Snowflake."],
          [true, "Owns the retention dashboard the exec team reads weekly."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
          { label: "Experiment or A/B test design", status: "demonstrated" },
          { label: "Presents well to non-analysts", status: "demonstrated" },
        ],
      },
      {
        name: "Meera Pillai",
        resume: `4 years, marketplace analytics. Built the supply-health metric now used to
trigger driver incentives in each city. SQL on BigQuery all day; some Python.
Her analysis of cancelled trips changed how the incentive threshold is set.`,
        score: 8,
        summary:
          "Four years in marketplace analytics, owning a metric that automatically triggers operational spend — about as concrete as decision impact gets.",
        strengths: [
          "Built a metric that triggers real spending decisions",
          "Cancelled-trip analysis changed the incentive threshold",
        ],
        concerns: ["Single-domain; all marketplace work"],
        requirements: [
          [true, "Four years, with the incentive threshold change as the clearest example."],
          [true, "BigQuery daily."],
          [true, "Built and maintains the supply-health metric."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
        ],
      },
      {
        name: "Oscar Lindgren",
        resume: `6 years, retail analytics. Runs the weekly trading report the buying team plans
against. Rebuilt the stock-cover metric after the old one misled a season's
buying. Strong SQL (Redshift), Excel-heavy, limited Python.`,
        score: 8,
        summary:
          "Six years of retail analytics with a weekly report that drives buying decisions and a metric rebuild prompted by a costly error.",
        strengths: [
          "The trading report is planned against every week",
          "Rebuilt the stock-cover metric after it misled a season",
        ],
        concerns: ["Limited Python; the workflow leans on Excel"],
        requirements: [
          [true, "Six years; the buying team plans against his report."],
          [true, "Strong SQL against Redshift."],
          [true, "Owns the trading report and the rebuilt stock-cover metric."],
        ],
        tags: [
          { label: "Presents well to non-analysts", status: "demonstrated" },
        ],
      },
      {
        name: "Jonas Weber",
        resume: `3 years at a SaaS company. Built the activation funnel dashboard used by the
growth team. SQL against Postgres replicas and a small dbt project. Ran two A/B
tests on the onboarding email sequence; one shipped.`,
        score: 7,
        summary:
          "Three years with a growth-team dashboard and two experiments, one of which shipped — solid, if not yet deep.",
        strengths: ["Activation dashboard is in weekly use", "Has designed and run experiments"],
        concerns: ["Warehouse is a Postgres replica rather than a real warehouse at scale"],
        requirements: [
          [true, "Three years; the shipped email sequence is the clearest decision."],
          [true, "SQL against Postgres replicas with dbt on top."],
          [true, "Built and maintains the activation funnel dashboard."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
          { label: "Experiment or A/B test design", status: "demonstrated" },
        ],
      },
      {
        name: "Camila Rojas",
        resume: `4 years in healthcare analytics. Maintains the clinic-utilisation dashboard for
eight sites. Her wait-time analysis changed how appointment slots are blocked.
SQL on a Snowflake warehouse; R for the statistical work. Presents monthly to
clinical leads.`,
        score: 7,
        summary:
          "Four years in a clinical setting, with an analysis that changed scheduling policy and a standing monthly audience of non-analysts.",
        strengths: [
          "Wait-time analysis changed appointment blocking",
          "Presents monthly to clinical leads",
        ],
        concerns: ["Domain is narrow and heavily regulated"],
        requirements: [
          [true, "Four years; the appointment blocking change is the traceable decision."],
          [true, "Snowflake daily."],
          [true, "Maintains the clinic-utilisation dashboard across eight sites."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
          { label: "Presents well to non-analysts", status: "demonstrated" },
        ],
      },
      {
        name: "Ade Balogun",
        resume: `2 years at a fintech. Owns the fraud-review queue dashboard the ops team works
from. SQL against the Snowflake warehouse. Suggested the threshold change that
cut manual review volume by a fifth.`,
        score: 6,
        summary:
          "Two years, but with real ownership of an operational dashboard and a threshold change that measurably cut review volume.",
        strengths: ["Threshold change cut manual review by a fifth"],
        concerns: ["Two years exactly — meets the bar without clearing it"],
        requirements: [
          [true, "Two years; the threshold change was acted on."],
          [true, "SQL against Snowflake."],
          [true, "Owns the fraud-review queue dashboard the ops team works from."],
        ],
        tags: [
          { label: "Experiment or A/B test design", status: "demonstrated" },
        ],
      },
      {
        name: "Hyun-woo Jang",
        resume: `5 years as a research analyst at a consultancy. Excellent statistical work and
client-facing presentation. Analyses arrive as spreadsheet extracts prepared by
the client's data team; he has not written SQL against a warehouse himself.
Several recommendations were adopted by clients.`,
        score: 8,
        summary:
          "Five years of strong analytical and presentation work whose recommendations get adopted — but the data has always arrived pre-extracted.",
        strengths: [
          "Recommendations have repeatedly been adopted by clients",
          "Exceptional at presenting to non-analysts",
        ],
        concerns: ["Has never queried a warehouse directly"],
        requirements: [
          [true, "Five years, with adopted client recommendations."],
          [
            false,
            "Works from spreadsheet extracts prepared by others; states he has not written SQL against a warehouse.",
          ],
          [true, "Maintains recurring client reporting packs."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
          { label: "Experiment or A/B test design", status: "demonstrated" },
          { label: "Presents well to non-analysts", status: "demonstrated" },
          { label: "Warehouse SQL", status: "contradicted" },
        ],
      },
      {
        name: "Tarek Aziz",
        resume: `1 year as a junior analyst, following two years as a financial controller.
Strong SQL against the company's Snowflake warehouse — picked it up fast.
Contributes to the finance dashboard but does not own it.`,
        score: 6,
        summary:
          "One year in analytics on top of a finance background: the SQL is genuinely strong, the analytics track record is not there yet.",
        strengths: ["Picked up warehouse SQL quickly and works in it daily"],
        concerns: ["One year in the role", "Contributes to a dashboard rather than owning one"],
        requirements: [
          [false, "One year as an analyst; the controller years were not analytics work."],
          [true, "Strong SQL against the Snowflake warehouse."],
          [false, "Contributes to the finance dashboard but explicitly does not own it."],
        ],
        tags: [
          { label: "Presents well to non-analysts", status: "demonstrated" },
          { label: "Dashboard ownership", status: "claimed" },
        ],
      },
      {
        name: "Lucia Moretti",
        resume: `3 years in marketing analytics. Pulls campaign performance for the marketing
team on request, mostly through the ad platforms' own reporting. Some SQL. No
dashboard of her own; reports are ad hoc decks.`,
        score: 5,
        summary:
          "Three years of ad hoc campaign reporting. The work informs decisions, but nothing is owned or maintained.",
        strengths: ["Fast turnaround on ad hoc requests"],
        concerns: ["No owned metric or dashboard", "SQL is secondary to platform reporting tools"],
        requirements: [
          [true, "Three years; campaign reporting feeds budget decisions."],
          [true, "Some SQL against the warehouse, though platform tools do most of the work."],
          [false, "Reports are ad hoc decks; no maintained dashboard or metric."],
        ],
        tags: [
          { label: "Presents well to non-analysts", status: "demonstrated" },
          { label: "Metric ownership", status: "contradicted" },
        ],
      },
      {
        name: "Bea Sørensen",
        resume: `Recent statistics graduate, 8 months in an internship-to-junior role. Strong on
methodology, good R. Has shadowed the analytics team and built practice
dashboards against a sandbox dataset.`,
        score: 4,
        summary:
          "Eight months in, with good methodology training and no production work yet.",
        strengths: ["Strong statistical grounding for the level"],
        concerns: ["Eight months, all supervised", "Work has been against sandbox data"],
        requirements: [
          [false, "Eight months against a two-year bar."],
          [false, "Practice queries against a sandbox dataset, not a production warehouse."],
          [false, "Practice dashboards only; nobody depends on them."],
        ],
        tags: [
          { label: "Python or R for analysis", status: "demonstrated" },
          { label: "Production analytics", status: "claimed" },
        ],
      },
    ],
  },
];
