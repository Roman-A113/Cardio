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

    return prisma.specialty.findMany({
      where: {
        medicalStaff: {
          some: staffType === "ALL" ? {} : { staffType },
        },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
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
