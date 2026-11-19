export type AppointmentType = "OMS" | "PAID";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Appointment {
    id: string;
    scheduledAt: string;
    durationMinutes: number;
    type: AppointmentType;
    status: AppointmentStatus;
    source: string;
    comment?: string;
    patientName: string;
    patientPhone : string;
    patientEmail?: string;
    staff: {
        id: string;
        fullName: string;
        position: string;
        specialty: string;
    };
    service?: {
        id: string;
        name: string;
        price: number | null;
        isPaid: boolean;
    } | null;
}

export interface CreateAppointmentDto {
    staffId: number;
    scheduledAt: string;
    type?: AppointmentType;
    source?: string;
    comment?: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    birthDate?: string;
    serviceId?: string;
}

export interface DoctorSlot {
    start: string;
    end: string;
    available: boolean;
}