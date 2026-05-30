# Design Rationale — Leadership Portfolio Redesign

## Core Philosophy: Scan, Don't Read

The fundamental problem with the current portfolio is information overload. When everything has equal weight, nothing communicates. My redesign is built on one principle: **a person should understand the entire employee profile in 3 seconds by scanning, not reading.**

This means:
- Big numbers replace paragraphs
- Visual indicators (rings, bars, color-coded dots) replace text descriptions
- Narratives exist but are hidden — available on demand, never forced
- Every card answers exactly one question, with the answer visible in the header

---

## Design Challenges Addressed

### Challenge 1: The Signal (What do you see first?)

**Position:** Score ring + pace badge — visual, not verbal.

I rejected the sentence approach ("Strong delivery month — 78% completion") because:
1. Sentences require reading. Reading takes seconds. A ring takes milliseconds.
2. A number on a circular ring is a universal visual — everyone knows what 71/100 means instantly
3. The pace badge (Ahead / On Track / Behind) with color coding gives the trajectory without math

The hero section answers: "Who is this person, how are they doing, are they moving forward?" — all without reading a single word.

### Challenge 2: Story vs Data Ordering

**Position:** Data-first, narrative-second — but both visible on the same surface.

The assignment notes that Experiment 2's narrative-first approach felt better for employees but odd for supervisors who wanted numbers first. Rather than choosing one or building two modes, I chose a hybrid: each card leads with scannable data (big numbers, bars, status tags) and follows immediately with the backend-generated narrative paragraph below it. Both are visible without any clicks.

This serves both audiences in a single layout:
- **Employee scanning between meetings (30 seconds):** reads only the numbers and moves on
- **Supervisor doing a review (5 minutes):** scrolls through and reads each narrative for context
- **Mentor seeing this for the first time:** the narrative paragraphs explain the data in plain language

The tradeoff: the page is longer than a pure numbers-only view. But since this is a monthly career artifact (not a daily-check dashboard), the extra length is acceptable — people read this once a month, not 10 times a day.

### Challenge 3: Six Sections — Too Many?

**Position:** Keep all six, but with strict visual hierarchy.

I didn't remove any sections because each answers a distinct question. Instead:
- **Always fully visible:** Delivery (biggest win/loss), Growth Profile (the capability radar), Career Path (forward momentum)
- **Compact by default:** KPI Targets (rows, not cards), Challenges (compact items, resolved ones dimmed)
- **Progressive disclosure:** Deliverable detail list is collapsed — click to expand

This maintains data completeness without overwhelming the page.

### Challenge 4: Constraints — Honesty Without Anxiety

**Position:** Rename to "Challenges." Dim resolved items. Lead with resolution count.

The header shows "5 resolved · 3 open" — the first number you see is the positive one. Resolved items are visually dimmed (opacity: 0.55), making open issues naturally prominent without making the section feel like a failure report. Type badges (talent, budget, etc.) provide categorization without editorializing.

### Challenge 5: Portability and Identity

**Position:** Employee identity is the first thing you see. UID is in the footer.

The hero section leads with name, role, organization, and program — making it immediately clear this is *Rajan's document*, not an anonymous report. The UID is present in the footer (sacred, per the constraint) but not competing for visual attention. All jargon is removed: "IP" → "Original Work", "Rituals" → "Engagement", "QA Pending" → "Awaiting Review."

---

## Key Design Decisions

### 1. Dark Theme
Manufacturing and pharma professionals work long hours on screens. Dark backgrounds reduce eye strain and create a premium feel that makes data "glow" — numbers pop against dark surfaces. It also separates this from the typical corporate white-background report.

### 2. Structured Content Layout (960px max-width)
The portfolio is structured as a single-column flow, resembling a slide deck or professional document rather than a cluttered multi-column dashboard. Widened to a clean 960px layout, it offers premium breathing room on desktop displays while remaining fully responsive on mobile.

### 3. Numbers-First, Visual Narratives
Each card header features a section title on the left and a prominent metric/status on the right. You can scan the entire page reading only headers to get the full picture: 16/20 delivered, 7 original works, 3 hit / 2 miss targets, 5 resolved / 3 open challenges. The backend narrative paragraphs are rendered cleanly below the metrics with a muted left-accent border, making them visually prominent without cluttering the primary scannable numbers.

---

## What I Would Do Differently With More Time

1. **Micro-interaction on score ring:** Hover to show the 6-axis breakdown as a tooltip
2. **Month-over-month sparklines:** Tiny trend lines next to each axis score showing 3-month trajectory
3. **Print/PDF mode:** A media query that optimizes for print (white background, compact layout)
4. **Animated career runway:** The dots would animate sequentially on load, creating a sense of journey
5. **Narrative toggle:** A button to overlay narrative paragraphs onto each section for the "deep read" mode

---

## Data Fidelity

Every element in the design maps to fields in `data-model.ts`:

| UI Element | Backend Field |
|---|---|
| Score Ring (71) | `executive_summary.data.compositeScore` |
| Pace Badge | `executive_summary.data.paceStatus` |
| Level Badge | `executive_summary.data.currentLevel` + `career_trajectory.data.projectedNextLevel` |
| Delta (+7) | `compositeScore - previousMonthScore` |
| 16/20 Delivered | `contribution_highlights.data.completed` / `totalDeliverables` |
| 7 Original Works | `contribution_highlights.data.ipCommitCount` |
| Axis Bars | `capability_growth.data.*` |
| KPI Rows | `kpi_impact.data.details[]` |
| Challenge Items | `constraint_patterns.data.topConstraints[]` |
| Career Runway | `career_trajectory.data.milestones[]` |
| Gap Drivers | `career_trajectory.data.gapDrivers[]` |
| UID | `uid` |
| Generated Date | `generatedAt` |

No fields were invented. The design renders only what the backend produces.
