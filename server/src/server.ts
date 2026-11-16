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

app.get("/api/doctors", async () => {
  const doctors = await prisma.medicalStaff.findMany({
    where: { staffType: "DOCTOR" },
    include: {
      specialty: { select: { name: true } },
      department: { select: { name: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return doctors.map((doctor) => ({
    id: String(doctor.id),
    group: "Врачи",
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
});

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
