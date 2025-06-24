import { PImage } from "./PImage";
import { Renderer } from "./renderer/Renderer";
export declare class PGraphics extends PImage {
    renderer: Renderer;
    constructor(renderer: Renderer);
    init(width: number, height: number): Promise<void>;
    background(...color: number[]): void;
    fill(...color: number[]): void;
    noFill(): void;
    stroke(...color: number[]): void;
    noStroke(): void;
    strokeWeight(weight: number): void;
    rectMode(mode: number): void;
    textAlign(align: number): void;
    textSize(size: number): void;
    rect(x: number, y: number, width: number, height: number): void;
    ellipse(x: number, y: number, width: number, height: number): void;
    arc(x: number, y: number, width: number, height: number, start: number, stop: number): void;
    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    text(text: string, x: number, y: number, w?: number, h?: number): void;
    image(image: PImage, x: number, y: number, w?: number, h?: number): void;
    translate(x: number, y: number): void;
    __begin__(): void;
    __end__(): void;
    __stop__(): void;
}
