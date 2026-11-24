import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSiteSearch } from "../../lib/siteSearch";
import SiteSearchHighlight from "../SiteSearchHighlight/SiteSearchHighlight";
import "./SiteSearchResults.css";

const SiteSearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const results = useSiteSearch(query);

  return (
    <section className="site-search-page">
      <div className="site-search-page__content">
        <p className="site-search-page__eyebrow">Поиск по сайту</p>
        <h1>Результаты поиска</h1>

        {query ? (
          <p className="site-search-page__description">
            По запросу <strong>«{query}»</strong>{" "}
            {results.length > 0
              ? `найдено: ${results.length}`
              : "ничего не найдено"}
          </p>
        ) : (
          <p className="site-search-page__description">
            Введите название раздела или слова из текста страницы.
          </p>
        )}

        {results.length > 0 ? (
          <div className="site-search-results">
            {results.map((result) => (
              <Link
                className="site-search-result"
                key={result.path}
                to={result.path}
              >
                <span className="site-search-result__section">
                  {result.section}
                </span>
                <h2>{result.title}</h2>
                <p>
                  <SiteSearchHighlight text={result.snippet} query={query} />
                </p>
                <span className="site-search-result__action">
                  Открыть раздел <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          query && (
            <div className="site-search-empty">
              <span className="site-search-empty__icon" aria-hidden="true">
                ?
              </span>
              <h2>Пока ничего не нашли</h2>
              <p>
                Попробуйте изменить запрос или ввести название пункта меню,
                например «Услуги» или «Специалисты».
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default SiteSearchResults;
