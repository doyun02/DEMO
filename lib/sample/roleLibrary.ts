import type { RoleTemplate } from "../types";

/**
 * The role library.
 *
 * Generated from the criteria files in jaewoo001/hirescope by
 * scripts/import-criteria.py — the wording is theirs, parsed rather than
 * paraphrased, so a candidate is judged against the standard as written and
 * reviewed. Re-run the script to pull changes; do not hand-edit this file.
 *
 * A role template is a starting point, not a lock: adding a department copies
 * these competencies into the store, where they are editable like any other.
 */
export const ROLE_LIBRARY: RoleTemplate[] = [
  {
    "slug": "b2b-sales",
    "title": "B2B sales representative",
    "sector": "sales",
    "competencies": [
      {
        "key": "discovery",
        "label": "Discovery",
        "priority": "high",
        "description": "Whether they find out what the buyer actual problem is before proposing anything, and whether they will disqualify a deal that is not real.",
        "strongAnswer": "Asks before pitching, and can describe the specific questions that changed their read on a deal. Distinguishes the stated requirement from the underlying problem. Can name a deal they qualified out of and why — and is not embarrassed by it.",
        "weakAnswer": "Pitches immediately. Discovery is a checklist run to satisfy the process. No qualification criteria they can state. Has never walked away from a deal, or frames doing so as failure."
      },
      {
        "key": "pipeline_rigour",
        "label": "Pipeline rigour",
        "priority": "high",
        "description": "Whether they know their own numbers and report them honestly under pressure. The single most checkable claim on a sales resume.",
        "strongAnswer": "Knows their conversion rates, cycle length, and average deal size without reaching. Forecasts with a stated basis and can describe a forecast they got wrong and what they changed. Distinguishes a deal that is progressing from one that is merely still open.",
        "weakAnswer": "Numbers arrive vague or suspiciously round and do not survive a follow-up. Forecasting is optimism with no method. Cannot explain a lost deal beyond price. Quota attainment is quoted without the context of the quota."
      },
      {
        "key": "objection_handling",
        "label": "Objection handling",
        "priority": "medium",
        "description": "What they do when the buyer pushes back — specifically, whether they can tell a real blocker from a polite stall.",
        "strongAnswer": "Engages the objection rather than deflecting it, and can describe learning that the stated objection was not the real one. Distinguishes a stall from a refusal and handles each differently. Comfortable letting a buyer say no cleanly.",
        "weakAnswer": "Scripted rebuttals applied regardless of the objection. Argues with the customer. Treats every no as a not-yet. Cannot describe an objection that turned out to be correct."
      },
      {
        "key": "commercial_judgement",
        "label": "Commercial judgement",
        "priority": "high",
        "description": "Whether they optimise for the account over time or for the close in front of them. The competency that determines what the deals are worth after they land.",
        "strongAnswer": "Understands margin and long-term account value, not just booked revenue. Can describe holding a price and what it cost, or discounting deliberately with a reason. Thinks about whether the customer will actually succeed with what they bought.",
        "weakAnswer": "Discounts reflexively as the first move. Optimises for the quarter at the account expense. No awareness of margin. Describes post-sale outcomes as somebody else department."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "data-analyst",
    "title": "Data analyst",
    "sector": "product",
    "competencies": [
      {
        "key": "analytical_rigour",
        "label": "Analytical rigour",
        "priority": "high",
        "description": "Whether they interrogate a result before shipping it, especially a result they like.",
        "strongAnswer": "States what would have to be true for the conclusion to hold, and checks at least one of those things. Reaches for a confound before reaching for an explanation — seasonality, a mix shift, a launch, a tracking change. Can describe a finding they had to retract or qualify and how they caught it. Says plainly what the analysis cannot establish.",
        "weakAnswer": "Reports the first plausible explanation for a movement. Treats a correlation as a mechanism. Does not engage when an alternative explanation is raised. Has never had to walk back a number."
      },
      {
        "key": "data_quality_judgement",
        "label": "Data quality judgement",
        "priority": "high",
        "description": "Whether they can tell a real change from a pipeline change, and whether they check before believing.",
        "strongAnswer": "Validates against a second source or a known total before trusting a new table. Can describe a time the data was wrong — a duplicated join, a silently dropped event, a definition that changed upstream — and how they noticed. Understands what their joins do to row counts and checks. Knows where the numbers come from, not just which table they sit in.",
        "weakAnswer": "Takes the warehouse as ground truth. Cannot describe a case where data was wrong. No validation habit. Surprised by a row count and moves on. Uses a metric without knowing its definition."
      },
      {
        "key": "measurement_design",
        "label": "Measurement design",
        "priority": "high",
        "description": "Whether they can set up a question so it has an answer, rather than analysing whatever happened afterwards.",
        "strongAnswer": "Defines the metric and the comparison before the change ships. Understands baselines, control groups, and why the absence of one limits what can be claimed. Has pushed back on a launch that could not be measured, or designed the holdout that made it measurable. Knows roughly what effect size a given sample can detect and will say when it cannot.",
        "weakAnswer": "Analysis begins after the fact with whatever data exists. Pre/post comparison with no control and no acknowledgement of the gap. Reports significance without power. Metric definitions shift between analyses."
      },
      {
        "key": "decision_usefulness",
        "label": "Turning analysis into a decision",
        "priority": "medium",
        "description": "Whether the work changes what anyone does. An analysis nobody acts on is a cost.",
        "strongAnswer": "Leads with the implication rather than the method, and states the recommendation plainly along with their confidence in it. Can describe an analysis that changed a decision, and one that correctly changed nothing. Knows which stakeholder needed what, and cut the rest.",
        "weakAnswer": "Delivers dashboards and lets others interpret. Every analysis ends in \"further investigation is needed\". Cannot name a decision their work changed. Presents method at length and the finding at the end, if at all."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "data-scientist",
    "title": "Data scientist",
    "sector": "engineering",
    "competencies": [
      {
        "key": "statistical_reasoning",
        "label": "Statistical reasoning",
        "priority": "high",
        "description": "Whether they know what their methods assume and can tell when those assumptions have stopped holding. Method breadth matters far less than this.",
        "strongAnswer": "States what a method assumes and checks whether the data meets it. Handles the difference between correlation and causation as a design problem, not a caveat sentence. Can describe an analysis where the obvious conclusion was wrong and how they caught it.",
        "weakAnswer": "Applies methods by familiarity without stating assumptions. Treats statistical significance as importance. Cannot describe a confounder in their own past work. Reports a p-value with no account of how many things were tested."
      },
      {
        "key": "problem_framing",
        "label": "Framing a question as data work",
        "priority": "high",
        "description": "Whether they can turn a vague business question into something measurable — and say when the data cannot answer it.",
        "strongAnswer": "Turns an ambiguous request into a specific measurable question and confirms it is the right one before starting. Says clearly when the available data cannot support the conclusion being asked for. Estimates whether the answer would change the decision before doing the work.",
        "weakAnswer": "Starts modelling before the question is defined. Delivers a technically sound answer to the wrong question. Never tells a stakeholder the data cannot answer this. Cannot say what decision their analysis was meant to inform."
      },
      {
        "key": "validation_discipline",
        "label": "Modelling and validation discipline",
        "priority": "high",
        "description": "Whether their evaluation would survive contact with production. Most models that look strong offline fail here, and the cause is almost always in how the split was built.",
        "strongAnswer": "Designs the validation split around how the model will actually be used, including time ordering where it matters. Compares against a simple baseline every time. Has found leakage in their own work and can describe how it got there.",
        "weakAnswer": "Random splits on time-dependent data. No baseline, so the score means nothing. Tuned against the test set. Reports a strong offline number with no account of whether it held up afterwards."
      },
      {
        "key": "communicating_uncertainty",
        "label": "Communicating uncertainty",
        "priority": "medium",
        "description": "Whether decision-makers end up with a calibrated picture or merely a confident one. Overstating certainty and hedging everything into uselessness are both failures.",
        "strongAnswer": "Conveys uncertainty in terms the audience can act on, without either hiding it or hedging everything into uselessness. States the assumption most likely to be wrong. Has told a stakeholder the result was too weak to act on.",
        "weakAnswer": "Presents point estimates with no range. Buries caveats in an appendix, or caveats so heavily that no decision is possible. Has never delivered an inconclusive result."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "development",
    "title": "Software developer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "technical_depth",
        "label": "Technical depth",
        "priority": "high",
        "description": "Whether the candidate understands the systems they have worked on below the level of the summary on their resume. Not breadth of tools — depth on at least one.",
        "strongAnswer": "Goes three levels deeper than the bullet point when pushed. Explains why their stack behaves the way it does rather than only how to invoke it. Distinguishes clearly between what they understand and what they copied from a guide, and is comfortable saying which is which.",
        "weakAnswer": "Depth collapses on the second follow-up. Describes tools rather than the problems they solved. Cannot name a failure mode of something they claim to know well, or answers a \"why\" question by restating the \"what\"."
      },
      {
        "key": "system_design",
        "label": "System design",
        "priority": "high",
        "description": "How they reason about a system that has to survive load, failure, and change — at whatever scale is honest for their seniority.",
        "strongAnswer": "Reasons about load, failure paths, and data flow. Picks a design because of a specific constraint, states what that choice costs, and can say where it breaks at ten times the volume. Comfortable saying a simple design was the right one.",
        "weakAnswer": "Reaches for a named architecture without justifying it against the problem. Ignores failure modes. Cannot estimate scale even roughly. Treats every problem as a distributed-systems problem regardless of size."
      },
      {
        "key": "debugging",
        "label": "Debugging and rigour",
        "priority": "high",
        "description": "How they behave when something is broken and the cause is not obvious. This is the competency that most separates experience from exposure.",
        "strongAnswer": "Describes a real diagnosis: what they observed, what they hypothesised, how they discriminated between competing hypotheses, and what the cause turned out to be. Mentions how they verified the fix actually fixed it.",
        "weakAnswer": "The debugging story amounts to looking at it until it worked. No instrumentation, several changes made at once, no mention of confirming the fix. Cannot describe a bug whose cause surprised them."
      },
      {
        "key": "code_quality",
        "label": "Code and craft",
        "priority": "medium",
        "description": "Whether they hold defensible positions about testing, review, and technical debt, rather than inherited rules.",
        "strongAnswer": "Has a position on testing and review that they can argue for, with the context in which it applies. Can name a decision in a codebase they would reverse, and why. Treats debt as a deliberate trade with a cost, not a moral failing.",
        "weakAnswer": "Absolutist rules with no context — \"always 100% coverage\", \"comments are a smell\" — with no account of when the rule fails. No testing philosophy at all, or dismisses maintenance concerns as somebody else's problem."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "education-planning",
    "title": "Education planner",
    "sector": "product",
    "competencies": [
      {
        "key": "curriculum_design",
        "label": "Curriculum design",
        "priority": "high",
        "description": "Whether they can sequence material so that a learner who starts at the stated prerequisite actually arrives at the stated outcome.",
        "strongAnswer": "Starts from what the learner should be able to *do*, not what should be covered. Can explain why one topic precedes another in a course they built, and name a place the sequence was wrong and had to be reordered. Distinguishes what must be taught from what can be looked up.",
        "weakAnswer": "Describes content as a list of topics with no dependency reasoning. Designs around what is interesting to teach rather than what the learner needs next. Cannot name an outcome the course was supposed to produce, or has never revised a sequence after seeing it run."
      },
      {
        "key": "learner_evidence",
        "label": "Evidence about learners",
        "priority": "high",
        "description": "Whether their decisions are grounded in what learners actually did, as opposed to what the team assumed they would do.",
        "strongAnswer": "Cites specific evidence — completion patterns, where people got stuck, what they asked for help with, what assessment results showed — and can describe a finding that contradicted their expectation and changed the design. Knows the difference between learners saying they liked something and learners having learned it.",
        "weakAnswer": "Reasons from their own experience as a learner and generalises it. Cites satisfaction scores as evidence of learning. Has never been surprised by data. Confuses a stakeholder opinion with a learner need."
      },
      {
        "key": "assessment_design",
        "label": "Assessment design",
        "priority": "high",
        "description": "Whether they can build something that tells you what a learner can do, rather than how well they can complete an exercise.",
        "strongAnswer": "Designs assessments that could actually fail a learner who did not understand, and can explain why a given task discriminates. Knows the common failure — a task that measures familiarity with the format rather than the skill — and can give an example of catching it. Thinks about what happens to a learner who fails.",
        "weakAnswer": "Assessment is an afterthought bolted on at the end. Every learner passes and this is reported as success. Cannot say what a question is measuring beyond the topic it names."
      },
      {
        "key": "stakeholder_translation",
        "label": "Working with instructors and stakeholders",
        "priority": "medium",
        "description": "Education planning happens between subject experts who know the content and managers who own the outcome. This is the competency that makes that survivable.",
        "strongAnswer": "Can describe extracting a structure from an expert who thinks in narrative, and pushing back on a stakeholder request that would have hurt the learner — including how they framed it and whether it worked. Holds the learner interest without treating colleagues as obstacles.",
        "weakAnswer": "Either takes every request as a specification or treats subject experts as delivery mechanisms. No example of a disagreement that they handled and no account of one they lost."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "electrical-engineer",
    "title": "Electrical engineer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "circuit_design",
        "label": "Circuit design",
        "priority": "high",
        "description": "Whether they choose a topology and its component values for stated reasons, and know where the design stops working.",
        "strongAnswer": "Explains why this topology rather than the obvious alternative, in terms of the constraint that decided it — efficiency, noise, cost, part availability, thermal. Knows their margins across temperature, tolerance, and supply variation rather than at nominal only. Can name the part of the circuit they are least confident about. Reads the datasheet section that matters, not just the typical-application diagram.",
        "weakAnswer": "Reproduced the reference design and cannot say what any value does. Designs at nominal with no worst-case analysis. Cannot state an operating limit. Chooses parts by familiarity and cannot compare against an alternative on any parameter."
      },
      {
        "key": "debug_and_instrumentation",
        "label": "Debugging and instrumentation",
        "priority": "high",
        "description": "What they do with a board that does not work, especially one that works most of the time.",
        "strongAnswer": "Describes a real fault: what they observed, what they hypothesised, and the specific measurement that discriminated between the possibilities. Knows how their own instrument lies to them — probe loading, ground-lead inductance, bandwidth, aliasing — and has been caught by it once. Bisects rather than changing several things at once, and confirms the fix actually explains the original symptom.",
        "weakAnswer": "Debugging amounts to swapping components until it works. No account of what was measured. Several changes at once. Trusts the scope trace without thinking about how it was taken. Cannot describe a fault whose cause surprised them."
      },
      {
        "key": "signal_and_power_integrity",
        "label": "Signal, power, and thermal integrity",
        "priority": "high",
        "description": "Whether they think about the board as a physical object with return paths, loops, and heat, rather than as a schematic that happens to have been laid out.",
        "strongAnswer": "Reasons about where the return current actually flows and what a split in the plane beneath a trace does. Places decoupling for a reason they can state. Has a power budget and a thermal path they can describe end to end. Can name a layout decision that fixed, or caused, a problem — and understands why the schematic looked fine throughout.",
        "weakAnswer": "Treats layout as a downstream task. Decoupling is a capacitor per pin because that is the convention. No power or thermal budget. Cannot explain why a circuit that simulates correctly might fail on the bench."
      },
      {
        "key": "standards_and_compliance",
        "label": "Standards and design for compliance",
        "priority": "medium",
        "description": "Whether they design with certification in mind, or discover it at the end.",
        "strongAnswer": "Knows which standards apply to their products and, more importantly, what those standards are protecting against. Can describe a design decision made early specifically to survive EMC or safety testing. Has been to a test house and can describe a failure and what fixed it. Understands creepage, isolation, or emissions limits as physics rather than as numbers in a table.",
        "weakAnswer": "Compliance is something the test lab deals with. Cannot name a standard relevant to their own work. No design decision was ever influenced by it. Treats a test failure as a paperwork problem."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "financial-analyst",
    "title": "Financial analyst",
    "sector": "finance",
    "competencies": [
      {
        "key": "quantitative_reasoning",
        "label": "Quantitative reasoning",
        "priority": "high",
        "description": "Whether they have a feel for magnitude and can tell when an output is implausible before someone tells them.",
        "strongAnswer": "Comfortable estimating aloud and sanity-checking against something known. Can state which input a conclusion is most sensitive to, and has run that sensitivity rather than asserting it. Notices an implausible result and chases it. Knows what their model assumes about correlation, distribution, or linearity, and where those assumptions break.",
        "weakAnswer": "Cannot do rough arithmetic without a spreadsheet. Treats model output as fact. Cannot say what would move the answer most. Precision to four decimals on an input that was a guess."
      },
      {
        "key": "financial_acumen",
        "label": "Financial acumen",
        "priority": "high",
        "description": "Whether the accounting is connected in their head, or memorised as separate definitions.",
        "strongAnswer": "Can walk a transaction through the three statements and land the cash correctly. Knows why a profitable business can run out of money. Picks a valuation or forecasting method and defends the choice against the alternative for this specific case. Understands what the accounting treatment obscures as well as what it shows.",
        "weakAnswer": "Definitions without linkage. Cannot trace a change through to cash. Applies one method by default with no justification. Cannot explain what working capital did to a result."
      },
      {
        "key": "risk_judgement",
        "label": "Risk and control",
        "priority": "high",
        "description": "Whether they think about downside and about how a process could be wrong or gamed, including their own.",
        "strongAnswer": "Models the downside case with the same care as the base case, and states what would have to happen for it. Understands why controls exist — segregation of duties, review, reconciliation — rather than treating them as friction. Can describe overriding a model output, documenting why, and what happened. Has raised something uncomfortable.",
        "weakAnswer": "Only models upside, or a downside case that is the base case minus ten per cent. Describes compliance as an obstacle. No concept of review or four-eyes. Has never disagreed with an output."
      },
      {
        "key": "regulatory_and_reporting_awareness",
        "label": "Regulatory and reporting awareness",
        "priority": "medium",
        "description": "Whether the rules that govern their numbers have ever changed what they did.",
        "strongAnswer": "Knows which standards or regimes touch their work and can describe a specific decision that changed because of one. Understands the purpose behind a rule, not just its text. Knows the boundary of their own competence and when to bring in audit, legal, or a specialist.",
        "weakAnswer": "Names standards without connecting any to an action. Cannot describe a rule affecting a real decision. Treats reporting requirements as a formatting task."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "forward-deployed-engineer",
    "title": "Forward deployed engineer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "customer_problem_framing",
        "label": "Problem framing",
        "priority": "high",
        "description": "Whether they can get from what a customer asked for to what is actually costing them money — and say so out loud to the person who asked.",
        "strongAnswer": "Describes arriving at a stated request and leaving with a different problem, with the specific observation that changed it — usually something they saw on site rather than heard in a meeting. Can name what they decided *not* to build and why; scoping something out with a reason is stronger evidence here than a long list of what they shipped. Has told a customer their premise was wrong, and can describe how that landed.",
        "weakAnswer": "Accepts the brief as the specification and optimises delivery of it. Cannot name anything they declined to build. Offers years in the industry as evidence of problem-framing ability. The more fluent they are in the domain, the more the answer slides into how to build it well rather than what is worth building."
      },
      {
        "key": "full_cycle_delivery",
        "label": "Full-cycle delivery",
        "priority": "high",
        "description": "Whether they have personally taken something from nothing to running, in an environment they did not control.",
        "strongAnswer": "Names a thing they built end to end — discovery through to something a real user touched — and can describe their own contribution precisely within a small team. Moved before the plan was complete and can say what they learned from the first version being wrong. Comfortable with a rough thing in front of a user this week over a good thing next quarter, and can say when that trade would be wrong.",
        "weakAnswer": "Contribution is strategy, planning, or specification with a build owned by others. Every project ends at a recommendation or a pilot. Waited for requirements to settle. Cannot point at anything that reached a user."
      },
      {
        "key": "data_and_integration_reality",
        "label": "Working with real systems and real data",
        "priority": "high",
        "description": "Customer environments are not clean. This is whether they can operate anyway.",
        "strongAnswer": "Describes data that was wrong, missing, or lying, and how they found out — ideally before it reached a conclusion. Reasons about integrating with systems they cannot change, and about access, permissions, and the security review as part of the work rather than as obstruction. Can describe a case where the environment made the obvious approach impossible and what they did instead.",
        "weakAnswer": "Assumes an environment they control. Discovered a data quality problem only when the output was visibly wrong. Treats security and access review as bureaucracy between them and the work. No example of a constraint that changed the approach."
      },
      {
        "key": "outcome_accountability",
        "label": "Outcome accountability",
        "priority": "high",
        "description": "Whether they track what happened after delivery, and whether they will stop something that is not working.",
        "strongAnswer": "Talks about what changed for the customer, with a number where one exists, rather than about what was delivered. Can describe calling a stop or a pivot on the grounds that the direction was wrong — including when it was their own direction and there was sunk cost. Distinguishes a thing that shipped from a thing that got used.",
        "weakAnswer": "Success is defined by delivery on time. No idea whether the thing was still in use six months later. Cannot describe stopping anything. Failures are attributed to adoption, the customer, or the organisation, with no account of what the build could have done differently."
      },
      {
        "key": "rapid_domain_learning",
        "label": "Rapid domain learning",
        "priority": "high",
        "description": "Whether they can become useful in an industry they knew nothing about, quickly, and enjoy it enough to keep doing it.",
        "strongAnswer": "Describes getting up to speed on an unfamiliar field and converting it into something concrete, with the specific method they used — who they talked to, what they read, what they built to test their understanding. Can say what they got wrong early because they did not yet know the domain, and how they found out. Curiosity reads as genuine rather than as an interview answer.",
        "weakAnswer": "All experience is in one industry with no evidence of moving. Learning is described in the abstract with no example that produced anything. Treats an unfamiliar domain as a reason to defer to whoever knows it, without forming an independent view."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost. For this role read it to include the customer's people, who did not choose to work with them.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority — which is the normal condition of this job. States a colleague's or customer's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational, or as the customer being resistant to change. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "hr-manager",
    "title": "Human resources manager",
    "sector": "hr",
    "competencies": [
      {
        "key": "people_judgement",
        "label": "People judgement",
        "priority": "high",
        "description": "Whether their read on a person is built from evidence and revisable, or from instinct and fixed.",
        "strongAnswer": "Separates behaviour from character when describing someone. Can describe changing their mind about a person and what evidence did it. Distinguishes a performance problem from a fit problem from a management problem, and can give an example where the diagnosis turned out to be the third one. Comfortable saying they were wrong about someone.",
        "weakAnswer": "Sorts people into fixed types. Relies on gut feel with no supporting evidence. Cannot describe a read they got wrong. Attributes a performance problem to the individual without examining what their manager was doing."
      },
      {
        "key": "difficult_conversations",
        "label": "Difficult conversations",
        "priority": "high",
        "description": "Whether they have actually delivered hard news to a real person, and what they learned from doing it badly at least once.",
        "strongAnswer": "Walks through a specific conversation — a termination, a redundancy, a grievance outcome — including the preparation, the sequencing, and the part that did not go as planned. Holds a line while staying humane. Can say what they would do differently and why. Does not describe every case as having ended well.",
        "weakAnswer": "Only hypotheticals and frameworks. Avoids the specifics of what was actually said. Either purely procedural or purely emotional, with no evidence of the other. Every example ends with the employee thanking them."
      },
      {
        "key": "employment_practice",
        "label": "Employment practice",
        "priority": "high",
        "description": "Whether they understand the obligations around hiring, performance management, and termination in their jurisdiction, and why documentation exists.",
        "strongAnswer": "Can describe a case where a legal or procedural requirement genuinely changed the sequence of what they did, and explain the reasoning behind the requirement. Treats contemporaneous documentation as protecting the employee as much as the employer. Knows where the boundary of their own competence is and when to involve counsel.",
        "weakAnswer": "Names regulations without connecting any to an action. Would act in ways that create obvious exposure. Treats documentation as covering the company. No sense of when to escalate to a lawyer, or escalates everything."
      },
      {
        "key": "org_and_incentives",
        "label": "Organisational and incentive thinking",
        "priority": "medium",
        "description": "Whether they can anticipate how a policy will be used, gamed, or resented before it ships.",
        "strongAnswer": "Connects a people decision to a business outcome with a mechanism in between. Thinks about second-order effects, and can describe a policy that produced a behaviour nobody intended. Measures whether something worked rather than whether it launched. Willing to remove a programme.",
        "weakAnswer": "Policy exists for its own sake or because peers have it. No measurement. Cannot anticipate how an incentive will be gamed even when prompted. Has never discontinued anything."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "infrastructure-solution-analyst",
    "title": "Infrastructure solution analyst",
    "sector": "engineering",
    "competencies": [
      {
        "key": "requirements_analysis",
        "label": "Requirements analysis",
        "priority": "high",
        "description": "Whether they can get from what someone asked for to what they actually need, including the constraints nobody mentioned.",
        "strongAnswer": "Asks what the system is for before asking what it should run on. Can describe a request they pushed back on, and what the real requirement turned out to be. Surfaces the constraints that decide the design — compliance, data residency, existing contracts, the team that will operate it — rather than discovering them late. Separates a firm requirement from a preference.",
        "weakAnswer": "Takes the stated requirement as the specification. Availability targets arrive as round numbers with no discussion of what they cost or what downtime actually means to the business. Has never told a requester their request was the wrong shape."
      },
      {
        "key": "infrastructure_design",
        "label": "Infrastructure design",
        "priority": "high",
        "description": "Whether their design follows from constraints, and whether they can say where it stops working.",
        "strongAnswer": "Sizes from measured or estimated load with the assumptions stated, and says what happens if an assumption is wrong. Reasons about failure domains — what a single zone, link, or dependency taking the whole thing down would look like — and matches redundancy to what the business actually needs rather than to the maximum. Can describe choosing the simpler design and why.",
        "weakAnswer": "Reaches for a reference architecture without connecting it to this problem. Every component is redundant with no cost discussion, or none is with no risk discussion. Cannot state the failure domains. Sizing has no derivation."
      },
      {
        "key": "operational_realism",
        "label": "Operational realism",
        "priority": "high",
        "description": "Whether they design for the people who will run it at three in the morning, and for the migration that has to happen before any of it matters.",
        "strongAnswer": "Thinks about monitoring, backup and restore — including whether the restore was ever tested — patching, and who holds the runbook. Has planned a migration or cutover with a rollback path, and can describe one that went wrong. Understands that a design the operating team cannot run is not a good design however elegant.",
        "weakAnswer": "The design ends at the architecture diagram. Backups are mentioned; restores are not. No migration path, or one that assumes a clean cutover. Operability is somebody else's concern."
      },
      {
        "key": "cost_and_vendor_judgement",
        "label": "Cost and vendor judgement",
        "priority": "medium",
        "description": "Whether they can defend a design on money, and whether they see past a vendor's framing of the problem.",
        "strongAnswer": "Reasons about total cost over the life of the thing, including licensing, egress, support, and the staff time to run it. Can describe a cheaper option they chose, or an expensive one they justified. Understands lock-in as a cost with a number attached rather than as a slogan. Has challenged a vendor's sizing.",
        "weakAnswer": "Compares on sticker price or on list price only. Accepts vendor sizing and reference architectures uncritically. Cannot name any ongoing cost beyond the subscription. Treats lock-in as either irrelevant or disqualifying, with no analysis either way."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "legal-counsel",
    "title": "Legal counsel",
    "sector": "legal",
    "competencies": [
      {
        "key": "legal_analysis",
        "label": "Legal analysis",
        "priority": "high",
        "description": "Whether they can separate facts from law, find the operative question, and reason to a defensible position rather than a summary.",
        "strongAnswer": "Identifies which facts actually matter and says what they would need to know. Reasons to a position and cites the basis for it. Can argue the other side credibly, and says where their own position is weakest. Distinguishes settled law from an arguable point and flags which is which.",
        "weakAnswer": "Conclusory, with no authority and no reasoning shown. Cannot construct the opposing argument. Presents every question as equally uncertain. Confuses what the contract says with what the parties intended."
      },
      {
        "key": "commercial_risk_advice",
        "label": "Practical risk advice",
        "priority": "high",
        "description": "Whether the business can do anything with their answer. In-house, an unusable answer is not a cautious answer, it is a non-answer.",
        "strongAnswer": "Gives a recommendation, not just a risk landscape, and quantifies the exposure in terms the business understands — likelihood, magnitude, who would bring it. Can describe a time they said yes to something risky with mitigations, and a time they held a hard no. Distinguishes legal risk from commercial risk from reputational risk and does not collapse them.",
        "weakAnswer": "Every answer is \"it depends\" with no landing. Advises against anything with exposure. Presents risk without magnitude. Cannot describe a time they approved something uncomfortable. The business routes around them and they do not seem to know it."
      },
      {
        "key": "drafting",
        "label": "Drafting precision",
        "priority": "medium",
        "description": "Whether they know why a clause is worded the way it is, and can spot the ambiguity that will matter in two years.",
        "strongAnswer": "Can explain the purpose of a specific clause and what it is defending against. Notices ambiguity when it is pointed at and can describe an instance where wording was later tested. Adapts precedent rather than pasting it, and can say what they changed and why. Writes to be understood by the person who has to comply.",
        "weakAnswer": "Copies precedent without understanding the drafting choices in it. Misses ambiguity even when prompted. Defaults to length and archaic phrasing as a proxy for rigour. Cannot name a clause that later caused a problem."
      },
      {
        "key": "professional_ethics",
        "label": "Professional ethics and independence",
        "priority": "high",
        "description": "Whether they recognise a conflict, a privilege issue, or a pressure to bend early enough to do something about it — and whether they will hold the line in-house, where the client is also the employer.",
        "strongAnswer": "Spots conflicts and privilege issues early and knows the mechanics of handling them. Can describe a time they had to tell their own management something unwelcome, and what happened. Understands where privilege genuinely attaches and where people assume it does. Knows when to bring in external counsel rather than absorbing the risk personally.",
        "weakAnswer": "Misses an obvious conflict. Treats ethics rules as negotiable under commercial pressure. Assumes privilege attaches to anything a lawyer touched. No example of delivering an unwelcome answer upward."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad instructions, bad management, bad luck. Cannot name a judgement call they got wrong."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational or as the business being reckless. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "marketing-manager",
    "title": "Marketing manager",
    "sector": "marketing",
    "competencies": [
      {
        "key": "positioning",
        "label": "Positioning",
        "priority": "high",
        "description": "Whether they can state a sharp position, including who it excludes, and name the alternative they are actually competing against.",
        "strongAnswer": "Can articulate a position in one sentence and say who it deliberately does not appeal to. Knows the real competitive alternative, including \"do nothing\" or \"keep using the spreadsheet\". Can describe repositioning something and what evidence drove it. Comfortable that a sharp position loses some prospects.",
        "weakAnswer": "Messaging that would fit any competitor. Targets everyone. Cannot name what the buyer would do instead. Position was inherited and has never been questioned."
      },
      {
        "key": "channel_judgement",
        "label": "Channel and budget judgement",
        "priority": "high",
        "description": "Whether they know the economics of their own spend and will turn something off.",
        "strongAnswer": "Knows their acquisition cost by channel and how it moved, and can explain what drove the change. Can describe shutting a channel down, including one they had advocated for. Has a thesis for why a channel should work for this product before spending on it. Understands payback and how long their own is.",
        "weakAnswer": "Spends across channels with no thesis. Reports impressions or engagement as outcomes. Cannot state acquisition cost. Chases channels because they are new or because a competitor is there. Nothing has ever been turned off."
      },
      {
        "key": "creative_judgement",
        "label": "Creative judgement",
        "priority": "medium",
        "description": "Whether they can say why one execution beat another in terms other than taste.",
        "strongAnswer": "Separates what they like from what worked, and can give a case where those diverged. Can articulate the mechanism — what the winning version made clearer, easier, or more credible. Has run a test that could have gone against their preference, and describes one that did.",
        "weakAnswer": "Justifies creative choices by personal preference or by what looks professional. No testing. Cannot explain a win beyond that it performed better. Treats brand as beyond evaluation."
      },
      {
        "key": "measurement_and_attribution",
        "label": "Measurement and attribution",
        "priority": "high",
        "description": "Whether they are honest about what marketing can and cannot claim credit for.",
        "strongAnswer": "Knows the limits of their attribution model and says so unprompted. Designs tests with a holdout or a geo split where it matters, and can describe a result that came back flat. Distinguishes correlation from incrementality. Reports a campaign that did not work, and what they concluded.",
        "weakAnswer": "Claims precise attribution from a last-click model. No holdout, ever. Only wins are reported. Reports a lift over a period without accounting for seasonality or a concurrent launch."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "mechanical-engineer",
    "title": "Mechanical engineer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "design_fundamentals",
        "label": "Design fundamentals",
        "priority": "high",
        "description": "Whether they can reason from loads and materials to a design decision, and defend the decision on physical grounds rather than on precedent.",
        "strongAnswer": "Can walk from the load case to the material and geometry choice and say what governed it — stiffness, strength, fatigue, thermal, cost. States the safety factor they used and why that number, not just that it was the standard one. Knows where their design is most likely to fail and can say so unprompted. Comfortable with a rough hand calculation before touching a model.",
        "weakAnswer": "Copied a previous design without knowing what drove its dimensions. Cannot state the governing load case. Uses a safety factor because it is the number everyone uses. Reaches for a material by familiarity and cannot compare it against an alternative on any property."
      },
      {
        "key": "analysis_and_validation",
        "label": "Analysis and validation",
        "priority": "high",
        "description": "Whether they treat simulation as evidence that has to be checked, and whether anything they built was ever measured against what they predicted.",
        "strongAnswer": "Sanity-checks FEA or CFD against a hand calculation and says so as a matter of habit. Can describe a mesh, boundary condition, or contact assumption that turned out to be wrong and how they caught it. Has correlated a model against a physical test, including a case where they disagreed and what that revealed. Knows what their analysis cannot tell them.",
        "weakAnswer": "Reports simulation output as the answer. Cannot state the boundary conditions. Never tested anything physically, or tested and never compared. Treats a converged solution as a correct one. No sense of what the model excludes."
      },
      {
        "key": "manufacturing_awareness",
        "label": "Design for manufacture",
        "priority": "high",
        "description": "Whether they design for a process that exists, at a tolerance somebody can actually hold, at a price the product can carry.",
        "strongAnswer": "Chooses tolerances from function and then checks them against process capability, rather than defaulting to tight. Can describe a stack-up that mattered and how they resolved it. Has changed a design after talking to a machinist, moulder, or supplier, and can say what they learned. Understands roughly what their choices cost.",
        "weakAnswer": "Tolerances everything tightly for safety. No tolerance analysis on an assembly that clearly needed one. Has never spoken to whoever makes the part. Treats manufacturability as somebody else's problem to raise."
      },
      {
        "key": "failure_investigation",
        "label": "Failure investigation",
        "priority": "medium",
        "description": "What they do when a physical thing broke and the reason is not obvious.",
        "strongAnswer": "Describes a real failure: what the fracture surface, wear pattern, or deformation told them, what that ruled out, and how they confirmed the cause rather than assuming it. Distinguishes the failure mode from the root cause. Can name a failure whose cause surprised them, and what changed in the design afterwards.",
        "weakAnswer": "The investigation ends at replacing the part with a stronger one. No examination of the failed component. Cause is asserted from the symptom. Cannot describe a design change that came out of a failure."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "operations-manager",
    "title": "Operations manager",
    "sector": "operations",
    "competencies": [
      {
        "key": "process_design",
        "label": "Process design",
        "priority": "high",
        "description": "Whether they find the actual constraint before improving anything, and whether they measure the difference.",
        "strongAnswer": "Identified the real bottleneck and can say how — where work queued, not where people felt busy. Measured before and after, and knows what else moved at the same time. Designs for the exception case rather than only the happy path. Has removed a process step, not only added them.",
        "weakAnswer": "Optimised something that was not the constraint. No before-measurement, so no way to know it worked. Process grows monotonically. Cannot describe what the exception volume was or where it went."
      },
      {
        "key": "incident_response",
        "label": "Incident response",
        "priority": "high",
        "description": "What they do when the operation breaks, and what changes afterwards.",
        "strongAnswer": "Describes a real incident with a timeline: what they knew when, what they decided under uncertainty, and what they would have wanted to know sooner. Separates containment from cause. The follow-up changed a system, a threshold, or a default — not just a person's behaviour. Can describe an incident they handled badly.",
        "weakAnswer": "No structure to the account. Cause is attributed to an individual's error and the fix is retraining. No post-incident change, or one that was never verified. Every incident described ended well."
      },
      {
        "key": "cost_and_vendor_judgement",
        "label": "Cost and vendor judgement",
        "priority": "medium",
        "description": "Whether they know their own unit economics well enough to negotiate from them.",
        "strongAnswer": "Can state their cost per unit of work and what drives it. Negotiates from data about their own volumes and service levels. Has changed or dropped a vendor and can say what the switch actually cost, including the disruption. Reads what the service level commits the vendor to, not just the headline number.",
        "weakAnswer": "Cannot state their cost drivers. Accepts vendor terms and vendor reporting uncritically. Compares on price alone. Has never tested whether a service level was met."
      },
      {
        "key": "scaling",
        "label": "Scaling",
        "priority": "high",
        "description": "Whether growth in their operation came from structural change or from adding headcount.",
        "strongAnswer": "Knows what broke as volume grew and can name what they changed structurally — automation, a policy change, a different routing, removing a handoff. Distinguishes the work that genuinely needs a person from the work that only historically had one. Can describe deciding to hire rather than automate, with a reason.",
        "weakAnswer": "Every capacity problem was solved by hiring. No automation instinct and no examples. Cannot describe what specifically failed at higher volume. Growth is described in headcount terms throughout."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "product-manager",
    "title": "Product manager",
    "sector": "product",
    "competencies": [
      {
        "key": "user_insight",
        "label": "User insight",
        "priority": "high",
        "description": "Whether their decisions come from what users did, or from what the team assumed users would do.",
        "strongAnswer": "Cites specific observed behaviour — a session they watched, a support pattern, a funnel step people abandoned — and can describe a finding that contradicted their own expectation and changed the plan. Distinguishes what users say they want from the problem underneath it. Has talked to users personally and recently.",
        "weakAnswer": "Reasons from their own use of the product and generalises it. Cites a stakeholder opinion as a user need. Research is something a research team did and handed over. Has never been surprised."
      },
      {
        "key": "prioritisation",
        "label": "Prioritisation",
        "priority": "high",
        "description": "Whether they can actually cut, and whether they can say what the cut cost.",
        "strongAnswer": "Can name something they killed — ideally something they had personally championed — and the evidence that changed their mind. Makes the trade explicit rather than sequencing everything. Understands what a decision closes off, not just what it opens. Comfortable saying a request will never be built and telling the requester.",
        "weakAnswer": "Everything is a priority, in an order. Recites a framework without applying it to a real decision. Nothing was ever cut. Describes saying no in the abstract but every concrete example ends in a compromise that shipped both things."
      },
      {
        "key": "execution",
        "label": "Execution",
        "priority": "high",
        "description": "Whether things they were responsible for actually reached users, and what they did when the plan met reality.",
        "strongAnswer": "Names shipped work and their own role in it precisely. Can describe a launch that slipped and what they cut to recover, or chose not to. Works with engineering on the constraint rather than around it. Has a case where they shipped something smaller than intended and can say whether that was right.",
        "weakAnswer": "Contribution is roadmaps and specifications with no shipped artefact traceable to them. Delays are attributed entirely to engineering. Cannot describe a launch that went badly. Scope was never cut, or was cut without a decision."
      },
      {
        "key": "measurement",
        "label": "Measurement",
        "priority": "high",
        "description": "Whether they know the difference between a metric moving and the thing working.",
        "strongAnswer": "Defines what success would look like before building, including what would count as failure. Understands baselines, comparison groups, and why a launch-week number is not evidence. Can describe a metric that moved for a reason unrelated to their change, and how they found out. Honest about what cannot be attributed.",
        "weakAnswer": "Reports a percentage improvement with no baseline or comparison. Treats correlation as causation and does not engage when the confound is raised. Only reports wins. Metrics chosen after the fact to describe what happened."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "project-manager",
    "title": "Project manager",
    "sector": "operations",
    "competencies": [
      {
        "key": "planning_and_sequencing",
        "label": "Planning and sequencing",
        "priority": "high",
        "description": "Whether their plans reflect how the work actually depends on itself, or are lists of tasks with dates attached. Dependency structure is what makes a plan predictive.",
        "strongAnswer": "Builds plans around real dependencies and knows which path is critical and why. Estimates with a stated basis and a stated uncertainty. Can describe a plan that was wrong and what the estimate had missed.",
        "weakAnswer": "Plans are lists of tasks with dates and no dependency structure. Estimates presented as single numbers with no basis. Every plan described as having gone well, or every failure attributed to outside change."
      },
      {
        "key": "risk_management",
        "label": "Risk management",
        "priority": "high",
        "description": "Whether risk is a live instrument they steer with, or a document produced at kickoff and never opened again.",
        "strongAnswer": "Names the specific risks that mattered, with what each would cost and what would be done. Describes an early warning they acted on before it became a problem. Can name a risk they accepted deliberately, and why.",
        "weakAnswer": "Generic risk register never revisited. Risks that materialised were unforeseeable. No distinction between a risk and an issue. Escalates only once something has already gone wrong."
      },
      {
        "key": "stakeholder_management",
        "label": "Stakeholder management",
        "priority": "high",
        "description": "Whether they can hold competing stakeholders together and deliver bad news while it is still early enough for somebody to act on it.",
        "strongAnswer": "Describes delivering bad news before it was unavoidable, and how it was received. Handles conflicting priorities by making the tradeoff explicit rather than absorbing it silently. Can represent fairly the position of a stakeholder they disagreed with.",
        "weakAnswer": "Status reports stay green until they cannot. Manages by absorbing conflict and taking on the overrun personally. Describes stakeholders as obstacles. No example of an uncomfortable conversation held early."
      },
      {
        "key": "delivery_discipline",
        "label": "Delivery discipline",
        "priority": "medium",
        "description": "Whether the reported state of the project matches its actual state. A status report nobody trusts is worse than none, because decisions get made on it anyway.",
        "strongAnswer": "Status reflects reality including the uncomfortable parts. Controls scope change through a visible decision rather than by absorption. Closes things out and can say what the project actually cost against what was approved.",
        "weakAnswer": "Percentage complete reported with no basis behind it. Scope grows without any decision ever being recorded. Cannot say what a past project ended up costing against what was approved, and treats that as normal."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "qa-engineer",
    "title": "QA engineer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "test_design",
        "label": "Test design",
        "priority": "high",
        "description": "Whether they test where failure is actually likely, or wherever a requirement happened to be written down. Coverage of requirements is not coverage of risk.",
        "strongAnswer": "Designs from failure modes and boundaries rather than from the happy path. Can explain which risks a given suite covers and which it deliberately does not. Uses the requirements as a starting point rather than a boundary.",
        "weakAnswer": "One test per requirement line and nothing else. No boundary, negative, or state cases. Cannot say what the suite does not cover. Coverage percentage offered as evidence of quality."
      },
      {
        "key": "defect_investigation",
        "label": "Defect investigation",
        "priority": "high",
        "description": "Whether a defect report gives a developer something they can act on immediately, or starts a second investigation to work out what was meant.",
        "strongAnswer": "Narrows a defect to minimal reproduction steps and states the conditions it needs. Distinguishes the symptom from the defect. Investigates intermittent failures rather than re-running until green.",
        "weakAnswer": "Reports symptoms with no reproduction path. Files intermittent failures as flaky and moves on. Cannot say whether two similar reports are the same defect. Escalates without having narrowed anything."
      },
      {
        "key": "automation_judgement",
        "label": "Automation judgement",
        "priority": "high",
        "description": "Whether they know what is worth automating — the skill that separates a useful suite from an expensive one.",
        "strongAnswer": "Automates what is stable and repetitive, and argues against automating what is not. Treats a flaky test as a defect in the suite, to be fixed or removed. Can name something they chose to keep manual, and why.",
        "weakAnswer": "Automates everything on principle. Tolerates flaky tests and teaches the team to ignore red. Measures the suite by its size. Cannot name anything not worth automating."
      },
      {
        "key": "quality_advocacy",
        "label": "Quality advocacy",
        "priority": "medium",
        "description": "Whether they can hold a quality line without becoming the department of no. Influence here depends on being right about which risks are worth the delay.",
        "strongAnswer": "Frames quality risk in terms the team can weigh against delivery. Has argued successfully to hold a release, and has also agreed to ship with known defects when that was right. Engages early rather than at the end.",
        "weakAnswer": "Quality asserted as an absolute with no cost acknowledged. Or never pushes back at all. Involved only at the end of the cycle and treats that as inevitable."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "registered-nurse",
    "title": "Registered nurse",
    "sector": "healthcare",
    "competencies": [
      {
        "key": "clinical_reasoning",
        "label": "Clinical reasoning",
        "priority": "high",
        "description": "How they work through a deteriorating or ambiguous presentation, and whether they know the edge of their own scope.",
        "strongAnswer": "Works through a case systematically, states what they would assess and why, and holds more than one possibility open. Recognises anchoring on a first impression as a risk and can describe catching themselves. Safety-nets — says what would make them escalate and by when. Clear about the boundary of their scope and comfortable inside it.",
        "weakAnswer": "Fixes on the first explanation and gathers only confirming information. No safety-netting or reassessment interval. Unclear about scope, or reasons past it. Cannot describe a patient whose presentation surprised them."
      },
      {
        "key": "patient_safety",
        "label": "Safety and escalation",
        "priority": "high",
        "description": "Whether they will escalate when something is wrong, including upwards, including when they might be wrong.",
        "strongAnswer": "Can describe escalating a concern and being right, and escalating and being wrong, and treats the second as equally correct. Has spoken up about someone more senior and can describe how. Treats a near-miss as information about the system rather than about a person. Knows the escalation route and has used it.",
        "weakAnswer": "Reluctant to escalate without certainty. Describes hierarchy as a reason not to speak up. Near-miss examples end in an individual being more careful. Treats protocols as bureaucracy rather than as accumulated failure."
      },
      {
        "key": "privacy_and_compliance",
        "label": "Privacy and professional compliance",
        "priority": "high",
        "description": "Whether careful handling of patient information is instinctive, and whether they understand what the rules protect.",
        "strongAnswer": "Handles confidentiality carefully by default and can describe a specific situation where it required an active decision — a family member asking, a colleague curious, a corridor conversation. Understands the reasoning behind consent and documentation rather than reciting policy. Documents contemporaneously and knows why that matters.",
        "weakAnswer": "Casual about where patient information gets discussed. Cannot describe a privacy judgement they have actually made. Treats documentation as an administrative burden. No sense of when consent is and is not implied."
      },
      {
        "key": "care_communication",
        "label": "Communication under stress",
        "priority": "high",
        "description": "Whether they can explain a frightening thing to a frightened person, and handle being on the receiving end of distress.",
        "strongAnswer": "Can describe a specific difficult interaction — a distressed family, an angry patient, breaking bad news alongside a clinician — including what they said and what they would change. Adjusts language away from jargon without becoming patronising. Acknowledges the emotional dimension as part of the clinical work rather than as separate from it.",
        "weakAnswer": "Only general statements about being caring. Uses clinical jargon with patients. No concrete example. Describes distressed patients or families as difficult without any account of what was happening for them."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary. This matters especially here: a great many excellent nurses are working in their second or third language, and register is not competence.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad staffing, bad handover, bad luck. Cannot name a judgement they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "high",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost. Weighted high here rather than medium: in a clinical team, silence in the face of disagreement is a safety failure.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe raising a concern across a professional boundary — with a doctor, a senior nurse, another department — and how it went. States a colleague's view fairly even where they still think it was wrong. Handovers are treated as a safety-critical act.",
        "weakAnswer": "Frames every conflict as other people being difficult. Avoids conflict entirely and calls it keeping the peace. Cannot produce a concrete example of raising anything upward."
      }
    ]
  },
  {
    "slug": "semiconductor-manager",
    "title": "Semiconductor engineering manager",
    "sector": "operations",
    "competencies": [
      {
        "key": "fab_operations",
        "label": "Fab and production judgement",
        "priority": "high",
        "description": "Whether they understand the line as a system with a bottleneck, queues, and a cycle time, rather than as a set of tools that are each either up or down.",
        "strongAnswer": "Knows where their constraint actually was and can explain how they found it. Reasons about WIP, cycle time, and utilisation together, and understands why running a bottleneck at very high utilisation lengthens the queue in front of it. Can describe a decision to slow something down deliberately, and what it bought. Distinguishes a capacity problem from a scheduling problem.",
        "weakAnswer": "Optimises tool utilisation everywhere as an end in itself. Treats cycle time and throughput as the same lever. Cannot say where the bottleneck was. Every production shortfall is explained by tool downtime with no analysis beneath it."
      },
      {
        "key": "yield_governance",
        "label": "Yield and quality governance",
        "priority": "high",
        "description": "How they run an organisation that has to find causes under pressure — including what they do when the pressure is to ship.",
        "strongAnswer": "Describes the mechanism, not just the outcome: how excursions get triaged, who is allowed to stop a line and on what evidence, how a fix gets confirmed before the hold is released. Can name a time they held product against commercial pressure, and a time they released and were wrong. Distinguishes containment from root cause and does not let the first substitute for the second.",
        "weakAnswer": "Describes yield as a number that went up under their leadership with no mechanism behind it. Escalation is informal and depends on who is on shift. Treats containment as closure. Cannot describe disagreeing with a shipping decision."
      },
      {
        "key": "capacity_and_capital",
        "label": "Capacity and capital judgement",
        "priority": "medium",
        "description": "Whether they can make and defend a case for spending money on tools, and whether they understand what the number they promised depends on.",
        "strongAnswer": "Builds a capacity case from demonstrated tool rates and realistic availability rather than from nameplate figures. States the assumptions the case rests on and what happens if one is wrong. Can describe a request they did not make, or withdrew, because the analysis did not support it. Understands the lead times they are committing to.",
        "weakAnswer": "Capacity numbers arrive with no derivation. Uses vendor throughput figures directly. No sensitivity analysis. Has never had a capital case rejected and cannot say why one might be."
      },
      {
        "key": "engineering_leadership",
        "label": "Leading engineers",
        "priority": "high",
        "description": "Whether they develop the people under them and make decisions without either abdicating or taking over.",
        "strongAnswer": "Can describe letting an engineer run an investigation their own way, including when the manager would have done it differently, and what came of it. Names a specific person they developed and what changed. Distinguishes the decisions they keep from the ones they push down, with a reason. Has delivered hard feedback and can describe how it landed, including when it went badly.",
        "weakAnswer": "Describes the team's results without describing any individual. Solves the technical problems themselves and calls it leading by example. No account of developing anyone. Feedback examples are all hypothetical or all successful."
      },
      {
        "key": "safety_and_compliance",
        "label": "Safety and regulatory accountability",
        "priority": "high",
        "description": "A fab manager owns hazardous chemistry, gas systems, and the people working near them. This is the competency where being wrong is not recoverable.",
        "strongAnswer": "Treats the safety system as something they personally maintain, not as EHS's department. Can describe a near-miss and what structurally changed afterwards — not who was retrained. Has stopped production for a safety reason. Understands why an incident that harmed nobody is still an incident.",
        "weakAnswer": "Delegates safety entirely and describes it as a compliance obligation. Near-miss examples end in retraining or a reminder email. No example of stopping anything. Talks about safety records rather than about failure modes."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  },
  {
    "slug": "semiconductor-process-engineer",
    "title": "Semiconductor process engineer",
    "sector": "engineering",
    "competencies": [
      {
        "key": "process_control",
        "label": "Statistical process control",
        "priority": "high",
        "description": "Whether they understand what a control chart is actually telling them, as opposed to treating limits as pass/fail lines handed down from somewhere.",
        "strongAnswer": "Distinguishes control limits from spec limits and can say why confusing the two causes over-adjustment. Knows what Cp and Cpk each miss. Can describe a time a chart signalled and the correct response was to investigate rather than to tune, and a time it was the reverse. Understands that reacting to common-cause variation makes a process worse, and has watched someone do it.",
        "weakAnswer": "Treats any point near a limit as an excursion. Adjusts the recipe every shift. Quotes capability indices without knowing what distribution assumption sits under them. Cannot explain why a process can be in control and still out of spec."
      },
      {
        "key": "yield_analysis",
        "label": "Yield and excursion analysis",
        "priority": "high",
        "description": "How they behave when yield drops and the cause is not obvious. This is the competency the job actually consists of.",
        "strongAnswer": "Describes a real excursion: what the signature looked like on the wafer map, what that geometry ruled in and out, which lots and tools they used as commonality groups, and how they discriminated between the surviving hypotheses. Mentions the split or the SEM cross-section that settled it. Knows the difference between a correlation across a hundred lots and a cause.",
        "weakAnswer": "The investigation amounts to changing something and watching. Several parameters moved at once. No mention of what would have falsified the hypothesis. Attributes the recovery to a fix without evidence the fix is what did it, or cannot describe an excursion whose cause surprised them."
      },
      {
        "key": "experiment_design",
        "label": "Design of experiments",
        "priority": "high",
        "description": "Whether they can get a real answer out of limited wafers, tool time, and patience from operations.",
        "strongAnswer": "Chooses a design because of what it can resolve, and can say what it is confounded with. Thinks about run order and blocking against drift and shift-to-shift variation before running. Knows roughly how many wafers a given effect size needs and is willing to say an experiment as scoped cannot answer the question. Has killed their own experiment for that reason.",
        "weakAnswer": "One-factor-at-a-time by default with no account of interactions. Cannot name what a fractional design gives up. Runs a split with no replication and reports the difference as real. Treats a p-value as the whole result."
      },
      {
        "key": "equipment_and_metrology",
        "label": "Equipment and metrology judgement",
        "priority": "medium",
        "description": "Whether they can tell a process change from a measurement change, and whether they understand the tool as a physical thing rather than as a recipe interface.",
        "strongAnswer": "Checks gauge capability before believing a shift. Can describe chasing something that turned out to be metrology drift, or a chamber-matching problem that looked like a process problem. Understands why their chamber behaves as it does — what the seasoning does, what the endpoint signal actually measures — rather than only which knob moves which number.",
        "weakAnswer": "Takes the metrology number as truth. No sense of measurement uncertainty relative to the effect being chased. Describes the tool purely through its recipe parameters. Cannot say what would make one chamber differ from its twin."
      },
      {
        "key": "safety_and_contamination",
        "label": "Safety and contamination discipline",
        "priority": "high",
        "description": "Fabs run hazardous chemistry at scale, and cross-contamination can cost months. Whether they treat the rules as load-bearing or as friction.",
        "strongAnswer": "Can explain the reasoning behind a protocol they follow, not just the protocol. Describes stopping a run, or escalating, on a contamination or safety concern that turned out to be nothing — and is comfortable that this was still correct. Thinks about what their change does to the tools downstream of theirs.",
        "weakAnswer": "Describes procedure as bureaucracy that slows engineering down. No example of escalating. Reasons only about their own module. Has never held a lot on a suspicion."
      },
      {
        "key": "logical_reasoning",
        "label": "Logical reasoning",
        "priority": "high",
        "description": "How they handle a problem they have not seen before. General across every role we hire for, and the main thing we compare candidates on.",
        "strongAnswer": "Decomposes an ambiguous problem and states assumptions out loud. Reasons from constraints rather than pattern-matching to a remembered answer. Notices when their own conclusion does not follow, and updates cleanly when given a new constraint rather than defending the first answer.",
        "weakAnswer": "Jumps to a memorised answer. Restates the question instead of advancing on it. Cannot say what would change their mind. Contradicts an earlier statement without noticing, or defends a position after its basis has been removed."
      },
      {
        "key": "communication",
        "label": "Communication",
        "priority": "high",
        "description": "Whether their thinking survives being explained to someone else. Judged on structure and calibration, never on fluency, accent, or vocabulary.",
        "strongAnswer": "Structures the answer before diving in. Calibrates depth to what the listener already knows. Defines jargon when it is load-bearing. Can compress a complicated thing into two sentences without losing the substance.",
        "weakAnswer": "Rambles without landing anywhere. Hides behind jargon rather than using it. Answers a nearby question instead of the one asked. Cannot summarise their own point when asked to."
      },
      {
        "key": "ownership",
        "label": "Ownership and judgement",
        "priority": "high",
        "description": "Whether they can distinguish what they did from what happened around them, and whether they hold themselves to the outcome.",
        "strongAnswer": "Describes decisions they personally made and why. Names tradeoffs they chose between, including ones they got wrong. Owns a mistake with specifics rather than in the abstract. Clearly separates their own contribution from the team's without diminishing either.",
        "weakAnswer": "Every action is attributed to the team and none to themselves. No decision is ever theirs. Failures are always external — bad requirements, bad management, bad luck. Cannot name a tradeoff they misjudged."
      },
      {
        "key": "collaboration",
        "label": "Collaboration and conflict",
        "priority": "medium",
        "description": "How they behave when a colleague disagrees with them, and whether they can represent a position they lost.",
        "strongAnswer": "Handles disagreement by engaging with the other position rather than restating their own. Can describe influencing an outcome without having authority. States a colleague's view fairly even where they still think it was wrong.",
        "weakAnswer": "Frames every conflict as other people being irrational. Avoids conflict entirely and calls it pragmatism. Cannot produce a concrete example of either."
      }
    ]
  }
];
