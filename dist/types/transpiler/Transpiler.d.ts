import { ArrayInitializerContext, BlockContext, CreatorContext, ExpressionContext, FormalParameterContext, LastFormalParameterContext, ProcessingSketchContext, TypeListContext, TypeTypeContext, VariableInitializerContext } from "./antlr/parser/ProcessingParser";
import ProcessingVisitor from "./antlr/parser/ProcessingVisitor";
export type SolvedFunctionData = {
    name: string;
    type: string;
    async: boolean;
    override: boolean;
    extended: boolean;
    args: {
        name: string;
        type: string;
        rest?: boolean;
    }[];
    body: string;
};
export type SolvedClassMember = {
    field: {
        name: string;
        init: string;
        type: string;
        extended: boolean;
    }[];
    method: SolvedFunctionData[];
    constructor: SolvedFunctionData[];
    class: string[];
    interface: string[];
};
export type FunctionData = {
    name: string;
    type: string;
    async: boolean;
    override: boolean;
    extended: boolean;
    args: {
        name: string;
        type: string;
        rest?: boolean;
    }[];
    body: BlockContext;
};
export type ClassMember = {
    field: {
        name: string;
        init: VariableInitializerContext | null;
        type: string;
        extended: boolean;
    }[];
    method: FunctionData[];
    constructor: FunctionData[];
    class: string[];
    interface: string[];
};
export declare class Transpiler extends ProcessingVisitor<string> {
    main_sketch: string;
    constructor(main_sketch: string);
    visit: (ctx: any) => string;
    visitChildren: (ctx: any) => string;
    visitProcessingSketch: (ctx: ProcessingSketchContext) => string;
    visitVariableInitializer: (ctx: VariableInitializerContext) => string;
    visitArrayInitializer: (ctx: ArrayInitializerContext) => string;
    visitFormalParameter: (ctx: FormalParameterContext) => string;
    visitLastFormalParameter: (ctx: LastFormalParameterContext) => string;
    visitExpression: (ctx: ExpressionContext) => string;
    visitCreator: (ctx: CreatorContext) => string;
    visitTypeArgumentsOrDiamond: () => string;
    visitTypeArguments: () => string;
    visitTypeList: (ctx: TypeListContext) => string;
    visitTypeType: (ctx: TypeTypeContext) => string;
}
