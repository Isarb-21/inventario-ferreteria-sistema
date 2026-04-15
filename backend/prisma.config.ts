import { defineConfig } from "@prisma/config";

// Configuration for Prisma 7
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
