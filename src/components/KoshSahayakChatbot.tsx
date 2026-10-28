import React, { useState, useRef, useEffect } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatCrores, calculateQuarterlyCompoundedMaturity } from '../utils/formatters';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  X, 
  Minus, 
  ChevronDown, 
  Sparkles, 
  Globe, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Shield, 
  Layers, 
  Scale,
  Maximize2
} from 'lucide-react';

interface KoshSahayakChatbotProps {
  instruments: FDRInstrument[];
  onNavigateToInstrument?: (instrumentId: string, workspaceTab: number) => void;
  onOpenWorkspace?: (workspaceTab: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'BOT';
  text: string;
  language: 'EN' | 'HI' | 'TA' | 'TE' | 'MR';
  timestamp: string;
  citations?: string[];
  actionLink?: {
    label: string;
    instrumentId?: string;
    workspaceTab: number;
  };
}

/**
 * High-precision GovTech Markdown parser that cleanly renders:
 * - **bold** without stray asterisks
 * - *italics*
 * - `code` identifiers
 * - Display Math $$A = P(1+r/400)^4n$$ into authentic mathematical formula callout cards
 * - Inline math $P$, $r$, $n$
 * - Bullet and numbered lists
 */
const FormattedMarkdown: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  // Parse inline spans (bold, italic, code, math)
  const parseInline = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    // Tokenizer regex matching **bold**, *italic*, `code`, and $math$
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[^$]+\$)/g;
    const parts = text.split(regex);

    parts.forEach((part, idx) => {
      if (!part) return;

      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const inner = part.slice(2, -2);
        nodes.push(
          <strong key={idx} className={isUser ? "font-bold text-white" : "font-bold text-slate-900"}>
            {inner}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
        const inner = part.slice(1, -1);
        nodes.push(
          <em key={idx} className={isUser ? "italic text-slate-200" : "italic text-slate-700 font-serif"}>
            {inner}
          </em>
        );
      } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const inner = part.slice(1, -1);
        nodes.push(
          <code key={idx} className="font-mono text-[10.5px] bg-stone-200/70 text-slate-900 px-1 py-0.5 rounded border border-stone-300">
            {inner}
          </code>
        );
      } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2 && !part.startsWith('$$')) {
        const inner = part.slice(1, -1);
        nodes.push(
          <span key={idx} className="font-serif italic font-bold text-amber-900 px-0.5">
            {inner}
          </span>
        );
      } else {
        nodes.push(<span key={idx}>{part}</span>);
      }
    });

    return nodes;
  };

  // Split lines into blocks
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inMathBlock = false;
  let mathBuffer = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check display math block $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      renderedElements.push(
        <div key={`math-${i}`} className="my-2.5 p-2.5 bg-amber-50 border border-amber-300 rounded text-center shadow-2xs">
          <div className="text-[9px] font-mono uppercase text-amber-900 font-bold tracking-wider mb-1">
            Actuarial Quarterly Compounding Formula (RBI Master Direction)
          </div>
          <div className="font-serif text-sm font-bold text-slate-900 tracking-widest rupee-mono">
            A = P × [ 1 + (r / 400) ]^(4n)
          </div>
        </div>
      );
      continue;
    }

    if (trimmed === '$$') {
      if (inMathBlock) {
        renderedElements.push(
          <div key={`math-block-${i}`} className="my-2.5 p-2.5 bg-amber-50 border border-amber-300 rounded text-center shadow-2xs">
            <div className="text-[9px] font-mono uppercase text-amber-900 font-bold tracking-wider mb-1">
              Actuarial Quarterly Compounding Formula (RBI Master Direction)
            </div>
            <div className="font-serif text-sm font-bold text-slate-900 tracking-widest rupee-mono">
              A = P × [ 1 + (r / 400) ]^(4n)
            </div>
          </div>
        );
        inMathBlock = false;
        mathBuffer = '';
      } else {
        inMathBlock = true;
      }
      continue;
    }

    if (inMathBlock) {
      mathBuffer += ' ' + trimmed;
      continue;
    }

    if (!trimmed) {
      renderedElements.push(<div key={`spacer-${i}`} className="h-1.5" />);
      continue;
    }

    // Bullet lines: starts with • or - or *
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.replace(/^[•\-\*]\s+/, '');
      renderedElements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-1.5 my-0.5 text-xs">
          <span className="text-amber-600 font-bold select-none shrink-0">•</span>
          <div className="leading-relaxed">{parseInline(bulletText)}</div>
        </div>
      );
      continue;
    }

    // Numbered lines: starts with digit and dot e.g. "1. "
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const num = numberMatch[1];
      const rest = numberMatch[2];
      renderedElements.push(
        <div key={`num-${i}`} className="flex items-start gap-1.5 my-1 text-xs">
          <span className="font-mono font-bold text-amber-700 bg-amber-100/70 px-1 py-0.2 rounded text-[10px] shrink-0">
            {num}.
          </span>
          <div className="leading-relaxed">{parseInline(rest)}</div>
        </div>
      );
      continue;
    }

    // Regular paragraph line
    renderedElements.push(
      <p key={`p-${i}`} className="my-0.5 leading-relaxed text-xs">
        {parseInline(rawLine)}
      </p>
    );
  }

  return <div className="space-y-0.5">{renderedElements}</div>;
};

export const KoshSahayakChatbot: React.FC<KoshSahayakChatbotProps> = ({
  instruments,
  onNavigateToInstrument,
  onOpenWorkspace,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'TA' | 'TE' | 'MR'>('EN');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-01',
      sender: 'BOT',
      text: 'Namaste! I am Kosh-Sahayak, your AI Regulatory Copilot for AICTE KOSH-Rakshak. How can I assist you with FDR scrutiny, APH norms, or compliance tracking today?',
      language: 'EN',
      timestamp: 'Just now',
      citations: ['AICTE Approval Process Handbook (APH 2026-27)', 'Banking Regulation Act 1949 Sec 45'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Suggested quick prompts
  const quickPrompts = [
    {
      label: 'Urban B.Tech + MBA Deposit Norms',
      query: 'What is the exact security deposit required for an urban B.Tech + MBA institution under APH 2026-27?',
    },
    {
      label: 'Why is Oriental Inst EoA Frozen?',
      query: 'Why is Oriental Institute of Technology’s EoA Certificate frozen?',
    },
    {
      label: 'Apex Institute Legal Dispute',
      query: 'What is the status of Apex Institute of Technology’s FDR and court dispute?',
    },
    {
      label: 'Compounding Math Physics',
      query: 'How does the Actuarial Quarterly Compounding formula detect altered FDR receipts?',
    },
    {
      label: 'Saraswati College BOB Overdraft',
      query: 'Why was Saraswati College of Engineering flagged during Bank CBS handshake?',
    },
  ];

  // Dynamic Natural Language Query Engine
  const processQuery = (query: string): ChatMessage => {
    const q = query.toLowerCase().trim();
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // 1. Natural Language Greetings
    const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'pranam', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    const isGreetingOnly = greetingWords.some(w => q === w || q.startsWith(w + ' ') || q.endsWith(' ' + w));
    if (isGreetingOnly) {
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: selectedLanguage,
        timestamp: timeNow,
        text: `Hello! I am **Kosh-Sahayak**, your AI Regulatory Copilot for **AICTE KOSH-Rakshak**.\n\nHow can I assist you with institutional FDR scrutiny, APH 2026-27 norms, or compliance tracking today?\n\n*Quick Queries You Can Ask:* \n• "What is the deposit norm for urban B.Tech + MBA?"\n• "Why is Oriental Institute's EoA frozen?"\n• "Explain Apex Institute's court dispute & ELA forgery"\n• "How does Bank of Baroda's secret overdraft get flagged?"`,
        citations: ['AICTE Regulatory Bureau Knowledge Base', 'APH 2026-27 Chapter 1 & 4'],
      };
    }

    // 2. Oriental Institute of Technology (Frozen EoA Case)
    if (q.includes('oriental') || (q.includes('eoa') && (q.includes('froz') || q.includes('lock') || q.includes('why')))) {
      const orientalInst = instruments.find(i => i.institutionName.toLowerCase().includes('oriental') || i.fdrNumber.includes('IDB'));
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `**Regulatory Finding for Oriental Institute of Technology, Patna (AICTE ID: 1-66281099)**:\n\n1. **Instrument**: FDR #${orientalInst?.fdrNumber || 'IDB-2018-102938'} issued by ${orientalInst?.bankName || 'Indian Bank'} for **₹35,00,000**.\n2. **Maturity Status**: Matured on **14-Oct-2026** (Past maturity by 12 days without renewal lineage).\n3. **Statutory Ground**: Under **APH 2026-27 Section 1.5**, colleges must maintain zero coverage gap across successive cycles. Because no replacement FDR was linked within grace period, the central engine autonomously imposed an **Administrative EoA (Extension of Approval) Freeze**.\n\n*Statutory Effect:* The institution's portal is locked from generating or downloading their academic year 2026-27 EoA certificate until renewal is completed.`,
        citations: ['APH 2026-27 Chapter 1, Section 1.5', 'AICTE Penal Matrix Directive 14(a)'],
        actionLink: {
          label: 'Inspect Frozen EoA Matrix & Certificate (Oriental Inst.)',
          instrumentId: orientalInst?.id || 'FDR-07-IDB-OVERDUE',
          workspaceTab: 2,
        },
      };
    }

    // 3. Apex Institute of Technology (Altered Forgery & Allahabad High Court Dispute)
    if (q.includes('apex') || q.includes('allahabad') || q.includes('meerut') || (q.includes('court') && q.includes('stay')) || q.includes('pnb-2024')) {
      const apexInst = instruments.find(i => i.institutionName.toLowerCase().includes('apex') || i.id === 'FDR-02-PNB-FORGERY');
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `**Regulatory Forensic Finding for Apex Institute of Technology, Meerut (AICTE ID: 1-482910411)**:\n\n1. **Pixel ELA Tampering**: Error Level Analysis identified altered typography in the Principal Amount field. Genuine deposit was **₹15,00,000**, forged via graphic modification to read **₹35,00,000** (Tamper Box: X:62%, Y:38%).\n2. **Actuarial Compounding Deficit**: The printed maturity value (**₹26,31,240**) belongs mathematically to ₹15L. For ₹35L at 7.10% over 8 years, expected maturity is **₹61,39,560**, exposing a **-₹35,08,320** shortfall.\n3. **Judicial Attachment**: National Judicial Data Grid (NJDG) cross-reference detected an active interim stay in **Allahabad High Court (WP(C) 4182/2025)** restraining asset discharge.\n\n*Current State:* Trust score **18% (Critical Default)**. Regional scrutiny locked pending show cause.`,
        citations: ['NJDG e-Courts Registry API', 'APH 2026-27 Section 1.4(d)', 'RBI Master Direction on Interest Rates'],
        actionLink: {
          label: 'Open Apex Institute 6-Layer Forensic Studio',
          instrumentId: apexInst?.id || 'FDR-02-PNB-FORGERY',
          workspaceTab: 2,
        },
      };
    }

    // 4. Saraswati College of Engineering (Bank of Baroda Overdraft Encumbrance)
    if (q.includes('saraswati') || q.includes('overdraft') || (q.includes('bob') && q.includes('loan')) || q.includes('encumbrance')) {
      const saraswatiInst = instruments.find(i => i.institutionName.toLowerCase().includes('saraswati') || i.id === 'FDR-04-BOB-OVERDRAFT');
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `**Dual-Source CBS Handshake Finding for Saraswati College of Engineering, Navi Mumbai**:\n\n1. **College Claim**: Pledged FDR #BOB-2022-817294 (**₹35,00,000**) as an exclusive unencumbered security deposit.\n2. **Core Banking System (CBS) Audit**: Live Finacle 10.2 handshake with Bank of Baroda revealed an active **Secured Overdraft Loan of ₹22,00,000** sanctioned against this exact instrument.\n3. **Regulatory Violation**: Pledging encumbered collateral violates **Banking Regulation Act 1949 Sec 45** and AICTE first-charge escrow rules. Collateral value is depleted by **62.8%**.\n\n*Action Taken:* Digital e-Office Green Sheet automatically drafted with Recommendation: **ISSUE SHOW CAUSE & LOCK PORTAL**.`,
        citations: ['Banking Regulation Act 1949 Sec 45', 'RBI Master Circular on Deposits 2015', 'AICTE Escrow Guidelines'],
        actionLink: {
          label: 'View Dual-Source Bank CBS Truth Matrix (Saraswati College)',
          instrumentId: saraswatiInst?.id || 'FDR-04-BOB-OVERDRAFT',
          workspaceTab: 3,
        },
      };
    }

    // 5. Deposit Norms for B.Tech + MBA / Pharmacy / Composite Institutions
    if (q.includes('norm') || q.includes('b.tech') || q.includes('mba') || q.includes('composite') || q.includes('how much') || q.includes('shortfall')) {
      if (selectedLanguage === 'HI') {
        return {
          id: 'BOT-' + Date.now(),
          sender: 'BOT',
          language: 'HI',
          timestamp: timeNow,
          text: `APH 2026-27 Table 4.1 Security Deposit Norms:\n\n1. **Urban B.Tech (Engineering)**: **₹35,00,000** (Up to 240 seats)\n2. **MBA (Management Programs)**: **₹15,00,000** (Up to 120 seats)\n\n**Total Mandatory Composite Corpus**: **₹50,00,000** (Pledged jointly with Member Secretary, AICTE for 8 years).\n\n*Portal Audit Note:* Metro City Institute (Bengaluru) deposited only ₹35L, resulting in a statutory shortfall of **₹15,00,000**.`,
          citations: ['APH 2026-27 Chapter 4, Table 4.1', 'Section 1.4(c) Composite Norms'],
          actionLink: {
            label: 'Inspect Metro City FDR Shortfall (₹15L Deficit)',
            instrumentId: 'FDR-05-HDFC-SHORTFALL',
            workspaceTab: 2,
          },
        };
      }

      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `Under **APH 2026-27 Chapter 4, Table 4.1 (Statutory Security Deposit Corpus Schedule)**:\n\n1. **Technical Engineering (B.Tech - Urban)**: Statutory requirement is **₹35,00,000** for approved intake up to 240 seats.\n2. **Management Programme (MBA)**: Additional statutory norm is **₹15,00,000** for approved intake up to 120 seats.\n3. **Pharmacy / MCA / Architecture**: Additional **₹15,00,000** per standalone discipline.\n\n**Total Mandatory Joint Corpus**: **₹50,00,000** (8-Year Lock-in with Member Secretary AICTE).\n\n*Live Portal Example:* **Metro City Institute of Technology** (FDR #HDFC-2023-339101) submitted only ₹35,00,000, triggering an unhedged statutory deficit notice of **₹15,00,000**.`,
        citations: ['APH 2026-27 Chapter 4, Table 4.1', 'Section 1.4(c) Composite Institutions'],
        actionLink: {
          label: 'Inspect Metro City Shortfall File (FDR #HDFC-339101)',
          instrumentId: 'FDR-05-HDFC-SHORTFALL',
          workspaceTab: 2,
        },
      };
    }

    // 6. Actuarial Quarterly Compounding Physics Formula
    if (q.includes('compound') || q.includes('formula') || q.includes('physics') || q.includes('actuarial') || q.includes('interest')) {
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `Indian scheduled commercial banks compound term deposits **quarterly (4 compounding cycles per year)** using the actuarial formula:\n\n$$\\mathbf{A = P \\times \\left(1 + \\frac{r}{400}\\right)^{4n}}$$\n\n• $P$ = Principal deposit corpus (in Rupees)\n• $r$ = Annual nominal interest rate (% per annum)\n• $n$ = Deposit tenure in complete years\n• $4n$ = Total compounding conversion periods\n\n**How this detects Altered FDRs:**\nWhen fraudsters edit the printed Principal value in graphic software, they consistently fail to update the printed maturity sum (which was calculated by bank CBS software on the lower principal). The regulatory engine computes expected maturity in **4 milliseconds** and flags any delta exceeding **₹1,000** as statutory mathematical tampering.`,
        citations: ['Reserve Bank of India Master Direction on Interest Rates 2016', 'AICTE Actuarial Scrutiny Standard'],
        actionLink: {
          label: 'Run 6-Layer Forensic Engine on Forged PNB FDR',
          instrumentId: 'FDR-02-PNB-FORGERY',
          workspaceTab: 2,
        },
      };
    }

    // 7. MNIT Jaipur 5-Gate Release Engine
    if (q.includes('mnit') || q.includes('jaipur') || q.includes('refund') || q.includes('5-gate') || q.includes('discharge')) {
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `**5-Gate Statutory Release Evaluation for MNIT Jaipur (AICTE ID: 1-234567890)**:\n\n• **Gate 1 (Tenure)**: Full 8-year lock-in completed (Matured 10-Aug-2026) -> **VERIFIED**\n• **Gate 2 (Bank CBS)**: SBI confirms zero loans, zero overdraft -> **VERIFIED**\n• **Gate 3 (EVC Inspection)**: Nil student infrastructure deficiencies -> **VERIFIED**\n• **Gate 4 (Legal Hold)**: NJDG query confirms zero court stays -> **VERIFIED**\n• **Gate 5 (Bureau Sanction)**: Sanctioned by Bureau Head -> **SANCTIONED**\n\n*Discharge Generated:* Official QR-coded bank discharge order **AICTE/REG/REL/2026/0891** dispatched with SHA-256 ledger block recording.`,
        citations: ['AICTE Release Norms APH 2026-27 Chapter 1', 'Master SHA-256 Audit Trail'],
        actionLink: {
          label: 'Open 5-Gate Release Rule Engine & QR Discharge',
          instrumentId: 'FDR-09-SBI-RELEASE',
          workspaceTab: 5,
        },
      };
    }

    // 8. Vidya Jyothi Institute ("Either or Survivor" Loophole)
    if (q.includes('vidya') || q.includes('survivor') || q.includes('either') || q.includes('mandate')) {
      return {
        id: 'BOT-' + Date.now(),
        sender: 'BOT',
        language: 'EN',
        timestamp: timeNow,
        text: `**Operating Mandate Loophole in FDR #CNB-2022-772190 (Vidya Jyothi Inst)**:\n\n• **Clause Detected**: Printed mandate specifies **"Payable to Either or Survivor"**.\n• **Statutory Risk**: Under AICTE regulations, all institutional security deposits must be pledged jointly with Member Secretary AICTE under **"Joint Operating Mandate"**.\n• **Vulnerability**: "Either or Survivor" permits the college trust secretary to unilaterally liquidate or encash the ₹35,00,000 deposit at the branch counter without AICTE authorization.\n\n*Action Required:* Show cause notice issued to re-issue deposit under exclusive AICTE joint lien.`,
        citations: ['APH 2026-27 Chapter 1, Section 1.4(a)', 'Banking Mandate Rules'],
        actionLink: {
          label: 'Inspect Canara Bank Mandate Loophole',
          instrumentId: 'FDR-03-CNB-SURVIVOR',
          workspaceTab: 2,
        },
      };
    }

    // 9. General Repository / Active Defaulters Summary
    return {
      id: 'BOT-' + Date.now(),
      sender: 'BOT',
      language: selectedLanguage,
      timestamp: timeNow,
      text: `**AICTE KOSH-Rakshak Live Regulatory Intelligence Summary**:\n\nCurrently monitoring **${instruments.length} technical institutions** across 8 regional jurisdictions:\n\n1. **FDR #PNB-2024-419208 (Apex Inst, NRO)**: Altered Principal from ₹15L to ₹35L (ELA heatmap flagged) + Allahabad HC Stay.\n2. **FDR #BOB-2022-817294 (Saraswati College, WRO)**: Secret ₹22,00,000 Overdraft facility uncovered in CBS Finacle.\n3. **FDR #CNB-2022-772190 (Vidya Jyothi, SCRO)**: Illegal "Either-or-Survivor" unilateral liquidation mandate.\n4. **FDR #IDB-2018-102938 (Oriental Inst, ERO)**: Lapsed 12 days past maturity without renewal; EoA certificate frozen.\n5. **FDR #SBI-2018-990112 (MNIT Jaipur, NWRO)**: 100% compliant; full 8-year tenure served, all 5 release gates passed.\n\n*Ask me about any specific institution, deposit norm formula, or legal litigation hold!*`,
      citations: ['AICTE KOSH-Rakshak Central Ledger', 'APH 2026-27 Normative Schedule'],
      actionLink: {
        label: 'Open Nationwide Risk Heatmap & Master Table',
        workspaceTab: 1,
      },
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'USER-' + Date.now(),
      sender: 'USER',
      text: inputText,
      language: selectedLanguage,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = processQuery(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 500);
  };

  const handlePromptClick = (query: string) => {
    setInputText(query);
  };

  return (
    <>
      {/* 1. Sleek Compact Floating Action Button (Anchored at bottom-6 right-6) */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-[#16202A] text-white shadow-2xl border-2 border-amber-500 hover:bg-slate-900 transition-all duration-200 group hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer"
            title="Open Kosh-Sahayak AI Regulatory Assistant"
            aria-label="Open Kosh-Sahayak AI Assistant"
          >
            <Bot className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-950"></span>
            </span>
          </button>
        )}
      </div>

      {/* 2. Compact Floating Chat Popup Window (380px wide, max 520px high, bottom-6 right-6) */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-[#FFFFFF] border-2 border-[#D4D1C7] rounded shadow-2xl flex flex-col overflow-hidden font-sans pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150" 
          style={{ width: '380px', height: '490px', maxHeight: '520px' }}
        >
          {/* Header */}
          <div className="bg-[#16202A] text-white p-2.5 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="font-bold text-[11.5px] flex items-center gap-1.5 text-white leading-tight">
                  <span>Kosh-Sahayak</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-[10.5px] text-amber-300">AI Copilot</span>
                  <span className="bg-emerald-900 text-emerald-200 text-[8.5px] px-1 py-0.2 rounded font-mono">
                    APH 26-27
                  </span>
                </div>
                <div className="text-[9.5px] text-slate-300 leading-tight mt-0.5">
                  FDR Scrutiny & Regulatory Copilot
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e: any) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 text-slate-200 text-[9.5px] py-0.5 px-1 rounded border border-slate-700 focus:outline-hidden font-medium"
              >
                <option value="EN">English</option>
                <option value="HI">Hindi</option>
                <option value="TA">Tamil</option>
                <option value="TE">Telugu</option>
                <option value="MR">Marathi</option>
              </select>

              {/* Functional Minimize Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Minimize chat to compact icon"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Functional Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close chat window"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#F5F4F0] px-2.5 py-1.5 border-b border-[#D4D1C7] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(p.query)}
                className="px-2 py-0.5 text-[10px] bg-white border border-[#D4D1C7] hover:border-slate-800 hover:bg-amber-50/50 rounded text-slate-700 transition-colors shrink-0 font-medium cursor-pointer shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Container with Clean Markdown Formatting */}
          <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5 bg-stone-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-2.5 rounded-sm max-w-[92%] leading-relaxed ${
                    m.sender === 'USER'
                      ? 'bg-[#1E293B] text-white rounded-br-none shadow-xs'
                      : 'bg-[#FFFFFF] text-slate-900 border border-[#D4D1C7] rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Clean Markdown Content Renderer */}
                  <FormattedMarkdown content={m.text} isUser={m.sender === 'USER'} />

                  {/* Statutory Citations Box */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2 pt-1 border-t border-slate-200 text-[9.5px] text-slate-500 font-sans">
                      <div className="font-semibold text-slate-700 flex items-center gap-1 mb-0.5">
                        <BookOpen className="w-2.5 h-2.5 text-[#14532D]" />
                        <span>Regulatory Citations:</span>
                      </div>
                      <div className="space-y-0.5 font-mono">
                        {m.citations.map((c, i) => (
                          <div key={i} className="text-[#14532D]">§ {c}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Workspace Action Link */}
                  {m.actionLink && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200">
                      <button
                        onClick={() => {
                          if (onNavigateToInstrument && m.actionLink?.instrumentId) {
                            onNavigateToInstrument(m.actionLink.instrumentId, m.actionLink.workspaceTab);
                          } else if (onOpenWorkspace) {
                            onOpenWorkspace(m.actionLink?.workspaceTab || 1);
                          }
                          setIsOpen(false);
                        }}
                        className="w-full py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-300 rounded font-sans font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{m.actionLink.label}</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[8.5px] text-slate-400 mt-0.5 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono bg-white p-1.5 rounded border border-slate-200 w-36 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                <span>AI Regulatory Indexing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-2 bg-[#FFFFFF] border-t border-[#D4D1C7] flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Kosh-Sahayak in English..."
              className="flex-1 text-[11px] bg-[#F5F4F0] border border-[#D4D1C7] rounded px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-slate-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-1.5 rounded transition-colors ${
                inputText.trim()
                  ? 'bg-[#14532D] text-white hover:bg-[#15803D] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
