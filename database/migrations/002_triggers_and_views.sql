-- =============================================================================
-- MIGRATION 002: TRIGGERS, CONSTRAINTS & ANALYTIC VIEWS
-- =============================================================================

-- 1. Automated Deposit Deficit Trigger
CREATE OR REPLACE FUNCTION fn_calculate_deposit_deficit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deposit_deficit := GREATEST(0, NEW.required_deposit - NEW.actual_deposit);
    IF NEW.deposit_deficit > 0 AND NEW.status != 'RELEASED' THEN
        NEW.status := 'DEFICIT_PENALTY';
    END IF;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_fdr_deficit ON fdr_instruments;
CREATE TRIGGER trg_calculate_fdr_deficit
BEFORE INSERT OR UPDATE OF required_deposit, actual_deposit ON fdr_instruments
FOR EACH ROW
EXECUTE FUNCTION fn_calculate_deposit_deficit();

-- 2. View: High-Risk Non-Compliant Institutions Enclave
CREATE OR REPLACE VIEW v_high_risk_institutions AS
SELECT 
    i.id AS institution_id,
    i.name AS institution_name,
    i.permanent_id,
    i.region,
    i.state,
    i.eoa_status,
    f.fdr_number,
    f.bank_name,
    f.principal_amount,
    f.deposit_deficit,
    f.status AS fdr_status,
    f.has_either_survivor_clause,
    cbs.has_encumbrance,
    cbs.overdraft_loan_amount
FROM institutions i
JOIN fdr_instruments f ON i.id = f.institution_id
LEFT JOIN bank_cbs_verifications cbs ON f.id = cbs.fdr_id
WHERE f.status IN ('FLAGGED', 'DEFICIT_PENALTY') 
   OR cbs.has_encumbrance = TRUE 
   OR f.has_either_survivor_clause = TRUE;

-- 3. View: FDRs Expiring Within 60 Days (Renewal Lineage Escalation)
CREATE OR REPLACE VIEW v_maturing_fdrs_60days AS
SELECT 
    f.id AS fdr_id,
    f.fdr_number,
    i.name AS institution_name,
    i.region,
    i.nodal_officer_email,
    i.nodal_officer_mobile,
    f.bank_name,
    f.principal_amount,
    f.maturity_date,
    (f.maturity_date - CURRENT_DATE) AS days_until_maturity
FROM fdr_instruments f
JOIN institutions i ON f.institution_id = i.id
WHERE f.status = 'ACTIVE' 
  AND f.maturity_date <= (CURRENT_DATE + INTERVAL '60 days');

-- 4. View: EoA Frozen Colleges Summary
CREATE OR REPLACE VIEW v_eoa_frozen_colleges AS
SELECT 
    i.id AS institution_id,
    i.name AS college_name,
    i.permanent_id,
    i.region,
    i.eoa_status,
    COUNT(f.id) AS total_fdrs_held,
    SUM(f.principal_amount) AS total_collateral_inr
FROM institutions i
LEFT JOIN fdr_instruments f ON i.id = f.institution_id
WHERE i.eoa_status IN ('FROZEN_PENDING_INSPECTION', 'EOA_WITHHELD', 'PENALTY_PROCEEDINGS')
GROUP BY i.id, i.name, i.permanent_id, i.region, i.eoa_status;
