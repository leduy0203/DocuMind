import { DocumentItem, ChatSession } from "@/types";

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Financial_Report_Q3_2025.pdf",
    type: "pdf",
    size: 2450000,
    status: "Indexed",
    pageCount: 24,
    createdAt: "2026-10-05T09:30:00Z",
    category: "Financials",
    summary:
      "Consolidated financial performance for Q3 2025: Net revenue of 1,450.8 billion VND (+24.2% YoY), gross margin of 38.5%, and operating cash flow summary.",
    passages: [
      {
        id: "p-1-1",
        page: 3,
        text: "Executive Summary: Consolidated net revenue reached 1,450.8 billion VND in Q3 2025, representing a 24.2% year-over-year increase compared to Q3 2024. Main growth drivers include Enterprise Cloud Services (+45%) and AI Solutions (+88%). Pre-tax profit stood at 312 billion VND.",
      },
      {
        id: "p-1-2",
        page: 7,
        text: "Operating Expenditures: Research & Development (R&D) investments during the period totaled 145 billion VND, accounting for 10% of total net revenue, focused on core infrastructure and data platform enhancements.",
      },
      {
        id: "p-1-3",
        page: 12,
        text: "Outlook for Q4 2025: Management expects full-year revenue to reach 5,800 billion VND, maintaining positive free cash flow at 420 billion VND.",
      },
    ],
  },
  {
    id: "doc-2",
    name: "Enterprise_Cloud_SLA_Agreement.pdf",
    type: "pdf",
    size: 1820000,
    status: "Indexed",
    pageCount: 16,
    createdAt: "2026-10-06T14:15:00Z",
    category: "Legal & Contracts",
    summary:
      "Service Level Agreement: 99.95% availability commitment, priority response tiers, service credits for downtime, and maintenance windows.",
    passages: [
      {
        id: "p-2-1",
        page: 4,
        text: "Section 5: Service Availability (Uptime). The Provider guarantees minimum system availability of 99.95% per calendar month on a 24/7/365 basis, excluding scheduled maintenance windows announced at least 72 hours in advance.",
      },
      {
        id: "p-2-2",
        page: 9,
        text: "Section 9: Service Credits and Compensation. If monthly uptime falls below 99.0%, the Customer is entitled to a 25% service fee credit applied directly to the subsequent billing cycle.",
      },
    ],
  },
  {
    id: "doc-3",
    name: "System_Architecture_Overview.docx",
    type: "docx",
    size: 980000,
    status: "Indexed",
    pageCount: 18,
    createdAt: "2026-10-07T11:00:00Z",
    category: "Technical Docs",
    summary:
      "Overview of the application stack, document processing pipeline, multi-tenant isolation, caching layer, and data encryption standards.",
    passages: [
      {
        id: "p-3-1",
        page: 2,
        text: "Document Processing Pipeline: Uploaded files are parsed through specialized document extractors supporting PDF tables, formatted Word documents, and text files with strict tenant data isolation.",
      },
      {
        id: "p-3-2",
        page: 6,
        text: "Security & Encryption: All customer documents and generated indices are encrypted at rest using AES-256 and in transit using TLS 1.3.",
      },
    ],
  },
  {
    id: "doc-4",
    name: "Security_Policy_ISO27001.txt",
    type: "txt",
    size: 450000,
    status: "Indexed",
    pageCount: 8,
    createdAt: "2026-10-07T16:20:00Z",
    category: "Compliance",
    summary:
      "Corporate information security policy compliant with ISO/IEC 27001 standards covering access control and data retention.",
    passages: [
      {
        id: "p-4-1",
        page: 1,
        text: "Section 3: Access Control & Data Retention. Document access is governed by role-based access controls (RBAC) with regular quarterly audits and automated audit logging.",
      },
    ],
  },
];

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "Q3 2025 Revenue & SLA terms",
    createdAt: "2026-10-07T18:00:00Z",
    updatedAt: "2026-10-07T18:05:00Z",
    selectedDocIds: ["doc-1", "doc-2"],
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What was the revenue growth in Q3 2025, and what is the SLA credit if uptime drops below 99%?",
        timestamp: "2026-10-07T18:00:10Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: `Here is the summary based on your documents:

**1. Revenue Growth in Q3 2025**
- Consolidated net revenue reached **1,450.8 billion VND**, up **24.2%** year-over-year compared to Q3 2024.
- Key growth drivers were **Enterprise Cloud Services (+45%)** and **AI Solutions (+88%)**.
- Pre-tax profit for the quarter was **312 billion VND**.

**2. SLA Compensation (Uptime < 99%)**
- If monthly system availability falls below **99.0%**, customers receive a **25% service fee credit**.
- This credit is applied directly to the next billing cycle.`,
        timestamp: "2026-10-07T18:00:15Z",
        citations: [
          {
            id: "cit-1",
            documentId: "doc-1",
            documentName: "Financial_Report_Q3_2025.pdf",
            page: 3,
            passageText:
              "Consolidated net revenue reached 1,450.8 billion VND in Q3 2025, representing a 24.2% year-over-year increase compared to Q3 2024. Main growth drivers include Enterprise Cloud Services (+45%) and AI Solutions (+88%). Pre-tax profit stood at 312 billion VND.",
          },
          {
            id: "cit-2",
            documentId: "doc-2",
            documentName: "Enterprise_Cloud_SLA_Agreement.pdf",
            page: 9,
            passageText:
              "Section 9: Service Credits and Compensation. If monthly uptime falls below 99.0%, the Customer is entitled to a 25% service fee credit applied directly to the subsequent billing cycle.",
          },
        ],
      },
    ],
  },
];

export const SUBTLE_PROMPTS = [
  "Summarize the Q3 financial results",
  "What are the SLA uptime guarantees and penalties?",
  "What security and encryption standards are used?",
];
