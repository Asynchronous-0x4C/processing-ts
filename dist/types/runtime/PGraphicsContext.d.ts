import { FillStyle, Graphics, StrokeStyle, TextStyle, Texture } from "pixi.js";
import { PFont } from "./PFont";
type Styles = {
    text: {
        style: TextStyle;
        font: PFont;
    };
    stroke: {
        style: StrokeStyle;
        enabled: boolean;
    };
    fill: {
        style: FillStyle;
        enabled: boolean;
    };
    mode: {
        rect: number;
        ellipse: number;
        image: number;
    };
};
export declare class PGraphicsContext {
    style_buffer: Styles[];
    texture_cache: Map<string, {
        texture: Texture;
        frame: number;
    }>;
    font_cache: Map<string, PFont>;
    text_style: TextStyle;
    stroke_style: StrokeStyle;
    fill_style: FillStyle;
    color_mode: {
        mode: number;
        X: number;
        Y: number;
        Z: number;
        A: number;
    };
    current_font: PFont;
    rect_mode: number;
    ellipse_mode: number;
    image_mode: number;
    shape_buffer: number[] | null;
    shape_mode: number;
    fill_enabled: boolean;
    stroke_enabled: boolean;
    graphics: Graphics;
    canvas: HTMLCanvasElement | null;
    constructor();
    textAlign(align: number): void;
    textSize(size: number): void;
    createFont(name: string, size: number): PFont;
    textFont(font: PFont): void;
    colorMode(mode: number): void;
    fill(r: number, g: number, b: number, a: number): void;
    noFill(): void;
    stroke(r: number, g: number, b: number, a: number): void;
    noStroke(): void;
    strokeWeight(weight: number): void;
    rectMode(mode: number): void;
    ellipseMode(mode: number): void;
    imageMode(mode: number): void;
    applySettings(): void;
    encodeStyles(): Styles;
    decodeStyles(styles: Styles): void;
    pushStyle(): void;
    popStyle(): void;
}
export {};
