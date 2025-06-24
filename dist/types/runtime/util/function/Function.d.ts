export declare class Function {
    [x: string]: any;
    apply(v: any): any;
    andThen(after: Function): Function;
    compose(before: Function): Function;
}
