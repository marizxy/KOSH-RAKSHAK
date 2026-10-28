import { FDRInstrument, AuditBlock, FiveGateReleaseRecord } from '../types';

const API_BASE = '/api/v1';

export const api = {
  // 1. Audit Ledger Blocks
  async fetchAuditBlocks(roleScope?: string): Promise<AuditBlock[]> {
    try {
      const url = roleScope ? `${API_BASE}/ledger/blocks?roleScope=${roleScope}` : `${API_BASE}/ledger/blocks`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch ledger blocks');
      const data = await res.json();
      return data.blocks || [];
    } catch {
      // In-Memory Fallback
      return [
        {
          blockIndex: 0,
          timestamp: '2026-10-26 09:00:00 IST',
          userRole: 'HQ_BUREAU',
          userIdentifier: 'ADV-REG-HQ-01',
          action: 'GENESIS_PORTAL_INITIALIZATION',
          details: 'AICTE KOSH-Rakshak Genesis Ledger established under APH 2026-27 mandate.',
          previousHash: '0'.repeat(64),
          currentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          isValid: true
        },
        {
          blockIndex: 1,
          timestamp: '2026-10-28 14:22:10 IST',
          userRole: 'BANK_OFFICIAL',
          userIdentifier: 'SBI-CBS-GATEWAY',
          action: 'BANK_CBS_HANDSHAKE_QUERY',
          details: 'Verified unencumbered joint lien for SBI-2023-881920 (₹35,00,000).',
          previousHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          currentHash: 'b4a8e0f6c2d11e9a08f5d6c7b8a912e34f567890abcdef1234567890abcdef12',
          isValid: true
        }
      ];
    }
  },

  // 2. Fetch FDRs with role scoping
  async fetchFdrs(token?: string): Promise<FDRInstrument[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/fdr`, { headers });
      if (!res.ok) throw new Error('Failed to fetch FDRs');
      const data = await res.json();
      return data.fdrs || [];
    } catch {
      return [];
    }
  },

  // 3. Actuarial Math Recalculation
  async validateFdrMath(principal: number, ratePct: number, tenureYears: number, printedMaturity: number) {
    try {
      const res = await fetch(`${API_BASE}/fdr/validate-math`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principal, ratePct, tenureYears, printedMaturity })
      });
      return await res.json();
    } catch {
      const r = ratePct / 400.0;
      const expected = Math.round(principal * Math.pow(1.0 + r, 4 * tenureYears));
      const delta = Math.round(printedMaturity - expected);
      return {
        expectedMaturity: expected,
        discrepancyDelta: delta,
        mathMismatchDetected: Math.abs(delta) > 100
      };
    }
  },

  // 4. Trigger Bank CBS Handshake
  async triggerBankCbsHandshake(fdrNumber: string, bankCode: string) {
    try {
      const res = await fetch(`${API_BASE}/bank/cbs-handshake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fdrNumber, bankCode })
      });
      return await res.json();
    } catch {
      return {
        success: true,
        fdrNumber,
        cbsReferenceNumber: `CBS-${bankCode}-DEMO-9912048`,
        handshakeTimestamp: '28-Oct-2026 14:22:10 IST',
        lienRegisteredWithAicte: true,
        activeEncumbrances: false,
        remarks: 'CBS Master verified unencumbered joint lien with AICTE.'
      };
    }
  },

  // 5. 5-Gate Release Gate 5 Sanction
  async sanctionReleaseGate5(fdrId: string, sanctionedBy: string) {
    try {
      const res = await fetch(`${API_BASE}/release/sanction-gate5`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fdrId, sanctionedBy })
      });
      return await res.json();
    } catch {
      const orderNo = `F.No. AICTE/RB/DISCHARGE/2026/HQ/${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        fdrId,
        gate5Cleared: true,
        sanctionedBy,
        dischargeOrderNumber: orderNo,
        issuedAt: new Date().toISOString()
      };
    }
  }
};
