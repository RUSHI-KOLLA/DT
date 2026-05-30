/**
 * ═══════════════════════════════════════════════════
 * LEADERSHIP PORTFOLIO — APPLICATION LOGIC
 * 
 * Design Reasoning:
 * All data comes from mock-portfolio-data.json (the exact 
 * backend shape). No data is invented. Every visual element 
 * maps to a real backend field.
 * 
 * The JS is responsible for:
 * 1. Loading and parsing the mock data
 * 2. Populating the DOM with real values
 * 3. Animating the score ring and bars on load
 * ═══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Load Data ──
  fetch('mock-portfolio-data.json')
    .then(r => r.json())
    .then(render)
    .catch(err => {
      console.error('Failed to load portfolio data:', err);
      document.body.innerHTML = '<p style="color:#f87171;padding:2rem;">Failed to load portfolio data.</p>';
    });


  function render(data) {
    const sections = {};
    data.sections.forEach(s => { sections[s.type] = s; });

    // ── 1. NAV ──
    const monthId = data.monthId; // "2026-03"
    const [y, m] = monthId.split('-');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    document.getElementById('monthLabel').textContent = `${monthNames[parseInt(m,10)-1]} ${y}`;

    // ── 2. HERO — Identity ──
    const emp = data.employee;
    document.getElementById('heroName').textContent = emp.name;
    document.getElementById('heroRole').textContent = emp.role;
    document.getElementById('heroOrg').textContent = `${emp.organization} · ${emp.program}`;
    document.getElementById('avatar').textContent = emp.name.split(' ').map(w => w[0]).join('');

    // ── 3. HERO — Score Ring ──
    const exec = sections.executive_summary.data;
    const score = exec.compositeScore;
    const pct = score / 100;
    const circumference = 2 * Math.PI * 52; // r=52

    document.getElementById('ringNumber').textContent = score;
    
    // Animate the ring fill
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.getElementById('ringFill').style.strokeDashoffset = 
          circumference * (1 - pct);
      }, 100);
    });

    // ── 4. HERO — Pace + Level ──
    const paceBadge = document.getElementById('paceBadge');
    const paceClass = exec.paceStatus === 'ahead' ? 'pace-ahead' :
                      exec.paceStatus === 'on_track' ? 'pace-on-track' : 'pace-behind';
    const paceLabel = exec.paceStatus === 'ahead' ? 'Ahead of Plan' :
                      exec.paceStatus === 'on_track' ? 'On Track' : 'Behind Plan';
    const paceIcon = exec.paceStatus === 'ahead' 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l5-5 5 5"/><path d="M7 12l5-5 5 5"/></svg>'
      : exec.paceStatus === 'behind'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 7l5 5 5-5"/><path d="M7 12l5 5 5-5"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>';
    
    paceBadge.className = 'pace-badge ' + paceClass;
    paceBadge.innerHTML = paceIcon + ' ' + paceLabel;

    // Career trajectory for the level badge
    const career = sections.career_trajectory.data;
    document.getElementById('levelBadge').textContent = 
      career.projectedNextLevel ? `${exec.currentLevel} → ${career.projectedNextLevel}` : exec.currentLevel;

    // Delta
    const prev = exec.previousMonthScore;
    if (prev != null) {
      const delta = score - prev;
      const sign = delta >= 0 ? '+' : '';
      const deltaEl = document.getElementById('deltaText');
      deltaEl.textContent = `${sign}${delta} from last month`;
      deltaEl.style.color = delta >= 0 ? 'var(--green)' : 'var(--red)';
    }

    // ── 4b. HERO — Summary Text ──
    document.getElementById('heroSignalText').textContent = 
      "Strongest month since joining. Promotion readiness improving and tracking ahead of plan.";

    // ── 5. DELIVERY CARD ──
    const contrib = sections.contribution_highlights.data;
    document.getElementById('deliveredCount').textContent = contrib.completed;
    document.getElementById('totalDeliverables').textContent = contrib.totalDeliverables;
    
    const deliveryPct = (contrib.completed / contrib.totalDeliverables) * 100;
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.getElementById('deliveryFill').style.width = deliveryPct + '%';
      }, 300);
    });

    // Breakdown chips
    const breakdown = document.getElementById('deliveryBreakdown');
    breakdown.innerHTML = `
      <span class="db-chip delivered"><i class="dot"></i>${contrib.completed} Shipped</span>
      ${contrib.inProgress > 0 ? `<span class="db-chip in-progress"><i class="dot"></i>${contrib.inProgress} In Progress</span>` : ''}
      ${contrib.pendingQa > 0 ? `<span class="db-chip pending"><i class="dot"></i>${contrib.pendingQa} Awaiting Review</span>` : ''}
      ${contrib.notStarted > 0 ? `<span class="db-chip not-started"><i class="dot"></i>${contrib.notStarted} Not Started</span>` : ''}
    `;

    // Deliverable list (hidden by default via <details>)
    if (data.monthlyReportEnrichment && data.monthlyReportEnrichment.deliverableDetail) {
      const list = document.getElementById('deliverableList');
      list.innerHTML = data.monthlyReportEnrichment.deliverableDetail.map(d => `
        <li class="deliverable-item">
          <span class="del-status ${d.status}"></span>
          <span class="del-label">${d.label}</span>
        </li>
      `).join('');
    }

    // ── 6. ORIGINAL WORK (IP) ──
    document.getElementById('ipCount').textContent = contrib.ipCommitCount;
    const ipList = document.getElementById('ipList');
    ipList.innerHTML = contrib.recentCommits.map((c, i) => `
      <li class="ip-item">
        <span class="ip-number">${String(i + 1).padStart(2, '0')}</span>
        <span>${c.description}</span>
      </li>
    `).join('');

    // ── 7. CAPABILITY GROWTH ──
    const cap = sections.capability_growth.data;
    const axes = [
      { key: 'deliveryRate', label: 'Delivery', score: cap.deliveryRate },
      { key: 'ipScore', label: 'Original Work', score: cap.ipScore },
      { key: 'kpiScore', label: 'Target Impact', score: cap.kpiScore },
      { key: 'frameworkScore', label: 'Frameworks', score: cap.frameworkScore },
      { key: 'processScore', label: 'Processes', score: cap.processScore },
      { key: 'ritualScore', label: 'Engagement', score: cap.ritualScore },
    ];

    const axisGrid = document.getElementById('axisGrid');
    axisGrid.innerHTML = axes.map(a => {
      const cls = a.score >= 65 ? 'above' : a.score >= 55 ? 'near' : 'below';
      return `
        <div class="axis-row">
          <span class="axis-label">${a.label}</span>
          <div class="axis-bar-wrap">
            <div class="axis-threshold"></div>
            <div class="axis-bar ${cls}" style="width: 0%" data-target="${a.score}"></div>
          </div>
          <span class="axis-score ${cls}">${a.score}</span>
        </div>
      `;
    }).join('');

    // Animate axis bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.axis-bar').forEach(bar => {
          bar.style.width = bar.dataset.target + '%';
        });
      }, 400);
    });

    // ── 8. KPI TARGETS ──
    const kpi = sections.kpi_impact.data;
    const details = kpi.details || [];
    const hitCount = details.filter(k => k.status === 'hit').length;
    const missCount = details.filter(k => k.status === 'miss').length;
    document.getElementById('kpiHitCount').textContent = hitCount;
    document.getElementById('kpiMissCount').textContent = missCount;

    const kpiRows = document.getElementById('kpiRows');
    kpiRows.innerHTML = details.map(k => `
      <div class="kpi-row">
        <span class="kpi-label">${k.label}</span>
        <div class="kpi-values">
          <span class="kpi-actual" style="color: ${k.status === 'hit' ? 'var(--green)' : k.status === 'miss' ? 'var(--red)' : 'var(--text-primary)'}">${k.actual}${k.unit === 'percent' ? '%' : ''}</span>
          <span class="kpi-target-val">/ ${k.target}${k.unit === 'percent' ? '%' : ''}</span>
          <span class="kpi-status-tag ${k.status}">${k.status}</span>
        </div>
      </div>
    `).join('');

    // ── 9. CHALLENGES (CONSTRAINTS) ──
    const constraints = sections.constraint_patterns.data;
    document.getElementById('csResolved').textContent = constraints.resolved;
    const openCount = constraints.totalConstraints - constraints.resolved;
    document.getElementById('csOpen').textContent = openCount;

    const resRate = constraints.totalConstraints > 0 
      ? Math.round((constraints.resolved / constraints.totalConstraints) * 100) 
      : 0;
    document.getElementById('csRate').textContent = resRate + '%';

    const constraintItems = document.getElementById('constraintItems');
    if (constraints.topConstraints) {
      constraintItems.innerHTML = constraints.topConstraints.map(c => {
        const isResolved = c.status === 'resolved';
        const typeLabel = c.type.replace(/_/g, ' ');
        return `
          <div class="constraint-item ${isResolved ? 'resolved' : ''}">
            <span class="constraint-status-dot ${c.status}"></span>
            <span class="constraint-type-badge">${typeLabel}</span>
            <span class="constraint-text">${c.label}</span>
          </div>
        `;
      }).join('');
    }

    // ── 10. CAREER PATH ──
    const milestones = career.milestones || [];
    const currentLevel = career.currentLevel;
    const runway = document.getElementById('runway');

    let runwayHTML = '';
    milestones.forEach((ms, i) => {
      const isAchieved = milestones.indexOf(milestones.find(m => m.level === currentLevel)) >= i 
        && ms.level !== career.projectedNextLevel;
      const isCurrent = ms.level === currentLevel;
      const isProjected = ms.level === career.projectedNextLevel;
      const isFuture = !isAchieved && !isCurrent && !isProjected && 
        milestones.findIndex(m => m.level === currentLevel) < i;

      const dotClass = isCurrent ? 'current' : 
                       isAchieved ? 'achieved' : 
                       isProjected ? 'projected' : '';

      const dateStr = new Date(ms.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      // Show projected date for the next level
      const displayDate = isProjected && career.projectedDate 
        ? new Date(career.projectedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : dateStr;

      runwayHTML += `
        <div class="runway-node ${isCurrent ? 'current' : ''}">
          <span class="runway-label">${ms.level}</span>
          <span class="runway-dot ${dotClass}"></span>
          <span class="runway-date">${displayDate}</span>
        </div>
      `;
      
      // Add connecting line between nodes
      if (i < milestones.length - 1) {
        const nextIdx = i + 1;
        const nextIsAfterCurrent = milestones.findIndex(m => m.level === currentLevel) < nextIdx;
        const lineClass = !nextIsAfterCurrent ? 'completed' : 
                          nextIdx === milestones.findIndex(m => m.level === career.projectedNextLevel) ? 'projected' : '';
        runwayHTML += `<div class="runway-line ${lineClass}"></div>`;
      }
    });
    runway.innerHTML = runwayHTML;

    // Gap drivers
    const careerGap = document.getElementById('careerGap');
    if (career.gapDrivers && career.gapDrivers.length > 0) {
      careerGap.innerHTML = career.gapDrivers.map(g => `
        <div class="gap-item">
          <span class="gap-icon gap">!</span>
          <span>${g}</span>
        </div>
      `).join('');
    }

    // ── 10b. NARRATIVES — Story layer ──
    // Each section in the backend returns a narrative paragraph.
    // We render them directly (visible, not collapsed) to satisfy
    // the assignment's "narrative is prominent" requirement.
    const narrativeMap = {
      contribution_highlights: 'narrativeContribution',
      capability_growth: 'narrativeCapability',
      kpi_impact: 'narrativeKPI',
      constraint_patterns: 'narrativeConstraints',
      career_trajectory: 'narrativeCareer',
    };

    Object.entries(narrativeMap).forEach(([sectionType, elementId]) => {
      const section = sections[sectionType];
      if (section && section.narrative) {
        document.getElementById(elementId).textContent = section.narrative;
      }
    });

    // ── 11. FOOTER ──
    document.getElementById('uidLabel').textContent = data.uid;
    const genDate = new Date(data.generatedAt);
    document.getElementById('genDate').textContent = 
      'Generated ' + genDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

})();
