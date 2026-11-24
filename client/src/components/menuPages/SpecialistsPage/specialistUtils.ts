import type { Specialist } from "../../types/Specialist";

export const getFullName = (specialist: Specialist) =>
  [specialist.lastName, specialist.firstName, specialist.middleName]
    .filter(Boolean)
    .join(" ");

export const getDetailValue = (value: string) => value || "—";
