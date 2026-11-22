import { Link, useParams } from "react-router-dom";
import { getPageTitle } from "../../utils/pageRoutes";
import "./PageTemplate.css";

const PageTemplate: React.FC = () => {
  const { slug = "" } = useParams();
  const title = getPageTitle(slug);

  if (!title) {
    return (
      <section className="page-template">
        <h1>Страница не существует</h1>
        <div className="page-template__not-found">
          <p>Проверьте адрес или вернитесь на главную страницу.</p>
          <Link to="/" className="page-template__home-link">
            Перейти на главную
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-template">
      <h1>{title}</h1>
      <p>Здесь будет текст для страницы «{title}».</p>
    </section>
  );
};

export default PageTemplate;
