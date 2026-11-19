import type {
  Appointment,
  CreateAppointmentDto,
  DoctorSlot,
} from "../types/Appointment";
import type { Specialist } from "../types/Specialist";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(input: RequestInfo | URL, init?: RequestInit) : Promise<T> {
    const response = await fetch(`${API_URL}${input.toString().replace(API_URL, "")}`, {
        headers: { "Content-Type": "application/json", ...init?.headers },
        ...init,
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export const api = {
    getDoctors: () => request<Specialist[]>("/api/doctors"),
    getSpecialties: (staffType?: string) =>
        request<{ id: number; name: string }[]>(
          `/api/specialties?staffType=${staffType ?? "ALL"}`,
        ),
    getAppointments: (params?: {staffId?: string; date?: string; status?: string; userId?: string }) => {
        const qs = new URLSearchParams();
        if (params?.staffId) qs.set("staffId", params.staffId);
        if (params?.date) qs.set("date", params.date);
        if (params?.status) qs.set("status", params.status);
        if (params?.userId) qs.set("userId", params.userId);
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