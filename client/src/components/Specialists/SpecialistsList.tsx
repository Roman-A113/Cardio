import type { Specialist } from "../../types/Specialist";
import SpecialistPhoto from "./SpecialistPhoto";
import {
  specialistGroupOptions,
  specialistGroups,
  type SpecialistGroup,
  type Specialty,
} from "./specialistData";
import { getFullName } from "./specialistUtils";

interface SpecialistsListProps {
  specialists: Specialist[];
  specialties: Specialty[];
  group: SpecialistGroup;
  search: string;
  specialtyId: string;
  isLoading: boolean;
  loadError: string;
  specialtiesError: string;
  onSearchChange: (search: string) => void;
  onGroupChange: (group: SpecialistGroup) => void;
  onSpecialtyChange: (specialtyId: string) => void;
  onSelect: (specialist: Specialist) => void;
  onRetry: () => void;
}

const SpecialistsList: React.FC<SpecialistsListProps> = ({
  specialists,
  specialties,
  group,
  search,
  specialtyId,
  isLoading,
  loadError,
  specialtiesError,
  onSearchChange,
  onGroupChange,
  onSpecialtyChange,
  onSelect,
  onRetry,
}) => (
  <>
    <h1>Специалисты</h1>
    <input
      className="specialists-search"
      type="search"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Поиск по ФИО, должности и другим данным"
      aria-label="Поиск по специалистам"
    />
    <div className="specialists-filters">
      <select
        className="specialists-specialty-filter"
        value={group}
        onChange={(event) => {
          const nextGroup = specialistGroupOptions.find(
            (option) => option === event.target.value,
          );
          if (nextGroup) {
            onGroupChange(nextGroup);
          }
        }}
        aria-label="Фильтр по категории специалистов"
      >
        {specialistGroupOptions.map((option) => (
          <option key={option} value={option}>
            {specialistGroups[option].title}
          </option>
        ))}
      </select>
      <select
        className="specialists-specialty-filter"
        value={specialtyId}
        onChange={(event) => onSpecialtyChange(event.target.value)}
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
        Загружаем список {specialistGroups[group].errorLabel}…
      </p>
    ) : loadError ? (
      <div className="specialists-message specialists-message--error">
        <p>{loadError}</p>
        <button
          type="button"
          className="specialists-modal__retry"
          onClick={onRetry}
        >
          Повторить
        </button>
      </div>
    ) : specialists.length === 0 ? (
      <p className="specialists-message">
        {search.trim() || specialtyId
          ? "По заданным условиям специалисты не найдены."
          : `В базе пока нет ${specialistGroups[group].errorLabel}.`}
      </p>
    ) : (
      <div className="specialists-list">
        {specialists.map((specialist) => (
          <button
            className="specialist-card"
            key={specialist.id}
            type="button"
            onClick={() => onSelect(specialist)}
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
);

export default SpecialistsList;
