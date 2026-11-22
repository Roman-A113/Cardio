import "../PatientInfoPages.css";

const VisitingRulesPage: React.FC = () => {
  return (
    <section className="patient-info-page">
      <div className="patient-info-page__content">
        <h1>Правила и график посещения</h1>

        <article className="patient-info-card patient-info-card--featured">
          <h2>Информация для посетителей</h2>
          <p>
            В этом разделе будут опубликованы правила посещения пациентов и
            актуальный график.
          </p>
        </article>

        <p className="patient-info-note" role="status">
          Официальный текст правил и PDF-документы пока не предоставлены.
          Разместим их здесь после получения актуальных материалов.
        </p>
      </div>
    </section>
  );
};

export default VisitingRulesPage;
