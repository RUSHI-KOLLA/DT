# PDGMS Leadership Portfolio Redesign

An interactive, narrative-first redesign of the monthly **Leadership Portfolio** page for the PDGMS platform. This prototype demonstrates the transition from a clinical, metric-heavy dashboard into a structured, personal career pitch deck that tells a story.

### Live Prototype Verification
* **Walkthrough & Verification Details:** [walkthrough.md](walkthrough.md)
* **Design Strategy & Choices Document:** [design_rationale.md](design_rationale.md)

---

## 🚀 The Redesign Thesis

A typical **dashboard** is built for monitoring—it assumes the reader is checking for anomalies. The **Leadership Portfolio** is a monthly career artifact owned by the employee—it should feel like a **personal career pitch deck**:
1. **Story-First, Evidence-Second:** Leads with narrative blocks describing wins and growth, backed by detailed data.
2. **Clear Signal Hierarchy:** One prominent signal banner answers "how did I do?" within 3 seconds, removing clinical metric soup.
3. **Reframed Constraints:** Converts blockers into active "Obstacles Logged & Resolved" trackers.
4. **Portability:** Translates internal platform jargon (e.g., `IP Commits`, `Frameworks`, `Rituals`) into standard professional terms so external mentors or future employers can read it.

---

## 🛠️ Project Structure & Local Setup

The prototype is built as a static web application using vanilla HTML5, CSS3, and JavaScript, ensuring zero setup friction and full portability.

### File Manifest:
* `index.html` - Premium single-page portfolio interface presenting a scannable, narrative-first pitch deck.
* `style.css` - Custom styling library (CSS variables, HSL color system, dark glassmorphism, responsive layout, Outfit and Inter typography).
* `app.js` - Dynamic UI population using fetch to load Rajan Iyer's profile JSON data.
* `design_rationale.md` - Core design documentation answering the 5 PM design challenges.

### To Run Locally:
Open `index.html` directly in any web browser, or spin up a simple local server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 📐 Solutions to Design Challenges

We have addressed the following core design challenges (detailed in `design_rationale.md`):

### 1. The Signal (First 3 Seconds)
The hero section features a visual score ring (71/100) and pace status badge (Ahead of Plan) for split-second parsing, paired with a clear executive narrative sentence ("Strongest month since joining...") that adds qualitative context.

### 2. Story vs. Data Ordering
Each card displays a scannable summary of metrics at the top, with the backend-generated narrative paragraph rendered directly below it, highlighted by a left-accent border. Raw deliverables can be expanded on demand via progressive disclosure.

### 3. Obstacle Representation (Reframing Constraints)
Renamed "Constraints" to **"Challenges"**. It tracks an active resolution rate (62.5%), categorizes blockers visually (e.g., *Permissions, Support, Talent*), and details each issue, with resolved items visually dimmed to emphasize open blockers.

### 4. Jargon Elimination (Portability)
All platform jargon has been translated to be universally understandable:
* `IP Commits` ➔ **Original Work**
* `Rituals` ➔ **Engagement**
* `Constraints` ➔ **Challenges**
* `QA Pending` ➔ **Awaiting Review**
* `V2 / V3` ➔ **Manager / Program Lead**
* The **UID** is prominently displayed as a permanent credential.
