import { useSyncExternalStore } from "react";

export interface SiteSearchDocument {
  title: string;
  path: string;
  section: string;
  summary: string;
  content: string;
}

export type SiteSearchResult = Pick<
  SiteSearchDocument,
  "title" | "path" | "section" | "summary"
>;

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

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, " ")
    .trim();

export const searchSite = (
  query: string,
  documents = siteSearchDocuments,
): SiteSearchResult[] => {
  const normalizedQuery = normalize(query);
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (queryTerms.length === 0) {
    return [];
  }

  return documents
    .map((document) => {
      const title = normalize(document.title);
      const searchableText = normalize(
        `${document.summary} ${document.content}`,
      );
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
      summary: document.summary,
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
