import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo-section">
          <img
            src="/logo.png"
            alt="Уральский институт кардиологии"
            className="logo"
          />
        </div>

        <div className="search-section">
          <form className="search-form">
            <input
              type="text"
              placeholder="Поиск по сайту..."
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Найти">
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
        </div>

        <div className="header-actions">
          <div className="contacts-block">
            <p>
              Единый контактный центр: <br />
              <strong>+7 (343) 224-33-31</strong>
            </p>
          </div>

          <div className="icons-group">
            <button aria-label="Версия для слабовидящих" className="icon-btn">
              <img src="/images/eye.png" alt="" width="36" height="36" />
            </button>
          </div>

          <div className="auth-buttons">
            <a href="#" className="btn btn-outline">
              Личный кабинет
            </a>
            <a href="#" className="btn btn-primary">
              Записаться
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
