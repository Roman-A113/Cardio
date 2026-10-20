import React from "react";
import Header from "./components/Header/Header.tsx";
import HeroSlider from "./components/HeroSlider/HeroSlider.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <HeroSlider />
        {/* Здесь можно добавить секции новостей, услуг и т.д. */}
      </main>
      <Footer />
    </div>
  );
};

export default App;
