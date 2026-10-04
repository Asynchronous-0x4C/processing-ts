// Lezer CST (grammar/processing.grammar) → typed AST (ast.ts) for one tab.
//
// Besides the shape conversion, this pass reports the errors that the official Processing grammar
// (ANTLR) or javac's parser reject but the more permissive Lezer grammar accepts: statements that are
// not statement expressions, modifiers on locals, imports inside blocks, malformed array creation,
// literal ranges. It never throws on trees with syntax errors: missing parts become ErrorExpr / Empty
// so editors can still use the result.
//
// Two places where Lezer's precedences differ from Java's are fixed here by re-associating binary
// operator chains (see binaryChain): `==`/`!=` vs `<`/`>` and `instanceof` share one level in the
// grammar, and `(N) - 1` is parsed as a cast of `-1` although Java only allows a unary +/- operand
// after a primitive type cast.
import type { SyntaxNode, Tree } from "@lezer/common";
import type * as A from "./ast.ts";
import { MODIFIER_NAMES, Modifier } from "./ast.ts";
import { error, type Diagnostic } from "./diagnostics.ts";
import { decodeChar, decodeColor, decodeFloat, decodeInt, decodeString, decodeTextBlock } from "./literals.ts";

const PUNCTUATION = new Set(["(", ")", "{", "}", "[", "]", ".", ",", ";", ":"]);
const TYPE_NODES = new Set(["void", "var", "PrimitiveType", "TypeName", "ScopedTypeName", "GenericType", "ArrayType", "AnnotatedType"]);
const STATEMENT_EXPRESSIONS = new Set(["AssignmentExpression", "UpdateExpression", "MethodInvocation", "ObjectCreationExpression"]);

// Java binary operator precedence (higher binds tighter). All are left-associative.
const PRECEDENCE: Record<string, number> = {
  "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5, "==": 6, "!=": 6,
  "<": 7, ">": 7, "<=": 7, ">=": 7, instanceof: 7,
  "<<": 8, ">>": 8, ">>>": 8, "+": 9, "-": 9, "*": 10, "/": 10, "%": 10,
};

/** Children without comments. */
function kids(n: SyntaxNode): SyntaxNode[] {
  const out: SyntaxNode[] = [];
  for (let c = n.firstChild; c; c = c.nextSibling) if (c.name !== "LineComment" && c.name !== "BlockComment") out.push(c);
  return out;
}

/** Children without comments and punctuation. */
function parts(n: SyntaxNode): SyntaxNode[] {
  const out: SyntaxNode[] = [];
  for (let c = n.firstChild; c; c = c.nextSibling) {
    if (c.name !== "LineComment" && c.name !== "BlockComment" && !PUNCTUATION.has(c.name)) out.push(c);
  }
  return out;
}

type ChainOp = { op: string; at: number; type?: A.TypeNode };

export class AstBuilder {
  readonly diagnostics: Diagnostic[] = [];
  private readonly text: string;
  private readonly base: number;

  /** `text`: the tab's source; `base`: the tab's position in the sketch position space. */
  constructor(text: string, base: number) {
    this.text = text;
    this.base = base;
  }

  // --- helpers -------------------------------------------------------------------------------------

  private src(n: SyntaxNode): string {
    return this.text.slice(n.from, n.to);
  }

  private pos(n: SyntaxNode): { start: number; end: number } {
    return { start: this.base + n.from, end: this.base + n.to };
  }

  private ident(n: SyntaxNode): A.Ident {
    return { text: this.src(n), start: this.base + n.from, end: this.base + n.to };
  }

  private report(code: string, message: string, n: SyntaxNode | { start: number; end: number }) {
    if ("from" in n) this.diagnostics.push(error(code, message, this.base + n.from, this.base + n.to));
    else this.diagnostics.push(error(code, message, n.start, n.end));
  }

  /** A CST shape this builder does not expect. Only meaningful when the tree has no syntax errors. */
  private internal(n: SyntaxNode, what: string) {
    if (!n.type.isError) this.report("internal", `Internal compiler error: unexpected ${n.name} in ${what}`, n);
  }

  private errorExpr(at: SyntaxNode | number): A.ErrorExpr {
    const p = typeof at === "number" ? this.base + at : this.base + at.from;
    return { kind: "ErrorExpr", start: p, end: typeof at === "number" ? p : this.base + at.to };
  }

  private empty(at: number): A.Empty {
    return { kind: "Empty", start: this.base + at, end: this.base + at };
  }

  // --- file ----------------------------------------------------------------------------------------

  file(top: SyntaxNode, tab: number, name: string): A.SketchFile {
    const imports: A.ImportDecl[] = [];
    const members: (A.Statement | A.MethodDecl)[] = [];
    for (const c of kids(top)) {
      switch (c.name) {
        case "ImportDeclaration": imports.push(this.importDecl(c)); break;
        case "MethodDeclaration": members.push(this.method(c)); break;
        case ";": break;
        default: {
          const s = this.statement(c, true);
          if (s) members.push(s);
        }
      }
    }
    return { kind: "File", tab, name, imports, members, start: this.base + top.from, end: this.base + top.to };
  }

  private importDecl(n: SyntaxNode): A.ImportDecl {
    const ps = parts(n);
    const nameNode = ps.find((p) => p.name === "Identifier" || p.name === "ScopedIdentifier");
    return {
      kind: "ImportDecl",
      name: nameNode ? this.src(nameNode).replace(/\s+/g, "") : "",
      static: ps.some((p) => p.name === "static"),
      wildcard: ps.some((p) => p.name === "Asterisk"),
      ...this.pos(n),
    };
  }

  // --- modifiers -----------------------------------------------------------------------------------

  private modifiers(n: SyntaxNode | undefined): A.Modified {
    const out: A.Modified = { modifiers: 0, annotations: [] };
    if (!n || n.name !== "Modifiers") return out;
    for (const c of kids(n)) {
      const flag = MODIFIER_NAMES[c.name];
      if (flag !== undefined) {
        if (out.modifiers & flag) this.report("modifier", `Repeated modifier '${c.name}'`, c);
        out.modifiers |= flag;
      } else if (c.name === "MarkerAnnotation" || c.name === "Annotation") {
        out.annotations.push(this.annotation(c));
      }
    }
    return out;
  }

  private annotation(n: SyntaxNode): A.Annotation {
    const nameNode = parts(n).find((p) => p.name === "Identifier" || p.name === "ScopedIdentifier");
    return { kind: "Annotation", name: nameNode ? this.src(nameNode).replace(/\s+/g, "") : "", ...this.pos(n) };
  }

  /** Locals, parameters, catch and for-each variables only take `final` (and annotations). */
  private localModifiers(n: SyntaxNode | undefined): A.Modified {
    const m = this.modifiers(n);
    if (n && m.modifiers & ~Modifier.Final) {
      for (const c of kids(n)) {
        if (MODIFIER_NAMES[c.name] !== undefined && c.name !== "final") this.report("modifier", `Modifier '${c.name}' is not allowed here`, c);
      }
    }
    return m;
  }

  // --- types ---------------------------------------------------------------------------------------

  type(n: SyntaxNode | undefined): A.TypeNode {
    if (!n) return this.errorType(0);
    switch (n.name) {
      case "void": return { kind: "VoidType", ...this.pos(n) };
      case "var": return { kind: "VarType", ...this.pos(n) };
      case "PrimitiveType": return { kind: "PrimitiveType", name: this.src(n) as A.PrimitiveName, ...this.pos(n) };
      case "TypeName":
        // Processing: `color` is an alias of int.
        if (this.src(n) === "color") return { kind: "PrimitiveType", name: "int", color: true, ...this.pos(n) };
        return this.classType(n);
      case "ScopedTypeName":
      case "GenericType":
        return this.classType(n);
      case "ArrayType": {
        const ks = parts(n);
        let t = this.type(ks[0]);
        for (const d of ks.slice(1)) if (d.name === "Dimension") t = { kind: "ArrayType", element: t, start: t.start, end: this.base + d.to };
        return t;
      }
      case "AnnotatedType": return this.type(parts(n).find((p) => TYPE_NODES.has(p.name)));
      default:
        this.internal(n, "type");
        return this.errorType(n.from, n.to);
    }
  }

  private errorType(from: number, to = from): A.ClassType {
    return { kind: "ClassType", qualifier: null, name: { text: "", start: this.base + from, end: this.base + to }, typeArgs: null, start: this.base + from, end: this.base + to };
  }

  private classType(n: SyntaxNode): A.ClassType {
    switch (n.name) {
      case "TypeName":
        return { kind: "ClassType", qualifier: null, name: this.ident(n), typeArgs: null, ...this.pos(n) };
      case "ScopedTypeName": {
        const ps = parts(n).filter((p) => p.name !== "MarkerAnnotation" && p.name !== "Annotation");
        const last = ps[ps.length - 1];
        return { kind: "ClassType", qualifier: ps.length > 1 ? this.classType(ps[0]) : null, name: this.ident(last), typeArgs: null, ...this.pos(n) };
      }
      case "GenericType": {
        const [raw, args] = parts(n);
        const t = this.classType(raw);
        return { ...t, typeArgs: args ? this.typeArgs(args) : [], ...this.pos(n) };
      }
      default: {
        const t = this.type(n);
        if (t.kind === "ClassType") return t;
        this.report("syntax", `Expected a class type, found '${this.src(n)}'`, n);
        return this.errorType(n.from, n.to);
      }
    }
  }

  private typeArgs(n: SyntaxNode): A.TypeArgument[] {
    return parts(n).map((p) => {
      if (p.name !== "Wildcard") return this.type(p);
      const ps = parts(p);
      const boundNode = ps.find((x) => TYPE_NODES.has(x.name));
      return { kind: "WildcardType", bound: boundNode ? this.type(boundNode) : null, upper: !ps.some((x) => x.name === "super"), ...this.pos(p) };
    });
  }

  private typeParams(n: SyntaxNode | undefined): A.TypeParam[] {
    if (!n) return [];
    return parts(n).filter((p) => p.name === "TypeParameter").map((p) => {
      const ps = parts(p);
      const def = ps.find((x) => x.name === "Definition");
      const bound = ps.find((x) => x.name === "TypeBound");
      return {
        kind: "TypeParam",
        name: def ? this.ident(def) : { text: "", start: this.base + p.from, end: this.base + p.from },
        bounds: bound ? parts(bound).filter((x) => TYPE_NODES.has(x.name)).map((x) => this.type(x)) : [],
        ...this.pos(p),
      };
    });
  }

  private typeList(n: SyntaxNode | undefined): A.TypeNode[] {
    if (!n) return [];
    const list = n.name === "InterfaceTypeList" ? n : parts(n).find((p) => p.name === "InterfaceTypeList");
    return (list ? parts(list) : parts(n)).filter((p) => TYPE_NODES.has(p.name)).map((p) => this.type(p));
  }

  private classTypes(n: SyntaxNode | undefined): A.ClassType[] {
    return this.typeList(n).filter((t): t is A.ClassType => {
      if (t.kind === "ClassType") return true;
      this.report("syntax", "Expected a class or interface type", t);
      return false;
    });
  }

  // --- expressions ---------------------------------------------------------------------------------

  expr(n: SyntaxNode | undefined, fallback = 0): A.Expression {
    if (!n) return this.errorExpr(fallback);
    switch (n.name) {
      case "IntegerLiteral": return this.intLiteral(n, false);
      case "FloatingPointLiteral": {
        const d = decodeFloat(this.src(n));
        if (d.error) this.report("literal", d.error, n);
        return { kind: "FloatLiteral", value: d.value, suffix: d.suffix, ...this.pos(n) };
      }
      case "BooleanLiteral": return { kind: "BooleanLiteral", value: this.src(n) === "true", ...this.pos(n) };
      case "CharacterLiteral": {
        const d = decodeChar(this.src(n));
        if (d.error) this.report("literal", d.error, n);
        return { kind: "CharLiteral", value: d.value, ...this.pos(n) };
      }
      case "StringLiteral": {
        const d = decodeString(this.src(n));
        if (d.error) this.report("literal", d.error, n);
        return { kind: "StringLiteral", value: d.value, ...this.pos(n) };
      }
      case "TextBlock": {
        const d = decodeTextBlock(this.src(n));
        if (d.error) this.report("literal", d.error, n);
        return { kind: "StringLiteral", value: d.value, textBlock: true, ...this.pos(n) };
      }
      case "ColorLiteral": return { kind: "IntLiteral", value: decodeColor(this.src(n)), long: false, ...this.pos(n) };
      case "null": return { kind: "NullLiteral", ...this.pos(n) };
      case "this": return { kind: "This", qualifier: null, ...this.pos(n) };
      case "Identifier": return { kind: "Identifier", name: this.src(n), ...this.pos(n) };
      case "ClassLiteral": return { kind: "ClassLit", type: this.type(parts(n)[0]), ...this.pos(n) };
      case "ParenthesizedExpression": return this.expr(parts(n)[0], n.to);
      case "FieldAccess": return this.fieldAccess(n);
      case "ArrayAccess": {
        const [array, index] = parts(n);
        return { kind: "ArrayAccess", array: this.expr(array, n.from), index: this.expr(index, n.to), ...this.pos(n) };
      }
      case "MethodInvocation": return this.methodCall(n);
      case "ObjectCreationExpression": return this.newObject(n);
      case "ArrayCreationExpression": return this.newArray(n);
      case "ArrayInitializer": return this.arrayInit(n);
      case "MethodReference": return this.methodRef(n);
      case "ConversionCall": {
        const [t, args] = parts(n);
        return { kind: "Conversion", type: this.src(t) as A.PrimitiveName, args: this.args(args), ...this.pos(n) };
      }
      case "AssignmentExpression": {
        const [target, op, value] = parts(n);
        return { kind: "Assign", op: (op ? this.src(op) : "=") as A.AssignOp, target: this.expr(target, n.from), value: this.expr(value, n.to), ...this.pos(n) };
      }
      case "BinaryExpression":
      case "InstanceofExpression":
        return this.binaryChain(n);
      case "CastExpression": return this.isPseudoCast(n) ? this.binaryChain(n) : this.cast(n);
      case "UnaryExpression": {
        const [op, operand] = parts(n);
        const o = this.src(op) as A.UnaryOp;
        const value = o === "-" && operand?.name === "IntegerLiteral" ? this.intLiteral(operand, true) : this.expr(operand, n.to);
        return { kind: "Unary", op: o, operand: value, ...this.pos(n) };
      }
      case "UpdateExpression": {
        const ps = parts(n);
        const prefix = ps[0]?.name === "UpdateOp";
        const op = this.src(prefix ? ps[0] : ps[1] ?? ps[0]) as "++" | "--";
        return { kind: "Update", op, prefix, operand: this.expr(prefix ? ps[1] : ps[0], n.to), ...this.pos(n) };
      }
      case "TernaryExpression": {
        const ps = parts(n).filter((p) => p.name !== "LogicOp");
        return { kind: "Conditional", test: this.expr(ps[0], n.from), consequent: this.expr(ps[1], n.to), alternate: this.expr(ps[2], n.to), ...this.pos(n) };
      }
      case "LambdaExpression": return this.lambda(n);
      default:
        this.internal(n, "expression");
        return this.errorExpr(n);
    }
  }

  private intLiteral(n: SyntaxNode, negated: boolean): A.IntLiteral {
    const d = decodeInt(this.src(n), negated);
    if (d.error) this.report("literal", d.error, n);
    return { kind: "IntLiteral", value: d.value, long: d.long, ...this.pos(n) };
  }

  private args(n: SyntaxNode | undefined): A.Expression[] {
    return n ? parts(n).map((p) => this.expr(p)) : [];
  }

  /** `a.b`, `super.x`, `X.super.x`, `Outer.this`. */
  private fieldAccess(n: SyntaxNode): A.Expression {
    const ps = parts(n);
    const last = ps[ps.length - 1];
    const prefix = ps.slice(0, -1);
    let target: A.Expression;
    if (prefix.length === 0) target = this.errorExpr(n.from);
    else if (prefix[prefix.length - 1].name === "super") {
      const q = prefix.length > 1 ? this.expr(prefix[0]) : null;
      target = { kind: "Super", qualifier: q, start: this.base + n.from, end: this.base + prefix[prefix.length - 1].to };
    } else target = this.expr(prefix[0]);
    if (last.name === "this") return { kind: "This", qualifier: target, ...this.pos(n) };
    if (last.name !== "Identifier") return this.errorExpr(n);
    return { kind: "FieldAccess", target, name: this.ident(last), ...this.pos(n) };
  }

  private methodCall(n: SyntaxNode): A.MethodCall {
    const ps = parts(n);
    const nameIdx = ps.findIndex((p) => p.name === "MethodName");
    const nameNode = nameIdx >= 0 ? ps[nameIdx] : undefined;
    const pre = nameIdx >= 0 ? ps.slice(0, nameIdx) : [];
    const typeArgsNode = pre.find((p) => p.name === "TypeArguments");
    const exprs = pre.filter((p) => p.name !== "TypeArguments");
    let target: A.Expression | null = null;
    if (exprs.length === 1) {
      target = exprs[0].name === "super" ? { kind: "Super", qualifier: null, ...this.pos(exprs[0]) } : this.expr(exprs[0]);
    } else if (exprs.length === 2) {
      target = { kind: "Super", qualifier: this.expr(exprs[0]), start: this.base + exprs[0].from, end: this.base + exprs[1].to };
    }
    const nameId = nameNode ? this.ident(nameNode) : { text: "", start: this.base + n.from, end: this.base + n.from };
    return {
      kind: "MethodCall",
      target,
      typeArgs: typeArgsNode ? this.typeArgs(typeArgsNode) : null,
      name: nameId,
      args: this.args(ps.find((p) => p.name === "ArgumentList")),
      ...this.pos(n),
    };
  }

  private newObject(n: SyntaxNode): A.NewObject {
    const ps = parts(n);
    const newIdx = ps.findIndex((p) => p.name === "new");
    const outer = newIdx > 0 ? this.expr(ps[0]) : null;
    const rest = ps.slice(newIdx + 1);
    let i = 0;
    const typeArgs = rest[i]?.name === "TypeArguments" ? this.typeArgs(rest[i++]) : null;
    const typeNode = rest[i];
    const type = typeNode && TYPE_NODES.has(typeNode.name) ? this.classType(typeNode) : this.errorType(n.from);
    const argsNode = rest.find((p) => p.name === "ArgumentList");
    const bodyNode = rest.find((p) => p.name === "ClassBody");
    return {
      kind: "NewObject",
      outer,
      typeArgs,
      type,
      args: this.args(argsNode),
      body: bodyNode ? this.classBody(bodyNode, type.name.text) : null,
      ...this.pos(n),
    };
  }

  private newArray(n: SyntaxNode): A.NewArray {
    const ps = parts(n);
    const elementType = this.type(ps.find((p) => TYPE_NODES.has(p.name)));
    const dimensions: (A.Expression | null)[] = [];
    for (const d of ps) {
      if (d.name !== "Dimension") continue;
      const e = parts(d).find((p) => p.name !== "MarkerAnnotation" && p.name !== "Annotation");
      if (e && dimensions.length && dimensions[dimensions.length - 1] === null) this.report("array-creation", "Array dimension expressions must come before empty dimensions", d);
      dimensions.push(e ? this.expr(e) : null);
    }
    const initNode = ps.find((p) => p.name === "ArrayInitializer");
    const initializer = initNode ? this.arrayInit(initNode) : null;
    if (initializer && dimensions.some((d) => d !== null)) this.report("array-creation", "An array creation cannot have both dimension expressions and an initializer", n);
    if (!initializer && dimensions[0] === null) this.report("array-creation", "Array dimension missing", n);
    return { kind: "NewArray", elementType, dimensions, initializer, ...this.pos(n) };
  }

  private arrayInit(n: SyntaxNode): A.ArrayInit {
    return { kind: "ArrayInit", elements: parts(n).map((p) => this.expr(p)), ...this.pos(n) };
  }

  private methodRef(n: SyntaxNode): A.MethodRef {
    const ps = parts(n);
    const t = ps[0];
    let target: A.Expression | A.TypeNode;
    if (!t) target = this.errorExpr(n);
    else if (t.name === "super") target = { kind: "Super", qualifier: null, ...this.pos(t) };
    else if (TYPE_NODES.has(t.name)) target = this.type(t);
    else target = this.expr(t);
    const typeArgsNode = ps.find((p) => p.name === "TypeArguments");
    const last = ps[ps.length - 1];
    return {
      kind: "MethodRef",
      target,
      typeArgs: typeArgsNode ? this.typeArgs(typeArgsNode) : null,
      name: last && last !== t ? this.ident(last) : { text: "", start: this.base + n.to, end: this.base + n.to },
      ...this.pos(n),
    };
  }

  private cast(n: SyntaxNode): A.Expression {
    const ks = kids(n);
    const close = ks.findIndex((k) => k.name === ")");
    const types = (close >= 0 ? ks.slice(0, close) : ks).filter((k) => TYPE_NODES.has(k.name)).map((k) => this.type(k));
    const operand = close >= 0 ? ks.slice(close + 1).find((k) => !PUNCTUATION.has(k.name)) : undefined;
    return {
      kind: "Cast",
      type: types[0] ?? this.errorType(n.from),
      bounds: types.slice(1),
      expr: this.expr(operand, n.to),
      ...this.pos(n),
    };
  }

  /**
   * `(N) - x`: Java reads this as a subtraction because a cast to a reference type cannot be followed by
   * unary +/-. The grammar produces a cast; binaryChain rewrites it.
   */
  private isPseudoCast(n: SyntaxNode): boolean {
    if (n.name !== "CastExpression") return false;
    const ps = parts(n);
    if (ps.length !== 2) return false;
    const [t, operand] = ps;
    if (t.name !== "TypeName" && t.name !== "ScopedTypeName") return false;
    if (t.name === "TypeName" && this.src(t) === "color") return false;
    return operand.name === "UnaryExpression" && operand.firstChild?.name === "ArithOp";
  }

  /** `(color)` */
  private isColorInParens(n: SyntaxNode): boolean {
    const ps = parts(n);
    return ps.length === 1 && ps[0].name === "Identifier" && this.src(ps[0]) === "color";
  }

  /** A type name used where Java parses an expression name: TypeName → Identifier, ScopedTypeName → FieldAccess. */
  private typeNameAsExpr(n: SyntaxNode): A.Expression {
    if (n.name === "TypeName") return { kind: "Identifier", name: this.src(n), ...this.pos(n) };
    const ps = parts(n);
    const last = ps[ps.length - 1];
    return { kind: "FieldAccess", target: this.typeNameAsExpr(ps[0]), name: this.ident(last), ...this.pos(n) };
  }

  /**
   * Flatten a chain of binary operators (and instanceof, and pseudo-casts) and rebuild it with Java's
   * precedences. Parenthesized operands stay atomic.
   */
  private binaryChain(root: SyntaxNode): A.Expression {
    const operands: A.Expression[] = [];
    const ops: ChainOp[] = [];
    const flatten = (n: SyntaxNode | undefined) => {
      if (!n) {
        operands.push(this.errorExpr(root.to));
        return;
      }
      if (n.name === "BinaryExpression") {
        const [l, op, r] = parts(n);
        flatten(l);
        ops.push({ op: op ? this.src(op) : "+", at: this.base + (op ?? n).from });
        flatten(r);
      } else if (n.name === "InstanceofExpression") {
        const ps = parts(n);
        flatten(ps[0]);
        ops.push({ op: "instanceof", at: this.base + n.from, type: this.type(ps.find((p, i) => i > 0 && TYPE_NODES.has(p.name))) });
      } else if (this.isPseudoCast(n)) {
        const [t, unary] = parts(n);
        const [op, operand] = parts(unary);
        operands.push(this.typeNameAsExpr(t));
        ops.push({ op: this.src(op), at: this.base + op.from });
        flatten(operand);
      } else if (n.name === "ParenthesizedExpression" && this.isColorInParens(n)) {
        colorCasts.set(operands.length, this.base + n.from);
        operands.push(this.expr(n));
      } else {
        operands.push(this.expr(n));
      }
    };
    // `(color) -1`: `color` is lowercase, so the grammar reads a parenthesized name minus 1; Processing
    // reads a cast of -1 to color (int). Fold such operands back into casts of the unary expression.
    const colorCasts = new Map<number, number>(); // operand index → position of "("
    flatten(root);
    if (colorCasts.size) {
      for (let k = operands.length - 2; k >= 0; k--) {
        const op = ops[k]?.op;
        if (!colorCasts.has(k) || (op !== "+" && op !== "-") || ops.slice(0, k).some((o) => o.op === "instanceof")) continue;
        const name = operands[k];
        const operand = operands[k + 1];
        const unary: A.Unary = { kind: "Unary", op, operand, start: ops[k].at, end: operand.end };
        const type: A.PrimitiveType = { kind: "PrimitiveType", name: "int", color: true, start: name.start, end: name.end };
        operands.splice(k, 2, { kind: "Cast", type, bounds: [], expr: unary, start: colorCasts.get(k)!, end: operand.end });
        ops.splice(k, 1);
      }
    }
    let oi = 0;
    let pi = 0;
    const climb = (minPrec: number): A.Expression => {
      let left = operands[oi++] ?? this.errorExpr(root.to);
      while (pi < ops.length && PRECEDENCE[ops[pi].op] >= minPrec) {
        const { op, type } = ops[pi++];
        if (op === "instanceof") {
          left = { kind: "InstanceOf", expr: left, type: type!, start: left.start, end: type!.end };
          continue;
        }
        const right = climb(PRECEDENCE[op] + 1);
        left = { kind: "Binary", op: op as A.BinaryOp, left, right, start: left.start, end: right.end };
      }
      return left;
    };
    return climb(0);
  }

  private lambda(n: SyntaxNode): A.Lambda {
    const [p, body] = parts(n);
    let params: A.Param[] = [];
    if (p?.name === "Definition") params = [this.inferredParam(p)];
    else if (p?.name === "InferredParameters") params = parts(p).filter((d) => d.name === "Definition").map((d) => this.inferredParam(d));
    else if (p?.name === "FormalParameters") params = this.params(p);
    return { kind: "Lambda", params, body: body?.name === "Block" ? this.block(body) : this.expr(body, n.to), ...this.pos(n) };
  }

  private inferredParam(d: SyntaxNode): A.Param {
    return { kind: "Param", modifiers: 0, annotations: [], type: null, name: this.ident(d), dims: 0, varargs: false, ...this.pos(d) };
  }

  // --- statements ----------------------------------------------------------------------------------

  block(n: SyntaxNode): A.Block {
    const body: A.Statement[] = [];
    for (const c of kids(n)) {
      if (c.name === "{" || c.name === "}") continue;
      const s = this.statement(c);
      if (s) body.push(s);
    }
    return { kind: "Block", body, ...this.pos(n) };
  }

  /** Statement or local declaration; null for error nodes and declarations reported as unsupported. */
  statement(n: SyntaxNode, topLevel = false): A.Statement | null {
    switch (n.name) {
      case "Block": return this.block(n);
      case ";": return { kind: "Empty", ...this.pos(n) };
      case "LocalVariableDeclaration": return this.localVar(n, topLevel);
      case "ExpressionStatement": {
        const e = parts(n)[0];
        if (e && !e.type.isError && !STATEMENT_EXPRESSIONS.has(e.name)) this.report("not-a-statement", "Not a statement", e);
        return { kind: "ExprStmt", expr: this.expr(e, n.from), ...this.pos(n) };
      }
      // Sub-statements are taken with kids(), not parts(): a lone ";" is an empty statement there.
      case "IfStatement": {
        const ks = kids(n);
        const ti = ks.findIndex((k) => k.name === "ParenthesizedExpression");
        const ei = ks.findIndex((k) => k.name === "else");
        return {
          kind: "If",
          test: this.condition(ks[ti], n),
          consequent: this.stmt(ti >= 0 && ti + 1 !== ei ? ks[ti + 1] : undefined, n.to),
          alternate: ei >= 0 ? this.stmt(ks[ei + 1], n.to) : null,
          ...this.pos(n),
        };
      }
      case "WhileStatement": {
        const ks = kids(n);
        return { kind: "While", test: this.condition(ks[1], n), body: this.stmt(ks[2], n.to), ...this.pos(n) };
      }
      case "DoStatement": {
        const ks = kids(n);
        return { kind: "DoWhile", body: this.stmt(ks[1], n.to), test: this.condition(ks[3], n), ...this.pos(n) };
      }
      case "ForStatement": return this.forStatement(n);
      case "EnhancedForStatement": return this.forEach(n);
      case "LabeledStatement": {
        const ks = kids(n);
        return { kind: "Labeled", label: this.ident(ks[0]), body: this.stmt(ks[2], n.to), ...this.pos(n) };
      }
      case "SwitchStatement": return this.switchStatement(n);
      case "BreakStatement":
      case "ContinueStatement": {
        const labelNode = parts(n).find((p) => p.name === "Label");
        const label = labelNode ? this.ident(labelNode) : null;
        return n.name === "BreakStatement" ? { kind: "Break", label, ...this.pos(n) } : { kind: "Continue", label, ...this.pos(n) };
      }
      case "ReturnStatement": {
        const e = parts(n)[1];
        return { kind: "Return", value: e ? this.expr(e) : null, ...this.pos(n) };
      }
      case "ThrowStatement": return { kind: "Throw", expr: this.expr(parts(n)[1], n.to), ...this.pos(n) };
      case "AssertStatement": {
        const ps = parts(n);
        return { kind: "Assert", test: this.expr(ps[1], n.to), message: ps[2] ? this.expr(ps[2]) : null, ...this.pos(n) };
      }
      case "SynchronizedStatement": {
        const ps = parts(n);
        const body = ps.find((p) => p.name === "Block");
        return { kind: "Synchronized", lock: this.condition(ps[1], n), body: body ? this.block(body) : this.emptyBlock(n.to), ...this.pos(n) };
      }
      case "TryStatement":
      case "TryWithResourcesStatement":
        return this.tryStatement(n);
      case "ClassDeclaration": return this.classDecl(n);
      case "InterfaceDeclaration": return this.interfaceDecl(n);
      case "EnumDeclaration": return this.enumDecl(n);
      case "AnnotationTypeDeclaration":
        this.report("unsupported", "Annotation type declarations are not supported", n);
        return null;
      case "ImportDeclaration":
        this.report("syntax", "Import declarations are only allowed at the top level of a tab", n);
        return null;
      case "PackageDeclaration":
        this.report("unsupported", "Package declarations are not supported in sketches", n);
        return null;
      case "ModuleDeclaration":
        this.report("unsupported", "Module declarations are not supported in sketches", n);
        return null;
      default:
        if (!n.type.isError) this.internal(n, "statement");
        return null;
    }
  }

  /** Statement in a position that requires one (e.g. an if branch). */
  private stmt(n: SyntaxNode | undefined, fallback: number): A.Statement {
    return (n && this.statement(n)) || this.empty(n ? n.from : fallback);
  }

  private emptyBlock(at: number): A.Block {
    return { kind: "Block", body: [], start: this.base + at, end: this.base + at };
  }

  /** `( expr )` of if/while/switch/synchronized. */
  private condition(n: SyntaxNode | undefined, parent: SyntaxNode): A.Expression {
    if (!n) return this.errorExpr(parent.to);
    return n.name === "ParenthesizedExpression" ? this.expr(parts(n)[0], n.to) : this.expr(n);
  }

  private localVar(n: SyntaxNode, topLevel: boolean): A.LocalVar {
    const ps = parts(n);
    const hasMods = ps[0]?.name === "Modifiers";
    // Top-level declarations become fields in active mode, where all field modifiers are allowed.
    const mods = topLevel ? this.modifiers(hasMods ? ps[0] : undefined) : this.localModifiers(hasMods ? ps[0] : undefined);
    const typeNode = ps[hasMods ? 1 : 0];
    return {
      kind: "LocalVar",
      ...mods,
      type: this.type(typeNode),
      declarators: ps.filter((p) => p.name === "VariableDeclarator").map((p) => this.declarator(p)),
      ...this.pos(n),
    };
  }

  private declarator(n: SyntaxNode): A.VarDeclarator {
    const ps = parts(n);
    const def = ps.find((p) => p.name === "Definition");
    const assign = ps.findIndex((p) => p.name === "AssignOp");
    return {
      kind: "VarDeclarator",
      name: def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from },
      dims: ps.filter((p, i) => p.name === "Dimension" && (assign < 0 || i < assign)).length,
      init: assign >= 0 ? this.expr(ps[assign + 1], n.to) : null,
      ...this.pos(n),
    };
  }

  private forStatement(n: SyntaxNode): A.For {
    const ps = parts(n);
    const spec = ps.find((p) => p.name === "ForSpec");
    const init: (A.LocalVar | A.ExprStmt)[] = [];
    let test: A.Expression | null = null;
    const update: A.Expression[] = [];
    let section = 0;
    if (spec) {
      for (const k of kids(spec)) {
        if (k.name === ";") section++;
        else if (k.name === "LocalVariableDeclaration") {
          init.push(this.localVar(k, false));
          section = 1;
        } else if (!PUNCTUATION.has(k.name)) {
          if (section === 0) {
            if (!k.type.isError && !STATEMENT_EXPRESSIONS.has(k.name)) this.report("not-a-statement", "Not a statement", k);
            init.push({ kind: "ExprStmt", expr: this.expr(k), ...this.pos(k) });
          } else if (section === 1) test = this.expr(k);
          else {
            if (!k.type.isError && !STATEMENT_EXPRESSIONS.has(k.name)) this.report("not-a-statement", "Not a statement", k);
            update.push(this.expr(k));
          }
        }
      }
    }
    return { kind: "For", init, test, update, body: this.stmt(kids(n)[2], n.to), ...this.pos(n) };
  }

  private forEach(n: SyntaxNode): A.ForEach {
    const ps = parts(n);
    const spec = ps.find((p) => p.name === "ForSpec");
    const sp = spec ? parts(spec) : [];
    const hasMods = sp[0]?.name === "Modifiers";
    const mods = this.localModifiers(hasMods ? sp[0] : undefined);
    const typeNode = sp[hasMods ? 1 : 0];
    const def = sp.find((p) => p.name === "Definition");
    const defIdx = def ? sp.indexOf(def) : -1;
    const iterable = sp.slice(defIdx + 1).find((p) => p.name !== "Dimension");
    return {
      kind: "ForEach",
      ...mods,
      type: this.type(typeNode),
      name: def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from },
      dims: sp.filter((p, i) => i > defIdx && p.name === "Dimension").length,
      iterable: this.expr(iterable, n.to),
      body: this.stmt(kids(n)[2], n.to),
      ...this.pos(n),
    };
  }

  private switchStatement(n: SyntaxNode): A.Switch {
    const ps = parts(n);
    const blockNode = ps.find((p) => p.name === "SwitchBlock");
    const cases: A.SwitchCase[] = [];
    let current: A.SwitchCase | null = null;
    if (blockNode) {
      for (const k of kids(blockNode)) {
        if (k.name === "{" || k.name === "}") continue;
        if (k.name === "SwitchLabel") {
          if (!current || current.body.length) {
            current = { kind: "SwitchCase", labels: [], body: [], ...this.pos(k) };
            cases.push(current);
          }
          const isDefault = parts(k)[0]?.name === "default";
          current.labels.push(isDefault ? null : this.expr(parts(k)[1], k.to));
          current.end = this.base + k.to;
        } else {
          const s = this.statement(k);
          if (!s) continue;
          if (!current) {
            this.report("syntax", "Statement before the first 'case' label in a switch", k);
            continue;
          }
          current.body.push(s);
          current.end = s.end;
        }
      }
    }
    return { kind: "Switch", discriminant: this.condition(ps[1], n), cases, ...this.pos(n) };
  }

  private tryStatement(n: SyntaxNode): A.Try {
    const ps = parts(n);
    const resources: (A.LocalVar | A.Expression)[] = [];
    const spec = ps.find((p) => p.name === "ResourceSpecification");
    if (spec) {
      for (const r of parts(spec)) {
        if (r.name !== "Resource") continue;
        const rp = parts(r);
        if (rp.length === 1) resources.push(this.expr(rp[0]));
        else {
          const hasMods = rp[0].name === "Modifiers";
          const mods = this.localModifiers(hasMods ? rp[0] : undefined);
          const typeNode = rp[hasMods ? 1 : 0];
          const def = rp.find((p) => p.name === "Definition");
          const assign = rp.findIndex((p) => p.name === "AssignOp");
          const d: A.VarDeclarator = {
            kind: "VarDeclarator",
            name: def ? this.ident(def) : { text: "", start: this.base + r.from, end: this.base + r.from },
            dims: rp.filter((p, i) => p.name === "Dimension" && (assign < 0 || i < assign)).length,
            init: assign >= 0 ? this.expr(rp[assign + 1], r.to) : null,
            ...this.pos(r),
          };
          resources.push({ kind: "LocalVar", ...mods, type: this.type(typeNode), declarators: [d], ...this.pos(r) });
        }
      }
    }
    const blockNode = ps.find((p) => p.name === "Block");
    const catches = ps.filter((p) => p.name === "CatchClause").map((c) => this.catchClause(c));
    const fin = ps.find((p) => p.name === "FinallyClause");
    const finBlock = fin ? parts(fin).find((p) => p.name === "Block") : undefined;
    if (!spec && catches.length === 0 && !fin) this.report("syntax", "'try' without 'catch' or 'finally'", ps[0] ?? n);
    return {
      kind: "Try",
      resources,
      block: blockNode ? this.block(blockNode) : this.emptyBlock(n.to),
      catches,
      finally: fin ? (finBlock ? this.block(finBlock) : this.emptyBlock(fin.to)) : null,
      ...this.pos(n),
    };
  }

  private catchClause(n: SyntaxNode): A.Catch {
    const ps = parts(n);
    const param = ps.find((p) => p.name === "CatchFormalParameter");
    const pp = param ? parts(param) : [];
    const mods = this.localModifiers(pp[0]?.name === "Modifiers" ? pp[0] : undefined);
    const catchType = pp.find((p) => p.name === "CatchType");
    const def = pp.find((p) => p.name === "Definition");
    const body = ps.find((p) => p.name === "Block");
    return {
      kind: "Catch",
      ...mods,
      types: catchType ? parts(catchType).filter((p) => TYPE_NODES.has(p.name)).map((p) => this.type(p)) : [],
      name: def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from },
      body: body ? this.block(body) : this.emptyBlock(n.to),
      ...this.pos(n),
    };
  }

  // --- declarations --------------------------------------------------------------------------------

  private params(n: SyntaxNode | undefined): A.Param[] {
    if (!n) return [];
    const out: A.Param[] = [];
    for (const p of parts(n)) {
      if (p.name !== "FormalParameter" && p.name !== "SpreadParameter") continue;
      const ps = parts(p);
      const hasMods = ps[0]?.name === "Modifiers";
      const mods = this.localModifiers(hasMods ? ps[0] : undefined);
      const typeNode = ps[hasMods ? 1 : 0];
      // SpreadParameter wraps its name in a VariableDeclarator.
      const declNode = p.name === "SpreadParameter" ? ps.find((x) => x.name === "VariableDeclarator") : p;
      const dp = declNode ? parts(declNode) : [];
      const def = dp.find((x) => x.name === "Definition");
      if (p.name === "SpreadParameter" && dp.some((x) => x.name === "AssignOp")) this.report("syntax", "A parameter cannot have an initializer", declNode!);
      out.push({
        kind: "Param",
        ...mods,
        type: this.type(typeNode),
        name: def ? this.ident(def) : { text: "", start: this.base + p.from, end: this.base + p.from },
        dims: dp.filter((x) => x.name === "Dimension").length,
        varargs: p.name === "SpreadParameter",
        ...this.pos(p),
      });
    }
    const spread = out.findIndex((p) => p.varargs);
    if (spread >= 0 && spread !== out.length - 1) this.report("syntax", "A variable-arity parameter must be the last parameter", out[spread]);
    return out;
  }

  private throwsList(n: SyntaxNode | undefined): A.TypeNode[] {
    return n ? parts(n).filter((p) => TYPE_NODES.has(p.name)).map((p) => this.type(p)) : [];
  }

  method(n: SyntaxNode): A.MethodDecl {
    const ps = parts(n);
    const mods = this.modifiers(ps[0]?.name === "Modifiers" ? ps[0] : undefined);
    const def = ps.find((p) => p.name === "Definition");
    const defIdx = def ? ps.indexOf(def) : ps.length;
    // The return type is the last type node before the name (annotations may sit in between).
    const typeNode = ps.slice(0, defIdx).reverse().find((p) => TYPE_NODES.has(p.name));
    const body = ps.find((p) => p.name === "Block");
    return {
      kind: "MethodDecl",
      ...mods,
      typeParams: this.typeParams(ps.find((p) => p.name === "TypeParameters")),
      returnType: this.type(typeNode),
      name: def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from },
      params: this.params(ps.find((p) => p.name === "FormalParameters")),
      dims: ps.filter((p, i) => i > defIdx && p.name === "Dimension").length,
      throws: this.throwsList(ps.find((p) => p.name === "Throws")),
      body: body ? this.block(body) : null,
      ...this.pos(n),
    };
  }

  private constructorDecl(n: SyntaxNode, className: string): A.ConstructorDecl {
    const ps = parts(n);
    const mods = this.modifiers(ps[0]?.name === "Modifiers" ? ps[0] : undefined);
    const def = ps.find((p) => p.name === "Definition");
    const name = def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from };
    if (def && name.text !== className) this.report("syntax", `Invalid method declaration; return type required (or a constructor named '${className}')`, def);
    const bodyNode = ps.find((p) => p.name === "ConstructorBody");
    let call: A.ConstructorCall | null = null;
    const body: A.Statement[] = [];
    if (bodyNode) {
      for (const k of kids(bodyNode)) {
        if (k.name === "{" || k.name === "}") continue;
        if (k.name === "ExplicitConstructorInvocation") call = this.constructorCall(k);
        else {
          const s = this.statement(k);
          if (s) body.push(s);
        }
      }
    }
    return {
      kind: "ConstructorDecl",
      ...mods,
      typeParams: this.typeParams(ps.find((p) => p.name === "TypeParameters")),
      name,
      params: this.params(ps.find((p) => p.name === "FormalParameters")),
      throws: this.throwsList(ps.find((p) => p.name === "Throws")),
      call,
      body: bodyNode ? { kind: "Block", body, ...this.pos(bodyNode) } : this.emptyBlock(n.to),
      ...this.pos(n),
    };
  }

  private constructorCall(n: SyntaxNode): A.ConstructorCall {
    const ps = parts(n);
    const kw = ps.findIndex((p) => p.name === "this" || p.name === "super");
    const pre = ps.slice(0, Math.max(kw, 0));
    const outerNode = pre.find((p) => p.name !== "TypeArguments");
    const typeArgsNode = pre.find((p) => p.name === "TypeArguments");
    return {
      kind: "ConstructorCall",
      super: kw >= 0 && ps[kw].name === "super",
      outer: outerNode ? this.expr(outerNode) : null,
      typeArgs: typeArgsNode ? this.typeArgs(typeArgsNode) : null,
      args: this.args(ps.find((p) => p.name === "ArgumentList")),
      ...this.pos(n),
    };
  }

  private fieldDecl(n: SyntaxNode): A.FieldDecl {
    const ps = parts(n);
    const hasMods = ps[0]?.name === "Modifiers";
    return {
      kind: "FieldDecl",
      ...this.modifiers(hasMods ? ps[0] : undefined),
      type: this.type(ps[hasMods ? 1 : 0]),
      declarators: ps.filter((p) => p.name === "VariableDeclarator").map((p) => this.declarator(p)),
      ...this.pos(n),
    };
  }

  /** Members of a class, interface or enum body (or an anonymous class body). */
  private classBody(n: SyntaxNode, className: string): A.Member[] {
    const out: A.Member[] = [];
    for (const k of kids(n)) {
      switch (k.name) {
        case "{": case "}": case ";": case "EnumConstant": case ",": break;
        case "FieldDeclaration":
        case "ConstantDeclaration":
          out.push(this.fieldDecl(k));
          break;
        case "MethodDeclaration": out.push(this.method(k)); break;
        case "ConstructorDeclaration": out.push(this.constructorDecl(k, className)); break;
        case "Block": out.push({ kind: "Initializer", static: false, body: this.block(k), ...this.pos(k) }); break;
        case "StaticInitializer": {
          const b = parts(k).find((p) => p.name === "Block");
          out.push({ kind: "Initializer", static: true, body: b ? this.block(b) : this.emptyBlock(k.to), ...this.pos(k) });
          break;
        }
        case "ClassDeclaration": out.push(this.classDecl(k)); break;
        case "InterfaceDeclaration": out.push(this.interfaceDecl(k)); break;
        case "EnumDeclaration": out.push(this.enumDecl(k)); break;
        case "EnumBodyDeclarations": out.push(...this.classBody(k, className)); break;
        case "AnnotationTypeDeclaration": this.report("unsupported", "Annotation type declarations are not supported", k); break;
        default: this.internal(k, "class body");
      }
    }
    return out;
  }

  private declName(ps: SyntaxNode[], n: SyntaxNode): A.Ident {
    const def = ps.find((p) => p.name === "Definition");
    return def ? this.ident(def) : { text: "", start: this.base + n.from, end: this.base + n.from };
  }

  classDecl(n: SyntaxNode): A.ClassDecl {
    const ps = parts(n);
    const name = this.declName(ps, n);
    const sup = ps.find((p) => p.name === "Superclass");
    const supType = sup ? parts(sup).find((p) => TYPE_NODES.has(p.name)) : undefined;
    const body = ps.find((p) => p.name === "ClassBody");
    return {
      kind: "ClassDecl",
      ...this.modifiers(ps[0]?.name === "Modifiers" ? ps[0] : undefined),
      name,
      typeParams: this.typeParams(ps.find((p) => p.name === "TypeParameters")),
      superclass: supType ? this.classType(supType) : null,
      interfaces: this.classTypes(ps.find((p) => p.name === "SuperInterfaces")),
      body: body ? this.classBody(body, name.text) : [],
      ...this.pos(n),
    };
  }

  interfaceDecl(n: SyntaxNode): A.InterfaceDecl {
    const ps = parts(n);
    const name = this.declName(ps, n);
    const body = ps.find((p) => p.name === "InterfaceBody");
    return {
      kind: "InterfaceDecl",
      ...this.modifiers(ps[0]?.name === "Modifiers" ? ps[0] : undefined),
      name,
      typeParams: this.typeParams(ps.find((p) => p.name === "TypeParameters")),
      extends: this.classTypes(ps.find((p) => p.name === "ExtendsInterfaces")),
      body: body ? this.classBody(body, name.text) : [],
      ...this.pos(n),
    };
  }

  enumDecl(n: SyntaxNode): A.EnumDecl {
    const ps = parts(n);
    const name = this.declName(ps, n);
    const body = ps.find((p) => p.name === "EnumBody");
    const constants: A.EnumConstant[] = [];
    if (body) {
      for (const c of parts(body)) {
        if (c.name !== "EnumConstant") continue;
        const cp = parts(c);
        const args = cp.find((p) => p.name === "ArgumentList");
        const cbody = cp.find((p) => p.name === "ClassBody");
        constants.push({
          kind: "EnumConstant",
          ...this.modifiers(cp[0]?.name === "Modifiers" ? cp[0] : undefined),
          name: this.declName(cp, c),
          args: args ? this.args(args) : null,
          body: cbody ? this.classBody(cbody, "") : null,
          ...this.pos(c),
        });
      }
    }
    return {
      kind: "EnumDecl",
      ...this.modifiers(ps[0]?.name === "Modifiers" ? ps[0] : undefined),
      name,
      interfaces: this.classTypes(ps.find((p) => p.name === "SuperInterfaces")),
      constants,
      body: body ? this.classBody(body, name.text) : [],
      ...this.pos(n),
    };
  }
}

/** Convert one tab's CST. `base` is the tab's offset in the sketch position space. */
export function buildFile(tree: Tree, text: string, base: number, tab: number, name: string): { file: A.SketchFile; diagnostics: Diagnostic[] } {
  const b = new AstBuilder(text, base);
  const file = b.file(tree.topNode, tab, name);
  return { file, diagnostics: b.diagnostics };
}
