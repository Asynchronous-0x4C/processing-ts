// Typed AST of a Processing sketch (built from the Lezer CST by cst-to-ast.ts).
//
// Positions: every node has `start`/`end` offsets in the sketch's position space (source.ts). Each tab
// owns its own range of that space, so one offset identifies the tab, line and column
// (`SketchSource.locate`). Nodes can therefore be moved between tabs' trees (e.g. by the mode
// handling) without losing where they came from.
//
// The AST is purely syntactic: names are not resolved, `a.b.c` is a chain of FieldAccess whose head may
// turn out to be a package or a type, and Processing's rewrites (float literals, mode wrapping) are left
// to later passes. Two Processing-specific normalizations are applied while building:
//   - the `color` type is the primitive `int` (PrimitiveType with `color: true`)
//   - `#RRGGBB` / `#AARRGGBB` are IntLiterals with the ARGB value (alpha 0xFF for the 6-digit form)
// Parentheses are not kept: the tree structure carries the grouping.
//
// Plain object literals only (no classes/enums) so the module also runs under Node's type stripping.
//
// The checker (check.ts) records its results on the nodes: `ty`/`constant` on expressions, `sym` on
// names and declarations, the chosen overload on calls. These fields are absent until checking.
import type { ClassSymbol, ConstValue, FieldSymbol, LocalSymbol, MethodSymbol, Type } from "./types.ts";

export interface NodeBase {
  start: number;
  end: number;
  /** Created by the compiler (e.g. the sketch class, static mode's setup()), not written by the user. */
  synthetic?: true;
}

/** Semantic information on expressions. */
export interface ExprBase extends NodeBase {
  /** Static type (after checking). */
  ty?: Type;
  /** Compile-time constant value, when the expression is a constant expression. */
  constant?: ConstValue;
}

/** What a name in an expression refers to. A class symbol means the name is a type (static access). */
export type NameRef = LocalSymbol | FieldSymbol | ClassSymbol | { kind: "package"; name: string };

/** A name with its position (declaration names, member names, labels). */
export interface Ident {
  text: string;
  start: number;
  end: number;
}

// ---------------------------------------------------------------------------------------------------
// Modifiers

export const Modifier = {
  Public: 1 << 0,
  Protected: 1 << 1,
  Private: 1 << 2,
  Abstract: 1 << 3,
  Static: 1 << 4,
  Final: 1 << 5,
  Strictfp: 1 << 6,
  Default: 1 << 7,
  Synchronized: 1 << 8,
  Native: 1 << 9,
  Transient: 1 << 10,
  Volatile: 1 << 11,
} as const;

export const MODIFIER_NAMES: Record<string, number> = {
  public: Modifier.Public, protected: Modifier.Protected, private: Modifier.Private, abstract: Modifier.Abstract,
  static: Modifier.Static, final: Modifier.Final, strictfp: Modifier.Strictfp, default: Modifier.Default,
  synchronized: Modifier.Synchronized, native: Modifier.Native, transient: Modifier.Transient, volatile: Modifier.Volatile,
};

export function modifierText(flags: number): string {
  return Object.entries(MODIFIER_NAMES).filter(([, f]) => flags & f).map(([n]) => n).join(" ");
}

/** `@Name(...)`. Arguments are not kept (no annotation has a meaning for the compiler yet). */
export interface Annotation extends NodeBase {
  kind: "Annotation";
  name: string;
}

export interface Modified {
  /** Bit set of `Modifier`. */
  modifiers: number;
  annotations: Annotation[];
}

// ---------------------------------------------------------------------------------------------------
// Types

/** Type nodes record the type they denote. */
export interface TypeBase extends NodeBase {
  resolved?: Type;
}

export type PrimitiveName = "byte" | "short" | "int" | "long" | "char" | "float" | "double" | "boolean";

export interface PrimitiveType extends TypeBase {
  kind: "PrimitiveType";
  name: PrimitiveName;
  /** Written as Processing's `color` (an alias of int). */
  color?: true;
}

export interface VoidType extends TypeBase {
  kind: "VoidType";
}

/** `var` in a local variable declaration (inferred type). */
export interface VarType extends TypeBase {
  kind: "VarType";
}

/**
 * `Name`, `pkg.Name`, `Outer.Inner<T>`, `Map.Entry<K, V>`. `qualifier` is the part before the last dot
 * (may be a package name; resolved by the checker). `typeArgs`: null = none, [] = diamond `<>`.
 */
export interface ClassType extends TypeBase {
  kind: "ClassType";
  qualifier: ClassType | null;
  name: Ident;
  typeArgs: TypeArgument[] | null;
}

export interface ArrayType extends TypeBase {
  kind: "ArrayType";
  element: TypeNode;
}

/** `?`, `? extends T`, `? super T` (type arguments only). */
export interface WildcardType extends TypeBase {
  kind: "WildcardType";
  bound: TypeNode | null;
  /** true: `extends` (upper bound), false: `super`. */
  upper: boolean;
}

export type TypeNode = PrimitiveType | VoidType | VarType | ClassType | ArrayType;
export type TypeArgument = TypeNode | WildcardType;

// ---------------------------------------------------------------------------------------------------
// Expressions

export interface IntLiteral extends ExprBase {
  kind: "IntLiteral";
  /** Two's-complement value (hex/octal/binary literals wrap: 0xFFFFFFFF = -1). Longs beyond 2^53 lose precision. */
  value: number;
  long: boolean;
}

export interface FloatLiteral extends ExprBase {
  kind: "FloatLiteral";
  /** Exact decimal value as a double (the float rounding is applied by later passes). */
  value: number;
  /** Explicit suffix. Processing reads unsuffixed literals as float. */
  suffix: "f" | "d" | null;
}

export interface CharLiteral extends ExprBase {
  kind: "CharLiteral";
  /** UTF-16 code unit. */
  value: number;
}

export interface StringLiteral extends ExprBase {
  kind: "StringLiteral";
  value: string;
  textBlock?: true;
}

export interface BooleanLiteral extends ExprBase {
  kind: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteral extends ExprBase {
  kind: "NullLiteral";
}

export interface Identifier extends ExprBase {
  kind: "Identifier";
  name: string;
  sym?: NameRef;
  /** For an instance field: the (lexically enclosing) class whose `this` is the implicit qualifier. */
  implicitThis?: ClassSymbol;
}

/** `this` or `Outer.this`. */
export interface ThisExpr extends ExprBase {
  kind: "This";
  qualifier: Expression | null;
}

/** `super` as the target of a field access, method call or method reference (`Iface.super` has a qualifier). */
export interface SuperExpr extends ExprBase {
  kind: "Super";
  qualifier: Expression | null;
}

export interface FieldAccess extends ExprBase {
  kind: "FieldAccess";
  target: Expression;
  name: Ident;
  /** A field, `length` of an array (no symbol), a member type or a package. */
  sym?: NameRef;
}

export interface ArrayAccess extends ExprBase {
  kind: "ArrayAccess";
  array: Expression;
  index: Expression;
}

export interface MethodCall extends ExprBase {
  kind: "MethodCall";
  /** null for an unqualified call `f(x)`. */
  target: Expression | null;
  typeArgs: TypeArgument[] | null;
  name: Ident;
  args: Expression[];
  /** Chosen overload. */
  method?: MethodSymbol;
  /** Called in variable-arity form (the trailing arguments are packed into an array). */
  varargsCall?: boolean;
  /** Unqualified instance method call: the (lexically enclosing) class whose `this` is the receiver. */
  implicitThis?: ClassSymbol;
}

/** `new T(args)`, `outer.new Inner(args)`, anonymous classes (`body`). */
export interface NewObject extends ExprBase {
  kind: "NewObject";
  outer: Expression | null;
  /** Explicit constructor type arguments: `new <String>Foo()`. */
  typeArgs: TypeArgument[] | null;
  type: ClassType;
  args: Expression[];
  body: Member[] | null;
  ctor?: MethodSymbol;
  varargsCall?: boolean;
  /** Class of an anonymous class body. */
  anonymous?: ClassSymbol;
}

/** `new int[n][]`, `new String[] {"a"}`. `dimensions` has one entry per `[]` (null when unsized). */
export interface NewArray extends ExprBase {
  kind: "NewArray";
  elementType: TypeNode;
  dimensions: (Expression | null)[];
  initializer: ArrayInit | null;
}

/** `{a, b, c}` in a variable initializer or after `new T[]`. */
export interface ArrayInit extends ExprBase {
  kind: "ArrayInit";
  elements: Expression[];
}

export type UnaryOp = "+" | "-" | "!" | "~";
export interface Unary extends ExprBase {
  kind: "Unary";
  op: UnaryOp;
  operand: Expression;
}

export interface Update extends ExprBase {
  kind: "Update";
  op: "++" | "--";
  prefix: boolean;
  operand: Expression;
}

export type BinaryOp =
  | "*" | "/" | "%" | "+" | "-" | "<<" | ">>" | ">>>"
  | "<" | ">" | "<=" | ">=" | "==" | "!="
  | "&" | "^" | "|" | "&&" | "||";
export interface Binary extends ExprBase {
  kind: "Binary";
  op: BinaryOp;
  left: Expression;
  right: Expression;
}

export interface InstanceOf extends ExprBase {
  kind: "InstanceOf";
  expr: Expression;
  type: TypeNode;
}

export type AssignOp = "=" | "*=" | "/=" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=";
export interface Assign extends ExprBase {
  kind: "Assign";
  op: AssignOp;
  target: Expression;
  value: Expression;
}

export interface Conditional extends ExprBase {
  kind: "Conditional";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

/** `(T) x`, `(A & B) x` (extra interface bounds in `bounds`). */
export interface Cast extends ExprBase {
  kind: "Cast";
  type: TypeNode;
  bounds: TypeNode[];
  expr: Expression;
}

export interface Lambda extends ExprBase {
  kind: "Lambda";
  /** Parameters; `type` is null for inferred parameters (`x -> ...`, `(a, b) -> ...`). */
  params: Param[];
  body: Expression | Block;
  /** The functional interface method the lambda implements. */
  sam?: MethodSymbol;
}


/** `Type::name`, `expr::name`, `super::name`, `Type::new` (name.text === "new"). */
export interface MethodRef extends ExprBase {
  kind: "MethodRef";
  target: Expression | TypeNode;
  typeArgs: TypeArgument[] | null;
  name: Ident;
  method?: MethodSymbol;
}

/** `String.class`, `int[].class`. */
export interface ClassLit extends ExprBase {
  kind: "ClassLit";
  type: TypeNode;
}

/** Processing's conversion functions on primitive type names: `int(x)`, `float(s)`, ... */
export interface Conversion extends ExprBase {
  kind: "Conversion";
  type: PrimitiveName;
  args: Expression[];
}

/** Placeholder for an expression that could not be parsed (a syntax error was reported). */
export interface ErrorExpr extends ExprBase {
  kind: "ErrorExpr";
}

export type Expression =
  | IntLiteral | FloatLiteral | CharLiteral | StringLiteral | BooleanLiteral | NullLiteral
  | Identifier | ThisExpr | SuperExpr | FieldAccess | ArrayAccess | MethodCall | NewObject | NewArray | ArrayInit
  | Unary | Update | Binary | InstanceOf | Assign | Conditional | Cast | Lambda | MethodRef | ClassLit | Conversion
  | ErrorExpr;

// ---------------------------------------------------------------------------------------------------
// Statements

export interface Block extends NodeBase {
  kind: "Block";
  body: Statement[];
}

/** `int a = 1, b[] = {2};` — `dims` counts C-style brackets after the name (`b[]`). */
export interface VarDeclarator extends NodeBase {
  kind: "VarDeclarator";
  sym?: LocalSymbol | FieldSymbol;
  name: Ident;
  dims: number;
  init: Expression | null;
}

export interface LocalVar extends NodeBase, Modified {
  kind: "LocalVar";
  type: TypeNode;
  declarators: VarDeclarator[];
}

export interface ExprStmt extends NodeBase {
  kind: "ExprStmt";
  expr: Expression;
}

export interface If extends NodeBase {
  kind: "If";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface While extends NodeBase {
  kind: "While";
  test: Expression;
  body: Statement;
}

export interface DoWhile extends NodeBase {
  kind: "DoWhile";
  body: Statement;
  test: Expression;
}

export interface For extends NodeBase {
  kind: "For";
  /** A single LocalVar, or ExprStmts for `for (i = 0, j = 1; ...)`. */
  init: (LocalVar | ExprStmt)[];
  test: Expression | null;
  update: Expression[];
  body: Statement;
}

export interface ForEach extends NodeBase, Modified {
  kind: "ForEach";
  sym?: LocalSymbol;
  type: TypeNode;
  name: Ident;
  dims: number;
  iterable: Expression;
  body: Statement;
}

export interface Labeled extends NodeBase {
  kind: "Labeled";
  label: Ident;
  body: Statement;
}

/** One group of `case`/`default` labels and the statements after them. `null` in `labels` = `default`. */
export interface SwitchCase extends NodeBase {
  kind: "SwitchCase";
  labels: (Expression | null)[];
  body: Statement[];
}

export interface Switch extends NodeBase {
  kind: "Switch";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface Break extends NodeBase {
  kind: "Break";
  label: Ident | null;
}

export interface Continue extends NodeBase {
  kind: "Continue";
  label: Ident | null;
}

export interface Return extends NodeBase {
  kind: "Return";
  value: Expression | null;
}

export interface Throw extends NodeBase {
  kind: "Throw";
  expr: Expression;
}

export interface Assert extends NodeBase {
  kind: "Assert";
  test: Expression;
  message: Expression | null;
}

export interface Catch extends NodeBase, Modified {
  kind: "Catch";
  sym?: LocalSymbol;
  /** Alternatives of a multi-catch `catch (A | B e)`. */
  types: TypeNode[];
  name: Ident;
  body: Block;
}

/** `try`, with resources (LocalVar with one declarator, or an existing variable) when present. */
export interface Try extends NodeBase {
  kind: "Try";
  resources: (LocalVar | Expression)[];
  block: Block;
  catches: Catch[];
  finally: Block | null;
}

export interface Synchronized extends NodeBase {
  kind: "Synchronized";
  lock: Expression;
  body: Block;
}

export interface Empty extends NodeBase {
  kind: "Empty";
}

export type Statement =
  | Block | LocalVar | ExprStmt | If | While | DoWhile | For | ForEach | Labeled | Switch
  | Break | Continue | Return | Throw | Assert | Try | Synchronized | Empty
  | ClassDecl | InterfaceDecl | EnumDecl;

// ---------------------------------------------------------------------------------------------------
// Declarations

export interface TypeParam extends NodeBase {
  kind: "TypeParam";
  name: Ident;
  bounds: TypeNode[];
}

export interface Param extends NodeBase, Modified {
  kind: "Param";
  sym?: LocalSymbol;
  /** null for inferred lambda parameters. */
  type: TypeNode | null;
  name: Ident;
  dims: number;
  varargs: boolean;
}

export interface MethodDecl extends NodeBase, Modified {
  kind: "MethodDecl";
  sym?: MethodSymbol;
  typeParams: TypeParam[];
  returnType: TypeNode;
  name: Ident;
  params: Param[];
  /** Old-style array return type `int f()[]`. */
  dims: number;
  throws: TypeNode[];
  /** null for abstract / interface / native methods (`;`). */
  body: Block | null;
}

/** `this(...)` / `super(...)` / `outer.super(...)` at the start of a constructor body. */
export interface ConstructorCall extends NodeBase {
  kind: "ConstructorCall";
  super: boolean;
  outer: Expression | null;
  typeArgs: TypeArgument[] | null;
  args: Expression[];
}

export interface ConstructorDecl extends NodeBase, Modified {
  kind: "ConstructorDecl";
  sym?: MethodSymbol;
  typeParams: TypeParam[];
  name: Ident;
  params: Param[];
  throws: TypeNode[];
  call: ConstructorCall | null;
  body: Block;
}

export interface FieldDecl extends NodeBase, Modified {
  kind: "FieldDecl";
  type: TypeNode;
  declarators: VarDeclarator[];
}

/** Instance `{ ... }` or `static { ... }` initializer. */
export interface Initializer extends NodeBase {
  kind: "Initializer";
  static: boolean;
  body: Block;
}

export interface ClassDecl extends NodeBase, Modified {
  kind: "ClassDecl";
  sym?: ClassSymbol;
  name: Ident;
  typeParams: TypeParam[];
  superclass: ClassType | null;
  interfaces: ClassType[];
  body: Member[];
}

export interface InterfaceDecl extends NodeBase, Modified {
  kind: "InterfaceDecl";
  sym?: ClassSymbol;
  name: Ident;
  typeParams: TypeParam[];
  extends: ClassType[];
  body: Member[];
}

export interface EnumConstant extends NodeBase, Modified {
  kind: "EnumConstant";
  sym?: FieldSymbol;
  name: Ident;
  args: Expression[] | null;
  body: Member[] | null;
}

export interface EnumDecl extends NodeBase, Modified {
  kind: "EnumDecl";
  sym?: ClassSymbol;
  name: Ident;
  interfaces: ClassType[];
  constants: EnumConstant[];
  body: Member[];
}

export type TypeDecl = ClassDecl | InterfaceDecl | EnumDecl;
export type Member = FieldDecl | MethodDecl | ConstructorDecl | Initializer | TypeDecl;

export interface ImportDecl extends NodeBase {
  kind: "ImportDecl";
  /** Qualified name without the trailing `.*`. */
  name: string;
  static: boolean;
  wildcard: boolean;
}

/**
 * One tab. The top level holds statements (static mode), method declarations and the statements that
 * become fields in active mode (LocalVar), exactly as written; imports are collected separately because
 * Processing accepts them anywhere at the top level.
 */
export interface SketchFile extends NodeBase {
  kind: "File";
  /** Index of the tab in the sketch (0 = main tab). */
  tab: number;
  name: string;
  imports: ImportDecl[];
  members: (Statement | MethodDecl)[];
}

export type Node =
  | TypeNode | WildcardType | Expression | Statement | Annotation
  | VarDeclarator | SwitchCase | Catch | TypeParam | Param | MethodDecl | ConstructorCall | ConstructorDecl
  | FieldDecl | Initializer | EnumConstant | ImportDecl | SketchFile;

export type NodeKind = Node["kind"];

// ---------------------------------------------------------------------------------------------------
// Traversal

/** Calls `fn` for each direct child node, in source order. */
export function forEachChild(node: Node, fn: (child: Node) => void): void {
  const all = (xs: readonly Node[] | null) => { if (xs) for (const x of xs) fn(x); };
  const one = (x: Node | null) => { if (x) fn(x); };
  const mods = (m: Modified) => all(m.annotations);
  switch (node.kind) {
    case "PrimitiveType": case "VoidType": case "VarType": case "IntLiteral": case "FloatLiteral": case "CharLiteral":
    case "StringLiteral": case "BooleanLiteral": case "NullLiteral": case "Identifier": case "ErrorExpr": case "Annotation":
    case "Break": case "Continue": case "Empty": case "ImportDecl":
      return;
    case "ClassType": one(node.qualifier); all(node.typeArgs); return;
    case "ArrayType": fn(node.element); return;
    case "WildcardType": one(node.bound); return;
    case "This": case "Super": one(node.qualifier); return;
    case "FieldAccess": fn(node.target); return;
    case "ArrayAccess": fn(node.array); fn(node.index); return;
    case "MethodCall": one(node.target); all(node.typeArgs); all(node.args); return;
    case "NewObject": one(node.outer); all(node.typeArgs); fn(node.type); all(node.args); all(node.body); return;
    case "NewArray": fn(node.elementType); for (const d of node.dimensions) one(d); one(node.initializer); return;
    case "ArrayInit": all(node.elements); return;
    case "Unary": case "Update": fn(node.operand); return;
    case "Binary": fn(node.left); fn(node.right); return;
    case "InstanceOf": fn(node.expr); fn(node.type); return;
    case "Assign": fn(node.target); fn(node.value); return;
    case "Conditional": fn(node.test); fn(node.consequent); fn(node.alternate); return;
    case "Cast": fn(node.type); all(node.bounds); fn(node.expr); return;
    case "Lambda": all(node.params); fn(node.body); return;
    case "MethodRef": fn(node.target); all(node.typeArgs); return;
    case "ClassLit": fn(node.type); return;
    case "Conversion": all(node.args); return;
    case "Block": all(node.body); return;
    case "VarDeclarator": one(node.init); return;
    case "LocalVar": mods(node); fn(node.type); all(node.declarators); return;
    case "ExprStmt": fn(node.expr); return;
    case "If": fn(node.test); fn(node.consequent); one(node.alternate); return;
    case "While": fn(node.test); fn(node.body); return;
    case "DoWhile": fn(node.body); fn(node.test); return;
    case "For": all(node.init); one(node.test); all(node.update); fn(node.body); return;
    case "ForEach": mods(node); fn(node.type); fn(node.iterable); fn(node.body); return;
    case "Labeled": fn(node.body); return;
    case "SwitchCase": for (const l of node.labels) one(l); all(node.body); return;
    case "Switch": fn(node.discriminant); all(node.cases); return;
    case "Return": one(node.value); return;
    case "Throw": fn(node.expr); return;
    case "Assert": fn(node.test); one(node.message); return;
    case "Catch": mods(node); all(node.types); fn(node.body); return;
    case "Try": all(node.resources); fn(node.block); all(node.catches); one(node.finally); return;
    case "Synchronized": fn(node.lock); fn(node.body); return;
    case "TypeParam": all(node.bounds); return;
    case "Param": mods(node); one(node.type); return;
    case "MethodDecl": mods(node); all(node.typeParams); fn(node.returnType); all(node.params); all(node.throws); one(node.body); return;
    case "ConstructorCall": one(node.outer); all(node.typeArgs); all(node.args); return;
    case "ConstructorDecl": mods(node); all(node.typeParams); all(node.params); all(node.throws); one(node.call); fn(node.body); return;
    case "FieldDecl": mods(node); fn(node.type); all(node.declarators); return;
    case "Initializer": fn(node.body); return;
    case "ClassDecl": mods(node); all(node.typeParams); one(node.superclass); all(node.interfaces); all(node.body); return;
    case "InterfaceDecl": mods(node); all(node.typeParams); all(node.extends); all(node.body); return;
    case "EnumConstant": mods(node); all(node.args); all(node.body); return;
    case "EnumDecl": mods(node); all(node.interfaces); all(node.constants); all(node.body); return;
    case "File": all(node.imports); all(node.members); return;
    default: {
      const never: never = node;
      throw new Error(`forEachChild: unknown node ${(never as Node).kind}`);
    }
  }
}

/** Depth-first walk. Return false from `enter` to skip a node's children. */
export function walk(node: Node, enter: (node: Node) => boolean | void, leave?: (node: Node) => void): void {
  const visit = (n: Node) => {
    if (enter(n) !== false) forEachChild(n, visit);
    if (leave) leave(n);
  };
  visit(node);
}

// ---------------------------------------------------------------------------------------------------
// Debug printing

/**
 * Compact S-expression form for tests and debugging, e.g.
 * `(MethodCall println (args (Binary + (StringLiteral "a") (Identifier x))))`.
 * Positions are omitted unless `positions` is set. Empty lists and null fields are omitted.
 */
export function printAst(node: Node, options: { positions?: boolean } = {}): string {
  const fmt = (value: unknown): string | null => {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return value.length ? value.map((v) => fmt(v) ?? "null").join(" ") : null;
    if (typeof value === "object") {
      const o = value as Record<string, unknown>;
      if (typeof o.kind === "string") return printNode(o);
      if (typeof o.text === "string") return o.text; // Ident
      return JSON.stringify(o);
    }
    if (typeof value === "string") return JSON.stringify(value);
    return String(value);
  };
  const printNode = (o: Record<string, unknown>): string => {
    const parts: string[] = [o.kind as string];
    if (options.positions) parts.push(`@${o.start}-${o.end}`);
    for (const [key, value] of Object.entries(o)) {
      if (key === "kind" || key === "start" || key === "end" || SEMANTIC_FIELDS.has(key) || key === "annotations" && Array.isArray(value) && !value.length) continue;
      if (key === "modifiers") {
        if (value) parts.push(`[${modifierText(value as number)}]`);
        continue;
      }
      // Bare scalar names/operators read better than key=value.
      if ((key === "name" || key === "op" || key === "text") && (typeof value === "string" || (value && typeof value === "object" && "text" in value))) {
        parts.push(typeof value === "string" ? value : (value as Ident).text);
        continue;
      }
      if (key === "value" && typeof value !== "object") {
        parts.push(fmt(value)!);
        continue;
      }
      if (value === false && (key === "long" || key === "prefix" || key === "varargs" || key === "static" || key === "wildcard" || key === "super")) continue;
      if (key === "dims" && value === 0) continue;
      const s = fmt(value);
      if (s === null) continue;
      parts.push(Array.isArray(value) ? `(${key} ${s})` : typeof value === "object" ? (isNodeField(key) ? s : `(${key} ${s})`) : `${key}=${s}`);
    }
    return `(${parts.join(" ")})`;
  };
  return printNode(node as unknown as Record<string, unknown>);
}

// Checker results and markers; printAst shows the syntax only.
const SEMANTIC_FIELDS = new Set(["ty", "constant", "sym", "method", "ctor", "anonymous", "sam", "resolved", "varargsCall", "implicitThis", "synthetic"]);

// Fields whose node value is printed without a "(field ...)" wrapper because the kind already says it.
const isNodeField = (key: string) => key === "type" || key === "expr" || key === "operand" || key === "target" || key === "body"
  || key === "left" || key === "right" || key === "value" || key === "elementType" || key === "element" || key === "returnType" || key === "init";
