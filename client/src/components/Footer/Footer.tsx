import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const columns = [
    {
      title: "Информация",
      links: [
        "Официальные документы",
        "Структура",
        "Специалисты",
        "Контролирующие органы",
      ],
    },
    {
      title: "Пациентам",
      links: [
        "Правила записи на прием",
        "Расписание специалистов",
        "Госпитализация от А до Я",
        "Памятки",
      ],
    },
    {
      title: "Услуги",
      links: [
        "Виды медицинской помощи",
        "Лекарственное обеспечение",
        "ДМС",
        "Медицинский туризм",
      ],
    },
    {
      title: "Пресс-центр",
      links: ["Новости", "Мероприятия", "СМИ о нас", "Отзывы"],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-columns">
        {columns.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="social-links">
          <a href="#">VK</a>
          <a href="#">Telegram</a>
        </div>
        <p>© 2026 Уральский институт кардиологии. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
