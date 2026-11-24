import "./HospitalizationPage.css";

const HospitalizationPage: React.FC = () => {
  return (
    <section className="hospitalization-page">
      <div className="hospitalization-page__content">
        <h1>Госпитализация от А до Я</h1>

        <article className="hospitalization-card hospitalization-card--emergency">
          <header className="hospitalization-card__header">
            <span className="hospitalization-card__label">Экстренно</span>
            <h2>Экстренная госпитализация</h2>
          </header>

          <p>
            Экстренная госпитализация пациентов в стационар ГБУЗ СО «Уральский
            институт кардиологии» осуществляется при состояниях, угрожающих
            жизни, для оказания неотложной специализированной медицинской
            помощи:
          </p>

          <ul>
            <li>в порядке скорой медицинской помощи;</li>
            <li>
              по направлению из Консультативно-диагностического отделения ГБУЗ
              СО «Уральский институт кардиологии»;
            </li>
            <li>
              по направлению из Диспансерно-реабилитационного отделения ГБУЗ СО
              «Уральский институт кардиологии»;
            </li>
            <li>
              в экстренных случаях по направлению медицинских организаций из
              медицинских организаций любой формы собственности г.
              Екатеринбурга.
            </li>
          </ul>

          <p className="hospitalization-card__note">
            Определение объема, сроков проведения и своевременности
            диагностических и лечебных мероприятий для конкретного пациента
            осуществляется лечащим врачом в соответствии с порядками и
            стандартами оказания медицинской помощи, утвержденными в
            установленном порядке.
          </p>
        </article>

        <article className="hospitalization-card hospitalization-card--planned">
          <header className="hospitalization-card__header">
            <span className="hospitalization-card__label">Планово</span>
            <h2>Плановая госпитализация</h2>
          </header>

          <p>
            Решение вопроса о плановой госпитализации принимается врачами
            Консультативно-диагностического отделения после консультативного
            приема пациентов.
          </p>
        </article>
      </div>
    </section>
  );
};

export default HospitalizationPage;
