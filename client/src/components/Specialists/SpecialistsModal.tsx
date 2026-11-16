import { useEffect, useState } from "react";
import type { Specialist } from "../../types/Specialist";
import "./SpecialistsModal.css";

interface SpecialistsModalProps {
  onClose: () => void;
}

const getFullName = (specialist: Specialist) =>
  [specialist.lastName, specialist.firstName, specialist.middleName]
    .filter(Boolean)
    .join(" ");

const getDetailValue = (value: string) => value || "—";

interface SpecialistPhotoProps {
  specialist: Specialist;
  size: "small" | "portrait";
}

type SpecialistGroup = "all" | "doctors" | "nurses";
interface Specialty {
  id: number;
  name: string;
}

const specialistGroupOptions: SpecialistGroup[] = ["all", "doctors", "nurses"];

const specialistGroups: Record<
  SpecialistGroup,
  {
    title: string;
    endpoint: string;
    staffType: string;
    backLabel: string;
    errorLabel: string;
  }
> = {
  all: {
    title: "Все специалисты",
    endpoint: "medical-staff",
    staffType: "ALL",
    backLabel: "Все специалисты",
    errorLabel: "специалистов",
  },
  doctors: {
    title: "Врачи",
    endpoint: "doctors",
    staffType: "DOCTOR",
    backLabel: "Все врачи",
    errorLabel: "врачей",
  },
  nurses: {
    title: "Средний медицинский персонал",
    endpoint: "nurses",
    staffType: "NURSE",
    backLabel: "Все медсёстры",
    errorLabel: "медсестёр",
  },
};

const SpecialistPhoto: React.FC<SpecialistPhotoProps> = ({
  specialist,
  size,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const photoUrl = specialist.photoUrl?.trim();

  return (
    <span
      className={`specialist-photo specialist-photo--${size}`}
      role="img"
      aria-label={`Фото: ${getFullName(specialist)}`}
    >
      {photoUrl && !imageFailed ? (
        <img src={photoUrl} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="17" r="9" />
          <path d="M7 43c1.8-9 8-14 17-14s15.2 5 17 14" />
        </svg>
      )}
    </span>
  );
};

const SpecialistsModal: React.FC<SpecialistsModalProps> = ({ onClose }) => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [specialistGroup, setSpecialistGroup] =
    useState<SpecialistGroup>("all");
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [specialtiesError, setSpecialtiesError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadSpecialists = async () => {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
      const query = new URLSearchParams();
      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        query.set("search", trimmedSearch);
      }
      if (specialtyId) {
        query.set("specialtyId", specialtyId);
      }

      try {
        const response = await fetch(
          `${apiUrl}/api/${specialistGroups[specialistGroup].endpoint}?${query}`,
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result: Specialist[] = await response.json();
        if (isCurrentRequest) {
          setSpecialists(result);
          setLoadError("");
        }
      } catch (error) {
        console.error(`Could not load ${specialistGroup}:`, error);
        if (isCurrentRequest) {
          setLoadError(
            `Не удалось загрузить список ${specialistGroups[specialistGroup].errorLabel}. Проверьте подключение к серверу.`,
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    const timer = window.setTimeout(
      () => {
        setIsLoading(true);
        setLoadError("");
        void loadSpecialists();
      },
      search.trim() ? 250 : 0,
    );

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timer);
    };
  }, [reloadKey, specialistGroup, search, specialtyId]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadSpecialties = async () => {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
      const selectedStaffType = specialistGroups[specialistGroup].staffType;

      try {
        const response = await fetch(
          `${apiUrl}/api/specialties?staffType=${selectedStaffType}`,
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result: Specialty[] = await response.json();
        if (isCurrentRequest) {
          setSpecialties(result);
          setSpecialtiesError("");
        }
      } catch (error) {
        console.error(
          `Could not load ${selectedStaffType} specialties:`,
          error,
        );
        if (isCurrentRequest) {
          setSpecialties([]);
          setSpecialtiesError("Не удалось загрузить список специальностей.");
        }
      }
    };

    void loadSpecialties();
    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey, specialistGroup]);

  const changeSpecialistGroup = (group: SpecialistGroup) => {
    setSpecialistGroup(group);
    setSpecialtyId("");
    setSelectedSpecialist(null);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="specialists-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={`specialists-modal${selectedSpecialist ? " specialists-modal--profile" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="specialists-modal-title"
      >
        <button
          className="specialists-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>

        <div className="specialists-modal__content">
          {selectedSpecialist ? (
            <>
              <button
                className="specialists-modal__back"
                type="button"
                onClick={() => setSelectedSpecialist(null)}
              >
                &larr; {specialistGroups[specialistGroup].backLabel}
              </button>
              <div className="specialist-profile">
                <SpecialistPhoto
                  specialist={selectedSpecialist}
                  size="portrait"
                />
                <div className="specialist-profile__content">
                  <header className="specialist-profile-header">
                    <h2 id="specialists-modal-title">
                      {getFullName(selectedSpecialist)}
                    </h2>
                    <p>{selectedSpecialist.position}</p>
                  </header>
                  <div className="specialist-details">
                    <section className="specialist-details__section">
                      <h3>Основная информация</h3>
                      <dl>
                        <div>
                          <dt>Вид работы</dt>
                          <dd>{getDetailValue(selectedSpecialist.workType)}</dd>
                        </div>
                        <div>
                          <dt>Штатная должность</dt>
                          <dd>{getDetailValue(selectedSpecialist.position)}</dd>
                        </div>
                        <div>
                          <dt>Специальность</dt>
                          <dd>
                            {getDetailValue(selectedSpecialist.specialty)}
                          </dd>
                        </div>
                        <div>
                          <dt>Подразделение</dt>
                          <dd>
                            {getDetailValue(selectedSpecialist.department)}
                          </dd>
                        </div>
                        <div>
                          <dt>Стаж по специальности</dt>
                          <dd>
                            {getDetailValue(selectedSpecialist.experience)}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="specialist-details__section">
                      <h3>Образование и квалификация</h3>
                      <dl>
                        <div>
                          <dt>Образование, специальность и организация</dt>
                          <dd>
                            {getDetailValue(selectedSpecialist.education)}
                          </dd>
                        </div>
                        <div>
                          <dt>Сертификат</dt>
                          <dd>
                            {getDetailValue(selectedSpecialist.certificate)}
                          </dd>
                        </div>
                        <div>
                          <dt>Категория</dt>
                          <dd>{getDetailValue(selectedSpecialist.category)}</dd>
                        </div>
                      </dl>
                    </section>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 id="specialists-modal-title">Специалисты</h2>
              <input
                className="specialists-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по ФИО, должности и другим данным"
                aria-label="Поиск по специалистам"
              />
              <div className="specialists-filters">
                <select
                  className="specialists-specialty-filter"
                  value={specialistGroup}
                  onChange={(event) => {
                    const group = specialistGroupOptions.find(
                      (option) => option === event.target.value,
                    );
                    if (group) {
                      changeSpecialistGroup(group);
                    }
                  }}
                  aria-label="Фильтр по категории специалистов"
                >
                  {specialistGroupOptions.map((group) => (
                    <option key={group} value={group}>
                      {specialistGroups[group].title}
                    </option>
                  ))}
                </select>
                <select
                  className="specialists-specialty-filter"
                  value={specialtyId}
                  onChange={(event) => setSpecialtyId(event.target.value)}
                  aria-label="Фильтр по специальности"
                  disabled={Boolean(specialtiesError)}
                >
                  <option value="">Все специальности</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>
              {specialtiesError && (
                <p className="specialists-filter-error">{specialtiesError}</p>
              )}
              {isLoading ? (
                <p className="specialists-message">
                  Загружаем список{" "}
                  {specialistGroups[specialistGroup].errorLabel}…
                </p>
              ) : loadError ? (
                <div className="specialists-message specialists-message--error">
                  <p>{loadError}</p>
                  <button
                    type="button"
                    className="specialists-modal__retry"
                    onClick={() => setReloadKey((key) => key + 1)}
                  >
                    Повторить
                  </button>
                </div>
              ) : specialists.length === 0 ? (
                <p className="specialists-message">
                  {search.trim() || specialtyId
                    ? "По заданным условиям специалисты не найдены."
                    : `В базе пока нет ${specialistGroups[specialistGroup].errorLabel}.`}
                </p>
              ) : (
                <div className="specialists-list">
                  {specialists.map((specialist) => (
                    <button
                      className="specialist-card"
                      key={specialist.id}
                      type="button"
                      onClick={() => setSelectedSpecialist(specialist)}
                    >
                      <SpecialistPhoto specialist={specialist} size="small" />
                      <span className="specialist-card__text">
                        <span className="specialist-card__name">
                          {getFullName(specialist)}
                        </span>
                        <span className="specialist-card__position">
                          {specialist.position}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SpecialistsModal;
