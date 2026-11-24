import React from "react";
import HeroSlider from "../HeroSlider/HeroSlider";
import PopularCategories from "../PopularCategories/PopularCategories";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h2 className="hero-categories-title">Популярное</h2>
        <div className="hero-categories-col">
          <PopularCategories />
        </div>
        <div className="hero-slider-col">
          <HeroSlider />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
