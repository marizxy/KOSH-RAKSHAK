"""
AICTE KOSH-Rakshak: Enterprise AI Forensics Microservice
Framework: FastAPI • OpenCV Headless • PIL • NumPy
Complies with AICTE Approval Process Handbook (APH 2026-27)
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from ela_analyzer import compute_ela, verify_actuarial_compounding
from pixel_anomaly_detector import analyze_laplacian_edge_discontinuity, detect_bank_stamp_boundary_tampering
from nlp_lien_classifier import classify_lien_clauses

app = FastAPI(
    title="AICTE KOSH-Rakshak AI Forensics Engine",
    version="2.6.4",
    description="Sovereign Multi-Modal AI Document Verification & Actuarial Forensics API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MathAuditRequest(BaseModel):
    principal: float = Field(..., ge=100000, description="Principal Deposit in INR")
    rate_pct: float = Field(..., ge=1.0, le=25.0, description="Quarterly Compounding Rate")
    tenure_years: int = Field(8, ge=1, le=20, description="FDR Tenure in Years")
    printed_maturity: float = Field(..., ge=100000, description="Printed Maturity on Deposit Receipt")
    tolerance: float = Field(100.0, description="Allowable rounding delta")


class LienAuditRequest(BaseModel):
    clause_text: str = Field(..., min_length=5, description="FDR Endorsement or Lien Clause String")


@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "AICTE KOSH-Rakshak AI Forensics Engine",
        "engine_version": "2.6.4-SOVEREIGN",
        "models_loaded": [
            "Error Level Analysis (JPEG Quantization Heatmap)",
            "Laplacian Edge Gradient Discontinuity Detector",
            "Actuarial Quarterly Compounding Math Auditor",
            "Statutory Lien NLP Policy Scanner"
        ]
    }


@app.post("/api/v1/forensics/ela-scan")
async def execute_ela_scan(file: UploadFile = File(...)):
    """Performs Error Level Analysis to detect Photoshop splicing and compression delta."""
    try:
        content = await file.read()
        return compute_ela(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ELA scan failed: {str(e)}")


@app.post("/api/v1/forensics/pixel-anomaly")
async def execute_pixel_anomaly(file: UploadFile = File(...)):
    """Analyzes Laplacian edge discontinuity and bank seal boundary artifacts."""
    try:
        content = await file.read()
        laplacian_res = analyze_laplacian_edge_discontinuity(content)
        stamp_res = detect_bank_stamp_boundary_tampering(content)
        return {
            "edge_analysis": laplacian_res,
            "stamp_analysis": stamp_res,
            "is_tampered": laplacian_res["edge_splicing_detected"] or stamp_res.get("digitally_placed_stamp", False)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pixel anomaly analysis failed: {str(e)}")


@app.post("/api/v1/forensics/compound-math")
def audit_compounding_math(req: MathAuditRequest):
    """Verifies that A = P * (1 + r/400)^(4n) matches printed maturity."""
    return verify_actuarial_compounding(
        principal=req.principal,
        rate_pct=req.rate_pct,
        tenure_years=req.tenure_years,
        printed_maturity=req.printed_maturity,
        tolerance=req.tolerance
    )


@app.post("/api/v1/forensics/lien-clause-audit")
def audit_lien_clause(req: LienAuditRequest):
    """Evaluates lien clauses against AICTE APH 2026-27 rules."""
    return classify_lien_clauses(req.clause_text)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
