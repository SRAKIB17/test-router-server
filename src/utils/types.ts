import { IncomingMessage, ServerResponse } from 'http';

export interface Request extends IncomingMessage {
    params: { [key: string]: string };
    query: { [key: string]: string };
    body: { [key: string]: any };
}

export interface Response extends ServerResponse {
    json: (data: any, option?: object, headers?: object) => void;
    html: (data: string, option?: object, headers?: object) => void;
    xml: (data: string, option?: object, headers?: object) => void;
    text: (data: string, option?: object, headers?: object) => void;
    sendFile: (filePath: string) => void;
    buffer: (buffer: Buffer, option?: object, headers?: object) => void;
    error: (status: number, message: string, headers?: object) => void;
    redirect: (url: string, option?: object, headers?: object) => void;
}
