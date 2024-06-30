#!/usr/bin/env node

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { loadRoutes, executeMiddleware } from './utils/router';
import { serveStatic } from './utils/serveStatic';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { Request, Response } from './utils/types';
// export const loadRouteHandler = async (pathname: string, method: string): Promise<((req: Request, res: Response) => void) | null> => {
//     const routePath = join(routeDirectory, pathname, 'index.ts');

//     if (existsSync(routePath)) {
//         const routeModule = require(routePath);
//         const handler = routeModule[method.toUpperCase()];
//         if (handler) {
//             return handler;
//         }
//     }

//     return null;
// };
dotenv.config();

const PORT = process.env.PORT || 3000;
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const method = req.method || 'GET';

        const customReq = req as Request;
        const customRes = res as Response;

        // Serve static files
        if (url.pathname.startsWith('/public')) {
            await serveStatic(customReq, customRes, url.pathname);
            return;
        }

        // Middleware chain execution
        const middlewareQueue: any[] = [];
        const globalMiddleware = await executeMiddleware('/');
        if (globalMiddleware) {
            middlewareQueue.push(globalMiddleware);
        }

        const routeMiddleware = await executeMiddleware(url.pathname);
        if (routeMiddleware) {
            middlewareQueue.push(routeMiddleware);
        }

        let middlewareIndex = 0;
        const next = () => {
            if (middlewareIndex < middlewareQueue.length) {
                const middleware = middlewareQueue[middlewareIndex];
                middlewareIndex++;
                middleware(customReq, customRes, next);
            } else {
                handleRoute();
            }
        };

        const handleRoute = async () => {
            const routeHandler = await loadRoutes(url.pathname, method);
            if (routeHandler) {
                await routeHandler(customReq, customRes);
            } else {
                customRes.writeHead(404, { 'Content-Type': 'text/plain' });
                customRes.end('Not Found');
            }
        };

        next();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
