import "./VacanciesPage.css";

const VacanciesPage: React.FC = () => {
  return (
    <section className="vacancies-page">
      <div className="vacancies-page__content">
        <h1>Вакансии</h1>

        <article className="vacancies-card vacancies-card--intro">
          <p>
            ГБУЗ СО «Уральский институт кардиологии» — ведущее
            специализированное медицинское и научное учреждение по профилю
            кардиологии и сердечно-сосудистой хирургии в Екатеринбурге и
            Уральском федеральном округе. Учреждение было признано лучшим
            кардиоцентром страны на Национальном конгрессе кардиологов и имеет
            международный сертификат качества. В штате работают доктора и
            кандидаты медицинских наук, заслуженные врачи РФ и десятки
            специалистов высшей категории.
          </p>
        </article>

        <section
          className="vacancies-openings"
          aria-labelledby="vacancies-openings-title"
        >
          <h2 id="vacancies-openings-title">Актуальные вакансии</h2>
          <p>Сейчас открытых вакансий нет.</p>
        </section>

        <section
          className="vacancies-response"
          aria-labelledby="vacancies-form-title"
        >
          <div className="vacancies-response__header">
            <h2 id="vacancies-form-title">Оставить отклик</h2>
            <p>
              Вы можете оставить контакты и рассказать, какая должность вас
              интересует.
            </p>
          </div>

          <p
            className="vacancies-form-notice"
            id="vacancies-form-status"
            role="status"
          >
            Отправка через сайт пока не настроена: адрес кадровиков и почтовый
            сервер не указаны. Заполненные поля и прикреплённое резюме не
            отправляются и не сохраняются.
          </p>

          <form className="vacancies-form">
            <label className="vacancies-form__field">
              <span>ФИО</span>
              <input type="text" name="fullName" autoComplete="name" required />
            </label>

            <label className="vacancies-form__field">
              <span>Желаемая должность</span>
              <input type="text" name="desiredPosition" required />
            </label>

            <label className="vacancies-form__field">
              <span>Номер телефона</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>

            <label className="vacancies-form__field">
              <span>Электронная почта</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>

            <label className="vacancies-form__field vacancies-form__field--wide">
              <span>Сообщение</span>
              <textarea name="message" rows={5} />
            </label>

            <label className="vacancies-form__field vacancies-form__field--wide">
              <span>Резюме (PDF, DOC или DOCX, до 10 МБ)</span>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </label>

            <button
              className="vacancies-form__submit"
              type="button"
              aria-describedby="vacancies-form-status"
              disabled
            >
              Отправить отклик
            </button>
          </form>
        </section>
      </div>
    </section>
  );
};

export default VacanciesPage;
