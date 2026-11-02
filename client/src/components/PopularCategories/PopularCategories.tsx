import React from "react";
import "./PopularCategories.css";

const PopularServices: React.FC = () => {
  const services = [
    { title: "Услуга 1", icon: "👨‍⚕️" },
    { title: "Услуга 2", icon: "👨‍⚕️" },
    { title: "Услуга 3", icon: "👨‍⚕️" },
    { title: "Услуга 4", icon: "👨‍⚕️" },
  ];

  return (
    <div className="popular-categories">
      <h3 className="categories-title">Популярные услуги</h3>

      <div className="categories-grid">
        {services.map((service, index) => (
          <a href="#" key={index} className="category-card">
            <span className="category-icon">{service.icon}</span>
            <span className="category-name">{service.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
