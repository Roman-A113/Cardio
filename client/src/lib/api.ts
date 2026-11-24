import type {
  Appointment,
  CreateAppointmentDto,
  DoctorSlot,
} from "../types/Appointment";
import type { Specialist } from "../types/Specialist";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${input.toString().replace(API_URL, "")}`,
    {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    },
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = text || `Request failed with status ${response.status}`;
    try {
      const body: unknown = JSON.parse(text);
      if (
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      // Keep the response text when it is not JSON.
    }
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "PATIENT" | "ADMIN" | "DOCTOR";
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<{ message: string }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  getCurrentUser: () => request<{ user: AuthUser }>("/api/auth/me"),
  updateProfile: (profile: {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
  }) =>
    request<{ user: AuthUser }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(profile),
    }),
  getDoctors: () => request<Specialist[]>("/api/doctors"),
  getSpecialties: (staffType?: string) =>
    request<{ id: number; name: string }[]>(
      `/api/specialties?staffType=${staffType ?? "ALL"}`,
    ),
  getAppointments: (params?: {
    staffId?: string;
    date?: string;
    status?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.staffId) qs.set("staffId", params.staffId);
    if (params?.date) qs.set("date", params.date);
    if (params?.status) qs.set("status", params.status);
    return request<Appointment[]>(`/api/appointments?${qs}`);
  },
  createAppointment: (body: CreateAppointmentDto) =>
    request<Appointment>(`/api/appointments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getDoctorSlots: (doctorId: number, date: string) =>
    request<DoctorSlot[]>(`/api/doctors/${doctorId}/slots?date=${date}`),
};
