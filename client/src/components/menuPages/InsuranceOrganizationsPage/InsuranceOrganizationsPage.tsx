import "../PatientInfoPages.css";

const InsuranceOrganizationsPage: React.FC = () => {
  return (
    <section className="patient-info-page">
      <div className="patient-info-page__content">
        <h1>Информация о страховых организациях</h1>

        <article className="patient-info-card patient-info-card--featured">
          <p>
            Ознакомиться с актуальным списком страховых организаций вы можете на
            сайте ТФОМС:
          </p>
          <p>
            <a
              className="patient-info-link"
              href="https://oms66.ru/grazhdanam/spiski/reestr-strakhovykh-meditsinskikh-organizatsiy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Реестр страховых медицинских организаций на сайте ТФОМС
            </a>
          </p>
        </article>
      </div>
    </section>
  );
};

export default InsuranceOrganizationsPage;
