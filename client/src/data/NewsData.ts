export interface NewsItem {
  id: number;
  date: string;
  title: string;
  text: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    date: "15 мая 2026",
    title: "Заголовок",
    text: "Описание",
  },
  {
    id: 2,
    date: "10 мая 2026",
    title: "Заголовок",
    text: "Описание",
  },
  {
    id: 3,
    date: "5 мая 2026",
    title: "Заголовок",
    text: "Описание",
  },
];
