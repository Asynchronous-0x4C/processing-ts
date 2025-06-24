import { ParseTreeVisitor } from 'antlr4';
import { ProcessingSketchContext } from "./ProcessingParser.js";
import { JavaProcessingSketchContext } from "./ProcessingParser.js";
import { StaticProcessingSketchContext } from "./ProcessingParser.js";
import { ActiveProcessingSketchContext } from "./ProcessingParser.js";
import { WarnMixedModesContext } from "./ProcessingParser.js";
import { VariableDeclaratorIdContext } from "./ProcessingParser.js";
import { WarnTypeAsVariableNameContext } from "./ProcessingParser.js";
import { MethodCallContext } from "./ProcessingParser.js";
import { FunctionWithPrimitiveTypeNameContext } from "./ProcessingParser.js";
import { PrimitiveTypeContext } from "./ProcessingParser.js";
import { ColorPrimitiveTypeContext } from "./ProcessingParser.js";
import { QualifiedNameContext } from "./ProcessingParser.js";
import { LiteralContext } from "./ProcessingParser.js";
import { HexColorLiteralContext } from "./ProcessingParser.js";
import { CompilationUnitContext } from "./ProcessingParser.js";
import { PackageDeclarationContext } from "./ProcessingParser.js";
import { ImportDeclarationContext } from "./ProcessingParser.js";
import { TypeDeclarationContext } from "./ProcessingParser.js";
import { ModifierContext } from "./ProcessingParser.js";
import { ClassOrInterfaceModifierContext } from "./ProcessingParser.js";
import { VariableModifierContext } from "./ProcessingParser.js";
import { ClassDeclarationContext } from "./ProcessingParser.js";
import { TypeParametersContext } from "./ProcessingParser.js";
import { TypeParameterContext } from "./ProcessingParser.js";
import { TypeBoundContext } from "./ProcessingParser.js";
import { EnumDeclarationContext } from "./ProcessingParser.js";
import { EnumConstantsContext } from "./ProcessingParser.js";
import { EnumConstantContext } from "./ProcessingParser.js";
import { EnumBodyDeclarationsContext } from "./ProcessingParser.js";
import { InterfaceDeclarationContext } from "./ProcessingParser.js";
import { ClassBodyContext } from "./ProcessingParser.js";
import { InterfaceBodyContext } from "./ProcessingParser.js";
import { ClassBodyDeclarationContext } from "./ProcessingParser.js";
import { MemberDeclarationContext } from "./ProcessingParser.js";
import { MethodDeclarationContext } from "./ProcessingParser.js";
import { MethodBodyContext } from "./ProcessingParser.js";
import { TypeTypeOrVoidContext } from "./ProcessingParser.js";
import { GenericMethodDeclarationContext } from "./ProcessingParser.js";
import { GenericConstructorDeclarationContext } from "./ProcessingParser.js";
import { ConstructorDeclarationContext } from "./ProcessingParser.js";
import { FieldDeclarationContext } from "./ProcessingParser.js";
import { InterfaceBodyDeclarationContext } from "./ProcessingParser.js";
import { InterfaceMemberDeclarationContext } from "./ProcessingParser.js";
import { ConstDeclarationContext } from "./ProcessingParser.js";
import { ConstantDeclaratorContext } from "./ProcessingParser.js";
import { InterfaceMethodDeclarationContext } from "./ProcessingParser.js";
import { InterfaceMethodModifierContext } from "./ProcessingParser.js";
import { GenericInterfaceMethodDeclarationContext } from "./ProcessingParser.js";
import { VariableDeclaratorsContext } from "./ProcessingParser.js";
import { VariableDeclaratorContext } from "./ProcessingParser.js";
import { VariableInitializerContext } from "./ProcessingParser.js";
import { ArrayInitializerContext } from "./ProcessingParser.js";
import { ClassOrInterfaceTypeContext } from "./ProcessingParser.js";
import { TypeArgumentContext } from "./ProcessingParser.js";
import { QualifiedNameListContext } from "./ProcessingParser.js";
import { FormalParametersContext } from "./ProcessingParser.js";
import { FormalParameterListContext } from "./ProcessingParser.js";
import { FormalParameterContext } from "./ProcessingParser.js";
import { LastFormalParameterContext } from "./ProcessingParser.js";
import { BaseStringLiteralContext } from "./ProcessingParser.js";
import { MultilineStringLiteralContext } from "./ProcessingParser.js";
import { StringLiteralContext } from "./ProcessingParser.js";
import { IntegerLiteralContext } from "./ProcessingParser.js";
import { FloatLiteralContext } from "./ProcessingParser.js";
import { AnnotationContext } from "./ProcessingParser.js";
import { ElementValuePairsContext } from "./ProcessingParser.js";
import { ElementValuePairContext } from "./ProcessingParser.js";
import { ElementValueContext } from "./ProcessingParser.js";
import { ElementValueArrayInitializerContext } from "./ProcessingParser.js";
import { AnnotationTypeDeclarationContext } from "./ProcessingParser.js";
import { AnnotationTypeBodyContext } from "./ProcessingParser.js";
import { AnnotationTypeElementDeclarationContext } from "./ProcessingParser.js";
import { AnnotationTypeElementRestContext } from "./ProcessingParser.js";
import { AnnotationMethodOrConstantRestContext } from "./ProcessingParser.js";
import { AnnotationMethodRestContext } from "./ProcessingParser.js";
import { AnnotationConstantRestContext } from "./ProcessingParser.js";
import { DefaultValueContext } from "./ProcessingParser.js";
import { BlockContext } from "./ProcessingParser.js";
import { BlockStatementContext } from "./ProcessingParser.js";
import { LocalVariableDeclarationContext } from "./ProcessingParser.js";
import { LocalTypeDeclarationContext } from "./ProcessingParser.js";
import { StatementContext } from "./ProcessingParser.js";
import { CatchClauseContext } from "./ProcessingParser.js";
import { CatchTypeContext } from "./ProcessingParser.js";
import { FinallyBlockContext } from "./ProcessingParser.js";
import { ResourceSpecificationContext } from "./ProcessingParser.js";
import { ResourcesContext } from "./ProcessingParser.js";
import { ResourceContext } from "./ProcessingParser.js";
import { SwitchBlockStatementGroupContext } from "./ProcessingParser.js";
import { SwitchLabelContext } from "./ProcessingParser.js";
import { ForControlContext } from "./ProcessingParser.js";
import { ForInitContext } from "./ProcessingParser.js";
import { EnhancedForControlContext } from "./ProcessingParser.js";
import { ParExpressionContext } from "./ProcessingParser.js";
import { ExpressionListContext } from "./ProcessingParser.js";
import { ExpressionContext } from "./ProcessingParser.js";
import { LambdaExpressionContext } from "./ProcessingParser.js";
import { LambdaParametersContext } from "./ProcessingParser.js";
import { LambdaBodyContext } from "./ProcessingParser.js";
import { PrimaryContext } from "./ProcessingParser.js";
import { ClassTypeContext } from "./ProcessingParser.js";
import { CreatorContext } from "./ProcessingParser.js";
import { CreatedNameContext } from "./ProcessingParser.js";
import { InnerCreatorContext } from "./ProcessingParser.js";
import { ArrayCreatorRestContext } from "./ProcessingParser.js";
import { ClassCreatorRestContext } from "./ProcessingParser.js";
import { ExplicitGenericInvocationContext } from "./ProcessingParser.js";
import { TypeArgumentsOrDiamondContext } from "./ProcessingParser.js";
import { NonWildcardTypeArgumentsOrDiamondContext } from "./ProcessingParser.js";
import { NonWildcardTypeArgumentsContext } from "./ProcessingParser.js";
import { TypeListContext } from "./ProcessingParser.js";
import { TypeTypeContext } from "./ProcessingParser.js";
import { TypeArgumentsContext } from "./ProcessingParser.js";
import { SuperSuffixContext } from "./ProcessingParser.js";
import { ExplicitGenericInvocationSuffixContext } from "./ProcessingParser.js";
import { ArgumentsContext } from "./ProcessingParser.js";
/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ProcessingParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class ProcessingVisitor<Result> extends ParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `ProcessingParser.processingSketch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProcessingSketch?: (ctx: ProcessingSketchContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.javaProcessingSketch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitJavaProcessingSketch?: (ctx: JavaProcessingSketchContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.staticProcessingSketch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStaticProcessingSketch?: (ctx: StaticProcessingSketchContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.activeProcessingSketch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitActiveProcessingSketch?: (ctx: ActiveProcessingSketchContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.warnMixedModes`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWarnMixedModes?: (ctx: WarnMixedModesContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.variableDeclaratorId`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDeclaratorId?: (ctx: VariableDeclaratorIdContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.warnTypeAsVariableName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWarnTypeAsVariableName?: (ctx: WarnTypeAsVariableNameContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.methodCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodCall?: (ctx: MethodCallContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.functionWithPrimitiveTypeName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionWithPrimitiveTypeName?: (ctx: FunctionWithPrimitiveTypeNameContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.primitiveType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPrimitiveType?: (ctx: PrimitiveTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.colorPrimitiveType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitColorPrimitiveType?: (ctx: ColorPrimitiveTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.qualifiedName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQualifiedName?: (ctx: QualifiedNameContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.literal`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLiteral?: (ctx: LiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.hexColorLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHexColorLiteral?: (ctx: HexColorLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.compilationUnit`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCompilationUnit?: (ctx: CompilationUnitContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.packageDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPackageDeclaration?: (ctx: PackageDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.importDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitImportDeclaration?: (ctx: ImportDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeDeclaration?: (ctx: TypeDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.modifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitModifier?: (ctx: ModifierContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classOrInterfaceModifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassOrInterfaceModifier?: (ctx: ClassOrInterfaceModifierContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.variableModifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableModifier?: (ctx: VariableModifierContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeParameters`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeParameters?: (ctx: TypeParametersContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeParameter`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeParameter?: (ctx: TypeParameterContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeBound`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeBound?: (ctx: TypeBoundContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.enumDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnumDeclaration?: (ctx: EnumDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.enumConstants`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnumConstants?: (ctx: EnumConstantsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.enumConstant`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnumConstant?: (ctx: EnumConstantContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.enumBodyDeclarations`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnumBodyDeclarations?: (ctx: EnumBodyDeclarationsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classBody`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassBody?: (ctx: ClassBodyContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceBody`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceBody?: (ctx: InterfaceBodyContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classBodyDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassBodyDeclaration?: (ctx: ClassBodyDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.memberDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMemberDeclaration?: (ctx: MemberDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.methodDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodDeclaration?: (ctx: MethodDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.methodBody`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodBody?: (ctx: MethodBodyContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeTypeOrVoid`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeTypeOrVoid?: (ctx: TypeTypeOrVoidContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.genericMethodDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitGenericMethodDeclaration?: (ctx: GenericMethodDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.genericConstructorDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitGenericConstructorDeclaration?: (ctx: GenericConstructorDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.constructorDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.fieldDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFieldDeclaration?: (ctx: FieldDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceBodyDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceBodyDeclaration?: (ctx: InterfaceBodyDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceMemberDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceMemberDeclaration?: (ctx: InterfaceMemberDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.constDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConstDeclaration?: (ctx: ConstDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.constantDeclarator`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConstantDeclarator?: (ctx: ConstantDeclaratorContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceMethodDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceMethodDeclaration?: (ctx: InterfaceMethodDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.interfaceMethodModifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInterfaceMethodModifier?: (ctx: InterfaceMethodModifierContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.genericInterfaceMethodDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitGenericInterfaceMethodDeclaration?: (ctx: GenericInterfaceMethodDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.variableDeclarators`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDeclarators?: (ctx: VariableDeclaratorsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.variableDeclarator`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDeclarator?: (ctx: VariableDeclaratorContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.variableInitializer`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableInitializer?: (ctx: VariableInitializerContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.arrayInitializer`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayInitializer?: (ctx: ArrayInitializerContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classOrInterfaceType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassOrInterfaceType?: (ctx: ClassOrInterfaceTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeArgument`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeArgument?: (ctx: TypeArgumentContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.qualifiedNameList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQualifiedNameList?: (ctx: QualifiedNameListContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.formalParameters`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFormalParameters?: (ctx: FormalParametersContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.formalParameterList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFormalParameterList?: (ctx: FormalParameterListContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.formalParameter`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFormalParameter?: (ctx: FormalParameterContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.lastFormalParameter`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLastFormalParameter?: (ctx: LastFormalParameterContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.baseStringLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBaseStringLiteral?: (ctx: BaseStringLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.multilineStringLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMultilineStringLiteral?: (ctx: MultilineStringLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.stringLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStringLiteral?: (ctx: StringLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.integerLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIntegerLiteral?: (ctx: IntegerLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.floatLiteral`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFloatLiteral?: (ctx: FloatLiteralContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotation`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotation?: (ctx: AnnotationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.elementValuePairs`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElementValuePairs?: (ctx: ElementValuePairsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.elementValuePair`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElementValuePair?: (ctx: ElementValuePairContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.elementValue`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElementValue?: (ctx: ElementValueContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.elementValueArrayInitializer`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElementValueArrayInitializer?: (ctx: ElementValueArrayInitializerContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationTypeDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationTypeDeclaration?: (ctx: AnnotationTypeDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationTypeBody`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationTypeBody?: (ctx: AnnotationTypeBodyContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationTypeElementDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationTypeElementDeclaration?: (ctx: AnnotationTypeElementDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationTypeElementRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationTypeElementRest?: (ctx: AnnotationTypeElementRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationMethodOrConstantRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationMethodOrConstantRest?: (ctx: AnnotationMethodOrConstantRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationMethodRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationMethodRest?: (ctx: AnnotationMethodRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.annotationConstantRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationConstantRest?: (ctx: AnnotationConstantRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.defaultValue`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDefaultValue?: (ctx: DefaultValueContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.block`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlock?: (ctx: BlockContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.blockStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlockStatement?: (ctx: BlockStatementContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.localVariableDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLocalVariableDeclaration?: (ctx: LocalVariableDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.localTypeDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLocalTypeDeclaration?: (ctx: LocalTypeDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.catchClause`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCatchClause?: (ctx: CatchClauseContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.catchType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCatchType?: (ctx: CatchTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.finallyBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFinallyBlock?: (ctx: FinallyBlockContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.resourceSpecification`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitResourceSpecification?: (ctx: ResourceSpecificationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.resources`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitResources?: (ctx: ResourcesContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.resource`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitResource?: (ctx: ResourceContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.switchBlockStatementGroup`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSwitchBlockStatementGroup?: (ctx: SwitchBlockStatementGroupContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.switchLabel`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSwitchLabel?: (ctx: SwitchLabelContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.forControl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForControl?: (ctx: ForControlContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.forInit`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForInit?: (ctx: ForInitContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.enhancedForControl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnhancedForControl?: (ctx: EnhancedForControlContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.parExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParExpression?: (ctx: ParExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.expressionList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpressionList?: (ctx: ExpressionListContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpression?: (ctx: ExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.lambdaExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLambdaExpression?: (ctx: LambdaExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.lambdaParameters`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLambdaParameters?: (ctx: LambdaParametersContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.lambdaBody`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLambdaBody?: (ctx: LambdaBodyContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.primary`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPrimary?: (ctx: PrimaryContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassType?: (ctx: ClassTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.creator`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCreator?: (ctx: CreatorContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.createdName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCreatedName?: (ctx: CreatedNameContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.innerCreator`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInnerCreator?: (ctx: InnerCreatorContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.arrayCreatorRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayCreatorRest?: (ctx: ArrayCreatorRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.classCreatorRest`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassCreatorRest?: (ctx: ClassCreatorRestContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.explicitGenericInvocation`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExplicitGenericInvocation?: (ctx: ExplicitGenericInvocationContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeArgumentsOrDiamond`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeArgumentsOrDiamond?: (ctx: TypeArgumentsOrDiamondContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.nonWildcardTypeArgumentsOrDiamond`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNonWildcardTypeArgumentsOrDiamond?: (ctx: NonWildcardTypeArgumentsOrDiamondContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.nonWildcardTypeArguments`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNonWildcardTypeArguments?: (ctx: NonWildcardTypeArgumentsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeList?: (ctx: TypeListContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeType?: (ctx: TypeTypeContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.typeArguments`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTypeArguments?: (ctx: TypeArgumentsContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.superSuffix`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSuperSuffix?: (ctx: SuperSuffixContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.explicitGenericInvocationSuffix`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExplicitGenericInvocationSuffix?: (ctx: ExplicitGenericInvocationSuffixContext) => Result;
    /**
     * Visit a parse tree produced by `ProcessingParser.arguments`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArguments?: (ctx: ArgumentsContext) => Result;
}
