import "./AppointmentRulesPage.css";

const AppointmentRulesPage: React.FC = () => {
  return (
    <section className="appointment-rules-page">
      <div className="appointment-rules-page__content">
        <h1>Правила записи на прием</h1>

        <article className="appointment-rules-card">
          <p>
            Мы оказываем бесплатную медицинскую помощь всем жителям Свердловской
            области по направлению, а также предоставляем платные услуги.
          </p>
        </article>

        <section
          className="appointment-rules-steps"
          aria-label="Как попасть на бесплатную консультацию"
        >
          <article className="appointment-rules-card appointment-rules-step">
            <header className="appointment-rules-step__header">
              <span className="appointment-rules-step__number">Шаг 1</span>
              <h2>Запишитесь у врача в поликлинике</h2>
            </header>
            <p>
              Обратитесь к терапевту или кардиологу по месту жительства. Врач
              выдаст направление в наш институт и запишет вас к нашему
              специалисту на конкретные дату и время. Обязательно уточните у
              врача, на какой день и час вы записаны.
            </p>
          </article>

          <article className="appointment-rules-card appointment-rules-step">
            <header className="appointment-rules-step__header">
              <span className="appointment-rules-step__number">Шаг 2</span>
              <h2>Приходите на прием</h2>
            </header>
            <p>
              Приезжайте в институт в назначенные дату и время. Пожалуйста,
              возьмите с собой:
            </p>

            <div className="appointment-rules-documents">
              <section className="appointment-rules-documents__group">
                <h3>Документы</h3>
                <ul className="docs-list">
                  <li>паспорт;</li>
                  <li>полис обязательного медицинского страхования (ОМС);</li>
                  <li>СНИЛС.</li>
                </ul>
              </section>

              <section className="appointment-rules-documents__group">
                <h3>Медицинские документы (в распечатанном виде)</h3>
                <ul>
                  <li>
                    направление на консультацию в ГБУЗ СО «Уральский институт
                    кардиологии» от врача поликлиники по месту жительства с
                    указанием диагноза;
                  </li>
                  <li>выписки из амбулаторной карты и стационара;</li>
                  <li>результаты проведённых обследований.</li>
                </ul>
              </section>
            </div>

            <p className="appointment-rules-step__note">
              Полный комплект документов поможет врачу быстрее и точнее оценить
              ваше состояние и подобрать лечение.
            </p>
          </article>
        </section>

        <article className="appointment-rules-card appointment-rules-paid">
          <h2>Платные услуги</h2>
          <p>
            Для записи позвоните по телефону{" "}
            <a href="tel:+73432243331">(343) 224-33-31</a>.
          </p>
        </article>

        <section
          className="appointment-rules-card appointment-rules-files"
          aria-labelledby="appointment-rules-files-title"
        >
          <h2 id="appointment-rules-files-title">Полезные документы</h2>
          <ul>
            <li>
              <a
                href="http://cardio-burg.ru/images/docs/rules/prikaz159_29-12-17.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Приказ от 29.12.2017 г. № 159 о введении в действие «Правил
                поведения пациентов в ГБУЗ СО „Уральский институт кардиологии“»
              </a>
            </li>
            <li>
              <a
                href="http://cardio-burg.ru/images/docs/rules/pravila_povedeniya_pacientov_2018.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Правила поведения пациентов
              </a>
            </li>
            <li>
              <a
                href="http://cardio-burg.ru/images/docs/rules/pravila_vn_rasporyadka.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Правила внутреннего распорядка
              </a>
            </li>
            <li>
              <a
                href="http://cardio-burg.ru/images/docs/dopinfo/pamyatka_o_garantiyah.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Памятка для граждан о гарантиях бесплатного оказания медицинской
                помощи
              </a>
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
};

export default AppointmentRulesPage;
