import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';

export default fp(async function (app, opts) {
    const privateKey = readFileSync(join(process.cwd(), '.ssl/ec_private.pem'), 'utf8');
    const publicKey = readFileSync(join(process.cwd(), '.ssl/ec_public.pem'), 'utf8');

    app.register(fastifyJwt, {
        secret: {
            private: privateKey,
            public: publicKey,
        },
        sign: {
            algorithm: 'ES256',
            issuer: 'info.iutparis.fr',
        },
        verify: {
            algorithms: ['ES256'],
            issuer: 'info.iutparis.fr',
        },
    });

    app.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});