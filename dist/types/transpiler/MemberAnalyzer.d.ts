import { ActiveProcessingSketchContext, VariableDeclaratorContext, ClassDeclarationContext, InterfaceDeclarationContext, MethodDeclarationContext, ConstructorDeclarationContext, FormalParameterContext, InterfaceMethodDeclarationContext, ConstantDeclaratorContext, FieldDeclarationContext, ConstDeclarationContext } from "./antlr/parser/ProcessingParser";
import { ClassMember, Transpiler } from "./Transpiler";
export declare let class_data: Map<string, ClassMember>;
export declare class MemberAnalyzer extends Transpiler {
    class_names: string[];
    arg_list: {
        name: string;
        type: string;
    }[];
    constructor(main_sketch: string);
    visitActiveProcessingSketch: (ctx: ActiveProcessingSketchContext) => string;
    visitClassDeclaration: (ctx: ClassDeclarationContext) => string;
    visitInterfaceDeclaration: (ctx: InterfaceDeclarationContext) => string;
    visitConstructorDeclaration: (ctx: ConstructorDeclarationContext) => string;
    visitMethodDeclaration: (ctx: MethodDeclarationContext) => string;
    visitInterfaceMethodDeclaration: (ctx: InterfaceMethodDeclarationContext) => string;
    visitFormalParameter: (ctx: FormalParameterContext) => string;
    visitLastFormalParameter: (ctx: FormalParameterContext) => string;
    current_type: string;
    visitFieldDeclaration: (ctx: FieldDeclarationContext) => string;
    visitVariableDeclarator: (ctx: VariableDeclaratorContext) => string;
    visitConstDeclaration: (ctx: ConstDeclarationContext) => string;
    visitConstantDeclarator: (ctx: ConstantDeclaratorContext) => string;
    mergeByHierarchy(): void;
    merge(className: string): void;
}
