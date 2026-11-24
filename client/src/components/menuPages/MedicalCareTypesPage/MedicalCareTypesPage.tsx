import "../PatientInfoPages.css";

const MedicalCareTypesPage: React.FC = () => {
  return (
    <section className="patient-info-page">
      <div className="patient-info-page__content">
        <h1>Виды медицинской помощи</h1>

        <article className="patient-info-card patient-info-card--featured">
          <p>
            В ГБУЗ СО «Уральский институт кардиологии» оказывается
            специализированная, в том числе высокотехнологичная медицинская
            помощь по профилям кардиология и сердечно-сосудистая хирургия
            согласно действующей на текущий год Территориальной программе
            государственных гарантий бесплатного оказания медицинской помощи в
            Свердловской области.
          </p>
        </article>

        <section
          className="patient-info-card"
          aria-labelledby="care-list-title"
        >
          <h2 id="care-list-title">Виды помощи и документы</h2>
          <p className="patient-info-note" role="status">
            Перечень видов медицинской помощи и сопутствующие документы пока не
            предоставлены для публикации. Они будут добавлены после получения
            актуальных официальных материалов.
          </p>
        </section>
      </div>
    </section>
  );
};

export default MedicalCareTypesPage;
