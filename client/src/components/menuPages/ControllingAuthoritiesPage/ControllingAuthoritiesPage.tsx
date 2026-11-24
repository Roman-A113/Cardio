import "./ControllingAuthoritiesPage.css";

type AuthorityContact = {
  label: string;
  value: string;
  kind: "email" | "phone";
  note?: string;
};

type Authority = {
  name: string;
  leader?: string;
  address?: string;
  contacts: AuthorityContact[];
};

const authorities: Authority[] = [
  {
    name: "Министерство здравоохранения Российской Федерации",
    leader:
      "Михаил Альбертович Мурашко — Министр здравоохранения Российской Федерации",
    address: "127994, ГСП-4, г. Москва, Рахмановский пер., д. 3",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "nfo@minzdrav.gov.ru",
        kind: "email",
        note: "кроме федеральных органов исполнительной власти и органов исполнительной власти субъектов Российской Федерации",
      },
      {
        label: "Телефон справочной службы",
        value: "8 (495) 627-29-44",
        kind: "phone",
      },
      {
        label: "Многоканальный телефон",
        value: "8 (495) 627-24-00",
        kind: "phone",
      },
    ],
  },
  {
    name: "Федеральная служба по надзору в сфере здравоохранения",
    leader:
      "Самойлова Алла Владимировна — Руководитель Федеральной службы по надзору в сфере здравоохранения",
    address: "109074, Москва, Славянская площадь, 4/1",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "info@roszdravnadzor.ru",
        kind: "email",
      },
      {
        label: "Телефон справочной Росздравнадзора",
        value: "8 (499) 578-02-20",
        kind: "phone",
      },
      {
        label: "Телефон пресс-службы",
        value: "8 (495) 624-80-90",
        kind: "phone",
      },
    ],
  },
  {
    name: "Росздравнадзор по Свердловской области",
    leader:
      "Зильбер Наталья Александровна — Руководитель Территориального органа Росздравнадзора по Свердловской области",
    address: "620014, г. Екатеринбург, ул. Попова, д. 30",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "info@reg66roszdravnadzor.ru",
        kind: "email",
      },
      { label: "Телефон", value: "8 (343) 371-63-62", kind: "phone" },
    ],
  },
  {
    name: "Министерство здравоохранения Свердловской области",
    leader:
      "Савинова Татьяна Леонидовна — Заместитель Губернатора Свердловской области — Министр здравоохранения Свердловской области",
    address: "620014, г. Екатеринбург, ул. Вайнера, 34б",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "minzdrav@egov66.ru",
        kind: "email",
      },
      {
        label: "Телефон приемной МЗ СО",
        value: "8 (343) 312-00-03",
        kind: "phone",
      },
      {
        label:
          "Единая телефонная линия по вопросам распространения новой коронавирусной инфекции",
        value: "122",
        kind: "phone",
      },
      {
        label:
          "Телефон горячей линии Министерства здравоохранения Свердловской области",
        value: "8 (800) 1000-153",
        kind: "phone",
      },
      {
        label:
          "Межведомственный контакт-центр «Здоровье жителей Среднего Урала»",
        value: "8-800-234-0000",
        kind: "phone",
      },
    ],
  },
  {
    name: "Территориальный фонд обязательного медицинского страхования Свердловской области",
    leader:
      "Шелякин Валерий Александрович — Директор ТФОМС Свердловской области",
    address: "620102, г. Екатеринбург, ул. Московская, 54",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "public@oms66.ru",
        kind: "email",
      },
      {
        label: "Предварительная запись обязательна по телефону",
        value: "8 (343) 233-50-00",
        kind: "phone",
      },
      {
        label: "Приемная ТФОМС",
        value: "8 (343) 233-50-00",
        kind: "phone",
      },
      {
        label:
          "Межведомственный контакт-центр «Здоровье жителей Среднего Урала»",
        value: "8-800-234-0000",
        kind: "phone",
      },
      {
        label: "Телефон по вопросам получения полисов ОМС",
        value: "8 (343) 362-90-46",
        kind: "phone",
      },
    ],
  },
  {
    name: "Управление Федеральной службы по надзору в сфере защиты прав потребителей и благополучия человека по Свердловской области",
    leader:
      "Козловских Дмитрий Николаевич — Руководитель Управления Федеральной службы по надзору в сфере защиты прав потребителей и благополучия человека по Свердловской области, главный государственный санитарный врач по Свердловской области",
    address: "620078, г. Екатеринбург, пер. Отдельный, 30",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "mail@66.rospotrebnadzor.ru",
        kind: "email",
      },
      { label: "Телефон", value: "8 (343) 374-13-79", kind: "phone" },
    ],
  },
  {
    name: "Территориальный орган Росздравнадзора по Свердловской области",
    address: "620014, Свердловская область, г. Екатеринбург, ул. Попова, д. 30",
    contacts: [
      {
        label: "Адрес электронной почты",
        value: "info@reg66roszdravnadzor.ru",
        kind: "email",
      },
      { label: "Телефон", value: "8 (343) 371-63-62", kind: "phone" },
    ],
  },
];

const hotlineContacts: AuthorityContact[] = [
  {
    label:
      "Телефон доверия по вопросам противодействия коррупции Администрации Губернатора Свердловской области",
    value: "+7 (343) 370-72-02",
    kind: "phone",
  },
  {
    label:
      "Телефон доверия по вопросам противодействия коррупции Министерства здравоохранения Свердловской области",
    value: "+7 (343) 312-00-03, доб. 855",
    kind: "phone",
  },
];

const getContactHref = (contact: AuthorityContact) =>
  contact.kind === "email"
    ? `mailto:${contact.value}`
    : `tel:${contact.value.replace(/\s*доб\..*$/i, "").replace(/[^\d+]/g, "")}`;

const ControllingAuthoritiesPage: React.FC = () => {
  return (
    <section className="authorities-page">
      <div className="authorities-page__content">
        <h1>Контролирующие органы</h1>

        <div className="authorities-grid">
          {authorities.map((authority) => (
            <article className="authority-card" key={authority.name}>
              <h2>{authority.name}</h2>
              {authority.leader && (
                <p className="authority-card__leader">{authority.leader}</p>
              )}
              {authority.address && (
                <address className="authority-card__address">
                  {authority.address}
                </address>
              )}
              <div className="authority-card__contacts">
                {authority.contacts.map((contact) => (
                  <div
                    className="authority-contact"
                    key={`${contact.label}-${contact.value}`}
                  >
                    <span className="authority-contact__label">
                      {contact.label}
                    </span>
                    <a href={getContactHref(contact)}>{contact.value}</a>
                    {contact.note && (
                      <span className="authority-contact__note">
                        {contact.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}

          <article className="authority-card authority-card--hotlines">
            <h2>Телефоны доверия по вопросам противодействия коррупции</h2>
            <div className="authority-card__contacts">
              {hotlineContacts.map((contact) => (
                <div
                  className="authority-contact"
                  key={`${contact.label}-${contact.value}`}
                >
                  <span className="authority-contact__label">
                    {contact.label}
                  </span>
                  <a href={getContactHref(contact)}>{contact.value}</a>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ControllingAuthoritiesPage;
