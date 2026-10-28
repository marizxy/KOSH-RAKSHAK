# AICTE KOSH-Rakshak Database Architecture

The **AICTE KOSH-Rakshak Database** is designed on PostgreSQL 16, utilizing standard ACID guarantees, UUIDs, cryptographic foreign keys, and strict enum check constraints.

---

## 1. Schema Hierarchy
- `institutions`: Core master table storing technical education provider metadata, permanent IDs, AISHE codes, and geographical regions.
- `fdr_instruments`: Fixed Deposit Receipts under regulatory custody with principal amounts, computed maturities, interest rates, and status.
- `bank_cbs_verifications`: Independent corroborations from Core Banking Hosts, MT760 lien acknowledgements, and secret overdraft alerts.
- `forensic_scrunity_records`: Output of the 6-layer forensic suite (ELA pixel variance, compound math deltas, trust scores).
- `audit_ledger_blocks`: Tamper-evident cryptographic blocks preserving the immutable SHA-256 historical chain.

---

## 2. Seed Execution
Run the seed scripts directly:
```bash
psql -U postgres -d aicte_kosh_rakshak_db -f database/schema.sql
psql -U postgres -d aicte_kosh_rakshak_db -f database/seeds/sample_fdrs.sql
```
Or execute via Docker Compose:
```bash
docker-compose exec postgres psql -U postgres -d aicte_kosh_rakshak_db -f /docker-entrypoint-initdb.d/02-seeds.sql
```
