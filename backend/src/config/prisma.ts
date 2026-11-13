import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "0869271243Aa"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "md_mobile"}`;

const adapter = new PrismaMariaDb(connectionString);

export const prisma = new PrismaClient({ adapter });
export default prisma;
