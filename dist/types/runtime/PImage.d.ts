import { Sprite, Texture } from "pixi.js";
import { PConstants } from "./PConstants";
export declare class PImage extends PConstants {
    texture: Texture | null;
    sprite: Sprite | null;
    width: number;
    height: number;
    load_from_arraybuffer(buffer: ArrayBuffer): Promise<void>;
    load_from_blob(blob: Blob): Promise<void>;
}
