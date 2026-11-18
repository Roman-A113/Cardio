import { useEffect, useState } from "react";
import type { Specialist } from "../../types/Specialist";
import SpecialistProfile from "./SpecialistProfile";
import SpecialistsList from "./SpecialistsList";
import {
  specialistGroups,
  type SpecialistGroup,
} from "./specialistData";
import { useSpecialists } from "./useSpecialists";
import "./SpecialistsModal.css";

interface SpecialistsModalProps {
  onClose: () => void;
}

const SpecialistsModal: React.FC<SpecialistsModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [group, setGroup] = useState<SpecialistGroup>("all");
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const {
    specialists,
    specialties,
    isLoading,
    loadError,
    specialtiesError,
    retry,
  } = useSpecialists(group, search, specialtyId);

  const changeGroup = (nextGroup: SpecialistGroup) => {
    setGroup(nextGroup);
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
            <SpecialistProfile
              specialist={selectedSpecialist}
              backLabel={specialistGroups[group].backLabel}
              onBack={() => setSelectedSpecialist(null)}
            />
          ) : (
            <SpecialistsList
              specialists={specialists}
              specialties={specialties}
              group={group}
              search={search}
              specialtyId={specialtyId}
              isLoading={isLoading}
              loadError={loadError}
              specialtiesError={specialtiesError}
              onSearchChange={setSearch}
              onGroupChange={changeGroup}
              onSpecialtyChange={setSpecialtyId}
              onSelect={setSelectedSpecialist}
              onRetry={retry}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default SpecialistsModal;
