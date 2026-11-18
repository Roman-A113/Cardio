import { menuData } from "../data/MenuData";

const transliteration: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
  ъ: "",
  ь: "",
};

export const createPageSlug = (title: string): string =>
  title
    .toLocaleLowerCase("ru")
    .split("")
    .map((character) => transliteration[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createPagePath = (title: string): string =>
  `/${createPageSlug(title)}`;

export const getPageTitle = (slug: string): string => {
  const menuTitles = menuData.flatMap((menuItem) => [
    menuItem.title,
    ...menuItem.links,
  ]);

  return (
    menuTitles.find((title) => createPageSlug(title) === slug) ??
    "Страница не найдена"
  );
};
