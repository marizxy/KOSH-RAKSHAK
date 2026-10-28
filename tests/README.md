# AICTE KOSH-Rakshak Test Automation Suite

This directory contains test suites ensuring compliance with financial regulations and cryptographic standards.

---

## 1. Test Categories
- **Unit Tests (`tests/unit/`)**: Validates quarterly compounding actuarial formulas, SHA-256 block hashing, and date offset arithmetic.
- **E2E Tests (`tests/e2e/`)**: Validates strict RBAC data isolation, digital green sheet signing, and 5-gate release adjudication.
- **Load Tests (`tests/load/`)**: Simulates concurrent Core Banking System (CBS) queries during institutional compliance deadlines.

---

## 2. Running Tests
```bash
# Run unit tests directly
node tests/unit/fdr_math.test.js

# Run full test suite via Makefile
make test
```
