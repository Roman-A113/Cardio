import React from "react";
import "./MainNav.css";

const MainNav: React.FC = () => {
  const menuItems = [
    "Об институте",
    "Пациентам",
    "Платные услуги",
    "Пресс-центр",
    "Клиника",
    "Контакты",
    "Юбилей",
  ];

  return (
    <nav className="main-nav">
      <ul>
        {menuItems.map((item) => (
          <li key={item}>
            <a href="#">{item}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
