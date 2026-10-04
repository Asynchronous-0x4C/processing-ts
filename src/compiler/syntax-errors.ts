// Syntax error messages for one tab.
//
// Lezer recovers from errors by inserting or skipping tokens and marks the spot with an error node,
// but it does not say what was expected. Messages are derived from three sources, in this order:
//   1. a light scan of the source: unterminated strings/comments and unbalanced brackets
//      (an unclosed "{" is located with an indentation heuristic, see unclosedBrace)
//   2. Lezer error nodes before the first problem found by the scan: an inserted token at a line
//      break after a token that can end a statement is reported as a missing ";", anything else as
//      an unexpected token.
// Only the first error per line is kept; later ones are usually consequences of the first.
import type { SyntaxNode, Tree } from "@lezer/common";
import { error, type Diagnostic } from "./diagnostics.ts";
import { lineIndex, lineStarts } from "./source.ts";

interface Token {
  start: number;
  end: number;
}

const OPENERS: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const CLOSERS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

interface Scan {
  tokens: Token[];
  /**
   * First lexical or bracket problem, with the position before which Lezer errors are still trusted,
   * and optionally a range in which the first Lezer error is the better place to report it.
   */
  problem: { diagnostic: Diagnostic; trustBefore: number; relocate?: [number, number] } | null;
}

const isWordChar = (c: number) =>
  (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 36 || c > 127;
const OPERATOR_CHARS = "=+-*/%<>!&|^~?:";

/** Tokenize just enough for messages, and check literals, comments and brackets. */
function scan(text: string, base: number, firstError: number): Scan {
  const tokens: Token[] = [];
  const stack: { ch: string; pos: number }[] = [];
  const pairs: { open: number; close: number }[] = [];
  /** "{" position → position of the enclosing "{" (-1 at the top level). */
  const braceParent = new Map<number, number>();
  let problem: Scan["problem"] = null;
  const fail = (code: string, message: string, start: number, end: number, trustBefore = start, relocate?: [number, number]) => {
    if (!problem) problem = { diagnostic: error(code, message, base + start, base + end), trustBefore, relocate };
  };
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text.charCodeAt(i);
    if (c === 32 || c === 9 || c === 10 || c === 13 || c === 12) { i++; continue; }
    const ch = text[i];
    if (ch === "/" && text[i + 1] === "/") {
      const e = text.indexOf("\n", i);
      i = e < 0 ? n : e;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      const e = text.indexOf("*/", i + 2);
      if (e < 0) {
        fail("unterminated-comment", "Unterminated comment: missing '*/'", i, i + 2);
        break;
      }
      i = e + 2;
      continue;
    }
    if (ch === '"' && text.startsWith('"""', i)) {
      let k = i + 3;
      while (k < n && !text.startsWith('"""', k)) k += text[k] === "\\" ? 2 : 1;
      if (k >= n) {
        fail("unterminated-string", "Unterminated text block: missing '\"\"\"'", i, i + 3);
        break;
      }
      tokens.push({ start: i, end: k + 3 });
      i = k + 3;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let k = i + 1;
      while (k < n && text[k] !== ch && text[k] !== "\n") k += text[k] === "\\" && text[k + 1] !== "\n" ? 2 : 1;
      if (k >= n || text[k] !== ch) {
        fail("unterminated-string", ch === '"' ? "Unterminated string: missing '\"'" : "Unterminated character literal: missing \"'\"", i, k);
        tokens.push({ start: i, end: k });
        i = k;
        continue;
      }
      tokens.push({ start: i, end: k + 1 });
      i = k + 1;
      continue;
    }
    if (isWordChar(c) || (ch === "." && isWordChar(text.charCodeAt(i + 1)) && text.charCodeAt(i + 1) <= 57)) {
      let k = i + 1;
      while (k < n && (isWordChar(text.charCodeAt(k)) || (text[k] === "." && /[0-9]/.test(text[i])))) k++;
      tokens.push({ start: i, end: k });
      i = k;
      continue;
    }
    if (OPERATOR_CHARS.includes(ch)) {
      let k = i + 1;
      while (k < n && OPERATOR_CHARS.includes(text[k]) && !(text[k] === "/" && (text[k + 1] === "/" || text[k + 1] === "*"))) k++;
      tokens.push({ start: i, end: k });
      i = k;
      continue;
    }
    tokens.push({ start: i, end: i + 1 });
    if (ch in OPENERS) {
      if (ch === "{") {
        let k = stack.length - 1;
        while (k >= 0 && stack[k].ch !== "{") k--;
        braceParent.set(i, k >= 0 ? stack[k].pos : -1);
      }
      stack.push({ ch, pos: i });
    }
    else if (ch in CLOSERS) {
      const top = stack[stack.length - 1];
      if (!top) fail("unbalanced", `Unexpected '${ch}' without a matching '${CLOSERS[ch]}'`, i, i + 1);
      else if (top.ch !== CLOSERS[ch]) {
        // The opener on top was never closed (e.g. "foo(a;" before "}"): the error is between the two.
        fail("unbalanced", `Missing '${OPENERS[top.ch]}'`, i, i + 1, top.pos, [top.pos + 1, i]);
        stack.pop();
        const below = stack[stack.length - 1];
        if (below && below.ch === CLOSERS[ch]) pairs.push({ open: stack.pop()!.pos, close: i });
      } else {
        stack.pop();
        if (ch === "}") pairs.push({ open: top.pos, close: i });
      }
    }
    i++;
  }
  if (!problem && stack.length) {
    const innermostParen = [...stack].reverse().find((s) => s.ch !== "{");
    if (innermostParen) {
      const p = innermostParen.pos;
      fail("unbalanced", `Missing '${OPENERS[innermostParen.ch]}'`, p, p + 1, p, [p + 1, n]);
    }
    else {
      const open = unclosedBrace(text, stack[0].pos, pairs, braceParent, firstError);
      fail("unbalanced", "Missing '}': this '{' is never closed", open, open + 1, open);
    }
  }
  return { tokens, problem };
}

/**
 * With one "}" missing, every brace from the culprit outwards is matched with its parent's "}". So the
 * culprit's (wrong) partner is less indented than the culprit's line and lines up with an enclosing
 * block instead. Of such pairs inside the outermost unclosed "{", the one closed first is the culprit
 * (its parent's is closed later). The culprit opens before the first error the parser found. Without
 * any such pair, the outermost unclosed "{" is reported.
 */
function unclosedBrace(text: string, outermost: number, pairs: { open: number; close: number }[], parent: Map<number, number>, before: number): number {
  const lineStart = (pos: number) => text.lastIndexOf("\n", pos - 1) + 1;
  const indentAt = (ls: number) => {
    let k = ls;
    while (text[k] === " " || text[k] === "\t") k++;
    return k;
  };
  // Indentation of the statement an opener belongs to: walk back over continuation lines
  // (`if (a &&` / `    b) {`): lines whose predecessor does not end with ; { } or is blank.
  const statementIndent = (pos: number) => {
    let ls = lineStart(pos);
    while (ls > 0) {
      const prevStart = lineStart(ls - 1);
      const prev = text.slice(prevStart, ls - 1).replace(/\/\/.*$/, "").trimEnd();
      if (prev === "" || /[;{}]$/.test(prev) || /^\s*(\/\*|\*)/.test(prev)) break;
      ls = prevStart;
    }
    return indentAt(ls) - ls;
  };
  let best: { open: number; close: number } | null = null;
  for (const p of pairs) {
    if (p.open <= outermost || p.open >= before || (best && p.close > best.close)) continue;
    const ls = lineStart(p.close);
    const k = indentAt(ls);
    if (k !== p.close) continue; // the "}" is not the first token on its line
    const indent = k - ls;
    if (indent >= statementIndent(p.open)) continue;
    for (let a = parent.get(p.open) ?? -1; a >= 0; a = parent.get(a) ?? -1) {
      if (statementIndent(a) === indent) {
        best = p;
        break;
      }
    }
  }
  return best ? best.open : outermost;
}

/** Index of the last token ending at or before `pos`. */
function tokenBefore(tokens: Token[], pos: number): number {
  let lo = 0;
  let hi = tokens.length - 1;
  let best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tokens[mid].end <= pos) { best = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return best;
}

const ENDS_EXPRESSION = /^([\w$\u0080-\uffff.]+|"[^]*|'[^]*|\)|\]|\+\+|--)$/;
const STARTS_EXPRESSION = /^([\w$\u0080-\uffff.]+|"[^]*|'[^]*|\(|!|~)$/;

export function syntaxErrors(text: string, tree: Tree, base: number): Diagnostic[] {
  const errors: { from: number; to: number; inFor: boolean }[] = [];
  tree.iterate({
    enter: (n) => {
      if (!n.type.isError) return;
      // A for header missing one of its two ';' (`i < n i++`, `i < n)`).
      let inFor = false;
      let p: SyntaxNode | null = n.node.parent;
      while (p && p.name !== "ForSpec") p = p.parent;
      if (p) inFor = p.getChildren(";").length < 2 && !p.getChild(":");
      errors.push({ from: n.from, to: n.to, inFor });
    },
  });
  // Everything the scan detects (unbalanced brackets, unterminated literals) also breaks the parse.
  if (!errors.length) return [];
  const { tokens, problem } = scan(text, base, errors[0].from);
  const starts = lineStarts(text);
  const line = (pos: number) => lineIndex(starts, pos);
  const tokenText = (t: Token) => {
    const s = text.slice(t.start, t.end);
    return s.length > 24 ? s.slice(0, 21) + "..." : s;
  };
  const out: Diagnostic[] = [];
  const seenLines = new Set<number>();
  const trustBefore = problem ? problem.trustBefore : Infinity;
  for (const e of errors) {
    if (e.from >= trustBefore) break;
    let d: Diagnostic;
    const pi = tokenBefore(tokens, e.from);
    const prev = pi >= 0 ? tokens[pi] : undefined;
    const next = tokens[pi + 1];
    const prevText = prev ? text.slice(prev.start, prev.end) : "";
    if (e.inFor && prev) {
      d = error("missing-semicolon", "Missing ';' in the 'for' header", base + prev.end);
    } else if (prev && (!next || line(prev.end) < line(next.start)) && ENDS_EXPRESSION.test(prevText)) {
      d = error("missing-semicolon", "Missing ';'", base + prev.end);
    } else if (e.to > e.from && next) {
      d = error("syntax", `Syntax error: unexpected '${tokenText(next)}'`, base + next.start, base + next.end);
    } else if (prev && next && ENDS_EXPRESSION.test(prevText) && STARTS_EXPRESSION.test(text.slice(next.start, next.end))) {
      d = error("missing-semicolon", `Missing ';' or an operator before '${tokenText(next)}'`, base + prev.end);
    } else if (!next) {
      d = error("syntax", "Syntax error: unexpected end of file", base + text.length);
    } else {
      d = error("syntax", `Syntax error: unexpected '${tokenText(next)}'`, base + next.start, base + next.end);
    }
    const l = line(d.start - base);
    if (seenLines.has(l)) continue;
    seenLines.add(l);
    out.push(d);
  }
  if (problem) {
    const d = problem.diagnostic;
    const r = problem.relocate;
    const at = r && errors.find((e) => e.from >= r[0] && e.from <= r[1]);
    if (at) {
      // Point at the end of the token before the error (where the missing bracket belongs).
      const prev = tokens[tokenBefore(tokens, at.from)];
      d.start = d.end = base + (prev && prev.end > r[0] - 1 ? prev.end : at.from);
    }
    out.push(d);
  }
  return out;
}
