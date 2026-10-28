-- =============================================================================
-- MIGRATION 001: INITIAL SCHEMA FOR AICTE KOSH-RAKSHAK
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & RBAC Identity Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(128) NOT NULL UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('COLLEGE_NODAL', 'REGIONAL_OFFICER', 'HQ_BUREAU', 'BANK_OFFICIAL')),
    designation VARCHAR(128),
    institution_id VARCHAR(64),
    regional_office VARCHAR(16),
    bank_code VARCHAR(16),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Technical Institutions Master Table
CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(64) PRIMARY KEY,
    permanent_id VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    aishe_code VARCHAR(32) NOT NULL,
    region VARCHAR(16) NOT NULL CHECK (region IN ('SRO', 'NRO', 'WRO', 'ERO', 'NWRO', 'SWRO', 'CRO', 'SCRO')),
    state VARCHAR(64) NOT NULL,
    city VARCHAR(64) NOT NULL,
    category VARCHAR(16) NOT NULL CHECK (category IN ('Urban', 'Rural')),
    nodal_officer_name VARCHAR(128) NOT NULL,
    nodal_officer_email VARCHAR(128) NOT NULL,
    nodal_officer_mobile VARCHAR(20) NOT NULL,
    eoa_status VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FDR Collateral Instruments Table
CREATE TABLE IF NOT EXISTS fdr_instruments (
    id VARCHAR(64) PRIMARY KEY,
    fdr_number VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    bank_name VARCHAR(128) NOT NULL,
    branch_name VARCHAR(128) NOT NULL,
    ifsc_code VARCHAR(16) NOT NULL,
    issue_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    tenure_years INT NOT NULL DEFAULT 8,
    principal_amount NUMERIC(15, 2) NOT NULL,
    interest_rate_pct NUMERIC(5, 2) NOT NULL,
    printed_maturity_amount NUMERIC(15, 2) NOT NULL,
    math_expected_maturity NUMERIC(15, 2) NOT NULL,
    lien_pledge_clause TEXT NOT NULL,
    has_either_survivor_clause BOOLEAN NOT NULL DEFAULT FALSE,
    required_deposit NUMERIC(15, 2) NOT NULL,
    actual_deposit NUMERIC(15, 2) NOT NULL,
    deposit_deficit NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MATURING_SOON', 'EXPIRED', 'DEFICIT_PENALTY', 'FLAGGED', 'RELEASED')),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_UPLOAD',
    sha256_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bank Core Banking System (CBS) Verifications Table
CREATE TABLE IF NOT EXISTS bank_cbs_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_id VARCHAR(64) NOT NULL REFERENCES fdr_instruments(id) ON DELETE CASCADE,
    cbs_reference_number VARCHAR(64) NOT NULL,
    bank_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    handshake_timestamp TIMESTAMP WITH TIME ZONE,
    has_encumbrance BOOLEAN NOT NULL DEFAULT FALSE,
    overdraft_loan_amount NUMERIC(15, 2) DEFAULT 0,
    active_lien_marked BOOLEAN NOT NULL DEFAULT FALSE,
    sfms_mt760_ref VARCHAR(64),
    sfms_mt799_alert_ref VARCHAR(64),
    remarks TEXT
);

-- 6-Layer Multi-Modal Forensic Records
CREATE TABLE IF NOT EXISTS forensic_scrunity_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_id VARCHAR(64) NOT NULL REFERENCES fdr_instruments(id) ON DELETE CASCADE,
    ela_tampering_detected BOOLEAN NOT NULL DEFAULT FALSE,
    mean_pixel_variance NUMERIC(8, 3) NOT NULL,
    math_mismatch_detected BOOLEAN NOT NULL DEFAULT FALSE,
    math_delta NUMERIC(15, 2) DEFAULT 0,
    trust_score NUMERIC(5, 2) NOT NULL DEFAULT 95.0,
    layers_cleared INT NOT NULL DEFAULT 6,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cryptographic Immutable Audit Ledger Blocks Table
CREATE TABLE IF NOT EXISTS audit_ledger_blocks (
    block_index BIGINT PRIMARY KEY,
    timestamp VARCHAR(64) NOT NULL,
    user_role VARCHAR(32) NOT NULL,
    user_identifier VARCHAR(128) NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    previous_hash CHAR(64) NOT NULL,
    current_hash CHAR(64) NOT NULL,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
