export declare abstract class IOBase {
    base_path: string;
    preload: {
        path: string;
        content: ArrayBuffer;
    }[] | null;
    constructor(base_path: string);
    abstract request(path: string): string;
    toBlob(src: string, mime: string): Blob;
    readBlob(blob: Blob): string;
    save_blob(name: string, data: Blob): void;
    save_string(name: string, data: string): void;
    load_buffer_as_blob(name: string, mime: string): Blob | null;
    load_buffer_as_string(name: string): string | null;
    load_as_blob(name: string, mime: string): Blob | null;
    load_as_string(name: string): string | null;
}
