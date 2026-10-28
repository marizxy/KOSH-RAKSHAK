# AICTE KOSH-Rakshak Backend REST & Cryptographic Service

The **AICTE KOSH-Rakshak Backend** provides secure REST APIs, WebSocket state synchronization, and tamper-evident SHA-256 block ledger hashing for regulatory custody verification.

---

## 1. Core Endpoints Overview

| Method | Endpoint | Description | Auth Scope |
|--------|----------|-------------|------------|
| `GET` | `/health` | Service uptime and cryptographic status | Public |
| `GET` | `/api/v1/ledger/blocks` | Fetch scoped SHA-256 audit ledger blocks | Scoped RBAC |
| `POST` | `/api/v1/bank/cbs-handshake` | Execute live CBS / SFMS MT760 query | Bank / RO / HQ |
| `POST` | `/api/v1/release/sanction-gate5` | Digitally sign Gate 5 Bureau Sanction & issue QR | Bureau Head Only |
| `POST` | `/api/v1/forensics/analyze-ela` | Forward scanned FDR to AI Forensics Engine | Regional Scrutiny |

---

## 2. Authentication & Data Isolation Middleware
- Enforces JWT and NIC Parichay token verification with RBAC checks.
- Intercepts requests and scopes data queries strictly to authorized jurisdiction IDs:
  - `college`: Filtered strictly by institution ID (`1-482910411`).
  - `regional`: Filtered strictly by region codes (`SRO`, `NRO`).
  - `bureau`: Global nationwide access.
  - `bank`: Filtered by issuing bank IFSC prefix.
