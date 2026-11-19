import { useState } from "react";
import Header from "./components/Header/Header.tsx";
import News from "./components/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import "./App.css";
import MainNav from "./components/MainNav/MainNav.tsx";
import HeroSection from "./components/HeroSection/HeroSection.tsx";
import AppointmentForm from "./components/AppointmentForm/AppointmentForm.tsx";
import LKPage from "./components/LKPage/LKPage.tsx";
import "./styles/variables.css";

type View = "home" | "appointment" | "lk";

const App: React.FC = () => {
  const [view, setView] = useState<View>("home");

  return (
    <div className="app-container">
      <Header onNavigate={setView} />
      <MainNav />
      <main>
        {view === "home" && (
          <>
            <HeroSection />
            <News />
          </>
        )}
        {view === "appointment" && <AppointmentForm />}
        {view === "lk" && <LKPage />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
