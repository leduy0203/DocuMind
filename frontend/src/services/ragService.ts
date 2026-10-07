import { DocumentItem, Citation } from "@/types";

export interface GenerateResponseOptions {
  query: string;
  documents: DocumentItem[];
  selectedDocIds: string[];
  onToken?: (token: string) => void;
}

export interface GenerateResponseResult {
  fullText: string;
  citations: Citation[];
}

export async function generateRAGAnswer({
  query,
  documents,
  selectedDocIds,
  onToken,
}: GenerateResponseOptions): Promise<GenerateResponseResult> {
  const activeDocs =
    selectedDocIds.length > 0
      ? documents.filter((d) => selectedDocIds.includes(d.id))
      : documents;

  // Retrieve passages from active docs
  const allPassages = activeDocs.flatMap((doc) =>
    (doc.passages || []).map((p) => ({
      ...p,
      docId: doc.id,
      docName: doc.name,
    }))
  );

  const lowerQuery = query.toLowerCase();

  // Find relevant passages
  const scoredPassages = allPassages.map((item) => {
    const textLower = item.text.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
    let matchCount = 0;
    for (const w of words) {
      if (textLower.includes(w)) matchCount++;
    }
    return {
      item,
      score: matchCount,
    };
  });

  scoredPassages.sort((a, b) => b.score - a.score);
  const relevantItems = scoredPassages.slice(0, 3).filter((i) => i.score > 0 || scoredPassages.length <= 2);

  const selectedForCitations =
    relevantItems.length > 0
      ? relevantItems.map((r) => r.item)
      : allPassages.slice(0, 2);

  const citations: Citation[] = selectedForCitations.map((item, idx) => ({
    id: `cit-${Date.now()}-${idx}`,
    documentId: item.docId,
    documentName: item.docName,
    page: item.page,
    passageText: item.text,
  }));

  // Build a clean, professional, readable answer
  let generatedText = "";
  if (citations.length === 0) {
    generatedText = `I could not find information directly addressing your question in the currently selected documents (${activeDocs.map((d) => d.name).join(", ")}).\n\nPlease check your document selection or try rephrasing your question.`;
  } else {
    generatedText = `Based on your documents, here is the relevant information:\n\n`;

    citations.forEach((c) => {
      generatedText += `• **${c.documentName}**${c.page ? ` (Page ${c.page})` : ""}:\n  ${c.passageText}\n\n`;
    });
  }

  // Stream text
  if (onToken) {
    const chunks = generatedText.split(/(?<=\s|[\n.,;:])/);
    for (const chunk of chunks) {
      onToken(chunk);
      await new Promise((r) => setTimeout(r, 14));
    }
  }

  return {
    fullText: generatedText,
    citations,
  };
}
