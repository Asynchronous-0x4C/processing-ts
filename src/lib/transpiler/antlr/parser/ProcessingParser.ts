// Generated from g:/projects/processing-ts/src/lib/antlr/Processing.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import ProcessingVisitor from "./ProcessingVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class ProcessingParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly HexColorLiteral = 2;
	public static readonly WS = 3;
	public static readonly COMMENT = 4;
	public static readonly LINE_COMMENT = 5;
	public static readonly CHAR_LITERAL = 6;
	public static readonly ABSTRACT = 7;
	public static readonly ASSERT = 8;
	public static readonly BOOLEAN = 9;
	public static readonly BREAK = 10;
	public static readonly BYTE = 11;
	public static readonly CASE = 12;
	public static readonly CATCH = 13;
	public static readonly CHAR = 14;
	public static readonly CLASS = 15;
	public static readonly CONST = 16;
	public static readonly CONTINUE = 17;
	public static readonly DEFAULT = 18;
	public static readonly DO = 19;
	public static readonly DOUBLE = 20;
	public static readonly ELSE = 21;
	public static readonly ENUM = 22;
	public static readonly EXTENDS = 23;
	public static readonly FINAL = 24;
	public static readonly FINALLY = 25;
	public static readonly FLOAT = 26;
	public static readonly FOR = 27;
	public static readonly IF = 28;
	public static readonly GOTO = 29;
	public static readonly IMPLEMENTS = 30;
	public static readonly IMPORT = 31;
	public static readonly INSTANCEOF = 32;
	public static readonly INT = 33;
	public static readonly INTERFACE = 34;
	public static readonly LONG = 35;
	public static readonly NATIVE = 36;
	public static readonly NEW = 37;
	public static readonly PACKAGE = 38;
	public static readonly PRIVATE = 39;
	public static readonly PROTECTED = 40;
	public static readonly PUBLIC = 41;
	public static readonly RETURN = 42;
	public static readonly SHORT = 43;
	public static readonly STATIC = 44;
	public static readonly STRICTFP = 45;
	public static readonly SUPER = 46;
	public static readonly SWITCH = 47;
	public static readonly SYNCHRONIZED = 48;
	public static readonly THIS = 49;
	public static readonly THROW = 50;
	public static readonly THROWS = 51;
	public static readonly TRANSIENT = 52;
	public static readonly TRY = 53;
	public static readonly VAR = 54;
	public static readonly VOID = 55;
	public static readonly VOLATILE = 56;
	public static readonly WHILE = 57;
	public static readonly DECIMAL_LITERAL = 58;
	public static readonly HEX_LITERAL = 59;
	public static readonly OCT_LITERAL = 60;
	public static readonly BINARY_LITERAL = 61;
	public static readonly FLOAT_LITERAL = 62;
	public static readonly HEX_FLOAT_LITERAL = 63;
	public static readonly BOOL_LITERAL = 64;
	public static readonly STRING_LITERAL = 65;
	public static readonly MULTI_STRING_LIT = 66;
	public static readonly NULL_LITERAL = 67;
	public static readonly LPAREN = 68;
	public static readonly RPAREN = 69;
	public static readonly LBRACE = 70;
	public static readonly RBRACE = 71;
	public static readonly LBRACK = 72;
	public static readonly RBRACK = 73;
	public static readonly SEMI = 74;
	public static readonly COMMA = 75;
	public static readonly DOT = 76;
	public static readonly ASSIGN = 77;
	public static readonly GT = 78;
	public static readonly LT = 79;
	public static readonly BANG = 80;
	public static readonly TILDE = 81;
	public static readonly QUESTION = 82;
	public static readonly COLON = 83;
	public static readonly EQUAL = 84;
	public static readonly LE = 85;
	public static readonly GE = 86;
	public static readonly NOTEQUAL = 87;
	public static readonly AND = 88;
	public static readonly OR = 89;
	public static readonly INC = 90;
	public static readonly DEC = 91;
	public static readonly ADD = 92;
	public static readonly SUB = 93;
	public static readonly MUL = 94;
	public static readonly DIV = 95;
	public static readonly BITAND = 96;
	public static readonly BITOR = 97;
	public static readonly CARET = 98;
	public static readonly MOD = 99;
	public static readonly ADD_ASSIGN = 100;
	public static readonly SUB_ASSIGN = 101;
	public static readonly MUL_ASSIGN = 102;
	public static readonly DIV_ASSIGN = 103;
	public static readonly AND_ASSIGN = 104;
	public static readonly OR_ASSIGN = 105;
	public static readonly XOR_ASSIGN = 106;
	public static readonly MOD_ASSIGN = 107;
	public static readonly LSHIFT_ASSIGN = 108;
	public static readonly RSHIFT_ASSIGN = 109;
	public static readonly URSHIFT_ASSIGN = 110;
	public static readonly ARROW = 111;
	public static readonly COLONCOLON = 112;
	public static readonly AT = 113;
	public static readonly ELLIPSIS = 114;
	public static readonly IDENTIFIER = 115;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_processingSketch = 0;
	public static readonly RULE_javaProcessingSketch = 1;
	public static readonly RULE_staticProcessingSketch = 2;
	public static readonly RULE_activeProcessingSketch = 3;
	public static readonly RULE_warnMixedModes = 4;
	public static readonly RULE_variableDeclaratorId = 5;
	public static readonly RULE_warnTypeAsVariableName = 6;
	public static readonly RULE_methodCall = 7;
	public static readonly RULE_functionWithPrimitiveTypeName = 8;
	public static readonly RULE_primitiveType = 9;
	public static readonly RULE_colorPrimitiveType = 10;
	public static readonly RULE_qualifiedName = 11;
	public static readonly RULE_literal = 12;
	public static readonly RULE_hexColorLiteral = 13;
	public static readonly RULE_compilationUnit = 14;
	public static readonly RULE_packageDeclaration = 15;
	public static readonly RULE_importDeclaration = 16;
	public static readonly RULE_typeDeclaration = 17;
	public static readonly RULE_modifier = 18;
	public static readonly RULE_classOrInterfaceModifier = 19;
	public static readonly RULE_variableModifier = 20;
	public static readonly RULE_classDeclaration = 21;
	public static readonly RULE_typeParameters = 22;
	public static readonly RULE_typeParameter = 23;
	public static readonly RULE_typeBound = 24;
	public static readonly RULE_enumDeclaration = 25;
	public static readonly RULE_enumConstants = 26;
	public static readonly RULE_enumConstant = 27;
	public static readonly RULE_enumBodyDeclarations = 28;
	public static readonly RULE_interfaceDeclaration = 29;
	public static readonly RULE_classBody = 30;
	public static readonly RULE_interfaceBody = 31;
	public static readonly RULE_classBodyDeclaration = 32;
	public static readonly RULE_memberDeclaration = 33;
	public static readonly RULE_methodDeclaration = 34;
	public static readonly RULE_methodBody = 35;
	public static readonly RULE_typeTypeOrVoid = 36;
	public static readonly RULE_genericMethodDeclaration = 37;
	public static readonly RULE_genericConstructorDeclaration = 38;
	public static readonly RULE_constructorDeclaration = 39;
	public static readonly RULE_fieldDeclaration = 40;
	public static readonly RULE_interfaceBodyDeclaration = 41;
	public static readonly RULE_interfaceMemberDeclaration = 42;
	public static readonly RULE_constDeclaration = 43;
	public static readonly RULE_constantDeclarator = 44;
	public static readonly RULE_interfaceMethodDeclaration = 45;
	public static readonly RULE_interfaceMethodModifier = 46;
	public static readonly RULE_genericInterfaceMethodDeclaration = 47;
	public static readonly RULE_variableDeclarators = 48;
	public static readonly RULE_variableDeclarator = 49;
	public static readonly RULE_variableInitializer = 50;
	public static readonly RULE_arrayInitializer = 51;
	public static readonly RULE_classOrInterfaceType = 52;
	public static readonly RULE_typeArgument = 53;
	public static readonly RULE_qualifiedNameList = 54;
	public static readonly RULE_formalParameters = 55;
	public static readonly RULE_formalParameterList = 56;
	public static readonly RULE_formalParameter = 57;
	public static readonly RULE_lastFormalParameter = 58;
	public static readonly RULE_baseStringLiteral = 59;
	public static readonly RULE_multilineStringLiteral = 60;
	public static readonly RULE_stringLiteral = 61;
	public static readonly RULE_integerLiteral = 62;
	public static readonly RULE_floatLiteral = 63;
	public static readonly RULE_annotation = 64;
	public static readonly RULE_elementValuePairs = 65;
	public static readonly RULE_elementValuePair = 66;
	public static readonly RULE_elementValue = 67;
	public static readonly RULE_elementValueArrayInitializer = 68;
	public static readonly RULE_annotationTypeDeclaration = 69;
	public static readonly RULE_annotationTypeBody = 70;
	public static readonly RULE_annotationTypeElementDeclaration = 71;
	public static readonly RULE_annotationTypeElementRest = 72;
	public static readonly RULE_annotationMethodOrConstantRest = 73;
	public static readonly RULE_annotationMethodRest = 74;
	public static readonly RULE_annotationConstantRest = 75;
	public static readonly RULE_defaultValue = 76;
	public static readonly RULE_block = 77;
	public static readonly RULE_blockStatement = 78;
	public static readonly RULE_localVariableDeclaration = 79;
	public static readonly RULE_localTypeDeclaration = 80;
	public static readonly RULE_statement = 81;
	public static readonly RULE_catchClause = 82;
	public static readonly RULE_catchType = 83;
	public static readonly RULE_finallyBlock = 84;
	public static readonly RULE_resourceSpecification = 85;
	public static readonly RULE_resources = 86;
	public static readonly RULE_resource = 87;
	public static readonly RULE_switchBlockStatementGroup = 88;
	public static readonly RULE_switchLabel = 89;
	public static readonly RULE_forControl = 90;
	public static readonly RULE_forInit = 91;
	public static readonly RULE_enhancedForControl = 92;
	public static readonly RULE_parExpression = 93;
	public static readonly RULE_expressionList = 94;
	public static readonly RULE_expression = 95;
	public static readonly RULE_lambdaExpression = 96;
	public static readonly RULE_lambdaParameters = 97;
	public static readonly RULE_lambdaBody = 98;
	public static readonly RULE_primary = 99;
	public static readonly RULE_classType = 100;
	public static readonly RULE_creator = 101;
	public static readonly RULE_createdName = 102;
	public static readonly RULE_innerCreator = 103;
	public static readonly RULE_arrayCreatorRest = 104;
	public static readonly RULE_classCreatorRest = 105;
	public static readonly RULE_explicitGenericInvocation = 106;
	public static readonly RULE_typeArgumentsOrDiamond = 107;
	public static readonly RULE_nonWildcardTypeArgumentsOrDiamond = 108;
	public static readonly RULE_nonWildcardTypeArguments = 109;
	public static readonly RULE_typeList = 110;
	public static readonly RULE_typeType = 111;
	public static readonly RULE_typeArguments = 112;
	public static readonly RULE_superSuffix = 113;
	public static readonly RULE_explicitGenericInvocationSuffix = 114;
	public static readonly RULE_arguments = 115;
	public static readonly literalNames: (string | null)[] = [ null, "'color'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'abstract'", 
                                                            "'assert'", 
                                                            "'boolean'", 
                                                            "'break'", "'byte'", 
                                                            "'case'", "'catch'", 
                                                            "'char'", "'class'", 
                                                            "'const'", "'continue'", 
                                                            "'default'", 
                                                            "'do'", "'double'", 
                                                            "'else'", "'enum'", 
                                                            "'extends'", 
                                                            "'final'", "'finally'", 
                                                            "'float'", "'for'", 
                                                            "'if'", "'goto'", 
                                                            "'implements'", 
                                                            "'import'", 
                                                            "'instanceof'", 
                                                            "'int'", "'interface'", 
                                                            "'long'", "'native'", 
                                                            "'new'", "'package'", 
                                                            "'private'", 
                                                            "'protected'", 
                                                            "'public'", 
                                                            "'return'", 
                                                            "'short'", "'static'", 
                                                            "'strictfp'", 
                                                            "'super'", "'switch'", 
                                                            "'synchronized'", 
                                                            "'this'", "'throw'", 
                                                            "'throws'", 
                                                            "'transient'", 
                                                            "'try'", "'var'", 
                                                            "'void'", "'volatile'", 
                                                            "'while'", null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'null'", "'('", 
                                                            "')'", "'{'", 
                                                            "'}'", "'['", 
                                                            "']'", "';'", 
                                                            "','", "'.'", 
                                                            "'='", "'>'", 
                                                            "'<'", "'!'", 
                                                            "'~'", "'?'", 
                                                            "':'", "'=='", 
                                                            "'<='", "'>='", 
                                                            "'!='", "'&&'", 
                                                            "'||'", "'++'", 
                                                            "'--'", "'+'", 
                                                            "'-'", "'*'", 
                                                            "'/'", "'&'", 
                                                            "'|'", "'^'", 
                                                            "'%'", "'+='", 
                                                            "'-='", "'*='", 
                                                            "'/='", "'&='", 
                                                            "'|='", "'^='", 
                                                            "'%='", "'<<='", 
                                                            "'>>='", "'>>>='", 
                                                            "'->'", "'::'", 
                                                            "'@'", "'...'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             "HexColorLiteral", 
                                                             "WS", "COMMENT", 
                                                             "LINE_COMMENT", 
                                                             "CHAR_LITERAL", 
                                                             "ABSTRACT", 
                                                             "ASSERT", "BOOLEAN", 
                                                             "BREAK", "BYTE", 
                                                             "CASE", "CATCH", 
                                                             "CHAR", "CLASS", 
                                                             "CONST", "CONTINUE", 
                                                             "DEFAULT", 
                                                             "DO", "DOUBLE", 
                                                             "ELSE", "ENUM", 
                                                             "EXTENDS", 
                                                             "FINAL", "FINALLY", 
                                                             "FLOAT", "FOR", 
                                                             "IF", "GOTO", 
                                                             "IMPLEMENTS", 
                                                             "IMPORT", "INSTANCEOF", 
                                                             "INT", "INTERFACE", 
                                                             "LONG", "NATIVE", 
                                                             "NEW", "PACKAGE", 
                                                             "PRIVATE", 
                                                             "PROTECTED", 
                                                             "PUBLIC", "RETURN", 
                                                             "SHORT", "STATIC", 
                                                             "STRICTFP", 
                                                             "SUPER", "SWITCH", 
                                                             "SYNCHRONIZED", 
                                                             "THIS", "THROW", 
                                                             "THROWS", "TRANSIENT", 
                                                             "TRY", "VAR", 
                                                             "VOID", "VOLATILE", 
                                                             "WHILE", "DECIMAL_LITERAL", 
                                                             "HEX_LITERAL", 
                                                             "OCT_LITERAL", 
                                                             "BINARY_LITERAL", 
                                                             "FLOAT_LITERAL", 
                                                             "HEX_FLOAT_LITERAL", 
                                                             "BOOL_LITERAL", 
                                                             "STRING_LITERAL", 
                                                             "MULTI_STRING_LIT", 
                                                             "NULL_LITERAL", 
                                                             "LPAREN", "RPAREN", 
                                                             "LBRACE", "RBRACE", 
                                                             "LBRACK", "RBRACK", 
                                                             "SEMI", "COMMA", 
                                                             "DOT", "ASSIGN", 
                                                             "GT", "LT", 
                                                             "BANG", "TILDE", 
                                                             "QUESTION", 
                                                             "COLON", "EQUAL", 
                                                             "LE", "GE", 
                                                             "NOTEQUAL", 
                                                             "AND", "OR", 
                                                             "INC", "DEC", 
                                                             "ADD", "SUB", 
                                                             "MUL", "DIV", 
                                                             "BITAND", "BITOR", 
                                                             "CARET", "MOD", 
                                                             "ADD_ASSIGN", 
                                                             "SUB_ASSIGN", 
                                                             "MUL_ASSIGN", 
                                                             "DIV_ASSIGN", 
                                                             "AND_ASSIGN", 
                                                             "OR_ASSIGN", 
                                                             "XOR_ASSIGN", 
                                                             "MOD_ASSIGN", 
                                                             "LSHIFT_ASSIGN", 
                                                             "RSHIFT_ASSIGN", 
                                                             "URSHIFT_ASSIGN", 
                                                             "ARROW", "COLONCOLON", 
                                                             "AT", "ELLIPSIS", 
                                                             "IDENTIFIER" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"processingSketch", "javaProcessingSketch", "staticProcessingSketch", 
		"activeProcessingSketch", "warnMixedModes", "variableDeclaratorId", "warnTypeAsVariableName", 
		"methodCall", "functionWithPrimitiveTypeName", "primitiveType", "colorPrimitiveType", 
		"qualifiedName", "literal", "hexColorLiteral", "compilationUnit", "packageDeclaration", 
		"importDeclaration", "typeDeclaration", "modifier", "classOrInterfaceModifier", 
		"variableModifier", "classDeclaration", "typeParameters", "typeParameter", 
		"typeBound", "enumDeclaration", "enumConstants", "enumConstant", "enumBodyDeclarations", 
		"interfaceDeclaration", "classBody", "interfaceBody", "classBodyDeclaration", 
		"memberDeclaration", "methodDeclaration", "methodBody", "typeTypeOrVoid", 
		"genericMethodDeclaration", "genericConstructorDeclaration", "constructorDeclaration", 
		"fieldDeclaration", "interfaceBodyDeclaration", "interfaceMemberDeclaration", 
		"constDeclaration", "constantDeclarator", "interfaceMethodDeclaration", 
		"interfaceMethodModifier", "genericInterfaceMethodDeclaration", "variableDeclarators", 
		"variableDeclarator", "variableInitializer", "arrayInitializer", "classOrInterfaceType", 
		"typeArgument", "qualifiedNameList", "formalParameters", "formalParameterList", 
		"formalParameter", "lastFormalParameter", "baseStringLiteral", "multilineStringLiteral", 
		"stringLiteral", "integerLiteral", "floatLiteral", "annotation", "elementValuePairs", 
		"elementValuePair", "elementValue", "elementValueArrayInitializer", "annotationTypeDeclaration", 
		"annotationTypeBody", "annotationTypeElementDeclaration", "annotationTypeElementRest", 
		"annotationMethodOrConstantRest", "annotationMethodRest", "annotationConstantRest", 
		"defaultValue", "block", "blockStatement", "localVariableDeclaration", 
		"localTypeDeclaration", "statement", "catchClause", "catchType", "finallyBlock", 
		"resourceSpecification", "resources", "resource", "switchBlockStatementGroup", 
		"switchLabel", "forControl", "forInit", "enhancedForControl", "parExpression", 
		"expressionList", "expression", "lambdaExpression", "lambdaParameters", 
		"lambdaBody", "primary", "classType", "creator", "createdName", "innerCreator", 
		"arrayCreatorRest", "classCreatorRest", "explicitGenericInvocation", "typeArgumentsOrDiamond", 
		"nonWildcardTypeArgumentsOrDiamond", "nonWildcardTypeArguments", "typeList", 
		"typeType", "typeArguments", "superSuffix", "explicitGenericInvocationSuffix", 
		"arguments",
	];
	public get grammarFileName(): string { return "Processing.g4"; }
	public get literalNames(): (string | null)[] { return ProcessingParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return ProcessingParser.symbolicNames; }
	public get ruleNames(): string[] { return ProcessingParser.ruleNames; }
	public get serializedATN(): number[] { return ProcessingParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, ProcessingParser._ATN, ProcessingParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public processingSketch(): ProcessingSketchContext {
		let localctx: ProcessingSketchContext = new ProcessingSketchContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, ProcessingParser.RULE_processingSketch);
		try {
			this.state = 235;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 232;
				this.staticProcessingSketch();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 233;
				this.javaProcessingSketch();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 234;
				this.activeProcessingSketch();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public javaProcessingSketch(): JavaProcessingSketchContext {
		let localctx: JavaProcessingSketchContext = new JavaProcessingSketchContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, ProcessingParser.RULE_javaProcessingSketch);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 238;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				{
				this.state = 237;
				this.packageDeclaration();
				}
				break;
			}
			this.state = 243;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===31) {
				{
				{
				this.state = 240;
				this.importDeclaration();
				}
				}
				this.state = 245;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 247;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 246;
				this.typeDeclaration();
				}
				}
				this.state = 249;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 21004416) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 3297) !== 0) || _la===74 || _la===113);
			this.state = 251;
			this.match(ProcessingParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public staticProcessingSketch(): StaticProcessingSketchContext {
		let localctx: StaticProcessingSketchContext = new StaticProcessingSketchContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, ProcessingParser.RULE_staticProcessingSketch);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 258;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2639974342) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4285792215) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431727) !== 0) || _la===113 || _la===115) {
				{
				this.state = 256;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 4, this._ctx) ) {
				case 1:
					{
					this.state = 253;
					this.importDeclaration();
					}
					break;
				case 2:
					{
					this.state = 254;
					this.blockStatement();
					}
					break;
				case 3:
					{
					this.state = 255;
					this.typeDeclaration();
					}
					break;
				}
				}
				this.state = 260;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 261;
			this.match(ProcessingParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public activeProcessingSketch(): ActiveProcessingSketchContext {
		let localctx: ActiveProcessingSketchContext = new ActiveProcessingSketchContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, ProcessingParser.RULE_activeProcessingSketch);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 267;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2236664450) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 15244751) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 529) !== 0) || _la===113 || _la===115) {
				{
				this.state = 265;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 6, this._ctx) ) {
				case 1:
					{
					this.state = 263;
					this.importDeclaration();
					}
					break;
				case 2:
					{
					this.state = 264;
					this.classBodyDeclaration();
					}
					break;
				}
				}
				this.state = 269;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 270;
			this.match(ProcessingParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public warnMixedModes(): WarnMixedModesContext {
		let localctx: WarnMixedModesContext = new WarnMixedModesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, ProcessingParser.RULE_warnMixedModes);
		let _la: number;
		try {
			let _alt: number;
			this.state = 308;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 277;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						this.state = 275;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
						case 1:
							{
							this.state = 272;
							this.importDeclaration();
							}
							break;
						case 2:
							{
							this.state = 273;
							this.classBodyDeclaration();
							}
							break;
						case 3:
							{
							this.state = 274;
							this.blockStatement();
							}
							break;
						}
						}
					}
					this.state = 279;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
				}
				this.state = 280;
				this.blockStatement();
				this.state = 281;
				this.classBodyDeclaration();
				this.state = 287;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2639974342) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294705119) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431727) !== 0) || _la===113 || _la===115) {
					{
					this.state = 285;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 10, this._ctx) ) {
					case 1:
						{
						this.state = 282;
						this.importDeclaration();
						}
						break;
					case 2:
						{
						this.state = 283;
						this.classBodyDeclaration();
						}
						break;
					case 3:
						{
						this.state = 284;
						this.blockStatement();
						}
						break;
					}
					}
					this.state = 289;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 295;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						this.state = 293;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 12, this._ctx) ) {
						case 1:
							{
							this.state = 290;
							this.importDeclaration();
							}
							break;
						case 2:
							{
							this.state = 291;
							this.classBodyDeclaration();
							}
							break;
						case 3:
							{
							this.state = 292;
							this.blockStatement();
							}
							break;
						}
						}
					}
					this.state = 297;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
				}
				this.state = 298;
				this.classBodyDeclaration();
				this.state = 299;
				this.blockStatement();
				this.state = 305;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2639974342) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294705119) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431727) !== 0) || _la===113 || _la===115) {
					{
					this.state = 303;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
					case 1:
						{
						this.state = 300;
						this.importDeclaration();
						}
						break;
					case 2:
						{
						this.state = 301;
						this.classBodyDeclaration();
						}
						break;
					case 3:
						{
						this.state = 302;
						this.blockStatement();
						}
						break;
					}
					}
					this.state = 307;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		let localctx: VariableDeclaratorIdContext = new VariableDeclaratorIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, ProcessingParser.RULE_variableDeclaratorId);
		let _la: number;
		try {
			this.state = 319;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 310;
				this.warnTypeAsVariableName();
				}
				break;
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 311;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 316;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===72) {
					{
					{
					this.state = 312;
					this.match(ProcessingParser.LBRACK);
					this.state = 313;
					this.match(ProcessingParser.RBRACK);
					}
					}
					this.state = 318;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public warnTypeAsVariableName(): WarnTypeAsVariableNameContext {
		let localctx: WarnTypeAsVariableNameContext = new WarnTypeAsVariableNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, ProcessingParser.RULE_warnTypeAsVariableName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 321;
			localctx._primitiveType = this.primitiveType();
			this.state = 326;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===72) {
				{
				{
				this.state = 322;
				this.match(ProcessingParser.LBRACK);
				this.state = 323;
				this.match(ProcessingParser.RBRACK);
				}
				}
				this.state = 328;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}

			        this.notifyErrorListeners("Type names are not allowed as variable names: "+(localctx._primitiveType != null ? this._input.getText(new Interval(localctx._primitiveType.start, localctx._primitiveType.stop)) : undefined),this.getCurrentToken(),undefined);
			      
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public methodCall(): MethodCallContext {
		let localctx: MethodCallContext = new MethodCallContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, ProcessingParser.RULE_methodCall);
		let _la: number;
		try {
			this.state = 350;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 9:
			case 11:
			case 14:
			case 26:
			case 33:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 331;
				this.functionWithPrimitiveTypeName();
				}
				break;
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 332;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 333;
				this.match(ProcessingParser.LPAREN);
				this.state = 335;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 334;
					this.expressionList();
					}
				}

				this.state = 337;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			case 49:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 338;
				this.match(ProcessingParser.THIS);
				this.state = 339;
				this.match(ProcessingParser.LPAREN);
				this.state = 341;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 340;
					this.expressionList();
					}
				}

				this.state = 343;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			case 46:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 344;
				this.match(ProcessingParser.SUPER);
				this.state = 345;
				this.match(ProcessingParser.LPAREN);
				this.state = 347;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 346;
					this.expressionList();
					}
				}

				this.state = 349;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionWithPrimitiveTypeName(): FunctionWithPrimitiveTypeNameContext {
		let localctx: FunctionWithPrimitiveTypeNameContext = new FunctionWithPrimitiveTypeNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, ProcessingParser.RULE_functionWithPrimitiveTypeName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 352;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 67127810) !== 0) || _la===33)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 353;
			this.match(ProcessingParser.LPAREN);
			this.state = 355;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
				{
				this.state = 354;
				this.expressionList();
				}
			}

			this.state = 357;
			this.match(ProcessingParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public primitiveType(): PrimitiveTypeContext {
		let localctx: PrimitiveTypeContext = new PrimitiveTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, ProcessingParser.RULE_primitiveType);
		try {
			this.state = 368;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 9:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 359;
				this.match(ProcessingParser.BOOLEAN);
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 360;
				this.match(ProcessingParser.CHAR);
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 361;
				this.match(ProcessingParser.BYTE);
				}
				break;
			case 43:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 362;
				this.match(ProcessingParser.SHORT);
				}
				break;
			case 33:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 363;
				this.match(ProcessingParser.INT);
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 364;
				this.match(ProcessingParser.LONG);
				}
				break;
			case 26:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 365;
				this.match(ProcessingParser.FLOAT);
				}
				break;
			case 20:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 366;
				this.match(ProcessingParser.DOUBLE);
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 367;
				this.colorPrimitiveType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public colorPrimitiveType(): ColorPrimitiveTypeContext {
		let localctx: ColorPrimitiveTypeContext = new ColorPrimitiveTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, ProcessingParser.RULE_colorPrimitiveType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 370;
			this.match(ProcessingParser.T__0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedName(): QualifiedNameContext {
		let localctx: QualifiedNameContext = new QualifiedNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, ProcessingParser.RULE_qualifiedName);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 374;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 115:
				{
				this.state = 372;
				this.match(ProcessingParser.IDENTIFIER);
				}
				break;
			case 1:
				{
				this.state = 373;
				this.colorPrimitiveType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 383;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 28, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 376;
					this.match(ProcessingParser.DOT);
					this.state = 379;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 115:
						{
						this.state = 377;
						this.match(ProcessingParser.IDENTIFIER);
						}
						break;
					case 1:
						{
						this.state = 378;
						this.colorPrimitiveType();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					}
				}
				this.state = 385;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 28, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let localctx: LiteralContext = new LiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, ProcessingParser.RULE_literal);
		try {
			this.state = 393;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 58:
			case 59:
			case 60:
			case 61:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 386;
				this.integerLiteral();
				}
				break;
			case 62:
			case 63:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 387;
				this.floatLiteral();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 388;
				this.match(ProcessingParser.CHAR_LITERAL);
				}
				break;
			case 65:
			case 66:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 389;
				this.stringLiteral();
				}
				break;
			case 64:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 390;
				this.match(ProcessingParser.BOOL_LITERAL);
				}
				break;
			case 67:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 391;
				this.match(ProcessingParser.NULL_LITERAL);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 392;
				this.hexColorLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public hexColorLiteral(): HexColorLiteralContext {
		let localctx: HexColorLiteralContext = new HexColorLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, ProcessingParser.RULE_hexColorLiteral);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 395;
			this.match(ProcessingParser.HexColorLiteral);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public compilationUnit(): CompilationUnitContext {
		let localctx: CompilationUnitContext = new CompilationUnitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, ProcessingParser.RULE_compilationUnit);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 398;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 30, this._ctx) ) {
			case 1:
				{
				this.state = 397;
				this.packageDeclaration();
				}
				break;
			}
			this.state = 403;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===31) {
				{
				{
				this.state = 400;
				this.importDeclaration();
				}
				}
				this.state = 405;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 409;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 21004416) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 3297) !== 0) || _la===74 || _la===113) {
				{
				{
				this.state = 406;
				this.typeDeclaration();
				}
				}
				this.state = 411;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 412;
			this.match(ProcessingParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public packageDeclaration(): PackageDeclarationContext {
		let localctx: PackageDeclarationContext = new PackageDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, ProcessingParser.RULE_packageDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 417;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===113) {
				{
				{
				this.state = 414;
				this.annotation();
				}
				}
				this.state = 419;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 420;
			this.match(ProcessingParser.PACKAGE);
			this.state = 421;
			this.qualifiedName();
			this.state = 422;
			this.match(ProcessingParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public importDeclaration(): ImportDeclarationContext {
		let localctx: ImportDeclarationContext = new ImportDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, ProcessingParser.RULE_importDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 424;
			this.match(ProcessingParser.IMPORT);
			this.state = 426;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===44) {
				{
				this.state = 425;
				this.match(ProcessingParser.STATIC);
				}
			}

			this.state = 428;
			this.qualifiedName();
			this.state = 431;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===76) {
				{
				this.state = 429;
				this.match(ProcessingParser.DOT);
				this.state = 430;
				this.match(ProcessingParser.MUL);
				}
			}

			this.state = 433;
			this.match(ProcessingParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeDeclaration(): TypeDeclarationContext {
		let localctx: TypeDeclarationContext = new TypeDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, ProcessingParser.RULE_typeDeclaration);
		try {
			let _alt: number;
			this.state = 448;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 7:
			case 15:
			case 22:
			case 24:
			case 34:
			case 39:
			case 40:
			case 41:
			case 44:
			case 45:
			case 113:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 438;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 435;
						this.classOrInterfaceModifier();
						}
						}
					}
					this.state = 440;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
				}
				this.state = 445;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 15:
					{
					this.state = 441;
					this.classDeclaration();
					}
					break;
				case 22:
					{
					this.state = 442;
					this.enumDeclaration();
					}
					break;
				case 34:
					{
					this.state = 443;
					this.interfaceDeclaration();
					}
					break;
				case 113:
					{
					this.state = 444;
					this.annotationTypeDeclaration();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 447;
				this.match(ProcessingParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public modifier(): ModifierContext {
		let localctx: ModifierContext = new ModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, ProcessingParser.RULE_modifier);
		try {
			this.state = 455;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 7:
			case 24:
			case 39:
			case 40:
			case 41:
			case 44:
			case 45:
			case 113:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 450;
				this.classOrInterfaceModifier();
				}
				break;
			case 36:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 451;
				this.match(ProcessingParser.NATIVE);
				}
				break;
			case 48:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 452;
				this.match(ProcessingParser.SYNCHRONIZED);
				}
				break;
			case 52:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 453;
				this.match(ProcessingParser.TRANSIENT);
				}
				break;
			case 56:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 454;
				this.match(ProcessingParser.VOLATILE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext {
		let localctx: ClassOrInterfaceModifierContext = new ClassOrInterfaceModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, ProcessingParser.RULE_classOrInterfaceModifier);
		try {
			this.state = 465;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 113:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 457;
				this.annotation();
				}
				break;
			case 41:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 458;
				this.match(ProcessingParser.PUBLIC);
				}
				break;
			case 40:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 459;
				this.match(ProcessingParser.PROTECTED);
				}
				break;
			case 39:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 460;
				this.match(ProcessingParser.PRIVATE);
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 461;
				this.match(ProcessingParser.STATIC);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 462;
				this.match(ProcessingParser.ABSTRACT);
				}
				break;
			case 24:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 463;
				this.match(ProcessingParser.FINAL);
				}
				break;
			case 45:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 464;
				this.match(ProcessingParser.STRICTFP);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableModifier(): VariableModifierContext {
		let localctx: VariableModifierContext = new VariableModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, ProcessingParser.RULE_variableModifier);
		try {
			this.state = 469;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 24:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 467;
				this.match(ProcessingParser.FINAL);
				}
				break;
			case 113:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 468;
				this.annotation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classDeclaration(): ClassDeclarationContext {
		let localctx: ClassDeclarationContext = new ClassDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, ProcessingParser.RULE_classDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 471;
			this.match(ProcessingParser.CLASS);
			this.state = 472;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 474;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 473;
				this.typeParameters();
				}
			}

			this.state = 478;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===23) {
				{
				this.state = 476;
				this.match(ProcessingParser.EXTENDS);
				this.state = 477;
				this.typeType();
				}
			}

			this.state = 482;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===30) {
				{
				this.state = 480;
				this.match(ProcessingParser.IMPLEMENTS);
				this.state = 481;
				this.typeList();
				}
			}

			this.state = 484;
			this.classBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameters(): TypeParametersContext {
		let localctx: TypeParametersContext = new TypeParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, ProcessingParser.RULE_typeParameters);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 486;
			this.match(ProcessingParser.LT);
			this.state = 487;
			this.typeParameter();
			this.state = 492;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 488;
				this.match(ProcessingParser.COMMA);
				this.state = 489;
				this.typeParameter();
				}
				}
				this.state = 494;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 495;
			this.match(ProcessingParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameter(): TypeParameterContext {
		let localctx: TypeParameterContext = new TypeParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, ProcessingParser.RULE_typeParameter);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 500;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===113) {
				{
				{
				this.state = 497;
				this.annotation();
				}
				}
				this.state = 502;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 503;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 506;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===23) {
				{
				this.state = 504;
				this.match(ProcessingParser.EXTENDS);
				this.state = 505;
				this.typeBound();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeBound(): TypeBoundContext {
		let localctx: TypeBoundContext = new TypeBoundContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, ProcessingParser.RULE_typeBound);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 508;
			this.typeType();
			this.state = 513;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===96) {
				{
				{
				this.state = 509;
				this.match(ProcessingParser.BITAND);
				this.state = 510;
				this.typeType();
				}
				}
				this.state = 515;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumDeclaration(): EnumDeclarationContext {
		let localctx: EnumDeclarationContext = new EnumDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, ProcessingParser.RULE_enumDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 516;
			this.match(ProcessingParser.ENUM);
			this.state = 517;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 520;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===30) {
				{
				this.state = 518;
				this.match(ProcessingParser.IMPLEMENTS);
				this.state = 519;
				this.typeList();
				}
			}

			this.state = 522;
			this.match(ProcessingParser.LBRACE);
			this.state = 524;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===113 || _la===115) {
				{
				this.state = 523;
				this.enumConstants();
				}
			}

			this.state = 527;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===75) {
				{
				this.state = 526;
				this.match(ProcessingParser.COMMA);
				}
			}

			this.state = 530;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===74) {
				{
				this.state = 529;
				this.enumBodyDeclarations();
				}
			}

			this.state = 532;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumConstants(): EnumConstantsContext {
		let localctx: EnumConstantsContext = new EnumConstantsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, ProcessingParser.RULE_enumConstants);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 534;
			this.enumConstant();
			this.state = 539;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 53, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 535;
					this.match(ProcessingParser.COMMA);
					this.state = 536;
					this.enumConstant();
					}
					}
				}
				this.state = 541;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 53, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumConstant(): EnumConstantContext {
		let localctx: EnumConstantContext = new EnumConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, ProcessingParser.RULE_enumConstant);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 545;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===113) {
				{
				{
				this.state = 542;
				this.annotation();
				}
				}
				this.state = 547;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 548;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 550;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===68) {
				{
				this.state = 549;
				this.arguments();
				}
			}

			this.state = 553;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===70) {
				{
				this.state = 552;
				this.classBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumBodyDeclarations(): EnumBodyDeclarationsContext {
		let localctx: EnumBodyDeclarationsContext = new EnumBodyDeclarationsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, ProcessingParser.RULE_enumBodyDeclarations);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 555;
			this.match(ProcessingParser.SEMI);
			this.state = 559;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2236664450) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 15244751) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 529) !== 0) || _la===113 || _la===115) {
				{
				{
				this.state = 556;
				this.classBodyDeclaration();
				}
				}
				this.state = 561;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceDeclaration(): InterfaceDeclarationContext {
		let localctx: InterfaceDeclarationContext = new InterfaceDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, ProcessingParser.RULE_interfaceDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 562;
			this.match(ProcessingParser.INTERFACE);
			this.state = 563;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 565;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 564;
				this.typeParameters();
				}
			}

			this.state = 569;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===23) {
				{
				this.state = 567;
				this.match(ProcessingParser.EXTENDS);
				this.state = 568;
				this.typeList();
				}
			}

			this.state = 571;
			this.interfaceBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classBody(): ClassBodyContext {
		let localctx: ClassBodyContext = new ClassBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, ProcessingParser.RULE_classBody);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 573;
			this.match(ProcessingParser.LBRACE);
			this.state = 577;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2236664450) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 15244751) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 529) !== 0) || _la===113 || _la===115) {
				{
				{
				this.state = 574;
				this.classBodyDeclaration();
				}
				}
				this.state = 579;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 580;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceBody(): InterfaceBodyContext {
		let localctx: InterfaceBodyContext = new InterfaceBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, ProcessingParser.RULE_interfaceBody);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 582;
			this.match(ProcessingParser.LBRACE);
			this.state = 586;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 89442946) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 15244751) !== 0) || _la===74 || _la===79 || _la===113 || _la===115) {
				{
				{
				this.state = 583;
				this.interfaceBodyDeclaration();
				}
				}
				this.state = 588;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 589;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classBodyDeclaration(): ClassBodyDeclarationContext {
		let localctx: ClassBodyDeclarationContext = new ClassBodyDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, ProcessingParser.RULE_classBodyDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.state = 604;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 64, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 591;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 592;
				this.importDeclaration();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 594;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===44) {
					{
					this.state = 593;
					this.match(ProcessingParser.STATIC);
					}
				}

				this.state = 596;
				this.block();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 600;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 597;
						this.modifier();
						}
						}
					}
					this.state = 602;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
				}
				this.state = 603;
				this.memberDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public memberDeclaration(): MemberDeclarationContext {
		let localctx: MemberDeclarationContext = new MemberDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, ProcessingParser.RULE_memberDeclaration);
		try {
			this.state = 615;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 65, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 606;
				this.methodDeclaration();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 607;
				this.genericMethodDeclaration();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 608;
				this.fieldDeclaration();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 609;
				this.constructorDeclaration();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 610;
				this.genericConstructorDeclaration();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 611;
				this.interfaceDeclaration();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 612;
				this.annotationTypeDeclaration();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 613;
				this.classDeclaration();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 614;
				this.enumDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public methodDeclaration(): MethodDeclarationContext {
		let localctx: MethodDeclarationContext = new MethodDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, ProcessingParser.RULE_methodDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 617;
			this.typeTypeOrVoid();
			this.state = 618;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 619;
			this.formalParameters();
			this.state = 624;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===72) {
				{
				{
				this.state = 620;
				this.match(ProcessingParser.LBRACK);
				this.state = 621;
				this.match(ProcessingParser.RBRACK);
				}
				}
				this.state = 626;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 629;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===51) {
				{
				this.state = 627;
				this.match(ProcessingParser.THROWS);
				this.state = 628;
				this.qualifiedNameList();
				}
			}

			this.state = 631;
			this.methodBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public methodBody(): MethodBodyContext {
		let localctx: MethodBodyContext = new MethodBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, ProcessingParser.RULE_methodBody);
		try {
			this.state = 635;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 70:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 633;
				this.block();
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 634;
				this.match(ProcessingParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		let localctx: TypeTypeOrVoidContext = new TypeTypeOrVoidContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, ProcessingParser.RULE_typeTypeOrVoid);
		try {
			this.state = 639;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
			case 54:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 637;
				this.typeType();
				}
				break;
			case 55:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 638;
				this.match(ProcessingParser.VOID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genericMethodDeclaration(): GenericMethodDeclarationContext {
		let localctx: GenericMethodDeclarationContext = new GenericMethodDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, ProcessingParser.RULE_genericMethodDeclaration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 641;
			this.typeParameters();
			this.state = 642;
			this.methodDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genericConstructorDeclaration(): GenericConstructorDeclarationContext {
		let localctx: GenericConstructorDeclarationContext = new GenericConstructorDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, ProcessingParser.RULE_genericConstructorDeclaration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 644;
			this.typeParameters();
			this.state = 645;
			this.constructorDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constructorDeclaration(): ConstructorDeclarationContext {
		let localctx: ConstructorDeclarationContext = new ConstructorDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, ProcessingParser.RULE_constructorDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 647;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 648;
			this.formalParameters();
			this.state = 651;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===51) {
				{
				this.state = 649;
				this.match(ProcessingParser.THROWS);
				this.state = 650;
				this.qualifiedNameList();
				}
			}

			this.state = 653;
			localctx._constructorBody = this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldDeclaration(): FieldDeclarationContext {
		let localctx: FieldDeclarationContext = new FieldDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, ProcessingParser.RULE_fieldDeclaration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 655;
			this.typeType();
			this.state = 656;
			this.variableDeclarators();
			this.state = 657;
			this.match(ProcessingParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceBodyDeclaration(): InterfaceBodyDeclarationContext {
		let localctx: InterfaceBodyDeclarationContext = new InterfaceBodyDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, ProcessingParser.RULE_interfaceBodyDeclaration);
		try {
			let _alt: number;
			this.state = 667;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 7:
			case 9:
			case 11:
			case 14:
			case 15:
			case 18:
			case 20:
			case 22:
			case 24:
			case 26:
			case 33:
			case 34:
			case 35:
			case 36:
			case 39:
			case 40:
			case 41:
			case 43:
			case 44:
			case 45:
			case 48:
			case 52:
			case 54:
			case 55:
			case 56:
			case 79:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 662;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 71, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 659;
						this.modifier();
						}
						}
					}
					this.state = 664;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 71, this._ctx);
				}
				this.state = 665;
				this.interfaceMemberDeclaration();
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 666;
				this.match(ProcessingParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext {
		let localctx: InterfaceMemberDeclarationContext = new InterfaceMemberDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, ProcessingParser.RULE_interfaceMemberDeclaration);
		try {
			this.state = 676;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 669;
				this.constDeclaration();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 670;
				this.interfaceMethodDeclaration();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 671;
				this.genericInterfaceMethodDeclaration();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 672;
				this.interfaceDeclaration();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 673;
				this.annotationTypeDeclaration();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 674;
				this.classDeclaration();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 675;
				this.enumDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constDeclaration(): ConstDeclarationContext {
		let localctx: ConstDeclarationContext = new ConstDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, ProcessingParser.RULE_constDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 678;
			this.typeType();
			this.state = 679;
			this.constantDeclarator();
			this.state = 684;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 680;
				this.match(ProcessingParser.COMMA);
				this.state = 681;
				this.constantDeclarator();
				}
				}
				this.state = 686;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 687;
			this.match(ProcessingParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constantDeclarator(): ConstantDeclaratorContext {
		let localctx: ConstantDeclaratorContext = new ConstantDeclaratorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, ProcessingParser.RULE_constantDeclarator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 689;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 694;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===72) {
				{
				{
				this.state = 690;
				this.match(ProcessingParser.LBRACK);
				this.state = 691;
				this.match(ProcessingParser.RBRACK);
				}
				}
				this.state = 696;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 697;
			this.match(ProcessingParser.ASSIGN);
			this.state = 698;
			this.variableInitializer();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext {
		let localctx: InterfaceMethodDeclarationContext = new InterfaceMethodDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, ProcessingParser.RULE_interfaceMethodDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 703;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 700;
					this.interfaceMethodModifier();
					}
					}
				}
				this.state = 705;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
			}
			this.state = 716;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
			case 54:
			case 55:
			case 113:
			case 115:
				{
				this.state = 706;
				this.typeTypeOrVoid();
				}
				break;
			case 79:
				{
				this.state = 707;
				this.typeParameters();
				this.state = 711;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 77, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 708;
						this.annotation();
						}
						}
					}
					this.state = 713;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 77, this._ctx);
				}
				this.state = 714;
				this.typeTypeOrVoid();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 718;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 719;
			this.formalParameters();
			this.state = 724;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===72) {
				{
				{
				this.state = 720;
				this.match(ProcessingParser.LBRACK);
				this.state = 721;
				this.match(ProcessingParser.RBRACK);
				}
				}
				this.state = 726;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 729;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===51) {
				{
				this.state = 727;
				this.match(ProcessingParser.THROWS);
				this.state = 728;
				this.qualifiedNameList();
				}
			}

			this.state = 731;
			this.methodBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interfaceMethodModifier(): InterfaceMethodModifierContext {
		let localctx: InterfaceMethodModifierContext = new InterfaceMethodModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, ProcessingParser.RULE_interfaceMethodModifier);
		try {
			this.state = 739;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 113:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 733;
				this.annotation();
				}
				break;
			case 41:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 734;
				this.match(ProcessingParser.PUBLIC);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 735;
				this.match(ProcessingParser.ABSTRACT);
				}
				break;
			case 18:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 736;
				this.match(ProcessingParser.DEFAULT);
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 737;
				this.match(ProcessingParser.STATIC);
				}
				break;
			case 45:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 738;
				this.match(ProcessingParser.STRICTFP);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext {
		let localctx: GenericInterfaceMethodDeclarationContext = new GenericInterfaceMethodDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, ProcessingParser.RULE_genericInterfaceMethodDeclaration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 741;
			this.typeParameters();
			this.state = 742;
			this.interfaceMethodDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableDeclarators(): VariableDeclaratorsContext {
		let localctx: VariableDeclaratorsContext = new VariableDeclaratorsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, ProcessingParser.RULE_variableDeclarators);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 744;
			this.variableDeclarator();
			this.state = 749;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 745;
				this.match(ProcessingParser.COMMA);
				this.state = 746;
				this.variableDeclarator();
				}
				}
				this.state = 751;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableDeclarator(): VariableDeclaratorContext {
		let localctx: VariableDeclaratorContext = new VariableDeclaratorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, ProcessingParser.RULE_variableDeclarator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 752;
			this.variableDeclaratorId();
			this.state = 755;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===77) {
				{
				this.state = 753;
				this.match(ProcessingParser.ASSIGN);
				this.state = 754;
				this.variableInitializer();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableInitializer(): VariableInitializerContext {
		let localctx: VariableInitializerContext = new VariableInitializerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, ProcessingParser.RULE_variableInitializer);
		try {
			this.state = 759;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 70:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 757;
				this.arrayInitializer();
				}
				break;
			case 1:
			case 2:
			case 6:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 37:
			case 43:
			case 46:
			case 49:
			case 54:
			case 55:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 79:
			case 80:
			case 81:
			case 90:
			case 91:
			case 92:
			case 93:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 758;
				this.expression(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public arrayInitializer(): ArrayInitializerContext {
		let localctx: ArrayInitializerContext = new ArrayInitializerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, ProcessingParser.RULE_arrayInitializer);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 761;
			this.match(ProcessingParser.LBRACE);
			this.state = 773;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431215) !== 0) || _la===113 || _la===115) {
				{
				this.state = 762;
				this.variableInitializer();
				this.state = 767;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 763;
						this.match(ProcessingParser.COMMA);
						this.state = 764;
						this.variableInitializer();
						}
						}
					}
					this.state = 769;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
				}
				this.state = 771;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===75) {
					{
					this.state = 770;
					this.match(ProcessingParser.COMMA);
					}
				}

				}
			}

			this.state = 775;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classOrInterfaceType(): ClassOrInterfaceTypeContext {
		let localctx: ClassOrInterfaceTypeContext = new ClassOrInterfaceTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, ProcessingParser.RULE_classOrInterfaceType);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 777;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 779;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 88, this._ctx) ) {
			case 1:
				{
				this.state = 778;
				this.typeArguments();
				}
				break;
			}
			this.state = 788;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 90, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 781;
					this.match(ProcessingParser.DOT);
					this.state = 782;
					this.match(ProcessingParser.IDENTIFIER);
					this.state = 784;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 89, this._ctx) ) {
					case 1:
						{
						this.state = 783;
						this.typeArguments();
						}
						break;
					}
					}
					}
				}
				this.state = 790;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 90, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeArgument(): TypeArgumentContext {
		let localctx: TypeArgumentContext = new TypeArgumentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, ProcessingParser.RULE_typeArgument);
		let _la: number;
		try {
			this.state = 797;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
			case 54:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 791;
				this.typeType();
				}
				break;
			case 82:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 792;
				this.match(ProcessingParser.QUESTION);
				this.state = 795;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===23 || _la===46) {
					{
					this.state = 793;
					_la = this._input.LA(1);
					if(!(_la===23 || _la===46)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					this.state = 794;
					this.typeType();
					}
				}

				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedNameList(): QualifiedNameListContext {
		let localctx: QualifiedNameListContext = new QualifiedNameListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, ProcessingParser.RULE_qualifiedNameList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 799;
			this.qualifiedName();
			this.state = 804;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 800;
				this.match(ProcessingParser.COMMA);
				this.state = 801;
				this.qualifiedName();
				}
				}
				this.state = 806;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public formalParameters(): FormalParametersContext {
		let localctx: FormalParametersContext = new FormalParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, ProcessingParser.RULE_formalParameters);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 807;
			this.match(ProcessingParser.LPAREN);
			this.state = 809;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 84953602) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 2098181) !== 0) || _la===113 || _la===115) {
				{
				this.state = 808;
				this.formalParameterList();
				}
			}

			this.state = 811;
			this.match(ProcessingParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public formalParameterList(): FormalParameterListContext {
		let localctx: FormalParameterListContext = new FormalParameterListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, ProcessingParser.RULE_formalParameterList);
		let _la: number;
		try {
			let _alt: number;
			this.state = 826;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 97, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 813;
				this.formalParameter();
				this.state = 818;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 95, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 814;
						this.match(ProcessingParser.COMMA);
						this.state = 815;
						this.formalParameter();
						}
						}
					}
					this.state = 820;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 95, this._ctx);
				}
				this.state = 823;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===75) {
					{
					this.state = 821;
					this.match(ProcessingParser.COMMA);
					this.state = 822;
					this.lastFormalParameter();
					}
				}

				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 825;
				this.lastFormalParameter();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public formalParameter(): FormalParameterContext {
		let localctx: FormalParameterContext = new FormalParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, ProcessingParser.RULE_formalParameter);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 831;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 828;
					this.variableModifier();
					}
					}
				}
				this.state = 833;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
			}
			this.state = 834;
			this.typeType();
			this.state = 835;
			this.variableDeclaratorId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lastFormalParameter(): LastFormalParameterContext {
		let localctx: LastFormalParameterContext = new LastFormalParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, ProcessingParser.RULE_lastFormalParameter);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 840;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 837;
					this.variableModifier();
					}
					}
				}
				this.state = 842;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
			}
			this.state = 843;
			this.typeType();
			this.state = 844;
			this.match(ProcessingParser.ELLIPSIS);
			this.state = 845;
			this.variableDeclaratorId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public baseStringLiteral(): BaseStringLiteralContext {
		let localctx: BaseStringLiteralContext = new BaseStringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, ProcessingParser.RULE_baseStringLiteral);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 847;
			this.match(ProcessingParser.STRING_LITERAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multilineStringLiteral(): MultilineStringLiteralContext {
		let localctx: MultilineStringLiteralContext = new MultilineStringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, ProcessingParser.RULE_multilineStringLiteral);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 849;
			this.match(ProcessingParser.MULTI_STRING_LIT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stringLiteral(): StringLiteralContext {
		let localctx: StringLiteralContext = new StringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, ProcessingParser.RULE_stringLiteral);
		try {
			this.state = 853;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 65:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 851;
				this.baseStringLiteral();
				}
				break;
			case 66:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 852;
				this.multilineStringLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public integerLiteral(): IntegerLiteralContext {
		let localctx: IntegerLiteralContext = new IntegerLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, ProcessingParser.RULE_integerLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 855;
			_la = this._input.LA(1);
			if(!(((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & 15) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public floatLiteral(): FloatLiteralContext {
		let localctx: FloatLiteralContext = new FloatLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, ProcessingParser.RULE_floatLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 857;
			_la = this._input.LA(1);
			if(!(_la===62 || _la===63)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotation(): AnnotationContext {
		let localctx: AnnotationContext = new AnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, ProcessingParser.RULE_annotation);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 859;
			this.match(ProcessingParser.AT);
			this.state = 860;
			this.qualifiedName();
			this.state = 867;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===68) {
				{
				this.state = 861;
				this.match(ProcessingParser.LPAREN);
				this.state = 864;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 101, this._ctx) ) {
				case 1:
					{
					this.state = 862;
					this.elementValuePairs();
					}
					break;
				case 2:
					{
					this.state = 863;
					this.elementValue();
					}
					break;
				}
				this.state = 866;
				this.match(ProcessingParser.RPAREN);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementValuePairs(): ElementValuePairsContext {
		let localctx: ElementValuePairsContext = new ElementValuePairsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, ProcessingParser.RULE_elementValuePairs);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 869;
			this.elementValuePair();
			this.state = 874;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 870;
				this.match(ProcessingParser.COMMA);
				this.state = 871;
				this.elementValuePair();
				}
				}
				this.state = 876;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementValuePair(): ElementValuePairContext {
		let localctx: ElementValuePairContext = new ElementValuePairContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, ProcessingParser.RULE_elementValuePair);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 877;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 878;
			this.match(ProcessingParser.ASSIGN);
			this.state = 879;
			this.elementValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementValue(): ElementValueContext {
		let localctx: ElementValueContext = new ElementValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, ProcessingParser.RULE_elementValue);
		try {
			this.state = 884;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 104, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 881;
				this.expression(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 882;
				this.annotation();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 883;
				this.elementValueArrayInitializer();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementValueArrayInitializer(): ElementValueArrayInitializerContext {
		let localctx: ElementValueArrayInitializerContext = new ElementValueArrayInitializerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, ProcessingParser.RULE_elementValueArrayInitializer);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 886;
			this.match(ProcessingParser.LBRACE);
			this.state = 895;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431215) !== 0) || _la===113 || _la===115) {
				{
				this.state = 887;
				this.elementValue();
				this.state = 892;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 888;
						this.match(ProcessingParser.COMMA);
						this.state = 889;
						this.elementValue();
						}
						}
					}
					this.state = 894;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
				}
				}
			}

			this.state = 898;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===75) {
				{
				this.state = 897;
				this.match(ProcessingParser.COMMA);
				}
			}

			this.state = 900;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		let localctx: AnnotationTypeDeclarationContext = new AnnotationTypeDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, ProcessingParser.RULE_annotationTypeDeclaration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 902;
			this.match(ProcessingParser.AT);
			this.state = 903;
			this.match(ProcessingParser.INTERFACE);
			this.state = 904;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 905;
			this.annotationTypeBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationTypeBody(): AnnotationTypeBodyContext {
		let localctx: AnnotationTypeBodyContext = new AnnotationTypeBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, ProcessingParser.RULE_annotationTypeBody);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 907;
			this.match(ProcessingParser.LBRACE);
			this.state = 911;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 89180802) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 11050447) !== 0) || _la===74 || _la===113 || _la===115) {
				{
				{
				this.state = 908;
				this.annotationTypeElementDeclaration();
				}
				}
				this.state = 913;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 914;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext {
		let localctx: AnnotationTypeElementDeclarationContext = new AnnotationTypeElementDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, ProcessingParser.RULE_annotationTypeElementDeclaration);
		try {
			let _alt: number;
			this.state = 924;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 7:
			case 9:
			case 11:
			case 14:
			case 15:
			case 20:
			case 22:
			case 24:
			case 26:
			case 33:
			case 34:
			case 35:
			case 36:
			case 39:
			case 40:
			case 41:
			case 43:
			case 44:
			case 45:
			case 48:
			case 52:
			case 54:
			case 56:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 919;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 109, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 916;
						this.modifier();
						}
						}
					}
					this.state = 921;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 109, this._ctx);
				}
				this.state = 922;
				this.annotationTypeElementRest();
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 923;
				this.match(ProcessingParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationTypeElementRest(): AnnotationTypeElementRestContext {
		let localctx: AnnotationTypeElementRestContext = new AnnotationTypeElementRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, ProcessingParser.RULE_annotationTypeElementRest);
		try {
			this.state = 946;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 926;
				this.typeType();
				this.state = 927;
				this.annotationMethodOrConstantRest();
				this.state = 928;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 930;
				this.classDeclaration();
				this.state = 932;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 111, this._ctx) ) {
				case 1:
					{
					this.state = 931;
					this.match(ProcessingParser.SEMI);
					}
					break;
				}
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 934;
				this.interfaceDeclaration();
				this.state = 936;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 112, this._ctx) ) {
				case 1:
					{
					this.state = 935;
					this.match(ProcessingParser.SEMI);
					}
					break;
				}
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 938;
				this.enumDeclaration();
				this.state = 940;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 113, this._ctx) ) {
				case 1:
					{
					this.state = 939;
					this.match(ProcessingParser.SEMI);
					}
					break;
				}
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 942;
				this.annotationTypeDeclaration();
				this.state = 944;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 114, this._ctx) ) {
				case 1:
					{
					this.state = 943;
					this.match(ProcessingParser.SEMI);
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext {
		let localctx: AnnotationMethodOrConstantRestContext = new AnnotationMethodOrConstantRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, ProcessingParser.RULE_annotationMethodOrConstantRest);
		try {
			this.state = 950;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 948;
				this.annotationMethodRest();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 949;
				this.annotationConstantRest();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationMethodRest(): AnnotationMethodRestContext {
		let localctx: AnnotationMethodRestContext = new AnnotationMethodRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, ProcessingParser.RULE_annotationMethodRest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 952;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 953;
			this.match(ProcessingParser.LPAREN);
			this.state = 954;
			this.match(ProcessingParser.RPAREN);
			this.state = 956;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===18) {
				{
				this.state = 955;
				this.defaultValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationConstantRest(): AnnotationConstantRestContext {
		let localctx: AnnotationConstantRestContext = new AnnotationConstantRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, ProcessingParser.RULE_annotationConstantRest);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 958;
			this.variableDeclarators();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public defaultValue(): DefaultValueContext {
		let localctx: DefaultValueContext = new DefaultValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, ProcessingParser.RULE_defaultValue);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 960;
			this.match(ProcessingParser.DEFAULT);
			this.state = 961;
			this.elementValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let localctx: BlockContext = new BlockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, ProcessingParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 963;
			this.match(ProcessingParser.LBRACE);
			this.state = 967;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 488296390) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4285792215) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431727) !== 0) || _la===113 || _la===115) {
				{
				{
				this.state = 964;
				this.blockStatement();
				}
				}
				this.state = 969;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 970;
			this.match(ProcessingParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public blockStatement(): BlockStatementContext {
		let localctx: BlockStatementContext = new BlockStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, ProcessingParser.RULE_blockStatement);
		try {
			this.state = 977;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 119, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 972;
				this.localVariableDeclaration();
				this.state = 973;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 975;
				this.statement();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 976;
				this.localTypeDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localVariableDeclaration(): LocalVariableDeclarationContext {
		let localctx: LocalVariableDeclarationContext = new LocalVariableDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, ProcessingParser.RULE_localVariableDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 982;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 120, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 979;
					this.variableModifier();
					}
					}
				}
				this.state = 984;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 120, this._ctx);
			}
			this.state = 985;
			this.typeType();
			this.state = 986;
			this.variableDeclarators();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localTypeDeclaration(): LocalTypeDeclarationContext {
		let localctx: LocalTypeDeclarationContext = new LocalTypeDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, ProcessingParser.RULE_localTypeDeclaration);
		let _la: number;
		try {
			this.state = 999;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 7:
			case 15:
			case 24:
			case 34:
			case 39:
			case 40:
			case 41:
			case 44:
			case 45:
			case 113:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 991;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===7 || _la===24 || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 103) !== 0) || _la===113) {
					{
					{
					this.state = 988;
					this.classOrInterfaceModifier();
					}
					}
					this.state = 993;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 996;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 15:
					{
					this.state = 994;
					this.classDeclaration();
					}
					break;
				case 34:
					{
					this.state = 995;
					this.interfaceDeclaration();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 998;
				this.match(ProcessingParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let localctx: StatementContext = new StatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, ProcessingParser.RULE_statement);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1105;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 136, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1001;
				localctx._blockLabel = this.block();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1002;
				this.match(ProcessingParser.ASSERT);
				this.state = 1003;
				this.expression(0);
				this.state = 1006;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===83) {
					{
					this.state = 1004;
					this.match(ProcessingParser.COLON);
					this.state = 1005;
					this.expression(0);
					}
				}

				this.state = 1008;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1010;
				this.match(ProcessingParser.IF);
				this.state = 1011;
				this.parExpression();
				this.state = 1012;
				this.statement();
				this.state = 1015;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 125, this._ctx) ) {
				case 1:
					{
					this.state = 1013;
					this.match(ProcessingParser.ELSE);
					this.state = 1014;
					this.statement();
					}
					break;
				}
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1017;
				this.match(ProcessingParser.FOR);
				this.state = 1018;
				this.match(ProcessingParser.LPAREN);
				this.state = 1019;
				this.forControl();
				this.state = 1020;
				this.match(ProcessingParser.RPAREN);
				this.state = 1021;
				this.statement();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1023;
				this.match(ProcessingParser.WHILE);
				this.state = 1024;
				this.parExpression();
				this.state = 1025;
				this.statement();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1027;
				this.match(ProcessingParser.DO);
				this.state = 1028;
				this.statement();
				this.state = 1029;
				this.match(ProcessingParser.WHILE);
				this.state = 1030;
				this.parExpression();
				this.state = 1031;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1033;
				this.match(ProcessingParser.TRY);
				this.state = 1034;
				this.block();
				this.state = 1044;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 13:
					{
					this.state = 1036;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					do {
						{
						{
						this.state = 1035;
						this.catchClause();
						}
						}
						this.state = 1038;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					} while (_la===13);
					this.state = 1041;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===25) {
						{
						this.state = 1040;
						this.finallyBlock();
						}
					}

					}
					break;
				case 25:
					{
					this.state = 1043;
					this.finallyBlock();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1046;
				this.match(ProcessingParser.TRY);
				this.state = 1047;
				this.resourceSpecification();
				this.state = 1048;
				this.block();
				this.state = 1052;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===13) {
					{
					{
					this.state = 1049;
					this.catchClause();
					}
					}
					this.state = 1054;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1056;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===25) {
					{
					this.state = 1055;
					this.finallyBlock();
					}
				}

				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 1058;
				this.match(ProcessingParser.SWITCH);
				this.state = 1059;
				this.parExpression();
				this.state = 1060;
				this.match(ProcessingParser.LBRACE);
				this.state = 1064;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 131, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1061;
						this.switchBlockStatementGroup();
						}
						}
					}
					this.state = 1066;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 131, this._ctx);
				}
				this.state = 1070;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===12 || _la===18) {
					{
					{
					this.state = 1067;
					this.switchLabel();
					}
					}
					this.state = 1072;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1073;
				this.match(ProcessingParser.RBRACE);
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 1075;
				this.match(ProcessingParser.SYNCHRONIZED);
				this.state = 1076;
				this.parExpression();
				this.state = 1077;
				this.block();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 1079;
				this.match(ProcessingParser.RETURN);
				this.state = 1081;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 1080;
					this.expression(0);
					}
				}

				this.state = 1083;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 1084;
				this.match(ProcessingParser.THROW);
				this.state = 1085;
				this.expression(0);
				this.state = 1086;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 1088;
				this.match(ProcessingParser.BREAK);
				this.state = 1090;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===115) {
					{
					this.state = 1089;
					this.match(ProcessingParser.IDENTIFIER);
					}
				}

				this.state = 1092;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 1093;
				this.match(ProcessingParser.CONTINUE);
				this.state = 1095;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===115) {
					{
					this.state = 1094;
					this.match(ProcessingParser.IDENTIFIER);
					}
				}

				this.state = 1097;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 15:
				this.enterOuterAlt(localctx, 15);
				{
				this.state = 1098;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 16:
				this.enterOuterAlt(localctx, 16);
				{
				this.state = 1099;
				localctx._statementExpression = this.expression(0);
				this.state = 1100;
				this.match(ProcessingParser.SEMI);
				}
				break;
			case 17:
				this.enterOuterAlt(localctx, 17);
				{
				this.state = 1102;
				localctx._identifierLabel = this.match(ProcessingParser.IDENTIFIER);
				this.state = 1103;
				this.match(ProcessingParser.COLON);
				this.state = 1104;
				this.statement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public catchClause(): CatchClauseContext {
		let localctx: CatchClauseContext = new CatchClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, ProcessingParser.RULE_catchClause);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1107;
			this.match(ProcessingParser.CATCH);
			this.state = 1108;
			this.match(ProcessingParser.LPAREN);
			this.state = 1112;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===24 || _la===113) {
				{
				{
				this.state = 1109;
				this.variableModifier();
				}
				}
				this.state = 1114;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1115;
			this.catchType();
			this.state = 1116;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 1117;
			this.match(ProcessingParser.RPAREN);
			this.state = 1118;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public catchType(): CatchTypeContext {
		let localctx: CatchTypeContext = new CatchTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, ProcessingParser.RULE_catchType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1120;
			this.qualifiedName();
			this.state = 1125;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===97) {
				{
				{
				this.state = 1121;
				this.match(ProcessingParser.BITOR);
				this.state = 1122;
				this.qualifiedName();
				}
				}
				this.state = 1127;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public finallyBlock(): FinallyBlockContext {
		let localctx: FinallyBlockContext = new FinallyBlockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, ProcessingParser.RULE_finallyBlock);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1128;
			this.match(ProcessingParser.FINALLY);
			this.state = 1129;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resourceSpecification(): ResourceSpecificationContext {
		let localctx: ResourceSpecificationContext = new ResourceSpecificationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, ProcessingParser.RULE_resourceSpecification);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1131;
			this.match(ProcessingParser.LPAREN);
			this.state = 1132;
			this.resources();
			this.state = 1134;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===74) {
				{
				this.state = 1133;
				this.match(ProcessingParser.SEMI);
				}
			}

			this.state = 1136;
			this.match(ProcessingParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resources(): ResourcesContext {
		let localctx: ResourcesContext = new ResourcesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, ProcessingParser.RULE_resources);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1138;
			this.resource();
			this.state = 1143;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 140, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1139;
					this.match(ProcessingParser.SEMI);
					this.state = 1140;
					this.resource();
					}
					}
				}
				this.state = 1145;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 140, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resource(): ResourceContext {
		let localctx: ResourceContext = new ResourceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, ProcessingParser.RULE_resource);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1149;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===24 || _la===113) {
				{
				{
				this.state = 1146;
				this.variableModifier();
				}
				}
				this.state = 1151;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1152;
			this.classOrInterfaceType();
			this.state = 1153;
			this.variableDeclaratorId();
			this.state = 1154;
			this.match(ProcessingParser.ASSIGN);
			this.state = 1155;
			this.expression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public switchBlockStatementGroup(): SwitchBlockStatementGroupContext {
		let localctx: SwitchBlockStatementGroupContext = new SwitchBlockStatementGroupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, ProcessingParser.RULE_switchBlockStatementGroup);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1158;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1157;
				this.switchLabel();
				}
				}
				this.state = 1160;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===12 || _la===18);
			this.state = 1163;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1162;
				this.blockStatement();
				}
				}
				this.state = 1165;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 488296390) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4285792215) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431727) !== 0) || _la===113 || _la===115);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public switchLabel(): SwitchLabelContext {
		let localctx: SwitchLabelContext = new SwitchLabelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, ProcessingParser.RULE_switchLabel);
		try {
			this.state = 1175;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 12:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1167;
				this.match(ProcessingParser.CASE);
				this.state = 1170;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 144, this._ctx) ) {
				case 1:
					{
					this.state = 1168;
					localctx._constantExpression = this.expression(0);
					}
					break;
				case 2:
					{
					this.state = 1169;
					localctx._enumConstantName = this.match(ProcessingParser.IDENTIFIER);
					}
					break;
				}
				this.state = 1172;
				this.match(ProcessingParser.COLON);
				}
				break;
			case 18:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1173;
				this.match(ProcessingParser.DEFAULT);
				this.state = 1174;
				this.match(ProcessingParser.COLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forControl(): ForControlContext {
		let localctx: ForControlContext = new ForControlContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, ProcessingParser.RULE_forControl);
		let _la: number;
		try {
			this.state = 1189;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 149, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1177;
				this.enhancedForControl();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 84953670) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 1178;
					this.forInit();
					}
				}

				this.state = 1181;
				this.match(ProcessingParser.SEMI);
				this.state = 1183;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 1182;
					this.expression(0);
					}
				}

				this.state = 1185;
				this.match(ProcessingParser.SEMI);
				this.state = 1187;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
					{
					this.state = 1186;
					localctx._forUpdate = this.expressionList();
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forInit(): ForInitContext {
		let localctx: ForInitContext = new ForInitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, ProcessingParser.RULE_forInit);
		try {
			this.state = 1193;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 150, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1191;
				this.localVariableDeclaration();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1192;
				this.expressionList();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enhancedForControl(): EnhancedForControlContext {
		let localctx: EnhancedForControlContext = new EnhancedForControlContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, ProcessingParser.RULE_enhancedForControl);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1198;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 151, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1195;
					this.variableModifier();
					}
					}
				}
				this.state = 1200;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 151, this._ctx);
			}
			this.state = 1201;
			this.typeType();
			this.state = 1202;
			this.variableDeclaratorId();
			this.state = 1203;
			this.match(ProcessingParser.COLON);
			this.state = 1204;
			this.expression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parExpression(): ParExpressionContext {
		let localctx: ParExpressionContext = new ParExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, ProcessingParser.RULE_parExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1206;
			this.match(ProcessingParser.LPAREN);
			this.state = 1207;
			this.expression(0);
			this.state = 1208;
			this.match(ProcessingParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expressionList(): ExpressionListContext {
		let localctx: ExpressionListContext = new ExpressionListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, ProcessingParser.RULE_expressionList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1210;
			this.expression(0);
			this.state = 1215;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 1211;
				this.match(ProcessingParser.COMMA);
				this.state = 1212;
				this.expression(0);
				}
				}
				this.state = 1217;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, _parentState);
		let _prevctx: ExpressionContext = localctx;
		let _startState: number = 190;
		this.enterRecursionRule(localctx, 190, ProcessingParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1249;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 156, this._ctx) ) {
			case 1:
				{
				this.state = 1219;
				this.primary();
				}
				break;
			case 2:
				{
				this.state = 1220;
				this.methodCall();
				}
				break;
			case 3:
				{
				this.state = 1221;
				this.match(ProcessingParser.NEW);
				this.state = 1222;
				this.creator();
				}
				break;
			case 4:
				{
				this.state = 1223;
				this.match(ProcessingParser.LPAREN);
				this.state = 1224;
				this.typeType();
				this.state = 1225;
				this.match(ProcessingParser.RPAREN);
				this.state = 1226;
				this.expression(21);
				}
				break;
			case 5:
				{
				this.state = 1228;
				localctx._prefix = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 90)) & ~0x1F) === 0 && ((1 << (_la - 90)) & 15) !== 0))) {
				    localctx._prefix = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1229;
				this.expression(19);
				}
				break;
			case 6:
				{
				this.state = 1230;
				localctx._prefix = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===80 || _la===81)) {
				    localctx._prefix = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1231;
				this.expression(18);
				}
				break;
			case 7:
				{
				this.state = 1232;
				this.lambdaExpression();
				}
				break;
			case 8:
				{
				this.state = 1233;
				this.typeType();
				this.state = 1234;
				this.match(ProcessingParser.COLONCOLON);
				this.state = 1240;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 79:
				case 115:
					{
					this.state = 1236;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===79) {
						{
						this.state = 1235;
						this.typeArguments();
						}
					}

					this.state = 1238;
					this.match(ProcessingParser.IDENTIFIER);
					}
					break;
				case 37:
					{
					this.state = 1239;
					this.match(ProcessingParser.NEW);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case 9:
				{
				this.state = 1242;
				this.classType();
				this.state = 1243;
				this.match(ProcessingParser.COLONCOLON);
				this.state = 1245;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===79) {
					{
					this.state = 1244;
					this.typeArguments();
					}
				}

				this.state = 1247;
				this.match(ProcessingParser.NEW);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1331;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1329;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 161, this._ctx) ) {
					case 1:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1251;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 1252;
						localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 35) !== 0))) {
						    localctx._bop = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1253;
						this.expression(18);
						}
						break;
					case 2:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1254;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 1255;
						localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===92 || _la===93)) {
						    localctx._bop = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1256;
						this.expression(17);
						}
						break;
					case 3:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1257;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 1265;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 157, this._ctx) ) {
						case 1:
							{
							this.state = 1258;
							this.match(ProcessingParser.LT);
							this.state = 1259;
							this.match(ProcessingParser.LT);
							}
							break;
						case 2:
							{
							this.state = 1260;
							this.match(ProcessingParser.GT);
							this.state = 1261;
							this.match(ProcessingParser.GT);
							this.state = 1262;
							this.match(ProcessingParser.GT);
							}
							break;
						case 3:
							{
							this.state = 1263;
							this.match(ProcessingParser.GT);
							this.state = 1264;
							this.match(ProcessingParser.GT);
							}
							break;
						}
						this.state = 1267;
						this.expression(16);
						}
						break;
					case 4:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1268;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 1269;
						localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(((((_la - 78)) & ~0x1F) === 0 && ((1 << (_la - 78)) & 387) !== 0))) {
						    localctx._bop = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1270;
						this.expression(15);
						}
						break;
					case 5:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1271;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 1272;
						localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===84 || _la===87)) {
						    localctx._bop = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1273;
						this.expression(13);
						}
						break;
					case 6:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1274;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 1275;
						localctx._bop = this.match(ProcessingParser.BITAND);
						this.state = 1276;
						this.expression(12);
						}
						break;
					case 7:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1277;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 1278;
						localctx._bop = this.match(ProcessingParser.CARET);
						this.state = 1279;
						this.expression(11);
						}
						break;
					case 8:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1280;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 1281;
						localctx._bop = this.match(ProcessingParser.BITOR);
						this.state = 1282;
						this.expression(10);
						}
						break;
					case 9:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1283;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 1284;
						localctx._bop = this.match(ProcessingParser.AND);
						this.state = 1285;
						this.expression(9);
						}
						break;
					case 10:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1286;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 1287;
						localctx._bop = this.match(ProcessingParser.OR);
						this.state = 1288;
						this.expression(8);
						}
						break;
					case 11:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1289;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 1290;
						localctx._bop = this.match(ProcessingParser.QUESTION);
						this.state = 1291;
						this.expression(0);
						this.state = 1292;
						this.match(ProcessingParser.COLON);
						this.state = 1293;
						this.expression(7);
						}
						break;
					case 12:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1295;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 1296;
						localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 4286578689) !== 0) || _la===109 || _la===110)) {
						    localctx._bop = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1297;
						this.expression(5);
						}
						break;
					case 13:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1298;
						if (!(this.precpred(this._ctx, 25))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 25)");
						}
						this.state = 1299;
						localctx._bop = this.match(ProcessingParser.DOT);
						this.state = 1311;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 159, this._ctx) ) {
						case 1:
							{
							this.state = 1300;
							this.match(ProcessingParser.IDENTIFIER);
							}
							break;
						case 2:
							{
							this.state = 1301;
							this.methodCall();
							}
							break;
						case 3:
							{
							this.state = 1302;
							this.match(ProcessingParser.THIS);
							}
							break;
						case 4:
							{
							this.state = 1303;
							this.match(ProcessingParser.NEW);
							this.state = 1305;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							if (_la===79) {
								{
								this.state = 1304;
								this.nonWildcardTypeArguments();
								}
							}

							this.state = 1307;
							this.innerCreator();
							}
							break;
						case 5:
							{
							this.state = 1308;
							this.match(ProcessingParser.SUPER);
							this.state = 1309;
							this.superSuffix();
							}
							break;
						case 6:
							{
							this.state = 1310;
							this.explicitGenericInvocation();
							}
							break;
						}
						}
						break;
					case 14:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1313;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 1314;
						this.match(ProcessingParser.LBRACK);
						this.state = 1315;
						this.expression(0);
						this.state = 1316;
						this.match(ProcessingParser.RBRACK);
						}
						break;
					case 15:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1318;
						if (!(this.precpred(this._ctx, 20))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
						}
						this.state = 1319;
						localctx._postfix = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===90 || _la===91)) {
						    localctx._postfix = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						}
						break;
					case 16:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1320;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 1321;
						localctx._bop = this.match(ProcessingParser.INSTANCEOF);
						this.state = 1322;
						this.typeType();
						}
						break;
					case 17:
						{
						localctx = new ExpressionContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression);
						this.state = 1323;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 1324;
						this.match(ProcessingParser.COLONCOLON);
						this.state = 1326;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===79) {
							{
							this.state = 1325;
							this.typeArguments();
							}
						}

						this.state = 1328;
						this.match(ProcessingParser.IDENTIFIER);
						}
						break;
					}
					}
				}
				this.state = 1333;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaExpression(): LambdaExpressionContext {
		let localctx: LambdaExpressionContext = new LambdaExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, ProcessingParser.RULE_lambdaExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1334;
			this.lambdaParameters();
			this.state = 1335;
			this.match(ProcessingParser.ARROW);
			this.state = 1336;
			this.lambdaBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaParameters(): LambdaParametersContext {
		let localctx: LambdaParametersContext = new LambdaParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, ProcessingParser.RULE_lambdaParameters);
		let _la: number;
		try {
			this.state = 1354;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 165, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1338;
				this.match(ProcessingParser.IDENTIFIER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1339;
				this.match(ProcessingParser.LPAREN);
				this.state = 1341;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 84953602) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 2098181) !== 0) || _la===113 || _la===115) {
					{
					this.state = 1340;
					this.formalParameterList();
					}
				}

				this.state = 1343;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1344;
				this.match(ProcessingParser.LPAREN);
				this.state = 1345;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 1350;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===75) {
					{
					{
					this.state = 1346;
					this.match(ProcessingParser.COMMA);
					this.state = 1347;
					this.match(ProcessingParser.IDENTIFIER);
					}
					}
					this.state = 1352;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1353;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaBody(): LambdaBodyContext {
		let localctx: LambdaBodyContext = new LambdaBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, ProcessingParser.RULE_lambdaBody);
		try {
			this.state = 1358;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 6:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 37:
			case 43:
			case 46:
			case 49:
			case 54:
			case 55:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 79:
			case 80:
			case 81:
			case 90:
			case 91:
			case 92:
			case 93:
			case 113:
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1356;
				this.expression(0);
				}
				break;
			case 70:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1357;
				this.block();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public primary(): PrimaryContext {
		let localctx: PrimaryContext = new PrimaryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 198, ProcessingParser.RULE_primary);
		try {
			this.state = 1378;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 168, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1360;
				this.match(ProcessingParser.LPAREN);
				this.state = 1361;
				this.expression(0);
				this.state = 1362;
				this.match(ProcessingParser.RPAREN);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1364;
				this.match(ProcessingParser.THIS);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1365;
				this.match(ProcessingParser.SUPER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1366;
				this.literal();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1367;
				this.match(ProcessingParser.IDENTIFIER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1368;
				this.typeTypeOrVoid();
				this.state = 1369;
				this.match(ProcessingParser.DOT);
				this.state = 1370;
				this.match(ProcessingParser.CLASS);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1372;
				this.nonWildcardTypeArguments();
				this.state = 1376;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 46:
				case 115:
					{
					this.state = 1373;
					this.explicitGenericInvocationSuffix();
					}
					break;
				case 49:
					{
					this.state = 1374;
					this.match(ProcessingParser.THIS);
					this.state = 1375;
					this.arguments();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classType(): ClassTypeContext {
		let localctx: ClassTypeContext = new ClassTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, ProcessingParser.RULE_classType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1383;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 169, this._ctx) ) {
			case 1:
				{
				this.state = 1380;
				this.classOrInterfaceType();
				this.state = 1381;
				this.match(ProcessingParser.DOT);
				}
				break;
			}
			this.state = 1388;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===113) {
				{
				{
				this.state = 1385;
				this.annotation();
				}
				}
				this.state = 1390;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1391;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 1393;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 1392;
				this.typeArguments();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public creator(): CreatorContext {
		let localctx: CreatorContext = new CreatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, ProcessingParser.RULE_creator);
		try {
			this.state = 1404;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 79:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1395;
				this.nonWildcardTypeArguments();
				this.state = 1396;
				this.createdName();
				this.state = 1397;
				this.classCreatorRest();
				}
				break;
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1399;
				this.createdName();
				this.state = 1402;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 72:
					{
					this.state = 1400;
					this.arrayCreatorRest();
					}
					break;
				case 68:
					{
					this.state = 1401;
					this.classCreatorRest();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public createdName(): CreatedNameContext {
		let localctx: CreatedNameContext = new CreatedNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 204, ProcessingParser.RULE_createdName);
		let _la: number;
		try {
			this.state = 1421;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 115:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1406;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 1408;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===79) {
					{
					this.state = 1407;
					this.typeArgumentsOrDiamond();
					}
				}

				this.state = 1417;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1410;
					this.match(ProcessingParser.DOT);
					this.state = 1411;
					this.match(ProcessingParser.IDENTIFIER);
					this.state = 1413;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===79) {
						{
						this.state = 1412;
						this.typeArgumentsOrDiamond();
						}
					}

					}
					}
					this.state = 1419;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1420;
				this.primitiveType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public innerCreator(): InnerCreatorContext {
		let localctx: InnerCreatorContext = new InnerCreatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, ProcessingParser.RULE_innerCreator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1423;
			this.match(ProcessingParser.IDENTIFIER);
			this.state = 1425;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 1424;
				this.nonWildcardTypeArgumentsOrDiamond();
				}
			}

			this.state = 1427;
			this.classCreatorRest();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public arrayCreatorRest(): ArrayCreatorRestContext {
		let localctx: ArrayCreatorRestContext = new ArrayCreatorRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, ProcessingParser.RULE_arrayCreatorRest);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1429;
			this.match(ProcessingParser.LBRACK);
			this.state = 1457;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 73:
				{
				this.state = 1430;
				this.match(ProcessingParser.RBRACK);
				this.state = 1435;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===72) {
					{
					{
					this.state = 1431;
					this.match(ProcessingParser.LBRACK);
					this.state = 1432;
					this.match(ProcessingParser.RBRACK);
					}
					}
					this.state = 1437;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1438;
				this.arrayInitializer();
				}
				break;
			case 1:
			case 2:
			case 6:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 37:
			case 43:
			case 46:
			case 49:
			case 54:
			case 55:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 79:
			case 80:
			case 81:
			case 90:
			case 91:
			case 92:
			case 93:
			case 113:
			case 115:
				{
				this.state = 1439;
				this.expression(0);
				this.state = 1440;
				this.match(ProcessingParser.RBRACK);
				this.state = 1447;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 180, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1441;
						this.match(ProcessingParser.LBRACK);
						this.state = 1442;
						this.expression(0);
						this.state = 1443;
						this.match(ProcessingParser.RBRACK);
						}
						}
					}
					this.state = 1449;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 180, this._ctx);
				}
				this.state = 1454;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 181, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1450;
						this.match(ProcessingParser.LBRACK);
						this.state = 1451;
						this.match(ProcessingParser.RBRACK);
						}
						}
					}
					this.state = 1456;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 181, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classCreatorRest(): ClassCreatorRestContext {
		let localctx: ClassCreatorRestContext = new ClassCreatorRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, ProcessingParser.RULE_classCreatorRest);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1459;
			this.arguments();
			this.state = 1461;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 183, this._ctx) ) {
			case 1:
				{
				this.state = 1460;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explicitGenericInvocation(): ExplicitGenericInvocationContext {
		let localctx: ExplicitGenericInvocationContext = new ExplicitGenericInvocationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, ProcessingParser.RULE_explicitGenericInvocation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1463;
			this.nonWildcardTypeArguments();
			this.state = 1464;
			this.explicitGenericInvocationSuffix();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext {
		let localctx: TypeArgumentsOrDiamondContext = new TypeArgumentsOrDiamondContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, ProcessingParser.RULE_typeArgumentsOrDiamond);
		try {
			this.state = 1469;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 184, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1466;
				this.match(ProcessingParser.LT);
				this.state = 1467;
				this.match(ProcessingParser.GT);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1468;
				this.typeArguments();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext {
		let localctx: NonWildcardTypeArgumentsOrDiamondContext = new NonWildcardTypeArgumentsOrDiamondContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, ProcessingParser.RULE_nonWildcardTypeArgumentsOrDiamond);
		try {
			this.state = 1474;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 185, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1471;
				this.match(ProcessingParser.LT);
				this.state = 1472;
				this.match(ProcessingParser.GT);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1473;
				this.nonWildcardTypeArguments();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		let localctx: NonWildcardTypeArgumentsContext = new NonWildcardTypeArgumentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, ProcessingParser.RULE_nonWildcardTypeArguments);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1476;
			this.match(ProcessingParser.LT);
			this.state = 1477;
			this.typeList();
			this.state = 1478;
			this.match(ProcessingParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeList(): TypeListContext {
		let localctx: TypeListContext = new TypeListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, ProcessingParser.RULE_typeList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1480;
			this.typeType();
			this.state = 1485;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 1481;
				this.match(ProcessingParser.COMMA);
				this.state = 1482;
				this.typeType();
				}
				}
				this.state = 1487;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeType(): TypeTypeContext {
		let localctx: TypeTypeContext = new TypeTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, ProcessingParser.RULE_typeType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1489;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===113) {
				{
				this.state = 1488;
				this.annotation();
				}
			}

			this.state = 1494;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 115:
				{
				this.state = 1491;
				this.classOrInterfaceType();
				}
				break;
			case 1:
			case 9:
			case 11:
			case 14:
			case 20:
			case 26:
			case 33:
			case 35:
			case 43:
				{
				this.state = 1492;
				this.primitiveType();
				}
				break;
			case 54:
				{
				this.state = 1493;
				this.match(ProcessingParser.VAR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1500;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 189, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1496;
					this.match(ProcessingParser.LBRACK);
					this.state = 1497;
					this.match(ProcessingParser.RBRACK);
					}
					}
				}
				this.state = 1502;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 189, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeArguments(): TypeArgumentsContext {
		let localctx: TypeArgumentsContext = new TypeArgumentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, ProcessingParser.RULE_typeArguments);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1503;
			this.match(ProcessingParser.LT);
			this.state = 1504;
			this.typeArgument();
			this.state = 1509;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===75) {
				{
				{
				this.state = 1505;
				this.match(ProcessingParser.COMMA);
				this.state = 1506;
				this.typeArgument();
				}
				}
				this.state = 1511;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1512;
			this.match(ProcessingParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public superSuffix(): SuperSuffixContext {
		let localctx: SuperSuffixContext = new SuperSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, ProcessingParser.RULE_superSuffix);
		try {
			this.state = 1520;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 68:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1514;
				this.arguments();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1515;
				this.match(ProcessingParser.DOT);
				this.state = 1516;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 1518;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 191, this._ctx) ) {
				case 1:
					{
					this.state = 1517;
					this.arguments();
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
		let localctx: ExplicitGenericInvocationSuffixContext = new ExplicitGenericInvocationSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, ProcessingParser.RULE_explicitGenericInvocationSuffix);
		try {
			this.state = 1526;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 46:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1522;
				this.match(ProcessingParser.SUPER);
				this.state = 1523;
				this.superSuffix();
				}
				break;
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1524;
				this.match(ProcessingParser.IDENTIFIER);
				this.state = 1525;
				this.arguments();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public arguments(): ArgumentsContext {
		let localctx: ArgumentsContext = new ArgumentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, ProcessingParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1528;
			this.match(ProcessingParser.LPAREN);
			this.state = 1530;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 68176454) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4267779093) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 503431183) !== 0) || _la===113 || _la===115) {
				{
				this.state = 1529;
				this.expressionList();
				}
			}

			this.state = 1532;
			this.match(ProcessingParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 95:
			return this.expression_sempred(localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 17);
		case 1:
			return this.precpred(this._ctx, 16);
		case 2:
			return this.precpred(this._ctx, 15);
		case 3:
			return this.precpred(this._ctx, 14);
		case 4:
			return this.precpred(this._ctx, 12);
		case 5:
			return this.precpred(this._ctx, 11);
		case 6:
			return this.precpred(this._ctx, 10);
		case 7:
			return this.precpred(this._ctx, 9);
		case 8:
			return this.precpred(this._ctx, 8);
		case 9:
			return this.precpred(this._ctx, 7);
		case 10:
			return this.precpred(this._ctx, 6);
		case 11:
			return this.precpred(this._ctx, 5);
		case 12:
			return this.precpred(this._ctx, 25);
		case 13:
			return this.precpred(this._ctx, 24);
		case 14:
			return this.precpred(this._ctx, 20);
		case 15:
			return this.precpred(this._ctx, 13);
		case 16:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,115,1535,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,1,0,1,0,1,0,3,0,236,8,0,1,1,3,1,239,8,1,1,1,5,1,242,8,1,10,1,12,1,
	245,9,1,1,1,4,1,248,8,1,11,1,12,1,249,1,1,1,1,1,2,1,2,1,2,5,2,257,8,2,10,
	2,12,2,260,9,2,1,2,1,2,1,3,1,3,5,3,266,8,3,10,3,12,3,269,9,3,1,3,1,3,1,
	4,1,4,1,4,5,4,276,8,4,10,4,12,4,279,9,4,1,4,1,4,1,4,1,4,1,4,5,4,286,8,4,
	10,4,12,4,289,9,4,1,4,1,4,1,4,5,4,294,8,4,10,4,12,4,297,9,4,1,4,1,4,1,4,
	1,4,1,4,5,4,304,8,4,10,4,12,4,307,9,4,3,4,309,8,4,1,5,1,5,1,5,1,5,5,5,315,
	8,5,10,5,12,5,318,9,5,3,5,320,8,5,1,6,1,6,1,6,5,6,325,8,6,10,6,12,6,328,
	9,6,1,6,1,6,1,7,1,7,1,7,1,7,3,7,336,8,7,1,7,1,7,1,7,1,7,3,7,342,8,7,1,7,
	1,7,1,7,1,7,3,7,348,8,7,1,7,3,7,351,8,7,1,8,1,8,1,8,3,8,356,8,8,1,8,1,8,
	1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,3,9,369,8,9,1,10,1,10,1,11,1,11,3,11,
	375,8,11,1,11,1,11,1,11,3,11,380,8,11,5,11,382,8,11,10,11,12,11,385,9,11,
	1,12,1,12,1,12,1,12,1,12,1,12,1,12,3,12,394,8,12,1,13,1,13,1,14,3,14,399,
	8,14,1,14,5,14,402,8,14,10,14,12,14,405,9,14,1,14,5,14,408,8,14,10,14,12,
	14,411,9,14,1,14,1,14,1,15,5,15,416,8,15,10,15,12,15,419,9,15,1,15,1,15,
	1,15,1,15,1,16,1,16,3,16,427,8,16,1,16,1,16,1,16,3,16,432,8,16,1,16,1,16,
	1,17,5,17,437,8,17,10,17,12,17,440,9,17,1,17,1,17,1,17,1,17,3,17,446,8,
	17,1,17,3,17,449,8,17,1,18,1,18,1,18,1,18,1,18,3,18,456,8,18,1,19,1,19,
	1,19,1,19,1,19,1,19,1,19,1,19,3,19,466,8,19,1,20,1,20,3,20,470,8,20,1,21,
	1,21,1,21,3,21,475,8,21,1,21,1,21,3,21,479,8,21,1,21,1,21,3,21,483,8,21,
	1,21,1,21,1,22,1,22,1,22,1,22,5,22,491,8,22,10,22,12,22,494,9,22,1,22,1,
	22,1,23,5,23,499,8,23,10,23,12,23,502,9,23,1,23,1,23,1,23,3,23,507,8,23,
	1,24,1,24,1,24,5,24,512,8,24,10,24,12,24,515,9,24,1,25,1,25,1,25,1,25,3,
	25,521,8,25,1,25,1,25,3,25,525,8,25,1,25,3,25,528,8,25,1,25,3,25,531,8,
	25,1,25,1,25,1,26,1,26,1,26,5,26,538,8,26,10,26,12,26,541,9,26,1,27,5,27,
	544,8,27,10,27,12,27,547,9,27,1,27,1,27,3,27,551,8,27,1,27,3,27,554,8,27,
	1,28,1,28,5,28,558,8,28,10,28,12,28,561,9,28,1,29,1,29,1,29,3,29,566,8,
	29,1,29,1,29,3,29,570,8,29,1,29,1,29,1,30,1,30,5,30,576,8,30,10,30,12,30,
	579,9,30,1,30,1,30,1,31,1,31,5,31,585,8,31,10,31,12,31,588,9,31,1,31,1,
	31,1,32,1,32,1,32,3,32,595,8,32,1,32,1,32,5,32,599,8,32,10,32,12,32,602,
	9,32,1,32,3,32,605,8,32,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,3,
	33,616,8,33,1,34,1,34,1,34,1,34,1,34,5,34,623,8,34,10,34,12,34,626,9,34,
	1,34,1,34,3,34,630,8,34,1,34,1,34,1,35,1,35,3,35,636,8,35,1,36,1,36,3,36,
	640,8,36,1,37,1,37,1,37,1,38,1,38,1,38,1,39,1,39,1,39,1,39,3,39,652,8,39,
	1,39,1,39,1,40,1,40,1,40,1,40,1,41,5,41,661,8,41,10,41,12,41,664,9,41,1,
	41,1,41,3,41,668,8,41,1,42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,677,8,42,
	1,43,1,43,1,43,1,43,5,43,683,8,43,10,43,12,43,686,9,43,1,43,1,43,1,44,1,
	44,1,44,5,44,693,8,44,10,44,12,44,696,9,44,1,44,1,44,1,44,1,45,5,45,702,
	8,45,10,45,12,45,705,9,45,1,45,1,45,1,45,5,45,710,8,45,10,45,12,45,713,
	9,45,1,45,1,45,3,45,717,8,45,1,45,1,45,1,45,1,45,5,45,723,8,45,10,45,12,
	45,726,9,45,1,45,1,45,3,45,730,8,45,1,45,1,45,1,46,1,46,1,46,1,46,1,46,
	1,46,3,46,740,8,46,1,47,1,47,1,47,1,48,1,48,1,48,5,48,748,8,48,10,48,12,
	48,751,9,48,1,49,1,49,1,49,3,49,756,8,49,1,50,1,50,3,50,760,8,50,1,51,1,
	51,1,51,1,51,5,51,766,8,51,10,51,12,51,769,9,51,1,51,3,51,772,8,51,3,51,
	774,8,51,1,51,1,51,1,52,1,52,3,52,780,8,52,1,52,1,52,1,52,3,52,785,8,52,
	5,52,787,8,52,10,52,12,52,790,9,52,1,53,1,53,1,53,1,53,3,53,796,8,53,3,
	53,798,8,53,1,54,1,54,1,54,5,54,803,8,54,10,54,12,54,806,9,54,1,55,1,55,
	3,55,810,8,55,1,55,1,55,1,56,1,56,1,56,5,56,817,8,56,10,56,12,56,820,9,
	56,1,56,1,56,3,56,824,8,56,1,56,3,56,827,8,56,1,57,5,57,830,8,57,10,57,
	12,57,833,9,57,1,57,1,57,1,57,1,58,5,58,839,8,58,10,58,12,58,842,9,58,1,
	58,1,58,1,58,1,58,1,59,1,59,1,60,1,60,1,61,1,61,3,61,854,8,61,1,62,1,62,
	1,63,1,63,1,64,1,64,1,64,1,64,1,64,3,64,865,8,64,1,64,3,64,868,8,64,1,65,
	1,65,1,65,5,65,873,8,65,10,65,12,65,876,9,65,1,66,1,66,1,66,1,66,1,67,1,
	67,1,67,3,67,885,8,67,1,68,1,68,1,68,1,68,5,68,891,8,68,10,68,12,68,894,
	9,68,3,68,896,8,68,1,68,3,68,899,8,68,1,68,1,68,1,69,1,69,1,69,1,69,1,69,
	1,70,1,70,5,70,910,8,70,10,70,12,70,913,9,70,1,70,1,70,1,71,5,71,918,8,
	71,10,71,12,71,921,9,71,1,71,1,71,3,71,925,8,71,1,72,1,72,1,72,1,72,1,72,
	1,72,3,72,933,8,72,1,72,1,72,3,72,937,8,72,1,72,1,72,3,72,941,8,72,1,72,
	1,72,3,72,945,8,72,3,72,947,8,72,1,73,1,73,3,73,951,8,73,1,74,1,74,1,74,
	1,74,3,74,957,8,74,1,75,1,75,1,76,1,76,1,76,1,77,1,77,5,77,966,8,77,10,
	77,12,77,969,9,77,1,77,1,77,1,78,1,78,1,78,1,78,1,78,3,78,978,8,78,1,79,
	5,79,981,8,79,10,79,12,79,984,9,79,1,79,1,79,1,79,1,80,5,80,990,8,80,10,
	80,12,80,993,9,80,1,80,1,80,3,80,997,8,80,1,80,3,80,1000,8,80,1,81,1,81,
	1,81,1,81,1,81,3,81,1007,8,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,3,81,1016,
	8,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,
	81,1,81,1,81,1,81,1,81,1,81,4,81,1037,8,81,11,81,12,81,1038,1,81,3,81,1042,
	8,81,1,81,3,81,1045,8,81,1,81,1,81,1,81,1,81,5,81,1051,8,81,10,81,12,81,
	1054,9,81,1,81,3,81,1057,8,81,1,81,1,81,1,81,1,81,5,81,1063,8,81,10,81,
	12,81,1066,9,81,1,81,5,81,1069,8,81,10,81,12,81,1072,9,81,1,81,1,81,1,81,
	1,81,1,81,1,81,1,81,1,81,3,81,1082,8,81,1,81,1,81,1,81,1,81,1,81,1,81,1,
	81,3,81,1091,8,81,1,81,1,81,1,81,3,81,1096,8,81,1,81,1,81,1,81,1,81,1,81,
	1,81,1,81,1,81,3,81,1106,8,81,1,82,1,82,1,82,5,82,1111,8,82,10,82,12,82,
	1114,9,82,1,82,1,82,1,82,1,82,1,82,1,83,1,83,1,83,5,83,1124,8,83,10,83,
	12,83,1127,9,83,1,84,1,84,1,84,1,85,1,85,1,85,3,85,1135,8,85,1,85,1,85,
	1,86,1,86,1,86,5,86,1142,8,86,10,86,12,86,1145,9,86,1,87,5,87,1148,8,87,
	10,87,12,87,1151,9,87,1,87,1,87,1,87,1,87,1,87,1,88,4,88,1159,8,88,11,88,
	12,88,1160,1,88,4,88,1164,8,88,11,88,12,88,1165,1,89,1,89,1,89,3,89,1171,
	8,89,1,89,1,89,1,89,3,89,1176,8,89,1,90,1,90,3,90,1180,8,90,1,90,1,90,3,
	90,1184,8,90,1,90,1,90,3,90,1188,8,90,3,90,1190,8,90,1,91,1,91,3,91,1194,
	8,91,1,92,5,92,1197,8,92,10,92,12,92,1200,9,92,1,92,1,92,1,92,1,92,1,92,
	1,93,1,93,1,93,1,93,1,94,1,94,1,94,5,94,1214,8,94,10,94,12,94,1217,9,94,
	1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,
	95,1,95,1,95,1,95,3,95,1237,8,95,1,95,1,95,3,95,1241,8,95,1,95,1,95,1,95,
	3,95,1246,8,95,1,95,1,95,3,95,1250,8,95,1,95,1,95,1,95,1,95,1,95,1,95,1,
	95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,3,95,1266,8,95,1,95,1,95,1,95,1,95,
	1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,
	95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,
	1,95,1,95,1,95,1,95,1,95,3,95,1306,8,95,1,95,1,95,1,95,1,95,3,95,1312,8,
	95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,1,95,3,95,
	1327,8,95,1,95,5,95,1330,8,95,10,95,12,95,1333,9,95,1,96,1,96,1,96,1,96,
	1,97,1,97,1,97,3,97,1342,8,97,1,97,1,97,1,97,1,97,1,97,5,97,1349,8,97,10,
	97,12,97,1352,9,97,1,97,3,97,1355,8,97,1,98,1,98,3,98,1359,8,98,1,99,1,
	99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,
	3,99,1377,8,99,3,99,1379,8,99,1,100,1,100,1,100,3,100,1384,8,100,1,100,
	5,100,1387,8,100,10,100,12,100,1390,9,100,1,100,1,100,3,100,1394,8,100,
	1,101,1,101,1,101,1,101,1,101,1,101,1,101,3,101,1403,8,101,3,101,1405,8,
	101,1,102,1,102,3,102,1409,8,102,1,102,1,102,1,102,3,102,1414,8,102,5,102,
	1416,8,102,10,102,12,102,1419,9,102,1,102,3,102,1422,8,102,1,103,1,103,
	3,103,1426,8,103,1,103,1,103,1,104,1,104,1,104,1,104,5,104,1434,8,104,10,
	104,12,104,1437,9,104,1,104,1,104,1,104,1,104,1,104,1,104,1,104,5,104,1446,
	8,104,10,104,12,104,1449,9,104,1,104,1,104,5,104,1453,8,104,10,104,12,104,
	1456,9,104,3,104,1458,8,104,1,105,1,105,3,105,1462,8,105,1,106,1,106,1,
	106,1,107,1,107,1,107,3,107,1470,8,107,1,108,1,108,1,108,3,108,1475,8,108,
	1,109,1,109,1,109,1,109,1,110,1,110,1,110,5,110,1484,8,110,10,110,12,110,
	1487,9,110,1,111,3,111,1490,8,111,1,111,1,111,1,111,3,111,1495,8,111,1,
	111,1,111,5,111,1499,8,111,10,111,12,111,1502,9,111,1,112,1,112,1,112,1,
	112,5,112,1508,8,112,10,112,12,112,1511,9,112,1,112,1,112,1,113,1,113,1,
	113,1,113,3,113,1519,8,113,3,113,1521,8,113,1,114,1,114,1,114,1,114,3,114,
	1527,8,114,1,115,1,115,3,115,1531,8,115,1,115,1,115,1,115,0,1,190,116,0,
	2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,
	52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,
	100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,
	136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,
	172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,204,206,
	208,210,212,214,216,218,220,222,224,226,228,230,0,12,6,0,1,1,9,9,11,11,
	14,14,26,26,33,33,2,0,23,23,46,46,1,0,58,61,1,0,62,63,1,0,90,93,1,0,80,
	81,2,0,94,95,99,99,1,0,92,93,2,0,78,79,85,86,2,0,84,84,87,87,2,0,77,77,
	100,110,1,0,90,91,1717,0,235,1,0,0,0,2,238,1,0,0,0,4,258,1,0,0,0,6,267,
	1,0,0,0,8,308,1,0,0,0,10,319,1,0,0,0,12,321,1,0,0,0,14,350,1,0,0,0,16,352,
	1,0,0,0,18,368,1,0,0,0,20,370,1,0,0,0,22,374,1,0,0,0,24,393,1,0,0,0,26,
	395,1,0,0,0,28,398,1,0,0,0,30,417,1,0,0,0,32,424,1,0,0,0,34,448,1,0,0,0,
	36,455,1,0,0,0,38,465,1,0,0,0,40,469,1,0,0,0,42,471,1,0,0,0,44,486,1,0,
	0,0,46,500,1,0,0,0,48,508,1,0,0,0,50,516,1,0,0,0,52,534,1,0,0,0,54,545,
	1,0,0,0,56,555,1,0,0,0,58,562,1,0,0,0,60,573,1,0,0,0,62,582,1,0,0,0,64,
	604,1,0,0,0,66,615,1,0,0,0,68,617,1,0,0,0,70,635,1,0,0,0,72,639,1,0,0,0,
	74,641,1,0,0,0,76,644,1,0,0,0,78,647,1,0,0,0,80,655,1,0,0,0,82,667,1,0,
	0,0,84,676,1,0,0,0,86,678,1,0,0,0,88,689,1,0,0,0,90,703,1,0,0,0,92,739,
	1,0,0,0,94,741,1,0,0,0,96,744,1,0,0,0,98,752,1,0,0,0,100,759,1,0,0,0,102,
	761,1,0,0,0,104,777,1,0,0,0,106,797,1,0,0,0,108,799,1,0,0,0,110,807,1,0,
	0,0,112,826,1,0,0,0,114,831,1,0,0,0,116,840,1,0,0,0,118,847,1,0,0,0,120,
	849,1,0,0,0,122,853,1,0,0,0,124,855,1,0,0,0,126,857,1,0,0,0,128,859,1,0,
	0,0,130,869,1,0,0,0,132,877,1,0,0,0,134,884,1,0,0,0,136,886,1,0,0,0,138,
	902,1,0,0,0,140,907,1,0,0,0,142,924,1,0,0,0,144,946,1,0,0,0,146,950,1,0,
	0,0,148,952,1,0,0,0,150,958,1,0,0,0,152,960,1,0,0,0,154,963,1,0,0,0,156,
	977,1,0,0,0,158,982,1,0,0,0,160,999,1,0,0,0,162,1105,1,0,0,0,164,1107,1,
	0,0,0,166,1120,1,0,0,0,168,1128,1,0,0,0,170,1131,1,0,0,0,172,1138,1,0,0,
	0,174,1149,1,0,0,0,176,1158,1,0,0,0,178,1175,1,0,0,0,180,1189,1,0,0,0,182,
	1193,1,0,0,0,184,1198,1,0,0,0,186,1206,1,0,0,0,188,1210,1,0,0,0,190,1249,
	1,0,0,0,192,1334,1,0,0,0,194,1354,1,0,0,0,196,1358,1,0,0,0,198,1378,1,0,
	0,0,200,1383,1,0,0,0,202,1404,1,0,0,0,204,1421,1,0,0,0,206,1423,1,0,0,0,
	208,1429,1,0,0,0,210,1459,1,0,0,0,212,1463,1,0,0,0,214,1469,1,0,0,0,216,
	1474,1,0,0,0,218,1476,1,0,0,0,220,1480,1,0,0,0,222,1489,1,0,0,0,224,1503,
	1,0,0,0,226,1520,1,0,0,0,228,1526,1,0,0,0,230,1528,1,0,0,0,232,236,3,4,
	2,0,233,236,3,2,1,0,234,236,3,6,3,0,235,232,1,0,0,0,235,233,1,0,0,0,235,
	234,1,0,0,0,236,1,1,0,0,0,237,239,3,30,15,0,238,237,1,0,0,0,238,239,1,0,
	0,0,239,243,1,0,0,0,240,242,3,32,16,0,241,240,1,0,0,0,242,245,1,0,0,0,243,
	241,1,0,0,0,243,244,1,0,0,0,244,247,1,0,0,0,245,243,1,0,0,0,246,248,3,34,
	17,0,247,246,1,0,0,0,248,249,1,0,0,0,249,247,1,0,0,0,249,250,1,0,0,0,250,
	251,1,0,0,0,251,252,5,0,0,1,252,3,1,0,0,0,253,257,3,32,16,0,254,257,3,156,
	78,0,255,257,3,34,17,0,256,253,1,0,0,0,256,254,1,0,0,0,256,255,1,0,0,0,
	257,260,1,0,0,0,258,256,1,0,0,0,258,259,1,0,0,0,259,261,1,0,0,0,260,258,
	1,0,0,0,261,262,5,0,0,1,262,5,1,0,0,0,263,266,3,32,16,0,264,266,3,64,32,
	0,265,263,1,0,0,0,265,264,1,0,0,0,266,269,1,0,0,0,267,265,1,0,0,0,267,268,
	1,0,0,0,268,270,1,0,0,0,269,267,1,0,0,0,270,271,5,0,0,1,271,7,1,0,0,0,272,
	276,3,32,16,0,273,276,3,64,32,0,274,276,3,156,78,0,275,272,1,0,0,0,275,
	273,1,0,0,0,275,274,1,0,0,0,276,279,1,0,0,0,277,275,1,0,0,0,277,278,1,0,
	0,0,278,280,1,0,0,0,279,277,1,0,0,0,280,281,3,156,78,0,281,287,3,64,32,
	0,282,286,3,32,16,0,283,286,3,64,32,0,284,286,3,156,78,0,285,282,1,0,0,
	0,285,283,1,0,0,0,285,284,1,0,0,0,286,289,1,0,0,0,287,285,1,0,0,0,287,288,
	1,0,0,0,288,309,1,0,0,0,289,287,1,0,0,0,290,294,3,32,16,0,291,294,3,64,
	32,0,292,294,3,156,78,0,293,290,1,0,0,0,293,291,1,0,0,0,293,292,1,0,0,0,
	294,297,1,0,0,0,295,293,1,0,0,0,295,296,1,0,0,0,296,298,1,0,0,0,297,295,
	1,0,0,0,298,299,3,64,32,0,299,305,3,156,78,0,300,304,3,32,16,0,301,304,
	3,64,32,0,302,304,3,156,78,0,303,300,1,0,0,0,303,301,1,0,0,0,303,302,1,
	0,0,0,304,307,1,0,0,0,305,303,1,0,0,0,305,306,1,0,0,0,306,309,1,0,0,0,307,
	305,1,0,0,0,308,277,1,0,0,0,308,295,1,0,0,0,309,9,1,0,0,0,310,320,3,12,
	6,0,311,316,5,115,0,0,312,313,5,72,0,0,313,315,5,73,0,0,314,312,1,0,0,0,
	315,318,1,0,0,0,316,314,1,0,0,0,316,317,1,0,0,0,317,320,1,0,0,0,318,316,
	1,0,0,0,319,310,1,0,0,0,319,311,1,0,0,0,320,11,1,0,0,0,321,326,3,18,9,0,
	322,323,5,72,0,0,323,325,5,73,0,0,324,322,1,0,0,0,325,328,1,0,0,0,326,324,
	1,0,0,0,326,327,1,0,0,0,327,329,1,0,0,0,328,326,1,0,0,0,329,330,6,6,-1,
	0,330,13,1,0,0,0,331,351,3,16,8,0,332,333,5,115,0,0,333,335,5,68,0,0,334,
	336,3,188,94,0,335,334,1,0,0,0,335,336,1,0,0,0,336,337,1,0,0,0,337,351,
	5,69,0,0,338,339,5,49,0,0,339,341,5,68,0,0,340,342,3,188,94,0,341,340,1,
	0,0,0,341,342,1,0,0,0,342,343,1,0,0,0,343,351,5,69,0,0,344,345,5,46,0,0,
	345,347,5,68,0,0,346,348,3,188,94,0,347,346,1,0,0,0,347,348,1,0,0,0,348,
	349,1,0,0,0,349,351,5,69,0,0,350,331,1,0,0,0,350,332,1,0,0,0,350,338,1,
	0,0,0,350,344,1,0,0,0,351,15,1,0,0,0,352,353,7,0,0,0,353,355,5,68,0,0,354,
	356,3,188,94,0,355,354,1,0,0,0,355,356,1,0,0,0,356,357,1,0,0,0,357,358,
	5,69,0,0,358,17,1,0,0,0,359,369,5,9,0,0,360,369,5,14,0,0,361,369,5,11,0,
	0,362,369,5,43,0,0,363,369,5,33,0,0,364,369,5,35,0,0,365,369,5,26,0,0,366,
	369,5,20,0,0,367,369,3,20,10,0,368,359,1,0,0,0,368,360,1,0,0,0,368,361,
	1,0,0,0,368,362,1,0,0,0,368,363,1,0,0,0,368,364,1,0,0,0,368,365,1,0,0,0,
	368,366,1,0,0,0,368,367,1,0,0,0,369,19,1,0,0,0,370,371,5,1,0,0,371,21,1,
	0,0,0,372,375,5,115,0,0,373,375,3,20,10,0,374,372,1,0,0,0,374,373,1,0,0,
	0,375,383,1,0,0,0,376,379,5,76,0,0,377,380,5,115,0,0,378,380,3,20,10,0,
	379,377,1,0,0,0,379,378,1,0,0,0,380,382,1,0,0,0,381,376,1,0,0,0,382,385,
	1,0,0,0,383,381,1,0,0,0,383,384,1,0,0,0,384,23,1,0,0,0,385,383,1,0,0,0,
	386,394,3,124,62,0,387,394,3,126,63,0,388,394,5,6,0,0,389,394,3,122,61,
	0,390,394,5,64,0,0,391,394,5,67,0,0,392,394,3,26,13,0,393,386,1,0,0,0,393,
	387,1,0,0,0,393,388,1,0,0,0,393,389,1,0,0,0,393,390,1,0,0,0,393,391,1,0,
	0,0,393,392,1,0,0,0,394,25,1,0,0,0,395,396,5,2,0,0,396,27,1,0,0,0,397,399,
	3,30,15,0,398,397,1,0,0,0,398,399,1,0,0,0,399,403,1,0,0,0,400,402,3,32,
	16,0,401,400,1,0,0,0,402,405,1,0,0,0,403,401,1,0,0,0,403,404,1,0,0,0,404,
	409,1,0,0,0,405,403,1,0,0,0,406,408,3,34,17,0,407,406,1,0,0,0,408,411,1,
	0,0,0,409,407,1,0,0,0,409,410,1,0,0,0,410,412,1,0,0,0,411,409,1,0,0,0,412,
	413,5,0,0,1,413,29,1,0,0,0,414,416,3,128,64,0,415,414,1,0,0,0,416,419,1,
	0,0,0,417,415,1,0,0,0,417,418,1,0,0,0,418,420,1,0,0,0,419,417,1,0,0,0,420,
	421,5,38,0,0,421,422,3,22,11,0,422,423,5,74,0,0,423,31,1,0,0,0,424,426,
	5,31,0,0,425,427,5,44,0,0,426,425,1,0,0,0,426,427,1,0,0,0,427,428,1,0,0,
	0,428,431,3,22,11,0,429,430,5,76,0,0,430,432,5,94,0,0,431,429,1,0,0,0,431,
	432,1,0,0,0,432,433,1,0,0,0,433,434,5,74,0,0,434,33,1,0,0,0,435,437,3,38,
	19,0,436,435,1,0,0,0,437,440,1,0,0,0,438,436,1,0,0,0,438,439,1,0,0,0,439,
	445,1,0,0,0,440,438,1,0,0,0,441,446,3,42,21,0,442,446,3,50,25,0,443,446,
	3,58,29,0,444,446,3,138,69,0,445,441,1,0,0,0,445,442,1,0,0,0,445,443,1,
	0,0,0,445,444,1,0,0,0,446,449,1,0,0,0,447,449,5,74,0,0,448,438,1,0,0,0,
	448,447,1,0,0,0,449,35,1,0,0,0,450,456,3,38,19,0,451,456,5,36,0,0,452,456,
	5,48,0,0,453,456,5,52,0,0,454,456,5,56,0,0,455,450,1,0,0,0,455,451,1,0,
	0,0,455,452,1,0,0,0,455,453,1,0,0,0,455,454,1,0,0,0,456,37,1,0,0,0,457,
	466,3,128,64,0,458,466,5,41,0,0,459,466,5,40,0,0,460,466,5,39,0,0,461,466,
	5,44,0,0,462,466,5,7,0,0,463,466,5,24,0,0,464,466,5,45,0,0,465,457,1,0,
	0,0,465,458,1,0,0,0,465,459,1,0,0,0,465,460,1,0,0,0,465,461,1,0,0,0,465,
	462,1,0,0,0,465,463,1,0,0,0,465,464,1,0,0,0,466,39,1,0,0,0,467,470,5,24,
	0,0,468,470,3,128,64,0,469,467,1,0,0,0,469,468,1,0,0,0,470,41,1,0,0,0,471,
	472,5,15,0,0,472,474,5,115,0,0,473,475,3,44,22,0,474,473,1,0,0,0,474,475,
	1,0,0,0,475,478,1,0,0,0,476,477,5,23,0,0,477,479,3,222,111,0,478,476,1,
	0,0,0,478,479,1,0,0,0,479,482,1,0,0,0,480,481,5,30,0,0,481,483,3,220,110,
	0,482,480,1,0,0,0,482,483,1,0,0,0,483,484,1,0,0,0,484,485,3,60,30,0,485,
	43,1,0,0,0,486,487,5,79,0,0,487,492,3,46,23,0,488,489,5,75,0,0,489,491,
	3,46,23,0,490,488,1,0,0,0,491,494,1,0,0,0,492,490,1,0,0,0,492,493,1,0,0,
	0,493,495,1,0,0,0,494,492,1,0,0,0,495,496,5,78,0,0,496,45,1,0,0,0,497,499,
	3,128,64,0,498,497,1,0,0,0,499,502,1,0,0,0,500,498,1,0,0,0,500,501,1,0,
	0,0,501,503,1,0,0,0,502,500,1,0,0,0,503,506,5,115,0,0,504,505,5,23,0,0,
	505,507,3,48,24,0,506,504,1,0,0,0,506,507,1,0,0,0,507,47,1,0,0,0,508,513,
	3,222,111,0,509,510,5,96,0,0,510,512,3,222,111,0,511,509,1,0,0,0,512,515,
	1,0,0,0,513,511,1,0,0,0,513,514,1,0,0,0,514,49,1,0,0,0,515,513,1,0,0,0,
	516,517,5,22,0,0,517,520,5,115,0,0,518,519,5,30,0,0,519,521,3,220,110,0,
	520,518,1,0,0,0,520,521,1,0,0,0,521,522,1,0,0,0,522,524,5,70,0,0,523,525,
	3,52,26,0,524,523,1,0,0,0,524,525,1,0,0,0,525,527,1,0,0,0,526,528,5,75,
	0,0,527,526,1,0,0,0,527,528,1,0,0,0,528,530,1,0,0,0,529,531,3,56,28,0,530,
	529,1,0,0,0,530,531,1,0,0,0,531,532,1,0,0,0,532,533,5,71,0,0,533,51,1,0,
	0,0,534,539,3,54,27,0,535,536,5,75,0,0,536,538,3,54,27,0,537,535,1,0,0,
	0,538,541,1,0,0,0,539,537,1,0,0,0,539,540,1,0,0,0,540,53,1,0,0,0,541,539,
	1,0,0,0,542,544,3,128,64,0,543,542,1,0,0,0,544,547,1,0,0,0,545,543,1,0,
	0,0,545,546,1,0,0,0,546,548,1,0,0,0,547,545,1,0,0,0,548,550,5,115,0,0,549,
	551,3,230,115,0,550,549,1,0,0,0,550,551,1,0,0,0,551,553,1,0,0,0,552,554,
	3,60,30,0,553,552,1,0,0,0,553,554,1,0,0,0,554,55,1,0,0,0,555,559,5,74,0,
	0,556,558,3,64,32,0,557,556,1,0,0,0,558,561,1,0,0,0,559,557,1,0,0,0,559,
	560,1,0,0,0,560,57,1,0,0,0,561,559,1,0,0,0,562,563,5,34,0,0,563,565,5,115,
	0,0,564,566,3,44,22,0,565,564,1,0,0,0,565,566,1,0,0,0,566,569,1,0,0,0,567,
	568,5,23,0,0,568,570,3,220,110,0,569,567,1,0,0,0,569,570,1,0,0,0,570,571,
	1,0,0,0,571,572,3,62,31,0,572,59,1,0,0,0,573,577,5,70,0,0,574,576,3,64,
	32,0,575,574,1,0,0,0,576,579,1,0,0,0,577,575,1,0,0,0,577,578,1,0,0,0,578,
	580,1,0,0,0,579,577,1,0,0,0,580,581,5,71,0,0,581,61,1,0,0,0,582,586,5,70,
	0,0,583,585,3,82,41,0,584,583,1,0,0,0,585,588,1,0,0,0,586,584,1,0,0,0,586,
	587,1,0,0,0,587,589,1,0,0,0,588,586,1,0,0,0,589,590,5,71,0,0,590,63,1,0,
	0,0,591,605,5,74,0,0,592,605,3,32,16,0,593,595,5,44,0,0,594,593,1,0,0,0,
	594,595,1,0,0,0,595,596,1,0,0,0,596,605,3,154,77,0,597,599,3,36,18,0,598,
	597,1,0,0,0,599,602,1,0,0,0,600,598,1,0,0,0,600,601,1,0,0,0,601,603,1,0,
	0,0,602,600,1,0,0,0,603,605,3,66,33,0,604,591,1,0,0,0,604,592,1,0,0,0,604,
	594,1,0,0,0,604,600,1,0,0,0,605,65,1,0,0,0,606,616,3,68,34,0,607,616,3,
	74,37,0,608,616,3,80,40,0,609,616,3,78,39,0,610,616,3,76,38,0,611,616,3,
	58,29,0,612,616,3,138,69,0,613,616,3,42,21,0,614,616,3,50,25,0,615,606,
	1,0,0,0,615,607,1,0,0,0,615,608,1,0,0,0,615,609,1,0,0,0,615,610,1,0,0,0,
	615,611,1,0,0,0,615,612,1,0,0,0,615,613,1,0,0,0,615,614,1,0,0,0,616,67,
	1,0,0,0,617,618,3,72,36,0,618,619,5,115,0,0,619,624,3,110,55,0,620,621,
	5,72,0,0,621,623,5,73,0,0,622,620,1,0,0,0,623,626,1,0,0,0,624,622,1,0,0,
	0,624,625,1,0,0,0,625,629,1,0,0,0,626,624,1,0,0,0,627,628,5,51,0,0,628,
	630,3,108,54,0,629,627,1,0,0,0,629,630,1,0,0,0,630,631,1,0,0,0,631,632,
	3,70,35,0,632,69,1,0,0,0,633,636,3,154,77,0,634,636,5,74,0,0,635,633,1,
	0,0,0,635,634,1,0,0,0,636,71,1,0,0,0,637,640,3,222,111,0,638,640,5,55,0,
	0,639,637,1,0,0,0,639,638,1,0,0,0,640,73,1,0,0,0,641,642,3,44,22,0,642,
	643,3,68,34,0,643,75,1,0,0,0,644,645,3,44,22,0,645,646,3,78,39,0,646,77,
	1,0,0,0,647,648,5,115,0,0,648,651,3,110,55,0,649,650,5,51,0,0,650,652,3,
	108,54,0,651,649,1,0,0,0,651,652,1,0,0,0,652,653,1,0,0,0,653,654,3,154,
	77,0,654,79,1,0,0,0,655,656,3,222,111,0,656,657,3,96,48,0,657,658,5,74,
	0,0,658,81,1,0,0,0,659,661,3,36,18,0,660,659,1,0,0,0,661,664,1,0,0,0,662,
	660,1,0,0,0,662,663,1,0,0,0,663,665,1,0,0,0,664,662,1,0,0,0,665,668,3,84,
	42,0,666,668,5,74,0,0,667,662,1,0,0,0,667,666,1,0,0,0,668,83,1,0,0,0,669,
	677,3,86,43,0,670,677,3,90,45,0,671,677,3,94,47,0,672,677,3,58,29,0,673,
	677,3,138,69,0,674,677,3,42,21,0,675,677,3,50,25,0,676,669,1,0,0,0,676,
	670,1,0,0,0,676,671,1,0,0,0,676,672,1,0,0,0,676,673,1,0,0,0,676,674,1,0,
	0,0,676,675,1,0,0,0,677,85,1,0,0,0,678,679,3,222,111,0,679,684,3,88,44,
	0,680,681,5,75,0,0,681,683,3,88,44,0,682,680,1,0,0,0,683,686,1,0,0,0,684,
	682,1,0,0,0,684,685,1,0,0,0,685,687,1,0,0,0,686,684,1,0,0,0,687,688,5,74,
	0,0,688,87,1,0,0,0,689,694,5,115,0,0,690,691,5,72,0,0,691,693,5,73,0,0,
	692,690,1,0,0,0,693,696,1,0,0,0,694,692,1,0,0,0,694,695,1,0,0,0,695,697,
	1,0,0,0,696,694,1,0,0,0,697,698,5,77,0,0,698,699,3,100,50,0,699,89,1,0,
	0,0,700,702,3,92,46,0,701,700,1,0,0,0,702,705,1,0,0,0,703,701,1,0,0,0,703,
	704,1,0,0,0,704,716,1,0,0,0,705,703,1,0,0,0,706,717,3,72,36,0,707,711,3,
	44,22,0,708,710,3,128,64,0,709,708,1,0,0,0,710,713,1,0,0,0,711,709,1,0,
	0,0,711,712,1,0,0,0,712,714,1,0,0,0,713,711,1,0,0,0,714,715,3,72,36,0,715,
	717,1,0,0,0,716,706,1,0,0,0,716,707,1,0,0,0,717,718,1,0,0,0,718,719,5,115,
	0,0,719,724,3,110,55,0,720,721,5,72,0,0,721,723,5,73,0,0,722,720,1,0,0,
	0,723,726,1,0,0,0,724,722,1,0,0,0,724,725,1,0,0,0,725,729,1,0,0,0,726,724,
	1,0,0,0,727,728,5,51,0,0,728,730,3,108,54,0,729,727,1,0,0,0,729,730,1,0,
	0,0,730,731,1,0,0,0,731,732,3,70,35,0,732,91,1,0,0,0,733,740,3,128,64,0,
	734,740,5,41,0,0,735,740,5,7,0,0,736,740,5,18,0,0,737,740,5,44,0,0,738,
	740,5,45,0,0,739,733,1,0,0,0,739,734,1,0,0,0,739,735,1,0,0,0,739,736,1,
	0,0,0,739,737,1,0,0,0,739,738,1,0,0,0,740,93,1,0,0,0,741,742,3,44,22,0,
	742,743,3,90,45,0,743,95,1,0,0,0,744,749,3,98,49,0,745,746,5,75,0,0,746,
	748,3,98,49,0,747,745,1,0,0,0,748,751,1,0,0,0,749,747,1,0,0,0,749,750,1,
	0,0,0,750,97,1,0,0,0,751,749,1,0,0,0,752,755,3,10,5,0,753,754,5,77,0,0,
	754,756,3,100,50,0,755,753,1,0,0,0,755,756,1,0,0,0,756,99,1,0,0,0,757,760,
	3,102,51,0,758,760,3,190,95,0,759,757,1,0,0,0,759,758,1,0,0,0,760,101,1,
	0,0,0,761,773,5,70,0,0,762,767,3,100,50,0,763,764,5,75,0,0,764,766,3,100,
	50,0,765,763,1,0,0,0,766,769,1,0,0,0,767,765,1,0,0,0,767,768,1,0,0,0,768,
	771,1,0,0,0,769,767,1,0,0,0,770,772,5,75,0,0,771,770,1,0,0,0,771,772,1,
	0,0,0,772,774,1,0,0,0,773,762,1,0,0,0,773,774,1,0,0,0,774,775,1,0,0,0,775,
	776,5,71,0,0,776,103,1,0,0,0,777,779,5,115,0,0,778,780,3,224,112,0,779,
	778,1,0,0,0,779,780,1,0,0,0,780,788,1,0,0,0,781,782,5,76,0,0,782,784,5,
	115,0,0,783,785,3,224,112,0,784,783,1,0,0,0,784,785,1,0,0,0,785,787,1,0,
	0,0,786,781,1,0,0,0,787,790,1,0,0,0,788,786,1,0,0,0,788,789,1,0,0,0,789,
	105,1,0,0,0,790,788,1,0,0,0,791,798,3,222,111,0,792,795,5,82,0,0,793,794,
	7,1,0,0,794,796,3,222,111,0,795,793,1,0,0,0,795,796,1,0,0,0,796,798,1,0,
	0,0,797,791,1,0,0,0,797,792,1,0,0,0,798,107,1,0,0,0,799,804,3,22,11,0,800,
	801,5,75,0,0,801,803,3,22,11,0,802,800,1,0,0,0,803,806,1,0,0,0,804,802,
	1,0,0,0,804,805,1,0,0,0,805,109,1,0,0,0,806,804,1,0,0,0,807,809,5,68,0,
	0,808,810,3,112,56,0,809,808,1,0,0,0,809,810,1,0,0,0,810,811,1,0,0,0,811,
	812,5,69,0,0,812,111,1,0,0,0,813,818,3,114,57,0,814,815,5,75,0,0,815,817,
	3,114,57,0,816,814,1,0,0,0,817,820,1,0,0,0,818,816,1,0,0,0,818,819,1,0,
	0,0,819,823,1,0,0,0,820,818,1,0,0,0,821,822,5,75,0,0,822,824,3,116,58,0,
	823,821,1,0,0,0,823,824,1,0,0,0,824,827,1,0,0,0,825,827,3,116,58,0,826,
	813,1,0,0,0,826,825,1,0,0,0,827,113,1,0,0,0,828,830,3,40,20,0,829,828,1,
	0,0,0,830,833,1,0,0,0,831,829,1,0,0,0,831,832,1,0,0,0,832,834,1,0,0,0,833,
	831,1,0,0,0,834,835,3,222,111,0,835,836,3,10,5,0,836,115,1,0,0,0,837,839,
	3,40,20,0,838,837,1,0,0,0,839,842,1,0,0,0,840,838,1,0,0,0,840,841,1,0,0,
	0,841,843,1,0,0,0,842,840,1,0,0,0,843,844,3,222,111,0,844,845,5,114,0,0,
	845,846,3,10,5,0,846,117,1,0,0,0,847,848,5,65,0,0,848,119,1,0,0,0,849,850,
	5,66,0,0,850,121,1,0,0,0,851,854,3,118,59,0,852,854,3,120,60,0,853,851,
	1,0,0,0,853,852,1,0,0,0,854,123,1,0,0,0,855,856,7,2,0,0,856,125,1,0,0,0,
	857,858,7,3,0,0,858,127,1,0,0,0,859,860,5,113,0,0,860,867,3,22,11,0,861,
	864,5,68,0,0,862,865,3,130,65,0,863,865,3,134,67,0,864,862,1,0,0,0,864,
	863,1,0,0,0,864,865,1,0,0,0,865,866,1,0,0,0,866,868,5,69,0,0,867,861,1,
	0,0,0,867,868,1,0,0,0,868,129,1,0,0,0,869,874,3,132,66,0,870,871,5,75,0,
	0,871,873,3,132,66,0,872,870,1,0,0,0,873,876,1,0,0,0,874,872,1,0,0,0,874,
	875,1,0,0,0,875,131,1,0,0,0,876,874,1,0,0,0,877,878,5,115,0,0,878,879,5,
	77,0,0,879,880,3,134,67,0,880,133,1,0,0,0,881,885,3,190,95,0,882,885,3,
	128,64,0,883,885,3,136,68,0,884,881,1,0,0,0,884,882,1,0,0,0,884,883,1,0,
	0,0,885,135,1,0,0,0,886,895,5,70,0,0,887,892,3,134,67,0,888,889,5,75,0,
	0,889,891,3,134,67,0,890,888,1,0,0,0,891,894,1,0,0,0,892,890,1,0,0,0,892,
	893,1,0,0,0,893,896,1,0,0,0,894,892,1,0,0,0,895,887,1,0,0,0,895,896,1,0,
	0,0,896,898,1,0,0,0,897,899,5,75,0,0,898,897,1,0,0,0,898,899,1,0,0,0,899,
	900,1,0,0,0,900,901,5,71,0,0,901,137,1,0,0,0,902,903,5,113,0,0,903,904,
	5,34,0,0,904,905,5,115,0,0,905,906,3,140,70,0,906,139,1,0,0,0,907,911,5,
	70,0,0,908,910,3,142,71,0,909,908,1,0,0,0,910,913,1,0,0,0,911,909,1,0,0,
	0,911,912,1,0,0,0,912,914,1,0,0,0,913,911,1,0,0,0,914,915,5,71,0,0,915,
	141,1,0,0,0,916,918,3,36,18,0,917,916,1,0,0,0,918,921,1,0,0,0,919,917,1,
	0,0,0,919,920,1,0,0,0,920,922,1,0,0,0,921,919,1,0,0,0,922,925,3,144,72,
	0,923,925,5,74,0,0,924,919,1,0,0,0,924,923,1,0,0,0,925,143,1,0,0,0,926,
	927,3,222,111,0,927,928,3,146,73,0,928,929,5,74,0,0,929,947,1,0,0,0,930,
	932,3,42,21,0,931,933,5,74,0,0,932,931,1,0,0,0,932,933,1,0,0,0,933,947,
	1,0,0,0,934,936,3,58,29,0,935,937,5,74,0,0,936,935,1,0,0,0,936,937,1,0,
	0,0,937,947,1,0,0,0,938,940,3,50,25,0,939,941,5,74,0,0,940,939,1,0,0,0,
	940,941,1,0,0,0,941,947,1,0,0,0,942,944,3,138,69,0,943,945,5,74,0,0,944,
	943,1,0,0,0,944,945,1,0,0,0,945,947,1,0,0,0,946,926,1,0,0,0,946,930,1,0,
	0,0,946,934,1,0,0,0,946,938,1,0,0,0,946,942,1,0,0,0,947,145,1,0,0,0,948,
	951,3,148,74,0,949,951,3,150,75,0,950,948,1,0,0,0,950,949,1,0,0,0,951,147,
	1,0,0,0,952,953,5,115,0,0,953,954,5,68,0,0,954,956,5,69,0,0,955,957,3,152,
	76,0,956,955,1,0,0,0,956,957,1,0,0,0,957,149,1,0,0,0,958,959,3,96,48,0,
	959,151,1,0,0,0,960,961,5,18,0,0,961,962,3,134,67,0,962,153,1,0,0,0,963,
	967,5,70,0,0,964,966,3,156,78,0,965,964,1,0,0,0,966,969,1,0,0,0,967,965,
	1,0,0,0,967,968,1,0,0,0,968,970,1,0,0,0,969,967,1,0,0,0,970,971,5,71,0,
	0,971,155,1,0,0,0,972,973,3,158,79,0,973,974,5,74,0,0,974,978,1,0,0,0,975,
	978,3,162,81,0,976,978,3,160,80,0,977,972,1,0,0,0,977,975,1,0,0,0,977,976,
	1,0,0,0,978,157,1,0,0,0,979,981,3,40,20,0,980,979,1,0,0,0,981,984,1,0,0,
	0,982,980,1,0,0,0,982,983,1,0,0,0,983,985,1,0,0,0,984,982,1,0,0,0,985,986,
	3,222,111,0,986,987,3,96,48,0,987,159,1,0,0,0,988,990,3,38,19,0,989,988,
	1,0,0,0,990,993,1,0,0,0,991,989,1,0,0,0,991,992,1,0,0,0,992,996,1,0,0,0,
	993,991,1,0,0,0,994,997,3,42,21,0,995,997,3,58,29,0,996,994,1,0,0,0,996,
	995,1,0,0,0,997,1000,1,0,0,0,998,1000,5,74,0,0,999,991,1,0,0,0,999,998,
	1,0,0,0,1000,161,1,0,0,0,1001,1106,3,154,77,0,1002,1003,5,8,0,0,1003,1006,
	3,190,95,0,1004,1005,5,83,0,0,1005,1007,3,190,95,0,1006,1004,1,0,0,0,1006,
	1007,1,0,0,0,1007,1008,1,0,0,0,1008,1009,5,74,0,0,1009,1106,1,0,0,0,1010,
	1011,5,28,0,0,1011,1012,3,186,93,0,1012,1015,3,162,81,0,1013,1014,5,21,
	0,0,1014,1016,3,162,81,0,1015,1013,1,0,0,0,1015,1016,1,0,0,0,1016,1106,
	1,0,0,0,1017,1018,5,27,0,0,1018,1019,5,68,0,0,1019,1020,3,180,90,0,1020,
	1021,5,69,0,0,1021,1022,3,162,81,0,1022,1106,1,0,0,0,1023,1024,5,57,0,0,
	1024,1025,3,186,93,0,1025,1026,3,162,81,0,1026,1106,1,0,0,0,1027,1028,5,
	19,0,0,1028,1029,3,162,81,0,1029,1030,5,57,0,0,1030,1031,3,186,93,0,1031,
	1032,5,74,0,0,1032,1106,1,0,0,0,1033,1034,5,53,0,0,1034,1044,3,154,77,0,
	1035,1037,3,164,82,0,1036,1035,1,0,0,0,1037,1038,1,0,0,0,1038,1036,1,0,
	0,0,1038,1039,1,0,0,0,1039,1041,1,0,0,0,1040,1042,3,168,84,0,1041,1040,
	1,0,0,0,1041,1042,1,0,0,0,1042,1045,1,0,0,0,1043,1045,3,168,84,0,1044,1036,
	1,0,0,0,1044,1043,1,0,0,0,1045,1106,1,0,0,0,1046,1047,5,53,0,0,1047,1048,
	3,170,85,0,1048,1052,3,154,77,0,1049,1051,3,164,82,0,1050,1049,1,0,0,0,
	1051,1054,1,0,0,0,1052,1050,1,0,0,0,1052,1053,1,0,0,0,1053,1056,1,0,0,0,
	1054,1052,1,0,0,0,1055,1057,3,168,84,0,1056,1055,1,0,0,0,1056,1057,1,0,
	0,0,1057,1106,1,0,0,0,1058,1059,5,47,0,0,1059,1060,3,186,93,0,1060,1064,
	5,70,0,0,1061,1063,3,176,88,0,1062,1061,1,0,0,0,1063,1066,1,0,0,0,1064,
	1062,1,0,0,0,1064,1065,1,0,0,0,1065,1070,1,0,0,0,1066,1064,1,0,0,0,1067,
	1069,3,178,89,0,1068,1067,1,0,0,0,1069,1072,1,0,0,0,1070,1068,1,0,0,0,1070,
	1071,1,0,0,0,1071,1073,1,0,0,0,1072,1070,1,0,0,0,1073,1074,5,71,0,0,1074,
	1106,1,0,0,0,1075,1076,5,48,0,0,1076,1077,3,186,93,0,1077,1078,3,154,77,
	0,1078,1106,1,0,0,0,1079,1081,5,42,0,0,1080,1082,3,190,95,0,1081,1080,1,
	0,0,0,1081,1082,1,0,0,0,1082,1083,1,0,0,0,1083,1106,5,74,0,0,1084,1085,
	5,50,0,0,1085,1086,3,190,95,0,1086,1087,5,74,0,0,1087,1106,1,0,0,0,1088,
	1090,5,10,0,0,1089,1091,5,115,0,0,1090,1089,1,0,0,0,1090,1091,1,0,0,0,1091,
	1092,1,0,0,0,1092,1106,5,74,0,0,1093,1095,5,17,0,0,1094,1096,5,115,0,0,
	1095,1094,1,0,0,0,1095,1096,1,0,0,0,1096,1097,1,0,0,0,1097,1106,5,74,0,
	0,1098,1106,5,74,0,0,1099,1100,3,190,95,0,1100,1101,5,74,0,0,1101,1106,
	1,0,0,0,1102,1103,5,115,0,0,1103,1104,5,83,0,0,1104,1106,3,162,81,0,1105,
	1001,1,0,0,0,1105,1002,1,0,0,0,1105,1010,1,0,0,0,1105,1017,1,0,0,0,1105,
	1023,1,0,0,0,1105,1027,1,0,0,0,1105,1033,1,0,0,0,1105,1046,1,0,0,0,1105,
	1058,1,0,0,0,1105,1075,1,0,0,0,1105,1079,1,0,0,0,1105,1084,1,0,0,0,1105,
	1088,1,0,0,0,1105,1093,1,0,0,0,1105,1098,1,0,0,0,1105,1099,1,0,0,0,1105,
	1102,1,0,0,0,1106,163,1,0,0,0,1107,1108,5,13,0,0,1108,1112,5,68,0,0,1109,
	1111,3,40,20,0,1110,1109,1,0,0,0,1111,1114,1,0,0,0,1112,1110,1,0,0,0,1112,
	1113,1,0,0,0,1113,1115,1,0,0,0,1114,1112,1,0,0,0,1115,1116,3,166,83,0,1116,
	1117,5,115,0,0,1117,1118,5,69,0,0,1118,1119,3,154,77,0,1119,165,1,0,0,0,
	1120,1125,3,22,11,0,1121,1122,5,97,0,0,1122,1124,3,22,11,0,1123,1121,1,
	0,0,0,1124,1127,1,0,0,0,1125,1123,1,0,0,0,1125,1126,1,0,0,0,1126,167,1,
	0,0,0,1127,1125,1,0,0,0,1128,1129,5,25,0,0,1129,1130,3,154,77,0,1130,169,
	1,0,0,0,1131,1132,5,68,0,0,1132,1134,3,172,86,0,1133,1135,5,74,0,0,1134,
	1133,1,0,0,0,1134,1135,1,0,0,0,1135,1136,1,0,0,0,1136,1137,5,69,0,0,1137,
	171,1,0,0,0,1138,1143,3,174,87,0,1139,1140,5,74,0,0,1140,1142,3,174,87,
	0,1141,1139,1,0,0,0,1142,1145,1,0,0,0,1143,1141,1,0,0,0,1143,1144,1,0,0,
	0,1144,173,1,0,0,0,1145,1143,1,0,0,0,1146,1148,3,40,20,0,1147,1146,1,0,
	0,0,1148,1151,1,0,0,0,1149,1147,1,0,0,0,1149,1150,1,0,0,0,1150,1152,1,0,
	0,0,1151,1149,1,0,0,0,1152,1153,3,104,52,0,1153,1154,3,10,5,0,1154,1155,
	5,77,0,0,1155,1156,3,190,95,0,1156,175,1,0,0,0,1157,1159,3,178,89,0,1158,
	1157,1,0,0,0,1159,1160,1,0,0,0,1160,1158,1,0,0,0,1160,1161,1,0,0,0,1161,
	1163,1,0,0,0,1162,1164,3,156,78,0,1163,1162,1,0,0,0,1164,1165,1,0,0,0,1165,
	1163,1,0,0,0,1165,1166,1,0,0,0,1166,177,1,0,0,0,1167,1170,5,12,0,0,1168,
	1171,3,190,95,0,1169,1171,5,115,0,0,1170,1168,1,0,0,0,1170,1169,1,0,0,0,
	1171,1172,1,0,0,0,1172,1176,5,83,0,0,1173,1174,5,18,0,0,1174,1176,5,83,
	0,0,1175,1167,1,0,0,0,1175,1173,1,0,0,0,1176,179,1,0,0,0,1177,1190,3,184,
	92,0,1178,1180,3,182,91,0,1179,1178,1,0,0,0,1179,1180,1,0,0,0,1180,1181,
	1,0,0,0,1181,1183,5,74,0,0,1182,1184,3,190,95,0,1183,1182,1,0,0,0,1183,
	1184,1,0,0,0,1184,1185,1,0,0,0,1185,1187,5,74,0,0,1186,1188,3,188,94,0,
	1187,1186,1,0,0,0,1187,1188,1,0,0,0,1188,1190,1,0,0,0,1189,1177,1,0,0,0,
	1189,1179,1,0,0,0,1190,181,1,0,0,0,1191,1194,3,158,79,0,1192,1194,3,188,
	94,0,1193,1191,1,0,0,0,1193,1192,1,0,0,0,1194,183,1,0,0,0,1195,1197,3,40,
	20,0,1196,1195,1,0,0,0,1197,1200,1,0,0,0,1198,1196,1,0,0,0,1198,1199,1,
	0,0,0,1199,1201,1,0,0,0,1200,1198,1,0,0,0,1201,1202,3,222,111,0,1202,1203,
	3,10,5,0,1203,1204,5,83,0,0,1204,1205,3,190,95,0,1205,185,1,0,0,0,1206,
	1207,5,68,0,0,1207,1208,3,190,95,0,1208,1209,5,69,0,0,1209,187,1,0,0,0,
	1210,1215,3,190,95,0,1211,1212,5,75,0,0,1212,1214,3,190,95,0,1213,1211,
	1,0,0,0,1214,1217,1,0,0,0,1215,1213,1,0,0,0,1215,1216,1,0,0,0,1216,189,
	1,0,0,0,1217,1215,1,0,0,0,1218,1219,6,95,-1,0,1219,1250,3,198,99,0,1220,
	1250,3,14,7,0,1221,1222,5,37,0,0,1222,1250,3,202,101,0,1223,1224,5,68,0,
	0,1224,1225,3,222,111,0,1225,1226,5,69,0,0,1226,1227,3,190,95,21,1227,1250,
	1,0,0,0,1228,1229,7,4,0,0,1229,1250,3,190,95,19,1230,1231,7,5,0,0,1231,
	1250,3,190,95,18,1232,1250,3,192,96,0,1233,1234,3,222,111,0,1234,1240,5,
	112,0,0,1235,1237,3,224,112,0,1236,1235,1,0,0,0,1236,1237,1,0,0,0,1237,
	1238,1,0,0,0,1238,1241,5,115,0,0,1239,1241,5,37,0,0,1240,1236,1,0,0,0,1240,
	1239,1,0,0,0,1241,1250,1,0,0,0,1242,1243,3,200,100,0,1243,1245,5,112,0,
	0,1244,1246,3,224,112,0,1245,1244,1,0,0,0,1245,1246,1,0,0,0,1246,1247,1,
	0,0,0,1247,1248,5,37,0,0,1248,1250,1,0,0,0,1249,1218,1,0,0,0,1249,1220,
	1,0,0,0,1249,1221,1,0,0,0,1249,1223,1,0,0,0,1249,1228,1,0,0,0,1249,1230,
	1,0,0,0,1249,1232,1,0,0,0,1249,1233,1,0,0,0,1249,1242,1,0,0,0,1250,1331,
	1,0,0,0,1251,1252,10,17,0,0,1252,1253,7,6,0,0,1253,1330,3,190,95,18,1254,
	1255,10,16,0,0,1255,1256,7,7,0,0,1256,1330,3,190,95,17,1257,1265,10,15,
	0,0,1258,1259,5,79,0,0,1259,1266,5,79,0,0,1260,1261,5,78,0,0,1261,1262,
	5,78,0,0,1262,1266,5,78,0,0,1263,1264,5,78,0,0,1264,1266,5,78,0,0,1265,
	1258,1,0,0,0,1265,1260,1,0,0,0,1265,1263,1,0,0,0,1266,1267,1,0,0,0,1267,
	1330,3,190,95,16,1268,1269,10,14,0,0,1269,1270,7,8,0,0,1270,1330,3,190,
	95,15,1271,1272,10,12,0,0,1272,1273,7,9,0,0,1273,1330,3,190,95,13,1274,
	1275,10,11,0,0,1275,1276,5,96,0,0,1276,1330,3,190,95,12,1277,1278,10,10,
	0,0,1278,1279,5,98,0,0,1279,1330,3,190,95,11,1280,1281,10,9,0,0,1281,1282,
	5,97,0,0,1282,1330,3,190,95,10,1283,1284,10,8,0,0,1284,1285,5,88,0,0,1285,
	1330,3,190,95,9,1286,1287,10,7,0,0,1287,1288,5,89,0,0,1288,1330,3,190,95,
	8,1289,1290,10,6,0,0,1290,1291,5,82,0,0,1291,1292,3,190,95,0,1292,1293,
	5,83,0,0,1293,1294,3,190,95,7,1294,1330,1,0,0,0,1295,1296,10,5,0,0,1296,
	1297,7,10,0,0,1297,1330,3,190,95,5,1298,1299,10,25,0,0,1299,1311,5,76,0,
	0,1300,1312,5,115,0,0,1301,1312,3,14,7,0,1302,1312,5,49,0,0,1303,1305,5,
	37,0,0,1304,1306,3,218,109,0,1305,1304,1,0,0,0,1305,1306,1,0,0,0,1306,1307,
	1,0,0,0,1307,1312,3,206,103,0,1308,1309,5,46,0,0,1309,1312,3,226,113,0,
	1310,1312,3,212,106,0,1311,1300,1,0,0,0,1311,1301,1,0,0,0,1311,1302,1,0,
	0,0,1311,1303,1,0,0,0,1311,1308,1,0,0,0,1311,1310,1,0,0,0,1312,1330,1,0,
	0,0,1313,1314,10,24,0,0,1314,1315,5,72,0,0,1315,1316,3,190,95,0,1316,1317,
	5,73,0,0,1317,1330,1,0,0,0,1318,1319,10,20,0,0,1319,1330,7,11,0,0,1320,
	1321,10,13,0,0,1321,1322,5,32,0,0,1322,1330,3,222,111,0,1323,1324,10,3,
	0,0,1324,1326,5,112,0,0,1325,1327,3,224,112,0,1326,1325,1,0,0,0,1326,1327,
	1,0,0,0,1327,1328,1,0,0,0,1328,1330,5,115,0,0,1329,1251,1,0,0,0,1329,1254,
	1,0,0,0,1329,1257,1,0,0,0,1329,1268,1,0,0,0,1329,1271,1,0,0,0,1329,1274,
	1,0,0,0,1329,1277,1,0,0,0,1329,1280,1,0,0,0,1329,1283,1,0,0,0,1329,1286,
	1,0,0,0,1329,1289,1,0,0,0,1329,1295,1,0,0,0,1329,1298,1,0,0,0,1329,1313,
	1,0,0,0,1329,1318,1,0,0,0,1329,1320,1,0,0,0,1329,1323,1,0,0,0,1330,1333,
	1,0,0,0,1331,1329,1,0,0,0,1331,1332,1,0,0,0,1332,191,1,0,0,0,1333,1331,
	1,0,0,0,1334,1335,3,194,97,0,1335,1336,5,111,0,0,1336,1337,3,196,98,0,1337,
	193,1,0,0,0,1338,1355,5,115,0,0,1339,1341,5,68,0,0,1340,1342,3,112,56,0,
	1341,1340,1,0,0,0,1341,1342,1,0,0,0,1342,1343,1,0,0,0,1343,1355,5,69,0,
	0,1344,1345,5,68,0,0,1345,1350,5,115,0,0,1346,1347,5,75,0,0,1347,1349,5,
	115,0,0,1348,1346,1,0,0,0,1349,1352,1,0,0,0,1350,1348,1,0,0,0,1350,1351,
	1,0,0,0,1351,1353,1,0,0,0,1352,1350,1,0,0,0,1353,1355,5,69,0,0,1354,1338,
	1,0,0,0,1354,1339,1,0,0,0,1354,1344,1,0,0,0,1355,195,1,0,0,0,1356,1359,
	3,190,95,0,1357,1359,3,154,77,0,1358,1356,1,0,0,0,1358,1357,1,0,0,0,1359,
	197,1,0,0,0,1360,1361,5,68,0,0,1361,1362,3,190,95,0,1362,1363,5,69,0,0,
	1363,1379,1,0,0,0,1364,1379,5,49,0,0,1365,1379,5,46,0,0,1366,1379,3,24,
	12,0,1367,1379,5,115,0,0,1368,1369,3,72,36,0,1369,1370,5,76,0,0,1370,1371,
	5,15,0,0,1371,1379,1,0,0,0,1372,1376,3,218,109,0,1373,1377,3,228,114,0,
	1374,1375,5,49,0,0,1375,1377,3,230,115,0,1376,1373,1,0,0,0,1376,1374,1,
	0,0,0,1377,1379,1,0,0,0,1378,1360,1,0,0,0,1378,1364,1,0,0,0,1378,1365,1,
	0,0,0,1378,1366,1,0,0,0,1378,1367,1,0,0,0,1378,1368,1,0,0,0,1378,1372,1,
	0,0,0,1379,199,1,0,0,0,1380,1381,3,104,52,0,1381,1382,5,76,0,0,1382,1384,
	1,0,0,0,1383,1380,1,0,0,0,1383,1384,1,0,0,0,1384,1388,1,0,0,0,1385,1387,
	3,128,64,0,1386,1385,1,0,0,0,1387,1390,1,0,0,0,1388,1386,1,0,0,0,1388,1389,
	1,0,0,0,1389,1391,1,0,0,0,1390,1388,1,0,0,0,1391,1393,5,115,0,0,1392,1394,
	3,224,112,0,1393,1392,1,0,0,0,1393,1394,1,0,0,0,1394,201,1,0,0,0,1395,1396,
	3,218,109,0,1396,1397,3,204,102,0,1397,1398,3,210,105,0,1398,1405,1,0,0,
	0,1399,1402,3,204,102,0,1400,1403,3,208,104,0,1401,1403,3,210,105,0,1402,
	1400,1,0,0,0,1402,1401,1,0,0,0,1403,1405,1,0,0,0,1404,1395,1,0,0,0,1404,
	1399,1,0,0,0,1405,203,1,0,0,0,1406,1408,5,115,0,0,1407,1409,3,214,107,0,
	1408,1407,1,0,0,0,1408,1409,1,0,0,0,1409,1417,1,0,0,0,1410,1411,5,76,0,
	0,1411,1413,5,115,0,0,1412,1414,3,214,107,0,1413,1412,1,0,0,0,1413,1414,
	1,0,0,0,1414,1416,1,0,0,0,1415,1410,1,0,0,0,1416,1419,1,0,0,0,1417,1415,
	1,0,0,0,1417,1418,1,0,0,0,1418,1422,1,0,0,0,1419,1417,1,0,0,0,1420,1422,
	3,18,9,0,1421,1406,1,0,0,0,1421,1420,1,0,0,0,1422,205,1,0,0,0,1423,1425,
	5,115,0,0,1424,1426,3,216,108,0,1425,1424,1,0,0,0,1425,1426,1,0,0,0,1426,
	1427,1,0,0,0,1427,1428,3,210,105,0,1428,207,1,0,0,0,1429,1457,5,72,0,0,
	1430,1435,5,73,0,0,1431,1432,5,72,0,0,1432,1434,5,73,0,0,1433,1431,1,0,
	0,0,1434,1437,1,0,0,0,1435,1433,1,0,0,0,1435,1436,1,0,0,0,1436,1438,1,0,
	0,0,1437,1435,1,0,0,0,1438,1458,3,102,51,0,1439,1440,3,190,95,0,1440,1447,
	5,73,0,0,1441,1442,5,72,0,0,1442,1443,3,190,95,0,1443,1444,5,73,0,0,1444,
	1446,1,0,0,0,1445,1441,1,0,0,0,1446,1449,1,0,0,0,1447,1445,1,0,0,0,1447,
	1448,1,0,0,0,1448,1454,1,0,0,0,1449,1447,1,0,0,0,1450,1451,5,72,0,0,1451,
	1453,5,73,0,0,1452,1450,1,0,0,0,1453,1456,1,0,0,0,1454,1452,1,0,0,0,1454,
	1455,1,0,0,0,1455,1458,1,0,0,0,1456,1454,1,0,0,0,1457,1430,1,0,0,0,1457,
	1439,1,0,0,0,1458,209,1,0,0,0,1459,1461,3,230,115,0,1460,1462,3,60,30,0,
	1461,1460,1,0,0,0,1461,1462,1,0,0,0,1462,211,1,0,0,0,1463,1464,3,218,109,
	0,1464,1465,3,228,114,0,1465,213,1,0,0,0,1466,1467,5,79,0,0,1467,1470,5,
	78,0,0,1468,1470,3,224,112,0,1469,1466,1,0,0,0,1469,1468,1,0,0,0,1470,215,
	1,0,0,0,1471,1472,5,79,0,0,1472,1475,5,78,0,0,1473,1475,3,218,109,0,1474,
	1471,1,0,0,0,1474,1473,1,0,0,0,1475,217,1,0,0,0,1476,1477,5,79,0,0,1477,
	1478,3,220,110,0,1478,1479,5,78,0,0,1479,219,1,0,0,0,1480,1485,3,222,111,
	0,1481,1482,5,75,0,0,1482,1484,3,222,111,0,1483,1481,1,0,0,0,1484,1487,
	1,0,0,0,1485,1483,1,0,0,0,1485,1486,1,0,0,0,1486,221,1,0,0,0,1487,1485,
	1,0,0,0,1488,1490,3,128,64,0,1489,1488,1,0,0,0,1489,1490,1,0,0,0,1490,1494,
	1,0,0,0,1491,1495,3,104,52,0,1492,1495,3,18,9,0,1493,1495,5,54,0,0,1494,
	1491,1,0,0,0,1494,1492,1,0,0,0,1494,1493,1,0,0,0,1495,1500,1,0,0,0,1496,
	1497,5,72,0,0,1497,1499,5,73,0,0,1498,1496,1,0,0,0,1499,1502,1,0,0,0,1500,
	1498,1,0,0,0,1500,1501,1,0,0,0,1501,223,1,0,0,0,1502,1500,1,0,0,0,1503,
	1504,5,79,0,0,1504,1509,3,106,53,0,1505,1506,5,75,0,0,1506,1508,3,106,53,
	0,1507,1505,1,0,0,0,1508,1511,1,0,0,0,1509,1507,1,0,0,0,1509,1510,1,0,0,
	0,1510,1512,1,0,0,0,1511,1509,1,0,0,0,1512,1513,5,78,0,0,1513,225,1,0,0,
	0,1514,1521,3,230,115,0,1515,1516,5,76,0,0,1516,1518,5,115,0,0,1517,1519,
	3,230,115,0,1518,1517,1,0,0,0,1518,1519,1,0,0,0,1519,1521,1,0,0,0,1520,
	1514,1,0,0,0,1520,1515,1,0,0,0,1521,227,1,0,0,0,1522,1523,5,46,0,0,1523,
	1527,3,226,113,0,1524,1525,5,115,0,0,1525,1527,3,230,115,0,1526,1522,1,
	0,0,0,1526,1524,1,0,0,0,1527,229,1,0,0,0,1528,1530,5,68,0,0,1529,1531,3,
	188,94,0,1530,1529,1,0,0,0,1530,1531,1,0,0,0,1531,1532,1,0,0,0,1532,1533,
	5,69,0,0,1533,231,1,0,0,0,195,235,238,243,249,256,258,265,267,275,277,285,
	287,293,295,303,305,308,316,319,326,335,341,347,350,355,368,374,379,383,
	393,398,403,409,417,426,431,438,445,448,455,465,469,474,478,482,492,500,
	506,513,520,524,527,530,539,545,550,553,559,565,569,577,586,594,600,604,
	615,624,629,635,639,651,662,667,676,684,694,703,711,716,724,729,739,749,
	755,759,767,771,773,779,784,788,795,797,804,809,818,823,826,831,840,853,
	864,867,874,884,892,895,898,911,919,924,932,936,940,944,946,950,956,967,
	977,982,991,996,999,1006,1015,1038,1041,1044,1052,1056,1064,1070,1081,1090,
	1095,1105,1112,1125,1134,1143,1149,1160,1165,1170,1175,1179,1183,1187,1189,
	1193,1198,1215,1236,1240,1245,1249,1265,1305,1311,1326,1329,1331,1341,1350,
	1354,1358,1376,1378,1383,1388,1393,1402,1404,1408,1413,1417,1421,1425,1435,
	1447,1454,1457,1461,1469,1474,1485,1489,1494,1500,1509,1518,1520,1526,1530];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!ProcessingParser.__ATN) {
			ProcessingParser.__ATN = new ATNDeserializer().deserialize(ProcessingParser._serializedATN);
		}

		return ProcessingParser.__ATN;
	}


	static DecisionsToDFA = ProcessingParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class ProcessingSketchContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public staticProcessingSketch(): StaticProcessingSketchContext {
		return this.getTypedRuleContext(StaticProcessingSketchContext, 0) as StaticProcessingSketchContext;
	}
	public javaProcessingSketch(): JavaProcessingSketchContext {
		return this.getTypedRuleContext(JavaProcessingSketchContext, 0) as JavaProcessingSketchContext;
	}
	public activeProcessingSketch(): ActiveProcessingSketchContext {
		return this.getTypedRuleContext(ActiveProcessingSketchContext, 0) as ActiveProcessingSketchContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_processingSketch;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitProcessingSketch) {
			return visitor.visitProcessingSketch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JavaProcessingSketchContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(ProcessingParser.EOF, 0);
	}
	public packageDeclaration(): PackageDeclarationContext {
		return this.getTypedRuleContext(PackageDeclarationContext, 0) as PackageDeclarationContext;
	}
	public importDeclaration_list(): ImportDeclarationContext[] {
		return this.getTypedRuleContexts(ImportDeclarationContext) as ImportDeclarationContext[];
	}
	public importDeclaration(i: number): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, i) as ImportDeclarationContext;
	}
	public typeDeclaration_list(): TypeDeclarationContext[] {
		return this.getTypedRuleContexts(TypeDeclarationContext) as TypeDeclarationContext[];
	}
	public typeDeclaration(i: number): TypeDeclarationContext {
		return this.getTypedRuleContext(TypeDeclarationContext, i) as TypeDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_javaProcessingSketch;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitJavaProcessingSketch) {
			return visitor.visitJavaProcessingSketch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StaticProcessingSketchContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(ProcessingParser.EOF, 0);
	}
	public importDeclaration_list(): ImportDeclarationContext[] {
		return this.getTypedRuleContexts(ImportDeclarationContext) as ImportDeclarationContext[];
	}
	public importDeclaration(i: number): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, i) as ImportDeclarationContext;
	}
	public blockStatement_list(): BlockStatementContext[] {
		return this.getTypedRuleContexts(BlockStatementContext) as BlockStatementContext[];
	}
	public blockStatement(i: number): BlockStatementContext {
		return this.getTypedRuleContext(BlockStatementContext, i) as BlockStatementContext;
	}
	public typeDeclaration_list(): TypeDeclarationContext[] {
		return this.getTypedRuleContexts(TypeDeclarationContext) as TypeDeclarationContext[];
	}
	public typeDeclaration(i: number): TypeDeclarationContext {
		return this.getTypedRuleContext(TypeDeclarationContext, i) as TypeDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_staticProcessingSketch;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitStaticProcessingSketch) {
			return visitor.visitStaticProcessingSketch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActiveProcessingSketchContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(ProcessingParser.EOF, 0);
	}
	public importDeclaration_list(): ImportDeclarationContext[] {
		return this.getTypedRuleContexts(ImportDeclarationContext) as ImportDeclarationContext[];
	}
	public importDeclaration(i: number): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, i) as ImportDeclarationContext;
	}
	public classBodyDeclaration_list(): ClassBodyDeclarationContext[] {
		return this.getTypedRuleContexts(ClassBodyDeclarationContext) as ClassBodyDeclarationContext[];
	}
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext {
		return this.getTypedRuleContext(ClassBodyDeclarationContext, i) as ClassBodyDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_activeProcessingSketch;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitActiveProcessingSketch) {
			return visitor.visitActiveProcessingSketch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WarnMixedModesContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public blockStatement_list(): BlockStatementContext[] {
		return this.getTypedRuleContexts(BlockStatementContext) as BlockStatementContext[];
	}
	public blockStatement(i: number): BlockStatementContext {
		return this.getTypedRuleContext(BlockStatementContext, i) as BlockStatementContext;
	}
	public classBodyDeclaration_list(): ClassBodyDeclarationContext[] {
		return this.getTypedRuleContexts(ClassBodyDeclarationContext) as ClassBodyDeclarationContext[];
	}
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext {
		return this.getTypedRuleContext(ClassBodyDeclarationContext, i) as ClassBodyDeclarationContext;
	}
	public importDeclaration_list(): ImportDeclarationContext[] {
		return this.getTypedRuleContexts(ImportDeclarationContext) as ImportDeclarationContext[];
	}
	public importDeclaration(i: number): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, i) as ImportDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_warnMixedModes;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitWarnMixedModes) {
			return visitor.visitWarnMixedModes(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorIdContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public warnTypeAsVariableName(): WarnTypeAsVariableNameContext {
		return this.getTypedRuleContext(WarnTypeAsVariableNameContext, 0) as WarnTypeAsVariableNameContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_variableDeclaratorId;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitVariableDeclaratorId) {
			return visitor.visitVariableDeclaratorId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WarnTypeAsVariableNameContext extends ParserRuleContext {
	public _primitiveType!: PrimitiveTypeContext;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public primitiveType(): PrimitiveTypeContext {
		return this.getTypedRuleContext(PrimitiveTypeContext, 0) as PrimitiveTypeContext;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_warnTypeAsVariableName;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitWarnTypeAsVariableName) {
			return visitor.visitWarnTypeAsVariableName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodCallContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public functionWithPrimitiveTypeName(): FunctionWithPrimitiveTypeNameContext {
		return this.getTypedRuleContext(FunctionWithPrimitiveTypeNameContext, 0) as FunctionWithPrimitiveTypeNameContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public expressionList(): ExpressionListContext {
		return this.getTypedRuleContext(ExpressionListContext, 0) as ExpressionListContext;
	}
	public THIS(): TerminalNode {
		return this.getToken(ProcessingParser.THIS, 0);
	}
	public SUPER(): TerminalNode {
		return this.getToken(ProcessingParser.SUPER, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_methodCall;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitMethodCall) {
			return visitor.visitMethodCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionWithPrimitiveTypeNameContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public BOOLEAN(): TerminalNode {
		return this.getToken(ProcessingParser.BOOLEAN, 0);
	}
	public BYTE(): TerminalNode {
		return this.getToken(ProcessingParser.BYTE, 0);
	}
	public CHAR(): TerminalNode {
		return this.getToken(ProcessingParser.CHAR, 0);
	}
	public FLOAT(): TerminalNode {
		return this.getToken(ProcessingParser.FLOAT, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(ProcessingParser.INT, 0);
	}
	public expressionList(): ExpressionListContext {
		return this.getTypedRuleContext(ExpressionListContext, 0) as ExpressionListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_functionWithPrimitiveTypeName;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFunctionWithPrimitiveTypeName) {
			return visitor.visitFunctionWithPrimitiveTypeName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimitiveTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BOOLEAN(): TerminalNode {
		return this.getToken(ProcessingParser.BOOLEAN, 0);
	}
	public CHAR(): TerminalNode {
		return this.getToken(ProcessingParser.CHAR, 0);
	}
	public BYTE(): TerminalNode {
		return this.getToken(ProcessingParser.BYTE, 0);
	}
	public SHORT(): TerminalNode {
		return this.getToken(ProcessingParser.SHORT, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(ProcessingParser.INT, 0);
	}
	public LONG(): TerminalNode {
		return this.getToken(ProcessingParser.LONG, 0);
	}
	public FLOAT(): TerminalNode {
		return this.getToken(ProcessingParser.FLOAT, 0);
	}
	public DOUBLE(): TerminalNode {
		return this.getToken(ProcessingParser.DOUBLE, 0);
	}
	public colorPrimitiveType(): ColorPrimitiveTypeContext {
		return this.getTypedRuleContext(ColorPrimitiveTypeContext, 0) as ColorPrimitiveTypeContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_primitiveType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitPrimitiveType) {
			return visitor.visitPrimitiveType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ColorPrimitiveTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_colorPrimitiveType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitColorPrimitiveType) {
			return visitor.visitColorPrimitiveType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedNameContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, i);
	}
	public colorPrimitiveType_list(): ColorPrimitiveTypeContext[] {
		return this.getTypedRuleContexts(ColorPrimitiveTypeContext) as ColorPrimitiveTypeContext[];
	}
	public colorPrimitiveType(i: number): ColorPrimitiveTypeContext {
		return this.getTypedRuleContext(ColorPrimitiveTypeContext, i) as ColorPrimitiveTypeContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(ProcessingParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_qualifiedName;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitQualifiedName) {
			return visitor.visitQualifiedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public integerLiteral(): IntegerLiteralContext {
		return this.getTypedRuleContext(IntegerLiteralContext, 0) as IntegerLiteralContext;
	}
	public floatLiteral(): FloatLiteralContext {
		return this.getTypedRuleContext(FloatLiteralContext, 0) as FloatLiteralContext;
	}
	public CHAR_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.CHAR_LITERAL, 0);
	}
	public stringLiteral(): StringLiteralContext {
		return this.getTypedRuleContext(StringLiteralContext, 0) as StringLiteralContext;
	}
	public BOOL_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.BOOL_LITERAL, 0);
	}
	public NULL_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.NULL_LITERAL, 0);
	}
	public hexColorLiteral(): HexColorLiteralContext {
		return this.getTypedRuleContext(HexColorLiteralContext, 0) as HexColorLiteralContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_literal;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HexColorLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HexColorLiteral(): TerminalNode {
		return this.getToken(ProcessingParser.HexColorLiteral, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_hexColorLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitHexColorLiteral) {
			return visitor.visitHexColorLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompilationUnitContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(ProcessingParser.EOF, 0);
	}
	public packageDeclaration(): PackageDeclarationContext {
		return this.getTypedRuleContext(PackageDeclarationContext, 0) as PackageDeclarationContext;
	}
	public importDeclaration_list(): ImportDeclarationContext[] {
		return this.getTypedRuleContexts(ImportDeclarationContext) as ImportDeclarationContext[];
	}
	public importDeclaration(i: number): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, i) as ImportDeclarationContext;
	}
	public typeDeclaration_list(): TypeDeclarationContext[] {
		return this.getTypedRuleContexts(TypeDeclarationContext) as TypeDeclarationContext[];
	}
	public typeDeclaration(i: number): TypeDeclarationContext {
		return this.getTypedRuleContext(TypeDeclarationContext, i) as TypeDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_compilationUnit;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitCompilationUnit) {
			return visitor.visitCompilationUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PACKAGE(): TerminalNode {
		return this.getToken(ProcessingParser.PACKAGE, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_packageDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitPackageDeclaration) {
			return visitor.visitPackageDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IMPORT(): TerminalNode {
		return this.getToken(ProcessingParser.IMPORT, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public STATIC(): TerminalNode {
		return this.getToken(ProcessingParser.STATIC, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(ProcessingParser.DOT, 0);
	}
	public MUL(): TerminalNode {
		return this.getToken(ProcessingParser.MUL, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_importDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitImportDeclaration) {
			return visitor.visitImportDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public enumDeclaration(): EnumDeclarationContext {
		return this.getTypedRuleContext(EnumDeclarationContext, 0) as EnumDeclarationContext;
	}
	public interfaceDeclaration(): InterfaceDeclarationContext {
		return this.getTypedRuleContext(InterfaceDeclarationContext, 0) as InterfaceDeclarationContext;
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0) as AnnotationTypeDeclarationContext;
	}
	public classOrInterfaceModifier_list(): ClassOrInterfaceModifierContext[] {
		return this.getTypedRuleContexts(ClassOrInterfaceModifierContext) as ClassOrInterfaceModifierContext[];
	}
	public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext {
		return this.getTypedRuleContext(ClassOrInterfaceModifierContext, i) as ClassOrInterfaceModifierContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeDeclaration) {
			return visitor.visitTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext {
		return this.getTypedRuleContext(ClassOrInterfaceModifierContext, 0) as ClassOrInterfaceModifierContext;
	}
	public NATIVE(): TerminalNode {
		return this.getToken(ProcessingParser.NATIVE, 0);
	}
	public SYNCHRONIZED(): TerminalNode {
		return this.getToken(ProcessingParser.SYNCHRONIZED, 0);
	}
	public TRANSIENT(): TerminalNode {
		return this.getToken(ProcessingParser.TRANSIENT, 0);
	}
	public VOLATILE(): TerminalNode {
		return this.getToken(ProcessingParser.VOLATILE, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_modifier;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitModifier) {
			return visitor.visitModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassOrInterfaceModifierContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public PUBLIC(): TerminalNode {
		return this.getToken(ProcessingParser.PUBLIC, 0);
	}
	public PROTECTED(): TerminalNode {
		return this.getToken(ProcessingParser.PROTECTED, 0);
	}
	public PRIVATE(): TerminalNode {
		return this.getToken(ProcessingParser.PRIVATE, 0);
	}
	public STATIC(): TerminalNode {
		return this.getToken(ProcessingParser.STATIC, 0);
	}
	public ABSTRACT(): TerminalNode {
		return this.getToken(ProcessingParser.ABSTRACT, 0);
	}
	public FINAL(): TerminalNode {
		return this.getToken(ProcessingParser.FINAL, 0);
	}
	public STRICTFP(): TerminalNode {
		return this.getToken(ProcessingParser.STRICTFP, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classOrInterfaceModifier;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassOrInterfaceModifier) {
			return visitor.visitClassOrInterfaceModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableModifierContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FINAL(): TerminalNode {
		return this.getToken(ProcessingParser.FINAL, 0);
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_variableModifier;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitVariableModifier) {
			return visitor.visitVariableModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CLASS(): TerminalNode {
		return this.getToken(ProcessingParser.CLASS, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public EXTENDS(): TerminalNode {
		return this.getToken(ProcessingParser.EXTENDS, 0);
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public IMPLEMENTS(): TerminalNode {
		return this.getToken(ProcessingParser.IMPLEMENTS, 0);
	}
	public typeList(): TypeListContext {
		return this.getTypedRuleContext(TypeListContext, 0) as TypeListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassDeclaration) {
			return visitor.visitClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParametersContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LT(): TerminalNode {
		return this.getToken(ProcessingParser.LT, 0);
	}
	public typeParameter_list(): TypeParameterContext[] {
		return this.getTypedRuleContexts(TypeParameterContext) as TypeParameterContext[];
	}
	public typeParameter(i: number): TypeParameterContext {
		return this.getTypedRuleContext(TypeParameterContext, i) as TypeParameterContext;
	}
	public GT(): TerminalNode {
		return this.getToken(ProcessingParser.GT, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeParameters;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeParameters) {
			return visitor.visitTypeParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParameterContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public EXTENDS(): TerminalNode {
		return this.getToken(ProcessingParser.EXTENDS, 0);
	}
	public typeBound(): TypeBoundContext {
		return this.getTypedRuleContext(TypeBoundContext, 0) as TypeBoundContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeParameter;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeParameter) {
			return visitor.visitTypeParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeBoundContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType_list(): TypeTypeContext[] {
		return this.getTypedRuleContexts(TypeTypeContext) as TypeTypeContext[];
	}
	public typeType(i: number): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, i) as TypeTypeContext;
	}
	public BITAND_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.BITAND);
	}
	public BITAND(i: number): TerminalNode {
		return this.getToken(ProcessingParser.BITAND, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeBound;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeBound) {
			return visitor.visitTypeBound(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUM(): TerminalNode {
		return this.getToken(ProcessingParser.ENUM, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public IMPLEMENTS(): TerminalNode {
		return this.getToken(ProcessingParser.IMPLEMENTS, 0);
	}
	public typeList(): TypeListContext {
		return this.getTypedRuleContext(TypeListContext, 0) as TypeListContext;
	}
	public enumConstants(): EnumConstantsContext {
		return this.getTypedRuleContext(EnumConstantsContext, 0) as EnumConstantsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, 0);
	}
	public enumBodyDeclarations(): EnumBodyDeclarationsContext {
		return this.getTypedRuleContext(EnumBodyDeclarationsContext, 0) as EnumBodyDeclarationsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_enumDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitEnumDeclaration) {
			return visitor.visitEnumDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumConstantsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public enumConstant_list(): EnumConstantContext[] {
		return this.getTypedRuleContexts(EnumConstantContext) as EnumConstantContext[];
	}
	public enumConstant(i: number): EnumConstantContext {
		return this.getTypedRuleContext(EnumConstantContext, i) as EnumConstantContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_enumConstants;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitEnumConstants) {
			return visitor.visitEnumConstants(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumConstantContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public arguments(): ArgumentsContext {
		return this.getTypedRuleContext(ArgumentsContext, 0) as ArgumentsContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_enumConstant;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitEnumConstant) {
			return visitor.visitEnumConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumBodyDeclarationsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public classBodyDeclaration_list(): ClassBodyDeclarationContext[] {
		return this.getTypedRuleContexts(ClassBodyDeclarationContext) as ClassBodyDeclarationContext[];
	}
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext {
		return this.getTypedRuleContext(ClassBodyDeclarationContext, i) as ClassBodyDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_enumBodyDeclarations;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitEnumBodyDeclarations) {
			return visitor.visitEnumBodyDeclarations(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INTERFACE(): TerminalNode {
		return this.getToken(ProcessingParser.INTERFACE, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public interfaceBody(): InterfaceBodyContext {
		return this.getTypedRuleContext(InterfaceBodyContext, 0) as InterfaceBodyContext;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public EXTENDS(): TerminalNode {
		return this.getToken(ProcessingParser.EXTENDS, 0);
	}
	public typeList(): TypeListContext {
		return this.getTypedRuleContext(TypeListContext, 0) as TypeListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceDeclaration) {
			return visitor.visitInterfaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassBodyContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public classBodyDeclaration_list(): ClassBodyDeclarationContext[] {
		return this.getTypedRuleContexts(ClassBodyDeclarationContext) as ClassBodyDeclarationContext[];
	}
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext {
		return this.getTypedRuleContext(ClassBodyDeclarationContext, i) as ClassBodyDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classBody;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassBody) {
			return visitor.visitClassBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceBodyContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public interfaceBodyDeclaration_list(): InterfaceBodyDeclarationContext[] {
		return this.getTypedRuleContexts(InterfaceBodyDeclarationContext) as InterfaceBodyDeclarationContext[];
	}
	public interfaceBodyDeclaration(i: number): InterfaceBodyDeclarationContext {
		return this.getTypedRuleContext(InterfaceBodyDeclarationContext, i) as InterfaceBodyDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceBody;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceBody) {
			return visitor.visitInterfaceBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassBodyDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public importDeclaration(): ImportDeclarationContext {
		return this.getTypedRuleContext(ImportDeclarationContext, 0) as ImportDeclarationContext;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public STATIC(): TerminalNode {
		return this.getToken(ProcessingParser.STATIC, 0);
	}
	public memberDeclaration(): MemberDeclarationContext {
		return this.getTypedRuleContext(MemberDeclarationContext, 0) as MemberDeclarationContext;
	}
	public modifier_list(): ModifierContext[] {
		return this.getTypedRuleContexts(ModifierContext) as ModifierContext[];
	}
	public modifier(i: number): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, i) as ModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classBodyDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassBodyDeclaration) {
			return visitor.visitClassBodyDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MemberDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public methodDeclaration(): MethodDeclarationContext {
		return this.getTypedRuleContext(MethodDeclarationContext, 0) as MethodDeclarationContext;
	}
	public genericMethodDeclaration(): GenericMethodDeclarationContext {
		return this.getTypedRuleContext(GenericMethodDeclarationContext, 0) as GenericMethodDeclarationContext;
	}
	public fieldDeclaration(): FieldDeclarationContext {
		return this.getTypedRuleContext(FieldDeclarationContext, 0) as FieldDeclarationContext;
	}
	public constructorDeclaration(): ConstructorDeclarationContext {
		return this.getTypedRuleContext(ConstructorDeclarationContext, 0) as ConstructorDeclarationContext;
	}
	public genericConstructorDeclaration(): GenericConstructorDeclarationContext {
		return this.getTypedRuleContext(GenericConstructorDeclarationContext, 0) as GenericConstructorDeclarationContext;
	}
	public interfaceDeclaration(): InterfaceDeclarationContext {
		return this.getTypedRuleContext(InterfaceDeclarationContext, 0) as InterfaceDeclarationContext;
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0) as AnnotationTypeDeclarationContext;
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public enumDeclaration(): EnumDeclarationContext {
		return this.getTypedRuleContext(EnumDeclarationContext, 0) as EnumDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_memberDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitMemberDeclaration) {
			return visitor.visitMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		return this.getTypedRuleContext(TypeTypeOrVoidContext, 0) as TypeTypeOrVoidContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public formalParameters(): FormalParametersContext {
		return this.getTypedRuleContext(FormalParametersContext, 0) as FormalParametersContext;
	}
	public methodBody(): MethodBodyContext {
		return this.getTypedRuleContext(MethodBodyContext, 0) as MethodBodyContext;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
	public THROWS(): TerminalNode {
		return this.getToken(ProcessingParser.THROWS, 0);
	}
	public qualifiedNameList(): QualifiedNameListContext {
		return this.getTypedRuleContext(QualifiedNameListContext, 0) as QualifiedNameListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_methodDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitMethodDeclaration) {
			return visitor.visitMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodBodyContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_methodBody;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitMethodBody) {
			return visitor.visitMethodBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeTypeOrVoidContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public VOID(): TerminalNode {
		return this.getToken(ProcessingParser.VOID, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeTypeOrVoid;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeTypeOrVoid) {
			return visitor.visitTypeTypeOrVoid(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericMethodDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public methodDeclaration(): MethodDeclarationContext {
		return this.getTypedRuleContext(MethodDeclarationContext, 0) as MethodDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_genericMethodDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitGenericMethodDeclaration) {
			return visitor.visitGenericMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericConstructorDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public constructorDeclaration(): ConstructorDeclarationContext {
		return this.getTypedRuleContext(ConstructorDeclarationContext, 0) as ConstructorDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_genericConstructorDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitGenericConstructorDeclaration) {
			return visitor.visitGenericConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstructorDeclarationContext extends ParserRuleContext {
	public _constructorBody!: BlockContext;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public formalParameters(): FormalParametersContext {
		return this.getTypedRuleContext(FormalParametersContext, 0) as FormalParametersContext;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public THROWS(): TerminalNode {
		return this.getToken(ProcessingParser.THROWS, 0);
	}
	public qualifiedNameList(): QualifiedNameListContext {
		return this.getTypedRuleContext(QualifiedNameListContext, 0) as QualifiedNameListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_constructorDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitConstructorDeclaration) {
			return visitor.visitConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public variableDeclarators(): VariableDeclaratorsContext {
		return this.getTypedRuleContext(VariableDeclaratorsContext, 0) as VariableDeclaratorsContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_fieldDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFieldDeclaration) {
			return visitor.visitFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceBodyDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext {
		return this.getTypedRuleContext(InterfaceMemberDeclarationContext, 0) as InterfaceMemberDeclarationContext;
	}
	public modifier_list(): ModifierContext[] {
		return this.getTypedRuleContexts(ModifierContext) as ModifierContext[];
	}
	public modifier(i: number): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, i) as ModifierContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceBodyDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceBodyDeclaration) {
			return visitor.visitInterfaceBodyDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMemberDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public constDeclaration(): ConstDeclarationContext {
		return this.getTypedRuleContext(ConstDeclarationContext, 0) as ConstDeclarationContext;
	}
	public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext {
		return this.getTypedRuleContext(InterfaceMethodDeclarationContext, 0) as InterfaceMethodDeclarationContext;
	}
	public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext {
		return this.getTypedRuleContext(GenericInterfaceMethodDeclarationContext, 0) as GenericInterfaceMethodDeclarationContext;
	}
	public interfaceDeclaration(): InterfaceDeclarationContext {
		return this.getTypedRuleContext(InterfaceDeclarationContext, 0) as InterfaceDeclarationContext;
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0) as AnnotationTypeDeclarationContext;
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public enumDeclaration(): EnumDeclarationContext {
		return this.getTypedRuleContext(EnumDeclarationContext, 0) as EnumDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceMemberDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceMemberDeclaration) {
			return visitor.visitInterfaceMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public constantDeclarator_list(): ConstantDeclaratorContext[] {
		return this.getTypedRuleContexts(ConstantDeclaratorContext) as ConstantDeclaratorContext[];
	}
	public constantDeclarator(i: number): ConstantDeclaratorContext {
		return this.getTypedRuleContext(ConstantDeclaratorContext, i) as ConstantDeclaratorContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_constDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitConstDeclaration) {
			return visitor.visitConstDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantDeclaratorContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ASSIGN, 0);
	}
	public variableInitializer(): VariableInitializerContext {
		return this.getTypedRuleContext(VariableInitializerContext, 0) as VariableInitializerContext;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_constantDeclarator;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitConstantDeclarator) {
			return visitor.visitConstantDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMethodDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public formalParameters(): FormalParametersContext {
		return this.getTypedRuleContext(FormalParametersContext, 0) as FormalParametersContext;
	}
	public methodBody(): MethodBodyContext {
		return this.getTypedRuleContext(MethodBodyContext, 0) as MethodBodyContext;
	}
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		return this.getTypedRuleContext(TypeTypeOrVoidContext, 0) as TypeTypeOrVoidContext;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public interfaceMethodModifier_list(): InterfaceMethodModifierContext[] {
		return this.getTypedRuleContexts(InterfaceMethodModifierContext) as InterfaceMethodModifierContext[];
	}
	public interfaceMethodModifier(i: number): InterfaceMethodModifierContext {
		return this.getTypedRuleContext(InterfaceMethodModifierContext, i) as InterfaceMethodModifierContext;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
	public THROWS(): TerminalNode {
		return this.getToken(ProcessingParser.THROWS, 0);
	}
	public qualifiedNameList(): QualifiedNameListContext {
		return this.getTypedRuleContext(QualifiedNameListContext, 0) as QualifiedNameListContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceMethodDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceMethodDeclaration) {
			return visitor.visitInterfaceMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMethodModifierContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public PUBLIC(): TerminalNode {
		return this.getToken(ProcessingParser.PUBLIC, 0);
	}
	public ABSTRACT(): TerminalNode {
		return this.getToken(ProcessingParser.ABSTRACT, 0);
	}
	public DEFAULT(): TerminalNode {
		return this.getToken(ProcessingParser.DEFAULT, 0);
	}
	public STATIC(): TerminalNode {
		return this.getToken(ProcessingParser.STATIC, 0);
	}
	public STRICTFP(): TerminalNode {
		return this.getToken(ProcessingParser.STRICTFP, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_interfaceMethodModifier;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInterfaceMethodModifier) {
			return visitor.visitInterfaceMethodModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericInterfaceMethodDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext {
		return this.getTypedRuleContext(InterfaceMethodDeclarationContext, 0) as InterfaceMethodDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_genericInterfaceMethodDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitGenericInterfaceMethodDeclaration) {
			return visitor.visitGenericInterfaceMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variableDeclarator_list(): VariableDeclaratorContext[] {
		return this.getTypedRuleContexts(VariableDeclaratorContext) as VariableDeclaratorContext[];
	}
	public variableDeclarator(i: number): VariableDeclaratorContext {
		return this.getTypedRuleContext(VariableDeclaratorContext, i) as VariableDeclaratorContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_variableDeclarators;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitVariableDeclarators) {
			return visitor.visitVariableDeclarators(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getTypedRuleContext(VariableDeclaratorIdContext, 0) as VariableDeclaratorIdContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ASSIGN, 0);
	}
	public variableInitializer(): VariableInitializerContext {
		return this.getTypedRuleContext(VariableInitializerContext, 0) as VariableInitializerContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_variableDeclarator;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitVariableDeclarator) {
			return visitor.visitVariableDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableInitializerContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public arrayInitializer(): ArrayInitializerContext {
		return this.getTypedRuleContext(ArrayInitializerContext, 0) as ArrayInitializerContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_variableInitializer;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitVariableInitializer) {
			return visitor.visitVariableInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayInitializerContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public variableInitializer_list(): VariableInitializerContext[] {
		return this.getTypedRuleContexts(VariableInitializerContext) as VariableInitializerContext[];
	}
	public variableInitializer(i: number): VariableInitializerContext {
		return this.getTypedRuleContext(VariableInitializerContext, i) as VariableInitializerContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_arrayInitializer;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitArrayInitializer) {
			return visitor.visitArrayInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassOrInterfaceTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, i);
	}
	public typeArguments_list(): TypeArgumentsContext[] {
		return this.getTypedRuleContexts(TypeArgumentsContext) as TypeArgumentsContext[];
	}
	public typeArguments(i: number): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, i) as TypeArgumentsContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(ProcessingParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classOrInterfaceType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassOrInterfaceType) {
			return visitor.visitClassOrInterfaceType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public QUESTION(): TerminalNode {
		return this.getToken(ProcessingParser.QUESTION, 0);
	}
	public EXTENDS(): TerminalNode {
		return this.getToken(ProcessingParser.EXTENDS, 0);
	}
	public SUPER(): TerminalNode {
		return this.getToken(ProcessingParser.SUPER, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeArgument;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeArgument) {
			return visitor.visitTypeArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedNameListContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedName_list(): QualifiedNameContext[] {
		return this.getTypedRuleContexts(QualifiedNameContext) as QualifiedNameContext[];
	}
	public qualifiedName(i: number): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, i) as QualifiedNameContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_qualifiedNameList;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitQualifiedNameList) {
			return visitor.visitQualifiedNameList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParametersContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public formalParameterList(): FormalParameterListContext {
		return this.getTypedRuleContext(FormalParameterListContext, 0) as FormalParameterListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_formalParameters;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFormalParameters) {
			return visitor.visitFormalParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterListContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public formalParameter_list(): FormalParameterContext[] {
		return this.getTypedRuleContexts(FormalParameterContext) as FormalParameterContext[];
	}
	public formalParameter(i: number): FormalParameterContext {
		return this.getTypedRuleContext(FormalParameterContext, i) as FormalParameterContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
	public lastFormalParameter(): LastFormalParameterContext {
		return this.getTypedRuleContext(LastFormalParameterContext, 0) as LastFormalParameterContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_formalParameterList;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFormalParameterList) {
			return visitor.visitFormalParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getTypedRuleContext(VariableDeclaratorIdContext, 0) as VariableDeclaratorIdContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_formalParameter;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFormalParameter) {
			return visitor.visitFormalParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LastFormalParameterContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public ELLIPSIS(): TerminalNode {
		return this.getToken(ProcessingParser.ELLIPSIS, 0);
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getTypedRuleContext(VariableDeclaratorIdContext, 0) as VariableDeclaratorIdContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_lastFormalParameter;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLastFormalParameter) {
			return visitor.visitLastFormalParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BaseStringLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.STRING_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_baseStringLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitBaseStringLiteral) {
			return visitor.visitBaseStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultilineStringLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MULTI_STRING_LIT(): TerminalNode {
		return this.getToken(ProcessingParser.MULTI_STRING_LIT, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_multilineStringLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitMultilineStringLiteral) {
			return visitor.visitMultilineStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public baseStringLiteral(): BaseStringLiteralContext {
		return this.getTypedRuleContext(BaseStringLiteralContext, 0) as BaseStringLiteralContext;
	}
	public multilineStringLiteral(): MultilineStringLiteralContext {
		return this.getTypedRuleContext(MultilineStringLiteralContext, 0) as MultilineStringLiteralContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_stringLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitStringLiteral) {
			return visitor.visitStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IntegerLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DECIMAL_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.DECIMAL_LITERAL, 0);
	}
	public HEX_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.HEX_LITERAL, 0);
	}
	public OCT_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.OCT_LITERAL, 0);
	}
	public BINARY_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.BINARY_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_integerLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitIntegerLiteral) {
			return visitor.visitIntegerLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FloatLiteralContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLOAT_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.FLOAT_LITERAL, 0);
	}
	public HEX_FLOAT_LITERAL(): TerminalNode {
		return this.getToken(ProcessingParser.HEX_FLOAT_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_floatLiteral;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFloatLiteral) {
			return visitor.visitFloatLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AT(): TerminalNode {
		return this.getToken(ProcessingParser.AT, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public elementValuePairs(): ElementValuePairsContext {
		return this.getTypedRuleContext(ElementValuePairsContext, 0) as ElementValuePairsContext;
	}
	public elementValue(): ElementValueContext {
		return this.getTypedRuleContext(ElementValueContext, 0) as ElementValueContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotation;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotation) {
			return visitor.visitAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValuePairsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public elementValuePair_list(): ElementValuePairContext[] {
		return this.getTypedRuleContexts(ElementValuePairContext) as ElementValuePairContext[];
	}
	public elementValuePair(i: number): ElementValuePairContext {
		return this.getTypedRuleContext(ElementValuePairContext, i) as ElementValuePairContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_elementValuePairs;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitElementValuePairs) {
			return visitor.visitElementValuePairs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValuePairContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ASSIGN, 0);
	}
	public elementValue(): ElementValueContext {
		return this.getTypedRuleContext(ElementValueContext, 0) as ElementValueContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_elementValuePair;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitElementValuePair) {
			return visitor.visitElementValuePair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValueContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public elementValueArrayInitializer(): ElementValueArrayInitializerContext {
		return this.getTypedRuleContext(ElementValueArrayInitializerContext, 0) as ElementValueArrayInitializerContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_elementValue;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitElementValue) {
			return visitor.visitElementValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValueArrayInitializerContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public elementValue_list(): ElementValueContext[] {
		return this.getTypedRuleContexts(ElementValueContext) as ElementValueContext[];
	}
	public elementValue(i: number): ElementValueContext {
		return this.getTypedRuleContext(ElementValueContext, i) as ElementValueContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_elementValueArrayInitializer;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitElementValueArrayInitializer) {
			return visitor.visitElementValueArrayInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AT(): TerminalNode {
		return this.getToken(ProcessingParser.AT, 0);
	}
	public INTERFACE(): TerminalNode {
		return this.getToken(ProcessingParser.INTERFACE, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public annotationTypeBody(): AnnotationTypeBodyContext {
		return this.getTypedRuleContext(AnnotationTypeBodyContext, 0) as AnnotationTypeBodyContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationTypeDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeDeclaration) {
			return visitor.visitAnnotationTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeBodyContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public annotationTypeElementDeclaration_list(): AnnotationTypeElementDeclarationContext[] {
		return this.getTypedRuleContexts(AnnotationTypeElementDeclarationContext) as AnnotationTypeElementDeclarationContext[];
	}
	public annotationTypeElementDeclaration(i: number): AnnotationTypeElementDeclarationContext {
		return this.getTypedRuleContext(AnnotationTypeElementDeclarationContext, i) as AnnotationTypeElementDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationTypeBody;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeBody) {
			return visitor.visitAnnotationTypeBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeElementDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotationTypeElementRest(): AnnotationTypeElementRestContext {
		return this.getTypedRuleContext(AnnotationTypeElementRestContext, 0) as AnnotationTypeElementRestContext;
	}
	public modifier_list(): ModifierContext[] {
		return this.getTypedRuleContexts(ModifierContext) as ModifierContext[];
	}
	public modifier(i: number): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, i) as ModifierContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationTypeElementDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeElementDeclaration) {
			return visitor.visitAnnotationTypeElementDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeElementRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext {
		return this.getTypedRuleContext(AnnotationMethodOrConstantRestContext, 0) as AnnotationMethodOrConstantRestContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public interfaceDeclaration(): InterfaceDeclarationContext {
		return this.getTypedRuleContext(InterfaceDeclarationContext, 0) as InterfaceDeclarationContext;
	}
	public enumDeclaration(): EnumDeclarationContext {
		return this.getTypedRuleContext(EnumDeclarationContext, 0) as EnumDeclarationContext;
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0) as AnnotationTypeDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationTypeElementRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeElementRest) {
			return visitor.visitAnnotationTypeElementRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationMethodOrConstantRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotationMethodRest(): AnnotationMethodRestContext {
		return this.getTypedRuleContext(AnnotationMethodRestContext, 0) as AnnotationMethodRestContext;
	}
	public annotationConstantRest(): AnnotationConstantRestContext {
		return this.getTypedRuleContext(AnnotationConstantRestContext, 0) as AnnotationConstantRestContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationMethodOrConstantRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationMethodOrConstantRest) {
			return visitor.visitAnnotationMethodOrConstantRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationMethodRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public defaultValue(): DefaultValueContext {
		return this.getTypedRuleContext(DefaultValueContext, 0) as DefaultValueContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationMethodRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationMethodRest) {
			return visitor.visitAnnotationMethodRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationConstantRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variableDeclarators(): VariableDeclaratorsContext {
		return this.getTypedRuleContext(VariableDeclaratorsContext, 0) as VariableDeclaratorsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_annotationConstantRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitAnnotationConstantRest) {
			return visitor.visitAnnotationConstantRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefaultValueContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEFAULT(): TerminalNode {
		return this.getToken(ProcessingParser.DEFAULT, 0);
	}
	public elementValue(): ElementValueContext {
		return this.getTypedRuleContext(ElementValueContext, 0) as ElementValueContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_defaultValue;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitDefaultValue) {
			return visitor.visitDefaultValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public blockStatement_list(): BlockStatementContext[] {
		return this.getTypedRuleContexts(BlockStatementContext) as BlockStatementContext[];
	}
	public blockStatement(i: number): BlockStatementContext {
		return this.getTypedRuleContext(BlockStatementContext, i) as BlockStatementContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_block;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockStatementContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localVariableDeclaration(): LocalVariableDeclarationContext {
		return this.getTypedRuleContext(LocalVariableDeclarationContext, 0) as LocalVariableDeclarationContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public statement(): StatementContext {
		return this.getTypedRuleContext(StatementContext, 0) as StatementContext;
	}
	public localTypeDeclaration(): LocalTypeDeclarationContext {
		return this.getTypedRuleContext(LocalTypeDeclarationContext, 0) as LocalTypeDeclarationContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_blockStatement;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitBlockStatement) {
			return visitor.visitBlockStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LocalVariableDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public variableDeclarators(): VariableDeclaratorsContext {
		return this.getTypedRuleContext(VariableDeclaratorsContext, 0) as VariableDeclaratorsContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_localVariableDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLocalVariableDeclaration) {
			return visitor.visitLocalVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LocalTypeDeclarationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public interfaceDeclaration(): InterfaceDeclarationContext {
		return this.getTypedRuleContext(InterfaceDeclarationContext, 0) as InterfaceDeclarationContext;
	}
	public classOrInterfaceModifier_list(): ClassOrInterfaceModifierContext[] {
		return this.getTypedRuleContexts(ClassOrInterfaceModifierContext) as ClassOrInterfaceModifierContext[];
	}
	public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext {
		return this.getTypedRuleContext(ClassOrInterfaceModifierContext, i) as ClassOrInterfaceModifierContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_localTypeDeclaration;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLocalTypeDeclaration) {
			return visitor.visitLocalTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public _blockLabel!: BlockContext;
	public _statementExpression!: ExpressionContext;
	public _identifierLabel!: Token;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public ASSERT(): TerminalNode {
		return this.getToken(ProcessingParser.ASSERT, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(ProcessingParser.COLON, 0);
	}
	public IF(): TerminalNode {
		return this.getToken(ProcessingParser.IF, 0);
	}
	public parExpression(): ParExpressionContext {
		return this.getTypedRuleContext(ParExpressionContext, 0) as ParExpressionContext;
	}
	public statement_list(): StatementContext[] {
		return this.getTypedRuleContexts(StatementContext) as StatementContext[];
	}
	public statement(i: number): StatementContext {
		return this.getTypedRuleContext(StatementContext, i) as StatementContext;
	}
	public ELSE(): TerminalNode {
		return this.getToken(ProcessingParser.ELSE, 0);
	}
	public FOR(): TerminalNode {
		return this.getToken(ProcessingParser.FOR, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public forControl(): ForControlContext {
		return this.getTypedRuleContext(ForControlContext, 0) as ForControlContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public WHILE(): TerminalNode {
		return this.getToken(ProcessingParser.WHILE, 0);
	}
	public DO(): TerminalNode {
		return this.getToken(ProcessingParser.DO, 0);
	}
	public TRY(): TerminalNode {
		return this.getToken(ProcessingParser.TRY, 0);
	}
	public finallyBlock(): FinallyBlockContext {
		return this.getTypedRuleContext(FinallyBlockContext, 0) as FinallyBlockContext;
	}
	public catchClause_list(): CatchClauseContext[] {
		return this.getTypedRuleContexts(CatchClauseContext) as CatchClauseContext[];
	}
	public catchClause(i: number): CatchClauseContext {
		return this.getTypedRuleContext(CatchClauseContext, i) as CatchClauseContext;
	}
	public resourceSpecification(): ResourceSpecificationContext {
		return this.getTypedRuleContext(ResourceSpecificationContext, 0) as ResourceSpecificationContext;
	}
	public SWITCH(): TerminalNode {
		return this.getToken(ProcessingParser.SWITCH, 0);
	}
	public LBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACE, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACE, 0);
	}
	public switchBlockStatementGroup_list(): SwitchBlockStatementGroupContext[] {
		return this.getTypedRuleContexts(SwitchBlockStatementGroupContext) as SwitchBlockStatementGroupContext[];
	}
	public switchBlockStatementGroup(i: number): SwitchBlockStatementGroupContext {
		return this.getTypedRuleContext(SwitchBlockStatementGroupContext, i) as SwitchBlockStatementGroupContext;
	}
	public switchLabel_list(): SwitchLabelContext[] {
		return this.getTypedRuleContexts(SwitchLabelContext) as SwitchLabelContext[];
	}
	public switchLabel(i: number): SwitchLabelContext {
		return this.getTypedRuleContext(SwitchLabelContext, i) as SwitchLabelContext;
	}
	public SYNCHRONIZED(): TerminalNode {
		return this.getToken(ProcessingParser.SYNCHRONIZED, 0);
	}
	public RETURN(): TerminalNode {
		return this.getToken(ProcessingParser.RETURN, 0);
	}
	public THROW(): TerminalNode {
		return this.getToken(ProcessingParser.THROW, 0);
	}
	public BREAK(): TerminalNode {
		return this.getToken(ProcessingParser.BREAK, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public CONTINUE(): TerminalNode {
		return this.getToken(ProcessingParser.CONTINUE, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_statement;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CatchClauseContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CATCH(): TerminalNode {
		return this.getToken(ProcessingParser.CATCH, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public catchType(): CatchTypeContext {
		return this.getTypedRuleContext(CatchTypeContext, 0) as CatchTypeContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_catchClause;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitCatchClause) {
			return visitor.visitCatchClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CatchTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedName_list(): QualifiedNameContext[] {
		return this.getTypedRuleContexts(QualifiedNameContext) as QualifiedNameContext[];
	}
	public qualifiedName(i: number): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, i) as QualifiedNameContext;
	}
	public BITOR_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.BITOR);
	}
	public BITOR(i: number): TerminalNode {
		return this.getToken(ProcessingParser.BITOR, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_catchType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitCatchType) {
			return visitor.visitCatchType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FinallyBlockContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FINALLY(): TerminalNode {
		return this.getToken(ProcessingParser.FINALLY, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_finallyBlock;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitFinallyBlock) {
			return visitor.visitFinallyBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceSpecificationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public resources(): ResourcesContext {
		return this.getTypedRuleContext(ResourcesContext, 0) as ResourcesContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public SEMI(): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_resourceSpecification;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitResourceSpecification) {
			return visitor.visitResourceSpecification(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourcesContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public resource_list(): ResourceContext[] {
		return this.getTypedRuleContexts(ResourceContext) as ResourceContext[];
	}
	public resource(i: number): ResourceContext {
		return this.getTypedRuleContext(ResourceContext, i) as ResourceContext;
	}
	public SEMI_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.SEMI);
	}
	public SEMI(i: number): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_resources;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitResources) {
			return visitor.visitResources(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classOrInterfaceType(): ClassOrInterfaceTypeContext {
		return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0) as ClassOrInterfaceTypeContext;
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getTypedRuleContext(VariableDeclaratorIdContext, 0) as VariableDeclaratorIdContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ASSIGN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_resource;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitResource) {
			return visitor.visitResource(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchBlockStatementGroupContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public switchLabel_list(): SwitchLabelContext[] {
		return this.getTypedRuleContexts(SwitchLabelContext) as SwitchLabelContext[];
	}
	public switchLabel(i: number): SwitchLabelContext {
		return this.getTypedRuleContext(SwitchLabelContext, i) as SwitchLabelContext;
	}
	public blockStatement_list(): BlockStatementContext[] {
		return this.getTypedRuleContexts(BlockStatementContext) as BlockStatementContext[];
	}
	public blockStatement(i: number): BlockStatementContext {
		return this.getTypedRuleContext(BlockStatementContext, i) as BlockStatementContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_switchBlockStatementGroup;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitSwitchBlockStatementGroup) {
			return visitor.visitSwitchBlockStatementGroup(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchLabelContext extends ParserRuleContext {
	public _constantExpression!: ExpressionContext;
	public _enumConstantName!: Token;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CASE(): TerminalNode {
		return this.getToken(ProcessingParser.CASE, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(ProcessingParser.COLON, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public DEFAULT(): TerminalNode {
		return this.getToken(ProcessingParser.DEFAULT, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_switchLabel;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitSwitchLabel) {
			return visitor.visitSwitchLabel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForControlContext extends ParserRuleContext {
	public _forUpdate!: ExpressionListContext;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public enhancedForControl(): EnhancedForControlContext {
		return this.getTypedRuleContext(EnhancedForControlContext, 0) as EnhancedForControlContext;
	}
	public SEMI_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.SEMI);
	}
	public SEMI(i: number): TerminalNode {
		return this.getToken(ProcessingParser.SEMI, i);
	}
	public forInit(): ForInitContext {
		return this.getTypedRuleContext(ForInitContext, 0) as ForInitContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public expressionList(): ExpressionListContext {
		return this.getTypedRuleContext(ExpressionListContext, 0) as ExpressionListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_forControl;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitForControl) {
			return visitor.visitForControl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForInitContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localVariableDeclaration(): LocalVariableDeclarationContext {
		return this.getTypedRuleContext(LocalVariableDeclarationContext, 0) as LocalVariableDeclarationContext;
	}
	public expressionList(): ExpressionListContext {
		return this.getTypedRuleContext(ExpressionListContext, 0) as ExpressionListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_forInit;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitForInit) {
			return visitor.visitForInit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnhancedForControlContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getTypedRuleContext(VariableDeclaratorIdContext, 0) as VariableDeclaratorIdContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(ProcessingParser.COLON, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public variableModifier_list(): VariableModifierContext[] {
		return this.getTypedRuleContexts(VariableModifierContext) as VariableModifierContext[];
	}
	public variableModifier(i: number): VariableModifierContext {
		return this.getTypedRuleContext(VariableModifierContext, i) as VariableModifierContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_enhancedForControl;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitEnhancedForControl) {
			return visitor.visitEnhancedForControl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParExpressionContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_parExpression;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitParExpression) {
			return visitor.visitParExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionListContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_expressionList;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitExpressionList) {
			return visitor.visitExpressionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public _prefix!: Token;
	public _bop!: Token;
	public _postfix!: Token;
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public primary(): PrimaryContext {
		return this.getTypedRuleContext(PrimaryContext, 0) as PrimaryContext;
	}
	public methodCall(): MethodCallContext {
		return this.getTypedRuleContext(MethodCallContext, 0) as MethodCallContext;
	}
	public NEW(): TerminalNode {
		return this.getToken(ProcessingParser.NEW, 0);
	}
	public creator(): CreatorContext {
		return this.getTypedRuleContext(CreatorContext, 0) as CreatorContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public typeType(): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, 0) as TypeTypeContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public ADD(): TerminalNode {
		return this.getToken(ProcessingParser.ADD, 0);
	}
	public SUB(): TerminalNode {
		return this.getToken(ProcessingParser.SUB, 0);
	}
	public INC(): TerminalNode {
		return this.getToken(ProcessingParser.INC, 0);
	}
	public DEC(): TerminalNode {
		return this.getToken(ProcessingParser.DEC, 0);
	}
	public TILDE(): TerminalNode {
		return this.getToken(ProcessingParser.TILDE, 0);
	}
	public BANG(): TerminalNode {
		return this.getToken(ProcessingParser.BANG, 0);
	}
	public lambdaExpression(): LambdaExpressionContext {
		return this.getTypedRuleContext(LambdaExpressionContext, 0) as LambdaExpressionContext;
	}
	public COLONCOLON(): TerminalNode {
		return this.getToken(ProcessingParser.COLONCOLON, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
	public classType(): ClassTypeContext {
		return this.getTypedRuleContext(ClassTypeContext, 0) as ClassTypeContext;
	}
	public MUL(): TerminalNode {
		return this.getToken(ProcessingParser.MUL, 0);
	}
	public DIV(): TerminalNode {
		return this.getToken(ProcessingParser.DIV, 0);
	}
	public MOD(): TerminalNode {
		return this.getToken(ProcessingParser.MOD, 0);
	}
	public LT_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LT);
	}
	public LT(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LT, i);
	}
	public GT_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.GT);
	}
	public GT(i: number): TerminalNode {
		return this.getToken(ProcessingParser.GT, i);
	}
	public LE(): TerminalNode {
		return this.getToken(ProcessingParser.LE, 0);
	}
	public GE(): TerminalNode {
		return this.getToken(ProcessingParser.GE, 0);
	}
	public EQUAL(): TerminalNode {
		return this.getToken(ProcessingParser.EQUAL, 0);
	}
	public NOTEQUAL(): TerminalNode {
		return this.getToken(ProcessingParser.NOTEQUAL, 0);
	}
	public BITAND(): TerminalNode {
		return this.getToken(ProcessingParser.BITAND, 0);
	}
	public CARET(): TerminalNode {
		return this.getToken(ProcessingParser.CARET, 0);
	}
	public BITOR(): TerminalNode {
		return this.getToken(ProcessingParser.BITOR, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(ProcessingParser.AND, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(ProcessingParser.OR, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(ProcessingParser.COLON, 0);
	}
	public QUESTION(): TerminalNode {
		return this.getToken(ProcessingParser.QUESTION, 0);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ASSIGN, 0);
	}
	public ADD_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.ADD_ASSIGN, 0);
	}
	public SUB_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.SUB_ASSIGN, 0);
	}
	public MUL_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.MUL_ASSIGN, 0);
	}
	public DIV_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.DIV_ASSIGN, 0);
	}
	public AND_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.AND_ASSIGN, 0);
	}
	public OR_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.OR_ASSIGN, 0);
	}
	public XOR_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.XOR_ASSIGN, 0);
	}
	public RSHIFT_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.RSHIFT_ASSIGN, 0);
	}
	public URSHIFT_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.URSHIFT_ASSIGN, 0);
	}
	public LSHIFT_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.LSHIFT_ASSIGN, 0);
	}
	public MOD_ASSIGN(): TerminalNode {
		return this.getToken(ProcessingParser.MOD_ASSIGN, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(ProcessingParser.DOT, 0);
	}
	public THIS(): TerminalNode {
		return this.getToken(ProcessingParser.THIS, 0);
	}
	public innerCreator(): InnerCreatorContext {
		return this.getTypedRuleContext(InnerCreatorContext, 0) as InnerCreatorContext;
	}
	public SUPER(): TerminalNode {
		return this.getToken(ProcessingParser.SUPER, 0);
	}
	public superSuffix(): SuperSuffixContext {
		return this.getTypedRuleContext(SuperSuffixContext, 0) as SuperSuffixContext;
	}
	public explicitGenericInvocation(): ExplicitGenericInvocationContext {
		return this.getTypedRuleContext(ExplicitGenericInvocationContext, 0) as ExplicitGenericInvocationContext;
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0) as NonWildcardTypeArgumentsContext;
	}
	public LBRACK(): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, 0);
	}
	public RBRACK(): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, 0);
	}
	public INSTANCEOF(): TerminalNode {
		return this.getToken(ProcessingParser.INSTANCEOF, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_expression;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaExpressionContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public lambdaParameters(): LambdaParametersContext {
		return this.getTypedRuleContext(LambdaParametersContext, 0) as LambdaParametersContext;
	}
	public ARROW(): TerminalNode {
		return this.getToken(ProcessingParser.ARROW, 0);
	}
	public lambdaBody(): LambdaBodyContext {
		return this.getTypedRuleContext(LambdaBodyContext, 0) as LambdaBodyContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_lambdaExpression;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLambdaExpression) {
			return visitor.visitLambdaExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaParametersContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, i);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public formalParameterList(): FormalParameterListContext {
		return this.getTypedRuleContext(FormalParameterListContext, 0) as FormalParameterListContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_lambdaParameters;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLambdaParameters) {
			return visitor.visitLambdaParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaBodyContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_lambdaBody;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitLambdaBody) {
			return visitor.visitLambdaBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public THIS(): TerminalNode {
		return this.getToken(ProcessingParser.THIS, 0);
	}
	public SUPER(): TerminalNode {
		return this.getToken(ProcessingParser.SUPER, 0);
	}
	public literal(): LiteralContext {
		return this.getTypedRuleContext(LiteralContext, 0) as LiteralContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		return this.getTypedRuleContext(TypeTypeOrVoidContext, 0) as TypeTypeOrVoidContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(ProcessingParser.DOT, 0);
	}
	public CLASS(): TerminalNode {
		return this.getToken(ProcessingParser.CLASS, 0);
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0) as NonWildcardTypeArgumentsContext;
	}
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
		return this.getTypedRuleContext(ExplicitGenericInvocationSuffixContext, 0) as ExplicitGenericInvocationSuffixContext;
	}
	public arguments(): ArgumentsContext {
		return this.getTypedRuleContext(ArgumentsContext, 0) as ArgumentsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_primary;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitPrimary) {
			return visitor.visitPrimary(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public classOrInterfaceType(): ClassOrInterfaceTypeContext {
		return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0) as ClassOrInterfaceTypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(ProcessingParser.DOT, 0);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassType) {
			return visitor.visitClassType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CreatorContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0) as NonWildcardTypeArgumentsContext;
	}
	public createdName(): CreatedNameContext {
		return this.getTypedRuleContext(CreatedNameContext, 0) as CreatedNameContext;
	}
	public classCreatorRest(): ClassCreatorRestContext {
		return this.getTypedRuleContext(ClassCreatorRestContext, 0) as ClassCreatorRestContext;
	}
	public arrayCreatorRest(): ArrayCreatorRestContext {
		return this.getTypedRuleContext(ArrayCreatorRestContext, 0) as ArrayCreatorRestContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_creator;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitCreator) {
			return visitor.visitCreator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CreatedNameContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, i);
	}
	public typeArgumentsOrDiamond_list(): TypeArgumentsOrDiamondContext[] {
		return this.getTypedRuleContexts(TypeArgumentsOrDiamondContext) as TypeArgumentsOrDiamondContext[];
	}
	public typeArgumentsOrDiamond(i: number): TypeArgumentsOrDiamondContext {
		return this.getTypedRuleContext(TypeArgumentsOrDiamondContext, i) as TypeArgumentsOrDiamondContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(ProcessingParser.DOT, i);
	}
	public primitiveType(): PrimitiveTypeContext {
		return this.getTypedRuleContext(PrimitiveTypeContext, 0) as PrimitiveTypeContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_createdName;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitCreatedName) {
			return visitor.visitCreatedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InnerCreatorContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public classCreatorRest(): ClassCreatorRestContext {
		return this.getTypedRuleContext(ClassCreatorRestContext, 0) as ClassCreatorRestContext;
	}
	public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsOrDiamondContext, 0) as NonWildcardTypeArgumentsOrDiamondContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_innerCreator;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitInnerCreator) {
			return visitor.visitInnerCreator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayCreatorRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
	public arrayInitializer(): ArrayInitializerContext {
		return this.getTypedRuleContext(ArrayInitializerContext, 0) as ArrayInitializerContext;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_arrayCreatorRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitArrayCreatorRest) {
			return visitor.visitArrayCreatorRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassCreatorRestContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public arguments(): ArgumentsContext {
		return this.getTypedRuleContext(ArgumentsContext, 0) as ArgumentsContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_classCreatorRest;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitClassCreatorRest) {
			return visitor.visitClassCreatorRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExplicitGenericInvocationContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0) as NonWildcardTypeArgumentsContext;
	}
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
		return this.getTypedRuleContext(ExplicitGenericInvocationSuffixContext, 0) as ExplicitGenericInvocationSuffixContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_explicitGenericInvocation;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitExplicitGenericInvocation) {
			return visitor.visitExplicitGenericInvocation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentsOrDiamondContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LT(): TerminalNode {
		return this.getToken(ProcessingParser.LT, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(ProcessingParser.GT, 0);
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeArgumentsOrDiamond;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeArgumentsOrDiamond) {
			return visitor.visitTypeArgumentsOrDiamond(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NonWildcardTypeArgumentsOrDiamondContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LT(): TerminalNode {
		return this.getToken(ProcessingParser.LT, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(ProcessingParser.GT, 0);
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0) as NonWildcardTypeArgumentsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_nonWildcardTypeArgumentsOrDiamond;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitNonWildcardTypeArgumentsOrDiamond) {
			return visitor.visitNonWildcardTypeArgumentsOrDiamond(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NonWildcardTypeArgumentsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LT(): TerminalNode {
		return this.getToken(ProcessingParser.LT, 0);
	}
	public typeList(): TypeListContext {
		return this.getTypedRuleContext(TypeListContext, 0) as TypeListContext;
	}
	public GT(): TerminalNode {
		return this.getToken(ProcessingParser.GT, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_nonWildcardTypeArguments;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitNonWildcardTypeArguments) {
			return visitor.visitNonWildcardTypeArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeListContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeType_list(): TypeTypeContext[] {
		return this.getTypedRuleContexts(TypeTypeContext) as TypeTypeContext[];
	}
	public typeType(i: number): TypeTypeContext {
		return this.getTypedRuleContext(TypeTypeContext, i) as TypeTypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeList;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeList) {
			return visitor.visitTypeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeTypeContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classOrInterfaceType(): ClassOrInterfaceTypeContext {
		return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0) as ClassOrInterfaceTypeContext;
	}
	public primitiveType(): PrimitiveTypeContext {
		return this.getTypedRuleContext(PrimitiveTypeContext, 0) as PrimitiveTypeContext;
	}
	public VAR(): TerminalNode {
		return this.getToken(ProcessingParser.VAR, 0);
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public LBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.LBRACK);
	}
	public LBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.LBRACK, i);
	}
	public RBRACK_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.RBRACK);
	}
	public RBRACK(i: number): TerminalNode {
		return this.getToken(ProcessingParser.RBRACK, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeType;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeType) {
			return visitor.visitTypeType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LT(): TerminalNode {
		return this.getToken(ProcessingParser.LT, 0);
	}
	public typeArgument_list(): TypeArgumentContext[] {
		return this.getTypedRuleContexts(TypeArgumentContext) as TypeArgumentContext[];
	}
	public typeArgument(i: number): TypeArgumentContext {
		return this.getTypedRuleContext(TypeArgumentContext, i) as TypeArgumentContext;
	}
	public GT(): TerminalNode {
		return this.getToken(ProcessingParser.GT, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(ProcessingParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(ProcessingParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_typeArguments;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitTypeArguments) {
			return visitor.visitTypeArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SuperSuffixContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public arguments(): ArgumentsContext {
		return this.getTypedRuleContext(ArgumentsContext, 0) as ArgumentsContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(ProcessingParser.DOT, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_superSuffix;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitSuperSuffix) {
			return visitor.visitSuperSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExplicitGenericInvocationSuffixContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SUPER(): TerminalNode {
		return this.getToken(ProcessingParser.SUPER, 0);
	}
	public superSuffix(): SuperSuffixContext {
		return this.getTypedRuleContext(SuperSuffixContext, 0) as SuperSuffixContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(ProcessingParser.IDENTIFIER, 0);
	}
	public arguments(): ArgumentsContext {
		return this.getTypedRuleContext(ArgumentsContext, 0) as ArgumentsContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_explicitGenericInvocationSuffix;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitExplicitGenericInvocationSuffix) {
			return visitor.visitExplicitGenericInvocationSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	constructor(parser?: ProcessingParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(ProcessingParser.RPAREN, 0);
	}
	public expressionList(): ExpressionListContext {
		return this.getTypedRuleContext(ExpressionListContext, 0) as ExpressionListContext;
	}
    public get ruleIndex(): number {
    	return ProcessingParser.RULE_arguments;
	}
	// @Override
	public accept<Result>(visitor: ProcessingVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
