import React, { useState } from "react";
import { Link } from "react-router-dom";
import { menuData } from "../../data/MenuData";
import "./MainNav.css";

const MainNav: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <nav className="main-nav">
      <ul>
        {menuData.map((menuItem) => {
          const isOpen = openItem === menuItem.title;

          return (
            <li
              key={menuItem.title}
              className={`nav-item${isOpen ? " is-open" : ""}`}
              onMouseEnter={() => setOpenItem(menuItem.title)}
              onMouseLeave={() => setOpenItem(null)}
            >
              <span className="nav-item__label">{menuItem.title}</span>

              {menuItem.links.length > 0 && (
                <ul className="dropdown">
                  {menuItem.links.map((link) => (
                    <li key={link.title}>
                      {link.path ? (
                        <Link to={link.path} onClick={() => setOpenItem(null)}>
                          {link.title}
                        </Link>
                      ) : (
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenItem(null);
                          }}
                        >
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MainNav;
