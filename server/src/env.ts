import { z } from "zod";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
const envExamplePath = resolve(process.cwd(), ".env.example");
const fileToLoad = existsSync(envPath) ? envPath : envExamplePath;

if (!existsSync(envPath) && existsSync(envExamplePath)) {
  console.log("📋 Using environment variables from .env.example");
}

if (existsSync(fileToLoad)) {
  const envContent = readFileSync(fileToLoad, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      const value = valueParts.join("=").trim();
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string().startsWith("postgresql://"),
});

export const env = envSchema.parse(process.env);
