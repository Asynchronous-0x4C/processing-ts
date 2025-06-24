export declare class Cursor {
    static readonly CUSTOM_CURSOR = -1;
    static readonly DEFAULT_CURSOR = 0;
    static readonly CROSSHAIR_CURSOR = 1;
    static readonly TEXT_CURSOR = 2;
    static readonly WAIT_CURSOR = 3;
    static readonly SW_RESIZE_CURSOR = 4;
    static readonly SE_RESIZE_CURSOR = 5;
    static readonly NW_RESIZE_CURSOR = 6;
    static readonly NE_RESIZE_CURSOR = 7;
    static readonly N_RESIZE_CURSOR = 8;
    static readonly S_RESIZE_CURSOR = 9;
    static readonly W_RESIZE_CURSOR = 10;
    static readonly E_RESIZE_CURSOR = 11;
    static readonly HAND_CURSOR = 12;
    static readonly MOVE_CURSOR = 13;
    private type;
    constructor(type: number);
    getType(): number;
}
