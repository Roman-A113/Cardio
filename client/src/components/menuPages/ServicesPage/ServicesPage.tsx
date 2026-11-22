import "./ServicesPage.css";

const serviceSections = [
  { id: "ultrasound", title: "УЗИ" },
  { id: "ct", title: "КТ" },
  { id: "surgery", title: "Хирургия" },
  { id: "minimally-invasive-surgery", title: "Малоинвазивная хирургия" },
];

const ServicesPage: React.FC = () => {
  return (
    <section className="services-page">
      <div className="services-page__content">
        <h1>Услуги</h1>

        <p className="services-page__intro">
          В каждом разделе будут собраны услуги, их описание и информация о
          подготовке.
        </p>

        <p className="services-page__notice" role="status">
          Перечни услуг и рекомендации по подготовке появятся после получения и
          согласования актуальных медицинских материалов.
        </p>

        <div className="services-grid">
          {serviceSections.map((section) => (
            <article
              className="services-card"
              key={section.id}
              aria-labelledby={`services-${section.id}`}
            >
              <span className="services-card__label">Раздел</span>
              <h2 id={`services-${section.id}`}>{section.title}</h2>
              <p>
                Перечень услуг, описание и рекомендации по подготовке будут
                добавлены после согласования материалов.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
