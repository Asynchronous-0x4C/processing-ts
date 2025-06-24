import { PImage } from "../PImage";
import { IOBase } from "../util/sketchio/IOBase";
import { Renderer } from "./Renderer";
export declare class DefaultRenderer extends Renderer {
    __io__: IOBase;
    canvas: HTMLCanvasElement;
    private max_size;
    constructor(canvas: HTMLCanvasElement, base_path: string, max_size?: {
        width: number;
        height: number;
    });
    setCursorStyle(arg: string | {
        image: PImage;
        x: number;
        y: number;
    }): void;
    getMaximumSize(): {
        width: number;
        height: number;
    };
}
