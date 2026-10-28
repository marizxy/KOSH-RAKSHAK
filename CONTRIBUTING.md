# Contributing to AICTE KOSH-Rakshak

Thank you for your interest in contributing to the **AICTE KOSH-Rakshak** national regulatory infrastructure. We welcome bug fixes, documentation enhancements, forensic algorithm improvements, and security auditing.

## 1. Development Principles
- **Regulatory Integrity First**: All logic must conform to the statutory provisions of the **AICTE Approval Process Handbook (APH 2026-27)**.
- **Cryptographic Immutability**: All administrative actions must be logged with SHA-256 hash chains. Never bypass the ledger.
- **Zero-Trust Role Scoping**: Features must respect strict RBAC separation between College, Regional Officer, Bureau Head, and Bank roles.

---

## 2. Getting Started

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/your-username/aicte-kosh-rakshak.git
   cd aicte-kosh-rakshak
   ```

2. **Execute One-Click Setup**:
   ```bash
   ./setup.sh
   # or
   make setup
   ```

3. **Launch the Local Development Server**:
   ```bash
   make start-frontend
   ```

---

## 3. Branching Strategy & Git Workflow
- `main`: Production-ready release branch.
- `develop`: Integration branch for upcoming regulatory features.
- Feature branches: `feat/feature-name` (e.g., `feat/sfms-mt799-parser`)
- Bugfix branches: `fix/issue-description` (e.g., `fix/compound-math-roundoff`)
- Hotfixes: `hotfix/critical-security-patch`

### Commit Message Guidelines:
We follow the Conventional Commits specification:
```text
feat(forensics): integrate OpenCV ELA pixel variance analyzer
fix(cbs): handle timeout exceptions on RBI SFMS gateway handshake
docs(spec): update Section 16 top tab segmented control architecture
test(math): add quarterly compounding actuarial test cases
```

---

## 4. Pull Request Checklist
Before submitting a pull request, ensure:
- [ ] `npm run build` completes with **0 TypeScript and Vite errors**.
- [ ] Cryptographic ledger test cases pass (`make test`).
- [ ] No Devanagari Unicode characters exist in frontend UI code (strictly English localization).
- [ ] Documentation is updated in `/docs` and `AICTE_KOSH_RAKSHAK_SPECIFICATION.md`.
