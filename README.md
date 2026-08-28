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
| `/criteria` | Required criteria (all must be met) and department management |
| `/nice-to-have` | Bonus criteria — never disqualifying |
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

1. Each queued candidate is sent to `POST /api/analyze` one at a time.
2. The route calls Claude server-side with a strict JSON schema
   (`output_config.format`), so the evaluation comes back shaped, not parsed out of prose.
3. The **model** only judges criteria. The **app** decides seating: every required criterion
   must be met to pass; passing candidates are sorted by score; the top 5 sit down.
4. Everyone else lands in Records with an explicit reason — `requirement` (missed a hard
   criterion) or `rank` (passed, but placed below the top 5).

A screening run is append-only. Re-running never edits or deletes an earlier run's records.

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
- **The judge's look** — `HR_PALETTE` in `lib/scene/room.ts`. It is a `CandidatePalette`
  like everyone else's, so the HR figure is drawn by the same rig at the same pixel
  density; only the colours are pinned rather than seeded.
