import { useSyncExternalStore } from "react";
import { menuData } from "../data/MenuData";

export interface SiteSearchDocument {
  title: string;
  path: string;
  section: string;
  summary: string;
  content: string;
  menuTitles: string[];
}

export type SiteSearchResult = Pick<
  SiteSearchDocument,
  "title" | "path" | "section" | "summary"
>;

const initialDocuments = new Map<string, SiteSearchDocument>();

for (const menuItem of menuData) {
  for (const link of menuItem.links) {
    if (!link.path) {
      continue;
    }

    const existing = initialDocuments.get(link.path);
    if (existing) {
      if (!existing.menuTitles.includes(link.title)) {
        existing.menuTitles.push(link.title);
      }
      if (!existing.section.split(" · ").includes(menuItem.title)) {
        existing.section = `${existing.section} · ${menuItem.title}`;
      }
      continue;
    }

    initialDocuments.set(link.path, {
      title: link.title,
      path: link.path,
      section: menuItem.title,
      summary: "",
      content: "",
      menuTitles: [link.title],
    });
  }
}

initialDocuments.set("/", {
  title: "Главная",
  path: "/",
  section: "Сайт",
  summary: "",
  content: "",
  menuTitles: [],
});

initialDocuments.set("/lk", {
  title: "Личный кабинет",
  path: "/lk",
  section: "Сайт",
  summary: "",
  content: "",
  menuTitles: ["Личный кабинет"],
});

let siteSearchDocuments = Array.from(initialDocuments.values());
const subscribers = new Set<() => void>();

const subscribeToSearchDocuments = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
};

const getSearchDocumentsSnapshot = () => siteSearchDocuments;

export const registerSiteSearchDocuments = (
  newDocuments: SiteSearchDocument[],
) => {
  const documentsByPath = new Map(
    siteSearchDocuments.map((document) => [document.path, document]),
  );
  let changed = false;

  for (const document of newDocuments) {
    const existing = documentsByPath.get(document.path);
    const mergedDocument = existing
      ? {
          ...existing,
          ...document,
          title: document.title || existing.title,
          summary: document.summary || existing.summary,
          content: document.content || existing.content,
          menuTitles: Array.from(
            new Set([...existing.menuTitles, ...document.menuTitles]),
          ),
          section: document.section || existing.section,
        }
      : document;

    if (
      !existing ||
      existing.title !== mergedDocument.title ||
      existing.summary !== mergedDocument.summary ||
      existing.content !== mergedDocument.content ||
      existing.section !== mergedDocument.section ||
      existing.menuTitles.length !== mergedDocument.menuTitles.length
    ) {
      documentsByPath.set(document.path, mergedDocument);
      changed = true;
    }
  }

  if (!changed) {
    return;
  }

  siteSearchDocuments = Array.from(documentsByPath.values());
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
      const menuTitles = document.menuTitles.map(normalize);
      const matchedMenuTitle = document.menuTitles.find((menuTitle) => {
        const words = normalize(menuTitle).split(/\s+/);
        return queryTerms.every((term) =>
          words.some((word) => word.includes(term)),
        );
      });
      const searchableText = normalize(
        `${document.section} ${document.summary} ${document.content}`,
      );
      const searchableTerms = searchableText.split(/\s+/);
      const matches = queryTerms.every((term) =>
        [
          ...title.split(/\s+/),
          ...menuTitles.flatMap((menuTitle) => menuTitle.split(/\s+/)),
          ...searchableTerms,
        ].some((word) => word.includes(term)),
      );

      const score = queryTerms.reduce((total, term) => {
        if (title.includes(term)) {
          return total + 10;
        }
        if (menuTitles.some((menuTitle) => menuTitle.includes(term))) {
          return total + 8;
        }
        if (searchableTerms.some((word) => word.includes(term))) {
          return total + 1;
        }
        return total;
      }, 0);

      return { document, matches, score, matchedMenuTitle };
    })
    .filter((result) => result.matches)
    .sort((left, right) => right.score - left.score)
    .map(({ document, matchedMenuTitle }) => ({
      title: matchedMenuTitle ?? document.title,
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
