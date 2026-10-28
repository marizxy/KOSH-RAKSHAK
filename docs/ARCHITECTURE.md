# AICTE KOSH-Rakshak: Technical Architecture Document

## 1. System Context & Overview
The **AICTE KOSH-Rakshak** platform provides unified, end-to-end lifecycle management, algorithmic verification, and cryptographic custody for technical educational institutions' mandatory security deposits under the AICTE Approval Process Handbook (APH 2026-27).

```mermaid
graph TD
    subgraph ClientLayer["GovTech Presentation Layer"]
        UI_COLLEGE["College Nodal Portal"]
        UI_RO["Regional Officer Desk"]
        UI_HQ["Regulation Bureau Super Admin"]
        UI_BANK["Scheduled Bank CBS Node"]
    end

    subgraph GatewayLayer["Secure API Gateway & Reverse Proxy"]
        NGINX["Nginx Ingress (TLS 1.3 / CSP)"]
        AUTH_ROUTER["NIC Parichay SSO / JWT Authenticator"]
    end

    subgraph ServiceLayer["Core Microservices Engine"]
        REST_API["Node.js Express REST Engine"]
        AI_ENGINE["Python FastAPI ELA & OCR Forensics"]
        LEDGER["NIST FIPS 180-4 SHA-256 Block Engine"]
        CBS_GATEWAY["RBI SFMS / CBS Protocol Adapter"]
    end

    subgraph DataLayer["Persistence & Storage Tier"]
        POSTGRES[("PostgreSQL 16 Relational DB")]
        REDIS[("Redis 7 Pub/Sub & Cache")]
        S3_VAULT[("MinIO Encrypted Document Vault")]
    end

    ClientLayer --> NGINX
    NGINX --> AUTH_ROUTER
    AUTH_ROUTER --> REST_API
    REST_API --> AI_ENGINE
    REST_API --> LEDGER
    REST_API --> CBS_GATEWAY
    REST_API --> POSTGRES
    REST_API --> REDIS
    REST_API --> S3_VAULT
```

---

## 2. Dual-Source Corroboration Sequence

```mermaid
sequenceDiagram
    autonumber
    actor College as College Nodal Officer
    participant Portal as KOSH-Rakshak Gateway
    participant AI as 6-Layer Forensic Engine
    participant Bank as Core Banking Host (CBS)
    actor RO as Regional Scrutiny Officer
    actor HQ as Bureau Head (HQ)

    College->>Portal: Upload Scanned FDR (PDF/JPEG)
    Portal->>AI: Trigger 6-Layer Multi-Modal Scrutiny
    AI-->>Portal: ELA Heatmap + Math Compounding Check
    Portal->>Bank: Execute Live CBS SFMS MT760 Handshake
    Bank-->>Portal: Confirm Lien & Check Secret Overdrafts
    Portal->>RO: Populate Dual-Source Green Sheet Registry
    RO->>Portal: Digitally Sign Note Sheet via NIC e-Token
    Portal->>HQ: Queue 5-Gate Adjudication
    HQ->>Portal: Authorize Gate 5 Digital Sanction
    Portal-->>Bank: Issue Cryptographic QR Discharge Order
```

---

## 3. Cryptographic Proof Standard
- Block header hash calculated over:
  $$\text{CurrentHash} = \text{SHA256}(\text{Index} \parallel \text{Timestamp} \parallel \text{Role} \parallel \text{User} \parallel \text{Action} \parallel \text{Details} \parallel \text{PreviousHash})$$
- Zero-knowledge Merkle verification ensures individual institutions can verify their deposit status without exposing other institutions' private data.
