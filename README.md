# HireScope

A pixel-art AI recruiting screening room. An AI examines incoming resumes, scores each
candidate out of 10, and only the top 5 who clear every one of HR's required criteria get
seated in the room.

> "There is neither time to judge nor a record left behind as evidence."

The human makes the final call. This app's job is to make sure a full, inspectable record
survives every judgment, automatically — nobody is ever silently discarded.

## Address

Canonical production origin: **https://demo1-alpha-mocha.vercel.app**

It lives in one place — `lib/site.ts` — and the canonical link, Open Graph tags,
`robots.txt` and `sitemap.xml` all read from it. Point it somewhere else and everything
follows:

```ts
export const SITE = { url: "https://demo1-alpha-mocha.vercel.app", ... }
```

Set this to whatever the live origin actually is. A canonical tag naming an address that
does not resolve is worse than no canonical tag at all, so change it in the same commit
that points a custom domain at the host.

## Running it

```bash
npm install
cp .env.example .env.local     # then paste your key into .env.local
npm run dev                    # http://localhost:3000
```

`.env.local` is gitignored. The Anthropic API key is read only inside
`app/api/analyze/route.ts`, which runs on the server — it is never sent to the browser and
never appears in a response body.

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without a key the app still runs: screening returns a flagged record explaining that the key
is missing, rather than crashing the run.

## Deploying

The repo is deploy-ready for Vercel with no config file — it detects Next.js and builds it.

1. **vercel.com** → sign in with GitHub → **Add New… → Project** → import `doyun02/DEMO`
2. Leave the framework preset (Next.js) and build settings alone
3. **Environment Variables** → add `ANTHROPIC_API_KEY` with your key, for all environments.
   This is the one step that matters: without it the site deploys and looks right, but every
   screening comes back flagged with "ANTHROPIC_API_KEY is not set on the server."
4. **Deploy**. You get a `*.vercel.app` URL.
5. Set `SITE.url` in `lib/site.ts` to that URL (or to your domain once it points at Vercel),
   commit, and push — otherwise the canonical tag advertises an address that does not resolve.

Pushing to the repo's default branch redeploys automatically. `maxDuration` on the screening
route is 60s, which is the Hobby plan ceiling; raise it in `app/api/analyze/route.ts` if you
move to a paid plan and long resumes start timing out.

## Layout

| Route | What it is |
| --- | --- |
| `/` | The interview room — the pixel scene, a status strip, and the ☰ menu. Nothing else. |
| `/criteria` | Requirements, the role library, and department management |
| `/competencies` | What gets scored, and the standard each score is measured against |
| `/candidates` | Resume intake, the queue, and the "Run AI screening" action |
| `/records` | The full audit trail, with a JSON export |

## The room moves

A screening run doesn't just reorder a list, it changes who is in the room:

- **Newly seated** candidates come in through the door at the right and walk to
  their chair.
- **Re-ranked** candidates stand up, cross the room, and sit back down in the seat
  their new score earned them.
- **Anyone who drops out of the top five** stands up and walks out the same door.

`lib/scene/choreography.ts` turns "who sat where before" and "who sits where now"
into a timeline; it is pure, so it can be checked without a canvas. The renderer
samples it each frame. Seat order is centre-out — the highest score takes the
middle chair, the next two flank it, and so on.

While nobody is moving, the row still isn't still: each candidate runs the same
idle loop out of phase with everyone else — a slow breath, an occasional blink, a
glance sideways at a rival, a hand lifting off the desk. When a screening run is
in flight, they all look up at the AI terminal that is scoring them.

Under `prefers-reduced-motion: reduce`, none of this runs: the room cuts straight
to its settled state.

## Sample data

The app ships with three departments — Backend Engineer, Product Designer, Data
Analyst — carrying ten resumes each, plus one screened run per department, so the
room is populated before you have run anything.

The set is built to make the seating rule visible. Two of the highest-scoring
candidates in it never reach a chair: a principal engineer with eight years of
Rails scores 7 and is still out, because none of the four required languages
appear in his resume; a consultant who scores 8 is out because he has never
queried a warehouse himself. A high score does not survive a missed requirement.

Seeded runs are tagged `sample: true` and labelled **Sample** in Records, so an
example never reads as a judgment the AI actually made. Nothing is hand-seated:
the sample runs go through `seatCandidates()`, the same function the live run
uses, so the demo can never contradict the rule it is demonstrating.

## How screening works

The standard has two halves, and keeping them apart is the whole design.

**Requirements** are hard gates. Every one must be met; one miss disqualifies a candidate
however well they score. The record distinguishes a resume that argued *against* a
requirement from one that was simply *silent* on it — both fail, but they are different
facts about the person.

**Competencies** are scored 0-10 against their own written definition — what the
competency means for this role, what a strong answer looks like, what a weak one looks
like. Priority sets the weight: high 3, medium 2, low 1.

1. Each queued candidate is sent to `POST /api/analyze` one at a time.
2. The route calls Claude server-side with a Zod schema via `messages.parse()`, so the
   evaluation arrives typed rather than parsed out of prose.
3. The **model** judges each requirement and scores each competency, with a quote behind
   every verdict. It never produces the overall score.
4. **`lib/scoring.ts`** computes that: the weighted mean of the *reached* competencies,
   rescaled to 0-100. Competencies the resume never spoke to are excluded from the mean
   rather than scored zero, and every report carries the count the score rests on
   ("7 of 8 competencies, total weight 19").
5. Requirements decide who is eligible; the score decides who ranks. The top five
   eligible candidates sit down.
6. Everyone else lands in Records with an explicit reason — `requirement` (missed a gate)
   or `rank` (eligible, but below the cut).

A screening run is append-only, and carries a frozen copy of the standard it applied,
identified by a content hash. Editing a department afterwards cannot change what a past
candidate was held to.

## The interview

A resume screen tells you what someone wrote about themselves. The interview is
where that gets tested, and it runs **in the room** — the AI never speaks to the
candidate.

Open a seated candidate's case file and start an interview. The model proposes
one question at a time; you ask it across the desk and type back what the
candidate said. One model call per turn does both jobs — appraise the answer that
just arrived, then decide what to ask next — which is how a human interviewer
works and half the latency of doing them separately.

What makes this app's version different from a cold interview: **the resume screen
is the brief.** The interview already knows which competencies the resume never
evidenced and which it scored on weak evidence, and it chases those first. No
separate planning call.

Coverage is counted in code, not by the model — `lib/interview/coverage.ts` tells
it how many questions it has asked and what each competency still needs, and the
budget scales to the number of competencies (high priority gets two questions,
the rest one, clamped to 6-14).

Finishing rescores the candidate. Where the interview reached a competency, its
score **replaces** the resume's rather than averaging with it: a resume is an
assertion and an interview is direct evidence, and averaging would let a
well-written resume prop up a weak interview. Where it did not reach one, the
resume's score stands.

That produces a **new run**, not an edit — the run it came from is untouched, so
the record of how the ranking changed survives. The room re-seats itself against
the new scores, which is when a candidate stands up and changes chairs, or walks
out the door.

Notes worth keeping in mind:

- The transcript is the interviewer's notes, not the candidate's words. Every
  prompt says so, and evidence quotes are quotes of what someone wrote down.
- Nothing is recorded until you finish. Leaving mid-interview discards it.
- Not carried across from the upstream project, because they assume a candidate
  typing into the app: consent flows, the abandonment-and-deletion rule, and the
  integrity signals (focus loss, paste events, answer timing, stylometry). If this
  ever grows a candidate-facing side, those come back with it — they are not
  optional there.

## Where this came from

The assessment model is adapted from **[jaewoo001/hirescope](https://github.com/jaewoo001/hirescope)**,
a resume-grounded adaptive interview system built by the other half of this project. Taken
from it, deliberately:

- **The scoring rule** — per-competency 0-10, priority weights, weighted mean of the
  reached ones, and the refusal to score an unevidenced competency zero.
- **Evidence, not vibes** — every score carries a quote and a confidence level, and an
  unreached competency says so instead of producing a confident number.
- **The competency definition format** — description, strong answer, weak answer. The weak
  half matters as much as the strong one; without it, scoring drifts toward flattery.
- **The skill diagram** — axes from the standard rather than a fixed set, with unevidenced
  axes drawn hollow and dashed so the shape shows which parts of itself are supported.
- **`demonstrated` / `claimed` / `contradicted`** — what a resume *shows* versus what it
  *asserts*.
- **The role library** — `lib/sample/roleLibrary.ts` is generated from that repo's
  `criteria/*.md` by `scripts/import-criteria.py`. Twenty roles, 163 competencies, parsed
  rather than paraphrased so the wording is theirs.

- **The adaptive interview loop** — one call per turn doing appraisal and question
  selection together, coverage counted in code, and the 0-4 per-answer scale feeding a
  0-10 per-competency assessment at the end rather than being summed.

Changed on the way across: their system has no hard gate — everything is weighted and
nothing disqualifies. This app needs one, so requirements sit in front of the score. And
their interview is candidate-facing; this one is run by the interviewer, from their side
of the desk. Not taken: homework, embeddings search, and the integrity signals, all of
which assume a candidate typing into the app and a database behind it.

## The scene

`lib/scene/` draws the room on a 384×216 canvas buffer that is upscaled with
`image-rendering: pixelated`, so pixels stay chunky at any window size.

- `palette.ts` — the fixed room palette, and per-candidate palettes seeded by a name hash
  (distinct hair, outfit, and accent; identical rig)
- `sprites.ts` — the 32×32 candidate rig, the same rig turned around and scaled up for the
  foreground HR figure, the vacant chair, and a 3×5 pixel font for VACANT plates
- `room.ts` — composition, lighting, the corkboard evidence board, and the ambient passes

`prefers-reduced-motion: reduce` disables the animation loop entirely — the scene renders one
static frame and redraws only when state changes.

## State

Zustand with `localStorage` persistence (`hirescope:v1`): criteria, departments, the
candidate queue, and every screening run. Clearing browser storage clears the record — the
Records panel's JSON export is the way to keep one outside the browser.

## Extension points

- **Resume file upload / PDF parsing** — `components/CandidatesPanel.tsx` marks the spot. The
  `Candidate` type already carries `sourceFileName` for it.
- **A different model or effort level** — `MODEL` and `output_config.effort` in
  `app/api/analyze/route.ts`.
- **More roles** — re-run `python3 scripts/import-criteria.py <path-to-criteria-dir>` to
  regenerate the role library from a checkout of the criteria files.
- **The judge's look** — `HR_PALETTE` in `lib/scene/room.ts`. It is a `CandidatePalette`
  like everyone else's, so the HR figure is drawn by the same rig at the same pixel
  density; only the colours are pinned rather than seeded.
