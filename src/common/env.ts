function getEnvVar(name: string, required = true): string {
  const value = process.env[name];

  if (required && (!value || value.trim() === '')) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value || '';
}

export const env = {
  // EMAIL
  EMAIL_HOST: getEnvVar('EMAIL_HOST'),
  EMAIL_PORT: Number(getEnvVar('EMAIL_PORT')),
  EMAIL_IS_SECURE: getEnvVar('EMAIL_IS_SECURE') === 'true',
  EMAIL_USER: getEnvVar('EMAIL_USER'),
  EMAIL_PASS: getEnvVar('EMAIL_PASS'),
  EMAIL_FROM_NAME: getEnvVar('EMAIL_FROM_NAME', false),

  // JWT
  JWT_SECRET: getEnvVar('JWT_SECRET'),

  // FE VERIFICATION EMAIL PATH
  FE_VERIFICATION_EMAIL_PATH: getEnvVar('FE_VERIFICATION_EMAIL_PATH'),

  // APP VARIABLES
  BASE_URL: getEnvVar('BASE_URL'),

};
