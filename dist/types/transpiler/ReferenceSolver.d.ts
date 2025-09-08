import { ArrayInitializerContext, ClassCreatorRestContext, CreatorContext, DefaultValueContext, EnhancedForControlContext, ExpressionContext, LambdaExpressionContext, LiteralContext, LocalVariableDeclarationContext, MethodCallContext, MethodDeclarationContext, PrimaryContext, StatementContext, SwitchLabelContext, VariableDeclaratorIdContext, VariableInitializerContext } from "./antlr/parser/ProcessingParser";
import { ClassMember, SolvedClassMember, Transpiler } from "./Transpiler";
export declare class ReferenceSolver extends Transpiler {
    solved_class_data: Map<string, SolvedClassMember>;
    vatiable_list: string[][];
    current_class: string;
    constructor();
    solve(class_data: Map<string, ClassMember>): Map<string, SolvedClassMember>;
    visitMethodDeclaration: (ctx: MethodDeclarationContext) => string;
    visitLocalVariableDeclaration: (ctx: LocalVariableDeclarationContext) => string;
    visitStatement: (ctx: StatementContext) => string;
    visitSwitchLabel: (ctx: SwitchLabelContext) => string;
    visitVariableDeclaratorId: (ctx: VariableDeclaratorIdContext) => string;
    visitEnhancedForControl: (ctx: EnhancedForControlContext) => string;
    visitVariableInitializer: (ctx: VariableInitializerContext) => string;
    visitArrayInitializer: (ctx: ArrayInitializerContext) => string;
    visitExpression: (ctx: ExpressionContext) => string;
    visitLambdaExpression: (ctx: LambdaExpressionContext) => string;
    visitMethodCall: (ctx: MethodCallContext) => string;
    visitPrimary: (ctx: PrimaryContext) => string;
    visitLiteral: (ctx: LiteralContext) => string;
    visitCreator: (ctx: CreatorContext) => string;
    visitClassCreatorRest: (ctx: ClassCreatorRestContext) => string;
    visitNonWildcardTypeArguments: () => string;
    visitNonWildcardTypeArgumentsOrDiamond: () => string;
    visitTypeArgumentsOrDiamond: () => string;
    visitDefaultValue: (ctx: DefaultValueContext) => string;
}
