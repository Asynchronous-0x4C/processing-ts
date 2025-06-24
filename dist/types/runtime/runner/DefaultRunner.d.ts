import { SketchManager } from "../..";
import { PApplet } from "../PApplet";
import { Event } from "../event";
import { Renderer } from "../renderer/Renderer";
export declare abstract class Runner {
    pre_count: number;
    initiated: boolean;
    scaling: {
        x: number;
        y: number;
    };
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
    get_maximum_size(): {
        width: number;
        height: number;
    };
}
export declare function convert_button(button: number): number;
export declare class DefaultRunner extends Runner {
    pre_count: number;
    initiated: boolean;
    manager: SketchManager;
    renderer: Renderer | null;
    event_queue: Array<{
        name: string;
        event: Event;
    }>;
    content_display: boolean;
    applet: PApplet | null;
    last_time: number;
    loop_count: number;
    constructor(manager: SketchManager);
    init(sketch: string): Promise<void>;
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
}
