import React from "react";
import { Link } from "react-router-dom";
import { menuData } from "../../data/MenuData";
import { createPagePath } from "../../utils/pageRoutes";
import "./MainNav.css";

const MainNav: React.FC = () => {
  return (
    <nav className="main-nav">
      <ul>
        {menuData.map((menuItem) => (
          <li key={menuItem.title} className="nav-item">
            {menuItem.links.length > 0 ? (
              <Link to={createPagePath(menuItem.title)}>
                {menuItem.title}
              </Link>
            ) : (
              <Link to={createPagePath(menuItem.title)}>
                {menuItem.title}
              </Link>
            )}
            {menuItem.links.length > 0 && (
              <ul className="dropdown">
                {menuItem.links.map((link, index) => (
                  <li key={index}>
                    {link === "Специалисты" ? (
                      <Link to="/specialists">{link}</Link>
                    ) : (
                      <Link to={createPagePath(link)}>{link}</Link>
                    )}
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
