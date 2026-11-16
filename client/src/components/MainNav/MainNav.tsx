import React, { useState } from "react";
import { menuData } from "../../data/MenuData";
import SpecialistsModal from "../Specialists/SpecialistsModal";
import "./MainNav.css";

const MainNav: React.FC = () => {
  const [isSpecialistsOpen, setIsSpecialistsOpen] = useState(false);

  return (
    <nav className="main-nav">
      <ul>
        {menuData.map((menuItem) => (
          <li key={menuItem.title} className="nav-item">
            <a href="#">{menuItem.title}</a>
            {menuItem.links.length > 0 && (
              <ul className="dropdown">
                {menuItem.links.map((link, index) => (
                  <li key={index}>
                    {link === "Специалисты" ? (
                      <button
                        className="dropdown__specialists-button"
                        type="button"
                        onClick={() => setIsSpecialistsOpen(true)}
                      >
                        {link}
                      </button>
                    ) : (
                      <a href="#">{link}</a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {isSpecialistsOpen && (
        <SpecialistsModal onClose={() => setIsSpecialistsOpen(false)} />
      )}
    </nav>
  );
};

export default MainNav;
