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
    title: "Открытие нового кардиоцентра",
    text: "В нашем институте открылось новое отделение...",
  },
  {
    id: 2,
    date: "10 мая 2026",
    title: "День здоровья",
    text: "Приглашаем всех желающих на бесплатную проверку...",
  },
  {
    id: 3,
    date: "5 мая 2026",
    title: "Новое оборудование",
    text: "Клиника получила современные аппараты МРТ...",
  },
];
