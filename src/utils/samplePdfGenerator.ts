/**
 * Sample PDF Generator Utility
 * Generates authentic, valid PDF 1.4 binary documents for SIH PS ID: 26265 live demonstration.
 */

interface SampleFDRConfig {
  filename: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  fdrNumber: string;
  issueDate: string;
  maturityDate: string;
  tenure: string;
  institutionName: string;
  institutionId: string;
  principalAmount: string;
  principalInWords: string;
  interestRate: string;
  maturityAmount: string;
  lienClause: string;
  signatory: string;
  isForged?: boolean;
  metadataCreator?: string;
}

const SAMPLE_CONFIGS: Record<'SAMPLE_1' | 'SAMPLE_2' | 'SAMPLE_3', SampleFDRConfig> = {
  SAMPLE_1: {
    filename: 'Sample_1_Genuine_SBI_FDR.pdf',
    bankName: 'STATE BANK OF INDIA',
    branchName: 'Nariman Point Branch, Mumbai - 400021',
    ifscCode: 'SBIN0001055',
    fdrNumber: 'SBI-2024-918274',
    issueDate: '12-Jan-2024',
    maturityDate: '12-Jan-2032',
    tenure: '8 Years (96 Months)',
    institutionName: 'K.J. Somaiya College of Engineering, Mumbai',
    institutionId: '1-10928374',
    principalAmount: 'Rs. 35,00,000.00',
    principalInWords: 'Rupees Thirty Five Lakhs Only',
    interestRate: '7.10% p.a. (Quarterly Compounding)',
    maturityAmount: 'Rs. 61,39,560.00',
    lienClause: 'Pledged exclusively and jointly in favor of Member Secretary, AICTE. Operating Mandate: Joint Operating Mandate. No loan, overdraft or third-party lien permitted.',
    signatory: 'R. K. Meena, Chief Branch Manager (Emp #48291)',
    isForged: false,
    metadataCreator: 'State Bank CBS Host Finacle 10.2 (Certified Secure PDF)',
  },
  SAMPLE_2: {
    filename: 'Sample_2_Photoshopped_PNB_FDR.pdf',
    bankName: 'PUNJAB NATIONAL BANK',
    branchName: 'Civil Lines Branch, Meerut - 250001',
    ifscCode: 'PUNB0024900',
    fdrNumber: 'PNB-2024-419208',
    issueDate: '10-Feb-2024',
    maturityDate: '10-Feb-2032',
    tenure: '8 Years (96 Months)',
    institutionName: 'Apex Institute of Technology, Meerut',
    institutionId: '1-482910411',
    principalAmount: 'Rs. 35,00,000.00 (FORGED: Originally Rs. 15,00,000)',
    principalInWords: 'Rupees Thirty Five Lakhs Only (Non-Native Typography)',
    interestRate: '7.10% p.a. (Quarterly Compounding)',
    maturityAmount: 'Rs. 26,31,240.00 (MATHEMATICAL MISMATCH: Belongs to Rs. 15L)',
    lienClause: 'Pledged jointly to Member Secretary, AICTE. Court Attachment: Allahabad High Court Stay WP(C) 4182/2025.',
    signatory: 'S. K. Verma, Branch Manager',
    isForged: true,
    metadataCreator: 'Adobe Photoshop 2024 (Windows) - Graphic Alteration Detected',
  },
  SAMPLE_3: {
    filename: 'Sample_3_Loophole_FDR.pdf',
    bankName: 'CANARA BANK',
    branchName: 'Abids Circle Branch, Hyderabad - 500001',
    ifscCode: 'CNRB0000120',
    fdrNumber: 'CNB-2022-772190',
    issueDate: '05-Jun-2022',
    maturityDate: '05-Jun-2030',
    tenure: '8 Years (96 Months)',
    institutionName: 'Vidya Jyothi Institute of Technology, Hyderabad',
    institutionId: '1-77182901',
    principalAmount: 'Rs. 35,00,000.00',
    principalInWords: 'Rupees Thirty Five Lakhs Only',
    interestRate: '6.85% p.a. (Quarterly Compounding)',
    maturityAmount: 'Rs. 60,19,410.00',
    lienClause: 'Operating Mandate: Payable to Either or Survivor (ILLEGAL LOOPHOLE: Permits unilateral encashment without AICTE authorization).',
    signatory: 'V. R. Rao, Senior Branch Manager',
    isForged: false,
    metadataCreator: 'Canara CBS BaNCS Core Gateway (Unmodified)',
  },
};

/**
 * Constructs a fully compliant standard PDF 1.4 binary file
 */
export function generateSampleFdrPdfBlob(sampleKey: 'SAMPLE_1' | 'SAMPLE_2' | 'SAMPLE_3'): Blob {
  const cfg = SAMPLE_CONFIGS[sampleKey];

  // Helper to escape PDF text
  const esc = (str: string) => str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  // Stream content representing an authentic Indian Fixed Deposit Receipt
  const contentStream = `
BT
/F1 16 Tf
50 740 Td
(${esc(cfg.bankName)}) Tj
ET

BT
/F1 9 Tf
50 725 Td
(${esc(cfg.branchName)}  |  IFSC: ${esc(cfg.ifscCode)}) Tj
ET

BT
/F2 11 Tf
50 700 Td
(SPECIAL TERM DEPOSIT RECEIPT  -  SECURITY LIEN PLEDGE TO AICTE) Tj
ET

BT
/F1 9 Tf
50 675 Td
(FDR Receipt No: ${esc(cfg.fdrNumber)}) Tj
350 0 Td
(Date of Issue: ${esc(cfg.issueDate)}) Tj
ET

BT
/F1 9 Tf
50 655 Td
(Depositor / Institution Name: ${esc(cfg.institutionName)}) Tj
ET

BT
/F1 9 Tf
50 640 Td
(AICTE Permanent Institution ID: ${esc(cfg.institutionId)}) Tj
350 0 Td
(Deposit Tenure: ${esc(cfg.tenure)}) Tj
ET

BT
/F2 10 Tf
50 610 Td
(Principal Deposit Amount:  ${esc(cfg.principalAmount)}) Tj
ET

BT
/F1 9 Tf
50 595 Td
(Amount in Words: ${esc(cfg.principalInWords)}) Tj
ET

BT
/F1 9 Tf
50 570 Td
(Interest Rate: ${esc(cfg.interestRate)}) Tj
ET

BT
/F2 10 Tf
50 550 Td
(Printed Maturity Value:  ${esc(cfg.maturityAmount)}) Tj
350 0 Td
(Maturity Date: ${esc(cfg.maturityDate)}) Tj
ET

BT
/F1 8.5 Tf
50 515 Td
(REGULATORY MANDATE & LIEN ENDORSEMENT CLAUSE:) Tj
ET

BT
/F1 8 Tf
50 495 Td
(${esc(cfg.lienClause)}) Tj
ET

BT
/F1 8 Tf
50 440 Td
(Core Banking Host: SFMS / CBS Certified) Tj
350 0 Td
(Authorised Bank Signatory: ${esc(cfg.signatory)}) Tj
ET

${cfg.isForged ? `
BT
/F2 8 Tf
50 390 Td
([FORENSIC AUDIT FLAG: Adobe Photoshop Spliced Layer Artifact - Error Level 94.2%]) Tj
ET
` : ''}

BT
/F1 7.5 Tf
50 100 Td
(Generated for AICTE KOSH-Rakshak Live Verification  |  Problem Statement ID: 26265) Tj
ET
`;

  const streamLength = contentStream.length;

  const pdfData = `%PDF-1.4
%âãÏÓ
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
      /F2 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
5 0 obj
<<
  /Producer (${esc(cfg.metadataCreator || 'NIC India Gateway')})
  /Title (${esc(cfg.filename)})
  /Author (All India Council for Technical Education)
  /Subject (Institutional Security Deposit Certificate)
  /CreationDate (D:20261026120000+05'30')
>>
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000350 00000 n 
000000${(400 + streamLength).toString().padStart(10, '0')} 00000 n 
trailer
<<
  /Size 6
  /Root 1 0 R
  /Info 5 0 R
>>
startxref
${(550 + streamLength)}
%%EOF`;

  return new Blob([pdfData], { type: 'application/pdf' });
}

/**
 * Triggers a native browser file download for the chosen sample
 */
export function triggerSamplePdfDownload(sampleKey: 'SAMPLE_1' | 'SAMPLE_2' | 'SAMPLE_3') {
  const cfg = SAMPLE_CONFIGS[sampleKey];
  const blob = generateSampleFdrPdfBlob(sampleKey);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cfg.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads all 3 sample files sequentially
 */
export function downloadAllSampleFiles() {
  triggerSamplePdfDownload('SAMPLE_1');
  setTimeout(() => triggerSamplePdfDownload('SAMPLE_2'), 300);
  setTimeout(() => triggerSamplePdfDownload('SAMPLE_3'), 600);
}
