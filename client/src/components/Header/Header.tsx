import React from "react";
import { Link } from "react-router-dom";
import SiteSearchBox from "../SiteSearchBox/SiteSearchBox";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <Link to="/" className="logo-section" aria-label="На главную">
            <img
              src="/logo.png"
              alt="Уральский институт кардиологии"
              className="logo"
            />
          </Link>

          <div className="info-block">
            <div className="contacts-block">
              <p>
                Единый контактный центр: <br />
                <strong>+7 (343) 224-33-31</strong>
              </p>
            </div>

            <a
              href="https://yandex.ru/maps/org/uralskiy_institut_kardiologii/140061407325/?ll=60.601731%2C56.816483&z=15.1"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Как добраться
            </a>
          </div>
        </div>

        <SiteSearchBox />

        <div className="header-right">
          <button
            aria-label="Версия для слабовидящих"
            className="accessibility-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="accessibility-icon"
              aria-hidden="true"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <div className="auth-buttons">
            <Link to="/appointment" className="btn btn-primary">
              Записаться
            </Link>
            <Link to="/lk" className="btn btn-outline">
              Личный кабинет
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
