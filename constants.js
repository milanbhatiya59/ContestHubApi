function getEnvVariable(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
}

// Server Constants
export const PORT = getEnvVariable("PORT");
export const CORS_ORIGIN = getEnvVariable("CORS_ORIGIN");

// Database Constants
export const DATABASE_URI = getEnvVariable("DATABASE_URI");
export const DATABASE_NAME = getEnvVariable("DATABASE_NAME");

// Google API Constants
export const GOOGLE_API_KEY = getEnvVariable("GOOGLE_API_KEY");
