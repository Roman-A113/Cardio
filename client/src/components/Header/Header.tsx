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

        <div className="header-actions">
          <div className="icons-group">
            <button aria-label="Версия для слабовидящих" className="icon-btn">
              <img src="/images/eye.png" alt="" width="36" height="36" />
            </button>
            <button aria-label="Поиск" className="icon-btn">
              <img src="/images/search.png" alt="" width="36" height="36" />
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

          <div className="contacts-block">
            <p>
              Справка: <strong>+7 (343) 267-46-39</strong>
            </p>
            <p>
              Приемное отделение: <strong>+7 (343) 257-40-94</strong>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
