import React from "react";
import { menuData } from "../../data/MenuData";
import "./MainNav.css";

const MainNav: React.FC = () => {
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
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
