import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import News from "./components/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";
import MainNav from "./components/MainNav/MainNav.tsx";
import HeroSection from "./components/HeroSection/HeroSection.tsx";
import "./styles/variables.css";
import AppointmentForm from "./components/AppointmentForm/AppointmentForm.tsx";
import LKPage from "./components/LKPage/LKPage.tsx";
import PageTemplate from "./components/PageTemplate/PageTemplate.tsx";
import SpecialistsPage from "./components/Specialists/SpecialistsPage.tsx";
import HistoryPage from "./components/menuPages/HistoryPage/HistoryPage.tsx";
import MissionPage from "./components/menuPages/MissionPage/MissionPage.tsx";
import ControllingAuthoritiesPage from "./components/menuPages/ControllingAuthoritiesPage/ControllingAuthoritiesPage.tsx";
import VacanciesPage from "./components/menuPages/VacanciesPage/VacanciesPage.tsx";

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
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/missiya" element={<MissionPage />} />
          <Route
            path="/kontroliruyushchie-organy"
            element={<ControllingAuthoritiesPage />}
          />
          <Route path="/vakansii" element={<VacanciesPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
          <Route path="/appointment" element={<AppointmentForm />} />
          <Route path="/lk" element={<LKPage />} />
          <Route path="/:slug" element={<PageTemplate />} />
          <Route path="*" element={<PageTemplate />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
