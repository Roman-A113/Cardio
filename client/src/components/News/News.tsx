import React from "react";
import "./News.css";

const News: React.FC = () => {
  const newsList = [
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

  return (
    <section className="news-section">
      <div className="news-container">
        <h2 className="news-main-title">Новости и события</h2>

        <div className="news-grid">
          {newsList.map((news) => (
            <article key={news.id} className="news-card">
              <div className="news-card-header">
                <h3 className="news-title">{news.title}</h3>
              </div>

              <div className="news-card-body">
                <span className="news-date">{news.date}</span>
                <p className="news-text">{news.text}</p>
                <a href="#" className="news-link">
                  Читать далее →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
