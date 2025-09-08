import { ErrorListener, RecognitionException, Recognizer, Token } from "antlr4";
import { PApplet } from "../runtime/PApplet";
export declare const primitive_numbers: string[];
export declare let applet_instance: PApplet;
export declare let _main_sketch: string;
export declare function transpile(sketch_content: string, main_sketch: string): {
    result: string;
    error: TranspileErrorListener<Token>;
};
export declare function get_last<T>(a: T[]): T | undefined;
export declare class TranspileErrorListener<T> extends ErrorListener<T> {
    error: boolean;
    message: string;
    column: number;
    line: number;
    syntaxError(recognizer: Recognizer<T>, offendingSymbol: T, line: number, column: number, msg: string, e: RecognitionException | undefined): void;
    getErrorMessage(): string;
}
