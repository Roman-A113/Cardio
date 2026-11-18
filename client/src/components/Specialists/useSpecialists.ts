import { useEffect, useState } from "react";
import type { Specialist } from "../../types/Specialist";
import {
  fetchSpecialists,
  fetchSpecialties,
  specialistGroups,
  type SpecialistGroup,
  type Specialty,
} from "./specialistData";

export function useSpecialists(
  group: SpecialistGroup,
  search: string,
  specialtyId: string,
) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [specialtiesError, setSpecialtiesError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    const load = async () => {
      try {
        const result = await fetchSpecialists(group, search, specialtyId);
        if (isCurrentRequest) {
          setSpecialists(result);
          setLoadError("");
        }
      } catch (error) {
        console.error(`Could not load ${group}:`, error);
        if (isCurrentRequest) {
          setLoadError(
            `Не удалось загрузить список ${specialistGroups[group].errorLabel}. Проверьте подключение к серверу.`,
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
        void load();
      },
      search.trim() ? 250 : 0,
    );

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timer);
    };
  }, [reloadKey, group, search, specialtyId]);

  useEffect(() => {
    let isCurrentRequest = true;

    const load = async () => {
      try {
        const result = await fetchSpecialties(group);
        if (isCurrentRequest) {
          setSpecialties(result);
          setSpecialtiesError("");
        }
      } catch (error) {
        console.error(
          `Could not load ${specialistGroups[group].staffType} specialties:`,
          error,
        );
        if (isCurrentRequest) {
          setSpecialties([]);
          setSpecialtiesError("Не удалось загрузить список специальностей.");
        }
      }
    };

    void load();
    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey, group]);

  return {
    specialists,
    specialties,
    isLoading,
    loadError,
    specialtiesError,
    retry: () => setReloadKey((key) => key + 1),
  };
}
