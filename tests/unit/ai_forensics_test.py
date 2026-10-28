"""
Unit Tests for AICTE KOSH-Rakshak AI Forensics Engine
Framework: Pytest / Python unittest
"""

import io
import sys
import os
import unittest
from PIL import Image

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai-forensics')))

from ela_analyzer import compute_ela, verify_actuarial_compounding
from pixel_anomaly_detector import analyze_laplacian_edge_discontinuity
from nlp_lien_classifier import classify_lien_clauses


class TestAiForensics(unittest.TestCase):

    def test_actuarial_compounding_genuine(self):
        """Genuine SBI FDR: ₹35L at 7.25% for 8 yrs -> ₹62,16,270 (approx)"""
        res = verify_actuarial_compounding(3500000, 7.25, 8, 6218753, tolerance=2500)
        self.assertFalse(res["math_mismatch_detected"])
        self.assertEqual(res["verdict"], "MATHEMATICALLY_VERIFIED")

    def test_actuarial_compounding_forgery_detected(self):
        """Photoshop altered FDR: ₹35L claimed, but printed is ₹26,43,565"""
        res = verify_actuarial_compounding(3500000, 7.15, 8, 2643565, tolerance=100)
        self.assertTrue(res["math_mismatch_detected"])
        self.assertEqual(res["verdict"], "ACTUARIAL_MISMATCH_FORGERY")

    def test_nlp_compliant_lien(self):
        """Valid statutory AICTE joint lien clause"""
        text = "Deposit pledged jointly in favor of Member Secretary, AICTE. Non-encashable without written AICTE order."
        res = classify_lien_clauses(text)
        self.assertTrue(res["is_aph_compliant"])
        self.assertEqual(res["risk_level"], "GREEN_VERIFIED")

    def test_nlp_illegal_loophole_detected(self):
        """Illegal 'Either or Survivor' loophole clause"""
        text = "Account held jointly. Repayment mandate: Either or Survivor."
        res = classify_lien_clauses(text)
        self.assertFalse(res["is_aph_compliant"])
        self.assertEqual(res["risk_level"], "RED_CRITICAL")
        self.assertEqual(res["violations_found"][0]["code"], "EITHER_OR_SURVIVOR")

    def test_ela_synthetic_image_execution(self):
        """Ensures ELA analysis processes image bytes without exception"""
        img = Image.new('RGB', (200, 200), color=(250, 248, 245))
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=95)
        res = compute_ela(buf.getvalue())
        self.assertIn("ela_tampering_detected", res)
        self.assertIn("confidence_score", res)


if __name__ == '__main__':
    unittest.main()
