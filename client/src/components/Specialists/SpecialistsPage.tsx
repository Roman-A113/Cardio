import { useState } from "react";
import type { Specialist } from "../../types/Specialist";
import SpecialistsList from "./SpecialistsList";
import SpecialistsModal from "./SpecialistsModal";
import type { SpecialistGroup } from "./specialistData";
import { useSpecialists } from "./useSpecialists";
import "./SpecialistsModal.css";

const SpecialistsPage: React.FC = () => {
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
  };

  return (
    <section className="specialists-page">
      <div className="specialists-page__content">
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
      </div>
      {selectedSpecialist && (
        <SpecialistsModal
          specialist={selectedSpecialist}
          onClose={() => setSelectedSpecialist(null)}
        />
      )}
    </section>
  );
};

export default SpecialistsPage;
