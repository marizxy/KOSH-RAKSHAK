-- =============================================================================
-- AICTE KOSH-RAKSHAK: SAMPLE SEED DATASET
-- Scenario A: Genuine Compliant SBI Deposit (Guindy)
-- Scenario B: Photoshop Forged Canara Deposit (SRM)
-- Scenario C: Secret BOB Overdraft Deposit (Saraswati)
-- Scenario D: Invalid "Either or Survivor" Loophole Deposit (AKTU)
-- =============================================================================

-- 1. Institutions
INSERT INTO institutions (id, permanent_id, name, aishe_code, region, state, city, category, nodal_officer_name, nodal_officer_email, nodal_officer_mobile)
VALUES
('INST-01-GUINDY', '1-10294811', 'College of Engineering, Guindy, Anna University', 'C-24891', 'SRO', 'Tamil Nadu', 'Chennai', 'Urban', 'Dr. S. Ramanathan', 'nodal.ceg@annauniv.edu', '+91 94440 12345'),
('INST-02-SRM', '1-3829104', 'SRM Institute of Science and Technology', 'U-0473', 'SRO', 'Tamil Nadu', 'Kattankulathur', 'Urban', 'Prof. V. Narayanan', 'registrar@srmist.edu.in', '+91 98401 23456'),
('INST-03-SARASWATI', '1-9923841', 'Saraswati Institute of Technology & Management', 'C-18492', 'NRO', 'Uttar Pradesh', 'Lucknow', 'Rural', 'Er. R. K. Mishra', 'director@saraswati-tech.edu.in', '+91 98390 34567'),
('INST-04-AKTU', '1-482910411', 'Apex Institute of Technology & Management', 'C-38291', 'NRO', 'Uttar Pradesh', 'Meerut', 'Urban', 'Dr. Arvind Sharma', 'nodal@apexmeerut.ac.in', '+91 98110 45678')
ON CONFLICT (id) DO NOTHING;

-- 2. FDR Instruments
INSERT INTO fdr_instruments (id, fdr_number, institution_id, bank_name, branch_name, ifsc_code, issue_date, maturity_date, tenure_years, principal_amount, interest_rate_pct, printed_maturity_amount, math_expected_maturity, lien_pledge_clause, has_either_survivor_clause, required_deposit, actual_deposit, deposit_deficit, status, verification_status, sha256_hash)
VALUES
('FDR-01-SBI-COMPLIANT', 'SBI-2023-881920', 'INST-01-GUINDY', 'State Bank of India', 'Guindy SME Branch, Chennai', 'SBIN0001055', '2023-08-15', '2031-08-15', 8, 3500000.00, 7.25, 6216270.00, 6216270.00, 'Pledged jointly in favor of Member Secretary, AICTE, New Delhi. Non-encashable and non-transferable without written AICTE discharge order.', FALSE, 3500000.00, 3500000.00, 0.00, 'ACTIVE', 'BANK_CBS_CONFIRMED', '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'),
('FDR-02-CANARA-FORGED', 'CAN-2024-551920', 'INST-02-SRM', 'Canara Bank', 'Chennai Main Branch', 'CNRB0000120', '2024-02-10', '2032-02-10', 8, 3500000.00, 7.15, 6168320.00, 2643565.00, 'Joint lien with Member Secretary AICTE.', FALSE, 3500000.00, 1500000.00, 2000000.00, 'FLAGGED', 'DISCREPANCY_FLAGGED', 'b4a8e0f6c2d11e9a08f5d6c7b8a912e34f567890abcdef1234567890abcdef12'),
('FDR-03-BOB-OVERDRAFT', 'BOB-2021-992318', 'INST-03-SARASWATI', 'Bank of Baroda', 'Hazratganj Branch, Lucknow', 'BARB0HAZRAT', '2021-11-20', '2029-11-20', 8, 3500000.00, 6.90, 6031200.00, 6031200.00, 'Pledged with AICTE.', FALSE, 3500000.00, 3500000.00, 0.00, 'FLAGGED', 'DISCREPANCY_FLAGGED', 'c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'),
('FDR-04-PNB-APEX', 'PNB-2024-419208', 'INST-04-AKTU', 'Punjab National Bank', 'Meerut Cantt Branch', 'PUNB0024800', '2024-05-12', '2032-05-12', 8, 3500000.00, 7.10, 6142100.00, 6142100.00, 'Joint Lien with AICTE. Mandate: Either or Survivor.', TRUE, 3500000.00, 3500000.00, 0.00, 'FLAGGED', 'DISCREPANCY_FLAGGED', 'c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012345678')
ON CONFLICT (id) DO NOTHING;

-- 3. CBS Verifications
INSERT INTO bank_cbs_verifications (fdr_id, cbs_reference_number, bank_confirmed, handshake_timestamp, has_encumbrance, overdraft_loan_amount, active_lien_marked, remarks)
VALUES
('FDR-01-SBI-COMPLIANT', 'CBS-SBI-2026-9912048', TRUE, '2026-10-24 14:22:10+05:30', FALSE, 0.00, TRUE, 'Lien marked in CBS Master against AICTE. Zero encumbrance.'),
('FDR-03-BOB-OVERDRAFT', 'CBS-BOB-2026-4412098', TRUE, '2026-10-25 11:30:00+05:30', TRUE, 2200000.00, FALSE, 'Commercial Overdraft Loan Facility of ₹22,00,000 active against deposit. Negative lien breached.')
ON CONFLICT DO NOTHING;
