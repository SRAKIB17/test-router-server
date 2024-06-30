import { IncomingMessage, ServerResponse } from 'http';

export async function GET(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello World' }));
}

export async function POST(req: IncomingMessage, res: ServerResponse) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: JSON.parse(body) }));
    });
}

export async function middleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
    console.log('Route Middleware executed for:', req.url);
    next();
}
