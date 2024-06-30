import { readdirSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const routeDirectory = resolve(__dirname, '../../page');

export const loadRoutes = async (pathname: string, method: string) => {
    console.log('Loading route:', pathname, 'with method:', method);
    const pathParts = pathname.split('/').filter(Boolean);

    const findRoute = (parts: string[], dir: string): any => {
        console.log('Finding route. Parts:', parts, 'Directory:', dir);
        if (parts.length === 0) {
            const tsPath = join(dir, 'index.ts');
            const jsPath = join(dir, 'index.js');

            if (existsSync(tsPath)) {
                console.log('Found TypeScript route:', tsPath);
                const route = require(tsPath);
                return route[method.toUpperCase()];
            }

            if (existsSync(jsPath)) {
                console.log('Found JavaScript route:', jsPath);
                const route = require(jsPath);
                return route[method.toUpperCase()];
            }

            return null;
        }

        const part = parts.shift();
        if (!part) return null;
        const fullPath = join(dir, part);

        if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
            return findRoute(parts, fullPath);
        }

        return null;
    };

    return findRoute(pathParts, routeDirectory);
};

export const executeMiddleware = async (pathname: string) => {
    console.log('Executing middleware for path:', pathname);
    const parts = pathname.split('/').filter(Boolean);

    const findMiddleware = (parts: string[], dir: string): any => {
        console.log('Finding middleware. Parts:', parts, 'Directory:', dir);
        if (parts.length === 0) {
            const tsPath = join(dir, 'middleware.ts');
            const jsPath = join(dir, 'middleware.js');

            if (existsSync(tsPath)) {
                console.log('Found TypeScript middleware:', tsPath);
                const middleware = require(tsPath);
                return middleware['middleware'];
            }

            if (existsSync(jsPath)) {
                console.log('Found JavaScript middleware:', jsPath);
                const middleware = require(jsPath);
                return middleware['middleware'];
            }

            return null;
        }

        const part = parts.pop(); // Use pop instead of shift for middleware search
        if (!part) return null;
        const fullPath = join(dir, parts.join('/'));

        if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
            return findMiddleware(parts, fullPath);
        }

        return null;
    };

    return findMiddleware(parts, routeDirectory);
};
