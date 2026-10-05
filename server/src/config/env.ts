import { config } from 'dotenv';

config();

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    HOST: process.env.HOST ?? '0.0.0.0',
    PORT: Number(process.env.PORT ?? 3000),
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? ''
};

export const validateEnv = () => {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required');
    }
    if (!env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }
};
