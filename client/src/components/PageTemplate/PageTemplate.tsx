import { useParams } from "react-router-dom";
import { getPageTitle } from "../../utils/pageRoutes";
import "./PageTemplate.css";

const PageTemplate: React.FC = () => {
  const { slug = "" } = useParams();
  const title = getPageTitle(slug);

  return (
    <section className="page-template">
      <h1>{title}</h1>
      <p>Здесь будет текст для страницы «{title}».</p>
    </section>
  );
};

export default PageTemplate;
