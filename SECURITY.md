# Security Policy: AICTE KOSH-Rakshak

## 1. Regulatory Context & Security Framework
The **AICTE KOSH-Rakshak** platform manages national regulatory custody of institutional Fixed Deposit Receipts (FDRs) and statutory security deposits totaling hundreds of crores across all AICTE-approved technical institutions in India.

The platform is designed in accordance with:
- **Ministry of Electronics and Information Technology (MeitY)** Cybersecurity Guidelines.
- **Indian Computer Emergency Response Team (CERT-In)** Security Directives.
- **AICTE Approval Process Handbook (APH 2026-27)** Chapter 1 & Appendix 16 Penal Clauses.
- **Reserve Bank of India (RBI) SFMS & Banking Regulation Act 1949 (Section 45)** Negative Lien Directives.

---

## 2. Supported Versions

| Version | Supported | Cryptographic Ledger Standard | Security Patches |
|---------|-----------|-------------------------------|------------------|
| 2.6.x (Current) | :white_check_mark: | NIST FIPS 180-4 SHA-256 | Active Maintenance |
| 2.5.x | :x: | Legacy MD5/SHA-1 | End of Life |
| < 2.0.x | :x: | Unsigned | Deprecated |

---

## 3. Cryptographic & Architecture Security Standards
- **Cryptographic Audit Ledger**: Block-by-block immutable hash chaining using NIST FIPS 180-4 compliant SHA-256 digests. Every administrative mutation, bank confirmation, and release sanction is permanently signed with zero hash collisions.
- **Zero-Trust Role-Based Access Control (RBAC)**: Strict physical and logical data isolation across all 4 personas (College Nodal Officer, Regional Scrutiny Officer, Regulation Bureau Head, Bank Node) with no horizontal privilege escalation.
- **Transport & Storage Encryption**: TLS 1.3 enforced for all public endpoints; AES-256-GCM encryption for stored scanned FDR artifacts in the secure vault.
- **Bank Handshake Verification**: ISO 20022 compliant MT760/MT799 Structured Financial Messaging System (SFMS) dual-source corroboration against Core Banking Systems (CBS).

---

## 4. Reporting a Security Vulnerability
We welcome responsible security research from authorized auditing bodies, academic institutions, and independent security researchers.

### Reporting Procedure:
1. **Direct Communication**: Send detailed vulnerability reports to `security-kosh@aicte-india.org` with PGP encrypted attachments where applicable.
2. **Include Technical Artifacts**:
   - Detailed step-by-step reproduction instructions.
   - Proof of Concept (PoC) scripts or HTTP traffic captures.
   - Affected endpoints, modules, or cryptographic hashing boundaries.
   - Assessed impact under CVSS v3.1 scoring guidelines.
3. **Response SLA**:
   - Initial Acknowledgement: **Within 12 hours**.
   - Severity & Triage Assessment: **Within 24 hours**.
   - Remediation Timeline: Critical vulnerabilities patched within **48 hours**.

### Prohibited Actions:
- Do not perform Denial of Service (DoS/DDoS) attacks against production infrastructure.
- Do not access, modify, or leak real institutional financial records or Aadhaar/PAN metadata.
- Comply with Indian Information Technology Act (2000) Section 43 & Section 66.
