import { PrismaClient } from "../generated/client.js";
import { env } from "../config/env.js";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});
