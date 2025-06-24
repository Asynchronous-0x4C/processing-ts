import { ATN, DFA, FailedPredicateException, Parser, RuleContext, ParserRuleContext, TerminalNode, Token, TokenStream } from 'antlr4';
import ProcessingVisitor from "./ProcessingVisitor.js";
export default class ProcessingParser extends Parser {
    static readonly T__0 = 1;
    static readonly HexColorLiteral = 2;
    static readonly WS = 3;
    static readonly COMMENT = 4;
    static readonly LINE_COMMENT = 5;
    static readonly CHAR_LITERAL = 6;
    static readonly ABSTRACT = 7;
    static readonly ASSERT = 8;
    static readonly BOOLEAN = 9;
    static readonly BREAK = 10;
    static readonly BYTE = 11;
    static readonly CASE = 12;
    static readonly CATCH = 13;
    static readonly CHAR = 14;
    static readonly CLASS = 15;
    static readonly CONST = 16;
    static readonly CONTINUE = 17;
    static readonly DEFAULT = 18;
    static readonly DO = 19;
    static readonly DOUBLE = 20;
    static readonly ELSE = 21;
    static readonly ENUM = 22;
    static readonly EXTENDS = 23;
    static readonly FINAL = 24;
    static readonly FINALLY = 25;
    static readonly FLOAT = 26;
    static readonly FOR = 27;
    static readonly IF = 28;
    static readonly GOTO = 29;
    static readonly IMPLEMENTS = 30;
    static readonly IMPORT = 31;
    static readonly INSTANCEOF = 32;
    static readonly INT = 33;
    static readonly INTERFACE = 34;
    static readonly LONG = 35;
    static readonly NATIVE = 36;
    static readonly NEW = 37;
    static readonly PACKAGE = 38;
    static readonly PRIVATE = 39;
    static readonly PROTECTED = 40;
    static readonly PUBLIC = 41;
    static readonly RETURN = 42;
    static readonly SHORT = 43;
    static readonly STATIC = 44;
    static readonly STRICTFP = 45;
    static readonly SUPER = 46;
    static readonly SWITCH = 47;
    static readonly SYNCHRONIZED = 48;
    static readonly THIS = 49;
    static readonly THROW = 50;
    static readonly THROWS = 51;
    static readonly TRANSIENT = 52;
    static readonly TRY = 53;
    static readonly VAR = 54;
    static readonly VOID = 55;
    static readonly VOLATILE = 56;
    static readonly WHILE = 57;
    static readonly DECIMAL_LITERAL = 58;
    static readonly HEX_LITERAL = 59;
    static readonly OCT_LITERAL = 60;
    static readonly BINARY_LITERAL = 61;
    static readonly FLOAT_LITERAL = 62;
    static readonly HEX_FLOAT_LITERAL = 63;
    static readonly BOOL_LITERAL = 64;
    static readonly STRING_LITERAL = 65;
    static readonly MULTI_STRING_LIT = 66;
    static readonly NULL_LITERAL = 67;
    static readonly LPAREN = 68;
    static readonly RPAREN = 69;
    static readonly LBRACE = 70;
    static readonly RBRACE = 71;
    static readonly LBRACK = 72;
    static readonly RBRACK = 73;
    static readonly SEMI = 74;
    static readonly COMMA = 75;
    static readonly DOT = 76;
    static readonly ASSIGN = 77;
    static readonly GT = 78;
    static readonly LT = 79;
    static readonly BANG = 80;
    static readonly TILDE = 81;
    static readonly QUESTION = 82;
    static readonly COLON = 83;
    static readonly EQUAL = 84;
    static readonly LE = 85;
    static readonly GE = 86;
    static readonly NOTEQUAL = 87;
    static readonly AND = 88;
    static readonly OR = 89;
    static readonly INC = 90;
    static readonly DEC = 91;
    static readonly ADD = 92;
    static readonly SUB = 93;
    static readonly MUL = 94;
    static readonly DIV = 95;
    static readonly BITAND = 96;
    static readonly BITOR = 97;
    static readonly CARET = 98;
    static readonly MOD = 99;
    static readonly ADD_ASSIGN = 100;
    static readonly SUB_ASSIGN = 101;
    static readonly MUL_ASSIGN = 102;
    static readonly DIV_ASSIGN = 103;
    static readonly AND_ASSIGN = 104;
    static readonly OR_ASSIGN = 105;
    static readonly XOR_ASSIGN = 106;
    static readonly MOD_ASSIGN = 107;
    static readonly LSHIFT_ASSIGN = 108;
    static readonly RSHIFT_ASSIGN = 109;
    static readonly URSHIFT_ASSIGN = 110;
    static readonly ARROW = 111;
    static readonly COLONCOLON = 112;
    static readonly AT = 113;
    static readonly ELLIPSIS = 114;
    static readonly IDENTIFIER = 115;
    static readonly EOF: number;
    static readonly RULE_processingSketch = 0;
    static readonly RULE_javaProcessingSketch = 1;
    static readonly RULE_staticProcessingSketch = 2;
    static readonly RULE_activeProcessingSketch = 3;
    static readonly RULE_warnMixedModes = 4;
    static readonly RULE_variableDeclaratorId = 5;
    static readonly RULE_warnTypeAsVariableName = 6;
    static readonly RULE_methodCall = 7;
    static readonly RULE_functionWithPrimitiveTypeName = 8;
    static readonly RULE_primitiveType = 9;
    static readonly RULE_colorPrimitiveType = 10;
    static readonly RULE_qualifiedName = 11;
    static readonly RULE_literal = 12;
    static readonly RULE_hexColorLiteral = 13;
    static readonly RULE_compilationUnit = 14;
    static readonly RULE_packageDeclaration = 15;
    static readonly RULE_importDeclaration = 16;
    static readonly RULE_typeDeclaration = 17;
    static readonly RULE_modifier = 18;
    static readonly RULE_classOrInterfaceModifier = 19;
    static readonly RULE_variableModifier = 20;
    static readonly RULE_classDeclaration = 21;
    static readonly RULE_typeParameters = 22;
    static readonly RULE_typeParameter = 23;
    static readonly RULE_typeBound = 24;
    static readonly RULE_enumDeclaration = 25;
    static readonly RULE_enumConstants = 26;
    static readonly RULE_enumConstant = 27;
    static readonly RULE_enumBodyDeclarations = 28;
    static readonly RULE_interfaceDeclaration = 29;
    static readonly RULE_classBody = 30;
    static readonly RULE_interfaceBody = 31;
    static readonly RULE_classBodyDeclaration = 32;
    static readonly RULE_memberDeclaration = 33;
    static readonly RULE_methodDeclaration = 34;
    static readonly RULE_methodBody = 35;
    static readonly RULE_typeTypeOrVoid = 36;
    static readonly RULE_genericMethodDeclaration = 37;
    static readonly RULE_genericConstructorDeclaration = 38;
    static readonly RULE_constructorDeclaration = 39;
    static readonly RULE_fieldDeclaration = 40;
    static readonly RULE_interfaceBodyDeclaration = 41;
    static readonly RULE_interfaceMemberDeclaration = 42;
    static readonly RULE_constDeclaration = 43;
    static readonly RULE_constantDeclarator = 44;
    static readonly RULE_interfaceMethodDeclaration = 45;
    static readonly RULE_interfaceMethodModifier = 46;
    static readonly RULE_genericInterfaceMethodDeclaration = 47;
    static readonly RULE_variableDeclarators = 48;
    static readonly RULE_variableDeclarator = 49;
    static readonly RULE_variableInitializer = 50;
    static readonly RULE_arrayInitializer = 51;
    static readonly RULE_classOrInterfaceType = 52;
    static readonly RULE_typeArgument = 53;
    static readonly RULE_qualifiedNameList = 54;
    static readonly RULE_formalParameters = 55;
    static readonly RULE_formalParameterList = 56;
    static readonly RULE_formalParameter = 57;
    static readonly RULE_lastFormalParameter = 58;
    static readonly RULE_baseStringLiteral = 59;
    static readonly RULE_multilineStringLiteral = 60;
    static readonly RULE_stringLiteral = 61;
    static readonly RULE_integerLiteral = 62;
    static readonly RULE_floatLiteral = 63;
    static readonly RULE_annotation = 64;
    static readonly RULE_elementValuePairs = 65;
    static readonly RULE_elementValuePair = 66;
    static readonly RULE_elementValue = 67;
    static readonly RULE_elementValueArrayInitializer = 68;
    static readonly RULE_annotationTypeDeclaration = 69;
    static readonly RULE_annotationTypeBody = 70;
    static readonly RULE_annotationTypeElementDeclaration = 71;
    static readonly RULE_annotationTypeElementRest = 72;
    static readonly RULE_annotationMethodOrConstantRest = 73;
    static readonly RULE_annotationMethodRest = 74;
    static readonly RULE_annotationConstantRest = 75;
    static readonly RULE_defaultValue = 76;
    static readonly RULE_block = 77;
    static readonly RULE_blockStatement = 78;
    static readonly RULE_localVariableDeclaration = 79;
    static readonly RULE_localTypeDeclaration = 80;
    static readonly RULE_statement = 81;
    static readonly RULE_catchClause = 82;
    static readonly RULE_catchType = 83;
    static readonly RULE_finallyBlock = 84;
    static readonly RULE_resourceSpecification = 85;
    static readonly RULE_resources = 86;
    static readonly RULE_resource = 87;
    static readonly RULE_switchBlockStatementGroup = 88;
    static readonly RULE_switchLabel = 89;
    static readonly RULE_forControl = 90;
    static readonly RULE_forInit = 91;
    static readonly RULE_enhancedForControl = 92;
    static readonly RULE_parExpression = 93;
    static readonly RULE_expressionList = 94;
    static readonly RULE_expression = 95;
    static readonly RULE_lambdaExpression = 96;
    static readonly RULE_lambdaParameters = 97;
    static readonly RULE_lambdaBody = 98;
    static readonly RULE_primary = 99;
    static readonly RULE_classType = 100;
    static readonly RULE_creator = 101;
    static readonly RULE_createdName = 102;
    static readonly RULE_innerCreator = 103;
    static readonly RULE_arrayCreatorRest = 104;
    static readonly RULE_classCreatorRest = 105;
    static readonly RULE_explicitGenericInvocation = 106;
    static readonly RULE_typeArgumentsOrDiamond = 107;
    static readonly RULE_nonWildcardTypeArgumentsOrDiamond = 108;
    static readonly RULE_nonWildcardTypeArguments = 109;
    static readonly RULE_typeList = 110;
    static readonly RULE_typeType = 111;
    static readonly RULE_typeArguments = 112;
    static readonly RULE_superSuffix = 113;
    static readonly RULE_explicitGenericInvocationSuffix = 114;
    static readonly RULE_arguments = 115;
    static readonly literalNames: (string | null)[];
    static readonly symbolicNames: (string | null)[];
    static readonly ruleNames: string[];
    get grammarFileName(): string;
    get literalNames(): (string | null)[];
    get symbolicNames(): (string | null)[];
    get ruleNames(): string[];
    get serializedATN(): number[];
    protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException;
    constructor(input: TokenStream);
    processingSketch(): ProcessingSketchContext;
    javaProcessingSketch(): JavaProcessingSketchContext;
    staticProcessingSketch(): StaticProcessingSketchContext;
    activeProcessingSketch(): ActiveProcessingSketchContext;
    warnMixedModes(): WarnMixedModesContext;
    variableDeclaratorId(): VariableDeclaratorIdContext;
    warnTypeAsVariableName(): WarnTypeAsVariableNameContext;
    methodCall(): MethodCallContext;
    functionWithPrimitiveTypeName(): FunctionWithPrimitiveTypeNameContext;
    primitiveType(): PrimitiveTypeContext;
    colorPrimitiveType(): ColorPrimitiveTypeContext;
    qualifiedName(): QualifiedNameContext;
    literal(): LiteralContext;
    hexColorLiteral(): HexColorLiteralContext;
    compilationUnit(): CompilationUnitContext;
    packageDeclaration(): PackageDeclarationContext;
    importDeclaration(): ImportDeclarationContext;
    typeDeclaration(): TypeDeclarationContext;
    modifier(): ModifierContext;
    classOrInterfaceModifier(): ClassOrInterfaceModifierContext;
    variableModifier(): VariableModifierContext;
    classDeclaration(): ClassDeclarationContext;
    typeParameters(): TypeParametersContext;
    typeParameter(): TypeParameterContext;
    typeBound(): TypeBoundContext;
    enumDeclaration(): EnumDeclarationContext;
    enumConstants(): EnumConstantsContext;
    enumConstant(): EnumConstantContext;
    enumBodyDeclarations(): EnumBodyDeclarationsContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    classBody(): ClassBodyContext;
    interfaceBody(): InterfaceBodyContext;
    classBodyDeclaration(): ClassBodyDeclarationContext;
    memberDeclaration(): MemberDeclarationContext;
    methodDeclaration(): MethodDeclarationContext;
    methodBody(): MethodBodyContext;
    typeTypeOrVoid(): TypeTypeOrVoidContext;
    genericMethodDeclaration(): GenericMethodDeclarationContext;
    genericConstructorDeclaration(): GenericConstructorDeclarationContext;
    constructorDeclaration(): ConstructorDeclarationContext;
    fieldDeclaration(): FieldDeclarationContext;
    interfaceBodyDeclaration(): InterfaceBodyDeclarationContext;
    interfaceMemberDeclaration(): InterfaceMemberDeclarationContext;
    constDeclaration(): ConstDeclarationContext;
    constantDeclarator(): ConstantDeclaratorContext;
    interfaceMethodDeclaration(): InterfaceMethodDeclarationContext;
    interfaceMethodModifier(): InterfaceMethodModifierContext;
    genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext;
    variableDeclarators(): VariableDeclaratorsContext;
    variableDeclarator(): VariableDeclaratorContext;
    variableInitializer(): VariableInitializerContext;
    arrayInitializer(): ArrayInitializerContext;
    classOrInterfaceType(): ClassOrInterfaceTypeContext;
    typeArgument(): TypeArgumentContext;
    qualifiedNameList(): QualifiedNameListContext;
    formalParameters(): FormalParametersContext;
    formalParameterList(): FormalParameterListContext;
    formalParameter(): FormalParameterContext;
    lastFormalParameter(): LastFormalParameterContext;
    baseStringLiteral(): BaseStringLiteralContext;
    multilineStringLiteral(): MultilineStringLiteralContext;
    stringLiteral(): StringLiteralContext;
    integerLiteral(): IntegerLiteralContext;
    floatLiteral(): FloatLiteralContext;
    annotation(): AnnotationContext;
    elementValuePairs(): ElementValuePairsContext;
    elementValuePair(): ElementValuePairContext;
    elementValue(): ElementValueContext;
    elementValueArrayInitializer(): ElementValueArrayInitializerContext;
    annotationTypeDeclaration(): AnnotationTypeDeclarationContext;
    annotationTypeBody(): AnnotationTypeBodyContext;
    annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext;
    annotationTypeElementRest(): AnnotationTypeElementRestContext;
    annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext;
    annotationMethodRest(): AnnotationMethodRestContext;
    annotationConstantRest(): AnnotationConstantRestContext;
    defaultValue(): DefaultValueContext;
    block(): BlockContext;
    blockStatement(): BlockStatementContext;
    localVariableDeclaration(): LocalVariableDeclarationContext;
    localTypeDeclaration(): LocalTypeDeclarationContext;
    statement(): StatementContext;
    catchClause(): CatchClauseContext;
    catchType(): CatchTypeContext;
    finallyBlock(): FinallyBlockContext;
    resourceSpecification(): ResourceSpecificationContext;
    resources(): ResourcesContext;
    resource(): ResourceContext;
    switchBlockStatementGroup(): SwitchBlockStatementGroupContext;
    switchLabel(): SwitchLabelContext;
    forControl(): ForControlContext;
    forInit(): ForInitContext;
    enhancedForControl(): EnhancedForControlContext;
    parExpression(): ParExpressionContext;
    expressionList(): ExpressionListContext;
    expression(): ExpressionContext;
    expression(_p: number): ExpressionContext;
    lambdaExpression(): LambdaExpressionContext;
    lambdaParameters(): LambdaParametersContext;
    lambdaBody(): LambdaBodyContext;
    primary(): PrimaryContext;
    classType(): ClassTypeContext;
    creator(): CreatorContext;
    createdName(): CreatedNameContext;
    innerCreator(): InnerCreatorContext;
    arrayCreatorRest(): ArrayCreatorRestContext;
    classCreatorRest(): ClassCreatorRestContext;
    explicitGenericInvocation(): ExplicitGenericInvocationContext;
    typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext;
    nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext;
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    typeList(): TypeListContext;
    typeType(): TypeTypeContext;
    typeArguments(): TypeArgumentsContext;
    superSuffix(): SuperSuffixContext;
    explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext;
    arguments(): ArgumentsContext;
    sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean;
    private expression_sempred;
    static readonly _serializedATN: number[];
    private static __ATN;
    static get _ATN(): ATN;
    static DecisionsToDFA: DFA[];
}
export declare class ProcessingSketchContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    staticProcessingSketch(): StaticProcessingSketchContext;
    javaProcessingSketch(): JavaProcessingSketchContext;
    activeProcessingSketch(): ActiveProcessingSketchContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class JavaProcessingSketchContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    EOF(): TerminalNode;
    packageDeclaration(): PackageDeclarationContext;
    importDeclaration_list(): ImportDeclarationContext[];
    importDeclaration(i: number): ImportDeclarationContext;
    typeDeclaration_list(): TypeDeclarationContext[];
    typeDeclaration(i: number): TypeDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class StaticProcessingSketchContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    EOF(): TerminalNode;
    importDeclaration_list(): ImportDeclarationContext[];
    importDeclaration(i: number): ImportDeclarationContext;
    blockStatement_list(): BlockStatementContext[];
    blockStatement(i: number): BlockStatementContext;
    typeDeclaration_list(): TypeDeclarationContext[];
    typeDeclaration(i: number): TypeDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ActiveProcessingSketchContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    EOF(): TerminalNode;
    importDeclaration_list(): ImportDeclarationContext[];
    importDeclaration(i: number): ImportDeclarationContext;
    classBodyDeclaration_list(): ClassBodyDeclarationContext[];
    classBodyDeclaration(i: number): ClassBodyDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class WarnMixedModesContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    blockStatement_list(): BlockStatementContext[];
    blockStatement(i: number): BlockStatementContext;
    classBodyDeclaration_list(): ClassBodyDeclarationContext[];
    classBodyDeclaration(i: number): ClassBodyDeclarationContext;
    importDeclaration_list(): ImportDeclarationContext[];
    importDeclaration(i: number): ImportDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class VariableDeclaratorIdContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    warnTypeAsVariableName(): WarnTypeAsVariableNameContext;
    IDENTIFIER(): TerminalNode;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class WarnTypeAsVariableNameContext extends ParserRuleContext {
    _primitiveType: PrimitiveTypeContext;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    primitiveType(): PrimitiveTypeContext;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class MethodCallContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    functionWithPrimitiveTypeName(): FunctionWithPrimitiveTypeNameContext;
    IDENTIFIER(): TerminalNode;
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    expressionList(): ExpressionListContext;
    THIS(): TerminalNode;
    SUPER(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FunctionWithPrimitiveTypeNameContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    BOOLEAN(): TerminalNode;
    BYTE(): TerminalNode;
    CHAR(): TerminalNode;
    FLOAT(): TerminalNode;
    INT(): TerminalNode;
    expressionList(): ExpressionListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class PrimitiveTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    BOOLEAN(): TerminalNode;
    CHAR(): TerminalNode;
    BYTE(): TerminalNode;
    SHORT(): TerminalNode;
    INT(): TerminalNode;
    LONG(): TerminalNode;
    FLOAT(): TerminalNode;
    DOUBLE(): TerminalNode;
    colorPrimitiveType(): ColorPrimitiveTypeContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ColorPrimitiveTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class QualifiedNameContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER_list(): TerminalNode[];
    IDENTIFIER(i: number): TerminalNode;
    colorPrimitiveType_list(): ColorPrimitiveTypeContext[];
    colorPrimitiveType(i: number): ColorPrimitiveTypeContext;
    DOT_list(): TerminalNode[];
    DOT(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    integerLiteral(): IntegerLiteralContext;
    floatLiteral(): FloatLiteralContext;
    CHAR_LITERAL(): TerminalNode;
    stringLiteral(): StringLiteralContext;
    BOOL_LITERAL(): TerminalNode;
    NULL_LITERAL(): TerminalNode;
    hexColorLiteral(): HexColorLiteralContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class HexColorLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    HexColorLiteral(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class CompilationUnitContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    EOF(): TerminalNode;
    packageDeclaration(): PackageDeclarationContext;
    importDeclaration_list(): ImportDeclarationContext[];
    importDeclaration(i: number): ImportDeclarationContext;
    typeDeclaration_list(): TypeDeclarationContext[];
    typeDeclaration(i: number): TypeDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class PackageDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    PACKAGE(): TerminalNode;
    qualifiedName(): QualifiedNameContext;
    SEMI(): TerminalNode;
    annotation_list(): AnnotationContext[];
    annotation(i: number): AnnotationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ImportDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IMPORT(): TerminalNode;
    qualifiedName(): QualifiedNameContext;
    SEMI(): TerminalNode;
    STATIC(): TerminalNode;
    DOT(): TerminalNode;
    MUL(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    classDeclaration(): ClassDeclarationContext;
    enumDeclaration(): EnumDeclarationContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    annotationTypeDeclaration(): AnnotationTypeDeclarationContext;
    classOrInterfaceModifier_list(): ClassOrInterfaceModifierContext[];
    classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ModifierContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    classOrInterfaceModifier(): ClassOrInterfaceModifierContext;
    NATIVE(): TerminalNode;
    SYNCHRONIZED(): TerminalNode;
    TRANSIENT(): TerminalNode;
    VOLATILE(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassOrInterfaceModifierContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    annotation(): AnnotationContext;
    PUBLIC(): TerminalNode;
    PROTECTED(): TerminalNode;
    PRIVATE(): TerminalNode;
    STATIC(): TerminalNode;
    ABSTRACT(): TerminalNode;
    FINAL(): TerminalNode;
    STRICTFP(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class VariableModifierContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    FINAL(): TerminalNode;
    annotation(): AnnotationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    CLASS(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    classBody(): ClassBodyContext;
    typeParameters(): TypeParametersContext;
    EXTENDS(): TerminalNode;
    typeType(): TypeTypeContext;
    IMPLEMENTS(): TerminalNode;
    typeList(): TypeListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeParametersContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LT(): TerminalNode;
    typeParameter_list(): TypeParameterContext[];
    typeParameter(i: number): TypeParameterContext;
    GT(): TerminalNode;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeParameterContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    annotation_list(): AnnotationContext[];
    annotation(i: number): AnnotationContext;
    EXTENDS(): TerminalNode;
    typeBound(): TypeBoundContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeBoundContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType_list(): TypeTypeContext[];
    typeType(i: number): TypeTypeContext;
    BITAND_list(): TerminalNode[];
    BITAND(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class EnumDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    ENUM(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    IMPLEMENTS(): TerminalNode;
    typeList(): TypeListContext;
    enumConstants(): EnumConstantsContext;
    COMMA(): TerminalNode;
    enumBodyDeclarations(): EnumBodyDeclarationsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class EnumConstantsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    enumConstant_list(): EnumConstantContext[];
    enumConstant(i: number): EnumConstantContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class EnumConstantContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    annotation_list(): AnnotationContext[];
    annotation(i: number): AnnotationContext;
    arguments(): ArgumentsContext;
    classBody(): ClassBodyContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class EnumBodyDeclarationsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    SEMI(): TerminalNode;
    classBodyDeclaration_list(): ClassBodyDeclarationContext[];
    classBodyDeclaration(i: number): ClassBodyDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    INTERFACE(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    interfaceBody(): InterfaceBodyContext;
    typeParameters(): TypeParametersContext;
    EXTENDS(): TerminalNode;
    typeList(): TypeListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassBodyContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    classBodyDeclaration_list(): ClassBodyDeclarationContext[];
    classBodyDeclaration(i: number): ClassBodyDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceBodyContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    interfaceBodyDeclaration_list(): InterfaceBodyDeclarationContext[];
    interfaceBodyDeclaration(i: number): InterfaceBodyDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassBodyDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    SEMI(): TerminalNode;
    importDeclaration(): ImportDeclarationContext;
    block(): BlockContext;
    STATIC(): TerminalNode;
    memberDeclaration(): MemberDeclarationContext;
    modifier_list(): ModifierContext[];
    modifier(i: number): ModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class MemberDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    methodDeclaration(): MethodDeclarationContext;
    genericMethodDeclaration(): GenericMethodDeclarationContext;
    fieldDeclaration(): FieldDeclarationContext;
    constructorDeclaration(): ConstructorDeclarationContext;
    genericConstructorDeclaration(): GenericConstructorDeclarationContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    annotationTypeDeclaration(): AnnotationTypeDeclarationContext;
    classDeclaration(): ClassDeclarationContext;
    enumDeclaration(): EnumDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class MethodDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeTypeOrVoid(): TypeTypeOrVoidContext;
    IDENTIFIER(): TerminalNode;
    formalParameters(): FormalParametersContext;
    methodBody(): MethodBodyContext;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    THROWS(): TerminalNode;
    qualifiedNameList(): QualifiedNameListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class MethodBodyContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    block(): BlockContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeTypeOrVoidContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    VOID(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class GenericMethodDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeParameters(): TypeParametersContext;
    methodDeclaration(): MethodDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class GenericConstructorDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeParameters(): TypeParametersContext;
    constructorDeclaration(): ConstructorDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ConstructorDeclarationContext extends ParserRuleContext {
    _constructorBody: BlockContext;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    formalParameters(): FormalParametersContext;
    block(): BlockContext;
    THROWS(): TerminalNode;
    qualifiedNameList(): QualifiedNameListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FieldDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    variableDeclarators(): VariableDeclaratorsContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceBodyDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    interfaceMemberDeclaration(): InterfaceMemberDeclarationContext;
    modifier_list(): ModifierContext[];
    modifier(i: number): ModifierContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceMemberDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    constDeclaration(): ConstDeclarationContext;
    interfaceMethodDeclaration(): InterfaceMethodDeclarationContext;
    genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    annotationTypeDeclaration(): AnnotationTypeDeclarationContext;
    classDeclaration(): ClassDeclarationContext;
    enumDeclaration(): EnumDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ConstDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    constantDeclarator_list(): ConstantDeclaratorContext[];
    constantDeclarator(i: number): ConstantDeclaratorContext;
    SEMI(): TerminalNode;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ConstantDeclaratorContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    ASSIGN(): TerminalNode;
    variableInitializer(): VariableInitializerContext;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceMethodDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    formalParameters(): FormalParametersContext;
    methodBody(): MethodBodyContext;
    typeTypeOrVoid(): TypeTypeOrVoidContext;
    typeParameters(): TypeParametersContext;
    interfaceMethodModifier_list(): InterfaceMethodModifierContext[];
    interfaceMethodModifier(i: number): InterfaceMethodModifierContext;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    THROWS(): TerminalNode;
    qualifiedNameList(): QualifiedNameListContext;
    annotation_list(): AnnotationContext[];
    annotation(i: number): AnnotationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InterfaceMethodModifierContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    annotation(): AnnotationContext;
    PUBLIC(): TerminalNode;
    ABSTRACT(): TerminalNode;
    DEFAULT(): TerminalNode;
    STATIC(): TerminalNode;
    STRICTFP(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class GenericInterfaceMethodDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeParameters(): TypeParametersContext;
    interfaceMethodDeclaration(): InterfaceMethodDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class VariableDeclaratorsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    variableDeclarator_list(): VariableDeclaratorContext[];
    variableDeclarator(i: number): VariableDeclaratorContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class VariableDeclaratorContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    variableDeclaratorId(): VariableDeclaratorIdContext;
    ASSIGN(): TerminalNode;
    variableInitializer(): VariableInitializerContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class VariableInitializerContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    arrayInitializer(): ArrayInitializerContext;
    expression(): ExpressionContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ArrayInitializerContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    variableInitializer_list(): VariableInitializerContext[];
    variableInitializer(i: number): VariableInitializerContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassOrInterfaceTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER_list(): TerminalNode[];
    IDENTIFIER(i: number): TerminalNode;
    typeArguments_list(): TypeArgumentsContext[];
    typeArguments(i: number): TypeArgumentsContext;
    DOT_list(): TerminalNode[];
    DOT(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeArgumentContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    QUESTION(): TerminalNode;
    EXTENDS(): TerminalNode;
    SUPER(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class QualifiedNameListContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    qualifiedName_list(): QualifiedNameContext[];
    qualifiedName(i: number): QualifiedNameContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FormalParametersContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    formalParameterList(): FormalParameterListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FormalParameterListContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    formalParameter_list(): FormalParameterContext[];
    formalParameter(i: number): FormalParameterContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    lastFormalParameter(): LastFormalParameterContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FormalParameterContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    variableDeclaratorId(): VariableDeclaratorIdContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LastFormalParameterContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    ELLIPSIS(): TerminalNode;
    variableDeclaratorId(): VariableDeclaratorIdContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class BaseStringLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    STRING_LITERAL(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class MultilineStringLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    MULTI_STRING_LIT(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class StringLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    baseStringLiteral(): BaseStringLiteralContext;
    multilineStringLiteral(): MultilineStringLiteralContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class IntegerLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    DECIMAL_LITERAL(): TerminalNode;
    HEX_LITERAL(): TerminalNode;
    OCT_LITERAL(): TerminalNode;
    BINARY_LITERAL(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FloatLiteralContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    FLOAT_LITERAL(): TerminalNode;
    HEX_FLOAT_LITERAL(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    AT(): TerminalNode;
    qualifiedName(): QualifiedNameContext;
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    elementValuePairs(): ElementValuePairsContext;
    elementValue(): ElementValueContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ElementValuePairsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    elementValuePair_list(): ElementValuePairContext[];
    elementValuePair(i: number): ElementValuePairContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ElementValuePairContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    ASSIGN(): TerminalNode;
    elementValue(): ElementValueContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ElementValueContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    expression(): ExpressionContext;
    annotation(): AnnotationContext;
    elementValueArrayInitializer(): ElementValueArrayInitializerContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ElementValueArrayInitializerContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    elementValue_list(): ElementValueContext[];
    elementValue(i: number): ElementValueContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationTypeDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    AT(): TerminalNode;
    INTERFACE(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    annotationTypeBody(): AnnotationTypeBodyContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationTypeBodyContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    annotationTypeElementDeclaration_list(): AnnotationTypeElementDeclarationContext[];
    annotationTypeElementDeclaration(i: number): AnnotationTypeElementDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationTypeElementDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    annotationTypeElementRest(): AnnotationTypeElementRestContext;
    modifier_list(): ModifierContext[];
    modifier(i: number): ModifierContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationTypeElementRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext;
    SEMI(): TerminalNode;
    classDeclaration(): ClassDeclarationContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    enumDeclaration(): EnumDeclarationContext;
    annotationTypeDeclaration(): AnnotationTypeDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationMethodOrConstantRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    annotationMethodRest(): AnnotationMethodRestContext;
    annotationConstantRest(): AnnotationConstantRestContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationMethodRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    defaultValue(): DefaultValueContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class AnnotationConstantRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    variableDeclarators(): VariableDeclaratorsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class DefaultValueContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    DEFAULT(): TerminalNode;
    elementValue(): ElementValueContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class BlockContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    blockStatement_list(): BlockStatementContext[];
    blockStatement(i: number): BlockStatementContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class BlockStatementContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    localVariableDeclaration(): LocalVariableDeclarationContext;
    SEMI(): TerminalNode;
    statement(): StatementContext;
    localTypeDeclaration(): LocalTypeDeclarationContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LocalVariableDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    variableDeclarators(): VariableDeclaratorsContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LocalTypeDeclarationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    classDeclaration(): ClassDeclarationContext;
    interfaceDeclaration(): InterfaceDeclarationContext;
    classOrInterfaceModifier_list(): ClassOrInterfaceModifierContext[];
    classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class StatementContext extends ParserRuleContext {
    _blockLabel: BlockContext;
    _statementExpression: ExpressionContext;
    _identifierLabel: Token;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    block(): BlockContext;
    ASSERT(): TerminalNode;
    expression_list(): ExpressionContext[];
    expression(i: number): ExpressionContext;
    SEMI(): TerminalNode;
    COLON(): TerminalNode;
    IF(): TerminalNode;
    parExpression(): ParExpressionContext;
    statement_list(): StatementContext[];
    statement(i: number): StatementContext;
    ELSE(): TerminalNode;
    FOR(): TerminalNode;
    LPAREN(): TerminalNode;
    forControl(): ForControlContext;
    RPAREN(): TerminalNode;
    WHILE(): TerminalNode;
    DO(): TerminalNode;
    TRY(): TerminalNode;
    finallyBlock(): FinallyBlockContext;
    catchClause_list(): CatchClauseContext[];
    catchClause(i: number): CatchClauseContext;
    resourceSpecification(): ResourceSpecificationContext;
    SWITCH(): TerminalNode;
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    switchBlockStatementGroup_list(): SwitchBlockStatementGroupContext[];
    switchBlockStatementGroup(i: number): SwitchBlockStatementGroupContext;
    switchLabel_list(): SwitchLabelContext[];
    switchLabel(i: number): SwitchLabelContext;
    SYNCHRONIZED(): TerminalNode;
    RETURN(): TerminalNode;
    THROW(): TerminalNode;
    BREAK(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    CONTINUE(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class CatchClauseContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    CATCH(): TerminalNode;
    LPAREN(): TerminalNode;
    catchType(): CatchTypeContext;
    IDENTIFIER(): TerminalNode;
    RPAREN(): TerminalNode;
    block(): BlockContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class CatchTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    qualifiedName_list(): QualifiedNameContext[];
    qualifiedName(i: number): QualifiedNameContext;
    BITOR_list(): TerminalNode[];
    BITOR(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class FinallyBlockContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    FINALLY(): TerminalNode;
    block(): BlockContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ResourceSpecificationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    resources(): ResourcesContext;
    RPAREN(): TerminalNode;
    SEMI(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ResourcesContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    resource_list(): ResourceContext[];
    resource(i: number): ResourceContext;
    SEMI_list(): TerminalNode[];
    SEMI(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ResourceContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    classOrInterfaceType(): ClassOrInterfaceTypeContext;
    variableDeclaratorId(): VariableDeclaratorIdContext;
    ASSIGN(): TerminalNode;
    expression(): ExpressionContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class SwitchBlockStatementGroupContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    switchLabel_list(): SwitchLabelContext[];
    switchLabel(i: number): SwitchLabelContext;
    blockStatement_list(): BlockStatementContext[];
    blockStatement(i: number): BlockStatementContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class SwitchLabelContext extends ParserRuleContext {
    _constantExpression: ExpressionContext;
    _enumConstantName: Token;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    CASE(): TerminalNode;
    COLON(): TerminalNode;
    expression(): ExpressionContext;
    IDENTIFIER(): TerminalNode;
    DEFAULT(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ForControlContext extends ParserRuleContext {
    _forUpdate: ExpressionListContext;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    enhancedForControl(): EnhancedForControlContext;
    SEMI_list(): TerminalNode[];
    SEMI(i: number): TerminalNode;
    forInit(): ForInitContext;
    expression(): ExpressionContext;
    expressionList(): ExpressionListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ForInitContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    localVariableDeclaration(): LocalVariableDeclarationContext;
    expressionList(): ExpressionListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class EnhancedForControlContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType(): TypeTypeContext;
    variableDeclaratorId(): VariableDeclaratorIdContext;
    COLON(): TerminalNode;
    expression(): ExpressionContext;
    variableModifier_list(): VariableModifierContext[];
    variableModifier(i: number): VariableModifierContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ParExpressionContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    expression(): ExpressionContext;
    RPAREN(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ExpressionListContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    expression_list(): ExpressionContext[];
    expression(i: number): ExpressionContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ExpressionContext extends ParserRuleContext {
    _prefix: Token;
    _bop: Token;
    _postfix: Token;
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    primary(): PrimaryContext;
    methodCall(): MethodCallContext;
    NEW(): TerminalNode;
    creator(): CreatorContext;
    LPAREN(): TerminalNode;
    typeType(): TypeTypeContext;
    RPAREN(): TerminalNode;
    expression_list(): ExpressionContext[];
    expression(i: number): ExpressionContext;
    ADD(): TerminalNode;
    SUB(): TerminalNode;
    INC(): TerminalNode;
    DEC(): TerminalNode;
    TILDE(): TerminalNode;
    BANG(): TerminalNode;
    lambdaExpression(): LambdaExpressionContext;
    COLONCOLON(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    typeArguments(): TypeArgumentsContext;
    classType(): ClassTypeContext;
    MUL(): TerminalNode;
    DIV(): TerminalNode;
    MOD(): TerminalNode;
    LT_list(): TerminalNode[];
    LT(i: number): TerminalNode;
    GT_list(): TerminalNode[];
    GT(i: number): TerminalNode;
    LE(): TerminalNode;
    GE(): TerminalNode;
    EQUAL(): TerminalNode;
    NOTEQUAL(): TerminalNode;
    BITAND(): TerminalNode;
    CARET(): TerminalNode;
    BITOR(): TerminalNode;
    AND(): TerminalNode;
    OR(): TerminalNode;
    COLON(): TerminalNode;
    QUESTION(): TerminalNode;
    ASSIGN(): TerminalNode;
    ADD_ASSIGN(): TerminalNode;
    SUB_ASSIGN(): TerminalNode;
    MUL_ASSIGN(): TerminalNode;
    DIV_ASSIGN(): TerminalNode;
    AND_ASSIGN(): TerminalNode;
    OR_ASSIGN(): TerminalNode;
    XOR_ASSIGN(): TerminalNode;
    RSHIFT_ASSIGN(): TerminalNode;
    URSHIFT_ASSIGN(): TerminalNode;
    LSHIFT_ASSIGN(): TerminalNode;
    MOD_ASSIGN(): TerminalNode;
    DOT(): TerminalNode;
    THIS(): TerminalNode;
    innerCreator(): InnerCreatorContext;
    SUPER(): TerminalNode;
    superSuffix(): SuperSuffixContext;
    explicitGenericInvocation(): ExplicitGenericInvocationContext;
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    LBRACK(): TerminalNode;
    RBRACK(): TerminalNode;
    INSTANCEOF(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LambdaExpressionContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    lambdaParameters(): LambdaParametersContext;
    ARROW(): TerminalNode;
    lambdaBody(): LambdaBodyContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LambdaParametersContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER_list(): TerminalNode[];
    IDENTIFIER(i: number): TerminalNode;
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    formalParameterList(): FormalParameterListContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class LambdaBodyContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    expression(): ExpressionContext;
    block(): BlockContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class PrimaryContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    expression(): ExpressionContext;
    RPAREN(): TerminalNode;
    THIS(): TerminalNode;
    SUPER(): TerminalNode;
    literal(): LiteralContext;
    IDENTIFIER(): TerminalNode;
    typeTypeOrVoid(): TypeTypeOrVoidContext;
    DOT(): TerminalNode;
    CLASS(): TerminalNode;
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext;
    arguments(): ArgumentsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    classOrInterfaceType(): ClassOrInterfaceTypeContext;
    DOT(): TerminalNode;
    annotation_list(): AnnotationContext[];
    annotation(i: number): AnnotationContext;
    typeArguments(): TypeArgumentsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class CreatorContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    createdName(): CreatedNameContext;
    classCreatorRest(): ClassCreatorRestContext;
    arrayCreatorRest(): ArrayCreatorRestContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class CreatedNameContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER_list(): TerminalNode[];
    IDENTIFIER(i: number): TerminalNode;
    typeArgumentsOrDiamond_list(): TypeArgumentsOrDiamondContext[];
    typeArgumentsOrDiamond(i: number): TypeArgumentsOrDiamondContext;
    DOT_list(): TerminalNode[];
    DOT(i: number): TerminalNode;
    primitiveType(): PrimitiveTypeContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class InnerCreatorContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    IDENTIFIER(): TerminalNode;
    classCreatorRest(): ClassCreatorRestContext;
    nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ArrayCreatorRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    arrayInitializer(): ArrayInitializerContext;
    expression_list(): ExpressionContext[];
    expression(i: number): ExpressionContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ClassCreatorRestContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    arguments(): ArgumentsContext;
    classBody(): ClassBodyContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ExplicitGenericInvocationContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeArgumentsOrDiamondContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LT(): TerminalNode;
    GT(): TerminalNode;
    typeArguments(): TypeArgumentsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class NonWildcardTypeArgumentsOrDiamondContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LT(): TerminalNode;
    GT(): TerminalNode;
    nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class NonWildcardTypeArgumentsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LT(): TerminalNode;
    typeList(): TypeListContext;
    GT(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeListContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    typeType_list(): TypeTypeContext[];
    typeType(i: number): TypeTypeContext;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeTypeContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    classOrInterfaceType(): ClassOrInterfaceTypeContext;
    primitiveType(): PrimitiveTypeContext;
    VAR(): TerminalNode;
    annotation(): AnnotationContext;
    LBRACK_list(): TerminalNode[];
    LBRACK(i: number): TerminalNode;
    RBRACK_list(): TerminalNode[];
    RBRACK(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class TypeArgumentsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LT(): TerminalNode;
    typeArgument_list(): TypeArgumentContext[];
    typeArgument(i: number): TypeArgumentContext;
    GT(): TerminalNode;
    COMMA_list(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class SuperSuffixContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    arguments(): ArgumentsContext;
    DOT(): TerminalNode;
    IDENTIFIER(): TerminalNode;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ExplicitGenericInvocationSuffixContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    SUPER(): TerminalNode;
    superSuffix(): SuperSuffixContext;
    IDENTIFIER(): TerminalNode;
    arguments(): ArgumentsContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
export declare class ArgumentsContext extends ParserRuleContext {
    constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number);
    LPAREN(): TerminalNode;
    RPAREN(): TerminalNode;
    expressionList(): ExpressionListContext;
    get ruleIndex(): number;
    accept<Result>(visitor: ProcessingVisitor<Result>): Result;
}
