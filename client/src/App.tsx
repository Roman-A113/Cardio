import React from "react";
import Header from "./components/Header/Header.tsx";
import News from "./components/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";
import MainNav from "./components/MainNav/MainNav.tsx";
import HeroSection from "./components/HeroSection/HeroSection.tsx";
import SpecialistsPage from "./components/Specialists/SpecialistsPage.tsx";
import "./styles/variables.css";

const App: React.FC = () => {
  const isSpecialistsPage =
    window.location.pathname.replace(/\/+$/, "") === "/specialists";

  return (
    <div className="app-container">
      <Header />
      <MainNav />
      <main>
        {isSpecialistsPage ? (
          <SpecialistsPage />
        ) : (
          <>
            <HeroSection />
            <News />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
