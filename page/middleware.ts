import { IncomingMessage, ServerResponse } from 'http';

export async function middleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
    console.log('Global Middleware executed for:', req.url);
    next();
}
