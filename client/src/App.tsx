import React from "react";
import Header from "./components/Header/Header.tsx";
import HeroSlider from "./components/HeroSlider/HeroSlider.tsx";
import News from "./components/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";
import MainNav from "./components/MainNav/MainNav.tsx";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <MainNav />
      <main>
        <HeroSlider />
        <News />
      </main>
      <Footer />
    </div>
  );
};

export default App;
