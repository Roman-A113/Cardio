import type { Specialist } from "../../types/Specialist";

export type SpecialistGroup = "all" | "doctors" | "nurses";

export interface Specialty {
  id: number;
  name: string;
}

export const specialistGroupOptions: SpecialistGroup[] = [
  "all",
  "doctors",
  "nurses",
];

export const specialistGroups: Record<
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

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function fetchSpecialists(
  group: SpecialistGroup,
  search: string,
  specialtyId: string,
): Promise<Specialist[]> {
  const query = new URLSearchParams();
  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    query.set("search", trimmedSearch);
  }
  if (specialtyId) {
    query.set("specialtyId", specialtyId);
  }

  const response = await fetch(
    `${apiUrl}/api/${specialistGroups[group].endpoint}?${query}`,
  );
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSpecialties(
  group: SpecialistGroup,
): Promise<Specialty[]> {
  const staffType = specialistGroups[group].staffType;
  const response = await fetch(
    `${apiUrl}/api/specialties?staffType=${staffType}`,
  );
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
