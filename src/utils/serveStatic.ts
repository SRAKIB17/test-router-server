import { IncomingMessage, ServerResponse } from 'http';
import { createReadStream, stat } from 'fs';
import { join, resolve } from 'path';

const publicDirectory = resolve(__dirname, '../../public');

export const serveStatic = (req: IncomingMessage, res: ServerResponse, pathname: string) => {
    return new Promise<void>((resolve, reject) => {
        const filePath = join(publicDirectory, pathname.replace('/public', ''));
        stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return resolve();
            }

            const readStream = createReadStream(filePath);
            readStream.on('error', reject);

            res.writeHead(200);
            readStream.pipe(res);
            readStream.on('end', resolve);
        });
    });
};
