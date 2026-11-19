import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import cors from "@fastify/cors";
import { env, validateEnv } from "./config/env.js";
import { prisma } from "./db/data-source.js";

const app = fastify({ logger: true });

app.get("/", async () => {
  return "Hello, World!";
});

type StaffType = "DOCTOR" | "NURSE" | "ALL";

interface StaffFilters {
  search?: string;
  specialtyId?: number;
}

interface StaffQuery {
  search?: string;
  specialtyId?: string;
}

interface CreateAppointmentBody {
  staffId : number;
  scheduledAt : string;
  type?: "OMS" | "PAID";
  source?: "SITE" | "PHONE";
  comment?: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  serviceId?: string;
}

interface AppointmentQuery {
  staffId : string;
  date?: string; // YYYY-MM-DD
  status?: string;
  userId?: string;
}

const getMedicalStaff = async (staffType: StaffType, filters: StaffFilters) => {
  const search = filters.search?.trim();
  const staff = await prisma.medicalStaff.findMany({
    where: {
      ...(staffType === "ALL" ? {} : { staffType }),
      ...(filters.specialtyId ? { specialtyId: filters.specialtyId } : {}),
      ...(search
        ? {
            OR: [
              { lastName: { contains: search, mode: "insensitive" as const } },
              { firstName: { contains: search, mode: "insensitive" as const } },
              {
                middleName: { contains: search, mode: "insensitive" as const },
              },
              { position: { contains: search, mode: "insensitive" as const } },
              {
                specialty: {
                  is: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
              {
                department: {
                  is: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
              { education: { contains: search, mode: "insensitive" as const } },
              {
                certificate: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              { category: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: {
      specialty: { select: { name: true } },
      department: { select: { name: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return staff.map((doctor) => ({
    id: String(doctor.id),
    group:
      doctor.staffType === "DOCTOR" ? "Врачи" : "Средний медицинский персонал",
    lastName: doctor.lastName,
    firstName: doctor.firstName,
    middleName: doctor.middleName ?? "",
    workType: doctor.employmentType === "MAIN" ? "Основной" : "Совместитель",
    position: doctor.position,
    specialty: doctor.specialty?.name ?? "",
    department: doctor.department?.name ?? "",
    education: doctor.education ?? "",
    certificate: doctor.certificate ?? "",
    category: doctor.category ?? "",
    experience:
      doctor.experienceYears === null ? "" : `${doctor.experienceYears} лет`,
    photoUrl: doctor.photoUrl,
  }));
};

const registerMedicalStaffRoute = (path: string, staffType: StaffType) => {
  app.get<{ Querystring: StaffQuery }>(path, async (request, reply) => {
    let specialtyId: number | undefined;
    if (request.query.specialtyId) {
      specialtyId = Number(request.query.specialtyId);
      if (!Number.isSafeInteger(specialtyId) || specialtyId < 1) {
        return reply.code(400).send({ message: "Invalid specialtyId" });
      }
    }

    return getMedicalStaff(staffType, {
      search: request.query.search,
      specialtyId,
    });
  });
};

registerMedicalStaffRoute("/api/medical-staff", "ALL");
registerMedicalStaffRoute("/api/doctors", "DOCTOR");
registerMedicalStaffRoute("/api/nurses", "NURSE");

app.get<{ Querystring: { staffType?: string } }>(
  "/api/specialties",
  async (request, reply) => {
    const staffType = request.query.staffType;
    if (
      staffType !== "ALL" &&
      staffType !== "DOCTOR" &&
      staffType !== "NURSE"
    ) {
      return reply
        .code(400)
        .send({ message: "staffType must be ALL, DOCTOR or NURSE" });
    }

    try {
      const specialties = await prisma.specialty.findMany({
        where: {
          medicalStaff: {
            some: staffType === "ALL" ? {} : { staffType },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
      return specialties;
    } catch (error) {
      console.error("Database connection error:", error);

      return reply.code(503).send({
        message: "Database temporarily unavailable. Please try again later.",
      });
    }
  },
);

// GET /api/appointments
app.get<{ Querystring : AppointmentQuery }>(
    "/api/appointments",
    async (request, reply) => {
      const {staffId, date, status, userId} = request.query;
      const where: Record<string, unknown> = {};

      if (staffId) {
        const parsed = Number(staffId);
        if (!Number.isSafeInteger(parsed) || parsed < 1) {
          return reply.code(400).send({ message : "Invalid staffId" });
        }
        where.staffId = parsed;
      }

      if (date) {
        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59`);
        where.scheduledAt = {gte : dayStart, lte : dayEnd};
      }

      if (status) {
        where.status = status;
      }

      if (userId) {
        where.userId = userId;
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          staff: {
            select: {
              id : true,
              firstName : true,
              lastName : true,
              middleName : true,
              position : true,
              specialty : {select: {name : true}}
            },
          },
          service: {
            select: {id : true, name : true, price : true, isPaid : true},
          },
        },
        orderBy : { scheduledAt: "asc"},
      });

      return appointments.map((appointment) => ({
        id: appointment.id,
        scheduledAt: appointment.scheduledAt,
        durationMinutes: appointment.durationMinutes,
        type: appointment.type,
        status: appointment.status,
        source: appointment.source,
        comment: appointment.comment,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        patientEmail: appointment.patientEmail,
        staff: {
          id : String(appointment.staff.id),
          fullName : [appointment.staff.lastName, appointment.staff.firstName, appointment.staff.middleName]
              .filter(Boolean)
              .join(" "),
          position : appointment.staff.position,
          specialty: appointment.staff.specialty?.name ?? "",
        },
        service: appointment.service
        ? {
              id : appointment.service.id,
              name: appointment.service.name,
              price: appointment.service.price,
              isPaid: appointment.service.isPaid,
            }
            : null,
      }));
    }
);

app.post<{Body : CreateAppointmentBody}>(
    "/api/appointments",
    async (request, reply) => {
      const { staffId, scheduledAt, type, source, comment, patientName,
        patientPhone, patientEmail, serviceId} = request.body;

      const parsedStaffId = Number(staffId);
      if (!Number.isSafeInteger(parsedStaffId) || parsedStaffId < 1) {
        return reply.code(400).send({ message : "Invalid staffId"});
      }

      const appointmentDate = new Date(scheduledAt);
      if (Number.isNaN(appointmentDate.getTime())) {
        return reply.code(400).send({ message : "Invalid scheduledAt"});
      }

      const staff = await prisma.medicalStaff.findUnique({
        where : {id : parsedStaffId},
      });
      if (!staff) {
        return reply.code(404).send({ message: "Doctor not found" });
      }

      const existing = await prisma.appointment.findFirst({
        where: {
          staffId: parsedStaffId,
          scheduledAt: appointmentDate,
        },
      });
      if (existing) {
        return reply.code(409).send({ message : "Slot already booked"});
      }

      if (!patientName || !patientPhone) {
          return reply.code(400).send({ message: "patientName and patientPhone are required"});
      }

      const appointment = await prisma.appointment.create({
        data: {
          staffId: parsedStaffId,
          scheduledAt: appointmentDate,
          type: type ?? "OMS",
          source: source ?? "SITE",
          comment: comment ?? null,
          patientName : patientName ?? "",
          patientPhone : patientPhone ?? "",
          patientEmail: patientEmail ?? null,
          serviceId : serviceId ?? null,
          userId: null,
        },
        include: {
          staff: { select: { id : true, firstName: true, lastName : true, specialty : {select: {name : true}} } },
          service : { select : { id: true, name : true, price : true, isPaid : true } },
        },
      });

      return reply.code(201).send({
        id : appointment.id,
        scheduledAt : appointment.scheduledAt,
        status: appointment.status,
        type: appointment.type,
        staff: {
          id: String(appointment.staff.id),
          fullName: `${appointment.staff.lastName} ${appointment.staff.firstName}`,
          specialty: appointment.staff.specialty?.name ?? "",
        },
        service : appointment.service
        ? { id : appointment.service.id, name : appointment.service.name, isPaid: appointment.service.isPaid}
            : null,
      });
    },
);

// GET /api/doctors/:id/slots - свободные слоты врача на дату
app.get<{ Params : {id : string}; Querystring : {date : string}}>(
    "/api/doctors/:id/slots",
    async (request, reply) => {
      const staffId = Number(request.params.id);
      const {date} = request.query;

      if (!Number.isSafeInteger(staffId) || staffId < 1) {
        return reply.code(400).send({ message: "Invalid doctor id" });
      }

      if (!date) {
        return reply.code(400).send({ message: "date is required (YYYY-MM-DD)" });
      }

      const dayStart = new Date(`${date}T00:00:00`);
      const dayEnd = new Date(`${date}T23:59:59`);

      const weekday = dayStart.getDay();
      const schedules = await prisma.doctorSchedule.findMany({
        where: { staffId, weekday},
      });

      if (schedules.length === 0) {
        return reply.code(404).send({ message: "No schedule for this day" });
      }

      const busy = await prisma.appointment.findMany({
        where: {
          staffId,
          scheduledAt : {gte: dayStart, lte: dayEnd},
          status: { not : "CANCELLED"},
        },
        select: {scheduledAt : true, durationMinutes : true},
      });

      const busySet = new Set(busy.map((a) => a.scheduledAt.getTime()));

      const slots: Array<{ start: string; end : string; available : boolean}> = [];

      for (const schedule of schedules) {
        const [sh, sm] = schedule.startTime.split(":").map(Number);
        const [eh, em] = schedule.endTime.split(":").map(Number);

        let current = new Date(dayStart);
        current.setHours(sh, sm, 0, 0);
        const end = new Date(dayStart);
        end.setHours(eh, em, 0, 0);

        while (current < end) {
          const slotStart = new Date(current);
          const slotEnd = new Date(current.getTime() + 15 * 60 * 1000); // 15 мин
          if (slotEnd > end) break;

          const isBusy = busySet.has(slotStart.getTime());
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            available: !isBusy,
          });

          current = slotEnd;
        }
      }

      return slots;
    },
);

const start = async () => {
  try {
    validateEnv();

    await app.register(cors, {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });

    await app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    });

    await app.listen({ port: env.PORT, host: env.HOST });
    const address = app.server.address() as { address: string; port: number };
    app.log.info(`Server running on http://${address.address}:${address.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
