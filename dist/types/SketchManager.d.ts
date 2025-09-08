import { TranspileErrorListener } from "./transpiler/Control";
import { Runner } from "./runtime/runner/DefaultRunner";
import { Token } from "antlr4";
export type SketchSettings = {
    frameRate?: number;
    thread?: "main";
    keep_aspect_ratio?: boolean;
};
export type SketchData = {
    main: string;
    content: {
        name: string;
        content: string;
    }[];
};
export type SketchFile = {
    base_uri: string;
    main_sketch: string;
    sketches: string[];
    resources?: string[];
};
/**
 * Manage transpile and execution of sketch.
 */
export declare class SketchManager {
    runner: Runner;
    settings: SketchSettings;
    target_element: HTMLCanvasElement | null;
    sketch_resources_promise: Promise<{
        path: string;
        content: ArrayBuffer;
    }[]> | null;
    base_uri: string;
    constructor(settings?: SketchSettings);
    /**
     * Set canvas to draw sketch.
     * @param target Canvas which you want to use.
     */
    mountPApplet(target: HTMLCanvasElement): void;
    /**
     * Load sketch from relative path.
     * @param sketch_path Relative path to sketch folder or sketch data object.
     * @returns Sketch data which required to transpile.
     */
    loadSketch(sketch_path: string | SketchFile): Promise<SketchData>;
    /**
     * Load sketch from string.
     * @param sketch Sketch source string
     * @param name Sketch name
     * @param resources Static resource path which your sketch use
     * @returns Sketch data which required to transpile
     */
    loadSketchString(sketch: string, name: string, resources?: string[]): SketchData;
    /**
     * Initialize key/pointer events.
     * This method is called internally.
     * @param target_element Canvas
     */
    initEvent(target_element: HTMLCanvasElement): void;
    /**
     * Transpile sketch.
     * @param sketch_data Loaded sketch data
     * @returns Transpiled sketch.
     */
    transpileSketch(sketch_data: SketchData): {
        result: string;
        error: TranspileErrorListener<Token>;
    };
    /**
     * Run transpiled sketch.
     * @param sketch Transpiled sketch
     */
    runTranspiledSketch(sketch: {
        result: string;
        error: TranspileErrorListener<Token> | null;
    }): Promise<void>;
    /**
     * Transpile and run sketch.
     * @param sketch_data Loaded sketch data
     * @returns
     */
    runSketch(sketch_data: SketchData): Promise<void>;
    /**
     * Stop running sketch.
     */
    stopSketch(): void;
    getAspectRatio(): number;
    resize(): void;
    private setAspectRatio;
    /**
     * Add dependent class which is necessary in your sketch.
     * @param data The name and type of dependent class.
     * @param override Whether to override the current dependency if the dependent class has a duplicated name.
     */
    addDependency(data: {
        name: string;
        type: any;
    }, override?: boolean): void;
    getDependentNames(): string[];
    getDependentClasses(): any[];
    addEventListener(type: "log" | "error", listener: (args: any[]) => void): void;
}
