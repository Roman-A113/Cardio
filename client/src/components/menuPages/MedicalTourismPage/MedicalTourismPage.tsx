import "../PatientInfoPages.css";

const MedicalTourismPage: React.FC = () => {
  return (
    <section className="patient-info-page">
      <div className="patient-info-page__content">
        <h1>Медицинский туризм / Medical Tourism</h1>

        <div className="medical-tourism-grid">
          <article className="patient-info-card medical-tourism-card" lang="ru">
            <span className="medical-tourism-card__language">Русский</span>
            <h2>Информация для пациентов</h2>
            <p>
              Институт пока не оказывает услуги медицинского туризма. Информация
              для пациентов из других регионов и стран будет опубликована
              отдельно, если такие услуги появятся.
            </p>
            <h2>Об институте</h2>
            <p>
              ГБУЗ СО «Уральский институт кардиологии» — ведущее
              специализированное медицинское и научное учреждение в
              Екатеринбурге и Уральском федеральном округе. Институт работает по
              профилям кардиологии и сердечно-сосудистой хирургии.
            </p>
          </article>

          <article className="patient-info-card medical-tourism-card" lang="en">
            <span className="medical-tourism-card__language">English</span>
            <h2>Information for patients</h2>
            <p>
              The Institute does not currently offer medical tourism services.
              Information for patients from other regions and countries will be
              published if these services become available.
            </p>
            <h2>About the Institute</h2>
            <p>
              The Ural Institute of Cardiology is a leading specialized medical
              and research institution in Yekaterinburg and the Ural Federal
              District. Its areas of expertise include cardiology and
              cardiovascular surgery.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MedicalTourismPage;
