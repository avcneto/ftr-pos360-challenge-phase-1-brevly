import { z } from "zod";
import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");
const envExamplePath = resolve(process.cwd(), ".env.example");

// Check if files exist and are files (not directories)
const envLocalFileExists =
  existsSync(envLocalPath) && statSync(envLocalPath).isFile();
const envFileExists = existsSync(envPath) && statSync(envPath).isFile();
const envExampleFileExists =
  existsSync(envExamplePath) && statSync(envExamplePath).isFile();

// Priority: .env.local > .env > .env.example
const fileToLoad = envLocalFileExists
  ? envLocalPath
  : envFileExists
    ? envPath
    : envExamplePath;

if (envLocalFileExists) {
  console.log("📋 Using environment variables from .env.local");
} else if (!envFileExists && envExampleFileExists) {
  console.log("📋 Using environment variables from .env.example");
}

if (envLocalFileExists || envFileExists || envExampleFileExists) {
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
