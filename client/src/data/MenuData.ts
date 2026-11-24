export interface MenuLink {
  title: string;
  path?: string;
}

export interface MenuItem {
  title: string;
  links: MenuLink[];
}

const PATHS = {
  specialists: "/specialists",
  appointment: "/appointment",
} as const;

const aboutInstitute: MenuItem = {
  title: "Об институте",
  links: [
    { title: "История", path: "/history" },
    { title: "Миссия", path: "/missiya" },
    { title: "Официальные документы" },
    { title: "Структура" },
    { title: "Специалисты", path: PATHS.specialists },
    { title: "Контролирующие органы", path: "/kontroliruyushchie-organy" },
    { title: "Противодействие коррупции" },
    { title: "Профилактика терроризма" },
    { title: "Вакансии", path: "/vakansii" },
  ],
};

const forPatients: MenuItem = {
  title: "Пациентам",
  links: [
    { title: "Правила записи на прием", path: "/pravila-zapisi-na-priem" },
    { title: "Расписание специалистов" },
    { title: "Госпитализация от А до Я", path: "/gospitalizatsiya-ot-a-do-ya" },
    { title: "Памятки пациентам" },
    { title: "Услуги", path: "/uslugi" },
    { title: "Виды медицинской помощи", path: "/vidy-meditsinskoy-pomoshchi" },
    {
      title: "Правила и график посещения",
      path: "/pravila-i-grafik-poseshcheniya",
    },
    { title: "Лекарственное обеспечение" },
    {
      title: "Информация о страховых организациях",
      path: "/informatsiya-o-strakhovykh-organizatsiyakh",
    },
    { title: "Политика конфиденциальности" },
    { title: "Медицинский туризм", path: "/meditsinskiy-turizm" },
    { title: "Специалисты", path: PATHS.specialists },
  ],
};

const paidServices: MenuItem = {
  title: "Платные услуги",
  links: [
    { title: "Правила записи на платный прием" },
    { title: "Запись на прием", path: PATHS.appointment },
    { title: "Специалисты", path: PATHS.specialists },
    { title: "Виды услуг" },
    { title: "Прейскурант" },
    { title: "Документы" },
    { title: "ДМС" },
  ],
};

const pressCenter: MenuItem = {
  title: "Пресс-центр",
  links: [
    { title: "Новости" },
    { title: "Мероприятия" },
    { title: "СМИ о нас" },
    { title: "Отзывы" },
    { title: "Полезные ссылки" },
  ],
};

const clinic: MenuItem = {
  title: "Клиника",
  links: [
    { title: "ИБ 1" },
    { title: "ИБ 2" },
    { title: "ИБ 3" },
    { title: "Поликлиника" },
    { title: "АИК" },
    { title: "Кардиохирургия" },
    { title: "Центр женской кардиологии" },
    { title: "Центр мужской кардиологии" },
    { title: "Центр липидологии" },
    { title: "Фарм исследования" },
  ],
};

const contacts: MenuItem = {
  title: "Контакты",
  links: [],
};

const anniversary: MenuItem = {
  title: "Юбилей",
  links: [{ title: "Лонгрид про юбилей. Страница, отличающаяся от сайта" }],
};

export const menuData = [
  aboutInstitute,
  forPatients,
  paidServices,
  pressCenter,
  clinic,
  contacts,
  anniversary,
] satisfies MenuItem[];
