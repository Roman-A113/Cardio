import React from "react";
import { newsData } from "../../data/NewsData";
import "./News.css";

const News: React.FC = () => {
  return (
    <section className="news-section">
      <div className="news-container">
        <h2 className="news-main-title">Новости и события</h2>

        <div className="news-grid">
          {newsData.map((news) => (
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
