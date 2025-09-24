/**
 * 解説テキストを3段階（要点・詳細・参考）に自動分割するパーサー
 */

export interface SteppedExplanation {
  summary: string;      // 要点（1-2文）
  details?: string;     // 詳細説明
  reference?: string;   // 参考情報
}

/**
 * 解説文を段階的に分割
 */
export function parseExplanation(explanationText: string): SteppedExplanation {
  const text = explanationText.trim();

  if (!text) {
    return { summary: '' };
  }

  const sections = splitIntoSections(text);

  return {
    summary: extractSummary(sections),
    details: extractDetails(sections),
    reference: extractReference(sections),
  };
}

/**
 * テキストをセクションに分割
 */
function splitIntoSections(text: string): string[] {
  const sections: string[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentSection = '';

  for (const line of lines) {
    if (isSectionStart(line)) {
      if (currentSection) {
        sections.push(currentSection.trim());
      }
      currentSection = line;
    } else {
      currentSection += '\n' + line;
    }
  }

  if (currentSection) {
    sections.push(currentSection.trim());
  }

  return sections.length > 0 ? sections : [text];
}

/**
 * セクション開始を判定
 */
function isSectionStart(line: string): boolean {
  const sectionMarkers = [
    '【',       // 【見出し】形式
    '■',       // ■見出し
    '◆',       // ◆見出し
    '＜',       // ＜見出し＞
  ];

  const referenceMarkers = [
    '参考：',
    '※',
    '注意：',
    '補足：',
    'なお、',
  ];

  return sectionMarkers.some(marker => line.startsWith(marker)) ||
         referenceMarkers.some(marker => line.startsWith(marker));
}

/**
 * 要点を抽出（最初の1-2文）
 */
function extractSummary(sections: string[]): string {
  if (sections.length === 0) return '';

  const firstSection = sections[0];
  const sentences = splitIntoSentences(firstSection);

  if (sentences.length === 0) return firstSection.substring(0, 100);

  if (sentences.length === 1) {
    return sentences[0];
  }

  return sentences.slice(0, 2).join('');
}

/**
 * 詳細説明を抽出
 */
function extractDetails(sections: string[]): string | undefined {
  if (sections.length <= 1) {
    const firstSection = sections[0] || '';
    const sentences = splitIntoSentences(firstSection);

    if (sentences.length <= 2) return undefined;

    return sentences.slice(2).join('').trim();
  }

  const detailSections = sections.filter((section, index) => {
    if (index === 0) {
      const sentences = splitIntoSentences(section);
      return sentences.length > 2;
    }
    return !isReferenceSection(section);
  });

  if (detailSections.length === 0) return undefined;

  if (detailSections[0] === sections[0]) {
    const sentences = splitIntoSentences(detailSections[0]);
    const detailText = sentences.slice(2).join('');
    const otherDetails = detailSections.slice(1).join('\n\n');
    return (detailText + (otherDetails ? '\n\n' + otherDetails : '')).trim() || undefined;
  }

  return detailSections.join('\n\n').trim() || undefined;
}

/**
 * 参考情報を抽出
 */
function extractReference(sections: string[]): string | undefined {
  const referenceSections = sections.filter(isReferenceSection);

  if (referenceSections.length === 0) return undefined;

  return referenceSections.join('\n\n').trim();
}

/**
 * 参考セクションかどうか判定
 */
function isReferenceSection(section: string): boolean {
  const referenceKeywords = [
    '参考：',
    '参考:',
    '※',
    '注意：',
    '注意:',
    '補足：',
    '補足:',
    'なお、',
    'また、',
    'ちなみに',
  ];

  return referenceKeywords.some(keyword => section.includes(keyword));
}

/**
 * 文を分割
 */
function splitIntoSentences(text: string): string[] {
  const sentenceEndings = ['。', '．', '！', '？', '\n'];
  const sentences: string[] = [];
  let currentSentence = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentSentence += char;

    if (sentenceEndings.includes(char)) {
      const trimmed = currentSentence.trim();
      if (trimmed) {
        sentences.push(trimmed);
      }
      currentSentence = '';
    }
  }

  if (currentSentence.trim()) {
    sentences.push(currentSentence.trim());
  }

  return sentences;
}

/**
 * 段階的解説が有効かどうか判定
 */
export function hasSteppedContent(stepped: SteppedExplanation): boolean {
  return !!(stepped.details || stepped.reference);
}