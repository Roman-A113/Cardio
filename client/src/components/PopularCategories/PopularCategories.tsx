import React from "react";
import { Link } from "react-router-dom";
import "./PopularCategories.css";

const PopularServices: React.FC = () => {
  const services = [
    { title: "Услуги", icon: "🩺", path: "/uslugi" },
    {
      title: "Виды медицинской помощи",
      icon: "🏥",
      path: "/vidy-meditsinskoy-pomoshchi",
    },
    { title: "Специалисты", icon: "👨‍⚕️", path: "/specialists" },
    {
      title: "Правила записи на прием",
      icon: "📅",
      path: "/pravila-zapisi-na-priem",
    },
  ];

  return (
    <div className="popular-categories">
      <div className="categories-grid">
        {services.map((service) => (
          <Link
            to={service.path}
            key={service.path}
            className="category-card"
          >
            <span className="category-icon">{service.icon}</span>
            <span className="category-name">{service.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
