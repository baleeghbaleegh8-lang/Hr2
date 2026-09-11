/**
 * Advanced Arabic Search Engine
 * Handles Arabic normalization:
 * - Alifs (أ, إ, آ -> ا)
 * - Taa Marbouta / Haa (ة -> ه)
 * - Yaa / Alif Maqsoura (ى -> ي)
 * - Tanween and Diacritics (َ, ً, ُ, ٌ, ِ, ٍ, ّ, ْ)
 * - Punctuations and extra spaces
 */

export function normalizeArabicText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u0652]/g, '')
    // Normalize Alifs
    .replace(/[أإآ]/g, 'ا')
    // Normalize Taa Marbouta to Haa for flexible matching
    .replace(/ة/g, 'ه')
    // Normalize Alif Maqsoura to Yaa
    .replace(/ى/g, 'ي')
    // Remove special punctuation
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
    // Normalize multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export interface SearchMatch<T> {
  item: T;
  score: number;
  matchedFields: string[];
}

export function searchSystemData<T extends Record<string, any>>(
  items: T[],
  query: string,
  fieldGetters: { [key: string]: (item: T) => string }
): SearchMatch<T>[] {
  const normalizedQuery = normalizeArabicText(query);
  if (!normalizedQuery) return items.map(item => ({ item, score: 1, matchedFields: [] }));

  const queryTokens = normalizedQuery.split(' ').filter(Boolean);
  const results: SearchMatch<T>[] = [];

  for (const item of items) {
    let matchedFields: string[] = [];
    let score = 0;

    for (const [fieldName, getter] of Object.entries(fieldGetters)) {
      const fieldValue = normalizeArabicText(getter(item) || '');
      if (!fieldValue) continue;

      let fieldScore = 0;
      // Exact full match
      if (fieldValue === normalizedQuery) {
        fieldScore += 100;
      } else if (fieldValue.includes(normalizedQuery)) {
        fieldScore += 50;
      }

      // Token match
      for (const token of queryTokens) {
        if (fieldValue.includes(token)) {
          fieldScore += 15;
        }
      }

      if (fieldScore > 0) {
        matchedFields.push(fieldName);
        score += fieldScore;
      }
    }

    if (score > 0) {
      results.push({ item, score, matchedFields });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
