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
