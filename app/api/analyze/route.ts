import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { erroredEvaluation } from "@/lib/screening";
import type { AnalyzeRequestBody, AnalyzeResponseBody, Evaluation } from "@/lib/types";

export const runtime = "nodejs";
/**
 * One screening call, not the whole run — the client sends candidates one at a
 * time. 60s is the ceiling on Vercel's Hobby plan; asking for more there fails
 * the deployment rather than the request. Raise it on a paid plan if long
 * resumes start timing out.
 */
export const maxDuration = 60;

/**
 * The API key is read here, server-side, from the environment. It is never sent
 * to the browser and never appears in any response body.
 */
const client = new Anthropic();

const MODEL = "claude-opus-5";

/**
 * Strict JSON schema for the evaluation half of a ScreeningResult.
 * The seating verdict (meetsAll / seated / notSeatedReason) is computed by this
 * app, not by the model — the model only judges the candidate against criteria.
 */
function buildSchema(priorityCount: number, niceCount: number) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["score", "summary", "strengths", "concerns", "priorityResults", "niceToHaveResults"],
    properties: {
      score: {
        type: "integer",
        minimum: 0,
        maximum: 10,
        description: "Overall fit for the role, 0-10. Be strict; 10 is exceptional.",
      },
      summary: {
        type: "string",
        description: "Two or three sentences on this candidate's fit. Plain, specific, no filler.",
      },
      strengths: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
        maxItems: 4,
        description: "Concrete strengths, each grounded in something the resume actually says.",
      },
      concerns: {
        type: "array",
        items: { type: "string" },
        maxItems: 4,
        description: "Concrete concerns or gaps. Empty array only if there are genuinely none.",
      },
      priorityResults: {
        type: "array",
        minItems: priorityCount,
        maxItems: priorityCount,
        description:
          "One entry per required criterion, in the exact order the criteria were given.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "met", "reason"],
          properties: {
            label: { type: "string", description: "The criterion label, copied verbatim." },
            met: {
              type: "boolean",
              description:
                "True only if the resume gives positive evidence the criterion is met. Absence of evidence is not evidence — mark false.",
            },
            reason: {
              type: "string",
              description: "One line citing the evidence (or its absence) behind this decision.",
            },
          },
        },
      },
      niceToHaveResults: {
        type: "array",
        minItems: niceCount,
        maxItems: niceCount,
        description: "One entry per nice-to-have criterion, in the order given.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "met"],
          properties: {
            label: { type: "string" },
            met: { type: "boolean" },
          },
        },
      },
    },
  };
}

const SYSTEM_PROMPT = `You are the screening examiner for a hiring panel.

You judge one candidate at a time against a fixed list of criteria set by HR.
Your judgment is recorded permanently and shown to the human interviewer, who
makes the final call — so every verdict you give must be traceable to something
the resume actually says.

Rules:
- Judge only against the criteria given. Do not invent additional requirements.
- Absence of evidence is not evidence of the criterion being met. If the resume
  does not show it, mark it not met and say so in the reason.
- Never infer or comment on age, gender, nationality, race, religion, marital or
  family status, disability, or any photo. If the resume mentions them, ignore
  them entirely — they carry no weight in any verdict.
- Be specific in every reason: name the project, tool, or line you relied on.
- Return one priorityResults entry per required criterion and one
  niceToHaveResults entry per nice-to-have, in the exact order given, with each
  label copied verbatim.`;

function buildUserPrompt(body: AnalyzeRequestBody): string {
  const required =
    body.priorityCriteria.map((c, i) => `${i + 1}. ${c.label}`).join("\n") || "(none)";
  const nice = body.niceToHave.map((c, i) => `${i + 1}. ${c.label}`).join("\n") || "(none)";

  return `REQUIRED CRITERIA (all must be met to pass):
${required}

NICE-TO-HAVE CRITERIA (bonus only — never disqualifying):
${nice}

CANDIDATE: ${body.candidate.name}

RESUME
------
${body.candidate.resumeText}
------

Screen this candidate against the criteria above.`;
}

/** Pull the evaluation JSON out of the response, tolerating stray prose. */
function extractJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("no JSON object in response");
    return JSON.parse(text.slice(start, end + 1));
  }
}

/** Reconcile the model's output with the criteria we asked about. */
function normalize(raw: unknown, body: AnalyzeRequestBody): Evaluation {
  const r = (raw ?? {}) as Partial<Evaluation>;
  const byLabel = <T extends { label: string }>(list: T[] | undefined, label: string) =>
    list?.find((x) => String(x.label).trim().toLowerCase() === label.trim().toLowerCase());

  return {
    score: Math.max(0, Math.min(10, Math.round(Number(r.score) || 0))),
    summary: typeof r.summary === "string" ? r.summary : "No summary returned.",
    strengths: Array.isArray(r.strengths) ? r.strengths.filter((s) => typeof s === "string") : [],
    concerns: Array.isArray(r.concerns) ? r.concerns.filter((s) => typeof s === "string") : [],
    // Anchor on OUR criteria list, not the model's — a criterion the model
    // dropped must never silently disappear from the record.
    priorityResults: body.priorityCriteria.map((c) => {
      const hit = byLabel(r.priorityResults, c.label);
      return {
        label: c.label,
        met: hit?.met === true,
        reason: hit?.reason || "The AI returned no verdict for this criterion.",
      };
    }),
    niceToHaveResults: body.niceToHave.map((c) => ({
      label: c.label,
      met: byLabel(r.niceToHaveResults, c.label)?.met === true,
    })),
  };
}

export async function POST(request: Request): Promise<NextResponse<AnalyzeResponseBody>> {
  let body: AnalyzeRequestBody;
  try {
    body = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json<AnalyzeResponseBody>(
      {
        ok: false,
        error: "Malformed request body.",
        evaluation: erroredEvaluation([], [], "malformed request"),
      },
      { status: 400 },
    );
  }

  const priorityLabels = (body.priorityCriteria ?? []).map((c) => c.label);
  const niceLabels = (body.niceToHave ?? []).map((c) => c.label);
  const fail = (msg: string, status = 200) =>
    NextResponse.json<AnalyzeResponseBody>(
      { ok: false, error: msg, evaluation: erroredEvaluation(priorityLabels, niceLabels, msg) },
      { status },
    );

  if (!body.candidate?.resumeText?.trim()) return fail("The candidate has no resume text.", 400);
  if (priorityLabels.length === 0)
    return fail("This department has no required criteria — add at least one before screening.", 400);
  if (!process.env.ANTHROPIC_API_KEY)
    return fail("ANTHROPIC_API_KEY is not set on the server.", 500);

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      // Refusal fallback: if a safety classifier declines the request, the API
      // re-runs it on a fallback model within the same call instead of returning nothing.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: buildSchema(priorityLabels.length, niceLabels.length),
        },
      },
      messages: [{ role: "user", content: buildUserPrompt(body) }],
    });

    if (response.stop_reason === "refusal") {
      return fail("The model declined to screen this resume.");
    }

    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!text.trim()) return fail("The model returned an empty response.");

    return NextResponse.json<AnalyzeResponseBody>({
      ok: true,
      evaluation: normalize(extractJSON(text), body),
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError)
      return fail("The server's Anthropic API key was rejected.", 500);
    if (error instanceof Anthropic.RateLimitError)
      return fail("Rate limited by the Anthropic API — try this candidate again shortly.");
    if (error instanceof Anthropic.BadRequestError)
      return fail(`The screening request was rejected: ${error.message}`);
    if (error instanceof Anthropic.APIError) return fail(`Anthropic API error ${error.status}.`);
    if (error instanceof SyntaxError) return fail("The AI response was not valid JSON.");
    return fail(error instanceof Error ? error.message : "Unknown screening failure.");
  }
}
