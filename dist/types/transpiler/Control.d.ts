import { PApplet } from "../runtime/PApplet";
export declare const primitive_numbers: string[];
export declare let applet_instance: PApplet;
export declare let _main_sketch: string;
export declare function transpile(sketch_content: string, main_sketch: string): string;
export declare function get_last<T>(a: T[]): T | undefined;
