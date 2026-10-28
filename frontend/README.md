# AICTE KOSH-Rakshak Frontend UI Suite

**AICTE KOSH-Rakshak Frontend** is an enterprise-grade GovTech Single Page Application (SPA) built with React 18, Vite, and Tailwind CSS. It provides physical and logical data-isolated dashboards for all four regulatory stakeholders with zero role overlap.

---

## 1. Multi-Persona Architectural Workspaces

### Persona 1: College Nodal Officer (`role = 'college'`)
- **Theme**: Blue Accent (`#1E3A8A`)
- **Workspaces (4 Tabs)**:
  1. `Deposit Portfolio`: Institutional corpus view, normative deposit check, lock-in countdown, active deficiency alerts.
  2. `FDR Intake & Upload`: Drag-and-drop document intake with 99.7% OCR Auto-Fill and multi-layer validation.
  3. `Renewal & Lineage`: Continuous lineage chain audit, replacement instrument linking with 0-Day coverage gap check.
  4. `Release Petition`: Formal statutory release petition submission and real-time 5-gate progress tracking.

### Persona 2: Regional Scrutiny Officer (`role = 'regional'`)
- **Theme**: Emerald Green (`#14532D`)
- **Workspaces (5 Tabs)**:
  1. `Regional Command`: Camp desks (SRO Chennai & NRO Kanpur), master intake queue, health metrics.
  2. `Forensic Scrutiny`: 6-Layer Multi-Modal Studio (ELA pixel heatmap, compound math recalculation, loophole detection).
  3. `Dual-Source Green Sheet`: Compact registry-style comparison table, live CBS query, NIC e-Office green sheet note drafting with digital e-token signing.
  4. `Validity & Escalations`: Maturity countdown trackers, automated WhatsApp/SMS/Email escalation notice engine.
  5. `Audit Ledger`: Jurisdictional tamper-evident SHA-256 audit trail with 1-click integrity validator.

### Persona 3: AICTE HQ Regulation Bureau Head (`role = 'bureau'`)
- **Theme**: Deep Amber / Burgundy (`#78350F`)
- **Workspaces (5 Tabs)**:
  1. `Heatmap & Forensics`: Nationwide corpus overview (₹38.75 Cr), state risk heatmap, choropleth risk scores.
  2. `Penalty & Inspection`: Autonomous EoA penalty & compliance freeze center with 1-click nationwide enforcement.
  3. `National Litigation`: Ghost encumbrance surveillance, High Court stay monitor, NJDG mock API queries.
  4. `5-Gate Release`: 5-Gate compliance adjudication, digital sealing, and QR-coded Bank Discharge Orders.
  5. `Audit Ledger`: Mass SHA-256 cryptographic audit ledger with block explorer and Merkle root proofs.

### Persona 4: Scheduled Bank Node (`role = 'bank'`)
- **Theme**: Royal Purple (`#581C87`)
- **Workspaces (1 Unified Single-Page Desk)**:
  - `CBS Verification & Overdraft Surveillance`: Top metric KPI strip, inline audit dossier inspection, instant `[Re-confirm Lien]` and `[Flag OD]` handlers, ISO 20022 MT760/MT799 transmission logs.

---

## 2. Key Components Directory
- `Header.tsx`: Unilingual official government header with National Emblem and Parichay SSO controls.
- `TimeTravelSimulator.tsx`: Fast-forward regulatory clock simulator (+15d, +30d, +60d, +90d) for SIH jury demonstration.
- `JudgeDemoBar.tsx`: Instant quick-jump navigation bar to trigger 6 core hackathon evaluation scenarios in 1 click.
- `KoshSahayakChatbot.tsx`: AI Copilot for regulatory APH queries with authoritative citations.
