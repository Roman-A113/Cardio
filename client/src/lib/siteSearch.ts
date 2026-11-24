import { useSyncExternalStore } from "react";

export interface SiteSearchDocument {
  title: string;
  path: string;
  section: string;
  content: string;
}

export type SiteSearchResult = Pick<
  SiteSearchDocument,
  "title" | "path" | "section"
> & { snippet: string };

let siteSearchDocuments: SiteSearchDocument[] = [];
const subscribers = new Set<() => void>();

const subscribeToSearchDocuments = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
};

const getSearchDocumentsSnapshot = () => siteSearchDocuments;

export const setSiteSearchDocuments = (documents: SiteSearchDocument[]) => {
  siteSearchDocuments = documents;
  subscribers.forEach((subscriber) => subscriber());
};

export const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, " ")
    .trim();

const getSearchSnippet = (
  content: string,
  queryTerms: string[],
) => {
  const match = Array.from(content.matchAll(/[a-zа-яё0-9]+/gi)).find(
    ([word]) =>
      queryTerms.some((term) => normalizeSearchText(word).includes(term)),
  );

  const start =
    match?.index === undefined ? 0 : Math.max(0, match.index - 70);
  const end = Math.min(content.length, start + 180);
  const snippet = content.slice(start, end).trim();

  return `${start > 0 ? "…" : ""}${snippet}${end < content.length ? "…" : ""}`;
};

export const searchSite = (
  query: string,
  documents = siteSearchDocuments,
): SiteSearchResult[] => {
  const normalizedQuery = normalizeSearchText(query);
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (queryTerms.length === 0) {
    return [];
  }

  return documents
    .map((document) => {
      const title = normalizeSearchText(document.title);
      const searchableText = normalizeSearchText(document.content);
      const searchableTerms = searchableText.split(/\s+/);
      const matches = queryTerms.every((term) =>
        [...title.split(/\s+/), ...searchableTerms].some((word) =>
          word.includes(term),
        ),
      );

      const score = queryTerms.reduce((total, term) => {
        if (title.includes(term)) {
          return total + 10;
        }
        if (searchableTerms.some((word) => word.includes(term))) {
          return total + 1;
        }
        return total;
      }, 0);

      return { document, matches, score };
    })
    .filter((result) => result.matches)
    .sort((left, right) => right.score - left.score)
    .map(({ document }) => ({
      title: document.title,
      path: document.path,
      section: document.section,
      snippet: getSearchSnippet(document.content, queryTerms),
    }));
};

export const useSiteSearch = (query: string) => {
  const documents = useSyncExternalStore(
    subscribeToSearchDocuments,
    getSearchDocumentsSnapshot,
    getSearchDocumentsSnapshot,
  );

  return searchSite(query, documents);
};
