import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import argon2 from "argon2";
import "dotenv/config";
import cors from "@fastify/cors";
import { env, validateEnv } from "./config/env.js";
import { prisma } from "./db/data-source.js";

type UserRole = "PATIENT" | "ADMIN" | "DOCTOR";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string; role: UserRole };
    user: { sub: string; email: string; role: UserRole };
  }
}

const app = fastify({ logger: true });
const AUTH_COOKIE_NAME = "cardio_session";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get("/", async () => {
  return "Hello, World!";
});

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({ message: "Требуется вход в аккаунт" });
  }
};

const setAuthCookie = async (
  reply: FastifyReply,
  user: { id: string; email: string; role: UserRole },
) => {
  const token = await reply.jwtSign(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: "7d" },
  );
  reply.setCookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

const isEmail = (email: string) =>
  email.length <= 254 && EMAIL_PATTERN.test(email);

app.post<{ Body: AuthCredentialsBody }>(
  "/api/auth/register",
  async (request, reply) => {
    const email =
      typeof request.body?.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof request.body?.password === "string" ? request.body.password : "";

    if (!isEmail(email)) {
      return reply.code(400).send({ message: "Введите корректный email" });
    }
    if (password.length < 8) {
      return reply
        .code(400)
        .send({ message: "Пароль должен содержать не менее 8 символов" });
    }

    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: await argon2.hash(password),
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          middleName: true,
          lastName: true,
          phone: true,
        },
      });

      await setAuthCookie(reply, { ...user, email });
      return reply.code(201).send({ user });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return reply.code(409).send({
          message: "Аккаунт с таким email уже существует",
        });
      }
      throw error;
    }
  },
);

app.post<{ Body: AuthCredentialsBody }>(
  "/api/auth/login",
  async (request, reply) => {
    const email =
      typeof request.body?.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof request.body?.password === "string" ? request.body.password : "";

    if (!isEmail(email) || !password) {
      return reply.code(400).send({ message: "Введите email и пароль" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      !user.email ||
      !(await argon2.verify(user.passwordHash, password))
    ) {
      return reply.code(401).send({ message: "Неверный email или пароль" });
    }

    await setAuthCookie(reply, { ...user, email: user.email });
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phone: user.phone,
      },
    };
  },
);

app.post("/api/auth/logout", async (_request, reply) => {
  reply.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  return { message: "Вы вышли из аккаунта" };
});

app.get(
  "/api/auth/me",
  { preHandler: authenticate },
  async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phone: true,
      },
    });

    if (!user) {
      return reply.code(401).send({ message: "Требуется вход в аккаунт" });
    }

    return { user };
  },
);

app.patch<{ Body: UpdateProfileBody }>(
  "/api/auth/profile",
  { preHandler: authenticate },
  async (request, reply) => {
    const body = request.body;
    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Некорректные данные профиля" });
    }

    if (
      body.firstName === undefined &&
      body.middleName === undefined &&
      body.lastName === undefined &&
      body.phone === undefined
    ) {
      return reply.code(400).send({ message: "Нет данных для сохранения" });
    }

    const fields = [
      [body.firstName, 100],
      [body.middleName, 100],
      [body.lastName, 100],
      [body.phone, 32],
    ] as const;
    if (
      fields.some(
        ([value, maxLength]) =>
          value !== undefined &&
          (typeof value !== "string" || value.trim().length > maxLength),
      )
    ) {
      return reply.code(400).send({
        message: "Проверьте ФИО и номер телефона",
      });
    }

    const data: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      phone?: string | null;
    } = {};
    if (body.firstName !== undefined) {
      data.firstName = body.firstName.trim() || null;
    }
    if (body.middleName !== undefined) {
      data.middleName = body.middleName.trim() || null;
    }
    if (body.lastName !== undefined) {
      data.lastName = body.lastName.trim() || null;
    }
    if (body.phone !== undefined) {
      data.phone = body.phone.trim() || null;
    }

    try {
      const user = await prisma.user.update({
        where: { id: request.user.sub },
        data,
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          middleName: true,
          lastName: true,
          phone: true,
        },
      });
      return { user };
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return reply.code(409).send({
          message: "Этот номер телефона уже указан в другом аккаунте",
        });
      }
      throw error;
    }
  },
);

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
  staffId: number;
  scheduledAt: string;
  type?: "OMS" | "PAID";
  source?: "SITE" | "PHONE";
  comment?: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  serviceId?: string;
}

interface AppointmentQuery {
  staffId: string;
  date?: string; // YYYY-MM-DD
  status?: string;
}

interface AuthCredentialsBody {
  email?: string;
  password?: string;
}

interface UpdateProfileBody {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
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

app.get<{ Querystring: AppointmentQuery }>(
  "/api/appointments",
  { preHandler: authenticate },
  async (request, reply) => {
    const { staffId, date, status } = request.query;
    const where: Record<string, unknown> = {};
    where.userId = request.user.sub;

    if (staffId) {
      const parsed = Number(staffId);
      if (!Number.isSafeInteger(parsed) || parsed < 1) {
        return reply.code(400).send({ message: "Invalid staffId" });
      }
      where.staffId = parsed;
    }

    if (date) {
      const dayStart = new Date(`${date}T00:00:00`);
      const dayEnd = new Date(`${date}T23:59:59`);
      where.scheduledAt = { gte: dayStart, lte: dayEnd };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            position: true,
            specialty: { select: { name: true } },
          },
        },
        service: {
          select: { id: true, name: true, price: true, isPaid: true },
        },
      },
      orderBy: { scheduledAt: "asc" },
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
        id: String(appointment.staff.id),
        fullName: [
          appointment.staff.lastName,
          appointment.staff.firstName,
          appointment.staff.middleName,
        ]
          .filter(Boolean)
          .join(" "),
        position: appointment.staff.position,
        specialty: appointment.staff.specialty?.name ?? "",
      },
      service: appointment.service
        ? {
            id: appointment.service.id,
            name: appointment.service.name,
            price: appointment.service.price,
            isPaid: appointment.service.isPaid,
          }
        : null,
    }));
  },
);

app.post<{ Body: CreateAppointmentBody }>(
  "/api/appointments",
  async (request, reply) => {
    let userId: string | null = null;
    if (request.cookies[AUTH_COOKIE_NAME]) {
      try {
        await request.jwtVerify();
        userId = request.user.sub;
      } catch {
        return reply.code(401).send({ message: "Требуется повторный вход" });
      }
    }

    const {
      staffId,
      scheduledAt,
      type,
      source,
      comment,
      patientName,
      patientPhone,
      patientEmail,
      serviceId,
    } = request.body;

    const parsedStaffId = Number(staffId);
    if (!Number.isSafeInteger(parsedStaffId) || parsedStaffId < 1) {
      return reply.code(400).send({ message: "Invalid staffId" });
    }

    const appointmentDate = new Date(scheduledAt);
    if (Number.isNaN(appointmentDate.getTime())) {
      return reply.code(400).send({ message: "Invalid scheduledAt" });
    }

    const staff = await prisma.medicalStaff.findUnique({
      where: { id: parsedStaffId },
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
      return reply.code(409).send({ message: "Slot already booked" });
    }

    if (!patientName || !patientPhone) {
      return reply
        .code(400)
        .send({ message: "patientName and patientPhone are required" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        staffId: parsedStaffId,
        scheduledAt: appointmentDate,
        type: type ?? "OMS",
        source: source ?? "SITE",
        comment: comment ?? null,
        patientName: patientName ?? "",
        patientPhone: patientPhone ?? "",
        patientEmail: patientEmail ?? null,
        serviceId: serviceId ?? null,
        userId,
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: { select: { name: true } },
          },
        },
        service: {
          select: { id: true, name: true, price: true, isPaid: true },
        },
      },
    });

    return reply.code(201).send({
      id: appointment.id,
      scheduledAt: appointment.scheduledAt,
      status: appointment.status,
      type: appointment.type,
      staff: {
        id: String(appointment.staff.id),
        fullName: `${appointment.staff.lastName} ${appointment.staff.firstName}`,
        specialty: appointment.staff.specialty?.name ?? "",
      },
      service: appointment.service
        ? {
            id: appointment.service.id,
            name: appointment.service.name,
            isPaid: appointment.service.isPaid,
          }
        : null,
    });
  },
);

app.get<{ Params: { id: string }; Querystring: { date: string } }>(
  "/api/doctors/:id/slots",
  async (request, reply) => {
    const staffId = Number(request.params.id);
    const { date } = request.query;

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
      where: { staffId, weekday },
    });

    if (schedules.length === 0) {
      return reply.code(404).send({ message: "No schedule for this day" });
    }

    const busy = await prisma.appointment.findMany({
      where: {
        staffId,
        scheduledAt: { gte: dayStart, lte: dayEnd },
        status: { not: "CANCELLED" },
      },
      select: { scheduledAt: true, durationMinutes: true },
    });

    const busySet = new Set(busy.map((a) => a.scheduledAt.getTime()));

    const slots: Array<{ start: string; end: string; available: boolean }> = [];

    for (const schedule of schedules) {
      const [sh, sm] = schedule.startTime.split(":").map(Number);
      const [eh, em] = schedule.endTime.split(":").map(Number);

      let current = new Date(dayStart);
      current.setHours(sh, sm, 0, 0);
      const end = new Date(dayStart);
      end.setHours(eh, em, 0, 0);

      while (current < end) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current.getTime() + 15 * 60 * 1000);
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

    await app.register(cookie);
    await app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      cookie: {
        cookieName: AUTH_COOKIE_NAME,
        signed: false,
      },
    });

    await app.listen({ port: env.PORT, host: env.HOST });
    const address = app.server.address() as { address: string; port: number };
    app.log.info(`Server running on http://${address.address}:${address.port}`);
  } catch (error) {
    app.log.error({ err: error }, "Error during server startup");
    process.exit(1);
  }
};

start();
