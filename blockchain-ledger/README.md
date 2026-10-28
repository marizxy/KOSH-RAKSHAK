# NIST FIPS 180-4 Cryptographic Audit Ledger Engine

The **AICTE KOSH-Rakshak Blockchain & Cryptographic Audit Ledger** enforces complete accountability and non-repudiation for all regulatory decisions.

---

## 1. Architectural Principles
- **SHA-256 Block Hashing**: Every administrative mutation, bank confirmation, deficiency dispatch, and digital release sanction forms a linked block.
- **Cryptographic Pointers**:
  $$\text{Block}[i].\text{previousHash} = \text{Block}[i-1].\text{currentHash}$$
- **Zero Tampering Tolerance**: Any unauthorized mutation in historical records immediately breaks all subsequent block hashes, triggering a hard cryptographic alert.
- **Role-Based Audit Scoping**:
  - `college`: Filtered strictly to institutional validation records.
  - `regional`: Scoped to jurisdictional camp desks (SRO Chennai & NRO Kanpur).
  - `bank`: Scoped to CBS queries, MT760 lien acknowledgements, and MT799 alerts.
  - `bureau`: Complete nationwide super-admin master ledger.
