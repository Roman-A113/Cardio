import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import 'dotenv/config';
import cors from '@fastify/cors';
import { env, validateEnv } from './config/env.js';

const app = fastify({ logger: true });

const start = async () => {
    try {
        validateEnv();

        await app.register(cors, {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        });

        await app.register(fastifyJwt, {
            secret: env.JWT_SECRET,
        });

        await app.listen({ port: env.PORT, host: env.HOST });
        const address = app.server.address() as { address: string; port: number; };
        app.log.info(`Server running on http://${address.address}:${address.port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();
