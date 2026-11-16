import { useEffect, useState } from "react";
import type { Specialist } from "../../types/Specialist";
import "./SpecialistsModal.css";

interface SpecialistsModalProps {
  onClose: () => void;
}

const getFullName = (specialist: Specialist) =>
  `${specialist.lastName} ${specialist.firstName} ${specialist.middleName}`;

const getDetailValue = (value: string) => value || "—";

const SpecialistsModal: React.FC<SpecialistsModalProps> = ({ onClose }) => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadSpecialists = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/doctors`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result: Specialist[] = await response.json();
        if (isCurrentRequest) {
          setSpecialists(result);
        }
      } catch (error) {
        console.error("Could not load doctors:", error);
        if (isCurrentRequest) {
          setLoadError(
            "Не удалось загрузить список врачей. Проверьте подключение к серверу.",
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    void loadSpecialists();
    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey]);

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
        className="specialists-modal"
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

        {selectedSpecialist ? (
          <>
            <button
              className="specialists-modal__back"
              type="button"
              onClick={() => setSelectedSpecialist(null)}
            >
              &larr; Все врачи
            </button>
            <h2 id="specialists-modal-title">
              {getFullName(selectedSpecialist)}
            </h2>
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
                    <dd>{getDetailValue(selectedSpecialist.specialty)}</dd>
                  </div>
                  <div>
                    <dt>Подразделение</dt>
                    <dd>{getDetailValue(selectedSpecialist.department)}</dd>
                  </div>
                  <div>
                    <dt>Стаж по специальности</dt>
                    <dd>{getDetailValue(selectedSpecialist.experience)}</dd>
                  </div>
                </dl>
              </section>

              <section className="specialist-details__section">
                <h3>Образование и квалификация</h3>
                <dl>
                  <div>
                    <dt>Образование, специальность и организация</dt>
                    <dd>{getDetailValue(selectedSpecialist.education)}</dd>
                  </div>
                  <div>
                    <dt>Сертификат</dt>
                    <dd>{getDetailValue(selectedSpecialist.certificate)}</dd>
                  </div>
                  <div>
                    <dt>Категория</dt>
                    <dd>{getDetailValue(selectedSpecialist.category)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </>
        ) : (
          <>
            <h2 id="specialists-modal-title">Врачи</h2>
            {isLoading ? (
              <p className="specialists-message">Загружаем список врачей…</p>
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
              <p className="specialists-message">В базе пока нет врачей.</p>
            ) : (
              <div className="specialists-list">
                {specialists.map((specialist) => (
                  <button
                    className="specialist-card"
                    key={specialist.id}
                    type="button"
                    onClick={() => setSelectedSpecialist(specialist)}
                  >
                    <span className="specialist-card__name">
                      {getFullName(specialist)}
                    </span>
                    <span className="specialist-card__position">
                      {specialist.position}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SpecialistsModal;
