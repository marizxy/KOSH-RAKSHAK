"""
AICTE KOSH-Rakshak: NLP Lien & Legal Loophole Classifier
Detects predatory or non-compliant clauses in Fixed Deposit Receipts:
- "Either or Survivor" mandate (APH 2026-27 Sec 4.1 violation)
- "Payable to Depositor Only" (Failure to mark AICTE Joint Lien)
- "Subject to Bank First Charge" (Negative Pledge Breach / Secret Overdraft)
"""

import re
from typing import Dict, Any, List


DISALLOWED_CLAUSES = [
    {
        "code": "EITHER_OR_SURVIVOR",
        "regex": r"(either\s+or\s+survivor|former\s+or\s+survivor|anyone\s+or\s+survivor)",
        "severity": "CRITICAL_FORFEITURE",
        "description": "Permits unilateral premature encashment by trust without AICTE counter-signature."
    },
    {
        "code": "UNILATERAL_DEPOSITOR_MANDATE",
        "regex": r"(payable\s+to\s+depositor\s+only|sole\s+mandate\s+of\s+trustee|unilateral\s+release)",
        "severity": "HIGH_RISK_DEFICIENCY",
        "description": "Fails to establish irrevocable joint pledge in favor of Member Secretary, AICTE."
    },
    {
        "code": "BANK_SUPERIOR_LIEN",
        "regex": r"(bank(?:'s)?\s+first\s+charge|subject\s+to\s+overdraft\s+lien|general\s+bankers\s+lien)",
        "severity": "CRITICAL_COLLATERAL_BREACH",
        "description": "Secret overdraft lien takes precedence over AICTE sovereign educational deposit."
    }
]

REQUIRED_MANDATE_PATTERNS = [
    r"(aicte|all\s+india\s+council\s+for\s+technical\s+education)",
    r"(joint(?:ly)?\s+(?:held|pledged|favor)|member\s+secretary)",
    r"(non[-\s]encashable|without\s+written\s+(?:permission|order|consent))"
]


def classify_lien_clauses(clause_text: str) -> Dict[str, Any]:
    """
    Scans extracted OCR or uploaded FDR endorsement text against statutory APH 2026-27 rules.
    """
    text_lower = clause_text.lower()
    flagged_violations: List[Dict[str, str]] = []

    # 1. Search for prohibited predatory clauses
    for rule in DISALLOWED_CLAUSES:
        match = re.search(rule["regex"], text_lower)
        if match:
            flagged_violations.append({
                "code": rule["code"],
                "matched_snippet": match.group(0),
                "severity": rule["severity"],
                "description": rule["description"]
            })

    # 2. Check for presence of required AICTE statutory lien endorsements
    missing_statutory_elements: List[str] = []
    if not re.search(REQUIRED_MANDATE_PATTERNS[0], text_lower):
        missing_statutory_elements.append("AICTE Council Name Not Found in Pledge Mandate")
    if not re.search(REQUIRED_MANDATE_PATTERNS[1], text_lower):
        missing_statutory_elements.append("Joint Lien Designation with Member Secretary Not Explicit")
    if not re.search(REQUIRED_MANDATE_PATTERNS[2], text_lower):
        missing_statutory_elements.append("Explicit Non-Encashment Restraint Order Missing")

    is_compliant = len(flagged_violations) == 0 and len(missing_statutory_elements) == 0

    return {
        "is_aph_compliant": is_compliant,
        "violations_found": flagged_violations,
        "missing_elements": missing_statutory_elements,
        "risk_level": "RED_CRITICAL" if flagged_violations else ("YELLOW_DEFICIENT" if missing_statutory_elements else "GREEN_VERIFIED"),
        "verdict": "STATUTORY_LIEN_VALIDATED" if is_compliant else "ILLEGAL_LOOPHOLE_REJECTED"
    }


if __name__ == "__main__":
    print("Testing NLP Lien Classifier...")
    # Test valid clause
    valid_text = "FDR pledged jointly in favor of Member Secretary, AICTE, New Delhi. Non-encashable without written AICTE discharge order."
    print("Compliant Test Result:", classify_lien_clauses(valid_text)["verdict"])

    # Test invalid either or survivor clause
    invalid_text = "FDR in favor of Apex Institute Trust. Repayment Mandate: Either or Survivor."
    print("Loophole Test Result:", classify_lien_clauses(invalid_text)["verdict"])
