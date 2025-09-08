import { SketchManager } from "../..";
import { PApplet } from "../PApplet";
import { Event } from "../event";
export declare abstract class Runner {
    pre_count: number;
    initiated: boolean;
    scaling: {
        x: number;
        y: number;
    };
    log_listeners: ((...args: any[]) => void)[];
    error_listeners: ((...args: any[]) => void)[];
    arg_classes: {
        name: string;
        type: any;
    }[];
    abstract manager: SketchManager;
    abstract init(sketch: string): void;
    abstract loop(): void;
    abstract stop(): void;
    abstract on_focus(): void;
    abstract on_blur(): void;
    on_pointermove?(e: PointerEvent): void;
    on_pointerdown?(e: PointerEvent): void;
    on_pointerup?(e: PointerEvent): void;
    on_keydown?(e: KeyboardEvent): void;
    on_keyup?(e: KeyboardEvent): void;
    on_wheel?(e: WheelEvent): void;
    on_resize?(): void;
    on_contextmenu?(e: globalThis.MouseEvent): void;
    convert_button(button: number): number;
    sign(x: number): number;
    convert_mouse(x: number, y: number): {
        x: number;
        y: number;
    };
    abstract set_scaling(): void;
    abstract get_applet_size(): {
        w: number;
        h: number;
    };
    abstract get_aspect_ratio(): number;
    abstract update_resolution(r: number): void;
    get_maximum_size(): {
        width: number;
        height: number;
    };
    addDependency(data: {
        name: string;
        type: any;
    }, override: boolean): void;
    getDependentNames(): string[];
    getDependentClasses(): any[];
    abstract addEventListener(type: "log" | "error", listener: (args: any[]) => void): void;
}
export declare function convert_button(button: number): number;
export declare class DefaultRunner extends Runner {
    pre_count: number;
    initiated: boolean;
    manager: SketchManager;
    event_queue: Array<{
        name: string;
        event: Event;
    }>;
    content_display: boolean;
    applet: PApplet | null;
    last_time: number;
    constructor(manager: SketchManager);
    init(sketch: string): Promise<void>;
    private frame;
    loop(): void;
    stop(): void;
    on_focus(): void;
    on_blur(): void;
    on_pointermove(e: PointerEvent): void;
    on_pointerdown(e: PointerEvent): void;
    on_pointerup(e: PointerEvent): void;
    on_keydown(e: KeyboardEvent): void;
    on_keyup(e: KeyboardEvent): void;
    on_wheel(e: WheelEvent): void;
    on_resize(): void;
    on_contextmenu?: ((e: globalThis.MouseEvent) => void) | undefined;
    set_scaling(): void;
    get_applet_size(): {
        w: number;
        h: number;
    };
    get_aspect_ratio(): number;
    update_resolution(r: number): void;
    addEventListener(type: "log" | "error", listener: (args: any[]) => void): void;
}
