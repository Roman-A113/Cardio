import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import News from "./components/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";
import MainNav from "./components/MainNav/MainNav.tsx";
import HeroSection from "./components/HeroSection/HeroSection.tsx";
import SpecialistsPage from "./components/Specialists/SpecialistsPage.tsx";
import PageTemplate from "./components/PageTemplate/PageTemplate.tsx";
import "./styles/variables.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <MainNav />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <News />
              </>
            }
          />
          <Route path="/specialists" element={<SpecialistsPage />} />
          <Route path="/:slug" element={<PageTemplate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
