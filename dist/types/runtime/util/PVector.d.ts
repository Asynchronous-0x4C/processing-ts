export declare class PVector {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    /**
     * Add vector
     * @param args Argments.You can only use `add(vector:PVector)` or `add(x:number,y:number,z?:number)`.
     * @returns Returns own vector.
     */
    add(...args: PVector[] | number[]): PVector;
    sub(...args: PVector[] | number[]): PVector;
    mult(scalar: number): PVector;
    div(scalar: number): PVector;
    mag(): number;
    normalize(): PVector;
    copy(): PVector;
    set(...args: PVector[] | number[]): PVector;
}
