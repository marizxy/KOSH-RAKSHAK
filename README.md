<div align="center">

# 🏛️ AICTE KOSH-Rakshak (कौश-रक्षक)
### Autonomous Security Deposit & FDR Lifecycle Surveillance Platform
**Ministry of Education, Government of India • All India Council for Technical Education (AICTE)**  
*Regulatory Framework: AICTE Approval Process Handbook (APH 2026-27) & Banking Regulation Act 1949 (Sec 45)*  
**Problem Statement ID: 26265**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions)](.github/workflows/frontend-build.yml)
[![Security Standard](https://img.shields.io/badge/Security-NIST_FIPS_180--4_SHA256-blue?style=for-the-badge&logo=shield)](SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)
[![GovTech Stack](https://img.shields.io/badge/Architecture-Enterprise_Microservices-emerald?style=for-the-badge)](docs/ARCHITECTURE.md)
[![Deployment](https://img.shields.io/badge/Live_Node-http%3A%2F%2Flocalhost%3A5173-blueviolet?style=for-the-badge)](http://localhost:5173/)

</div>

---

## 📌 Executive Summary

Every technical institution in India is mandated by law to maintain an unencumbered Joint Security Deposit (Fixed Deposit Receipt) in favor of the **Member Secretary, AICTE, New Delhi** for an 8-year lock-in period. 

Historically, this regulatory process has suffered from **systemic vulnerabilities**:
1. **Photoshop & Physical Forgeries**: Colleges altering printed principal amounts without actual bank deposits.
2. **Secret Commercial Overdrafts**: Pledging fixed deposits to commercial banks as collateral for private loans, breaching statutory negative liens.
3. **Compound Math Arithmetic Discrepancies**: Inconsistent interest compounding disguising massive principal deficits.
4. **Mandate Loopholes**: Pledging deposits under *"Either or Survivor"* clauses, allowing unilateral withdrawal without AICTE discharge orders.
5. **Coverage Gaps during Renewals**: Lapses between maturity and replacement instruments.

**AICTE KOSH-Rakshak** solves this through a **Tripartite Multi-Modal Architecture**: Independent Institutional Declarations $\leftrightarrow$ 6-Layer AI Computer Vision Forensics $\leftrightarrow$ Real-Time Core Banking System (CBS) SFMS MT760/MT799 Validation, anchored in a **NIST FIPS 180-4 SHA-256 Tamper-Evident Cryptographic Ledger**.

---

## 🗂️ Enterprise Monorepo Structure

```text
aicte-kosh-rakshak/
├── .github/
│   ├── workflows/                  # CI/CD Automation Pipelines
│   │   ├── frontend-build.yml      # React/Vite Type Check & Production Bundle
│   │   ├── backend-test.yml        # Node.js API & Ledger Cryptographic Tests
│   │   └── ai-deploy.yml           # Python ELA & OpenCV Pipeline Tests
│   └── ISSUE_TEMPLATE/             # Standardized GovTech Issue & Bug Tracking
│       ├── bug_report.md
│       ├── feature_request.md
│       └── config.yml
├── frontend/                       # Enterprise React 18 + Vite + Tailwind Client
│   ├── package.json
│   └── README.md
├── backend/                        # Node.js Express REST & Microservices Engine
│   ├── package.json
│   ├── README.md
│   └── src/server.js               # API Server, Health Checks, CBS Stubs
├── ai-forensics/                   # Multi-Modal Forensic Scrutiny Suite
│   ├── requirements.txt
│   ├── README.md
│   └── ela_analyzer.py             # Error Level Analysis & Compounding Math Engine
├── blockchain-ledger/              # Immutable Cryptographic Audit Trail
│   ├── README.md
│   └── ledger_engine.js            # SHA-256 Block Hashing & Merkle Chain Validator
├── database/                       # Relational Persistence Tier
│   ├── schema.sql                  # PostgreSQL 16 Enterprise DDL & Constraints
│   ├── seeds/sample_fdrs.sql       # Seed Dataset for All 4 Hackathon Scenarios
│   └── README.md
├── devops/                         # Containerization & Server Deployment
│   ├── Dockerfile.frontend         # Multi-stage Nginx Alpine Build
│   ├── Dockerfile.backend          # Hardened Node.js Alpine Container
│   ├── Dockerfile.ai               # Python FastAPI + Tesseract Container
│   ├── nginx.conf                  # Production Reverse Proxy with CSP & HSTS
│   └── README.md
├── docs/                           # Technical Specifications & Documentation
│   ├── ARCHITECTURE.md             # System Mermaid Architecture & Sequences
│   ├── API_COLLECTION.json         # Complete Postman/Insomnia API Suite
│   └── USER_MANUAL.md              # User Manual for All 4 Authorized Personas
├── tests/                          # Automated Quality Assurance Tier
│   ├── unit/fdr_math.test.js       # Actuarial Compounding & SHA-256 Tests
│   ├── e2e/login_rbac.spec.js      # Zero Data Overlap RBAC Simulation
│   ├── load/stress_cbs_handshake.js# k6 Load Testing Script
│   └── README.md
├── src/                            # Active Portal Implementation & Components
├── docker-compose.yml              # 1-Click Multi-Container Production Stack
├── setup.sh                        # One-Click Autonomous Bootstrap Script
├── Makefile                        # Command Runner (install, build, test, docker)
├── SECURITY.md                     # Vulnerability Reporting & CERT-In Directives
├── CODE_OF_CONDUCT.md              # Contributor Covenant v2.1
├── CONTRIBUTING.md                 # Contribution Guidelines & Git Branching
└── LICENSE                         # MIT License (Copyright 2026 Mariyon Decosta L)
```

---

## ⚡ Quick Start: One-Click Installation

### Option 1: Automated Shell Bootstrap (Recommended)
```bash
git clone https://github.com/your-username/aicte-kosh-rakshak.git
cd aicte-kosh-rakshak
chmod +x setup.sh
./setup.sh
```

### Option 2: Using Makefile
```bash
make install
make start-frontend
```
The portal will be immediately accessible at **`http://localhost:5173/`**.

### Option 3: Full-Stack Multi-Container Docker Stack
```bash
docker-compose up -d --build
```
Spins up PostgreSQL, Redis, Backend API, Python AI Forensics, MinIO Vault, and Nginx Frontend in isolated bridge networks.

---

## 🛡️ Role-Based Access Control (RBAC) Architecture

The application enforces **strict zero-trust data isolation** with zero cross-role leakage:

| Persona | Jurisdiction / Scope | Dedicated Workspaces |
|---------|----------------------|----------------------|
| **1. College Nodal Officer** | Strictly isolated to own institution records (Apex Institute) | `Deposit Portfolio`, `FDR Intake & Upload`, `Renewal & Lineage`, `Release Petition` |
| **2. Regional Scrutiny Officer** | Scoped to jurisdictional camp desks (SRO Chennai & NRO Kanpur) | `Regional Command`, `Forensic Scrutiny`, `Dual-Source Green Sheet`, `Validity & Escalations`, `Audit Ledger` |
| **3. AICTE HQ Bureau Head** | Nationwide super-admin visibility across all states and institutions | `Heatmap & Forensics`, `Penalty & Inspection`, `National Litigation`, `5-Gate Release`, `Audit Ledger` |
| **4. Scheduled Bank Node** | Scoped to financial instruments issued by the authenticated bank | `CBS Verification & Overdraft Surveillance Desk` (Consolidated Single-Tab View) |

---

## 🎯 6 High-Level Evaluation Scenarios (SIH Jury Quick-Jump)

Use the interactive floating demo bar at the bottom of the portal to trigger any scenario instantly:

1. **Demo 1: College FDR Intake & 99.7% OCR Auto-Fill**:
   - Institutional document upload with instantaneous metadata parsing and APH normative deposit checks.
2. **Demo 2: Forensic ELA & Arithmetic Forgery Detection**:
   - Exposes digital tampering in FDR certificates via Error Level Analysis heatmaps and actuarial compound interest recalculation.
3. **Demo 3: Live Bank CBS Handshake & e-Office Green Sheet**:
   - Executes real-time Finacle/BaNCS API handshake uncovering an undisclosed ₹22 Lakhs commercial overdraft; generates and signs official NIC e-Office green sheet note.
4. **Demo 4: Time-Travel Simulator (+60 Days) & Escalation Matrix**:
   - Advances system clock by 60 days, triggering autonomous multi-tier WhatsApp/SMS/Email escalation warnings and Extension of Approval (EoA) freeze.
5. **Demo 5: Renewal Submission & Lineage Chain**:
   - Validates continuous legal coverage, connecting matured instruments to replacement FDRs with 0-Day coverage gap check.
6. **Demo 6: 5-Gate Release Rule Engine & QR Discharge Order**:
   - Evaluates all 5 statutory compliance gates, grants Gate 5 digital bureau sanction, and generates official cryptographic QR-coded Bank Discharge Orders.

---

## 📜 License & Copyright

Distributed under the **MIT License**.  
**Copyright (c) 2026 Mariyon Decosta L**  
See [`LICENSE`](LICENSE) for full legal text.
