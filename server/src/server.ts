import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import 'dotenv/config';
import { env } from './config/env.js';

const app = fastify({ logger: true });

const start = async () => {
    try {
        await app.listen({ port: env.port, host: env.host });
        const address = app.server.address() as { address: string; port: number; };
        app.log.info(`Server running at http://${address.address}:${address.port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();
