import React, { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { registerSiteSearchDocuments } from "../../lib/siteSearch";
import AppointmentRulesPage from "../menuPages/AppointmentRulesPage/AppointmentRulesPage";
import ControllingAuthoritiesPage from "../menuPages/ControllingAuthoritiesPage/ControllingAuthoritiesPage";
import HistoryPage from "../menuPages/HistoryPage/HistoryPage";
import HospitalizationPage from "../menuPages/HospitalizationPage/HospitalizationPage";
import InsuranceOrganizationsPage from "../menuPages/InsuranceOrganizationsPage/InsuranceOrganizationsPage";
import MedicalCareTypesPage from "../menuPages/MedicalCareTypesPage/MedicalCareTypesPage";
import MedicalTourismPage from "../menuPages/MedicalTourismPage/MedicalTourismPage";
import MissionPage from "../menuPages/MissionPage/MissionPage";
import ServicesPage from "../menuPages/ServicesPage/ServicesPage";
import VacanciesPage from "../menuPages/VacanciesPage/VacanciesPage";
import VisitingRulesPage from "../menuPages/VisitingRulesPage/VisitingRulesPage";
import News from "../News/News";
import PopularCategories from "../PopularCategories/PopularCategories";

const staticPages = [
  {
    path: "/",
    title: "Главная",
    element: (
      <>
        <PopularCategories />
        <News />
      </>
    ),
  },
  { path: "/history", title: "История", element: <HistoryPage /> },
  { path: "/missiya", title: "Миссия", element: <MissionPage /> },
  {
    path: "/kontroliruyushchie-organy",
    title: "Контролирующие органы",
    element: <ControllingAuthoritiesPage />,
  },
  { path: "/vakansii", title: "Вакансии", element: <VacanciesPage /> },
  {
    path: "/pravila-zapisi-na-priem",
    title: "Правила записи на прием",
    element: <AppointmentRulesPage />,
  },
  {
    path: "/gospitalizatsiya-ot-a-do-ya",
    title: "Госпитализация от А до Я",
    element: <HospitalizationPage />,
  },
  { path: "/uslugi", title: "Услуги", element: <ServicesPage /> },
  {
    path: "/vidy-meditsinskoy-pomoshchi",
    title: "Виды медицинской помощи",
    element: <MedicalCareTypesPage />,
  },
  {
    path: "/pravila-i-grafik-poseshcheniya",
    title: "Правила и график посещения",
    element: <VisitingRulesPage />,
  },
  {
    path: "/informatsiya-o-strakhovykh-organizatsiyakh",
    title: "Информация о страховых организациях",
    element: <InsuranceOrganizationsPage />,
  },
  {
    path: "/meditsinskiy-turizm",
    title: "Медицинский туризм",
    element: <MedicalTourismPage />,
  },
];

const readPageText = (root: HTMLElement) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textParts: string[] = [];
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    if (text) {
      textParts.push(text);
    }
    node = walker.nextNode();
  }

  return textParts.join(" ");
};

const getSummary = (root: HTMLElement, content: string) => {
  const paragraph = Array.from(root.querySelectorAll("p"))
    .map((element) => element.textContent?.replace(/\s+/g, " ").trim() ?? "")
    .find((text) => text.length > 40);

  const summary = paragraph ?? content;
  return summary.length > 180 ? `${summary.slice(0, 177).trimEnd()}…` : summary;
};

const SiteSearchIndex: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const pages = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-site-search-path]",
      ) ?? [],
    );

    const pageDocuments = pages.map((page) => {
        const content = readPageText(page);

        return {
          path: page.dataset.siteSearchPath ?? "/",
          title:
            page.querySelector("h1")?.textContent?.trim() ??
            page.dataset.siteSearchTitle ??
            "Раздел",
          section: "",
          summary: getSummary(page, content),
          content,
          menuTitles: [],
        };
      });

    const headerLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".header a[href^='/']"),
    )
      .map((link) => ({
        path: link.getAttribute("href")?.split(/[?#]/, 1)[0] ?? "",
        title: "",
        section: "",
        summary: "",
        content: "",
        menuTitles: [link.textContent?.replace(/\s+/g, " ").trim() ?? ""],
      }))
      .filter((link) => link.path && link.menuTitles[0]);

    registerSiteSearchDocuments([...pageDocuments, ...headerLinks]);
  }, [pathname]);

  return (
    <div className="site-search-index" ref={containerRef} hidden aria-hidden="true">
      {staticPages
        .filter((page) => page.path !== pathname)
        .map((page) => (
          <div
            key={page.path}
            data-site-search-path={page.path}
            data-site-search-title={page.title}
          >
            {page.element}
          </div>
        ))}
    </div>
  );
};

export const SiteSearchPageCapture: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (pathname === "/search") {
      return;
    }

    const main = document.querySelector<HTMLElement>("main");
    if (!main) {
      return;
    }

    const capturePage = () => {
      const content = readPageText(main);
      if (!content) {
        return;
      }

      const title =
        main.querySelector("h1")?.textContent?.trim() ??
        (pathname === "/" ? "Главная" : "");
      registerSiteSearchDocuments([
        {
          path: pathname,
          title,
          section: "",
          summary: getSummary(main, content),
          content,
          menuTitles: [],
        },
      ]);
    };

    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(capturePage);
    });

    capturePage();
    observer.observe(main, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

export default SiteSearchIndex;
