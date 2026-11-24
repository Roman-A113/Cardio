import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteSearch } from "../../lib/siteSearch";
import SiteSearchHighlight from "../SiteSearchHighlight/SiteSearchHighlight";
import "./SiteSearchBox.css";

const SiteSearchBox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchResults = useSiteSearch(searchQuery);
  const suggestions = searchResults.slice(0, 5);

  const openSearchResults = () => {
    const query = searchQuery.trim();
    if (!query) {
      return;
    }

    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openSearchResults();
  };

  return (
    <div
      className="site-search"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsSearchOpen(false);
        }
      }}
    >
      <form className="site-search__form" onSubmit={submitSearch}>
        <input
          type="search"
          placeholder="Поиск по сайту..."
          className="site-search__input"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsSearchOpen(false);
            }
          }}
          aria-label="Поиск по разделам и текстам сайта"
        />
        <button type="submit" className="site-search__button" aria-label="Найти">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
      {isSearchOpen && searchQuery.trim() && (
        <div
          className="site-search__suggestions"
          role="region"
          aria-label="Подходящие разделы"
          aria-live="polite"
        >
          {suggestions.length > 0 ? (
            <>
              <p className="site-search__label">Подходящие разделы</p>
              <ul>
                {suggestions.map((result) => (
                  <li key={result.path}>
                    <Link
                      to={result.path}
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <span className="site-search__icon" aria-hidden="true">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="m20 20-4-4" />
                        </svg>
                      </span>
                      <span className="site-search__suggestion-text">
                        <strong>{result.title}</strong>
                        <small>{result.section}</small>
                        <span className="site-search__snippet">
                          <SiteSearchHighlight
                            text={result.snippet}
                            query={searchQuery}
                          />
                        </span>
                      </span>
                      <span
                        className="site-search__arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                className="site-search__all"
                type="button"
                onClick={openSearchResults}
              >
                Показать все результаты
                <span aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <p className="site-search__empty">
              Ничего не найдено. Попробуйте другое слово.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteSearchBox;
