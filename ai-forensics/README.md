# 6-Layer Multi-Modal AI Forensic Scrutiny Engine

The **AICTE KOSH-Rakshak AI Forensics** engine provides automated forensic scrutiny on scanned FDR certificates submitted by technical institutions.

---

## 1. The 6-Layer Forensic Pipeline

1. **Layer 1: OCR Multi-Engine Extraction**:
   - Tesseract-v5 with custom morphological filter kernels extracting FDR Number, Bank Name, IFSC, Principal, Issue/Maturity Dates.
2. **Layer 2: Error Level Analysis (ELA) Heatmap**:
   - Detects digital pixel tampering, resaved JPEG artifacts, and localized Photoshop modifications in the principal or maturity box.
3. **Layer 3: Compound Interest Actuarial Verification**:
   - Evaluates quarterly compounded maturity formula:
     $$\text{Maturity} = \text{Principal} \times \left(1 + \frac{\text{Rate}}{400}\right)^{4 \times \text{Tenure}}$$
   - Catches arithmetic forgeries where colleges inflate the principal box without updating the printed maturity.
4. **Layer 4: NLP Lien Mandate Loophole Scanner**:
   - Flags hazardous clauses like `"Either or Survivor"` or `"Former or Survivor"`, enforcing exclusive Joint Lien in favor of Member Secretary AICTE.
5. **Layer 5: XMP Metadata & Hex Header Forensics**:
   - Inspects PDF and EXIF metadata traces (e.g., `"Adobe Photoshop 24.1 (Windows)"` or `"CorelDraw Export"`).
6. **Layer 6: Font Typography & Quantization Anomaly Detection**:
   - Identifies non-native font rendering, mismatched kerning, and misaligned baseline DPI.
