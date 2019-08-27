export interface NormalizedNames {
}

export interface Headers {
    normalizedNames: NormalizedNames;
    lazyUpdate?: any;
}

export interface Error2 {
}

export interface Error {
    error: Error2;
    text: string;
}

export interface DocumentGetResponse {
    headers: Headers;
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
    message: string;
    error: Error;
}
