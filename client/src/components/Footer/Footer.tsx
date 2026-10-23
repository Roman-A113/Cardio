import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#">VK</a>
          <a href="#">Telegram</a>
        </div>
        <p>© 2026 Уральский институт кардиологии. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
