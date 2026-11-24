import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage: React.FC = () => {
  return (
    <section className="page-template">
      <h1>Страницы не существует</h1>
      <div className="page-template__not-found">
        <Link to="/" className="page-template__home-link">
          Перейти на главную
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
