import { Texture, TextStyle, Graphics, BitmapFont, RenderTexture, CanvasTextMetrics, BitmapText, Matrix, Application } from "pixi.js";
var t = { 763: () => {
} }, e = {};
function n(s2) {
  var i2 = e[s2];
  if (i2 !== void 0) return i2.exports;
  var r2 = e[s2] = { exports: {} };
  return t[s2](r2, r2.exports, n), r2.exports;
}
n.d = (t2, e2) => {
  for (var s2 in e2) n.o(e2, s2) && !n.o(t2, s2) && Object.defineProperty(t2, s2, { enumerable: !0, get: e2[s2] });
}, n.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2);
var s = {};
n.d(s, { MG: () => $, fr: () => Lt, sR: () => Ae, Zo: () => ke, iH: () => Re, rt: () => Pt, jB: () => be, M8: () => le, $t: () => Ce, aq: () => me, pG: () => Ot, eP: () => Te, KU: () => xe, zW: () => Ie, IX: () => E, mY: () => _, a7: () => j, JG: () => Ut, ay: () => Xt, X2: () => ee, WU: () => de, Uw: () => ge, gw: () => pe, iX: () => Fe, re: () => se, Pg: () => Be, tD: () => ie, R$: () => te, Dj: () => Ft, m7: () => U, NZ: () => P, xo: () => b, ou: () => i, qC: () => ze, mD: () => d, Ay: () => Ye });
class i {
  constructor() {
    this.source = null, this.type = null, this.channel = null, this.start = null, this.stop = null, this.tokenIndex = null, this.line = null, this.column = null, this._text = null;
  }
  getTokenSource() {
    return this.source[0];
  }
  getInputStream() {
    return this.source[1];
  }
  get text() {
    return this._text;
  }
  set text(t2) {
    this._text = t2;
  }
}
function r(t2, e2) {
  if (!Array.isArray(t2) || !Array.isArray(e2)) return !1;
  if (t2 === e2) return !0;
  if (t2.length !== e2.length) return !1;
  for (let n2 = 0; n2 < t2.length; n2++) if (!(t2[n2] === e2[n2] || t2[n2].equals && t2[n2].equals(e2[n2]))) return !1;
  return !0;
}
i.INVALID_TYPE = 0, i.EPSILON = -2, i.MIN_USER_TOKEN_TYPE = 1, i.EOF = -1, i.DEFAULT_CHANNEL = 0, i.HIDDEN_CHANNEL = 1;
const o = Math.round(Math.random() * Math.pow(2, 32));
function a(t2) {
  if (!t2) return 0;
  const e2 = typeof t2, n2 = e2 === "string" ? t2 : !(e2 !== "object" || !t2.toString) && t2.toString();
  if (!n2) return 0;
  let s2, i2;
  const r2 = 3 & n2.length, a2 = n2.length - r2;
  let l2 = o;
  const h2 = 3432918353, c2 = 461845907;
  let u2 = 0;
  for (; u2 < a2; ) i2 = 255 & n2.charCodeAt(u2) | (255 & n2.charCodeAt(++u2)) << 8 | (255 & n2.charCodeAt(++u2)) << 16 | (255 & n2.charCodeAt(++u2)) << 24, ++u2, i2 = (65535 & i2) * h2 + (((i2 >>> 16) * h2 & 65535) << 16) & 4294967295, i2 = i2 << 15 | i2 >>> 17, i2 = (65535 & i2) * c2 + (((i2 >>> 16) * c2 & 65535) << 16) & 4294967295, l2 ^= i2, l2 = l2 << 13 | l2 >>> 19, s2 = 5 * (65535 & l2) + ((5 * (l2 >>> 16) & 65535) << 16) & 4294967295, l2 = 27492 + (65535 & s2) + ((58964 + (s2 >>> 16) & 65535) << 16);
  switch (i2 = 0, r2) {
    case 3:
      i2 ^= (255 & n2.charCodeAt(u2 + 2)) << 16;
    case 2:
      i2 ^= (255 & n2.charCodeAt(u2 + 1)) << 8;
    case 1:
      i2 ^= 255 & n2.charCodeAt(u2), i2 = (65535 & i2) * h2 + (((i2 >>> 16) * h2 & 65535) << 16) & 4294967295, i2 = i2 << 15 | i2 >>> 17, i2 = (65535 & i2) * c2 + (((i2 >>> 16) * c2 & 65535) << 16) & 4294967295, l2 ^= i2;
  }
  return l2 ^= n2.length, l2 ^= l2 >>> 16, l2 = 2246822507 * (65535 & l2) + ((2246822507 * (l2 >>> 16) & 65535) << 16) & 4294967295, l2 ^= l2 >>> 13, l2 = 3266489909 * (65535 & l2) + ((3266489909 * (l2 >>> 16) & 65535) << 16) & 4294967295, l2 ^= l2 >>> 16, l2 >>> 0;
}
class l {
  constructor() {
    this.count = 0, this.hash = 0;
  }
  update() {
    for (let t2 = 0; t2 < arguments.length; t2++) {
      const e2 = arguments[t2];
      if (e2 != null) if (Array.isArray(e2)) this.update.apply(this, e2);
      else {
        let t3 = 0;
        switch (typeof e2) {
          case "undefined":
          case "function":
            continue;
          case "number":
          case "boolean":
            t3 = e2;
            break;
          case "string":
            t3 = a(e2);
            break;
          default:
            e2.updateHashCode ? e2.updateHashCode(this) : console.log("No updateHashCode for " + e2.toString());
            continue;
        }
        t3 *= 3432918353, t3 = t3 << 15 | t3 >>> 17, t3 *= 461845907, this.count = this.count + 1;
        let n2 = this.hash ^ t3;
        n2 = n2 << 13 | n2 >>> 19, n2 = 5 * n2 + 3864292196, this.hash = n2;
      }
    }
  }
  finish() {
    let t2 = this.hash ^ 4 * this.count;
    return t2 ^= t2 >>> 16, t2 *= 2246822507, t2 ^= t2 >>> 13, t2 *= 3266489909, t2 ^= t2 >>> 16, t2;
  }
  static hashStuff() {
    const t2 = new l();
    return t2.update.apply(t2, arguments), t2.finish();
  }
}
function h(t2) {
  return t2 ? typeof t2 == "string" ? a(t2) : t2.hashCode() : -1;
}
function c(t2, e2) {
  return t2 && t2.equals ? t2.equals(e2) : t2 === e2;
}
function u(t2) {
  return t2 === null ? "null" : t2;
}
function d(t2) {
  return Array.isArray(t2) ? "[" + t2.map(u).join(", ") + "]" : "null";
}
class g {
  constructor(t2, e2) {
    this.buckets = new Array(16), this.threshold = Math.floor(12), this.itemCount = 0, this.hashFunction = t2 || h, this.equalsFunction = e2 || c;
  }
  get(t2) {
    if (t2 == null) return t2;
    const e2 = this._getBucket(t2);
    if (!e2) return null;
    for (const n2 of e2) if (this.equalsFunction(n2, t2)) return n2;
    return null;
  }
  add(t2) {
    return this.getOrAdd(t2) === t2;
  }
  getOrAdd(t2) {
    this._expand();
    const e2 = this._getSlot(t2);
    let n2 = this.buckets[e2];
    if (!n2) return n2 = [t2], this.buckets[e2] = n2, this.itemCount++, t2;
    for (const e3 of n2) if (this.equalsFunction(e3, t2)) return e3;
    return n2.push(t2), this.itemCount++, t2;
  }
  has(t2) {
    return this.get(t2) != null;
  }
  values() {
    return this.buckets.filter((t2) => t2 != null).flat(1);
  }
  toString() {
    return d(this.values());
  }
  get length() {
    return this.itemCount;
  }
  _getSlot(t2) {
    return this.hashFunction(t2) & this.buckets.length - 1;
  }
  _getBucket(t2) {
    return this.buckets[this._getSlot(t2)];
  }
  _expand() {
    if (this.itemCount <= this.threshold) return;
    const t2 = this.buckets, e2 = 2 * this.buckets.length;
    this.buckets = new Array(e2), this.threshold = Math.floor(0.75 * e2);
    for (const e3 of t2) if (e3) for (const t3 of e3) {
      const e4 = this._getSlot(t3);
      let n2 = this.buckets[e4];
      n2 || (n2 = [], this.buckets[e4] = n2), n2.push(t3);
    }
  }
}
class p {
  hashCode() {
    const t2 = new l();
    return this.updateHashCode(t2), t2.finish();
  }
  evaluate(t2, e2) {
  }
  evalPrecedence(t2, e2) {
    return this;
  }
  static andContext(t2, e2) {
    if (t2 === null || t2 === p.NONE) return e2;
    if (e2 === null || e2 === p.NONE) return t2;
    const n2 = new f(t2, e2);
    return n2.opnds.length === 1 ? n2.opnds[0] : n2;
  }
  static orContext(t2, e2) {
    if (t2 === null) return e2;
    if (e2 === null) return t2;
    if (t2 === p.NONE || e2 === p.NONE) return p.NONE;
    const n2 = new x(t2, e2);
    return n2.opnds.length === 1 ? n2.opnds[0] : n2;
  }
}
class f extends p {
  constructor(t2, e2) {
    super();
    const n2 = new g();
    t2 instanceof f ? t2.opnds.map(function(t3) {
      n2.add(t3);
    }) : n2.add(t2), e2 instanceof f ? e2.opnds.map(function(t3) {
      n2.add(t3);
    }) : n2.add(e2);
    const s2 = T(n2);
    if (s2.length > 0) {
      let t3 = null;
      s2.map(function(e3) {
        (t3 === null || e3.precedence < t3.precedence) && (t3 = e3);
      }), n2.add(t3);
    }
    this.opnds = Array.from(n2.values());
  }
  equals(t2) {
    return this === t2 || t2 instanceof f && r(this.opnds, t2.opnds);
  }
  updateHashCode(t2) {
    t2.update(this.opnds, "AND");
  }
  evaluate(t2, e2) {
    for (let n2 = 0; n2 < this.opnds.length; n2++) if (!this.opnds[n2].evaluate(t2, e2)) return !1;
    return !0;
  }
  evalPrecedence(t2, e2) {
    let n2 = !1;
    const s2 = [];
    for (let i3 = 0; i3 < this.opnds.length; i3++) {
      const r2 = this.opnds[i3], o2 = r2.evalPrecedence(t2, e2);
      if (n2 |= o2 !== r2, o2 === null) return null;
      o2 !== p.NONE && s2.push(o2);
    }
    if (!n2) return this;
    if (s2.length === 0) return p.NONE;
    let i2 = null;
    return s2.map(function(t3) {
      i2 = i2 === null ? t3 : p.andContext(i2, t3);
    }), i2;
  }
  toString() {
    const t2 = this.opnds.map((t3) => t3.toString());
    return (t2.length > 3 ? t2.slice(3) : t2).join("&&");
  }
}
class x extends p {
  constructor(t2, e2) {
    super();
    const n2 = new g();
    t2 instanceof x ? t2.opnds.map(function(t3) {
      n2.add(t3);
    }) : n2.add(t2), e2 instanceof x ? e2.opnds.map(function(t3) {
      n2.add(t3);
    }) : n2.add(e2);
    const s2 = T(n2);
    if (s2.length > 0) {
      const t3 = s2.sort(function(t4, e4) {
        return t4.compareTo(e4);
      }), e3 = t3[t3.length - 1];
      n2.add(e3);
    }
    this.opnds = Array.from(n2.values());
  }
  equals(t2) {
    return this === t2 || t2 instanceof x && r(this.opnds, t2.opnds);
  }
  updateHashCode(t2) {
    t2.update(this.opnds, "OR");
  }
  evaluate(t2, e2) {
    for (let n2 = 0; n2 < this.opnds.length; n2++) if (this.opnds[n2].evaluate(t2, e2)) return !0;
    return !1;
  }
  evalPrecedence(t2, e2) {
    let n2 = !1;
    const s2 = [];
    for (let i2 = 0; i2 < this.opnds.length; i2++) {
      const r2 = this.opnds[i2], o2 = r2.evalPrecedence(t2, e2);
      if (n2 |= o2 !== r2, o2 === p.NONE) return p.NONE;
      o2 !== null && s2.push(o2);
    }
    return n2 ? (s2.length === 0, null) : this;
  }
  toString() {
    const t2 = this.opnds.map((t3) => t3.toString());
    return (t2.length > 3 ? t2.slice(3) : t2).join("||");
  }
}
function T(t2) {
  const e2 = [];
  return t2.values().map(function(t3) {
    t3 instanceof p.PrecedencePredicate && e2.push(t3);
  }), e2;
}
function S(t2, e2) {
  if (t2 === null) {
    const t3 = { state: null, alt: null, context: null, semanticContext: null };
    return e2 && (t3.reachesIntoOuterContext = 0), t3;
  }
  {
    const n2 = {};
    return n2.state = t2.state || null, n2.alt = t2.alt === void 0 ? null : t2.alt, n2.context = t2.context || null, n2.semanticContext = t2.semanticContext || null, e2 && (n2.reachesIntoOuterContext = t2.reachesIntoOuterContext || 0, n2.precedenceFilterSuppressed = t2.precedenceFilterSuppressed || !1), n2;
  }
}
class m {
  constructor(t2, e2) {
    this.checkContext(t2, e2), t2 = S(t2), e2 = S(e2, !0), this.state = t2.state !== null ? t2.state : e2.state, this.alt = t2.alt !== null ? t2.alt : e2.alt, this.context = t2.context !== null ? t2.context : e2.context, this.semanticContext = t2.semanticContext !== null ? t2.semanticContext : e2.semanticContext !== null ? e2.semanticContext : p.NONE, this.reachesIntoOuterContext = e2.reachesIntoOuterContext, this.precedenceFilterSuppressed = e2.precedenceFilterSuppressed;
  }
  checkContext(t2, e2) {
    t2.context !== null && t2.context !== void 0 || e2 !== null && e2.context !== null && e2.context !== void 0 || (this.context = null);
  }
  hashCode() {
    const t2 = new l();
    return this.updateHashCode(t2), t2.finish();
  }
  updateHashCode(t2) {
    t2.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
  }
  equals(t2) {
    return this === t2 || t2 instanceof m && this.state.stateNumber === t2.state.stateNumber && this.alt === t2.alt && (this.context === null ? t2.context === null : this.context.equals(t2.context)) && this.semanticContext.equals(t2.semanticContext) && this.precedenceFilterSuppressed === t2.precedenceFilterSuppressed;
  }
  hashCodeForConfigSet() {
    const t2 = new l();
    return t2.update(this.state.stateNumber, this.alt, this.semanticContext), t2.finish();
  }
  equalsForConfigSet(t2) {
    return this === t2 || t2 instanceof m && this.state.stateNumber === t2.state.stateNumber && this.alt === t2.alt && this.semanticContext.equals(t2.semanticContext);
  }
  toString() {
    return "(" + this.state + "," + this.alt + (this.context !== null ? ",[" + this.context.toString() + "]" : "") + (this.semanticContext !== p.NONE ? "," + this.semanticContext.toString() : "") + (this.reachesIntoOuterContext > 0 ? ",up=" + this.reachesIntoOuterContext : "") + ")";
  }
}
class E {
  constructor(t2, e2) {
    this.start = t2, this.stop = e2;
  }
  clone() {
    return new E(this.start, this.stop);
  }
  contains(t2) {
    return t2 >= this.start && t2 < this.stop;
  }
  toString() {
    return this.start === this.stop - 1 ? this.start.toString() : this.start.toString() + ".." + (this.stop - 1).toString();
  }
  get length() {
    return this.stop - this.start;
  }
}
E.INVALID_INTERVAL = new E(-1, -2);
class _ {
  constructor() {
    this.intervals = null, this.readOnly = !1;
  }
  first(t2) {
    return this.intervals === null || this.intervals.length === 0 ? i.INVALID_TYPE : this.intervals[0].start;
  }
  addOne(t2) {
    this.addInterval(new E(t2, t2 + 1));
  }
  addRange(t2, e2) {
    this.addInterval(new E(t2, e2 + 1));
  }
  addInterval(t2) {
    if (this.intervals === null) this.intervals = [], this.intervals.push(t2.clone());
    else {
      for (let e2 = 0; e2 < this.intervals.length; e2++) {
        const n2 = this.intervals[e2];
        if (t2.stop < n2.start) return void this.intervals.splice(e2, 0, t2);
        if (t2.stop === n2.start) return void (this.intervals[e2] = new E(t2.start, n2.stop));
        if (t2.start <= n2.stop) return this.intervals[e2] = new E(Math.min(n2.start, t2.start), Math.max(n2.stop, t2.stop)), void this.reduce(e2);
      }
      this.intervals.push(t2.clone());
    }
  }
  addSet(t2) {
    return t2.intervals !== null && t2.intervals.forEach((t3) => this.addInterval(t3), this), this;
  }
  reduce(t2) {
    if (t2 < this.intervals.length - 1) {
      const e2 = this.intervals[t2], n2 = this.intervals[t2 + 1];
      e2.stop >= n2.stop ? (this.intervals.splice(t2 + 1, 1), this.reduce(t2)) : e2.stop >= n2.start && (this.intervals[t2] = new E(e2.start, n2.stop), this.intervals.splice(t2 + 1, 1));
    }
  }
  complement(t2, e2) {
    const n2 = new _();
    return n2.addInterval(new E(t2, e2 + 1)), this.intervals !== null && this.intervals.forEach((t3) => n2.removeRange(t3)), n2;
  }
  contains(t2) {
    if (this.intervals === null) return !1;
    for (let e2 = 0; e2 < this.intervals.length; e2++) if (this.intervals[e2].contains(t2)) return !0;
    return !1;
  }
  removeRange(t2) {
    if (t2.start === t2.stop - 1) this.removeOne(t2.start);
    else if (this.intervals !== null) {
      let e2 = 0;
      for (let n2 = 0; n2 < this.intervals.length; n2++) {
        const n3 = this.intervals[e2];
        if (t2.stop <= n3.start) return;
        if (t2.start > n3.start && t2.stop < n3.stop) {
          this.intervals[e2] = new E(n3.start, t2.start);
          const s2 = new E(t2.stop, n3.stop);
          return void this.intervals.splice(e2, 0, s2);
        }
        t2.start <= n3.start && t2.stop >= n3.stop ? (this.intervals.splice(e2, 1), e2 -= 1) : t2.start < n3.stop ? this.intervals[e2] = new E(n3.start, t2.start) : t2.stop < n3.stop && (this.intervals[e2] = new E(t2.stop, n3.stop)), e2 += 1;
      }
    }
  }
  removeOne(t2) {
    if (this.intervals !== null) for (let e2 = 0; e2 < this.intervals.length; e2++) {
      const n2 = this.intervals[e2];
      if (t2 < n2.start) return;
      if (t2 === n2.start && t2 === n2.stop - 1) return void this.intervals.splice(e2, 1);
      if (t2 === n2.start) return void (this.intervals[e2] = new E(n2.start + 1, n2.stop));
      if (t2 === n2.stop - 1) return void (this.intervals[e2] = new E(n2.start, n2.stop - 1));
      if (t2 < n2.stop - 1) {
        const s2 = new E(n2.start, t2);
        return n2.start = t2 + 1, void this.intervals.splice(e2, 0, s2);
      }
    }
  }
  toString(t2, e2, n2) {
    return t2 = t2 || null, e2 = e2 || null, n2 = n2 || !1, this.intervals === null ? "{}" : t2 !== null || e2 !== null ? this.toTokenString(t2, e2) : n2 ? this.toCharString() : this.toIndexString();
  }
  toCharString() {
    const t2 = [];
    for (let e2 = 0; e2 < this.intervals.length; e2++) {
      const n2 = this.intervals[e2];
      n2.stop === n2.start + 1 ? n2.start === i.EOF ? t2.push("<EOF>") : t2.push("'" + String.fromCharCode(n2.start) + "'") : t2.push("'" + String.fromCharCode(n2.start) + "'..'" + String.fromCharCode(n2.stop - 1) + "'");
    }
    return t2.length > 1 ? "{" + t2.join(", ") + "}" : t2[0];
  }
  toIndexString() {
    const t2 = [];
    for (let e2 = 0; e2 < this.intervals.length; e2++) {
      const n2 = this.intervals[e2];
      n2.stop === n2.start + 1 ? n2.start === i.EOF ? t2.push("<EOF>") : t2.push(n2.start.toString()) : t2.push(n2.start.toString() + ".." + (n2.stop - 1).toString());
    }
    return t2.length > 1 ? "{" + t2.join(", ") + "}" : t2[0];
  }
  toTokenString(t2, e2) {
    const n2 = [];
    for (let s2 = 0; s2 < this.intervals.length; s2++) {
      const i2 = this.intervals[s2];
      for (let s3 = i2.start; s3 < i2.stop; s3++) n2.push(this.elementName(t2, e2, s3));
    }
    return n2.length > 1 ? "{" + n2.join(", ") + "}" : n2[0];
  }
  elementName(t2, e2, n2) {
    return n2 === i.EOF ? "<EOF>" : n2 === i.EPSILON ? "<EPSILON>" : t2[n2] || e2[n2];
  }
  get length() {
    return this.intervals.map((t2) => t2.length).reduce((t2, e2) => t2 + e2);
  }
}
class C {
  constructor() {
    this.atn = null, this.stateNumber = C.INVALID_STATE_NUMBER, this.stateType = null, this.ruleIndex = 0, this.epsilonOnlyTransitions = !1, this.transitions = [], this.nextTokenWithinRule = null;
  }
  toString() {
    return this.stateNumber;
  }
  equals(t2) {
    return t2 instanceof C && this.stateNumber === t2.stateNumber;
  }
  isNonGreedyExitState() {
    return !1;
  }
  addTransition(t2, e2) {
    e2 === void 0 && (e2 = -1), this.transitions.length === 0 ? this.epsilonOnlyTransitions = t2.isEpsilon : this.epsilonOnlyTransitions !== t2.isEpsilon && (this.epsilonOnlyTransitions = !1), e2 === -1 ? this.transitions.push(t2) : this.transitions.splice(e2, 1, t2);
  }
}
C.INVALID_TYPE = 0, C.BASIC = 1, C.RULE_START = 2, C.BLOCK_START = 3, C.PLUS_BLOCK_START = 4, C.STAR_BLOCK_START = 5, C.TOKEN_START = 6, C.RULE_STOP = 7, C.BLOCK_END = 8, C.STAR_LOOP_BACK = 9, C.STAR_LOOP_ENTRY = 10, C.PLUS_LOOP_BACK = 11, C.LOOP_END = 12, C.serializationNames = ["INVALID", "BASIC", "RULE_START", "BLOCK_START", "PLUS_BLOCK_START", "STAR_BLOCK_START", "TOKEN_START", "RULE_STOP", "BLOCK_END", "STAR_LOOP_BACK", "STAR_LOOP_ENTRY", "PLUS_LOOP_BACK", "LOOP_END"], C.INVALID_STATE_NUMBER = -1;
class A extends C {
  constructor() {
    return super(), this.stateType = C.RULE_STOP, this;
  }
}
class N {
  constructor(t2) {
    if (t2 == null) throw "target cannot be null.";
    this.target = t2, this.isEpsilon = !1, this.label = null;
  }
}
N.EPSILON = 1, N.RANGE = 2, N.RULE = 3, N.PREDICATE = 4, N.ATOM = 5, N.ACTION = 6, N.SET = 7, N.NOT_SET = 8, N.WILDCARD = 9, N.PRECEDENCE = 10, N.serializationNames = ["INVALID", "EPSILON", "RANGE", "RULE", "PREDICATE", "ATOM", "ACTION", "SET", "NOT_SET", "WILDCARD", "PRECEDENCE"], N.serializationTypes = { EpsilonTransition: N.EPSILON, RangeTransition: N.RANGE, RuleTransition: N.RULE, PredicateTransition: N.PREDICATE, AtomTransition: N.ATOM, ActionTransition: N.ACTION, SetTransition: N.SET, NotSetTransition: N.NOT_SET, WildcardTransition: N.WILDCARD, PrecedencePredicateTransition: N.PRECEDENCE };
class k extends N {
  constructor(t2, e2, n2, s2) {
    super(t2), this.ruleIndex = e2, this.precedence = n2, this.followState = s2, this.serializationType = N.RULE, this.isEpsilon = !0;
  }
  matches(t2, e2, n2) {
    return !1;
  }
}
class I extends N {
  constructor(t2, e2) {
    super(t2), this.serializationType = N.SET, e2 != null ? this.label = e2 : (this.label = new _(), this.label.addOne(i.INVALID_TYPE));
  }
  matches(t2, e2, n2) {
    return this.label.contains(t2);
  }
  toString() {
    return this.label.toString();
  }
}
class y extends I {
  constructor(t2, e2) {
    super(t2, e2), this.serializationType = N.NOT_SET;
  }
  matches(t2, e2, n2) {
    return t2 >= e2 && t2 <= n2 && !super.matches(t2, e2, n2);
  }
  toString() {
    return "~" + super.toString();
  }
}
class L extends N {
  constructor(t2) {
    super(t2), this.serializationType = N.WILDCARD;
  }
  matches(t2, e2, n2) {
    return t2 >= e2 && t2 <= n2;
  }
  toString() {
    return ".";
  }
}
class O extends N {
  constructor(t2) {
    super(t2);
  }
}
class R {
}
class w extends R {
}
class v extends w {
}
class P extends v {
  get ruleContext() {
    throw new Error("missing interface implementation");
  }
}
class b extends v {
}
class D extends b {
}
const F = { toStringTree: function(t2, e2, n2) {
  e2 = e2 || null, (n2 = n2 || null) !== null && (e2 = n2.ruleNames);
  let s2 = F.getNodeText(t2, e2);
  s2 = function(t3) {
    return t3 = t3.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  }(s2);
  const i2 = t2.getChildCount();
  if (i2 === 0) return s2;
  let r2 = "(" + s2 + " ";
  i2 > 0 && (s2 = F.toStringTree(t2.getChild(0), e2), r2 = r2.concat(s2));
  for (let n3 = 1; n3 < i2; n3++) s2 = F.toStringTree(t2.getChild(n3), e2), r2 = r2.concat(" " + s2);
  return r2 = r2.concat(")"), r2;
}, getNodeText: function(t2, e2, n2) {
  if (e2 = e2 || null, (n2 = n2 || null) !== null && (e2 = n2.ruleNames), e2 !== null) {
    if (t2 instanceof P) {
      const n3 = t2.ruleContext.getAltNumber();
      return n3 != 0 ? e2[t2.ruleIndex] + ":" + n3 : e2[t2.ruleIndex];
    }
    if (t2 instanceof D) return t2.toString();
    if (t2 instanceof b && t2.symbol !== null) return t2.symbol.text;
  }
  const s2 = t2.getPayload();
  return s2 instanceof i ? s2.text : t2.getPayload().toString();
}, getChildren: function(t2) {
  const e2 = [];
  for (let n2 = 0; n2 < t2.getChildCount(); n2++) e2.push(t2.getChild(n2));
  return e2;
}, getAncestors: function(t2) {
  let e2 = [];
  for (t2 = t2.getParent(); t2 !== null; ) e2 = [t2].concat(e2), t2 = t2.getParent();
  return e2;
}, findAllTokenNodes: function(t2, e2) {
  return F.findAllNodes(t2, e2, !0);
}, findAllRuleNodes: function(t2, e2) {
  return F.findAllNodes(t2, e2, !1);
}, findAllNodes: function(t2, e2, n2) {
  const s2 = [];
  return F._findAllNodes(t2, e2, n2, s2), s2;
}, _findAllNodes: function(t2, e2, n2, s2) {
  n2 && t2 instanceof b ? t2.symbol.type === e2 && s2.push(t2) : !n2 && t2 instanceof P && t2.ruleIndex === e2 && s2.push(t2);
  for (let i2 = 0; i2 < t2.getChildCount(); i2++) F._findAllNodes(t2.getChild(i2), e2, n2, s2);
}, descendants: function(t2) {
  let e2 = [t2];
  for (let n2 = 0; n2 < t2.getChildCount(); n2++) e2 = e2.concat(F.descendants(t2.getChild(n2)));
  return e2;
} }, M = F;
class U extends P {
  constructor(t2, e2) {
    super(), this.parentCtx = t2 || null, this.invokingState = e2 || -1;
  }
  depth() {
    let t2 = 0, e2 = this;
    for (; e2 !== null; ) e2 = e2.parentCtx, t2 += 1;
    return t2;
  }
  isEmpty() {
    return this.invokingState === -1;
  }
  getSourceInterval() {
    return E.INVALID_INTERVAL;
  }
  get ruleContext() {
    return this;
  }
  getPayload() {
    return this;
  }
  getText() {
    return this.getChildCount() === 0 ? "" : this.children.map(function(t2) {
      return t2.getText();
    }).join("");
  }
  getAltNumber() {
    return 0;
  }
  setAltNumber(t2) {
  }
  getChild(t2) {
    return null;
  }
  getChildCount() {
    return 0;
  }
  accept(t2) {
    return t2.visitChildren(this);
  }
  toStringTree(t2, e2) {
    return M.toStringTree(this, t2, e2);
  }
  toString(t2, e2) {
    t2 = t2 || null, e2 = e2 || null;
    let n2 = this, s2 = "[";
    for (; n2 !== null && n2 !== e2; ) {
      if (t2 === null) n2.isEmpty() || (s2 += n2.invokingState);
      else {
        const e3 = n2.ruleIndex;
        s2 += e3 >= 0 && e3 < t2.length ? t2[e3] : "" + e3;
      }
      n2.parentCtx === null || t2 === null && n2.parentCtx.isEmpty() || (s2 += " "), n2 = n2.parentCtx;
    }
    return s2 += "]", s2;
  }
}
class B {
  constructor(t2) {
    this.cachedHashCode = t2;
  }
  isEmpty() {
    return this === B.EMPTY;
  }
  hasEmptyPath() {
    return this.getReturnState(this.length - 1) === B.EMPTY_RETURN_STATE;
  }
  hashCode() {
    return this.cachedHashCode;
  }
  updateHashCode(t2) {
    t2.update(this.cachedHashCode);
  }
}
B.EMPTY = null, B.EMPTY_RETURN_STATE = 2147483647, B.globalNodeCount = 1, B.id = B.globalNodeCount, B.trace_atn_sim = !1;
class z extends B {
  constructor(t2, e2) {
    const n2 = new l();
    return n2.update(t2, e2), super(n2.finish()), this.parents = t2, this.returnStates = e2, this;
  }
  isEmpty() {
    return this.returnStates[0] === B.EMPTY_RETURN_STATE;
  }
  getParent(t2) {
    return this.parents[t2];
  }
  getReturnState(t2) {
    return this.returnStates[t2];
  }
  equals(t2) {
    return this === t2 || t2 instanceof z && this.hashCode() === t2.hashCode() && r(this.returnStates, t2.returnStates) && r(this.parents, t2.parents);
  }
  toString() {
    if (this.isEmpty()) return "[]";
    {
      let t2 = "[";
      for (let e2 = 0; e2 < this.returnStates.length; e2++) e2 > 0 && (t2 += ", "), this.returnStates[e2] !== B.EMPTY_RETURN_STATE ? (t2 += this.returnStates[e2], this.parents[e2] !== null ? t2 = t2 + " " + this.parents[e2] : t2 += "null") : t2 += "$";
      return t2 + "]";
    }
  }
  get length() {
    return this.returnStates.length;
  }
}
class V extends B {
  constructor(t2, e2) {
    let n2 = 0;
    const s2 = new l();
    t2 !== null ? s2.update(t2, e2) : s2.update(1), n2 = s2.finish(), super(n2), this.parentCtx = t2, this.returnState = e2;
  }
  getParent(t2) {
    return this.parentCtx;
  }
  getReturnState(t2) {
    return this.returnState;
  }
  equals(t2) {
    return this === t2 || t2 instanceof V && this.hashCode() === t2.hashCode() && this.returnState === t2.returnState && (this.parentCtx == null ? t2.parentCtx == null : this.parentCtx.equals(t2.parentCtx));
  }
  toString() {
    const t2 = this.parentCtx === null ? "" : this.parentCtx.toString();
    return t2.length === 0 ? this.returnState === B.EMPTY_RETURN_STATE ? "$" : "" + this.returnState : this.returnState + " " + t2;
  }
  get length() {
    return 1;
  }
  static create(t2, e2) {
    return e2 === B.EMPTY_RETURN_STATE && t2 === null ? B.EMPTY : new V(t2, e2);
  }
}
class q extends V {
  constructor() {
    super(null, B.EMPTY_RETURN_STATE);
  }
  isEmpty() {
    return !0;
  }
  getParent(t2) {
    return null;
  }
  getReturnState(t2) {
    return this.returnState;
  }
  equals(t2) {
    return this === t2;
  }
  toString() {
    return "$";
  }
}
B.EMPTY = new q();
class H {
  constructor(t2, e2) {
    this.buckets = new Array(16), this.threshold = Math.floor(12), this.itemCount = 0, this.hashFunction = t2 || h, this.equalsFunction = e2 || c;
  }
  set(t2, e2) {
    this._expand();
    const n2 = this._getSlot(t2);
    let s2 = this.buckets[n2];
    if (!s2) return s2 = [[t2, e2]], this.buckets[n2] = s2, this.itemCount++, e2;
    const i2 = s2.find((e3) => this.equalsFunction(e3[0], t2), this);
    if (i2) {
      const t3 = i2[1];
      return i2[1] = e2, t3;
    }
    return s2.push([t2, e2]), this.itemCount++, e2;
  }
  containsKey(t2) {
    const e2 = this._getBucket(t2);
    return !!e2 && !!e2.find((e3) => this.equalsFunction(e3[0], t2), this);
  }
  get(t2) {
    const e2 = this._getBucket(t2);
    if (!e2) return null;
    const n2 = e2.find((e3) => this.equalsFunction(e3[0], t2), this);
    return n2 ? n2[1] : null;
  }
  entries() {
    return this.buckets.filter((t2) => t2 != null).flat(1);
  }
  getKeys() {
    return this.entries().map((t2) => t2[0]);
  }
  getValues() {
    return this.entries().map((t2) => t2[1]);
  }
  toString() {
    return "[" + this.entries().map((t2) => "{" + t2[0] + ":" + t2[1] + "}").join(", ") + "]";
  }
  get length() {
    return this.itemCount;
  }
  _getSlot(t2) {
    return this.hashFunction(t2) & this.buckets.length - 1;
  }
  _getBucket(t2) {
    return this.buckets[this._getSlot(t2)];
  }
  _expand() {
    if (this.itemCount <= this.threshold) return;
    const t2 = this.buckets, e2 = 2 * this.buckets.length;
    this.buckets = new Array(e2), this.threshold = Math.floor(0.75 * e2);
    for (const e3 of t2) if (e3) for (const t3 of e3) {
      const e4 = this._getSlot(t3[0]);
      let n2 = this.buckets[e4];
      n2 || (n2 = [], this.buckets[e4] = n2), n2.push(t3);
    }
  }
}
function K(t2, e2) {
  if (e2 == null && (e2 = U.EMPTY), e2.parentCtx === null || e2 === U.EMPTY) return B.EMPTY;
  const n2 = K(t2, e2.parentCtx), s2 = t2.states[e2.invokingState].transitions[0];
  return V.create(n2, s2.followState.stateNumber);
}
function Y(t2, e2, n2) {
  if (t2.isEmpty()) return t2;
  let s2 = n2.get(t2) || null;
  if (s2 !== null) return s2;
  if (s2 = e2.get(t2), s2 !== null) return n2.set(t2, s2), s2;
  let i2 = !1, r2 = [];
  for (let s3 = 0; s3 < r2.length; s3++) {
    const o3 = Y(t2.getParent(s3), e2, n2);
    if (i2 || o3 !== t2.getParent(s3)) {
      if (!i2) {
        r2 = [];
        for (let e3 = 0; e3 < t2.length; e3++) r2[e3] = t2.getParent(e3);
        i2 = !0;
      }
      r2[s3] = o3;
    }
  }
  if (!i2) return e2.add(t2), n2.set(t2, t2), t2;
  let o2 = null;
  return o2 = r2.length === 0 ? B.EMPTY : r2.length === 1 ? V.create(r2[0], t2.getReturnState(0)) : new z(r2, t2.returnStates), e2.add(o2), n2.set(o2, o2), n2.set(t2, o2), o2;
}
function G(t2, e2, n2, s2) {
  if (t2 === e2) return t2;
  if (t2 instanceof V && e2 instanceof V) return function(t3, e3, n3, s3) {
    if (s3 !== null) {
      let n4 = s3.get(t3, e3);
      if (n4 !== null || (n4 = s3.get(e3, t3), n4 !== null)) return n4;
    }
    const i2 = function(t4, e4, n4) {
      if (n4) {
        if (t4 === B.EMPTY || e4 === B.EMPTY) return B.EMPTY;
      } else {
        if (t4 === B.EMPTY && e4 === B.EMPTY) return B.EMPTY;
        if (t4 === B.EMPTY) {
          const t5 = [e4.returnState, B.EMPTY_RETURN_STATE], n5 = [e4.parentCtx, null];
          return new z(n5, t5);
        }
        if (e4 === B.EMPTY) {
          const e5 = [t4.returnState, B.EMPTY_RETURN_STATE], n5 = [t4.parentCtx, null];
          return new z(n5, e5);
        }
      }
      return null;
    }(t3, e3, n3);
    if (i2 !== null) return s3 !== null && s3.set(t3, e3, i2), i2;
    if (t3.returnState === e3.returnState) {
      const i3 = G(t3.parentCtx, e3.parentCtx, n3, s3);
      if (i3 === t3.parentCtx) return t3;
      if (i3 === e3.parentCtx) return e3;
      const r2 = V.create(i3, t3.returnState);
      return s3 !== null && s3.set(t3, e3, r2), r2;
    }
    {
      let n4 = null;
      if ((t3 === e3 || t3.parentCtx !== null && t3.parentCtx === e3.parentCtx) && (n4 = t3.parentCtx), n4 !== null) {
        const i4 = [t3.returnState, e3.returnState];
        t3.returnState > e3.returnState && (i4[0] = e3.returnState, i4[1] = t3.returnState);
        const r3 = new z([n4, n4], i4);
        return s3 !== null && s3.set(t3, e3, r3), r3;
      }
      const i3 = [t3.returnState, e3.returnState];
      let r2 = [t3.parentCtx, e3.parentCtx];
      t3.returnState > e3.returnState && (i3[0] = e3.returnState, i3[1] = t3.returnState, r2 = [e3.parentCtx, t3.parentCtx]);
      const o2 = new z(r2, i3);
      return s3 !== null && s3.set(t3, e3, o2), o2;
    }
  }(t2, e2, n2, s2);
  if (n2) {
    if (t2 instanceof q) return t2;
    if (e2 instanceof q) return e2;
  }
  return t2 instanceof V && (t2 = new z([t2.getParent()], [t2.returnState])), e2 instanceof V && (e2 = new z([e2.getParent()], [e2.returnState])), function(t3, e3, n3, s3) {
    if (s3 !== null) {
      let n4 = s3.get(t3, e3);
      if (n4 !== null || (n4 = s3.get(e3, t3), n4 !== null)) return B.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> previous"), n4;
    }
    let i2 = 0, r2 = 0, o2 = 0, a2 = new Array(t3.returnStates.length + e3.returnStates.length).fill(0), l2 = new Array(t3.returnStates.length + e3.returnStates.length).fill(null);
    for (; i2 < t3.returnStates.length && r2 < e3.returnStates.length; ) {
      const h3 = t3.parents[i2], c2 = e3.parents[r2];
      if (t3.returnStates[i2] === e3.returnStates[r2]) {
        const e4 = t3.returnStates[i2];
        e4 === B.EMPTY_RETURN_STATE && h3 === null && c2 === null || h3 !== null && c2 !== null && h3 === c2 ? (l2[o2] = h3, a2[o2] = e4) : (l2[o2] = G(h3, c2, n3, s3), a2[o2] = e4), i2 += 1, r2 += 1;
      } else t3.returnStates[i2] < e3.returnStates[r2] ? (l2[o2] = h3, a2[o2] = t3.returnStates[i2], i2 += 1) : (l2[o2] = c2, a2[o2] = e3.returnStates[r2], r2 += 1);
      o2 += 1;
    }
    if (i2 < t3.returnStates.length) for (let e4 = i2; e4 < t3.returnStates.length; e4++) l2[o2] = t3.parents[e4], a2[o2] = t3.returnStates[e4], o2 += 1;
    else for (let t4 = r2; t4 < e3.returnStates.length; t4++) l2[o2] = e3.parents[t4], a2[o2] = e3.returnStates[t4], o2 += 1;
    if (o2 < l2.length) {
      if (o2 === 1) {
        const n4 = V.create(l2[0], a2[0]);
        return s3 !== null && s3.set(t3, e3, n4), n4;
      }
      l2 = l2.slice(0, o2), a2 = a2.slice(0, o2);
    }
    const h2 = new z(l2, a2);
    return h2.equals(t3) ? (s3 !== null && s3.set(t3, e3, t3), B.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> a"), t3) : h2.equals(e3) ? (s3 !== null && s3.set(t3, e3, e3), B.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> b"), e3) : (function(t4) {
      const e4 = new H();
      for (let n4 = 0; n4 < t4.length; n4++) {
        const s4 = t4[n4];
        e4.containsKey(s4) || e4.set(s4, s4);
      }
      for (let n4 = 0; n4 < t4.length; n4++) t4[n4] = e4.get(t4[n4]);
    }(l2), s3 !== null && s3.set(t3, e3, h2), B.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> " + h2), h2);
  }(t2, e2, n2, s2);
}
class W {
  constructor() {
    this.data = new Uint32Array(1);
  }
  set(t2) {
    W._checkIndex(t2), this._resize(t2), this.data[t2 >>> 5] |= 1 << t2 % 32;
  }
  get(t2) {
    W._checkIndex(t2);
    const e2 = t2 >>> 5;
    return !(e2 >= this.data.length || !(this.data[e2] & 1 << t2 % 32));
  }
  clear(t2) {
    W._checkIndex(t2);
    const e2 = t2 >>> 5;
    e2 < this.data.length && (this.data[e2] &= ~(1 << t2));
  }
  or(t2) {
    const e2 = Math.min(this.data.length, t2.data.length);
    for (let n2 = 0; n2 < e2; ++n2) this.data[n2] |= t2.data[n2];
    if (this.data.length < t2.data.length) {
      this._resize((t2.data.length << 5) - 1);
      const n2 = t2.data.length;
      for (let s2 = e2; s2 < n2; ++s2) this.data[s2] = t2.data[s2];
    }
  }
  values() {
    const t2 = new Array(this.length);
    let e2 = 0;
    const n2 = this.data.length;
    for (let s2 = 0; s2 < n2; ++s2) {
      let n3 = this.data[s2];
      for (; n3 !== 0; ) {
        const i2 = n3 & -n3;
        t2[e2++] = (s2 << 5) + W._bitCount(i2 - 1), n3 ^= i2;
      }
    }
    return t2;
  }
  minValue() {
    for (let t2 = 0; t2 < this.data.length; ++t2) {
      let e2 = this.data[t2];
      if (e2 !== 0) {
        let n2 = 0;
        for (; !(1 & e2); ) n2++, e2 >>= 1;
        return n2 + 32 * t2;
      }
    }
    return 0;
  }
  hashCode() {
    return l.hashStuff(this.values());
  }
  equals(t2) {
    return t2 instanceof W && r(this.data, t2.data);
  }
  toString() {
    return "{" + this.values().join(", ") + "}";
  }
  get length() {
    return this.data.map((t2) => W._bitCount(t2)).reduce((t2, e2) => t2 + e2, 0);
  }
  _resize(t2) {
    const e2 = t2 + 32 >>> 5;
    if (e2 <= this.data.length) return;
    const n2 = new Uint32Array(e2);
    n2.set(this.data), n2.fill(0, this.data.length), this.data = n2;
  }
  static _checkIndex(t2) {
    if (t2 < 0) throw new RangeError("index cannot be negative");
  }
  static _bitCount(t2) {
    return t2 = (t2 = (858993459 & (t2 -= t2 >> 1 & 1431655765)) + (t2 >> 2 & 858993459)) + (t2 >> 4) & 252645135, t2 += t2 >> 8, 0 + (t2 += t2 >> 16) & 63;
  }
}
class j {
  constructor(t2) {
    this.atn = t2;
  }
  getDecisionLookahead(t2) {
    if (t2 === null) return null;
    const e2 = t2.transitions.length, n2 = [];
    for (let s2 = 0; s2 < e2; s2++) {
      n2[s2] = new _();
      const e3 = new g();
      this._LOOK(t2.transition(s2).target, null, B.EMPTY, n2[s2], e3, new W(), !1, !1), (n2[s2].length === 0 || n2[s2].contains(j.HIT_PRED)) && (n2[s2] = null);
    }
    return n2;
  }
  LOOK(t2, e2, n2) {
    const s2 = new _(), i2 = (n2 = n2 || null) !== null ? K(t2.atn, n2) : null;
    return this._LOOK(t2, e2, i2, s2, new g(), new W(), !0, !0), s2;
  }
  _LOOK(t2, e2, n2, s2, r2, o2, a2, l2) {
    const h2 = new m({ state: t2, alt: 0, context: n2 }, null);
    if (!r2.has(h2)) {
      if (r2.add(h2), t2 === e2) {
        if (n2 === null) return void s2.addOne(i.EPSILON);
        if (n2.isEmpty() && l2) return void s2.addOne(i.EOF);
      }
      if (t2 instanceof A) {
        if (n2 === null) return void s2.addOne(i.EPSILON);
        if (n2.isEmpty() && l2) return void s2.addOne(i.EOF);
        if (n2 !== B.EMPTY) {
          const i2 = o2.get(t2.ruleIndex);
          try {
            o2.clear(t2.ruleIndex);
            for (let t3 = 0; t3 < n2.length; t3++) {
              const i3 = this.atn.states[n2.getReturnState(t3)];
              this._LOOK(i3, e2, n2.getParent(t3), s2, r2, o2, a2, l2);
            }
          } finally {
            i2 && o2.set(t2.ruleIndex);
          }
          return;
        }
      }
      for (let h3 = 0; h3 < t2.transitions.length; h3++) {
        const c2 = t2.transitions[h3];
        if (c2.constructor === k) {
          if (o2.get(c2.target.ruleIndex)) continue;
          const t3 = V.create(n2, c2.followState.stateNumber);
          try {
            o2.set(c2.target.ruleIndex), this._LOOK(c2.target, e2, t3, s2, r2, o2, a2, l2);
          } finally {
            o2.clear(c2.target.ruleIndex);
          }
        } else if (c2 instanceof O) a2 ? this._LOOK(c2.target, e2, n2, s2, r2, o2, a2, l2) : s2.addOne(j.HIT_PRED);
        else if (c2.isEpsilon) this._LOOK(c2.target, e2, n2, s2, r2, o2, a2, l2);
        else if (c2.constructor === L) s2.addRange(i.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
        else {
          let t3 = c2.label;
          t3 !== null && (c2 instanceof y && (t3 = t3.complement(i.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType)), s2.addSet(t3));
        }
      }
    }
  }
}
j.HIT_PRED = i.INVALID_TYPE;
class $ {
  constructor(t2, e2) {
    this.grammarType = t2, this.maxTokenType = e2, this.states = [], this.decisionToState = [], this.ruleToStartState = [], this.ruleToStopState = null, this.modeNameToStartState = {}, this.ruleToTokenType = null, this.lexerActions = null, this.modeToStartState = [];
  }
  nextTokensInContext(t2, e2) {
    return new j(this).LOOK(t2, null, e2);
  }
  nextTokensNoContext(t2) {
    return t2.nextTokenWithinRule !== null || (t2.nextTokenWithinRule = this.nextTokensInContext(t2, null), t2.nextTokenWithinRule.readOnly = !0), t2.nextTokenWithinRule;
  }
  nextTokens(t2, e2) {
    return e2 === void 0 ? this.nextTokensNoContext(t2) : this.nextTokensInContext(t2, e2);
  }
  addState(t2) {
    t2 !== null && (t2.atn = this, t2.stateNumber = this.states.length), this.states.push(t2);
  }
  removeState(t2) {
    this.states[t2.stateNumber] = null;
  }
  defineDecisionState(t2) {
    return this.decisionToState.push(t2), t2.decision = this.decisionToState.length - 1, t2.decision;
  }
  getDecisionState(t2) {
    return this.decisionToState.length === 0 ? null : this.decisionToState[t2];
  }
  getExpectedTokens(t2, e2) {
    if (t2 < 0 || t2 >= this.states.length) throw "Invalid state number.";
    const n2 = this.states[t2];
    let s2 = this.nextTokens(n2);
    if (!s2.contains(i.EPSILON)) return s2;
    const r2 = new _();
    for (r2.addSet(s2), r2.removeOne(i.EPSILON); e2 !== null && e2.invokingState >= 0 && s2.contains(i.EPSILON); ) {
      const t3 = this.states[e2.invokingState].transitions[0];
      s2 = this.nextTokens(t3.followState), r2.addSet(s2), r2.removeOne(i.EPSILON), e2 = e2.parentCtx;
    }
    return s2.contains(i.EPSILON) && r2.addOne(i.EOF), r2;
  }
}
$.INVALID_ALT_NUMBER = 0;
class X extends C {
  constructor() {
    super(), this.stateType = C.BASIC;
  }
}
class J extends C {
  constructor() {
    return super(), this.decision = -1, this.nonGreedy = !1, this;
  }
}
class Z extends J {
  constructor() {
    return super(), this.endState = null, this;
  }
}
class Q extends C {
  constructor() {
    return super(), this.stateType = C.BLOCK_END, this.startState = null, this;
  }
}
class tt extends C {
  constructor() {
    return super(), this.stateType = C.LOOP_END, this.loopBackState = null, this;
  }
}
class et extends C {
  constructor() {
    return super(), this.stateType = C.RULE_START, this.stopState = null, this.isPrecedenceRule = !1, this;
  }
}
class nt extends J {
  constructor() {
    return super(), this.stateType = C.TOKEN_START, this;
  }
}
class st extends J {
  constructor() {
    return super(), this.stateType = C.PLUS_LOOP_BACK, this;
  }
}
class it extends C {
  constructor() {
    return super(), this.stateType = C.STAR_LOOP_BACK, this;
  }
}
class rt extends J {
  constructor() {
    return super(), this.stateType = C.STAR_LOOP_ENTRY, this.loopBackState = null, this.isPrecedenceDecision = null, this;
  }
}
class ot extends Z {
  constructor() {
    return super(), this.stateType = C.PLUS_BLOCK_START, this.loopBackState = null, this;
  }
}
class at extends Z {
  constructor() {
    return super(), this.stateType = C.STAR_BLOCK_START, this;
  }
}
class lt extends Z {
  constructor() {
    return super(), this.stateType = C.BLOCK_START, this;
  }
}
class ht extends N {
  constructor(t2, e2) {
    super(t2), this.label_ = e2, this.label = this.makeLabel(), this.serializationType = N.ATOM;
  }
  makeLabel() {
    const t2 = new _();
    return t2.addOne(this.label_), t2;
  }
  matches(t2, e2, n2) {
    return this.label_ === t2;
  }
  toString() {
    return this.label_;
  }
}
class ct extends N {
  constructor(t2, e2, n2) {
    super(t2), this.serializationType = N.RANGE, this.start = e2, this.stop = n2, this.label = this.makeLabel();
  }
  makeLabel() {
    const t2 = new _();
    return t2.addRange(this.start, this.stop), t2;
  }
  matches(t2, e2, n2) {
    return t2 >= this.start && t2 <= this.stop;
  }
  toString() {
    return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
  }
}
class ut extends N {
  constructor(t2, e2, n2, s2) {
    super(t2), this.serializationType = N.ACTION, this.ruleIndex = e2, this.actionIndex = n2 === void 0 ? -1 : n2, this.isCtxDependent = s2 !== void 0 && s2, this.isEpsilon = !0;
  }
  matches(t2, e2, n2) {
    return !1;
  }
  toString() {
    return "action_" + this.ruleIndex + ":" + this.actionIndex;
  }
}
class dt extends N {
  constructor(t2, e2) {
    super(t2), this.serializationType = N.EPSILON, this.isEpsilon = !0, this.outermostPrecedenceReturn = e2;
  }
  matches(t2, e2, n2) {
    return !1;
  }
  toString() {
    return "epsilon";
  }
}
class gt extends p {
  constructor(t2, e2, n2) {
    super(), this.ruleIndex = t2 === void 0 ? -1 : t2, this.predIndex = e2 === void 0 ? -1 : e2, this.isCtxDependent = n2 !== void 0 && n2;
  }
  evaluate(t2, e2) {
    const n2 = this.isCtxDependent ? e2 : null;
    return t2.sempred(n2, this.ruleIndex, this.predIndex);
  }
  updateHashCode(t2) {
    t2.update(this.ruleIndex, this.predIndex, this.isCtxDependent);
  }
  equals(t2) {
    return this === t2 || t2 instanceof gt && this.ruleIndex === t2.ruleIndex && this.predIndex === t2.predIndex && this.isCtxDependent === t2.isCtxDependent;
  }
  toString() {
    return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
  }
}
p.NONE = new gt();
class pt extends O {
  constructor(t2, e2, n2, s2) {
    super(t2), this.serializationType = N.PREDICATE, this.ruleIndex = e2, this.predIndex = n2, this.isCtxDependent = s2, this.isEpsilon = !0;
  }
  matches(t2, e2, n2) {
    return !1;
  }
  getPredicate() {
    return new gt(this.ruleIndex, this.predIndex, this.isCtxDependent);
  }
  toString() {
    return "pred_" + this.ruleIndex + ":" + this.predIndex;
  }
}
class ft extends p {
  constructor(t2) {
    super(), this.precedence = t2 === void 0 ? 0 : t2;
  }
  evaluate(t2, e2) {
    return t2.precpred(e2, this.precedence);
  }
  evalPrecedence(t2, e2) {
    return t2.precpred(e2, this.precedence) ? p.NONE : null;
  }
  compareTo(t2) {
    return this.precedence - t2.precedence;
  }
  updateHashCode(t2) {
    t2.update(this.precedence);
  }
  equals(t2) {
    return this === t2 || t2 instanceof ft && this.precedence === t2.precedence;
  }
  toString() {
    return "{" + this.precedence + ">=prec}?";
  }
}
p.PrecedencePredicate = ft;
class xt extends O {
  constructor(t2, e2) {
    super(t2), this.serializationType = N.PRECEDENCE, this.precedence = e2, this.isEpsilon = !0;
  }
  matches(t2, e2, n2) {
    return !1;
  }
  getPredicate() {
    return new ft(this.precedence);
  }
  toString() {
    return this.precedence + " >= _p";
  }
}
class Tt {
  constructor(t2) {
    t2 === void 0 && (t2 = null), this.readOnly = !1, this.verifyATN = t2 === null || t2.verifyATN, this.generateRuleBypassTransitions = t2 !== null && t2.generateRuleBypassTransitions;
  }
}
Tt.defaultOptions = new Tt(), Tt.defaultOptions.readOnly = !0;
class St {
  constructor(t2) {
    this.actionType = t2, this.isPositionDependent = !1;
  }
  hashCode() {
    const t2 = new l();
    return this.updateHashCode(t2), t2.finish();
  }
  updateHashCode(t2) {
    t2.update(this.actionType);
  }
  equals(t2) {
    return this === t2;
  }
}
class mt extends St {
  constructor() {
    super(6);
  }
  execute(t2) {
    t2.skip();
  }
  toString() {
    return "skip";
  }
}
mt.INSTANCE = new mt();
class Et extends St {
  constructor(t2) {
    super(0), this.channel = t2;
  }
  execute(t2) {
    t2._channel = this.channel;
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.channel);
  }
  equals(t2) {
    return this === t2 || t2 instanceof Et && this.channel === t2.channel;
  }
  toString() {
    return "channel(" + this.channel + ")";
  }
}
class _t extends St {
  constructor(t2, e2) {
    super(1), this.ruleIndex = t2, this.actionIndex = e2, this.isPositionDependent = !0;
  }
  execute(t2) {
    t2.action(null, this.ruleIndex, this.actionIndex);
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.ruleIndex, this.actionIndex);
  }
  equals(t2) {
    return this === t2 || t2 instanceof _t && this.ruleIndex === t2.ruleIndex && this.actionIndex === t2.actionIndex;
  }
}
class Ct extends St {
  constructor() {
    super(3);
  }
  execute(t2) {
    t2.more();
  }
  toString() {
    return "more";
  }
}
Ct.INSTANCE = new Ct();
class At extends St {
  constructor(t2) {
    super(7), this.type = t2;
  }
  execute(t2) {
    t2.type = this.type;
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.type);
  }
  equals(t2) {
    return this === t2 || t2 instanceof At && this.type === t2.type;
  }
  toString() {
    return "type(" + this.type + ")";
  }
}
class Nt extends St {
  constructor(t2) {
    super(5), this.mode = t2;
  }
  execute(t2) {
    t2.pushMode(this.mode);
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.mode);
  }
  equals(t2) {
    return this === t2 || t2 instanceof Nt && this.mode === t2.mode;
  }
  toString() {
    return "pushMode(" + this.mode + ")";
  }
}
class kt extends St {
  constructor() {
    super(4);
  }
  execute(t2) {
    t2.popMode();
  }
  toString() {
    return "popMode";
  }
}
kt.INSTANCE = new kt();
class It extends St {
  constructor(t2) {
    super(2), this.mode = t2;
  }
  execute(t2) {
    t2.setMode(this.mode);
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.mode);
  }
  equals(t2) {
    return this === t2 || t2 instanceof It && this.mode === t2.mode;
  }
  toString() {
    return "mode(" + this.mode + ")";
  }
}
function yt(t2, e2) {
  const n2 = [];
  return n2[t2 - 1] = e2, n2.map(function(t3) {
    return e2;
  });
}
class Lt {
  constructor(t2) {
    t2 == null && (t2 = Tt.defaultOptions), this.deserializationOptions = t2, this.stateFactories = null, this.actionFactories = null;
  }
  deserialize(t2) {
    const e2 = this.reset(t2);
    this.checkVersion(e2), e2 && this.skipUUID();
    const n2 = this.readATN();
    this.readStates(n2, e2), this.readRules(n2, e2), this.readModes(n2);
    const s2 = [];
    return this.readSets(n2, s2, this.readInt.bind(this)), e2 && this.readSets(n2, s2, this.readInt32.bind(this)), this.readEdges(n2, s2), this.readDecisions(n2), this.readLexerActions(n2, e2), this.markPrecedenceDecisions(n2), this.verifyATN(n2), this.deserializationOptions.generateRuleBypassTransitions && n2.grammarType === 1 && (this.generateRuleBypassTransitions(n2), this.verifyATN(n2)), n2;
  }
  reset(t2) {
    if ((t2.charCodeAt ? t2.charCodeAt(0) : t2[0]) === 3) {
      const e2 = function(t3) {
        const e3 = t3.charCodeAt(0);
        return e3 > 1 ? e3 - 2 : e3 + 65534;
      }, n2 = t2.split("").map(e2);
      return n2[0] = t2.charCodeAt(0), this.data = n2, this.pos = 0, !0;
    }
    return this.data = t2, this.pos = 0, !1;
  }
  skipUUID() {
    let t2 = 0;
    for (; t2++ < 8; ) this.readInt();
  }
  checkVersion(t2) {
    const e2 = this.readInt();
    if (!t2 && e2 !== 4) throw "Could not deserialize ATN with version " + e2 + " (expected 4).";
  }
  readATN() {
    const t2 = this.readInt(), e2 = this.readInt();
    return new $(t2, e2);
  }
  readStates(t2, e2) {
    let n2, s2, i2;
    const r2 = [], o2 = [], a2 = this.readInt();
    for (let n3 = 0; n3 < a2; n3++) {
      const n4 = this.readInt();
      if (n4 === C.INVALID_TYPE) {
        t2.addState(null);
        continue;
      }
      let s3 = this.readInt();
      e2 && s3 === 65535 && (s3 = -1);
      const i3 = this.stateFactory(n4, s3);
      if (n4 === C.LOOP_END) {
        const t3 = this.readInt();
        r2.push([i3, t3]);
      } else if (i3 instanceof Z) {
        const t3 = this.readInt();
        o2.push([i3, t3]);
      }
      t2.addState(i3);
    }
    for (n2 = 0; n2 < r2.length; n2++) s2 = r2[n2], s2[0].loopBackState = t2.states[s2[1]];
    for (n2 = 0; n2 < o2.length; n2++) s2 = o2[n2], s2[0].endState = t2.states[s2[1]];
    let l2 = this.readInt();
    for (n2 = 0; n2 < l2; n2++) i2 = this.readInt(), t2.states[i2].nonGreedy = !0;
    let h2 = this.readInt();
    for (n2 = 0; n2 < h2; n2++) i2 = this.readInt(), t2.states[i2].isPrecedenceRule = !0;
  }
  readRules(t2, e2) {
    let n2;
    const s2 = this.readInt();
    for (t2.grammarType === 0 && (t2.ruleToTokenType = yt(s2, 0)), t2.ruleToStartState = yt(s2, 0), n2 = 0; n2 < s2; n2++) {
      const s3 = this.readInt();
      if (t2.ruleToStartState[n2] = t2.states[s3], t2.grammarType === 0) {
        let s4 = this.readInt();
        e2 && s4 === 65535 && (s4 = i.EOF), t2.ruleToTokenType[n2] = s4;
      }
    }
    for (t2.ruleToStopState = yt(s2, 0), n2 = 0; n2 < t2.states.length; n2++) {
      const e3 = t2.states[n2];
      e3 instanceof A && (t2.ruleToStopState[e3.ruleIndex] = e3, t2.ruleToStartState[e3.ruleIndex].stopState = e3);
    }
  }
  readModes(t2) {
    const e2 = this.readInt();
    for (let n2 = 0; n2 < e2; n2++) {
      let e3 = this.readInt();
      t2.modeToStartState.push(t2.states[e3]);
    }
  }
  readSets(t2, e2, n2) {
    const s2 = this.readInt();
    for (let t3 = 0; t3 < s2; t3++) {
      const t4 = new _();
      e2.push(t4);
      const s3 = this.readInt();
      this.readInt() !== 0 && t4.addOne(-1);
      for (let e3 = 0; e3 < s3; e3++) {
        const e4 = n2(), s4 = n2();
        t4.addRange(e4, s4);
      }
    }
  }
  readEdges(t2, e2) {
    let n2, s2, i2, r2, o2;
    const a2 = this.readInt();
    for (n2 = 0; n2 < a2; n2++) {
      const n3 = this.readInt(), s3 = this.readInt(), i3 = this.readInt(), o3 = this.readInt(), a3 = this.readInt(), l2 = this.readInt();
      r2 = this.edgeFactory(t2, i3, n3, s3, o3, a3, l2, e2), t2.states[n3].addTransition(r2);
    }
    for (n2 = 0; n2 < t2.states.length; n2++) for (i2 = t2.states[n2], s2 = 0; s2 < i2.transitions.length; s2++) {
      const e3 = i2.transitions[s2];
      if (!(e3 instanceof k)) continue;
      let n3 = -1;
      t2.ruleToStartState[e3.target.ruleIndex].isPrecedenceRule && e3.precedence === 0 && (n3 = e3.target.ruleIndex), r2 = new dt(e3.followState, n3), t2.ruleToStopState[e3.target.ruleIndex].addTransition(r2);
    }
    for (n2 = 0; n2 < t2.states.length; n2++) {
      if (i2 = t2.states[n2], i2 instanceof Z) {
        if (i2.endState === null || i2.endState.startState !== null) throw "IllegalState";
        i2.endState.startState = i2;
      }
      if (i2 instanceof st) for (s2 = 0; s2 < i2.transitions.length; s2++) o2 = i2.transitions[s2].target, o2 instanceof ot && (o2.loopBackState = i2);
      else if (i2 instanceof it) for (s2 = 0; s2 < i2.transitions.length; s2++) o2 = i2.transitions[s2].target, o2 instanceof rt && (o2.loopBackState = i2);
    }
  }
  readDecisions(t2) {
    const e2 = this.readInt();
    for (let n2 = 0; n2 < e2; n2++) {
      const e3 = this.readInt(), s2 = t2.states[e3];
      t2.decisionToState.push(s2), s2.decision = n2;
    }
  }
  readLexerActions(t2, e2) {
    if (t2.grammarType === 0) {
      const n2 = this.readInt();
      t2.lexerActions = yt(n2, null);
      for (let s2 = 0; s2 < n2; s2++) {
        const n3 = this.readInt();
        let i2 = this.readInt();
        e2 && i2 === 65535 && (i2 = -1);
        let r2 = this.readInt();
        e2 && r2 === 65535 && (r2 = -1), t2.lexerActions[s2] = this.lexerActionFactory(n3, i2, r2);
      }
    }
  }
  generateRuleBypassTransitions(t2) {
    let e2;
    const n2 = t2.ruleToStartState.length;
    for (e2 = 0; e2 < n2; e2++) t2.ruleToTokenType[e2] = t2.maxTokenType + e2 + 1;
    for (e2 = 0; e2 < n2; e2++) this.generateRuleBypassTransition(t2, e2);
  }
  generateRuleBypassTransition(t2, e2) {
    let n2, s2;
    const i2 = new lt();
    i2.ruleIndex = e2, t2.addState(i2);
    const r2 = new Q();
    r2.ruleIndex = e2, t2.addState(r2), i2.endState = r2, t2.defineDecisionState(i2), r2.startState = i2;
    let o2 = null, a2 = null;
    if (t2.ruleToStartState[e2].isPrecedenceRule) {
      for (a2 = null, n2 = 0; n2 < t2.states.length; n2++) if (s2 = t2.states[n2], this.stateIsEndStateFor(s2, e2)) {
        a2 = s2, o2 = s2.loopBackState.transitions[0];
        break;
      }
      if (o2 === null) throw "Couldn't identify final state of the precedence rule prefix section.";
    } else a2 = t2.ruleToStopState[e2];
    for (n2 = 0; n2 < t2.states.length; n2++) {
      s2 = t2.states[n2];
      for (let t3 = 0; t3 < s2.transitions.length; t3++) {
        const e3 = s2.transitions[t3];
        e3 !== o2 && e3.target === a2 && (e3.target = r2);
      }
    }
    const l2 = t2.ruleToStartState[e2], h2 = l2.transitions.length;
    for (; h2 > 0; ) i2.addTransition(l2.transitions[h2 - 1]), l2.transitions = l2.transitions.slice(-1);
    t2.ruleToStartState[e2].addTransition(new dt(i2)), r2.addTransition(new dt(a2));
    const c2 = new X();
    t2.addState(c2), c2.addTransition(new ht(r2, t2.ruleToTokenType[e2])), i2.addTransition(new dt(c2));
  }
  stateIsEndStateFor(t2, e2) {
    if (t2.ruleIndex !== e2 || !(t2 instanceof rt)) return null;
    const n2 = t2.transitions[t2.transitions.length - 1].target;
    return n2 instanceof tt && n2.epsilonOnlyTransitions && n2.transitions[0].target instanceof A ? t2 : null;
  }
  markPrecedenceDecisions(t2) {
    for (let e2 = 0; e2 < t2.states.length; e2++) {
      const n2 = t2.states[e2];
      if (n2 instanceof rt && t2.ruleToStartState[n2.ruleIndex].isPrecedenceRule) {
        const t3 = n2.transitions[n2.transitions.length - 1].target;
        t3 instanceof tt && t3.epsilonOnlyTransitions && t3.transitions[0].target instanceof A && (n2.isPrecedenceDecision = !0);
      }
    }
  }
  verifyATN(t2) {
    if (this.deserializationOptions.verifyATN) for (let e2 = 0; e2 < t2.states.length; e2++) {
      const n2 = t2.states[e2];
      if (n2 !== null) if (this.checkCondition(n2.epsilonOnlyTransitions || n2.transitions.length <= 1), n2 instanceof ot) this.checkCondition(n2.loopBackState !== null);
      else if (n2 instanceof rt) if (this.checkCondition(n2.loopBackState !== null), this.checkCondition(n2.transitions.length === 2), n2.transitions[0].target instanceof at) this.checkCondition(n2.transitions[1].target instanceof tt), this.checkCondition(!n2.nonGreedy);
      else {
        if (!(n2.transitions[0].target instanceof tt)) throw "IllegalState";
        this.checkCondition(n2.transitions[1].target instanceof at), this.checkCondition(n2.nonGreedy);
      }
      else n2 instanceof it ? (this.checkCondition(n2.transitions.length === 1), this.checkCondition(n2.transitions[0].target instanceof rt)) : n2 instanceof tt ? this.checkCondition(n2.loopBackState !== null) : n2 instanceof et ? this.checkCondition(n2.stopState !== null) : n2 instanceof Z ? this.checkCondition(n2.endState !== null) : n2 instanceof Q ? this.checkCondition(n2.startState !== null) : n2 instanceof J ? this.checkCondition(n2.transitions.length <= 1 || n2.decision >= 0) : this.checkCondition(n2.transitions.length <= 1 || n2 instanceof A);
    }
  }
  checkCondition(t2, e2) {
    if (!t2) throw e2 == null && (e2 = "IllegalState"), e2;
  }
  readInt() {
    return this.data[this.pos++];
  }
  readInt32() {
    return this.readInt() | this.readInt() << 16;
  }
  edgeFactory(t2, e2, n2, s2, r2, o2, a2, l2) {
    const h2 = t2.states[s2];
    switch (e2) {
      case N.EPSILON:
        return new dt(h2);
      case N.RANGE:
        return new ct(h2, a2 !== 0 ? i.EOF : r2, o2);
      case N.RULE:
        return new k(t2.states[r2], o2, a2, h2);
      case N.PREDICATE:
        return new pt(h2, r2, o2, a2 !== 0);
      case N.PRECEDENCE:
        return new xt(h2, r2);
      case N.ATOM:
        return new ht(h2, a2 !== 0 ? i.EOF : r2);
      case N.ACTION:
        return new ut(h2, r2, o2, a2 !== 0);
      case N.SET:
        return new I(h2, l2[r2]);
      case N.NOT_SET:
        return new y(h2, l2[r2]);
      case N.WILDCARD:
        return new L(h2);
      default:
        throw "The specified transition type: " + e2 + " is not valid.";
    }
  }
  stateFactory(t2, e2) {
    if (this.stateFactories === null) {
      const t3 = [];
      t3[C.INVALID_TYPE] = null, t3[C.BASIC] = () => new X(), t3[C.RULE_START] = () => new et(), t3[C.BLOCK_START] = () => new lt(), t3[C.PLUS_BLOCK_START] = () => new ot(), t3[C.STAR_BLOCK_START] = () => new at(), t3[C.TOKEN_START] = () => new nt(), t3[C.RULE_STOP] = () => new A(), t3[C.BLOCK_END] = () => new Q(), t3[C.STAR_LOOP_BACK] = () => new it(), t3[C.STAR_LOOP_ENTRY] = () => new rt(), t3[C.PLUS_LOOP_BACK] = () => new st(), t3[C.LOOP_END] = () => new tt(), this.stateFactories = t3;
    }
    if (t2 > this.stateFactories.length || this.stateFactories[t2] === null) throw "The specified state type " + t2 + " is not valid.";
    {
      const n2 = this.stateFactories[t2]();
      if (n2 !== null) return n2.ruleIndex = e2, n2;
    }
  }
  lexerActionFactory(t2, e2, n2) {
    if (this.actionFactories === null) {
      const t3 = [];
      t3[0] = (t4, e3) => new Et(t4), t3[1] = (t4, e3) => new _t(t4, e3), t3[2] = (t4, e3) => new It(t4), t3[3] = (t4, e3) => Ct.INSTANCE, t3[4] = (t4, e3) => kt.INSTANCE, t3[5] = (t4, e3) => new Nt(t4), t3[6] = (t4, e3) => mt.INSTANCE, t3[7] = (t4, e3) => new At(t4), this.actionFactories = t3;
    }
    if (t2 > this.actionFactories.length || this.actionFactories[t2] === null) throw "The specified lexer action type " + t2 + " is not valid.";
    return this.actionFactories[t2](e2, n2);
  }
}
class Ot {
  syntaxError(t2, e2, n2, s2, i2, r2) {
  }
  reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
  }
  reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
  }
  reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
  }
}
class Rt extends Ot {
  constructor() {
    super();
  }
  syntaxError(t2, e2, n2, s2, i2, r2) {
    console.error("line " + n2 + ":" + s2 + " " + i2);
  }
}
Rt.INSTANCE = new Rt();
class wt extends Ot {
  constructor(t2) {
    if (super(), t2 === null) throw "delegates";
    return this.delegates = t2, this;
  }
  syntaxError(t2, e2, n2, s2, i2, r2) {
    this.delegates.map((o2) => o2.syntaxError(t2, e2, n2, s2, i2, r2));
  }
  reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
    this.delegates.map((a2) => a2.reportAmbiguity(t2, e2, n2, s2, i2, r2, o2));
  }
  reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
    this.delegates.map((o2) => o2.reportAttemptingFullContext(t2, e2, n2, s2, i2, r2));
  }
  reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
    this.delegates.map((o2) => o2.reportContextSensitivity(t2, e2, n2, s2, i2, r2));
  }
}
class vt {
  constructor() {
    this._listeners = [Rt.INSTANCE], this._interp = null, this._stateNumber = -1;
  }
  checkVersion(t2) {
    const e2 = "4.13.2";
    e2 !== t2 && console.log("ANTLR runtime and generated code versions disagree: " + e2 + "!=" + t2);
  }
  addErrorListener(t2) {
    this._listeners.push(t2);
  }
  removeErrorListeners() {
    this._listeners = [];
  }
  getLiteralNames() {
    return Object.getPrototypeOf(this).constructor.literalNames || [];
  }
  getSymbolicNames() {
    return Object.getPrototypeOf(this).constructor.symbolicNames || [];
  }
  getTokenNames() {
    if (!this.tokenNames) {
      const t2 = this.getLiteralNames(), e2 = this.getSymbolicNames(), n2 = t2.length > e2.length ? t2.length : e2.length;
      this.tokenNames = [];
      for (let s2 = 0; s2 < n2; s2++) this.tokenNames[s2] = t2[s2] || e2[s2] || "<INVALID";
    }
    return this.tokenNames;
  }
  getTokenTypeMap() {
    const t2 = this.getTokenNames();
    if (t2 === null) throw "The current recognizer does not provide a list of token names.";
    let e2 = this.tokenTypeMapCache[t2];
    return e2 === void 0 && (e2 = t2.reduce(function(t3, e3, n2) {
      t3[e3] = n2;
    }), e2.EOF = i.EOF, this.tokenTypeMapCache[t2] = e2), e2;
  }
  getRuleIndexMap() {
    const t2 = this.ruleNames;
    if (t2 === null) throw "The current recognizer does not provide a list of rule names.";
    let e2 = this.ruleIndexMapCache[t2];
    return e2 === void 0 && (e2 = t2.reduce(function(t3, e3, n2) {
      t3[e3] = n2;
    }), this.ruleIndexMapCache[t2] = e2), e2;
  }
  getTokenType(t2) {
    const e2 = this.getTokenTypeMap()[t2];
    return e2 !== void 0 ? e2 : i.INVALID_TYPE;
  }
  getErrorHeader(t2) {
    return "line " + t2.getOffendingToken().line + ":" + t2.getOffendingToken().column;
  }
  getTokenErrorDisplay(t2) {
    if (t2 === null) return "<no token>";
    let e2 = t2.text;
    return e2 === null && (e2 = t2.type === i.EOF ? "<EOF>" : "<" + t2.type + ">"), e2 = e2.replace(`
`, "\\n").replace("\r", "\\r").replace("	", "\\t"), "'" + e2 + "'";
  }
  getErrorListenerDispatch() {
    return console.warn("Calling deprecated method in Recognizer class: getErrorListenerDispatch()"), this.getErrorListener();
  }
  getErrorListener() {
    return new wt(this._listeners);
  }
  sempred(t2, e2, n2) {
    return !0;
  }
  precpred(t2, e2) {
    return !0;
  }
  get atn() {
    return this._interp.atn;
  }
  get state() {
    return this._stateNumber;
  }
  set state(t2) {
    this._stateNumber = t2;
  }
}
vt.tokenTypeMapCache = {}, vt.ruleIndexMapCache = {};
class Pt extends i {
  constructor(t2, e2, n2, s2, r2) {
    super(), this.source = t2 !== void 0 ? t2 : Pt.EMPTY_SOURCE, this.type = e2 !== void 0 ? e2 : null, this.channel = n2 !== void 0 ? n2 : i.DEFAULT_CHANNEL, this.start = s2 !== void 0 ? s2 : -1, this.stop = r2 !== void 0 ? r2 : -1, this.tokenIndex = -1, this.source[0] !== null ? (this.line = t2[0].line, this.column = t2[0].column) : this.column = -1;
  }
  clone() {
    const t2 = new Pt(this.source, this.type, this.channel, this.start, this.stop);
    return t2.tokenIndex = this.tokenIndex, t2.line = this.line, t2.column = this.column, t2.text = this.text, t2;
  }
  cloneWithType(t2) {
    const e2 = new Pt(this.source, t2, this.channel, this.start, this.stop);
    return e2.tokenIndex = this.tokenIndex, e2.line = this.line, e2.column = this.column, t2 === i.EOF && (e2.text = ""), e2;
  }
  toString() {
    let t2 = this.text;
    return t2 = t2 !== null ? t2.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") : "<no text>", "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + t2 + "',<" + this.type + ">" + (this.channel > 0 ? ",channel=" + this.channel : "") + "," + this.line + ":" + this.column + "]";
  }
  get text() {
    if (this._text !== null) return this._text;
    const t2 = this.getInputStream();
    if (t2 === null) return null;
    const e2 = t2.size;
    return this.start < e2 && this.stop < e2 ? t2.getText(this.start, this.stop) : "<EOF>";
  }
  set text(t2) {
    this._text = t2;
  }
}
Pt.EMPTY_SOURCE = [null, null];
class bt {
}
class Dt extends bt {
  constructor(t2) {
    super(), this.copyText = t2 !== void 0 && t2;
  }
  create(t2, e2, n2, s2, i2, r2, o2, a2) {
    const l2 = new Pt(t2, e2, s2, i2, r2);
    return l2.line = o2, l2.column = a2, n2 !== null ? l2.text = n2 : this.copyText && t2[1] !== null && (l2.text = t2[1].getText(i2, r2)), l2;
  }
  createThin(t2, e2) {
    const n2 = new Pt(null, t2);
    return n2.text = e2, n2;
  }
}
Dt.DEFAULT = new Dt();
class Ft extends Error {
  constructor(t2) {
    super(t2.message), Error.captureStackTrace && Error.captureStackTrace(this, Ft), this.message = t2.message, this.recognizer = t2.recognizer, this.input = t2.input, this.ctx = t2.ctx, this.offendingToken = null, this.offendingState = -1, this.recognizer !== null && (this.offendingState = this.recognizer.state);
  }
  getExpectedTokens() {
    return this.recognizer !== null ? this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx) : null;
  }
  toString() {
    return this.message;
  }
}
class Mt extends Ft {
  constructor(t2, e2, n2, s2) {
    super({ message: "", recognizer: t2, input: e2, ctx: null }), this.startIndex = n2, this.deadEndConfigs = s2;
  }
  toString() {
    let t2 = "";
    return this.startIndex >= 0 && this.startIndex < this.input.size && (t2 = this.input.getText(new E(this.startIndex, this.startIndex))), "LexerNoViableAltException" + t2;
  }
}
class Ut extends vt {
  constructor(t2) {
    super(), this._input = t2, this._factory = Dt.DEFAULT, this._tokenFactorySourcePair = [this, t2], this._interp = null, this._token = null, this._tokenStartCharIndex = -1, this._tokenStartLine = -1, this._tokenStartColumn = -1, this._hitEOF = !1, this._channel = i.DEFAULT_CHANNEL, this._type = i.INVALID_TYPE, this._modeStack = [], this._mode = Ut.DEFAULT_MODE, this._text = null;
  }
  reset() {
    this._input !== null && this._input.seek(0), this._token = null, this._type = i.INVALID_TYPE, this._channel = i.DEFAULT_CHANNEL, this._tokenStartCharIndex = -1, this._tokenStartColumn = -1, this._tokenStartLine = -1, this._text = null, this._hitEOF = !1, this._mode = Ut.DEFAULT_MODE, this._modeStack = [], this._interp.reset();
  }
  nextToken() {
    if (this._input === null) throw "nextToken requires a non-null input stream.";
    const t2 = this._input.mark();
    try {
      for (; ; ) {
        if (this._hitEOF) return this.emitEOF(), this._token;
        this._token = null, this._channel = i.DEFAULT_CHANNEL, this._tokenStartCharIndex = this._input.index, this._tokenStartColumn = this._interp.column, this._tokenStartLine = this._interp.line, this._text = null;
        let t3 = !1;
        for (; ; ) {
          this._type = i.INVALID_TYPE;
          let e2 = Ut.SKIP;
          try {
            e2 = this._interp.match(this._input, this._mode);
          } catch (t4) {
            if (!(t4 instanceof Ft)) throw console.log(t4.stack), t4;
            this.notifyListeners(t4), this.recover(t4);
          }
          if (this._input.LA(1) === i.EOF && (this._hitEOF = !0), this._type === i.INVALID_TYPE && (this._type = e2), this._type === Ut.SKIP) {
            t3 = !0;
            break;
          }
          if (this._type !== Ut.MORE) break;
        }
        if (!t3) return this._token === null && this.emit(), this._token;
      }
    } finally {
      this._input.release(t2);
    }
  }
  skip() {
    this._type = Ut.SKIP;
  }
  more() {
    this._type = Ut.MORE;
  }
  mode(t2) {
    console.warn("Calling deprecated method in Lexer class: mode(...)"), this.setMode(t2);
  }
  setMode(t2) {
    this._mode = t2;
  }
  getMode() {
    return this._mode;
  }
  getModeStack() {
    return this._modeStack;
  }
  pushMode(t2) {
    this._interp.debug && console.log("pushMode " + t2), this._modeStack.push(this._mode), this.setMode(t2);
  }
  popMode() {
    if (this._modeStack.length === 0) throw "Empty Stack";
    return this._interp.debug && console.log("popMode back to " + this._modeStack.slice(0, -1)), this.setMode(this._modeStack.pop()), this._mode;
  }
  emitToken(t2) {
    this._token = t2;
  }
  emit() {
    const t2 = this._factory.create(this._tokenFactorySourcePair, this._type, this._text, this._channel, this._tokenStartCharIndex, this.getCharIndex() - 1, this._tokenStartLine, this._tokenStartColumn);
    return this.emitToken(t2), t2;
  }
  emitEOF() {
    const t2 = this.column, e2 = this.line, n2 = this._factory.create(this._tokenFactorySourcePair, i.EOF, null, i.DEFAULT_CHANNEL, this._input.index, this._input.index - 1, e2, t2);
    return this.emitToken(n2), n2;
  }
  getCharIndex() {
    return this._input.index;
  }
  getAllTokens() {
    const t2 = [];
    let e2 = this.nextToken();
    for (; e2.type !== i.EOF; ) t2.push(e2), e2 = this.nextToken();
    return t2;
  }
  notifyListeners(t2) {
    const e2 = this._tokenStartCharIndex, n2 = this._input.index, s2 = this._input.getText(e2, n2), i2 = "token recognition error at: '" + this.getErrorDisplay(s2) + "'";
    this.getErrorListener().syntaxError(this, null, this._tokenStartLine, this._tokenStartColumn, i2, t2);
  }
  getErrorDisplay(t2) {
    const e2 = [];
    for (let n2 = 0; n2 < t2.length; n2++) e2.push(t2[n2]);
    return e2.join("");
  }
  getErrorDisplayForChar(t2) {
    return t2.charCodeAt(0) === i.EOF ? "<EOF>" : t2 === `
` ? "\\n" : t2 === "	" ? "\\t" : t2 === "\r" ? "\\r" : t2;
  }
  getCharErrorDisplay(t2) {
    return "'" + this.getErrorDisplayForChar(t2) + "'";
  }
  recover(t2) {
    this._input.LA(1) !== i.EOF && (t2 instanceof Mt ? this._interp.consume(this._input) : this._input.consume());
  }
  get inputStream() {
    return this._input;
  }
  set inputStream(t2) {
    this._input = null, this._tokenFactorySourcePair = [this, this._input], this.reset(), this._input = t2, this._tokenFactorySourcePair = [this, this._input];
  }
  get sourceName() {
    return this._input.sourceName;
  }
  get type() {
    return this._type;
  }
  set type(t2) {
    this._type = t2;
  }
  get line() {
    return this._interp.line;
  }
  set line(t2) {
    this._interp.line = t2;
  }
  get column() {
    return this._interp.column;
  }
  set column(t2) {
    this._interp.column = t2;
  }
  get text() {
    return this._text !== null ? this._text : this._interp.getText(this._input);
  }
  set text(t2) {
    this._text = t2;
  }
}
function Bt(t2) {
  return t2.hashCodeForConfigSet();
}
function zt(t2, e2) {
  return t2 === e2 || t2 !== null && e2 !== null && t2.equalsForConfigSet(e2);
}
Ut.DEFAULT_MODE = 0, Ut.MORE = -2, Ut.SKIP = -3, Ut.DEFAULT_TOKEN_CHANNEL = i.DEFAULT_CHANNEL, Ut.HIDDEN = i.HIDDEN_CHANNEL, Ut.MIN_CHAR_VALUE = 0, Ut.MAX_CHAR_VALUE = 1114111;
class Vt {
  constructor(t2) {
    this.configLookup = new g(Bt, zt), this.fullCtx = t2 === void 0 || t2, this.readOnly = !1, this.configs = [], this.uniqueAlt = 0, this.conflictingAlts = null, this.hasSemanticContext = !1, this.dipsIntoOuterContext = !1, this.cachedHashCode = -1;
  }
  add(t2, e2) {
    if (e2 === void 0 && (e2 = null), this.readOnly) throw "This set is readonly";
    t2.semanticContext !== p.NONE && (this.hasSemanticContext = !0), t2.reachesIntoOuterContext > 0 && (this.dipsIntoOuterContext = !0);
    const n2 = this.configLookup.getOrAdd(t2);
    if (n2 === t2) return this.cachedHashCode = -1, this.configs.push(t2), !0;
    const s2 = !this.fullCtx, i2 = G(n2.context, t2.context, s2, e2);
    return n2.reachesIntoOuterContext = Math.max(n2.reachesIntoOuterContext, t2.reachesIntoOuterContext), t2.precedenceFilterSuppressed && (n2.precedenceFilterSuppressed = !0), n2.context = i2, !0;
  }
  getStates() {
    const t2 = new g();
    for (let e2 = 0; e2 < this.configs.length; e2++) t2.add(this.configs[e2].state);
    return t2;
  }
  getPredicates() {
    const t2 = [];
    for (let e2 = 0; e2 < this.configs.length; e2++) {
      const n2 = this.configs[e2].semanticContext;
      n2 !== p.NONE && t2.push(n2.semanticContext);
    }
    return t2;
  }
  optimizeConfigs(t2) {
    if (this.readOnly) throw "This set is readonly";
    if (this.configLookup.length !== 0) for (let e2 = 0; e2 < this.configs.length; e2++) {
      const n2 = this.configs[e2];
      n2.context = t2.getCachedContext(n2.context);
    }
  }
  addAll(t2) {
    for (let e2 = 0; e2 < t2.length; e2++) this.add(t2[e2]);
    return !1;
  }
  equals(t2) {
    return this === t2 || t2 instanceof Vt && r(this.configs, t2.configs) && this.fullCtx === t2.fullCtx && this.uniqueAlt === t2.uniqueAlt && this.conflictingAlts === t2.conflictingAlts && this.hasSemanticContext === t2.hasSemanticContext && this.dipsIntoOuterContext === t2.dipsIntoOuterContext;
  }
  hashCode() {
    const t2 = new l();
    return t2.update(this.configs), t2.finish();
  }
  updateHashCode(t2) {
    this.readOnly ? (this.cachedHashCode === -1 && (this.cachedHashCode = this.hashCode()), t2.update(this.cachedHashCode)) : t2.update(this.hashCode());
  }
  isEmpty() {
    return this.configs.length === 0;
  }
  contains(t2) {
    if (this.configLookup === null) throw "This method is not implemented for readonly sets.";
    return this.configLookup.contains(t2);
  }
  containsFast(t2) {
    if (this.configLookup === null) throw "This method is not implemented for readonly sets.";
    return this.configLookup.containsFast(t2);
  }
  clear() {
    if (this.readOnly) throw "This set is readonly";
    this.configs = [], this.cachedHashCode = -1, this.configLookup = new g();
  }
  setReadonly(t2) {
    this.readOnly = t2, t2 && (this.configLookup = null);
  }
  toString() {
    return d(this.configs) + (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") + (this.uniqueAlt !== $.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") + (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") + (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
  }
  get items() {
    return this.configs;
  }
  get length() {
    return this.configs.length;
  }
}
class qt {
  constructor(t2, e2) {
    return t2 === null && (t2 = -1), e2 === null && (e2 = new Vt()), this.stateNumber = t2, this.configs = e2, this.edges = null, this.isAcceptState = !1, this.prediction = 0, this.lexerActionExecutor = null, this.requiresFullContext = !1, this.predicates = null, this;
  }
  getAltSet() {
    const t2 = new g();
    if (this.configs !== null) for (let e2 = 0; e2 < this.configs.length; e2++) {
      const n2 = this.configs[e2];
      t2.add(n2.alt);
    }
    return t2.length === 0 ? null : t2;
  }
  equals(t2) {
    return this === t2 || t2 instanceof qt && this.configs.equals(t2.configs);
  }
  toString() {
    let t2 = this.stateNumber + ":" + this.configs;
    return this.isAcceptState && (t2 += "=>", this.predicates !== null ? t2 += this.predicates : t2 += this.prediction), t2;
  }
  hashCode() {
    const t2 = new l();
    return t2.update(this.configs), t2.finish();
  }
}
class Ht {
  constructor(t2, e2) {
    return this.atn = t2, this.sharedContextCache = e2, this;
  }
  getCachedContext(t2) {
    if (this.sharedContextCache === null) return t2;
    const e2 = new H();
    return Y(t2, this.sharedContextCache, e2);
  }
}
Ht.ERROR = new qt(2147483647, new Vt());
class Kt extends Vt {
  constructor() {
    super(), this.configLookup = new g();
  }
}
class Yt extends m {
  constructor(t2, e2) {
    super(t2, e2);
    const n2 = t2.lexerActionExecutor || null;
    return this.lexerActionExecutor = n2 || (e2 !== null ? e2.lexerActionExecutor : null), this.passedThroughNonGreedyDecision = e2 !== null && this.checkNonGreedyDecision(e2, this.state), this.hashCodeForConfigSet = Yt.prototype.hashCode, this.equalsForConfigSet = Yt.prototype.equals, this;
  }
  updateHashCode(t2) {
    t2.update(this.state.stateNumber, this.alt, this.context, this.semanticContext, this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
  }
  equals(t2) {
    return this === t2 || t2 instanceof Yt && this.passedThroughNonGreedyDecision === t2.passedThroughNonGreedyDecision && (this.lexerActionExecutor ? this.lexerActionExecutor.equals(t2.lexerActionExecutor) : !t2.lexerActionExecutor) && super.equals(t2);
  }
  checkNonGreedyDecision(t2, e2) {
    return t2.passedThroughNonGreedyDecision || e2 instanceof J && e2.nonGreedy;
  }
}
class Gt extends St {
  constructor(t2, e2) {
    super(e2.actionType), this.offset = t2, this.action = e2, this.isPositionDependent = !0;
  }
  execute(t2) {
    this.action.execute(t2);
  }
  updateHashCode(t2) {
    t2.update(this.actionType, this.offset, this.action);
  }
  equals(t2) {
    return this === t2 || t2 instanceof Gt && this.offset === t2.offset && this.action === t2.action;
  }
}
class Wt {
  constructor(t2) {
    return this.lexerActions = t2 === null ? [] : t2, this.cachedHashCode = l.hashStuff(t2), this;
  }
  fixOffsetBeforeMatch(t2) {
    let e2 = null;
    for (let n2 = 0; n2 < this.lexerActions.length; n2++) !this.lexerActions[n2].isPositionDependent || this.lexerActions[n2] instanceof Gt || (e2 === null && (e2 = this.lexerActions.concat([])), e2[n2] = new Gt(t2, this.lexerActions[n2]));
    return e2 === null ? this : new Wt(e2);
  }
  execute(t2, e2, n2) {
    let s2 = !1;
    const i2 = e2.index;
    try {
      for (let r2 = 0; r2 < this.lexerActions.length; r2++) {
        let o2 = this.lexerActions[r2];
        if (o2 instanceof Gt) {
          const t3 = o2.offset;
          e2.seek(n2 + t3), o2 = o2.action, s2 = n2 + t3 !== i2;
        } else o2.isPositionDependent && (e2.seek(i2), s2 = !1);
        o2.execute(t2);
      }
    } finally {
      s2 && e2.seek(i2);
    }
  }
  hashCode() {
    return this.cachedHashCode;
  }
  updateHashCode(t2) {
    t2.update(this.cachedHashCode);
  }
  equals(t2) {
    if (this === t2) return !0;
    if (t2 instanceof Wt) {
      if (this.cachedHashCode != t2.cachedHashCode || this.lexerActions.length != t2.lexerActions.length) return !1;
      {
        const e2 = this.lexerActions.length;
        for (let n2 = 0; n2 < e2; ++n2) if (!this.lexerActions[n2].equals(t2.lexerActions[n2])) return !1;
        return !0;
      }
    }
    return !1;
  }
  static append(t2, e2) {
    if (t2 === null) return new Wt([e2]);
    const n2 = t2.lexerActions.concat([e2]);
    return new Wt(n2);
  }
}
function jt(t2) {
  t2.index = -1, t2.line = 0, t2.column = -1, t2.dfaState = null;
}
class $t {
  constructor() {
    jt(this);
  }
  reset() {
    jt(this);
  }
}
class Xt extends Ht {
  constructor(t2, e2, n2, s2) {
    super(e2, s2), this.decisionToDFA = n2, this.recog = t2, this.startIndex = -1, this.line = 1, this.column = 0, this.mode = Ut.DEFAULT_MODE, this.prevAccept = new $t();
  }
  copyState(t2) {
    this.column = t2.column, this.line = t2.line, this.mode = t2.mode, this.startIndex = t2.startIndex;
  }
  match(t2, e2) {
    this.mode = e2;
    const n2 = t2.mark();
    try {
      this.startIndex = t2.index, this.prevAccept.reset();
      const n3 = this.decisionToDFA[e2];
      return n3.s0 === null ? this.matchATN(t2) : this.execATN(t2, n3.s0);
    } finally {
      t2.release(n2);
    }
  }
  reset() {
    this.prevAccept.reset(), this.startIndex = -1, this.line = 1, this.column = 0, this.mode = Ut.DEFAULT_MODE;
  }
  matchATN(t2) {
    const e2 = this.atn.modeToStartState[this.mode];
    Xt.debug && console.log("matchATN mode " + this.mode + " start: " + e2);
    const n2 = this.mode, s2 = this.computeStartState(t2, e2), i2 = s2.hasSemanticContext;
    s2.hasSemanticContext = !1;
    const r2 = this.addDFAState(s2);
    i2 || (this.decisionToDFA[this.mode].s0 = r2);
    const o2 = this.execATN(t2, r2);
    return Xt.debug && console.log("DFA after matchATN: " + this.decisionToDFA[n2].toLexerString()), o2;
  }
  execATN(t2, e2) {
    Xt.debug && console.log("start state closure=" + e2.configs), e2.isAcceptState && this.captureSimState(this.prevAccept, t2, e2);
    let n2 = t2.LA(1), s2 = e2;
    for (; ; ) {
      Xt.debug && console.log("execATN loop starting closure: " + s2.configs);
      let e3 = this.getExistingTargetState(s2, n2);
      if (e3 === null && (e3 = this.computeTargetState(t2, s2, n2)), e3 === Ht.ERROR || (n2 !== i.EOF && this.consume(t2), e3.isAcceptState && (this.captureSimState(this.prevAccept, t2, e3), n2 === i.EOF))) break;
      n2 = t2.LA(1), s2 = e3;
    }
    return this.failOrAccept(this.prevAccept, t2, s2.configs, n2);
  }
  getExistingTargetState(t2, e2) {
    if (t2.edges === null || e2 < Xt.MIN_DFA_EDGE || e2 > Xt.MAX_DFA_EDGE) return null;
    let n2 = t2.edges[e2 - Xt.MIN_DFA_EDGE];
    return n2 === void 0 && (n2 = null), Xt.debug && n2 !== null && console.log("reuse state " + t2.stateNumber + " edge to " + n2.stateNumber), n2;
  }
  computeTargetState(t2, e2, n2) {
    const s2 = new Kt();
    return this.getReachableConfigSet(t2, e2.configs, s2, n2), s2.items.length === 0 ? (s2.hasSemanticContext || this.addDFAEdge(e2, n2, Ht.ERROR), Ht.ERROR) : this.addDFAEdge(e2, n2, null, s2);
  }
  failOrAccept(t2, e2, n2, s2) {
    if (this.prevAccept.dfaState !== null) {
      const n3 = t2.dfaState.lexerActionExecutor;
      return this.accept(e2, n3, this.startIndex, t2.index, t2.line, t2.column), t2.dfaState.prediction;
    }
    if (s2 === i.EOF && e2.index === this.startIndex) return i.EOF;
    throw new Mt(this.recog, e2, this.startIndex, n2);
  }
  getReachableConfigSet(t2, e2, n2, s2) {
    let r2 = $.INVALID_ALT_NUMBER;
    for (let o2 = 0; o2 < e2.items.length; o2++) {
      const a2 = e2.items[o2], l2 = a2.alt === r2;
      if (!l2 || !a2.passedThroughNonGreedyDecision) {
        Xt.debug && console.log(`testing %s at %s
`, this.getTokenName(s2), a2.toString(this.recog, !0));
        for (let e3 = 0; e3 < a2.state.transitions.length; e3++) {
          const o3 = a2.state.transitions[e3], h2 = this.getReachableTarget(o3, s2);
          if (h2 !== null) {
            let e4 = a2.lexerActionExecutor;
            e4 !== null && (e4 = e4.fixOffsetBeforeMatch(t2.index - this.startIndex));
            const o4 = s2 === i.EOF, c2 = new Yt({ state: h2, lexerActionExecutor: e4 }, a2);
            this.closure(t2, c2, n2, l2, !0, o4) && (r2 = a2.alt);
          }
        }
      }
    }
  }
  accept(t2, e2, n2, s2, i2, r2) {
    Xt.debug && console.log(`ACTION %s
`, e2), t2.seek(s2), this.line = i2, this.column = r2, e2 !== null && this.recog !== null && e2.execute(this.recog, t2, n2);
  }
  getReachableTarget(t2, e2) {
    return t2.matches(e2, 0, Ut.MAX_CHAR_VALUE) ? t2.target : null;
  }
  computeStartState(t2, e2) {
    const n2 = B.EMPTY, s2 = new Kt();
    for (let i2 = 0; i2 < e2.transitions.length; i2++) {
      const r2 = e2.transitions[i2].target, o2 = new Yt({ state: r2, alt: i2 + 1, context: n2 }, null);
      this.closure(t2, o2, s2, !1, !1, !1);
    }
    return s2;
  }
  closure(t2, e2, n2, s2, i2, r2) {
    let o2 = null;
    if (Xt.debug && console.log("closure(" + e2.toString(this.recog, !0) + ")"), e2.state instanceof A) {
      if (Xt.debug && (this.recog !== null ? console.log(`closure at %s rule stop %s
`, this.recog.ruleNames[e2.state.ruleIndex], e2) : console.log(`closure at rule stop %s
`, e2)), e2.context === null || e2.context.hasEmptyPath()) {
        if (e2.context === null || e2.context.isEmpty()) return n2.add(e2), !0;
        n2.add(new Yt({ state: e2.state, context: B.EMPTY }, e2)), s2 = !0;
      }
      if (e2.context !== null && !e2.context.isEmpty()) {
        for (let a2 = 0; a2 < e2.context.length; a2++) if (e2.context.getReturnState(a2) !== B.EMPTY_RETURN_STATE) {
          const l2 = e2.context.getParent(a2), h2 = this.atn.states[e2.context.getReturnState(a2)];
          o2 = new Yt({ state: h2, context: l2 }, e2), s2 = this.closure(t2, o2, n2, s2, i2, r2);
        }
      }
      return s2;
    }
    e2.state.epsilonOnlyTransitions || s2 && e2.passedThroughNonGreedyDecision || n2.add(e2);
    for (let a2 = 0; a2 < e2.state.transitions.length; a2++) {
      const l2 = e2.state.transitions[a2];
      o2 = this.getEpsilonTarget(t2, e2, l2, n2, i2, r2), o2 !== null && (s2 = this.closure(t2, o2, n2, s2, i2, r2));
    }
    return s2;
  }
  getEpsilonTarget(t2, e2, n2, s2, r2, o2) {
    let a2 = null;
    if (n2.serializationType === N.RULE) {
      const t3 = V.create(e2.context, n2.followState.stateNumber);
      a2 = new Yt({ state: n2.target, context: t3 }, e2);
    } else {
      if (n2.serializationType === N.PRECEDENCE) throw "Precedence predicates are not supported in lexers.";
      if (n2.serializationType === N.PREDICATE) Xt.debug && console.log("EVAL rule " + n2.ruleIndex + ":" + n2.predIndex), s2.hasSemanticContext = !0, this.evaluatePredicate(t2, n2.ruleIndex, n2.predIndex, r2) && (a2 = new Yt({ state: n2.target }, e2));
      else if (n2.serializationType === N.ACTION) if (e2.context === null || e2.context.hasEmptyPath()) {
        const t3 = Wt.append(e2.lexerActionExecutor, this.atn.lexerActions[n2.actionIndex]);
        a2 = new Yt({ state: n2.target, lexerActionExecutor: t3 }, e2);
      } else a2 = new Yt({ state: n2.target }, e2);
      else n2.serializationType === N.EPSILON ? a2 = new Yt({ state: n2.target }, e2) : n2.serializationType !== N.ATOM && n2.serializationType !== N.RANGE && n2.serializationType !== N.SET || o2 && n2.matches(i.EOF, 0, Ut.MAX_CHAR_VALUE) && (a2 = new Yt({ state: n2.target }, e2));
    }
    return a2;
  }
  evaluatePredicate(t2, e2, n2, s2) {
    if (this.recog === null) return !0;
    if (!s2) return this.recog.sempred(null, e2, n2);
    const i2 = this.column, r2 = this.line, o2 = t2.index, a2 = t2.mark();
    try {
      return this.consume(t2), this.recog.sempred(null, e2, n2);
    } finally {
      this.column = i2, this.line = r2, t2.seek(o2), t2.release(a2);
    }
  }
  captureSimState(t2, e2, n2) {
    t2.index = e2.index, t2.line = this.line, t2.column = this.column, t2.dfaState = n2;
  }
  addDFAEdge(t2, e2, n2, s2) {
    if (n2 === void 0 && (n2 = null), s2 === void 0 && (s2 = null), n2 === null && s2 !== null) {
      const t3 = s2.hasSemanticContext;
      if (s2.hasSemanticContext = !1, n2 = this.addDFAState(s2), t3) return n2;
    }
    return e2 < Xt.MIN_DFA_EDGE || e2 > Xt.MAX_DFA_EDGE || (Xt.debug && console.log("EDGE " + t2 + " -> " + n2 + " upon " + e2), t2.edges === null && (t2.edges = []), t2.edges[e2 - Xt.MIN_DFA_EDGE] = n2), n2;
  }
  addDFAState(t2) {
    const e2 = new qt(null, t2);
    let n2 = null;
    for (let e3 = 0; e3 < t2.items.length; e3++) {
      const s3 = t2.items[e3];
      if (s3.state instanceof A) {
        n2 = s3;
        break;
      }
    }
    n2 !== null && (e2.isAcceptState = !0, e2.lexerActionExecutor = n2.lexerActionExecutor, e2.prediction = this.atn.ruleToTokenType[n2.state.ruleIndex]);
    const s2 = this.decisionToDFA[this.mode], i2 = s2.states.get(e2);
    if (i2 !== null) return i2;
    const r2 = e2;
    return r2.stateNumber = s2.states.length, t2.setReadonly(!0), r2.configs = t2, s2.states.add(r2), r2;
  }
  getDFA(t2) {
    return this.decisionToDFA[t2];
  }
  getText(t2) {
    return t2.getText(this.startIndex, t2.index - 1);
  }
  consume(t2) {
    t2.LA(1) === 10 ? (this.line += 1, this.column = 0) : this.column += 1, t2.consume();
  }
  getTokenName(t2) {
    return t2 === -1 ? "EOF" : "'" + String.fromCharCode(t2) + "'";
  }
}
Xt.debug = !1, Xt.dfa_debug = !1, Xt.MIN_DFA_EDGE = 0, Xt.MAX_DFA_EDGE = 127;
class Jt {
  constructor(t2, e2) {
    this.alt = e2, this.pred = t2;
  }
  toString() {
    return "(" + this.pred + ", " + this.alt + ")";
  }
}
class Zt {
  constructor() {
    this.data = {};
  }
  get(t2) {
    return this.data["k-" + t2] || null;
  }
  set(t2, e2) {
    this.data["k-" + t2] = e2;
  }
  values() {
    return Object.keys(this.data).filter((t2) => t2.startsWith("k-")).map((t2) => this.data[t2], this);
  }
}
const Qt = { SLL: 0, LL: 1, LL_EXACT_AMBIG_DETECTION: 2, hasSLLConflictTerminatingPrediction: function(t2, e2) {
  if (Qt.allConfigsInRuleStopStates(e2)) return !0;
  if (t2 === Qt.SLL && e2.hasSemanticContext) {
    const t3 = new Vt();
    for (let n3 = 0; n3 < e2.items.length; n3++) {
      let s2 = e2.items[n3];
      s2 = new m({ semanticContext: p.NONE }, s2), t3.add(s2);
    }
    e2 = t3;
  }
  const n2 = Qt.getConflictingAltSubsets(e2);
  return Qt.hasConflictingAltSet(n2) && !Qt.hasStateAssociatedWithOneAlt(e2);
}, hasConfigInRuleStopState: function(t2) {
  for (let e2 = 0; e2 < t2.items.length; e2++) if (t2.items[e2].state instanceof A) return !0;
  return !1;
}, allConfigsInRuleStopStates: function(t2) {
  for (let e2 = 0; e2 < t2.items.length; e2++) if (!(t2.items[e2].state instanceof A)) return !1;
  return !0;
}, resolvesToJustOneViableAlt: function(t2) {
  return Qt.getSingleViableAlt(t2);
}, allSubsetsConflict: function(t2) {
  return !Qt.hasNonConflictingAltSet(t2);
}, hasNonConflictingAltSet: function(t2) {
  for (let e2 = 0; e2 < t2.length; e2++) if (t2[e2].length === 1) return !0;
  return !1;
}, hasConflictingAltSet: function(t2) {
  for (let e2 = 0; e2 < t2.length; e2++) if (t2[e2].length > 1) return !0;
  return !1;
}, allSubsetsEqual: function(t2) {
  let e2 = null;
  for (let n2 = 0; n2 < t2.length; n2++) {
    const s2 = t2[n2];
    if (e2 === null) e2 = s2;
    else if (s2 !== e2) return !1;
  }
  return !0;
}, getUniqueAlt: function(t2) {
  const e2 = Qt.getAlts(t2);
  return e2.length === 1 ? e2.minValue() : $.INVALID_ALT_NUMBER;
}, getAlts: function(t2) {
  const e2 = new W();
  return t2.map(function(t3) {
    e2.or(t3);
  }), e2;
}, getConflictingAltSubsets: function(t2) {
  const e2 = new H();
  return e2.hashFunction = function(t3) {
    l.hashStuff(t3.state.stateNumber, t3.context);
  }, e2.equalsFunction = function(t3, e3) {
    return t3.state.stateNumber === e3.state.stateNumber && t3.context.equals(e3.context);
  }, t2.items.map(function(t3) {
    let n2 = e2.get(t3);
    n2 === null && (n2 = new W(), e2.set(t3, n2)), n2.set(t3.alt);
  }), e2.getValues();
}, getStateToAltMap: function(t2) {
  const e2 = new Zt();
  return t2.items.map(function(t3) {
    let n2 = e2.get(t3.state);
    n2 === null && (n2 = new W(), e2.set(t3.state, n2)), n2.set(t3.alt);
  }), e2;
}, hasStateAssociatedWithOneAlt: function(t2) {
  const e2 = Qt.getStateToAltMap(t2).values();
  for (let t3 = 0; t3 < e2.length; t3++) if (e2[t3].length === 1) return !0;
  return !1;
}, getSingleViableAlt: function(t2) {
  let e2 = null;
  for (let n2 = 0; n2 < t2.length; n2++) {
    const s2 = t2[n2].minValue();
    if (e2 === null) e2 = s2;
    else if (e2 !== s2) return $.INVALID_ALT_NUMBER;
  }
  return e2;
} }, te = Qt;
class ee extends Ft {
  constructor(t2, e2, n2, s2, i2, r2) {
    r2 = r2 || t2._ctx, s2 = s2 || t2.getCurrentToken(), n2 = n2 || t2.getCurrentToken(), e2 = e2 || t2.getInputStream(), super({ message: "", recognizer: t2, input: e2, ctx: r2 }), this.deadEndConfigs = i2, this.startToken = n2, this.offendingToken = s2;
  }
}
class ne {
  constructor(t2) {
    this.defaultMapCtor = t2 || H, this.cacheMap = new this.defaultMapCtor();
  }
  get(t2, e2) {
    const n2 = this.cacheMap.get(t2) || null;
    return n2 === null ? null : n2.get(e2) || null;
  }
  set(t2, e2, n2) {
    let s2 = this.cacheMap.get(t2) || null;
    s2 === null && (s2 = new this.defaultMapCtor(), this.cacheMap.set(t2, s2)), s2.set(e2, n2);
  }
}
class se extends Ht {
  constructor(t2, e2, n2, s2) {
    super(e2, s2), this.parser = t2, this.decisionToDFA = n2, this.predictionMode = te.LL, this._input = null, this._startIndex = 0, this._outerContext = null, this._dfa = null, this.mergeCache = null, this.debug = !1, this.debug_closure = !1, this.debug_add = !1, this.trace_atn_sim = !1, this.dfa_debug = !1, this.retry_debug = !1;
  }
  reset() {
  }
  adaptivePredict(t2, e2, n2) {
    (this.debug || this.trace_atn_sim) && console.log("adaptivePredict decision " + e2 + " exec LA(1)==" + this.getLookaheadName(t2) + " line " + t2.LT(1).line + ":" + t2.LT(1).column), this._input = t2, this._startIndex = t2.index, this._outerContext = n2;
    const s2 = this.decisionToDFA[e2];
    this._dfa = s2;
    const i2 = t2.mark(), r2 = t2.index;
    try {
      let e3;
      if (e3 = s2.precedenceDfa ? s2.getPrecedenceStartState(this.parser.getPrecedence()) : s2.s0, e3 === null) {
        n2 === null && (n2 = U.EMPTY), this.debug && console.log("predictATN decision " + s2.decision + " exec LA(1)==" + this.getLookaheadName(t2) + ", outerContext=" + n2.toString(this.parser.ruleNames));
        let r3 = this.computeStartState(s2.atnStartState, U.EMPTY, !1);
        s2.precedenceDfa ? (s2.s0.configs = r3, r3 = this.applyPrecedenceFilter(r3), e3 = this.addDFAState(s2, new qt(null, r3)), s2.setPrecedenceStartState(this.parser.getPrecedence(), e3)) : (e3 = this.addDFAState(s2, new qt(null, r3)), s2.s0 = e3);
      }
      const i3 = this.execATN(s2, e3, t2, r2, n2);
      return this.debug && console.log("DFA after predictATN: " + s2.toString(this.parser.literalNames, this.parser.symbolicNames)), i3;
    } finally {
      this._dfa = null, this.mergeCache = null, t2.seek(r2), t2.release(i2);
    }
  }
  execATN(t2, e2, n2, s2, r2) {
    let o2;
    (this.debug || this.trace_atn_sim) && console.log("execATN decision " + t2.decision + ", DFA state " + e2 + ", LA(1)==" + this.getLookaheadName(n2) + " line " + n2.LT(1).line + ":" + n2.LT(1).column);
    let a2 = e2;
    this.debug && console.log("s0 = " + e2);
    let l2 = n2.LA(1);
    for (; ; ) {
      let e3 = this.getExistingTargetState(a2, l2);
      if (e3 === null && (e3 = this.computeTargetState(t2, a2, l2)), e3 === Ht.ERROR) {
        const t3 = this.noViableAlt(n2, r2, a2.configs, s2);
        if (n2.seek(s2), o2 = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(a2.configs, r2), o2 !== $.INVALID_ALT_NUMBER) return o2;
        throw t3;
      }
      if (e3.requiresFullContext && this.predictionMode !== te.SLL) {
        let i2 = null;
        if (e3.predicates !== null) {
          this.debug && console.log("DFA state has preds in DFA sim LL failover");
          const t3 = n2.index;
          if (t3 !== s2 && n2.seek(s2), i2 = this.evalSemanticContext(e3.predicates, r2, !0), i2.length === 1) return this.debug && console.log("Full LL avoided"), i2.minValue();
          t3 !== s2 && n2.seek(t3);
        }
        this.dfa_debug && console.log("ctx sensitive state " + r2 + " in " + e3);
        const a3 = !0, l3 = this.computeStartState(t2.atnStartState, r2, a3);
        return this.reportAttemptingFullContext(t2, i2, e3.configs, s2, n2.index), o2 = this.execATNWithFullContext(t2, e3, l3, n2, s2, r2), o2;
      }
      if (e3.isAcceptState) {
        if (e3.predicates === null) return e3.prediction;
        const i2 = n2.index;
        n2.seek(s2);
        const o3 = this.evalSemanticContext(e3.predicates, r2, !0);
        if (o3.length === 0) throw this.noViableAlt(n2, r2, e3.configs, s2);
        return o3.length === 1 || this.reportAmbiguity(t2, e3, s2, i2, !1, o3, e3.configs), o3.minValue();
      }
      a2 = e3, l2 !== i.EOF && (n2.consume(), l2 = n2.LA(1));
    }
  }
  getExistingTargetState(t2, e2) {
    const n2 = t2.edges;
    return n2 === null ? null : n2[e2 + 1] || null;
  }
  computeTargetState(t2, e2, n2) {
    const s2 = this.computeReachSet(e2.configs, n2, !1);
    if (s2 === null) return this.addDFAEdge(t2, e2, n2, Ht.ERROR), Ht.ERROR;
    let i2 = new qt(null, s2);
    const r2 = this.getUniqueAlt(s2);
    if (this.debug) {
      const t3 = te.getConflictingAltSubsets(s2);
      console.log("SLL altSubSets=" + d(t3) + ", configs=" + s2 + ", predict=" + r2 + ", allSubsetsConflict=" + te.allSubsetsConflict(t3) + ", conflictingAlts=" + this.getConflictingAlts(s2));
    }
    return r2 !== $.INVALID_ALT_NUMBER ? (i2.isAcceptState = !0, i2.configs.uniqueAlt = r2, i2.prediction = r2) : te.hasSLLConflictTerminatingPrediction(this.predictionMode, s2) && (i2.configs.conflictingAlts = this.getConflictingAlts(s2), i2.requiresFullContext = !0, i2.isAcceptState = !0, i2.prediction = i2.configs.conflictingAlts.minValue()), i2.isAcceptState && i2.configs.hasSemanticContext && (this.predicateDFAState(i2, this.atn.getDecisionState(t2.decision)), i2.predicates !== null && (i2.prediction = $.INVALID_ALT_NUMBER)), i2 = this.addDFAEdge(t2, e2, n2, i2), i2;
  }
  predicateDFAState(t2, e2) {
    const n2 = e2.transitions.length, s2 = this.getConflictingAltsOrUniqueAlt(t2.configs), i2 = this.getPredsForAmbigAlts(s2, t2.configs, n2);
    i2 !== null ? (t2.predicates = this.getPredicatePredictions(s2, i2), t2.prediction = $.INVALID_ALT_NUMBER) : t2.prediction = s2.minValue();
  }
  execATNWithFullContext(t2, e2, n2, s2, r2, o2) {
    (this.debug || this.trace_atn_sim) && console.log("execATNWithFullContext " + n2);
    let a2, l2 = !1, h2 = n2;
    s2.seek(r2);
    let c2 = s2.LA(1), u2 = -1;
    for (; ; ) {
      if (a2 = this.computeReachSet(h2, c2, !0), a2 === null) {
        const t4 = this.noViableAlt(s2, o2, h2, r2);
        s2.seek(r2);
        const e3 = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(h2, o2);
        if (e3 !== $.INVALID_ALT_NUMBER) return e3;
        throw t4;
      }
      const t3 = te.getConflictingAltSubsets(a2);
      if (this.debug && console.log("LL altSubSets=" + t3 + ", predict=" + te.getUniqueAlt(t3) + ", resolvesToJustOneViableAlt=" + te.resolvesToJustOneViableAlt(t3)), a2.uniqueAlt = this.getUniqueAlt(a2), a2.uniqueAlt !== $.INVALID_ALT_NUMBER) {
        u2 = a2.uniqueAlt;
        break;
      }
      if (this.predictionMode !== te.LL_EXACT_AMBIG_DETECTION) {
        if (u2 = te.resolvesToJustOneViableAlt(t3), u2 !== $.INVALID_ALT_NUMBER) break;
      } else if (te.allSubsetsConflict(t3) && te.allSubsetsEqual(t3)) {
        l2 = !0, u2 = te.getSingleViableAlt(t3);
        break;
      }
      h2 = a2, c2 !== i.EOF && (s2.consume(), c2 = s2.LA(1));
    }
    return a2.uniqueAlt !== $.INVALID_ALT_NUMBER ? (this.reportContextSensitivity(t2, u2, a2, r2, s2.index), u2) : (this.reportAmbiguity(t2, e2, r2, s2.index, l2, null, a2), u2);
  }
  computeReachSet(t2, e2, n2) {
    this.debug && console.log("in computeReachSet, starting closure: " + t2), this.mergeCache === null && (this.mergeCache = new ne());
    const s2 = new Vt(n2);
    let r2 = null;
    for (let o3 = 0; o3 < t2.items.length; o3++) {
      const a2 = t2.items[o3];
      if (this.debug && console.log("testing " + this.getTokenName(e2) + " at " + a2), a2.state instanceof A) (n2 || e2 === i.EOF) && (r2 === null && (r2 = []), r2.push(a2), this.debug_add && console.log("added " + a2 + " to skippedStopStates"));
      else for (let t3 = 0; t3 < a2.state.transitions.length; t3++) {
        const n3 = a2.state.transitions[t3], i2 = this.getReachableTarget(n3, e2);
        if (i2 !== null) {
          const t4 = new m({ state: i2 }, a2);
          s2.add(t4, this.mergeCache), this.debug_add && console.log("added " + t4 + " to intermediate");
        }
      }
    }
    let o2 = null;
    if (r2 === null && e2 !== i.EOF && (s2.items.length === 1 || this.getUniqueAlt(s2) !== $.INVALID_ALT_NUMBER) && (o2 = s2), o2 === null) {
      o2 = new Vt(n2);
      const t3 = new g(), r3 = e2 === i.EOF;
      for (let e3 = 0; e3 < s2.items.length; e3++) this.closure(s2.items[e3], o2, t3, !1, n2, r3);
    }
    if (e2 === i.EOF && (o2 = this.removeAllConfigsNotInRuleStopState(o2, o2 === s2)), !(r2 === null || n2 && te.hasConfigInRuleStopState(o2))) for (let t3 = 0; t3 < r2.length; t3++) o2.add(r2[t3], this.mergeCache);
    return this.trace_atn_sim && console.log("computeReachSet " + t2 + " -> " + o2), o2.items.length === 0 ? null : o2;
  }
  removeAllConfigsNotInRuleStopState(t2, e2) {
    if (te.allConfigsInRuleStopStates(t2)) return t2;
    const n2 = new Vt(t2.fullCtx);
    for (let s2 = 0; s2 < t2.items.length; s2++) {
      const r2 = t2.items[s2];
      if (r2.state instanceof A) n2.add(r2, this.mergeCache);
      else if (e2 && r2.state.epsilonOnlyTransitions && this.atn.nextTokens(r2.state).contains(i.EPSILON)) {
        const t3 = this.atn.ruleToStopState[r2.state.ruleIndex];
        n2.add(new m({ state: t3 }, r2), this.mergeCache);
      }
    }
    return n2;
  }
  computeStartState(t2, e2, n2) {
    const s2 = K(this.atn, e2), i2 = new Vt(n2);
    this.trace_atn_sim && console.log("computeStartState from ATN state " + t2 + " initialContext=" + s2.toString(this.parser));
    for (let e3 = 0; e3 < t2.transitions.length; e3++) {
      const r2 = t2.transitions[e3].target, o2 = new m({ state: r2, alt: e3 + 1, context: s2 }, null), a2 = new g();
      this.closure(o2, i2, a2, !0, n2, !1);
    }
    return i2;
  }
  applyPrecedenceFilter(t2) {
    let e2;
    const n2 = [], s2 = new Vt(t2.fullCtx);
    for (let i2 = 0; i2 < t2.items.length; i2++) {
      if (e2 = t2.items[i2], e2.alt !== 1) continue;
      const r2 = e2.semanticContext.evalPrecedence(this.parser, this._outerContext);
      r2 !== null && (n2[e2.state.stateNumber] = e2.context, r2 !== e2.semanticContext ? s2.add(new m({ semanticContext: r2 }, e2), this.mergeCache) : s2.add(e2, this.mergeCache));
    }
    for (let i2 = 0; i2 < t2.items.length; i2++) if (e2 = t2.items[i2], e2.alt !== 1) {
      if (!e2.precedenceFilterSuppressed) {
        const t3 = n2[e2.state.stateNumber] || null;
        if (t3 !== null && t3.equals(e2.context)) continue;
      }
      s2.add(e2, this.mergeCache);
    }
    return s2;
  }
  getReachableTarget(t2, e2) {
    return t2.matches(e2, 0, this.atn.maxTokenType) ? t2.target : null;
  }
  getPredsForAmbigAlts(t2, e2, n2) {
    let s2 = [];
    for (let n3 = 0; n3 < e2.items.length; n3++) {
      const i3 = e2.items[n3];
      t2.get(i3.alt) && (s2[i3.alt] = p.orContext(s2[i3.alt] || null, i3.semanticContext));
    }
    let i2 = 0;
    for (let t3 = 1; t3 < n2 + 1; t3++) {
      const e3 = s2[t3] || null;
      e3 === null ? s2[t3] = p.NONE : e3 !== p.NONE && (i2 += 1);
    }
    return i2 === 0 && (s2 = null), this.debug && console.log("getPredsForAmbigAlts result " + d(s2)), s2;
  }
  getPredicatePredictions(t2, e2) {
    const n2 = [];
    let s2 = !1;
    for (let i2 = 1; i2 < e2.length; i2++) {
      const r2 = e2[i2];
      t2 !== null && t2.get(i2) && n2.push(new Jt(r2, i2)), r2 !== p.NONE && (s2 = !0);
    }
    return s2 ? n2 : null;
  }
  getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(t2, e2) {
    const n2 = this.splitAccordingToSemanticValidity(t2, e2), s2 = n2[0], i2 = n2[1];
    let r2 = this.getAltThatFinishedDecisionEntryRule(s2);
    return r2 !== $.INVALID_ALT_NUMBER || i2.items.length > 0 && (r2 = this.getAltThatFinishedDecisionEntryRule(i2), r2 !== $.INVALID_ALT_NUMBER) ? r2 : $.INVALID_ALT_NUMBER;
  }
  getAltThatFinishedDecisionEntryRule(t2) {
    const e2 = [];
    for (let n2 = 0; n2 < t2.items.length; n2++) {
      const s2 = t2.items[n2];
      (s2.reachesIntoOuterContext > 0 || s2.state instanceof A && s2.context.hasEmptyPath()) && e2.indexOf(s2.alt) < 0 && e2.push(s2.alt);
    }
    return e2.length === 0 ? $.INVALID_ALT_NUMBER : Math.min.apply(null, e2);
  }
  splitAccordingToSemanticValidity(t2, e2) {
    const n2 = new Vt(t2.fullCtx), s2 = new Vt(t2.fullCtx);
    for (let i2 = 0; i2 < t2.items.length; i2++) {
      const r2 = t2.items[i2];
      r2.semanticContext !== p.NONE ? r2.semanticContext.evaluate(this.parser, e2) ? n2.add(r2) : s2.add(r2) : n2.add(r2);
    }
    return [n2, s2];
  }
  evalSemanticContext(t2, e2, n2) {
    const s2 = new W();
    for (let i2 = 0; i2 < t2.length; i2++) {
      const r2 = t2[i2];
      if (r2.pred === p.NONE) {
        if (s2.set(r2.alt), !n2) break;
        continue;
      }
      const o2 = r2.pred.evaluate(this.parser, e2);
      if ((this.debug || this.dfa_debug) && console.log("eval pred " + r2 + "=" + o2), o2 && ((this.debug || this.dfa_debug) && console.log("PREDICT " + r2.alt), s2.set(r2.alt), !n2)) break;
    }
    return s2;
  }
  closure(t2, e2, n2, s2, i2, r2) {
    this.closureCheckingStopState(t2, e2, n2, s2, i2, 0, r2);
  }
  closureCheckingStopState(t2, e2, n2, s2, i2, r2, o2) {
    if ((this.trace_atn_sim || this.debug_closure) && console.log("closure(" + t2.toString(this.parser, !0) + ")"), t2.state instanceof A) {
      if (!t2.context.isEmpty()) {
        for (let a2 = 0; a2 < t2.context.length; a2++) {
          if (t2.context.getReturnState(a2) === B.EMPTY_RETURN_STATE) {
            if (i2) {
              e2.add(new m({ state: t2.state, context: B.EMPTY }, t2), this.mergeCache);
              continue;
            }
            this.debug && console.log("FALLING off rule " + this.getRuleName(t2.state.ruleIndex)), this.closure_(t2, e2, n2, s2, i2, r2, o2);
            continue;
          }
          const l2 = this.atn.states[t2.context.getReturnState(a2)], h2 = t2.context.getParent(a2), c2 = { state: l2, alt: t2.alt, context: h2, semanticContext: t2.semanticContext }, u2 = new m(c2, null);
          u2.reachesIntoOuterContext = t2.reachesIntoOuterContext, this.closureCheckingStopState(u2, e2, n2, s2, i2, r2 - 1, o2);
        }
        return;
      }
      if (i2) return void e2.add(t2, this.mergeCache);
      this.debug && console.log("FALLING off rule " + this.getRuleName(t2.state.ruleIndex));
    }
    this.closure_(t2, e2, n2, s2, i2, r2, o2);
  }
  closure_(t2, e2, n2, s2, i2, r2, o2) {
    const a2 = t2.state;
    a2.epsilonOnlyTransitions || e2.add(t2, this.mergeCache);
    for (let l2 = 0; l2 < a2.transitions.length; l2++) {
      if (l2 === 0 && this.canDropLoopEntryEdgeInLeftRecursiveRule(t2)) continue;
      const h2 = a2.transitions[l2], c2 = s2 && !(h2 instanceof ut), u2 = this.getEpsilonTarget(t2, h2, c2, r2 === 0, i2, o2);
      if (u2 !== null) {
        let s3 = r2;
        if (t2.state instanceof A) {
          if (this._dfa !== null && this._dfa.precedenceDfa && h2.outermostPrecedenceReturn === this._dfa.atnStartState.ruleIndex && (u2.precedenceFilterSuppressed = !0), u2.reachesIntoOuterContext += 1, n2.getOrAdd(u2) !== u2) continue;
          e2.dipsIntoOuterContext = !0, s3 -= 1, this.debug && console.log("dips into outer ctx: " + u2);
        } else {
          if (!h2.isEpsilon && n2.getOrAdd(u2) !== u2) continue;
          h2 instanceof k && s3 >= 0 && (s3 += 1);
        }
        this.closureCheckingStopState(u2, e2, n2, c2, i2, s3, o2);
      }
    }
  }
  canDropLoopEntryEdgeInLeftRecursiveRule(t2) {
    const e2 = t2.state;
    if (e2.stateType !== C.STAR_LOOP_ENTRY || e2.stateType !== C.STAR_LOOP_ENTRY || !e2.isPrecedenceDecision || t2.context.isEmpty() || t2.context.hasEmptyPath()) return !1;
    const n2 = t2.context.length;
    for (let s3 = 0; s3 < n2; s3++) if (this.atn.states[t2.context.getReturnState(s3)].ruleIndex !== e2.ruleIndex) return !1;
    const s2 = e2.transitions[0].target.endState.stateNumber, i2 = this.atn.states[s2];
    for (let s3 = 0; s3 < n2; s3++) {
      const n3 = t2.context.getReturnState(s3), r2 = this.atn.states[n3];
      if (r2.transitions.length !== 1 || !r2.transitions[0].isEpsilon) return !1;
      const o2 = r2.transitions[0].target;
      if (!(r2.stateType === C.BLOCK_END && o2 === e2 || r2 === i2 || o2 === i2 || o2.stateType === C.BLOCK_END && o2.transitions.length === 1 && o2.transitions[0].isEpsilon && o2.transitions[0].target === e2)) return !1;
    }
    return !0;
  }
  getRuleName(t2) {
    return this.parser !== null && t2 >= 0 ? this.parser.ruleNames[t2] : "<rule " + t2 + ">";
  }
  getEpsilonTarget(t2, e2, n2, s2, r2, o2) {
    switch (e2.serializationType) {
      case N.RULE:
        return this.ruleTransition(t2, e2);
      case N.PRECEDENCE:
        return this.precedenceTransition(t2, e2, n2, s2, r2);
      case N.PREDICATE:
        return this.predTransition(t2, e2, n2, s2, r2);
      case N.ACTION:
        return this.actionTransition(t2, e2);
      case N.EPSILON:
        return new m({ state: e2.target }, t2);
      case N.ATOM:
      case N.RANGE:
      case N.SET:
        return o2 && e2.matches(i.EOF, 0, 1) ? new m({ state: e2.target }, t2) : null;
      default:
        return null;
    }
  }
  actionTransition(t2, e2) {
    if (this.debug) {
      const t3 = e2.actionIndex === -1 ? 65535 : e2.actionIndex;
      console.log("ACTION edge " + e2.ruleIndex + ":" + t3);
    }
    return new m({ state: e2.target }, t2);
  }
  precedenceTransition(t2, e2, n2, s2, i2) {
    this.debug && (console.log("PRED (collectPredicates=" + n2 + ") " + e2.precedence + ">=_p, ctx dependent=true"), this.parser !== null && console.log("context surrounding pred is " + d(this.parser.getRuleInvocationStack())));
    let r2 = null;
    if (n2 && s2) if (i2) {
      const n3 = this._input.index;
      this._input.seek(this._startIndex);
      const s3 = e2.getPredicate().evaluate(this.parser, this._outerContext);
      this._input.seek(n3), s3 && (r2 = new m({ state: e2.target }, t2));
    } else {
      const n3 = p.andContext(t2.semanticContext, e2.getPredicate());
      r2 = new m({ state: e2.target, semanticContext: n3 }, t2);
    }
    else r2 = new m({ state: e2.target }, t2);
    return this.debug && console.log("config from pred transition=" + r2), r2;
  }
  predTransition(t2, e2, n2, s2, i2) {
    this.debug && (console.log("PRED (collectPredicates=" + n2 + ") " + e2.ruleIndex + ":" + e2.predIndex + ", ctx dependent=" + e2.isCtxDependent), this.parser !== null && console.log("context surrounding pred is " + d(this.parser.getRuleInvocationStack())));
    let r2 = null;
    if (n2 && (e2.isCtxDependent && s2 || !e2.isCtxDependent)) if (i2) {
      const n3 = this._input.index;
      this._input.seek(this._startIndex);
      const s3 = e2.getPredicate().evaluate(this.parser, this._outerContext);
      this._input.seek(n3), s3 && (r2 = new m({ state: e2.target }, t2));
    } else {
      const n3 = p.andContext(t2.semanticContext, e2.getPredicate());
      r2 = new m({ state: e2.target, semanticContext: n3 }, t2);
    }
    else r2 = new m({ state: e2.target }, t2);
    return this.debug && console.log("config from pred transition=" + r2), r2;
  }
  ruleTransition(t2, e2) {
    this.debug && console.log("CALL rule " + this.getRuleName(e2.target.ruleIndex) + ", ctx=" + t2.context);
    const n2 = e2.followState, s2 = V.create(t2.context, n2.stateNumber);
    return new m({ state: e2.target, context: s2 }, t2);
  }
  getConflictingAlts(t2) {
    const e2 = te.getConflictingAltSubsets(t2);
    return te.getAlts(e2);
  }
  getConflictingAltsOrUniqueAlt(t2) {
    let e2 = null;
    return t2.uniqueAlt !== $.INVALID_ALT_NUMBER ? (e2 = new W(), e2.set(t2.uniqueAlt)) : e2 = t2.conflictingAlts, e2;
  }
  getTokenName(t2) {
    if (t2 === i.EOF) return "EOF";
    if (this.parser !== null && this.parser.literalNames !== null) {
      if (!(t2 >= this.parser.literalNames.length && t2 >= this.parser.symbolicNames.length)) return (this.parser.literalNames[t2] || this.parser.symbolicNames[t2]) + "<" + t2 + ">";
      console.log(t2 + " ttype out of range: " + this.parser.literalNames), console.log("" + this.parser.getInputStream().getTokens());
    }
    return "" + t2;
  }
  getLookaheadName(t2) {
    return this.getTokenName(t2.LA(1));
  }
  dumpDeadEndConfigs(t2) {
    console.log("dead end configs: ");
    const e2 = t2.getDeadEndConfigs();
    for (let t3 = 0; t3 < e2.length; t3++) {
      const n2 = e2[t3];
      let s2 = "no edges";
      if (n2.state.transitions.length > 0) {
        const t4 = n2.state.transitions[0];
        t4 instanceof ht ? s2 = "Atom " + this.getTokenName(t4.label) : t4 instanceof I && (s2 = (t4 instanceof y ? "~" : "") + "Set " + t4.set);
      }
      console.error(n2.toString(this.parser, !0) + ":" + s2);
    }
  }
  noViableAlt(t2, e2, n2, s2) {
    return new ee(this.parser, t2, t2.get(s2), t2.LT(1), n2, e2);
  }
  getUniqueAlt(t2) {
    let e2 = $.INVALID_ALT_NUMBER;
    for (let n2 = 0; n2 < t2.items.length; n2++) {
      const s2 = t2.items[n2];
      if (e2 === $.INVALID_ALT_NUMBER) e2 = s2.alt;
      else if (s2.alt !== e2) return $.INVALID_ALT_NUMBER;
    }
    return e2;
  }
  addDFAEdge(t2, e2, n2, s2) {
    if (this.debug && console.log("EDGE " + e2 + " -> " + s2 + " upon " + this.getTokenName(n2)), s2 === null) return null;
    if (s2 = this.addDFAState(t2, s2), e2 === null || n2 < -1 || n2 > this.atn.maxTokenType) return s2;
    if (e2.edges === null && (e2.edges = []), e2.edges[n2 + 1] = s2, this.debug) {
      const e3 = this.parser === null ? null : this.parser.literalNames, n3 = this.parser === null ? null : this.parser.symbolicNames;
      console.log(`DFA=
` + t2.toString(e3, n3));
    }
    return s2;
  }
  addDFAState(t2, e2) {
    if (e2 === Ht.ERROR) return e2;
    const n2 = t2.states.get(e2);
    return n2 !== null ? (this.trace_atn_sim && console.log("addDFAState " + e2 + " exists"), n2) : (e2.stateNumber = t2.states.length, e2.configs.readOnly || (e2.configs.optimizeConfigs(this), e2.configs.setReadonly(!0)), this.trace_atn_sim && console.log("addDFAState new " + e2), t2.states.add(e2), this.debug && console.log("adding new DFA state: " + e2), e2);
  }
  reportAttemptingFullContext(t2, e2, n2, s2, i2) {
    if (this.debug || this.retry_debug) {
      const e3 = new E(s2, i2 + 1);
      console.log("reportAttemptingFullContext decision=" + t2.decision + ":" + n2 + ", input=" + this.parser.getTokenStream().getText(e3));
    }
    this.parser !== null && this.parser.getErrorListener().reportAttemptingFullContext(this.parser, t2, s2, i2, e2, n2);
  }
  reportContextSensitivity(t2, e2, n2, s2, i2) {
    if (this.debug || this.retry_debug) {
      const e3 = new E(s2, i2 + 1);
      console.log("reportContextSensitivity decision=" + t2.decision + ":" + n2 + ", input=" + this.parser.getTokenStream().getText(e3));
    }
    this.parser !== null && this.parser.getErrorListener().reportContextSensitivity(this.parser, t2, s2, i2, e2, n2);
  }
  reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
    if (this.debug || this.retry_debug) {
      const t3 = new E(n2, s2 + 1);
      console.log("reportAmbiguity " + r2 + ":" + o2 + ", input=" + this.parser.getTokenStream().getText(t3));
    }
    this.parser !== null && this.parser.getErrorListener().reportAmbiguity(this.parser, t2, n2, s2, i2, r2, o2);
  }
}
class ie {
  constructor() {
    this.cache = new H();
  }
  add(t2) {
    if (t2 === B.EMPTY) return B.EMPTY;
    const e2 = this.cache.get(t2) || null;
    return e2 !== null ? e2 : (this.cache.set(t2, t2), t2);
  }
  get(t2) {
    return this.cache.get(t2) || null;
  }
  get length() {
    return this.cache.length;
  }
}
const re = { ATN: $, ATNDeserializer: Lt, LexerATNSimulator: Xt, ParserATNSimulator: se, PredictionMode: te, PredictionContextCache: ie };
class oe {
  constructor(t2, e2, n2) {
    this.dfa = t2, this.literalNames = e2 || [], this.symbolicNames = n2 || [];
  }
  toString() {
    if (this.dfa.s0 === null) return null;
    let t2 = "";
    const e2 = this.dfa.sortedStates();
    for (let n2 = 0; n2 < e2.length; n2++) {
      const s2 = e2[n2];
      if (s2.edges !== null) {
        const e3 = s2.edges.length;
        for (let n3 = 0; n3 < e3; n3++) {
          const e4 = s2.edges[n3] || null;
          e4 !== null && e4.stateNumber !== 2147483647 && (t2 = t2.concat(this.getStateString(s2)), t2 = t2.concat("-"), t2 = t2.concat(this.getEdgeLabel(n3)), t2 = t2.concat("->"), t2 = t2.concat(this.getStateString(e4)), t2 = t2.concat(`
`));
        }
      }
    }
    return t2.length === 0 ? null : t2;
  }
  getEdgeLabel(t2) {
    return t2 === 0 ? "EOF" : this.literalNames !== null || this.symbolicNames !== null ? this.literalNames[t2 - 1] || this.symbolicNames[t2 - 1] : String.fromCharCode(t2 - 1);
  }
  getStateString(t2) {
    const e2 = (t2.isAcceptState ? ":" : "") + "s" + t2.stateNumber + (t2.requiresFullContext ? "^" : "");
    return t2.isAcceptState ? t2.predicates !== null ? e2 + "=>" + d(t2.predicates) : e2 + "=>" + t2.prediction.toString() : e2;
  }
}
class ae extends oe {
  constructor(t2) {
    super(t2, null);
  }
  getEdgeLabel(t2) {
    return "'" + String.fromCharCode(t2) + "'";
  }
}
class le {
  constructor(t2, e2) {
    if (e2 === void 0 && (e2 = 0), this.atnStartState = t2, this.decision = e2, this._states = new g(), this.s0 = null, this.precedenceDfa = !1, t2 instanceof rt && t2.isPrecedenceDecision) {
      this.precedenceDfa = !0;
      const t3 = new qt(null, new Vt());
      t3.edges = [], t3.isAcceptState = !1, t3.requiresFullContext = !1, this.s0 = t3;
    }
  }
  getPrecedenceStartState(t2) {
    if (!this.precedenceDfa) throw "Only precedence DFAs may contain a precedence start state.";
    return t2 < 0 || t2 >= this.s0.edges.length ? null : this.s0.edges[t2] || null;
  }
  setPrecedenceStartState(t2, e2) {
    if (!this.precedenceDfa) throw "Only precedence DFAs may contain a precedence start state.";
    t2 < 0 || (this.s0.edges[t2] = e2);
  }
  setPrecedenceDfa(t2) {
    if (this.precedenceDfa !== t2) {
      if (this._states = new g(), t2) {
        const t3 = new qt(null, new Vt());
        t3.edges = [], t3.isAcceptState = !1, t3.requiresFullContext = !1, this.s0 = t3;
      } else this.s0 = null;
      this.precedenceDfa = t2;
    }
  }
  sortedStates() {
    return this._states.values().sort(function(t2, e2) {
      return t2.stateNumber - e2.stateNumber;
    });
  }
  toString(t2, e2) {
    return t2 = t2 || null, e2 = e2 || null, this.s0 === null ? "" : new oe(this, t2, e2).toString();
  }
  toLexerString() {
    return this.s0 === null ? "" : new ae(this).toString();
  }
  get states() {
    return this._states;
  }
}
const he = { DFA: le, DFASerializer: oe, LexerDFASerializer: ae, PredPrediction: Jt }, ce = { PredictionContext: B }, ue = { Interval: E, IntervalSet: _ };
class de {
  visitTerminal(t2) {
  }
  visitErrorNode(t2) {
  }
  enterEveryRule(t2) {
  }
  exitEveryRule(t2) {
  }
}
class ge {
  visit(t2) {
    return Array.isArray(t2) ? t2.map(function(t3) {
      return t3.accept(this);
    }, this) : t2.accept(this);
  }
  visitChildren(t2) {
    return t2.children ? this.visit(t2.children) : null;
  }
  visitTerminal(t2) {
  }
  visitErrorNode(t2) {
  }
}
class pe {
  walk(t2, e2) {
    if (e2 instanceof D || e2.isErrorNode !== void 0 && e2.isErrorNode()) t2.visitErrorNode(e2);
    else if (e2 instanceof b) t2.visitTerminal(e2);
    else {
      this.enterRule(t2, e2);
      for (let n2 = 0; n2 < e2.getChildCount(); n2++) {
        const s2 = e2.getChild(n2);
        this.walk(t2, s2);
      }
      this.exitRule(t2, e2);
    }
  }
  enterRule(t2, e2) {
    const n2 = e2.ruleContext;
    t2.enterEveryRule(n2), n2.enterRule(t2);
  }
  exitRule(t2, e2) {
    const n2 = e2.ruleContext;
    n2.exitRule(t2), t2.exitEveryRule(n2);
  }
}
pe.DEFAULT = new pe();
const fe = { Trees: M, RuleNode: P, ErrorNode: D, TerminalNode: b, ParseTreeListener: de, ParseTreeVisitor: ge, ParseTreeWalker: pe };
class xe extends Ft {
  constructor(t2) {
    super({ message: "", recognizer: t2, input: t2.getInputStream(), ctx: t2._ctx }), this.offendingToken = t2.getCurrentToken();
  }
}
class Te extends Ft {
  constructor(t2, e2, n2) {
    super({ message: Se(e2, n2 || null), recognizer: t2, input: t2.getInputStream(), ctx: t2._ctx });
    const s2 = t2._interp.atn.states[t2.state].transitions[0];
    s2 instanceof pt ? (this.ruleIndex = s2.ruleIndex, this.predicateIndex = s2.predIndex) : (this.ruleIndex = 0, this.predicateIndex = 0), this.predicate = e2, this.offendingToken = t2.getCurrentToken();
  }
}
function Se(t2, e2) {
  return e2 !== null ? e2 : "failed predicate: {" + t2 + "}?";
}
class me extends Ot {
  constructor(t2) {
    super(), t2 = t2 || !0, this.exactOnly = t2;
  }
  reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
    if (this.exactOnly && !i2) return;
    const a2 = "reportAmbiguity d=" + this.getDecisionDescription(t2, e2) + ": ambigAlts=" + this.getConflictingAlts(r2, o2) + ", input='" + t2.getTokenStream().getText(new E(n2, s2)) + "'";
    t2.notifyErrorListeners(a2);
  }
  reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
    const o2 = "reportAttemptingFullContext d=" + this.getDecisionDescription(t2, e2) + ", input='" + t2.getTokenStream().getText(new E(n2, s2)) + "'";
    t2.notifyErrorListeners(o2);
  }
  reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
    const o2 = "reportContextSensitivity d=" + this.getDecisionDescription(t2, e2) + ", input='" + t2.getTokenStream().getText(new E(n2, s2)) + "'";
    t2.notifyErrorListeners(o2);
  }
  getDecisionDescription(t2, e2) {
    const n2 = e2.decision, s2 = e2.atnStartState.ruleIndex, i2 = t2.ruleNames;
    if (s2 < 0 || s2 >= i2.length) return "" + n2;
    const r2 = i2[s2] || null;
    return r2 === null || r2.length === 0 ? "" + n2 : `${n2} (${r2})`;
  }
  getConflictingAlts(t2, e2) {
    if (t2 !== null) return t2;
    const n2 = new W();
    for (let t3 = 0; t3 < e2.items.length; t3++) n2.set(e2.items[t3].alt);
    return `{${n2.values().join(", ")}}`;
  }
}
class Ee extends Error {
  constructor() {
    super(), Error.captureStackTrace(this, Ee);
  }
}
class _e {
  reset(t2) {
  }
  recoverInline(t2) {
  }
  recover(t2, e2) {
  }
  sync(t2) {
  }
  inErrorRecoveryMode(t2) {
  }
  reportError(t2) {
  }
}
class Ce extends _e {
  constructor() {
    super(), this.errorRecoveryMode = !1, this.lastErrorIndex = -1, this.lastErrorStates = null, this.nextTokensContext = null, this.nextTokenState = 0;
  }
  reset(t2) {
    this.endErrorCondition(t2);
  }
  beginErrorCondition(t2) {
    this.errorRecoveryMode = !0;
  }
  inErrorRecoveryMode(t2) {
    return this.errorRecoveryMode;
  }
  endErrorCondition(t2) {
    this.errorRecoveryMode = !1, this.lastErrorStates = null, this.lastErrorIndex = -1;
  }
  reportMatch(t2) {
    this.endErrorCondition(t2);
  }
  reportError(t2, e2) {
    this.inErrorRecoveryMode(t2) || (this.beginErrorCondition(t2), e2 instanceof ee ? this.reportNoViableAlternative(t2, e2) : e2 instanceof xe ? this.reportInputMismatch(t2, e2) : e2 instanceof Te ? this.reportFailedPredicate(t2, e2) : (console.log("unknown recognition error type: " + e2.constructor.name), console.log(e2.stack), t2.notifyErrorListeners(e2.getOffendingToken(), e2.getMessage(), e2)));
  }
  recover(t2, e2) {
    this.lastErrorIndex === t2.getInputStream().index && this.lastErrorStates !== null && this.lastErrorStates.indexOf(t2.state) >= 0 && t2.consume(), this.lastErrorIndex = t2._input.index, this.lastErrorStates === null && (this.lastErrorStates = []), this.lastErrorStates.push(t2.state);
    const n2 = this.getErrorRecoverySet(t2);
    this.consumeUntil(t2, n2);
  }
  sync(t2) {
    if (this.inErrorRecoveryMode(t2)) return;
    const e2 = t2._interp.atn.states[t2.state], n2 = t2.getTokenStream().LA(1), s2 = t2.atn.nextTokens(e2);
    if (s2.contains(n2)) return this.nextTokensContext = null, void (this.nextTokenState = C.INVALID_STATE_NUMBER);
    if (s2.contains(i.EPSILON)) this.nextTokensContext === null && (this.nextTokensContext = t2._ctx, this.nextTokensState = t2._stateNumber);
    else switch (e2.stateType) {
      case C.BLOCK_START:
      case C.STAR_BLOCK_START:
      case C.PLUS_BLOCK_START:
      case C.STAR_LOOP_ENTRY:
        if (this.singleTokenDeletion(t2) !== null) return;
        throw new xe(t2);
      case C.PLUS_LOOP_BACK:
      case C.STAR_LOOP_BACK: {
        this.reportUnwantedToken(t2);
        const e3 = new _();
        e3.addSet(t2.getExpectedTokens());
        const n3 = e3.addSet(this.getErrorRecoverySet(t2));
        this.consumeUntil(t2, n3);
      }
    }
  }
  reportNoViableAlternative(t2, e2) {
    const n2 = t2.getTokenStream();
    let s2;
    s2 = n2 !== null ? e2.startToken.type === i.EOF ? "<EOF>" : n2.getText(new E(e2.startToken.tokenIndex, e2.offendingToken.tokenIndex)) : "<unknown input>";
    const r2 = "no viable alternative at input " + this.escapeWSAndQuote(s2);
    t2.notifyErrorListeners(r2, e2.offendingToken, e2);
  }
  reportInputMismatch(t2, e2) {
    const n2 = "mismatched input " + this.getTokenErrorDisplay(e2.offendingToken) + " expecting " + e2.getExpectedTokens().toString(t2.literalNames, t2.symbolicNames);
    t2.notifyErrorListeners(n2, e2.offendingToken, e2);
  }
  reportFailedPredicate(t2, e2) {
    const n2 = "rule " + t2.ruleNames[t2._ctx.ruleIndex] + " " + e2.message;
    t2.notifyErrorListeners(n2, e2.offendingToken, e2);
  }
  reportUnwantedToken(t2) {
    if (this.inErrorRecoveryMode(t2)) return;
    this.beginErrorCondition(t2);
    const e2 = t2.getCurrentToken(), n2 = "extraneous input " + this.getTokenErrorDisplay(e2) + " expecting " + this.getExpectedTokens(t2).toString(t2.literalNames, t2.symbolicNames);
    t2.notifyErrorListeners(n2, e2, null);
  }
  reportMissingToken(t2) {
    if (this.inErrorRecoveryMode(t2)) return;
    this.beginErrorCondition(t2);
    const e2 = t2.getCurrentToken(), n2 = "missing " + this.getExpectedTokens(t2).toString(t2.literalNames, t2.symbolicNames) + " at " + this.getTokenErrorDisplay(e2);
    t2.notifyErrorListeners(n2, e2, null);
  }
  recoverInline(t2) {
    const e2 = this.singleTokenDeletion(t2);
    if (e2 !== null) return t2.consume(), e2;
    if (this.singleTokenInsertion(t2)) return this.getMissingSymbol(t2);
    throw new xe(t2);
  }
  singleTokenInsertion(t2) {
    const e2 = t2.getTokenStream().LA(1), n2 = t2._interp.atn, s2 = n2.states[t2.state].transitions[0].target;
    return !!n2.nextTokens(s2, t2._ctx).contains(e2) && (this.reportMissingToken(t2), !0);
  }
  singleTokenDeletion(t2) {
    const e2 = t2.getTokenStream().LA(2);
    if (this.getExpectedTokens(t2).contains(e2)) {
      this.reportUnwantedToken(t2), t2.consume();
      const e3 = t2.getCurrentToken();
      return this.reportMatch(t2), e3;
    }
    return null;
  }
  getMissingSymbol(t2) {
    const e2 = t2.getCurrentToken(), n2 = this.getExpectedTokens(t2).first();
    let s2;
    s2 = n2 === i.EOF ? "<missing EOF>" : "<missing " + t2.literalNames[n2] + ">";
    let r2 = e2;
    const o2 = t2.getTokenStream().LT(-1);
    return r2.type === i.EOF && o2 !== null && (r2 = o2), t2.getTokenFactory().create(r2.source, n2, s2, i.DEFAULT_CHANNEL, -1, -1, r2.line, r2.column);
  }
  getExpectedTokens(t2) {
    return t2.getExpectedTokens();
  }
  getTokenErrorDisplay(t2) {
    if (t2 === null) return "<no token>";
    let e2 = t2.text;
    return e2 === null && (e2 = t2.type === i.EOF ? "<EOF>" : "<" + t2.type + ">"), this.escapeWSAndQuote(e2);
  }
  escapeWSAndQuote(t2) {
    return "'" + (t2 = (t2 = (t2 = t2.replace(/\n/g, "\\n")).replace(/\r/g, "\\r")).replace(/\t/g, "\\t")) + "'";
  }
  getErrorRecoverySet(t2) {
    const e2 = t2._interp.atn;
    let n2 = t2._ctx;
    const s2 = new _();
    for (; n2 !== null && n2.invokingState >= 0; ) {
      const t3 = e2.states[n2.invokingState].transitions[0], i2 = e2.nextTokens(t3.followState);
      s2.addSet(i2), n2 = n2.parentCtx;
    }
    return s2.removeOne(i.EPSILON), s2;
  }
  consumeUntil(t2, e2) {
    let n2 = t2.getTokenStream().LA(1);
    for (; n2 !== i.EOF && !e2.contains(n2); ) t2.consume(), n2 = t2.getTokenStream().LA(1);
  }
}
class Ae extends Ce {
  constructor() {
    super();
  }
  recover(t2, e2) {
    let n2 = t2._ctx;
    for (; n2 !== null; ) n2.exception = e2, n2 = n2.parentCtx;
    throw new Ee(e2);
  }
  recoverInline(t2) {
    this.recover(t2, new xe(t2));
  }
  sync(t2) {
  }
}
const Ne = { RecognitionException: Ft, NoViableAltException: ee, LexerNoViableAltException: Mt, InputMismatchException: xe, FailedPredicateException: Te, DiagnosticErrorListener: me, BailErrorStrategy: Ae, DefaultErrorStrategy: Ce, ErrorListener: Ot };
class ke {
  constructor(t2, e2) {
    if (this.name = "<empty>", this.strdata = t2, this.decodeToUnicodeCodePoints = e2 || !1, this._index = 0, this.data = [], this.decodeToUnicodeCodePoints) for (let t3 = 0; t3 < this.strdata.length; ) {
      const e3 = this.strdata.codePointAt(t3);
      this.data.push(e3), t3 += e3 <= 65535 ? 1 : 2;
    }
    else {
      this.data = new Array(this.strdata.length);
      for (let t3 = 0; t3 < this.strdata.length; t3++) this.data[t3] = this.strdata.charCodeAt(t3);
    }
    this._size = this.data.length;
  }
  reset() {
    this._index = 0;
  }
  consume() {
    if (this._index >= this._size) throw "cannot consume EOF";
    this._index += 1;
  }
  LA(t2) {
    if (t2 === 0) return 0;
    t2 < 0 && (t2 += 1);
    const e2 = this._index + t2 - 1;
    return e2 < 0 || e2 >= this._size ? i.EOF : this.data[e2];
  }
  LT(t2) {
    return this.LA(t2);
  }
  mark() {
    return -1;
  }
  release(t2) {
  }
  seek(t2) {
    t2 <= this._index ? this._index = t2 : this._index = Math.min(t2, this._size);
  }
  getText(t2, e2) {
    if (e2 >= this._size && (e2 = this._size - 1), t2 >= this._size) return "";
    if (this.decodeToUnicodeCodePoints) {
      let n2 = "";
      for (let s2 = t2; s2 <= e2; s2++) n2 += String.fromCodePoint(this.data[s2]);
      return n2;
    }
    return this.strdata.slice(t2, e2 + 1);
  }
  toString() {
    return this.strdata;
  }
  get index() {
    return this._index;
  }
  get size() {
    return this._size;
  }
}
class Ie extends ke {
  constructor(t2, e2) {
    super(t2, e2);
  }
}
var ye = n(763);
const Le = typeof process < "u" && process.versions != null && process.versions.node != null;
class Oe extends Ie {
  static fromPath(t2, e2, n2) {
    if (!Le) throw new Error("FileStream is only available when running in Node!");
    ye.readFile(t2, e2, function(t3, e3) {
      let s2 = null;
      e3 !== null && (s2 = new ke(e3, !0)), n2(t3, s2);
    });
  }
  constructor(t2, e2, n2) {
    if (!Le) throw new Error("FileStream is only available when running in Node!");
    super(ye.readFileSync(t2, e2 || "utf-8"), n2), this.fileName = t2;
  }
}
const Re = { fromString: function(t2) {
  return new ke(t2, !0);
}, fromBlob: function(t2, e2, n2, s2) {
  const i2 = new window.FileReader();
  i2.onload = function(t3) {
    const e3 = new ke(t3.target.result, !0);
    n2(e3);
  }, i2.onerror = s2, i2.readAsText(t2, e2);
}, fromBuffer: function(t2, e2) {
  return new ke(t2.toString(e2), !0);
}, fromPath: function(t2, e2, n2) {
  Oe.fromPath(t2, e2, n2);
}, fromPathSync: function(t2, e2) {
  return new Oe(t2, e2);
} }, we = { arrayToString: d, stringToCharArray: function(t2) {
  let e2 = new Uint16Array(t2.length);
  for (let n2 = 0; n2 < t2.length; n2++) e2[n2] = t2.charCodeAt(n2);
  return e2;
} };
class ve {
}
class Pe extends ve {
  constructor(t2) {
    super(), this.tokenSource = t2, this.tokens = [], this.index = -1, this.fetchedEOF = !1;
  }
  mark() {
    return 0;
  }
  release(t2) {
  }
  reset() {
    this.seek(0);
  }
  seek(t2) {
    this.lazyInit(), this.index = this.adjustSeekIndex(t2);
  }
  get size() {
    return this.tokens.length;
  }
  get(t2) {
    return this.lazyInit(), this.tokens[t2];
  }
  consume() {
    let t2 = !1;
    if (t2 = this.index >= 0 && (this.fetchedEOF ? this.index < this.tokens.length - 1 : this.index < this.tokens.length), !t2 && this.LA(1) === i.EOF) throw "cannot consume EOF";
    this.sync(this.index + 1) && (this.index = this.adjustSeekIndex(this.index + 1));
  }
  sync(t2) {
    const e2 = t2 - this.tokens.length + 1;
    return !(e2 > 0) || this.fetch(e2) >= e2;
  }
  fetch(t2) {
    if (this.fetchedEOF) return 0;
    for (let e2 = 0; e2 < t2; e2++) {
      const t3 = this.tokenSource.nextToken();
      if (t3.tokenIndex = this.tokens.length, this.tokens.push(t3), t3.type === i.EOF) return this.fetchedEOF = !0, e2 + 1;
    }
    return t2;
  }
  getTokens(t2, e2, n2) {
    if (n2 === void 0 && (n2 = null), t2 < 0 || e2 < 0) return null;
    this.lazyInit();
    const s2 = [];
    e2 >= this.tokens.length && (e2 = this.tokens.length - 1);
    for (let r2 = t2; r2 < e2; r2++) {
      const t3 = this.tokens[r2];
      if (t3.type === i.EOF) break;
      (n2 === null || n2.contains(t3.type)) && s2.push(t3);
    }
    return s2;
  }
  LA(t2) {
    return this.LT(t2).type;
  }
  LB(t2) {
    return this.index - t2 < 0 ? null : this.tokens[this.index - t2];
  }
  LT(t2) {
    if (this.lazyInit(), t2 === 0) return null;
    if (t2 < 0) return this.LB(-t2);
    const e2 = this.index + t2 - 1;
    return this.sync(e2), e2 >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[e2];
  }
  adjustSeekIndex(t2) {
    return t2;
  }
  lazyInit() {
    this.index === -1 && this.setup();
  }
  setup() {
    this.sync(0), this.index = this.adjustSeekIndex(0);
  }
  setTokenSource(t2) {
    this.tokenSource = t2, this.tokens = [], this.index = -1, this.fetchedEOF = !1;
  }
  nextTokenOnChannel(t2, e2) {
    if (this.sync(t2), t2 >= this.tokens.length) return -1;
    let n2 = this.tokens[t2];
    for (; n2.channel !== e2; ) {
      if (n2.type === i.EOF) return -1;
      t2 += 1, this.sync(t2), n2 = this.tokens[t2];
    }
    return t2;
  }
  previousTokenOnChannel(t2, e2) {
    for (; t2 >= 0 && this.tokens[t2].channel !== e2; ) t2 -= 1;
    return t2;
  }
  getHiddenTokensToRight(t2, e2) {
    if (e2 === void 0 && (e2 = -1), this.lazyInit(), t2 < 0 || t2 >= this.tokens.length) throw t2 + " not in 0.." + this.tokens.length - 1;
    const n2 = this.nextTokenOnChannel(t2 + 1, Ut.DEFAULT_TOKEN_CHANNEL), s2 = t2 + 1, i2 = n2 === -1 ? this.tokens.length - 1 : n2;
    return this.filterForChannel(s2, i2, e2);
  }
  getHiddenTokensToLeft(t2, e2) {
    if (e2 === void 0 && (e2 = -1), this.lazyInit(), t2 < 0 || t2 >= this.tokens.length) throw t2 + " not in 0.." + this.tokens.length - 1;
    const n2 = this.previousTokenOnChannel(t2 - 1, Ut.DEFAULT_TOKEN_CHANNEL);
    if (n2 === t2 - 1) return null;
    const s2 = n2 + 1, i2 = t2 - 1;
    return this.filterForChannel(s2, i2, e2);
  }
  filterForChannel(t2, e2, n2) {
    const s2 = [];
    for (let i2 = t2; i2 < e2 + 1; i2++) {
      const t3 = this.tokens[i2];
      n2 === -1 ? t3.channel !== Ut.DEFAULT_TOKEN_CHANNEL && s2.push(t3) : t3.channel === n2 && s2.push(t3);
    }
    return s2.length === 0 ? null : s2;
  }
  getSourceName() {
    return this.tokenSource.getSourceName();
  }
  getText(t2) {
    this.lazyInit(), this.fill(), t2 || (t2 = new E(0, this.tokens.length - 1));
    let e2 = t2.start;
    e2 instanceof i && (e2 = e2.tokenIndex);
    let n2 = t2.stop;
    if (n2 instanceof i && (n2 = n2.tokenIndex), e2 === null || n2 === null || e2 < 0 || n2 < 0) return "";
    n2 >= this.tokens.length && (n2 = this.tokens.length - 1);
    let s2 = "";
    for (let t3 = e2; t3 < n2 + 1; t3++) {
      const e3 = this.tokens[t3];
      if (e3.type === i.EOF) break;
      s2 += e3.text;
    }
    return s2;
  }
  fill() {
    for (this.lazyInit(); this.fetch(1e3) === 1e3; ) ;
  }
}
Object.defineProperty(Pe, "size", { get: function() {
  return this.tokens.length;
} });
class be extends Pe {
  constructor(t2, e2) {
    super(t2), this.channel = e2 === void 0 ? i.DEFAULT_CHANNEL : e2;
  }
  adjustSeekIndex(t2) {
    return this.nextTokenOnChannel(t2, this.channel);
  }
  LB(t2) {
    if (t2 === 0 || this.index - t2 < 0) return null;
    let e2 = this.index, n2 = 1;
    for (; n2 <= t2; ) e2 = this.previousTokenOnChannel(e2 - 1, this.channel), n2 += 1;
    return e2 < 0 ? null : this.tokens[e2];
  }
  LT(t2) {
    if (this.lazyInit(), t2 === 0) return null;
    if (t2 < 0) return this.LB(-t2);
    let e2 = this.index, n2 = 1;
    for (; n2 < t2; ) this.sync(e2 + 1) && (e2 = this.nextTokenOnChannel(e2 + 1, this.channel)), n2 += 1;
    return this.tokens[e2];
  }
  getNumberOfOnChannelTokens() {
    let t2 = 0;
    this.fill();
    for (let e2 = 0; e2 < this.tokens.length; e2++) {
      const n2 = this.tokens[e2];
      if (n2.channel === this.channel && (t2 += 1), n2.type === i.EOF) break;
    }
    return t2;
  }
}
class De extends de {
  constructor(t2) {
    super(), this.parser = t2;
  }
  enterEveryRule(t2) {
    console.log("enter   " + this.parser.ruleNames[t2.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
  }
  visitTerminal(t2) {
    console.log("consume " + t2.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
  }
  exitEveryRule(t2) {
    console.log("exit    " + this.parser.ruleNames[t2.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
  }
}
class Fe extends vt {
  constructor(t2) {
    super(), this._input = null, this._errHandler = new Ce(), this._precedenceStack = [], this._precedenceStack.push(0), this._ctx = null, this.buildParseTrees = !0, this._tracer = null, this._parseListeners = null, this._syntaxErrors = 0, this.setInputStream(t2);
  }
  reset() {
    this._input !== null && this._input.seek(0), this._errHandler.reset(this), this._ctx = null, this._syntaxErrors = 0, this.setTrace(!1), this._precedenceStack = [], this._precedenceStack.push(0), this._interp !== null && this._interp.reset();
  }
  match(t2) {
    let e2 = this.getCurrentToken();
    return e2.type === t2 ? (this._errHandler.reportMatch(this), this.consume()) : (e2 = this._errHandler.recoverInline(this), this.buildParseTrees && e2.tokenIndex === -1 && this._ctx.addErrorNode(e2)), e2;
  }
  matchWildcard() {
    let t2 = this.getCurrentToken();
    return t2.type > 0 ? (this._errHandler.reportMatch(this), this.consume()) : (t2 = this._errHandler.recoverInline(this), this.buildParseTrees && t2.tokenIndex === -1 && this._ctx.addErrorNode(t2)), t2;
  }
  getParseListeners() {
    return this._parseListeners || [];
  }
  addParseListener(t2) {
    if (t2 === null) throw "listener";
    this._parseListeners === null && (this._parseListeners = []), this._parseListeners.push(t2);
  }
  removeParseListener(t2) {
    if (this._parseListeners !== null) {
      const e2 = this._parseListeners.indexOf(t2);
      e2 >= 0 && this._parseListeners.splice(e2, 1), this._parseListeners.length === 0 && (this._parseListeners = null);
    }
  }
  removeParseListeners() {
    this._parseListeners = null;
  }
  triggerEnterRuleEvent() {
    if (this._parseListeners !== null) {
      const t2 = this._ctx;
      this._parseListeners.forEach(function(e2) {
        e2.enterEveryRule(t2), t2.enterRule(e2);
      });
    }
  }
  triggerExitRuleEvent() {
    if (this._parseListeners !== null) {
      const t2 = this._ctx;
      this._parseListeners.slice(0).reverse().forEach(function(e2) {
        t2.exitRule(e2), e2.exitEveryRule(t2);
      });
    }
  }
  getTokenFactory() {
    return this._input.tokenSource._factory;
  }
  setTokenFactory(t2) {
    this._input.tokenSource._factory = t2;
  }
  getATNWithBypassAlts() {
    const t2 = this.getSerializedATN();
    if (t2 === null) throw "The current parser does not support an ATN with bypass alternatives.";
    let e2 = this.bypassAltsAtnCache[t2];
    if (e2 === null) {
      const n2 = new Tt();
      n2.generateRuleBypassTransitions = !0, e2 = new Lt(n2).deserialize(t2), this.bypassAltsAtnCache[t2] = e2;
    }
    return e2;
  }
  getInputStream() {
    return this.getTokenStream();
  }
  setInputStream(t2) {
    this.setTokenStream(t2);
  }
  getTokenStream() {
    return this._input;
  }
  setTokenStream(t2) {
    this._input = null, this.reset(), this._input = t2;
  }
  get syntaxErrorsCount() {
    return this._syntaxErrors;
  }
  getCurrentToken() {
    return this._input.LT(1);
  }
  notifyErrorListeners(t2, e2, n2) {
    n2 = n2 || null, (e2 = e2 || null) === null && (e2 = this.getCurrentToken()), this._syntaxErrors += 1;
    const s2 = e2.line, i2 = e2.column;
    this.getErrorListener().syntaxError(this, e2, s2, i2, t2, n2);
  }
  consume() {
    const t2 = this.getCurrentToken();
    t2.type !== i.EOF && this.getInputStream().consume();
    const e2 = this._parseListeners !== null && this._parseListeners.length > 0;
    if (this.buildParseTrees || e2) {
      let n2;
      n2 = this._errHandler.inErrorRecoveryMode(this) ? this._ctx.addErrorNode(t2) : this._ctx.addTokenNode(t2), n2.invokingState = this.state, e2 && this._parseListeners.forEach(function(t3) {
        n2 instanceof D || n2.isErrorNode !== void 0 && n2.isErrorNode() ? t3.visitErrorNode(n2) : n2 instanceof b && t3.visitTerminal(n2);
      });
    }
    return t2;
  }
  addContextToParseTree() {
    this._ctx.parentCtx !== null && this._ctx.parentCtx.addChild(this._ctx);
  }
  enterRule(t2, e2, n2) {
    this.state = e2, this._ctx = t2, this._ctx.start = this._input.LT(1), this.buildParseTrees && this.addContextToParseTree(), this.triggerEnterRuleEvent();
  }
  exitRule() {
    this._ctx.stop = this._input.LT(-1), this.triggerExitRuleEvent(), this.state = this._ctx.invokingState, this._ctx = this._ctx.parentCtx;
  }
  enterOuterAlt(t2, e2) {
    t2.setAltNumber(e2), this.buildParseTrees && this._ctx !== t2 && this._ctx.parentCtx !== null && (this._ctx.parentCtx.removeLastChild(), this._ctx.parentCtx.addChild(t2)), this._ctx = t2;
  }
  getPrecedence() {
    return this._precedenceStack.length === 0 ? -1 : this._precedenceStack[this._precedenceStack.length - 1];
  }
  enterRecursionRule(t2, e2, n2, s2) {
    this.state = e2, this._precedenceStack.push(s2), this._ctx = t2, this._ctx.start = this._input.LT(1), this.triggerEnterRuleEvent();
  }
  pushNewRecursionContext(t2, e2, n2) {
    const s2 = this._ctx;
    s2.parentCtx = t2, s2.invokingState = e2, s2.stop = this._input.LT(-1), this._ctx = t2, this._ctx.start = s2.start, this.buildParseTrees && this._ctx.addChild(s2), this.triggerEnterRuleEvent();
  }
  unrollRecursionContexts(t2) {
    this._precedenceStack.pop(), this._ctx.stop = this._input.LT(-1);
    const e2 = this._ctx, n2 = this.getParseListeners();
    if (n2 !== null && n2.length > 0) for (; this._ctx !== t2; ) this.triggerExitRuleEvent(), this._ctx = this._ctx.parentCtx;
    else this._ctx = t2;
    e2.parentCtx = t2, this.buildParseTrees && t2 !== null && t2.addChild(e2);
  }
  getInvokingContext(t2) {
    let e2 = this._ctx;
    for (; e2 !== null; ) {
      if (e2.ruleIndex === t2) return e2;
      e2 = e2.parentCtx;
    }
    return null;
  }
  precpred(t2, e2) {
    return e2 >= this._precedenceStack[this._precedenceStack.length - 1];
  }
  inContext(t2) {
    return !1;
  }
  isExpectedToken(t2) {
    const e2 = this._interp.atn;
    let n2 = this._ctx;
    const s2 = e2.states[this.state];
    let r2 = e2.nextTokens(s2);
    if (r2.contains(t2)) return !0;
    if (!r2.contains(i.EPSILON)) return !1;
    for (; n2 !== null && n2.invokingState >= 0 && r2.contains(i.EPSILON); ) {
      const s3 = e2.states[n2.invokingState].transitions[0];
      if (r2 = e2.nextTokens(s3.followState), r2.contains(t2)) return !0;
      n2 = n2.parentCtx;
    }
    return !(!r2.contains(i.EPSILON) || t2 !== i.EOF);
  }
  getExpectedTokens() {
    return this._interp.atn.getExpectedTokens(this.state, this._ctx);
  }
  getExpectedTokensWithinCurrentRule() {
    const t2 = this._interp.atn, e2 = t2.states[this.state];
    return t2.nextTokens(e2);
  }
  getRuleIndex(t2) {
    const e2 = this.getRuleIndexMap()[t2];
    return e2 !== null ? e2 : -1;
  }
  getRuleInvocationStack(t2) {
    (t2 = t2 || null) === null && (t2 = this._ctx);
    const e2 = [];
    for (; t2 !== null; ) {
      const n2 = t2.ruleIndex;
      n2 < 0 ? e2.push("n/a") : e2.push(this.ruleNames[n2]), t2 = t2.parentCtx;
    }
    return e2;
  }
  getDFAStrings() {
    return this._interp.decisionToDFA.toString();
  }
  dumpDFA() {
    let t2 = !1;
    for (let e2 = 0; e2 < this._interp.decisionToDFA.length; e2++) {
      const n2 = this._interp.decisionToDFA[e2];
      n2.states.length > 0 && (t2 && console.log(), this.printer.println("Decision " + n2.decision + ":"), this.printer.print(n2.toString(this.literalNames, this.symbolicNames)), t2 = !0);
    }
  }
  getSourceName() {
    return this._input.getSourceName();
  }
  setTrace(t2) {
    t2 ? (this._tracer !== null && this.removeParseListener(this._tracer), this._tracer = new De(this), this.addParseListener(this._tracer)) : (this.removeParseListener(this._tracer), this._tracer = null);
  }
}
Fe.bypassAltsAtnCache = {};
class Me extends b {
  constructor(t2) {
    super(), this.parentCtx = null, this.symbol = t2;
  }
  getChild(t2) {
    return null;
  }
  getSymbol() {
    return this.symbol;
  }
  getParent() {
    return this.parentCtx;
  }
  getPayload() {
    return this.symbol;
  }
  getSourceInterval() {
    if (this.symbol === null) return E.INVALID_INTERVAL;
    const t2 = this.symbol.tokenIndex;
    return new E(t2, t2);
  }
  getChildCount() {
    return 0;
  }
  accept(t2) {
    return t2.visitTerminal(this);
  }
  getText() {
    return this.symbol.text;
  }
  toString() {
    return this.symbol.type === i.EOF ? "<EOF>" : this.symbol.text;
  }
}
class Ue extends Me {
  constructor(t2) {
    super(t2);
  }
  isErrorNode() {
    return !0;
  }
  accept(t2) {
    return t2.visitErrorNode(this);
  }
}
class Be extends U {
  constructor(t2, e2) {
    super(t2, e2), this.children = null, this.start = null, this.stop = null, this.exception = null;
  }
  copyFrom(t2) {
    this.parentCtx = t2.parentCtx, this.invokingState = t2.invokingState, this.children = null, this.start = t2.start, this.stop = t2.stop, t2.children && (this.children = [], t2.children.map(function(t3) {
      t3 instanceof Ue && (this.children.push(t3), t3.parentCtx = this);
    }, this));
  }
  enterRule(t2) {
  }
  exitRule(t2) {
  }
  addChild(t2) {
    return this.children === null && (this.children = []), this.children.push(t2), t2;
  }
  removeLastChild() {
    this.children !== null && this.children.pop();
  }
  addTokenNode(t2) {
    const e2 = new Me(t2);
    return this.addChild(e2), e2.parentCtx = this, e2;
  }
  addErrorNode(t2) {
    const e2 = new Ue(t2);
    return this.addChild(e2), e2.parentCtx = this, e2;
  }
  getChild(t2, e2) {
    if (e2 = e2 || null, this.children === null || t2 < 0 || t2 >= this.children.length) return null;
    if (e2 === null) return this.children[t2];
    for (let n2 = 0; n2 < this.children.length; n2++) {
      const s2 = this.children[n2];
      if (s2 instanceof e2) {
        if (t2 === 0) return s2;
        t2 -= 1;
      }
    }
    return null;
  }
  getToken(t2, e2) {
    if (this.children === null || e2 < 0 || e2 >= this.children.length) return null;
    for (let n2 = 0; n2 < this.children.length; n2++) {
      const s2 = this.children[n2];
      if (s2 instanceof b && s2.symbol.type === t2) {
        if (e2 === 0) return s2;
        e2 -= 1;
      }
    }
    return null;
  }
  getTokens(t2) {
    if (this.children === null) return [];
    {
      const e2 = [];
      for (let n2 = 0; n2 < this.children.length; n2++) {
        const s2 = this.children[n2];
        s2 instanceof b && s2.symbol.type === t2 && e2.push(s2);
      }
      return e2;
    }
  }
  getTypedRuleContext(t2, e2) {
    return this.getChild(e2, t2);
  }
  getTypedRuleContexts(t2) {
    if (this.children === null) return [];
    {
      const e2 = [];
      for (let n2 = 0; n2 < this.children.length; n2++) {
        const s2 = this.children[n2];
        s2 instanceof t2 && e2.push(s2);
      }
      return e2;
    }
  }
  getChildCount() {
    return this.children === null ? 0 : this.children.length;
  }
  getSourceInterval() {
    return this.start === null || this.stop === null ? E.INVALID_INTERVAL : new E(this.start.tokenIndex, this.stop.tokenIndex);
  }
}
U.EMPTY = new Be();
class ze {
  static DEFAULT_PROGRAM_NAME = "default";
  constructor(t2) {
    this.tokens = t2, this.programs = /* @__PURE__ */ new Map();
  }
  getTokenStream() {
    return this.tokens;
  }
  insertAfter(t2, e2) {
    let n2, s2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ze.DEFAULT_PROGRAM_NAME;
    n2 = typeof t2 == "number" ? t2 : t2.tokenIndex;
    let i2 = this.getProgram(s2), r2 = new He(this.tokens, n2, i2.length, e2);
    i2.push(r2);
  }
  insertBefore(t2, e2) {
    let n2, s2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ze.DEFAULT_PROGRAM_NAME;
    n2 = typeof t2 == "number" ? t2 : t2.tokenIndex;
    const i2 = this.getProgram(s2), r2 = new qe(this.tokens, n2, i2.length, e2);
    i2.push(r2);
  }
  replaceSingle(t2, e2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ze.DEFAULT_PROGRAM_NAME;
    this.replace(t2, t2, e2, n2);
  }
  replace(t2, e2, n2) {
    let s2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ze.DEFAULT_PROGRAM_NAME;
    if (typeof t2 != "number" && (t2 = t2.tokenIndex), typeof e2 != "number" && (e2 = e2.tokenIndex), t2 > e2 || t2 < 0 || e2 < 0 || e2 >= this.tokens.size) throw new RangeError(`replace: range invalid: ${t2}..${e2}(size=${this.tokens.size})`);
    let i2 = this.getProgram(s2), r2 = new Ke(this.tokens, t2, e2, i2.length, n2);
    i2.push(r2);
  }
  delete(t2, e2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ze.DEFAULT_PROGRAM_NAME;
    e2 === void 0 && (e2 = t2), this.replace(t2, e2, null, n2);
  }
  getProgram(t2) {
    let e2 = this.programs.get(t2);
    return e2 == null && (e2 = this.initializeProgram(t2)), e2;
  }
  initializeProgram(t2) {
    const e2 = [];
    return this.programs.set(t2, e2), e2;
  }
  getText(t2) {
    let e2, n2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ze.DEFAULT_PROGRAM_NAME;
    e2 = t2 instanceof E ? t2 : new E(0, this.tokens.size - 1), typeof t2 == "string" && (n2 = t2);
    const s2 = this.programs.get(n2);
    let r2 = e2.start, o2 = e2.stop;
    if (o2 > this.tokens.size - 1 && (o2 = this.tokens.size - 1), r2 < 0 && (r2 = 0), s2 == null || s2.length === 0) return this.tokens.getText(new E(r2, o2));
    let a2 = [], l2 = this.reduceToSingleOperationPerIndex(s2), h2 = r2;
    for (; h2 <= o2 && h2 < this.tokens.size; ) {
      let t3 = l2.get(h2);
      l2.delete(h2);
      let e3 = this.tokens.get(h2);
      t3 == null ? (e3.type !== i.EOF && a2.push(String(e3.text)), h2++) : h2 = t3.execute(a2);
    }
    if (o2 === this.tokens.size - 1) for (const t3 of l2.values()) t3.index >= this.tokens.size - 1 && a2.push(t3.text.toString());
    return a2.join("");
  }
  reduceToSingleOperationPerIndex(t2) {
    for (let e3 = 0; e3 < t2.length; e3++) {
      let n2 = t2[e3];
      if (n2 == null || !(n2 instanceof Ke)) continue;
      let s2 = n2, i2 = this.getKindOfOps(t2, qe, e3);
      for (let e4 of i2) e4.index === s2.index ? (t2[e4.instructionIndex] = void 0, s2.text = e4.text.toString() + (s2.text != null ? s2.text.toString() : "")) : e4.index > s2.index && e4.index <= s2.lastIndex && (t2[e4.instructionIndex] = void 0);
      let r2 = this.getKindOfOps(t2, Ke, e3);
      for (let e4 of r2) {
        if (e4.index >= s2.index && e4.lastIndex <= s2.lastIndex) {
          t2[e4.instructionIndex] = void 0;
          continue;
        }
        let n3 = e4.lastIndex < s2.index || e4.index > s2.lastIndex;
        if (e4.text != null || s2.text != null || n3) {
          if (!n3) throw new Error(`replace op boundaries of ${s2} overlap with previous ${e4}`);
        } else t2[e4.instructionIndex] = void 0, s2.index = Math.min(e4.index, s2.index), s2.lastIndex = Math.max(e4.lastIndex, s2.lastIndex);
      }
    }
    for (let e3 = 0; e3 < t2.length; e3++) {
      let n2 = t2[e3];
      if (n2 == null || !(n2 instanceof qe)) continue;
      let s2 = n2, i2 = this.getKindOfOps(t2, qe, e3);
      for (let e4 of i2) e4.index === s2.index && (e4 instanceof He ? (s2.text = this.catOpText(e4.text, s2.text), t2[e4.instructionIndex] = void 0) : e4 instanceof qe && (s2.text = this.catOpText(s2.text, e4.text), t2[e4.instructionIndex] = void 0));
      let r2 = this.getKindOfOps(t2, Ke, e3);
      for (let n3 of r2) if (s2.index !== n3.index) {
        if (s2.index >= n3.index && s2.index <= n3.lastIndex) throw new Error(`insert op ${s2} within boundaries of previous ${n3}`);
      } else n3.text = this.catOpText(s2.text, n3.text), t2[e3] = void 0;
    }
    let e2 = /* @__PURE__ */ new Map();
    for (let n2 of t2) if (n2 != null) {
      if (e2.get(n2.index) != null) throw new Error("should only be one op per index");
      e2.set(n2.index, n2);
    }
    return e2;
  }
  catOpText(t2, e2) {
    let n2 = "", s2 = "";
    return t2 != null && (n2 = t2.toString()), e2 != null && (s2 = e2.toString()), n2 + s2;
  }
  getKindOfOps(t2, e2, n2) {
    return t2.slice(0, n2).filter((t3) => t3 && t3 instanceof e2);
  }
}
class Ve {
  constructor(t2, e2, n2, s2) {
    this.tokens = t2, this.instructionIndex = n2, this.index = e2, this.text = s2 === void 0 ? "" : s2;
  }
  toString() {
    let t2 = this.constructor.name;
    const e2 = t2.indexOf("$");
    return t2 = t2.substring(e2 + 1, t2.length), "<" + t2 + "@" + this.tokens.get(this.index) + ':"' + this.text + '">';
  }
}
class qe extends Ve {
  constructor(t2, e2, n2, s2) {
    super(t2, e2, n2, s2);
  }
  execute(t2) {
    return this.text && t2.push(this.text.toString()), this.tokens.get(this.index).type !== i.EOF && t2.push(String(this.tokens.get(this.index).text)), this.index + 1;
  }
}
class He extends qe {
  constructor(t2, e2, n2, s2) {
    super(t2, e2 + 1, n2, s2);
  }
}
class Ke extends Ve {
  constructor(t2, e2, n2, s2, i2) {
    super(t2, e2, s2, i2), this.lastIndex = n2;
  }
  execute(t2) {
    return this.text && t2.push(this.text.toString()), this.lastIndex + 1;
  }
  toString() {
    return this.text == null ? "<DeleteOp@" + this.tokens.get(this.index) + ".." + this.tokens.get(this.lastIndex) + ">" : "<ReplaceOp@" + this.tokens.get(this.index) + ".." + this.tokens.get(this.lastIndex) + ':"' + this.text + '">';
  }
}
const Ye = { atn: re, dfa: he, context: ce, misc: ue, tree: fe, error: Ne, Token: i, CommonToken: Pt, CharStreams: Re, CharStream: ke, InputStream: Ie, CommonTokenStream: be, Lexer: Ut, Parser: Fe, ParserRuleContext: Be, Interval: E, IntervalSet: _, LL1Analyzer: j, Utils: we, TokenStreamRewriter: ze };
var Ge = s.MG, We = s.fr;
s.sR;
s.Zo;
var Xe = s.iH;
s.rt;
var Ze = s.jB, Qe = s.M8;
s.$t;
s.aq;
var nn = s.pG, sn = s.eP;
s.KU;
s.zW;
var an = s.IX;
s.mY;
s.a7;
var cn = s.JG, un = s.ay, dn = s.X2;
s.WU;
var pn = s.Uw;
s.gw;
var xn = s.iX, Tn = s.re, Sn = s.Pg, mn = s.tD;
s.R$;
var _n = s.Dj;
s.m7;
s.NZ;
s.xo;
var kn = s.ou;
s.qC;
s.mD;
s.Ay;
class ProcessingLexer extends cn {
  static T__0 = 1;
  static HexColorLiteral = 2;
  static WS = 3;
  static COMMENT = 4;
  static LINE_COMMENT = 5;
  static CHAR_LITERAL = 6;
  static ABSTRACT = 7;
  static ASSERT = 8;
  static BOOLEAN = 9;
  static BREAK = 10;
  static BYTE = 11;
  static CASE = 12;
  static CATCH = 13;
  static CHAR = 14;
  static CLASS = 15;
  static CONST = 16;
  static CONTINUE = 17;
  static DEFAULT = 18;
  static DO = 19;
  static DOUBLE = 20;
  static ELSE = 21;
  static ENUM = 22;
  static EXTENDS = 23;
  static FINAL = 24;
  static FINALLY = 25;
  static FLOAT = 26;
  static FOR = 27;
  static IF = 28;
  static GOTO = 29;
  static IMPLEMENTS = 30;
  static IMPORT = 31;
  static INSTANCEOF = 32;
  static INT = 33;
  static INTERFACE = 34;
  static LONG = 35;
  static NATIVE = 36;
  static NEW = 37;
  static PACKAGE = 38;
  static PRIVATE = 39;
  static PROTECTED = 40;
  static PUBLIC = 41;
  static RETURN = 42;
  static SHORT = 43;
  static STATIC = 44;
  static STRICTFP = 45;
  static SUPER = 46;
  static SWITCH = 47;
  static SYNCHRONIZED = 48;
  static THIS = 49;
  static THROW = 50;
  static THROWS = 51;
  static TRANSIENT = 52;
  static TRY = 53;
  static VAR = 54;
  static VOID = 55;
  static VOLATILE = 56;
  static WHILE = 57;
  static DECIMAL_LITERAL = 58;
  static HEX_LITERAL = 59;
  static OCT_LITERAL = 60;
  static BINARY_LITERAL = 61;
  static FLOAT_LITERAL = 62;
  static HEX_FLOAT_LITERAL = 63;
  static BOOL_LITERAL = 64;
  static STRING_LITERAL = 65;
  static MULTI_STRING_LIT = 66;
  static NULL_LITERAL = 67;
  static LPAREN = 68;
  static RPAREN = 69;
  static LBRACE = 70;
  static RBRACE = 71;
  static LBRACK = 72;
  static RBRACK = 73;
  static SEMI = 74;
  static COMMA = 75;
  static DOT = 76;
  static ASSIGN = 77;
  static GT = 78;
  static LT = 79;
  static BANG = 80;
  static TILDE = 81;
  static QUESTION = 82;
  static COLON = 83;
  static EQUAL = 84;
  static LE = 85;
  static GE = 86;
  static NOTEQUAL = 87;
  static AND = 88;
  static OR = 89;
  static INC = 90;
  static DEC = 91;
  static ADD = 92;
  static SUB = 93;
  static MUL = 94;
  static DIV = 95;
  static BITAND = 96;
  static BITOR = 97;
  static CARET = 98;
  static MOD = 99;
  static ADD_ASSIGN = 100;
  static SUB_ASSIGN = 101;
  static MUL_ASSIGN = 102;
  static DIV_ASSIGN = 103;
  static AND_ASSIGN = 104;
  static OR_ASSIGN = 105;
  static XOR_ASSIGN = 106;
  static MOD_ASSIGN = 107;
  static LSHIFT_ASSIGN = 108;
  static RSHIFT_ASSIGN = 109;
  static URSHIFT_ASSIGN = 110;
  static ARROW = 111;
  static COLONCOLON = 112;
  static AT = 113;
  static ELLIPSIS = 114;
  static IDENTIFIER = 115;
  static EOF = kn.EOF;
  static channelNames = ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"];
  static literalNames = [
    null,
    "'color'",
    null,
    null,
    null,
    null,
    null,
    "'abstract'",
    "'assert'",
    "'boolean'",
    "'break'",
    "'byte'",
    "'case'",
    "'catch'",
    "'char'",
    "'class'",
    "'const'",
    "'continue'",
    "'default'",
    "'do'",
    "'double'",
    "'else'",
    "'enum'",
    "'extends'",
    "'final'",
    "'finally'",
    "'float'",
    "'for'",
    "'if'",
    "'goto'",
    "'implements'",
    "'import'",
    "'instanceof'",
    "'int'",
    "'interface'",
    "'long'",
    "'native'",
    "'new'",
    "'package'",
    "'private'",
    "'protected'",
    "'public'",
    "'return'",
    "'short'",
    "'static'",
    "'strictfp'",
    "'super'",
    "'switch'",
    "'synchronized'",
    "'this'",
    "'throw'",
    "'throws'",
    "'transient'",
    "'try'",
    "'var'",
    "'void'",
    "'volatile'",
    "'while'",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "'null'",
    "'('",
    "')'",
    "'{'",
    "'}'",
    "'['",
    "']'",
    "';'",
    "','",
    "'.'",
    "'='",
    "'>'",
    "'<'",
    "'!'",
    "'~'",
    "'?'",
    "':'",
    "'=='",
    "'<='",
    "'>='",
    "'!='",
    "'&&'",
    "'||'",
    "'++'",
    "'--'",
    "'+'",
    "'-'",
    "'*'",
    "'/'",
    "'&'",
    "'|'",
    "'^'",
    "'%'",
    "'+='",
    "'-='",
    "'*='",
    "'/='",
    "'&='",
    "'|='",
    "'^='",
    "'%='",
    "'<<='",
    "'>>='",
    "'>>>='",
    "'->'",
    "'::'",
    "'@'",
    "'...'"
  ];
  static symbolicNames = [
    null,
    null,
    "HexColorLiteral",
    "WS",
    "COMMENT",
    "LINE_COMMENT",
    "CHAR_LITERAL",
    "ABSTRACT",
    "ASSERT",
    "BOOLEAN",
    "BREAK",
    "BYTE",
    "CASE",
    "CATCH",
    "CHAR",
    "CLASS",
    "CONST",
    "CONTINUE",
    "DEFAULT",
    "DO",
    "DOUBLE",
    "ELSE",
    "ENUM",
    "EXTENDS",
    "FINAL",
    "FINALLY",
    "FLOAT",
    "FOR",
    "IF",
    "GOTO",
    "IMPLEMENTS",
    "IMPORT",
    "INSTANCEOF",
    "INT",
    "INTERFACE",
    "LONG",
    "NATIVE",
    "NEW",
    "PACKAGE",
    "PRIVATE",
    "PROTECTED",
    "PUBLIC",
    "RETURN",
    "SHORT",
    "STATIC",
    "STRICTFP",
    "SUPER",
    "SWITCH",
    "SYNCHRONIZED",
    "THIS",
    "THROW",
    "THROWS",
    "TRANSIENT",
    "TRY",
    "VAR",
    "VOID",
    "VOLATILE",
    "WHILE",
    "DECIMAL_LITERAL",
    "HEX_LITERAL",
    "OCT_LITERAL",
    "BINARY_LITERAL",
    "FLOAT_LITERAL",
    "HEX_FLOAT_LITERAL",
    "BOOL_LITERAL",
    "STRING_LITERAL",
    "MULTI_STRING_LIT",
    "NULL_LITERAL",
    "LPAREN",
    "RPAREN",
    "LBRACE",
    "RBRACE",
    "LBRACK",
    "RBRACK",
    "SEMI",
    "COMMA",
    "DOT",
    "ASSIGN",
    "GT",
    "LT",
    "BANG",
    "TILDE",
    "QUESTION",
    "COLON",
    "EQUAL",
    "LE",
    "GE",
    "NOTEQUAL",
    "AND",
    "OR",
    "INC",
    "DEC",
    "ADD",
    "SUB",
    "MUL",
    "DIV",
    "BITAND",
    "BITOR",
    "CARET",
    "MOD",
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
    "ARROW",
    "COLONCOLON",
    "AT",
    "ELLIPSIS",
    "IDENTIFIER"
  ];
  static modeNames = ["DEFAULT_MODE"];
  static ruleNames = [
    "T__0",
    "HexColorLiteral",
    "WS",
    "COMMENT",
    "LINE_COMMENT",
    "CHAR_LITERAL",
    "ABSTRACT",
    "ASSERT",
    "BOOLEAN",
    "BREAK",
    "BYTE",
    "CASE",
    "CATCH",
    "CHAR",
    "CLASS",
    "CONST",
    "CONTINUE",
    "DEFAULT",
    "DO",
    "DOUBLE",
    "ELSE",
    "ENUM",
    "EXTENDS",
    "FINAL",
    "FINALLY",
    "FLOAT",
    "FOR",
    "IF",
    "GOTO",
    "IMPLEMENTS",
    "IMPORT",
    "INSTANCEOF",
    "INT",
    "INTERFACE",
    "LONG",
    "NATIVE",
    "NEW",
    "PACKAGE",
    "PRIVATE",
    "PROTECTED",
    "PUBLIC",
    "RETURN",
    "SHORT",
    "STATIC",
    "STRICTFP",
    "SUPER",
    "SWITCH",
    "SYNCHRONIZED",
    "THIS",
    "THROW",
    "THROWS",
    "TRANSIENT",
    "TRY",
    "VAR",
    "VOID",
    "VOLATILE",
    "WHILE",
    "DECIMAL_LITERAL",
    "HEX_LITERAL",
    "OCT_LITERAL",
    "BINARY_LITERAL",
    "FLOAT_LITERAL",
    "HEX_FLOAT_LITERAL",
    "BOOL_LITERAL",
    "STRING_LITERAL",
    "MULTI_STRING_LIT",
    "NULL_LITERAL",
    "LPAREN",
    "RPAREN",
    "LBRACE",
    "RBRACE",
    "LBRACK",
    "RBRACK",
    "SEMI",
    "COMMA",
    "DOT",
    "ASSIGN",
    "GT",
    "LT",
    "BANG",
    "TILDE",
    "QUESTION",
    "COLON",
    "EQUAL",
    "LE",
    "GE",
    "NOTEQUAL",
    "AND",
    "OR",
    "INC",
    "DEC",
    "ADD",
    "SUB",
    "MUL",
    "DIV",
    "BITAND",
    "BITOR",
    "CARET",
    "MOD",
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
    "ARROW",
    "COLONCOLON",
    "AT",
    "ELLIPSIS",
    "IDENTIFIER",
    "ExponentPart",
    "EscapeSequence",
    "HexDigits",
    "HexDigit",
    "Digits",
    "LetterOrDigit",
    "Letter"
  ];
  WHITESPACE = 1;
  COMMENTS = 2;
  constructor(input) {
    super(input), this._interp = new un(this, ProcessingLexer._ATN, ProcessingLexer.DecisionsToDFA, new mn());
  }
  get grammarFileName() {
    return "Processing.g4";
  }
  get literalNames() {
    return ProcessingLexer.literalNames;
  }
  get symbolicNames() {
    return ProcessingLexer.symbolicNames;
  }
  get ruleNames() {
    return ProcessingLexer.ruleNames;
  }
  get serializedATN() {
    return ProcessingLexer._serializedATN;
  }
  get channelNames() {
    return ProcessingLexer.channelNames;
  }
  get modeNames() {
    return ProcessingLexer.modeNames;
  }
  static _serializedATN = [
    4,
    0,
    115,
    994,
    6,
    -1,
    2,
    0,
    7,
    0,
    2,
    1,
    7,
    1,
    2,
    2,
    7,
    2,
    2,
    3,
    7,
    3,
    2,
    4,
    7,
    4,
    2,
    5,
    7,
    5,
    2,
    6,
    7,
    6,
    2,
    7,
    7,
    7,
    2,
    8,
    7,
    8,
    2,
    9,
    7,
    9,
    2,
    10,
    7,
    10,
    2,
    11,
    7,
    11,
    2,
    12,
    7,
    12,
    2,
    13,
    7,
    13,
    2,
    14,
    7,
    14,
    2,
    15,
    7,
    15,
    2,
    16,
    7,
    16,
    2,
    17,
    7,
    17,
    2,
    18,
    7,
    18,
    2,
    19,
    7,
    19,
    2,
    20,
    7,
    20,
    2,
    21,
    7,
    21,
    2,
    22,
    7,
    22,
    2,
    23,
    7,
    23,
    2,
    24,
    7,
    24,
    2,
    25,
    7,
    25,
    2,
    26,
    7,
    26,
    2,
    27,
    7,
    27,
    2,
    28,
    7,
    28,
    2,
    29,
    7,
    29,
    2,
    30,
    7,
    30,
    2,
    31,
    7,
    31,
    2,
    32,
    7,
    32,
    2,
    33,
    7,
    33,
    2,
    34,
    7,
    34,
    2,
    35,
    7,
    35,
    2,
    36,
    7,
    36,
    2,
    37,
    7,
    37,
    2,
    38,
    7,
    38,
    2,
    39,
    7,
    39,
    2,
    40,
    7,
    40,
    2,
    41,
    7,
    41,
    2,
    42,
    7,
    42,
    2,
    43,
    7,
    43,
    2,
    44,
    7,
    44,
    2,
    45,
    7,
    45,
    2,
    46,
    7,
    46,
    2,
    47,
    7,
    47,
    2,
    48,
    7,
    48,
    2,
    49,
    7,
    49,
    2,
    50,
    7,
    50,
    2,
    51,
    7,
    51,
    2,
    52,
    7,
    52,
    2,
    53,
    7,
    53,
    2,
    54,
    7,
    54,
    2,
    55,
    7,
    55,
    2,
    56,
    7,
    56,
    2,
    57,
    7,
    57,
    2,
    58,
    7,
    58,
    2,
    59,
    7,
    59,
    2,
    60,
    7,
    60,
    2,
    61,
    7,
    61,
    2,
    62,
    7,
    62,
    2,
    63,
    7,
    63,
    2,
    64,
    7,
    64,
    2,
    65,
    7,
    65,
    2,
    66,
    7,
    66,
    2,
    67,
    7,
    67,
    2,
    68,
    7,
    68,
    2,
    69,
    7,
    69,
    2,
    70,
    7,
    70,
    2,
    71,
    7,
    71,
    2,
    72,
    7,
    72,
    2,
    73,
    7,
    73,
    2,
    74,
    7,
    74,
    2,
    75,
    7,
    75,
    2,
    76,
    7,
    76,
    2,
    77,
    7,
    77,
    2,
    78,
    7,
    78,
    2,
    79,
    7,
    79,
    2,
    80,
    7,
    80,
    2,
    81,
    7,
    81,
    2,
    82,
    7,
    82,
    2,
    83,
    7,
    83,
    2,
    84,
    7,
    84,
    2,
    85,
    7,
    85,
    2,
    86,
    7,
    86,
    2,
    87,
    7,
    87,
    2,
    88,
    7,
    88,
    2,
    89,
    7,
    89,
    2,
    90,
    7,
    90,
    2,
    91,
    7,
    91,
    2,
    92,
    7,
    92,
    2,
    93,
    7,
    93,
    2,
    94,
    7,
    94,
    2,
    95,
    7,
    95,
    2,
    96,
    7,
    96,
    2,
    97,
    7,
    97,
    2,
    98,
    7,
    98,
    2,
    99,
    7,
    99,
    2,
    100,
    7,
    100,
    2,
    101,
    7,
    101,
    2,
    102,
    7,
    102,
    2,
    103,
    7,
    103,
    2,
    104,
    7,
    104,
    2,
    105,
    7,
    105,
    2,
    106,
    7,
    106,
    2,
    107,
    7,
    107,
    2,
    108,
    7,
    108,
    2,
    109,
    7,
    109,
    2,
    110,
    7,
    110,
    2,
    111,
    7,
    111,
    2,
    112,
    7,
    112,
    2,
    113,
    7,
    113,
    2,
    114,
    7,
    114,
    2,
    115,
    7,
    115,
    2,
    116,
    7,
    116,
    2,
    117,
    7,
    117,
    2,
    118,
    7,
    118,
    2,
    119,
    7,
    119,
    2,
    120,
    7,
    120,
    2,
    121,
    7,
    121,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    3,
    1,
    256,
    8,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    4,
    2,
    266,
    8,
    2,
    11,
    2,
    12,
    2,
    267,
    1,
    2,
    1,
    2,
    1,
    3,
    1,
    3,
    1,
    3,
    1,
    3,
    5,
    3,
    276,
    8,
    3,
    10,
    3,
    12,
    3,
    279,
    9,
    3,
    1,
    3,
    1,
    3,
    1,
    3,
    1,
    3,
    1,
    3,
    1,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    5,
    4,
    290,
    8,
    4,
    10,
    4,
    12,
    4,
    293,
    9,
    4,
    1,
    4,
    1,
    4,
    1,
    5,
    1,
    5,
    1,
    5,
    5,
    5,
    300,
    8,
    5,
    10,
    5,
    12,
    5,
    303,
    9,
    5,
    1,
    5,
    1,
    5,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    6,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    8,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    10,
    1,
    10,
    1,
    10,
    1,
    10,
    1,
    10,
    1,
    11,
    1,
    11,
    1,
    11,
    1,
    11,
    1,
    11,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    13,
    1,
    13,
    1,
    13,
    1,
    13,
    1,
    13,
    1,
    14,
    1,
    14,
    1,
    14,
    1,
    14,
    1,
    14,
    1,
    14,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    18,
    1,
    18,
    1,
    18,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    20,
    1,
    20,
    1,
    20,
    1,
    20,
    1,
    20,
    1,
    21,
    1,
    21,
    1,
    21,
    1,
    21,
    1,
    21,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    23,
    1,
    23,
    1,
    23,
    1,
    23,
    1,
    23,
    1,
    23,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    24,
    1,
    25,
    1,
    25,
    1,
    25,
    1,
    25,
    1,
    25,
    1,
    25,
    1,
    26,
    1,
    26,
    1,
    26,
    1,
    26,
    1,
    27,
    1,
    27,
    1,
    27,
    1,
    28,
    1,
    28,
    1,
    28,
    1,
    28,
    1,
    28,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    29,
    1,
    30,
    1,
    30,
    1,
    30,
    1,
    30,
    1,
    30,
    1,
    30,
    1,
    30,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    31,
    1,
    32,
    1,
    32,
    1,
    32,
    1,
    32,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    34,
    1,
    34,
    1,
    34,
    1,
    34,
    1,
    34,
    1,
    35,
    1,
    35,
    1,
    35,
    1,
    35,
    1,
    35,
    1,
    35,
    1,
    35,
    1,
    36,
    1,
    36,
    1,
    36,
    1,
    36,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    41,
    1,
    41,
    1,
    41,
    1,
    41,
    1,
    41,
    1,
    41,
    1,
    41,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    48,
    1,
    48,
    1,
    48,
    1,
    48,
    1,
    48,
    1,
    49,
    1,
    49,
    1,
    49,
    1,
    49,
    1,
    49,
    1,
    49,
    1,
    50,
    1,
    50,
    1,
    50,
    1,
    50,
    1,
    50,
    1,
    50,
    1,
    50,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    52,
    1,
    52,
    1,
    52,
    1,
    52,
    1,
    53,
    1,
    53,
    1,
    53,
    1,
    53,
    1,
    54,
    1,
    54,
    1,
    54,
    1,
    54,
    1,
    54,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    55,
    1,
    56,
    1,
    56,
    1,
    56,
    1,
    56,
    1,
    56,
    1,
    56,
    1,
    57,
    1,
    57,
    1,
    57,
    3,
    57,
    653,
    8,
    57,
    1,
    57,
    4,
    57,
    656,
    8,
    57,
    11,
    57,
    12,
    57,
    657,
    1,
    57,
    3,
    57,
    661,
    8,
    57,
    3,
    57,
    663,
    8,
    57,
    1,
    57,
    3,
    57,
    666,
    8,
    57,
    1,
    58,
    1,
    58,
    1,
    58,
    1,
    58,
    5,
    58,
    672,
    8,
    58,
    10,
    58,
    12,
    58,
    675,
    9,
    58,
    1,
    58,
    3,
    58,
    678,
    8,
    58,
    1,
    58,
    3,
    58,
    681,
    8,
    58,
    1,
    59,
    1,
    59,
    5,
    59,
    685,
    8,
    59,
    10,
    59,
    12,
    59,
    688,
    9,
    59,
    1,
    59,
    1,
    59,
    5,
    59,
    692,
    8,
    59,
    10,
    59,
    12,
    59,
    695,
    9,
    59,
    1,
    59,
    3,
    59,
    698,
    8,
    59,
    1,
    59,
    3,
    59,
    701,
    8,
    59,
    1,
    60,
    1,
    60,
    1,
    60,
    1,
    60,
    5,
    60,
    707,
    8,
    60,
    10,
    60,
    12,
    60,
    710,
    9,
    60,
    1,
    60,
    3,
    60,
    713,
    8,
    60,
    1,
    60,
    3,
    60,
    716,
    8,
    60,
    1,
    61,
    1,
    61,
    1,
    61,
    3,
    61,
    721,
    8,
    61,
    1,
    61,
    1,
    61,
    3,
    61,
    725,
    8,
    61,
    1,
    61,
    3,
    61,
    728,
    8,
    61,
    1,
    61,
    3,
    61,
    731,
    8,
    61,
    1,
    61,
    1,
    61,
    1,
    61,
    3,
    61,
    736,
    8,
    61,
    1,
    61,
    3,
    61,
    739,
    8,
    61,
    3,
    61,
    741,
    8,
    61,
    1,
    62,
    1,
    62,
    1,
    62,
    1,
    62,
    3,
    62,
    747,
    8,
    62,
    1,
    62,
    3,
    62,
    750,
    8,
    62,
    1,
    62,
    1,
    62,
    3,
    62,
    754,
    8,
    62,
    1,
    62,
    1,
    62,
    3,
    62,
    758,
    8,
    62,
    1,
    62,
    1,
    62,
    3,
    62,
    762,
    8,
    62,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    1,
    63,
    3,
    63,
    773,
    8,
    63,
    1,
    64,
    1,
    64,
    1,
    64,
    5,
    64,
    778,
    8,
    64,
    10,
    64,
    12,
    64,
    781,
    9,
    64,
    1,
    64,
    1,
    64,
    1,
    65,
    1,
    65,
    1,
    65,
    1,
    65,
    1,
    65,
    1,
    65,
    5,
    65,
    791,
    8,
    65,
    10,
    65,
    12,
    65,
    794,
    9,
    65,
    1,
    65,
    1,
    65,
    1,
    65,
    1,
    65,
    1,
    66,
    1,
    66,
    1,
    66,
    1,
    66,
    1,
    66,
    1,
    67,
    1,
    67,
    1,
    68,
    1,
    68,
    1,
    69,
    1,
    69,
    1,
    70,
    1,
    70,
    1,
    71,
    1,
    71,
    1,
    72,
    1,
    72,
    1,
    73,
    1,
    73,
    1,
    74,
    1,
    74,
    1,
    75,
    1,
    75,
    1,
    76,
    1,
    76,
    1,
    77,
    1,
    77,
    1,
    78,
    1,
    78,
    1,
    79,
    1,
    79,
    1,
    80,
    1,
    80,
    1,
    81,
    1,
    81,
    1,
    82,
    1,
    82,
    1,
    83,
    1,
    83,
    1,
    83,
    1,
    84,
    1,
    84,
    1,
    84,
    1,
    85,
    1,
    85,
    1,
    85,
    1,
    86,
    1,
    86,
    1,
    86,
    1,
    87,
    1,
    87,
    1,
    87,
    1,
    88,
    1,
    88,
    1,
    88,
    1,
    89,
    1,
    89,
    1,
    89,
    1,
    90,
    1,
    90,
    1,
    90,
    1,
    91,
    1,
    91,
    1,
    92,
    1,
    92,
    1,
    93,
    1,
    93,
    1,
    94,
    1,
    94,
    1,
    95,
    1,
    95,
    1,
    96,
    1,
    96,
    1,
    97,
    1,
    97,
    1,
    98,
    1,
    98,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    100,
    1,
    100,
    1,
    100,
    1,
    101,
    1,
    101,
    1,
    101,
    1,
    102,
    1,
    102,
    1,
    102,
    1,
    103,
    1,
    103,
    1,
    103,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    105,
    1,
    105,
    1,
    105,
    1,
    106,
    1,
    106,
    1,
    106,
    1,
    107,
    1,
    107,
    1,
    107,
    1,
    107,
    1,
    108,
    1,
    108,
    1,
    108,
    1,
    108,
    1,
    109,
    1,
    109,
    1,
    109,
    1,
    109,
    1,
    109,
    1,
    110,
    1,
    110,
    1,
    110,
    1,
    111,
    1,
    111,
    1,
    111,
    1,
    112,
    1,
    112,
    1,
    113,
    1,
    113,
    1,
    113,
    1,
    113,
    1,
    114,
    1,
    114,
    5,
    114,
    928,
    8,
    114,
    10,
    114,
    12,
    114,
    931,
    9,
    114,
    1,
    115,
    1,
    115,
    3,
    115,
    935,
    8,
    115,
    1,
    115,
    1,
    115,
    1,
    116,
    1,
    116,
    1,
    116,
    1,
    116,
    3,
    116,
    943,
    8,
    116,
    1,
    116,
    3,
    116,
    946,
    8,
    116,
    1,
    116,
    1,
    116,
    1,
    116,
    4,
    116,
    951,
    8,
    116,
    11,
    116,
    12,
    116,
    952,
    1,
    116,
    1,
    116,
    1,
    116,
    1,
    116,
    1,
    116,
    3,
    116,
    960,
    8,
    116,
    1,
    117,
    1,
    117,
    1,
    117,
    5,
    117,
    965,
    8,
    117,
    10,
    117,
    12,
    117,
    968,
    9,
    117,
    1,
    117,
    3,
    117,
    971,
    8,
    117,
    1,
    118,
    1,
    118,
    1,
    119,
    1,
    119,
    5,
    119,
    977,
    8,
    119,
    10,
    119,
    12,
    119,
    980,
    9,
    119,
    1,
    119,
    3,
    119,
    983,
    8,
    119,
    1,
    120,
    1,
    120,
    3,
    120,
    987,
    8,
    120,
    1,
    121,
    1,
    121,
    1,
    121,
    1,
    121,
    3,
    121,
    993,
    8,
    121,
    2,
    277,
    792,
    0,
    122,
    1,
    1,
    3,
    2,
    5,
    3,
    7,
    4,
    9,
    5,
    11,
    6,
    13,
    7,
    15,
    8,
    17,
    9,
    19,
    10,
    21,
    11,
    23,
    12,
    25,
    13,
    27,
    14,
    29,
    15,
    31,
    16,
    33,
    17,
    35,
    18,
    37,
    19,
    39,
    20,
    41,
    21,
    43,
    22,
    45,
    23,
    47,
    24,
    49,
    25,
    51,
    26,
    53,
    27,
    55,
    28,
    57,
    29,
    59,
    30,
    61,
    31,
    63,
    32,
    65,
    33,
    67,
    34,
    69,
    35,
    71,
    36,
    73,
    37,
    75,
    38,
    77,
    39,
    79,
    40,
    81,
    41,
    83,
    42,
    85,
    43,
    87,
    44,
    89,
    45,
    91,
    46,
    93,
    47,
    95,
    48,
    97,
    49,
    99,
    50,
    101,
    51,
    103,
    52,
    105,
    53,
    107,
    54,
    109,
    55,
    111,
    56,
    113,
    57,
    115,
    58,
    117,
    59,
    119,
    60,
    121,
    61,
    123,
    62,
    125,
    63,
    127,
    64,
    129,
    65,
    131,
    66,
    133,
    67,
    135,
    68,
    137,
    69,
    139,
    70,
    141,
    71,
    143,
    72,
    145,
    73,
    147,
    74,
    149,
    75,
    151,
    76,
    153,
    77,
    155,
    78,
    157,
    79,
    159,
    80,
    161,
    81,
    163,
    82,
    165,
    83,
    167,
    84,
    169,
    85,
    171,
    86,
    173,
    87,
    175,
    88,
    177,
    89,
    179,
    90,
    181,
    91,
    183,
    92,
    185,
    93,
    187,
    94,
    189,
    95,
    191,
    96,
    193,
    97,
    195,
    98,
    197,
    99,
    199,
    100,
    201,
    101,
    203,
    102,
    205,
    103,
    207,
    104,
    209,
    105,
    211,
    106,
    213,
    107,
    215,
    108,
    217,
    109,
    219,
    110,
    221,
    111,
    223,
    112,
    225,
    113,
    227,
    114,
    229,
    115,
    231,
    0,
    233,
    0,
    235,
    0,
    237,
    0,
    239,
    0,
    241,
    0,
    243,
    0,
    1,
    0,
    27,
    3,
    0,
    9,
    10,
    12,
    13,
    32,
    32,
    2,
    0,
    10,
    10,
    13,
    13,
    4,
    0,
    10,
    10,
    13,
    13,
    39,
    39,
    92,
    92,
    1,
    0,
    49,
    57,
    2,
    0,
    76,
    76,
    108,
    108,
    2,
    0,
    88,
    88,
    120,
    120,
    3,
    0,
    48,
    57,
    65,
    70,
    97,
    102,
    4,
    0,
    48,
    57,
    65,
    70,
    95,
    95,
    97,
    102,
    1,
    0,
    48,
    55,
    2,
    0,
    48,
    55,
    95,
    95,
    2,
    0,
    66,
    66,
    98,
    98,
    1,
    0,
    48,
    49,
    2,
    0,
    48,
    49,
    95,
    95,
    4,
    0,
    68,
    68,
    70,
    70,
    100,
    100,
    102,
    102,
    2,
    0,
    80,
    80,
    112,
    112,
    2,
    0,
    43,
    43,
    45,
    45,
    4,
    0,
    10,
    10,
    13,
    13,
    34,
    34,
    92,
    92,
    1,
    0,
    92,
    92,
    2,
    0,
    69,
    69,
    101,
    101,
    8,
    0,
    34,
    34,
    39,
    39,
    92,
    92,
    98,
    98,
    102,
    102,
    110,
    110,
    114,
    114,
    116,
    116,
    1,
    0,
    48,
    51,
    1,
    0,
    48,
    57,
    2,
    0,
    48,
    57,
    95,
    95,
    4,
    0,
    36,
    36,
    65,
    90,
    95,
    95,
    97,
    122,
    2,
    0,
    0,
    127,
    55296,
    56319,
    1,
    0,
    55296,
    56319,
    1,
    0,
    56320,
    57343,
    1039,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    3,
    1,
    0,
    0,
    0,
    0,
    5,
    1,
    0,
    0,
    0,
    0,
    7,
    1,
    0,
    0,
    0,
    0,
    9,
    1,
    0,
    0,
    0,
    0,
    11,
    1,
    0,
    0,
    0,
    0,
    13,
    1,
    0,
    0,
    0,
    0,
    15,
    1,
    0,
    0,
    0,
    0,
    17,
    1,
    0,
    0,
    0,
    0,
    19,
    1,
    0,
    0,
    0,
    0,
    21,
    1,
    0,
    0,
    0,
    0,
    23,
    1,
    0,
    0,
    0,
    0,
    25,
    1,
    0,
    0,
    0,
    0,
    27,
    1,
    0,
    0,
    0,
    0,
    29,
    1,
    0,
    0,
    0,
    0,
    31,
    1,
    0,
    0,
    0,
    0,
    33,
    1,
    0,
    0,
    0,
    0,
    35,
    1,
    0,
    0,
    0,
    0,
    37,
    1,
    0,
    0,
    0,
    0,
    39,
    1,
    0,
    0,
    0,
    0,
    41,
    1,
    0,
    0,
    0,
    0,
    43,
    1,
    0,
    0,
    0,
    0,
    45,
    1,
    0,
    0,
    0,
    0,
    47,
    1,
    0,
    0,
    0,
    0,
    49,
    1,
    0,
    0,
    0,
    0,
    51,
    1,
    0,
    0,
    0,
    0,
    53,
    1,
    0,
    0,
    0,
    0,
    55,
    1,
    0,
    0,
    0,
    0,
    57,
    1,
    0,
    0,
    0,
    0,
    59,
    1,
    0,
    0,
    0,
    0,
    61,
    1,
    0,
    0,
    0,
    0,
    63,
    1,
    0,
    0,
    0,
    0,
    65,
    1,
    0,
    0,
    0,
    0,
    67,
    1,
    0,
    0,
    0,
    0,
    69,
    1,
    0,
    0,
    0,
    0,
    71,
    1,
    0,
    0,
    0,
    0,
    73,
    1,
    0,
    0,
    0,
    0,
    75,
    1,
    0,
    0,
    0,
    0,
    77,
    1,
    0,
    0,
    0,
    0,
    79,
    1,
    0,
    0,
    0,
    0,
    81,
    1,
    0,
    0,
    0,
    0,
    83,
    1,
    0,
    0,
    0,
    0,
    85,
    1,
    0,
    0,
    0,
    0,
    87,
    1,
    0,
    0,
    0,
    0,
    89,
    1,
    0,
    0,
    0,
    0,
    91,
    1,
    0,
    0,
    0,
    0,
    93,
    1,
    0,
    0,
    0,
    0,
    95,
    1,
    0,
    0,
    0,
    0,
    97,
    1,
    0,
    0,
    0,
    0,
    99,
    1,
    0,
    0,
    0,
    0,
    101,
    1,
    0,
    0,
    0,
    0,
    103,
    1,
    0,
    0,
    0,
    0,
    105,
    1,
    0,
    0,
    0,
    0,
    107,
    1,
    0,
    0,
    0,
    0,
    109,
    1,
    0,
    0,
    0,
    0,
    111,
    1,
    0,
    0,
    0,
    0,
    113,
    1,
    0,
    0,
    0,
    0,
    115,
    1,
    0,
    0,
    0,
    0,
    117,
    1,
    0,
    0,
    0,
    0,
    119,
    1,
    0,
    0,
    0,
    0,
    121,
    1,
    0,
    0,
    0,
    0,
    123,
    1,
    0,
    0,
    0,
    0,
    125,
    1,
    0,
    0,
    0,
    0,
    127,
    1,
    0,
    0,
    0,
    0,
    129,
    1,
    0,
    0,
    0,
    0,
    131,
    1,
    0,
    0,
    0,
    0,
    133,
    1,
    0,
    0,
    0,
    0,
    135,
    1,
    0,
    0,
    0,
    0,
    137,
    1,
    0,
    0,
    0,
    0,
    139,
    1,
    0,
    0,
    0,
    0,
    141,
    1,
    0,
    0,
    0,
    0,
    143,
    1,
    0,
    0,
    0,
    0,
    145,
    1,
    0,
    0,
    0,
    0,
    147,
    1,
    0,
    0,
    0,
    0,
    149,
    1,
    0,
    0,
    0,
    0,
    151,
    1,
    0,
    0,
    0,
    0,
    153,
    1,
    0,
    0,
    0,
    0,
    155,
    1,
    0,
    0,
    0,
    0,
    157,
    1,
    0,
    0,
    0,
    0,
    159,
    1,
    0,
    0,
    0,
    0,
    161,
    1,
    0,
    0,
    0,
    0,
    163,
    1,
    0,
    0,
    0,
    0,
    165,
    1,
    0,
    0,
    0,
    0,
    167,
    1,
    0,
    0,
    0,
    0,
    169,
    1,
    0,
    0,
    0,
    0,
    171,
    1,
    0,
    0,
    0,
    0,
    173,
    1,
    0,
    0,
    0,
    0,
    175,
    1,
    0,
    0,
    0,
    0,
    177,
    1,
    0,
    0,
    0,
    0,
    179,
    1,
    0,
    0,
    0,
    0,
    181,
    1,
    0,
    0,
    0,
    0,
    183,
    1,
    0,
    0,
    0,
    0,
    185,
    1,
    0,
    0,
    0,
    0,
    187,
    1,
    0,
    0,
    0,
    0,
    189,
    1,
    0,
    0,
    0,
    0,
    191,
    1,
    0,
    0,
    0,
    0,
    193,
    1,
    0,
    0,
    0,
    0,
    195,
    1,
    0,
    0,
    0,
    0,
    197,
    1,
    0,
    0,
    0,
    0,
    199,
    1,
    0,
    0,
    0,
    0,
    201,
    1,
    0,
    0,
    0,
    0,
    203,
    1,
    0,
    0,
    0,
    0,
    205,
    1,
    0,
    0,
    0,
    0,
    207,
    1,
    0,
    0,
    0,
    0,
    209,
    1,
    0,
    0,
    0,
    0,
    211,
    1,
    0,
    0,
    0,
    0,
    213,
    1,
    0,
    0,
    0,
    0,
    215,
    1,
    0,
    0,
    0,
    0,
    217,
    1,
    0,
    0,
    0,
    0,
    219,
    1,
    0,
    0,
    0,
    0,
    221,
    1,
    0,
    0,
    0,
    0,
    223,
    1,
    0,
    0,
    0,
    0,
    225,
    1,
    0,
    0,
    0,
    0,
    227,
    1,
    0,
    0,
    0,
    0,
    229,
    1,
    0,
    0,
    0,
    1,
    245,
    1,
    0,
    0,
    0,
    3,
    251,
    1,
    0,
    0,
    0,
    5,
    265,
    1,
    0,
    0,
    0,
    7,
    271,
    1,
    0,
    0,
    0,
    9,
    285,
    1,
    0,
    0,
    0,
    11,
    296,
    1,
    0,
    0,
    0,
    13,
    306,
    1,
    0,
    0,
    0,
    15,
    315,
    1,
    0,
    0,
    0,
    17,
    322,
    1,
    0,
    0,
    0,
    19,
    330,
    1,
    0,
    0,
    0,
    21,
    336,
    1,
    0,
    0,
    0,
    23,
    341,
    1,
    0,
    0,
    0,
    25,
    346,
    1,
    0,
    0,
    0,
    27,
    352,
    1,
    0,
    0,
    0,
    29,
    357,
    1,
    0,
    0,
    0,
    31,
    363,
    1,
    0,
    0,
    0,
    33,
    369,
    1,
    0,
    0,
    0,
    35,
    378,
    1,
    0,
    0,
    0,
    37,
    386,
    1,
    0,
    0,
    0,
    39,
    389,
    1,
    0,
    0,
    0,
    41,
    396,
    1,
    0,
    0,
    0,
    43,
    401,
    1,
    0,
    0,
    0,
    45,
    406,
    1,
    0,
    0,
    0,
    47,
    414,
    1,
    0,
    0,
    0,
    49,
    420,
    1,
    0,
    0,
    0,
    51,
    428,
    1,
    0,
    0,
    0,
    53,
    434,
    1,
    0,
    0,
    0,
    55,
    438,
    1,
    0,
    0,
    0,
    57,
    441,
    1,
    0,
    0,
    0,
    59,
    446,
    1,
    0,
    0,
    0,
    61,
    457,
    1,
    0,
    0,
    0,
    63,
    464,
    1,
    0,
    0,
    0,
    65,
    475,
    1,
    0,
    0,
    0,
    67,
    479,
    1,
    0,
    0,
    0,
    69,
    489,
    1,
    0,
    0,
    0,
    71,
    494,
    1,
    0,
    0,
    0,
    73,
    501,
    1,
    0,
    0,
    0,
    75,
    505,
    1,
    0,
    0,
    0,
    77,
    513,
    1,
    0,
    0,
    0,
    79,
    521,
    1,
    0,
    0,
    0,
    81,
    531,
    1,
    0,
    0,
    0,
    83,
    538,
    1,
    0,
    0,
    0,
    85,
    545,
    1,
    0,
    0,
    0,
    87,
    551,
    1,
    0,
    0,
    0,
    89,
    558,
    1,
    0,
    0,
    0,
    91,
    567,
    1,
    0,
    0,
    0,
    93,
    573,
    1,
    0,
    0,
    0,
    95,
    580,
    1,
    0,
    0,
    0,
    97,
    593,
    1,
    0,
    0,
    0,
    99,
    598,
    1,
    0,
    0,
    0,
    101,
    604,
    1,
    0,
    0,
    0,
    103,
    611,
    1,
    0,
    0,
    0,
    105,
    621,
    1,
    0,
    0,
    0,
    107,
    625,
    1,
    0,
    0,
    0,
    109,
    629,
    1,
    0,
    0,
    0,
    111,
    634,
    1,
    0,
    0,
    0,
    113,
    643,
    1,
    0,
    0,
    0,
    115,
    662,
    1,
    0,
    0,
    0,
    117,
    667,
    1,
    0,
    0,
    0,
    119,
    682,
    1,
    0,
    0,
    0,
    121,
    702,
    1,
    0,
    0,
    0,
    123,
    740,
    1,
    0,
    0,
    0,
    125,
    742,
    1,
    0,
    0,
    0,
    127,
    772,
    1,
    0,
    0,
    0,
    129,
    774,
    1,
    0,
    0,
    0,
    131,
    784,
    1,
    0,
    0,
    0,
    133,
    799,
    1,
    0,
    0,
    0,
    135,
    804,
    1,
    0,
    0,
    0,
    137,
    806,
    1,
    0,
    0,
    0,
    139,
    808,
    1,
    0,
    0,
    0,
    141,
    810,
    1,
    0,
    0,
    0,
    143,
    812,
    1,
    0,
    0,
    0,
    145,
    814,
    1,
    0,
    0,
    0,
    147,
    816,
    1,
    0,
    0,
    0,
    149,
    818,
    1,
    0,
    0,
    0,
    151,
    820,
    1,
    0,
    0,
    0,
    153,
    822,
    1,
    0,
    0,
    0,
    155,
    824,
    1,
    0,
    0,
    0,
    157,
    826,
    1,
    0,
    0,
    0,
    159,
    828,
    1,
    0,
    0,
    0,
    161,
    830,
    1,
    0,
    0,
    0,
    163,
    832,
    1,
    0,
    0,
    0,
    165,
    834,
    1,
    0,
    0,
    0,
    167,
    836,
    1,
    0,
    0,
    0,
    169,
    839,
    1,
    0,
    0,
    0,
    171,
    842,
    1,
    0,
    0,
    0,
    173,
    845,
    1,
    0,
    0,
    0,
    175,
    848,
    1,
    0,
    0,
    0,
    177,
    851,
    1,
    0,
    0,
    0,
    179,
    854,
    1,
    0,
    0,
    0,
    181,
    857,
    1,
    0,
    0,
    0,
    183,
    860,
    1,
    0,
    0,
    0,
    185,
    862,
    1,
    0,
    0,
    0,
    187,
    864,
    1,
    0,
    0,
    0,
    189,
    866,
    1,
    0,
    0,
    0,
    191,
    868,
    1,
    0,
    0,
    0,
    193,
    870,
    1,
    0,
    0,
    0,
    195,
    872,
    1,
    0,
    0,
    0,
    197,
    874,
    1,
    0,
    0,
    0,
    199,
    876,
    1,
    0,
    0,
    0,
    201,
    879,
    1,
    0,
    0,
    0,
    203,
    882,
    1,
    0,
    0,
    0,
    205,
    885,
    1,
    0,
    0,
    0,
    207,
    888,
    1,
    0,
    0,
    0,
    209,
    891,
    1,
    0,
    0,
    0,
    211,
    894,
    1,
    0,
    0,
    0,
    213,
    897,
    1,
    0,
    0,
    0,
    215,
    900,
    1,
    0,
    0,
    0,
    217,
    904,
    1,
    0,
    0,
    0,
    219,
    908,
    1,
    0,
    0,
    0,
    221,
    913,
    1,
    0,
    0,
    0,
    223,
    916,
    1,
    0,
    0,
    0,
    225,
    919,
    1,
    0,
    0,
    0,
    227,
    921,
    1,
    0,
    0,
    0,
    229,
    925,
    1,
    0,
    0,
    0,
    231,
    932,
    1,
    0,
    0,
    0,
    233,
    959,
    1,
    0,
    0,
    0,
    235,
    961,
    1,
    0,
    0,
    0,
    237,
    972,
    1,
    0,
    0,
    0,
    239,
    974,
    1,
    0,
    0,
    0,
    241,
    986,
    1,
    0,
    0,
    0,
    243,
    992,
    1,
    0,
    0,
    0,
    245,
    246,
    5,
    99,
    0,
    0,
    246,
    247,
    5,
    111,
    0,
    0,
    247,
    248,
    5,
    108,
    0,
    0,
    248,
    249,
    5,
    111,
    0,
    0,
    249,
    250,
    5,
    114,
    0,
    0,
    250,
    2,
    1,
    0,
    0,
    0,
    251,
    255,
    5,
    35,
    0,
    0,
    252,
    253,
    3,
    237,
    118,
    0,
    253,
    254,
    3,
    237,
    118,
    0,
    254,
    256,
    1,
    0,
    0,
    0,
    255,
    252,
    1,
    0,
    0,
    0,
    255,
    256,
    1,
    0,
    0,
    0,
    256,
    257,
    1,
    0,
    0,
    0,
    257,
    258,
    3,
    237,
    118,
    0,
    258,
    259,
    3,
    237,
    118,
    0,
    259,
    260,
    3,
    237,
    118,
    0,
    260,
    261,
    3,
    237,
    118,
    0,
    261,
    262,
    3,
    237,
    118,
    0,
    262,
    263,
    3,
    237,
    118,
    0,
    263,
    4,
    1,
    0,
    0,
    0,
    264,
    266,
    7,
    0,
    0,
    0,
    265,
    264,
    1,
    0,
    0,
    0,
    266,
    267,
    1,
    0,
    0,
    0,
    267,
    265,
    1,
    0,
    0,
    0,
    267,
    268,
    1,
    0,
    0,
    0,
    268,
    269,
    1,
    0,
    0,
    0,
    269,
    270,
    6,
    2,
    0,
    0,
    270,
    6,
    1,
    0,
    0,
    0,
    271,
    272,
    5,
    47,
    0,
    0,
    272,
    273,
    5,
    42,
    0,
    0,
    273,
    277,
    1,
    0,
    0,
    0,
    274,
    276,
    9,
    0,
    0,
    0,
    275,
    274,
    1,
    0,
    0,
    0,
    276,
    279,
    1,
    0,
    0,
    0,
    277,
    278,
    1,
    0,
    0,
    0,
    277,
    275,
    1,
    0,
    0,
    0,
    278,
    280,
    1,
    0,
    0,
    0,
    279,
    277,
    1,
    0,
    0,
    0,
    280,
    281,
    5,
    42,
    0,
    0,
    281,
    282,
    5,
    47,
    0,
    0,
    282,
    283,
    1,
    0,
    0,
    0,
    283,
    284,
    6,
    3,
    1,
    0,
    284,
    8,
    1,
    0,
    0,
    0,
    285,
    286,
    5,
    47,
    0,
    0,
    286,
    287,
    5,
    47,
    0,
    0,
    287,
    291,
    1,
    0,
    0,
    0,
    288,
    290,
    8,
    1,
    0,
    0,
    289,
    288,
    1,
    0,
    0,
    0,
    290,
    293,
    1,
    0,
    0,
    0,
    291,
    289,
    1,
    0,
    0,
    0,
    291,
    292,
    1,
    0,
    0,
    0,
    292,
    294,
    1,
    0,
    0,
    0,
    293,
    291,
    1,
    0,
    0,
    0,
    294,
    295,
    6,
    4,
    1,
    0,
    295,
    10,
    1,
    0,
    0,
    0,
    296,
    301,
    5,
    39,
    0,
    0,
    297,
    300,
    8,
    2,
    0,
    0,
    298,
    300,
    3,
    233,
    116,
    0,
    299,
    297,
    1,
    0,
    0,
    0,
    299,
    298,
    1,
    0,
    0,
    0,
    300,
    303,
    1,
    0,
    0,
    0,
    301,
    299,
    1,
    0,
    0,
    0,
    301,
    302,
    1,
    0,
    0,
    0,
    302,
    304,
    1,
    0,
    0,
    0,
    303,
    301,
    1,
    0,
    0,
    0,
    304,
    305,
    5,
    39,
    0,
    0,
    305,
    12,
    1,
    0,
    0,
    0,
    306,
    307,
    5,
    97,
    0,
    0,
    307,
    308,
    5,
    98,
    0,
    0,
    308,
    309,
    5,
    115,
    0,
    0,
    309,
    310,
    5,
    116,
    0,
    0,
    310,
    311,
    5,
    114,
    0,
    0,
    311,
    312,
    5,
    97,
    0,
    0,
    312,
    313,
    5,
    99,
    0,
    0,
    313,
    314,
    5,
    116,
    0,
    0,
    314,
    14,
    1,
    0,
    0,
    0,
    315,
    316,
    5,
    97,
    0,
    0,
    316,
    317,
    5,
    115,
    0,
    0,
    317,
    318,
    5,
    115,
    0,
    0,
    318,
    319,
    5,
    101,
    0,
    0,
    319,
    320,
    5,
    114,
    0,
    0,
    320,
    321,
    5,
    116,
    0,
    0,
    321,
    16,
    1,
    0,
    0,
    0,
    322,
    323,
    5,
    98,
    0,
    0,
    323,
    324,
    5,
    111,
    0,
    0,
    324,
    325,
    5,
    111,
    0,
    0,
    325,
    326,
    5,
    108,
    0,
    0,
    326,
    327,
    5,
    101,
    0,
    0,
    327,
    328,
    5,
    97,
    0,
    0,
    328,
    329,
    5,
    110,
    0,
    0,
    329,
    18,
    1,
    0,
    0,
    0,
    330,
    331,
    5,
    98,
    0,
    0,
    331,
    332,
    5,
    114,
    0,
    0,
    332,
    333,
    5,
    101,
    0,
    0,
    333,
    334,
    5,
    97,
    0,
    0,
    334,
    335,
    5,
    107,
    0,
    0,
    335,
    20,
    1,
    0,
    0,
    0,
    336,
    337,
    5,
    98,
    0,
    0,
    337,
    338,
    5,
    121,
    0,
    0,
    338,
    339,
    5,
    116,
    0,
    0,
    339,
    340,
    5,
    101,
    0,
    0,
    340,
    22,
    1,
    0,
    0,
    0,
    341,
    342,
    5,
    99,
    0,
    0,
    342,
    343,
    5,
    97,
    0,
    0,
    343,
    344,
    5,
    115,
    0,
    0,
    344,
    345,
    5,
    101,
    0,
    0,
    345,
    24,
    1,
    0,
    0,
    0,
    346,
    347,
    5,
    99,
    0,
    0,
    347,
    348,
    5,
    97,
    0,
    0,
    348,
    349,
    5,
    116,
    0,
    0,
    349,
    350,
    5,
    99,
    0,
    0,
    350,
    351,
    5,
    104,
    0,
    0,
    351,
    26,
    1,
    0,
    0,
    0,
    352,
    353,
    5,
    99,
    0,
    0,
    353,
    354,
    5,
    104,
    0,
    0,
    354,
    355,
    5,
    97,
    0,
    0,
    355,
    356,
    5,
    114,
    0,
    0,
    356,
    28,
    1,
    0,
    0,
    0,
    357,
    358,
    5,
    99,
    0,
    0,
    358,
    359,
    5,
    108,
    0,
    0,
    359,
    360,
    5,
    97,
    0,
    0,
    360,
    361,
    5,
    115,
    0,
    0,
    361,
    362,
    5,
    115,
    0,
    0,
    362,
    30,
    1,
    0,
    0,
    0,
    363,
    364,
    5,
    99,
    0,
    0,
    364,
    365,
    5,
    111,
    0,
    0,
    365,
    366,
    5,
    110,
    0,
    0,
    366,
    367,
    5,
    115,
    0,
    0,
    367,
    368,
    5,
    116,
    0,
    0,
    368,
    32,
    1,
    0,
    0,
    0,
    369,
    370,
    5,
    99,
    0,
    0,
    370,
    371,
    5,
    111,
    0,
    0,
    371,
    372,
    5,
    110,
    0,
    0,
    372,
    373,
    5,
    116,
    0,
    0,
    373,
    374,
    5,
    105,
    0,
    0,
    374,
    375,
    5,
    110,
    0,
    0,
    375,
    376,
    5,
    117,
    0,
    0,
    376,
    377,
    5,
    101,
    0,
    0,
    377,
    34,
    1,
    0,
    0,
    0,
    378,
    379,
    5,
    100,
    0,
    0,
    379,
    380,
    5,
    101,
    0,
    0,
    380,
    381,
    5,
    102,
    0,
    0,
    381,
    382,
    5,
    97,
    0,
    0,
    382,
    383,
    5,
    117,
    0,
    0,
    383,
    384,
    5,
    108,
    0,
    0,
    384,
    385,
    5,
    116,
    0,
    0,
    385,
    36,
    1,
    0,
    0,
    0,
    386,
    387,
    5,
    100,
    0,
    0,
    387,
    388,
    5,
    111,
    0,
    0,
    388,
    38,
    1,
    0,
    0,
    0,
    389,
    390,
    5,
    100,
    0,
    0,
    390,
    391,
    5,
    111,
    0,
    0,
    391,
    392,
    5,
    117,
    0,
    0,
    392,
    393,
    5,
    98,
    0,
    0,
    393,
    394,
    5,
    108,
    0,
    0,
    394,
    395,
    5,
    101,
    0,
    0,
    395,
    40,
    1,
    0,
    0,
    0,
    396,
    397,
    5,
    101,
    0,
    0,
    397,
    398,
    5,
    108,
    0,
    0,
    398,
    399,
    5,
    115,
    0,
    0,
    399,
    400,
    5,
    101,
    0,
    0,
    400,
    42,
    1,
    0,
    0,
    0,
    401,
    402,
    5,
    101,
    0,
    0,
    402,
    403,
    5,
    110,
    0,
    0,
    403,
    404,
    5,
    117,
    0,
    0,
    404,
    405,
    5,
    109,
    0,
    0,
    405,
    44,
    1,
    0,
    0,
    0,
    406,
    407,
    5,
    101,
    0,
    0,
    407,
    408,
    5,
    120,
    0,
    0,
    408,
    409,
    5,
    116,
    0,
    0,
    409,
    410,
    5,
    101,
    0,
    0,
    410,
    411,
    5,
    110,
    0,
    0,
    411,
    412,
    5,
    100,
    0,
    0,
    412,
    413,
    5,
    115,
    0,
    0,
    413,
    46,
    1,
    0,
    0,
    0,
    414,
    415,
    5,
    102,
    0,
    0,
    415,
    416,
    5,
    105,
    0,
    0,
    416,
    417,
    5,
    110,
    0,
    0,
    417,
    418,
    5,
    97,
    0,
    0,
    418,
    419,
    5,
    108,
    0,
    0,
    419,
    48,
    1,
    0,
    0,
    0,
    420,
    421,
    5,
    102,
    0,
    0,
    421,
    422,
    5,
    105,
    0,
    0,
    422,
    423,
    5,
    110,
    0,
    0,
    423,
    424,
    5,
    97,
    0,
    0,
    424,
    425,
    5,
    108,
    0,
    0,
    425,
    426,
    5,
    108,
    0,
    0,
    426,
    427,
    5,
    121,
    0,
    0,
    427,
    50,
    1,
    0,
    0,
    0,
    428,
    429,
    5,
    102,
    0,
    0,
    429,
    430,
    5,
    108,
    0,
    0,
    430,
    431,
    5,
    111,
    0,
    0,
    431,
    432,
    5,
    97,
    0,
    0,
    432,
    433,
    5,
    116,
    0,
    0,
    433,
    52,
    1,
    0,
    0,
    0,
    434,
    435,
    5,
    102,
    0,
    0,
    435,
    436,
    5,
    111,
    0,
    0,
    436,
    437,
    5,
    114,
    0,
    0,
    437,
    54,
    1,
    0,
    0,
    0,
    438,
    439,
    5,
    105,
    0,
    0,
    439,
    440,
    5,
    102,
    0,
    0,
    440,
    56,
    1,
    0,
    0,
    0,
    441,
    442,
    5,
    103,
    0,
    0,
    442,
    443,
    5,
    111,
    0,
    0,
    443,
    444,
    5,
    116,
    0,
    0,
    444,
    445,
    5,
    111,
    0,
    0,
    445,
    58,
    1,
    0,
    0,
    0,
    446,
    447,
    5,
    105,
    0,
    0,
    447,
    448,
    5,
    109,
    0,
    0,
    448,
    449,
    5,
    112,
    0,
    0,
    449,
    450,
    5,
    108,
    0,
    0,
    450,
    451,
    5,
    101,
    0,
    0,
    451,
    452,
    5,
    109,
    0,
    0,
    452,
    453,
    5,
    101,
    0,
    0,
    453,
    454,
    5,
    110,
    0,
    0,
    454,
    455,
    5,
    116,
    0,
    0,
    455,
    456,
    5,
    115,
    0,
    0,
    456,
    60,
    1,
    0,
    0,
    0,
    457,
    458,
    5,
    105,
    0,
    0,
    458,
    459,
    5,
    109,
    0,
    0,
    459,
    460,
    5,
    112,
    0,
    0,
    460,
    461,
    5,
    111,
    0,
    0,
    461,
    462,
    5,
    114,
    0,
    0,
    462,
    463,
    5,
    116,
    0,
    0,
    463,
    62,
    1,
    0,
    0,
    0,
    464,
    465,
    5,
    105,
    0,
    0,
    465,
    466,
    5,
    110,
    0,
    0,
    466,
    467,
    5,
    115,
    0,
    0,
    467,
    468,
    5,
    116,
    0,
    0,
    468,
    469,
    5,
    97,
    0,
    0,
    469,
    470,
    5,
    110,
    0,
    0,
    470,
    471,
    5,
    99,
    0,
    0,
    471,
    472,
    5,
    101,
    0,
    0,
    472,
    473,
    5,
    111,
    0,
    0,
    473,
    474,
    5,
    102,
    0,
    0,
    474,
    64,
    1,
    0,
    0,
    0,
    475,
    476,
    5,
    105,
    0,
    0,
    476,
    477,
    5,
    110,
    0,
    0,
    477,
    478,
    5,
    116,
    0,
    0,
    478,
    66,
    1,
    0,
    0,
    0,
    479,
    480,
    5,
    105,
    0,
    0,
    480,
    481,
    5,
    110,
    0,
    0,
    481,
    482,
    5,
    116,
    0,
    0,
    482,
    483,
    5,
    101,
    0,
    0,
    483,
    484,
    5,
    114,
    0,
    0,
    484,
    485,
    5,
    102,
    0,
    0,
    485,
    486,
    5,
    97,
    0,
    0,
    486,
    487,
    5,
    99,
    0,
    0,
    487,
    488,
    5,
    101,
    0,
    0,
    488,
    68,
    1,
    0,
    0,
    0,
    489,
    490,
    5,
    108,
    0,
    0,
    490,
    491,
    5,
    111,
    0,
    0,
    491,
    492,
    5,
    110,
    0,
    0,
    492,
    493,
    5,
    103,
    0,
    0,
    493,
    70,
    1,
    0,
    0,
    0,
    494,
    495,
    5,
    110,
    0,
    0,
    495,
    496,
    5,
    97,
    0,
    0,
    496,
    497,
    5,
    116,
    0,
    0,
    497,
    498,
    5,
    105,
    0,
    0,
    498,
    499,
    5,
    118,
    0,
    0,
    499,
    500,
    5,
    101,
    0,
    0,
    500,
    72,
    1,
    0,
    0,
    0,
    501,
    502,
    5,
    110,
    0,
    0,
    502,
    503,
    5,
    101,
    0,
    0,
    503,
    504,
    5,
    119,
    0,
    0,
    504,
    74,
    1,
    0,
    0,
    0,
    505,
    506,
    5,
    112,
    0,
    0,
    506,
    507,
    5,
    97,
    0,
    0,
    507,
    508,
    5,
    99,
    0,
    0,
    508,
    509,
    5,
    107,
    0,
    0,
    509,
    510,
    5,
    97,
    0,
    0,
    510,
    511,
    5,
    103,
    0,
    0,
    511,
    512,
    5,
    101,
    0,
    0,
    512,
    76,
    1,
    0,
    0,
    0,
    513,
    514,
    5,
    112,
    0,
    0,
    514,
    515,
    5,
    114,
    0,
    0,
    515,
    516,
    5,
    105,
    0,
    0,
    516,
    517,
    5,
    118,
    0,
    0,
    517,
    518,
    5,
    97,
    0,
    0,
    518,
    519,
    5,
    116,
    0,
    0,
    519,
    520,
    5,
    101,
    0,
    0,
    520,
    78,
    1,
    0,
    0,
    0,
    521,
    522,
    5,
    112,
    0,
    0,
    522,
    523,
    5,
    114,
    0,
    0,
    523,
    524,
    5,
    111,
    0,
    0,
    524,
    525,
    5,
    116,
    0,
    0,
    525,
    526,
    5,
    101,
    0,
    0,
    526,
    527,
    5,
    99,
    0,
    0,
    527,
    528,
    5,
    116,
    0,
    0,
    528,
    529,
    5,
    101,
    0,
    0,
    529,
    530,
    5,
    100,
    0,
    0,
    530,
    80,
    1,
    0,
    0,
    0,
    531,
    532,
    5,
    112,
    0,
    0,
    532,
    533,
    5,
    117,
    0,
    0,
    533,
    534,
    5,
    98,
    0,
    0,
    534,
    535,
    5,
    108,
    0,
    0,
    535,
    536,
    5,
    105,
    0,
    0,
    536,
    537,
    5,
    99,
    0,
    0,
    537,
    82,
    1,
    0,
    0,
    0,
    538,
    539,
    5,
    114,
    0,
    0,
    539,
    540,
    5,
    101,
    0,
    0,
    540,
    541,
    5,
    116,
    0,
    0,
    541,
    542,
    5,
    117,
    0,
    0,
    542,
    543,
    5,
    114,
    0,
    0,
    543,
    544,
    5,
    110,
    0,
    0,
    544,
    84,
    1,
    0,
    0,
    0,
    545,
    546,
    5,
    115,
    0,
    0,
    546,
    547,
    5,
    104,
    0,
    0,
    547,
    548,
    5,
    111,
    0,
    0,
    548,
    549,
    5,
    114,
    0,
    0,
    549,
    550,
    5,
    116,
    0,
    0,
    550,
    86,
    1,
    0,
    0,
    0,
    551,
    552,
    5,
    115,
    0,
    0,
    552,
    553,
    5,
    116,
    0,
    0,
    553,
    554,
    5,
    97,
    0,
    0,
    554,
    555,
    5,
    116,
    0,
    0,
    555,
    556,
    5,
    105,
    0,
    0,
    556,
    557,
    5,
    99,
    0,
    0,
    557,
    88,
    1,
    0,
    0,
    0,
    558,
    559,
    5,
    115,
    0,
    0,
    559,
    560,
    5,
    116,
    0,
    0,
    560,
    561,
    5,
    114,
    0,
    0,
    561,
    562,
    5,
    105,
    0,
    0,
    562,
    563,
    5,
    99,
    0,
    0,
    563,
    564,
    5,
    116,
    0,
    0,
    564,
    565,
    5,
    102,
    0,
    0,
    565,
    566,
    5,
    112,
    0,
    0,
    566,
    90,
    1,
    0,
    0,
    0,
    567,
    568,
    5,
    115,
    0,
    0,
    568,
    569,
    5,
    117,
    0,
    0,
    569,
    570,
    5,
    112,
    0,
    0,
    570,
    571,
    5,
    101,
    0,
    0,
    571,
    572,
    5,
    114,
    0,
    0,
    572,
    92,
    1,
    0,
    0,
    0,
    573,
    574,
    5,
    115,
    0,
    0,
    574,
    575,
    5,
    119,
    0,
    0,
    575,
    576,
    5,
    105,
    0,
    0,
    576,
    577,
    5,
    116,
    0,
    0,
    577,
    578,
    5,
    99,
    0,
    0,
    578,
    579,
    5,
    104,
    0,
    0,
    579,
    94,
    1,
    0,
    0,
    0,
    580,
    581,
    5,
    115,
    0,
    0,
    581,
    582,
    5,
    121,
    0,
    0,
    582,
    583,
    5,
    110,
    0,
    0,
    583,
    584,
    5,
    99,
    0,
    0,
    584,
    585,
    5,
    104,
    0,
    0,
    585,
    586,
    5,
    114,
    0,
    0,
    586,
    587,
    5,
    111,
    0,
    0,
    587,
    588,
    5,
    110,
    0,
    0,
    588,
    589,
    5,
    105,
    0,
    0,
    589,
    590,
    5,
    122,
    0,
    0,
    590,
    591,
    5,
    101,
    0,
    0,
    591,
    592,
    5,
    100,
    0,
    0,
    592,
    96,
    1,
    0,
    0,
    0,
    593,
    594,
    5,
    116,
    0,
    0,
    594,
    595,
    5,
    104,
    0,
    0,
    595,
    596,
    5,
    105,
    0,
    0,
    596,
    597,
    5,
    115,
    0,
    0,
    597,
    98,
    1,
    0,
    0,
    0,
    598,
    599,
    5,
    116,
    0,
    0,
    599,
    600,
    5,
    104,
    0,
    0,
    600,
    601,
    5,
    114,
    0,
    0,
    601,
    602,
    5,
    111,
    0,
    0,
    602,
    603,
    5,
    119,
    0,
    0,
    603,
    100,
    1,
    0,
    0,
    0,
    604,
    605,
    5,
    116,
    0,
    0,
    605,
    606,
    5,
    104,
    0,
    0,
    606,
    607,
    5,
    114,
    0,
    0,
    607,
    608,
    5,
    111,
    0,
    0,
    608,
    609,
    5,
    119,
    0,
    0,
    609,
    610,
    5,
    115,
    0,
    0,
    610,
    102,
    1,
    0,
    0,
    0,
    611,
    612,
    5,
    116,
    0,
    0,
    612,
    613,
    5,
    114,
    0,
    0,
    613,
    614,
    5,
    97,
    0,
    0,
    614,
    615,
    5,
    110,
    0,
    0,
    615,
    616,
    5,
    115,
    0,
    0,
    616,
    617,
    5,
    105,
    0,
    0,
    617,
    618,
    5,
    101,
    0,
    0,
    618,
    619,
    5,
    110,
    0,
    0,
    619,
    620,
    5,
    116,
    0,
    0,
    620,
    104,
    1,
    0,
    0,
    0,
    621,
    622,
    5,
    116,
    0,
    0,
    622,
    623,
    5,
    114,
    0,
    0,
    623,
    624,
    5,
    121,
    0,
    0,
    624,
    106,
    1,
    0,
    0,
    0,
    625,
    626,
    5,
    118,
    0,
    0,
    626,
    627,
    5,
    97,
    0,
    0,
    627,
    628,
    5,
    114,
    0,
    0,
    628,
    108,
    1,
    0,
    0,
    0,
    629,
    630,
    5,
    118,
    0,
    0,
    630,
    631,
    5,
    111,
    0,
    0,
    631,
    632,
    5,
    105,
    0,
    0,
    632,
    633,
    5,
    100,
    0,
    0,
    633,
    110,
    1,
    0,
    0,
    0,
    634,
    635,
    5,
    118,
    0,
    0,
    635,
    636,
    5,
    111,
    0,
    0,
    636,
    637,
    5,
    108,
    0,
    0,
    637,
    638,
    5,
    97,
    0,
    0,
    638,
    639,
    5,
    116,
    0,
    0,
    639,
    640,
    5,
    105,
    0,
    0,
    640,
    641,
    5,
    108,
    0,
    0,
    641,
    642,
    5,
    101,
    0,
    0,
    642,
    112,
    1,
    0,
    0,
    0,
    643,
    644,
    5,
    119,
    0,
    0,
    644,
    645,
    5,
    104,
    0,
    0,
    645,
    646,
    5,
    105,
    0,
    0,
    646,
    647,
    5,
    108,
    0,
    0,
    647,
    648,
    5,
    101,
    0,
    0,
    648,
    114,
    1,
    0,
    0,
    0,
    649,
    663,
    5,
    48,
    0,
    0,
    650,
    660,
    7,
    3,
    0,
    0,
    651,
    653,
    3,
    239,
    119,
    0,
    652,
    651,
    1,
    0,
    0,
    0,
    652,
    653,
    1,
    0,
    0,
    0,
    653,
    661,
    1,
    0,
    0,
    0,
    654,
    656,
    5,
    95,
    0,
    0,
    655,
    654,
    1,
    0,
    0,
    0,
    656,
    657,
    1,
    0,
    0,
    0,
    657,
    655,
    1,
    0,
    0,
    0,
    657,
    658,
    1,
    0,
    0,
    0,
    658,
    659,
    1,
    0,
    0,
    0,
    659,
    661,
    3,
    239,
    119,
    0,
    660,
    652,
    1,
    0,
    0,
    0,
    660,
    655,
    1,
    0,
    0,
    0,
    661,
    663,
    1,
    0,
    0,
    0,
    662,
    649,
    1,
    0,
    0,
    0,
    662,
    650,
    1,
    0,
    0,
    0,
    663,
    665,
    1,
    0,
    0,
    0,
    664,
    666,
    7,
    4,
    0,
    0,
    665,
    664,
    1,
    0,
    0,
    0,
    665,
    666,
    1,
    0,
    0,
    0,
    666,
    116,
    1,
    0,
    0,
    0,
    667,
    668,
    5,
    48,
    0,
    0,
    668,
    669,
    7,
    5,
    0,
    0,
    669,
    677,
    7,
    6,
    0,
    0,
    670,
    672,
    7,
    7,
    0,
    0,
    671,
    670,
    1,
    0,
    0,
    0,
    672,
    675,
    1,
    0,
    0,
    0,
    673,
    671,
    1,
    0,
    0,
    0,
    673,
    674,
    1,
    0,
    0,
    0,
    674,
    676,
    1,
    0,
    0,
    0,
    675,
    673,
    1,
    0,
    0,
    0,
    676,
    678,
    7,
    6,
    0,
    0,
    677,
    673,
    1,
    0,
    0,
    0,
    677,
    678,
    1,
    0,
    0,
    0,
    678,
    680,
    1,
    0,
    0,
    0,
    679,
    681,
    7,
    4,
    0,
    0,
    680,
    679,
    1,
    0,
    0,
    0,
    680,
    681,
    1,
    0,
    0,
    0,
    681,
    118,
    1,
    0,
    0,
    0,
    682,
    686,
    5,
    48,
    0,
    0,
    683,
    685,
    5,
    95,
    0,
    0,
    684,
    683,
    1,
    0,
    0,
    0,
    685,
    688,
    1,
    0,
    0,
    0,
    686,
    684,
    1,
    0,
    0,
    0,
    686,
    687,
    1,
    0,
    0,
    0,
    687,
    689,
    1,
    0,
    0,
    0,
    688,
    686,
    1,
    0,
    0,
    0,
    689,
    697,
    7,
    8,
    0,
    0,
    690,
    692,
    7,
    9,
    0,
    0,
    691,
    690,
    1,
    0,
    0,
    0,
    692,
    695,
    1,
    0,
    0,
    0,
    693,
    691,
    1,
    0,
    0,
    0,
    693,
    694,
    1,
    0,
    0,
    0,
    694,
    696,
    1,
    0,
    0,
    0,
    695,
    693,
    1,
    0,
    0,
    0,
    696,
    698,
    7,
    8,
    0,
    0,
    697,
    693,
    1,
    0,
    0,
    0,
    697,
    698,
    1,
    0,
    0,
    0,
    698,
    700,
    1,
    0,
    0,
    0,
    699,
    701,
    7,
    4,
    0,
    0,
    700,
    699,
    1,
    0,
    0,
    0,
    700,
    701,
    1,
    0,
    0,
    0,
    701,
    120,
    1,
    0,
    0,
    0,
    702,
    703,
    5,
    48,
    0,
    0,
    703,
    704,
    7,
    10,
    0,
    0,
    704,
    712,
    7,
    11,
    0,
    0,
    705,
    707,
    7,
    12,
    0,
    0,
    706,
    705,
    1,
    0,
    0,
    0,
    707,
    710,
    1,
    0,
    0,
    0,
    708,
    706,
    1,
    0,
    0,
    0,
    708,
    709,
    1,
    0,
    0,
    0,
    709,
    711,
    1,
    0,
    0,
    0,
    710,
    708,
    1,
    0,
    0,
    0,
    711,
    713,
    7,
    11,
    0,
    0,
    712,
    708,
    1,
    0,
    0,
    0,
    712,
    713,
    1,
    0,
    0,
    0,
    713,
    715,
    1,
    0,
    0,
    0,
    714,
    716,
    7,
    4,
    0,
    0,
    715,
    714,
    1,
    0,
    0,
    0,
    715,
    716,
    1,
    0,
    0,
    0,
    716,
    122,
    1,
    0,
    0,
    0,
    717,
    718,
    3,
    239,
    119,
    0,
    718,
    720,
    5,
    46,
    0,
    0,
    719,
    721,
    3,
    239,
    119,
    0,
    720,
    719,
    1,
    0,
    0,
    0,
    720,
    721,
    1,
    0,
    0,
    0,
    721,
    725,
    1,
    0,
    0,
    0,
    722,
    723,
    5,
    46,
    0,
    0,
    723,
    725,
    3,
    239,
    119,
    0,
    724,
    717,
    1,
    0,
    0,
    0,
    724,
    722,
    1,
    0,
    0,
    0,
    725,
    727,
    1,
    0,
    0,
    0,
    726,
    728,
    3,
    231,
    115,
    0,
    727,
    726,
    1,
    0,
    0,
    0,
    727,
    728,
    1,
    0,
    0,
    0,
    728,
    730,
    1,
    0,
    0,
    0,
    729,
    731,
    7,
    13,
    0,
    0,
    730,
    729,
    1,
    0,
    0,
    0,
    730,
    731,
    1,
    0,
    0,
    0,
    731,
    741,
    1,
    0,
    0,
    0,
    732,
    738,
    3,
    239,
    119,
    0,
    733,
    735,
    3,
    231,
    115,
    0,
    734,
    736,
    7,
    13,
    0,
    0,
    735,
    734,
    1,
    0,
    0,
    0,
    735,
    736,
    1,
    0,
    0,
    0,
    736,
    739,
    1,
    0,
    0,
    0,
    737,
    739,
    7,
    13,
    0,
    0,
    738,
    733,
    1,
    0,
    0,
    0,
    738,
    737,
    1,
    0,
    0,
    0,
    739,
    741,
    1,
    0,
    0,
    0,
    740,
    724,
    1,
    0,
    0,
    0,
    740,
    732,
    1,
    0,
    0,
    0,
    741,
    124,
    1,
    0,
    0,
    0,
    742,
    743,
    5,
    48,
    0,
    0,
    743,
    753,
    7,
    5,
    0,
    0,
    744,
    746,
    3,
    235,
    117,
    0,
    745,
    747,
    5,
    46,
    0,
    0,
    746,
    745,
    1,
    0,
    0,
    0,
    746,
    747,
    1,
    0,
    0,
    0,
    747,
    754,
    1,
    0,
    0,
    0,
    748,
    750,
    3,
    235,
    117,
    0,
    749,
    748,
    1,
    0,
    0,
    0,
    749,
    750,
    1,
    0,
    0,
    0,
    750,
    751,
    1,
    0,
    0,
    0,
    751,
    752,
    5,
    46,
    0,
    0,
    752,
    754,
    3,
    235,
    117,
    0,
    753,
    744,
    1,
    0,
    0,
    0,
    753,
    749,
    1,
    0,
    0,
    0,
    754,
    755,
    1,
    0,
    0,
    0,
    755,
    757,
    7,
    14,
    0,
    0,
    756,
    758,
    7,
    15,
    0,
    0,
    757,
    756,
    1,
    0,
    0,
    0,
    757,
    758,
    1,
    0,
    0,
    0,
    758,
    759,
    1,
    0,
    0,
    0,
    759,
    761,
    3,
    239,
    119,
    0,
    760,
    762,
    7,
    13,
    0,
    0,
    761,
    760,
    1,
    0,
    0,
    0,
    761,
    762,
    1,
    0,
    0,
    0,
    762,
    126,
    1,
    0,
    0,
    0,
    763,
    764,
    5,
    116,
    0,
    0,
    764,
    765,
    5,
    114,
    0,
    0,
    765,
    766,
    5,
    117,
    0,
    0,
    766,
    773,
    5,
    101,
    0,
    0,
    767,
    768,
    5,
    102,
    0,
    0,
    768,
    769,
    5,
    97,
    0,
    0,
    769,
    770,
    5,
    108,
    0,
    0,
    770,
    771,
    5,
    115,
    0,
    0,
    771,
    773,
    5,
    101,
    0,
    0,
    772,
    763,
    1,
    0,
    0,
    0,
    772,
    767,
    1,
    0,
    0,
    0,
    773,
    128,
    1,
    0,
    0,
    0,
    774,
    779,
    5,
    34,
    0,
    0,
    775,
    778,
    8,
    16,
    0,
    0,
    776,
    778,
    3,
    233,
    116,
    0,
    777,
    775,
    1,
    0,
    0,
    0,
    777,
    776,
    1,
    0,
    0,
    0,
    778,
    781,
    1,
    0,
    0,
    0,
    779,
    777,
    1,
    0,
    0,
    0,
    779,
    780,
    1,
    0,
    0,
    0,
    780,
    782,
    1,
    0,
    0,
    0,
    781,
    779,
    1,
    0,
    0,
    0,
    782,
    783,
    5,
    34,
    0,
    0,
    783,
    130,
    1,
    0,
    0,
    0,
    784,
    785,
    5,
    34,
    0,
    0,
    785,
    786,
    5,
    34,
    0,
    0,
    786,
    787,
    5,
    34,
    0,
    0,
    787,
    792,
    1,
    0,
    0,
    0,
    788,
    791,
    8,
    17,
    0,
    0,
    789,
    791,
    3,
    233,
    116,
    0,
    790,
    788,
    1,
    0,
    0,
    0,
    790,
    789,
    1,
    0,
    0,
    0,
    791,
    794,
    1,
    0,
    0,
    0,
    792,
    793,
    1,
    0,
    0,
    0,
    792,
    790,
    1,
    0,
    0,
    0,
    793,
    795,
    1,
    0,
    0,
    0,
    794,
    792,
    1,
    0,
    0,
    0,
    795,
    796,
    5,
    34,
    0,
    0,
    796,
    797,
    5,
    34,
    0,
    0,
    797,
    798,
    5,
    34,
    0,
    0,
    798,
    132,
    1,
    0,
    0,
    0,
    799,
    800,
    5,
    110,
    0,
    0,
    800,
    801,
    5,
    117,
    0,
    0,
    801,
    802,
    5,
    108,
    0,
    0,
    802,
    803,
    5,
    108,
    0,
    0,
    803,
    134,
    1,
    0,
    0,
    0,
    804,
    805,
    5,
    40,
    0,
    0,
    805,
    136,
    1,
    0,
    0,
    0,
    806,
    807,
    5,
    41,
    0,
    0,
    807,
    138,
    1,
    0,
    0,
    0,
    808,
    809,
    5,
    123,
    0,
    0,
    809,
    140,
    1,
    0,
    0,
    0,
    810,
    811,
    5,
    125,
    0,
    0,
    811,
    142,
    1,
    0,
    0,
    0,
    812,
    813,
    5,
    91,
    0,
    0,
    813,
    144,
    1,
    0,
    0,
    0,
    814,
    815,
    5,
    93,
    0,
    0,
    815,
    146,
    1,
    0,
    0,
    0,
    816,
    817,
    5,
    59,
    0,
    0,
    817,
    148,
    1,
    0,
    0,
    0,
    818,
    819,
    5,
    44,
    0,
    0,
    819,
    150,
    1,
    0,
    0,
    0,
    820,
    821,
    5,
    46,
    0,
    0,
    821,
    152,
    1,
    0,
    0,
    0,
    822,
    823,
    5,
    61,
    0,
    0,
    823,
    154,
    1,
    0,
    0,
    0,
    824,
    825,
    5,
    62,
    0,
    0,
    825,
    156,
    1,
    0,
    0,
    0,
    826,
    827,
    5,
    60,
    0,
    0,
    827,
    158,
    1,
    0,
    0,
    0,
    828,
    829,
    5,
    33,
    0,
    0,
    829,
    160,
    1,
    0,
    0,
    0,
    830,
    831,
    5,
    126,
    0,
    0,
    831,
    162,
    1,
    0,
    0,
    0,
    832,
    833,
    5,
    63,
    0,
    0,
    833,
    164,
    1,
    0,
    0,
    0,
    834,
    835,
    5,
    58,
    0,
    0,
    835,
    166,
    1,
    0,
    0,
    0,
    836,
    837,
    5,
    61,
    0,
    0,
    837,
    838,
    5,
    61,
    0,
    0,
    838,
    168,
    1,
    0,
    0,
    0,
    839,
    840,
    5,
    60,
    0,
    0,
    840,
    841,
    5,
    61,
    0,
    0,
    841,
    170,
    1,
    0,
    0,
    0,
    842,
    843,
    5,
    62,
    0,
    0,
    843,
    844,
    5,
    61,
    0,
    0,
    844,
    172,
    1,
    0,
    0,
    0,
    845,
    846,
    5,
    33,
    0,
    0,
    846,
    847,
    5,
    61,
    0,
    0,
    847,
    174,
    1,
    0,
    0,
    0,
    848,
    849,
    5,
    38,
    0,
    0,
    849,
    850,
    5,
    38,
    0,
    0,
    850,
    176,
    1,
    0,
    0,
    0,
    851,
    852,
    5,
    124,
    0,
    0,
    852,
    853,
    5,
    124,
    0,
    0,
    853,
    178,
    1,
    0,
    0,
    0,
    854,
    855,
    5,
    43,
    0,
    0,
    855,
    856,
    5,
    43,
    0,
    0,
    856,
    180,
    1,
    0,
    0,
    0,
    857,
    858,
    5,
    45,
    0,
    0,
    858,
    859,
    5,
    45,
    0,
    0,
    859,
    182,
    1,
    0,
    0,
    0,
    860,
    861,
    5,
    43,
    0,
    0,
    861,
    184,
    1,
    0,
    0,
    0,
    862,
    863,
    5,
    45,
    0,
    0,
    863,
    186,
    1,
    0,
    0,
    0,
    864,
    865,
    5,
    42,
    0,
    0,
    865,
    188,
    1,
    0,
    0,
    0,
    866,
    867,
    5,
    47,
    0,
    0,
    867,
    190,
    1,
    0,
    0,
    0,
    868,
    869,
    5,
    38,
    0,
    0,
    869,
    192,
    1,
    0,
    0,
    0,
    870,
    871,
    5,
    124,
    0,
    0,
    871,
    194,
    1,
    0,
    0,
    0,
    872,
    873,
    5,
    94,
    0,
    0,
    873,
    196,
    1,
    0,
    0,
    0,
    874,
    875,
    5,
    37,
    0,
    0,
    875,
    198,
    1,
    0,
    0,
    0,
    876,
    877,
    5,
    43,
    0,
    0,
    877,
    878,
    5,
    61,
    0,
    0,
    878,
    200,
    1,
    0,
    0,
    0,
    879,
    880,
    5,
    45,
    0,
    0,
    880,
    881,
    5,
    61,
    0,
    0,
    881,
    202,
    1,
    0,
    0,
    0,
    882,
    883,
    5,
    42,
    0,
    0,
    883,
    884,
    5,
    61,
    0,
    0,
    884,
    204,
    1,
    0,
    0,
    0,
    885,
    886,
    5,
    47,
    0,
    0,
    886,
    887,
    5,
    61,
    0,
    0,
    887,
    206,
    1,
    0,
    0,
    0,
    888,
    889,
    5,
    38,
    0,
    0,
    889,
    890,
    5,
    61,
    0,
    0,
    890,
    208,
    1,
    0,
    0,
    0,
    891,
    892,
    5,
    124,
    0,
    0,
    892,
    893,
    5,
    61,
    0,
    0,
    893,
    210,
    1,
    0,
    0,
    0,
    894,
    895,
    5,
    94,
    0,
    0,
    895,
    896,
    5,
    61,
    0,
    0,
    896,
    212,
    1,
    0,
    0,
    0,
    897,
    898,
    5,
    37,
    0,
    0,
    898,
    899,
    5,
    61,
    0,
    0,
    899,
    214,
    1,
    0,
    0,
    0,
    900,
    901,
    5,
    60,
    0,
    0,
    901,
    902,
    5,
    60,
    0,
    0,
    902,
    903,
    5,
    61,
    0,
    0,
    903,
    216,
    1,
    0,
    0,
    0,
    904,
    905,
    5,
    62,
    0,
    0,
    905,
    906,
    5,
    62,
    0,
    0,
    906,
    907,
    5,
    61,
    0,
    0,
    907,
    218,
    1,
    0,
    0,
    0,
    908,
    909,
    5,
    62,
    0,
    0,
    909,
    910,
    5,
    62,
    0,
    0,
    910,
    911,
    5,
    62,
    0,
    0,
    911,
    912,
    5,
    61,
    0,
    0,
    912,
    220,
    1,
    0,
    0,
    0,
    913,
    914,
    5,
    45,
    0,
    0,
    914,
    915,
    5,
    62,
    0,
    0,
    915,
    222,
    1,
    0,
    0,
    0,
    916,
    917,
    5,
    58,
    0,
    0,
    917,
    918,
    5,
    58,
    0,
    0,
    918,
    224,
    1,
    0,
    0,
    0,
    919,
    920,
    5,
    64,
    0,
    0,
    920,
    226,
    1,
    0,
    0,
    0,
    921,
    922,
    5,
    46,
    0,
    0,
    922,
    923,
    5,
    46,
    0,
    0,
    923,
    924,
    5,
    46,
    0,
    0,
    924,
    228,
    1,
    0,
    0,
    0,
    925,
    929,
    3,
    243,
    121,
    0,
    926,
    928,
    3,
    241,
    120,
    0,
    927,
    926,
    1,
    0,
    0,
    0,
    928,
    931,
    1,
    0,
    0,
    0,
    929,
    927,
    1,
    0,
    0,
    0,
    929,
    930,
    1,
    0,
    0,
    0,
    930,
    230,
    1,
    0,
    0,
    0,
    931,
    929,
    1,
    0,
    0,
    0,
    932,
    934,
    7,
    18,
    0,
    0,
    933,
    935,
    7,
    15,
    0,
    0,
    934,
    933,
    1,
    0,
    0,
    0,
    934,
    935,
    1,
    0,
    0,
    0,
    935,
    936,
    1,
    0,
    0,
    0,
    936,
    937,
    3,
    239,
    119,
    0,
    937,
    232,
    1,
    0,
    0,
    0,
    938,
    939,
    5,
    92,
    0,
    0,
    939,
    960,
    7,
    19,
    0,
    0,
    940,
    945,
    5,
    92,
    0,
    0,
    941,
    943,
    7,
    20,
    0,
    0,
    942,
    941,
    1,
    0,
    0,
    0,
    942,
    943,
    1,
    0,
    0,
    0,
    943,
    944,
    1,
    0,
    0,
    0,
    944,
    946,
    7,
    8,
    0,
    0,
    945,
    942,
    1,
    0,
    0,
    0,
    945,
    946,
    1,
    0,
    0,
    0,
    946,
    947,
    1,
    0,
    0,
    0,
    947,
    960,
    7,
    8,
    0,
    0,
    948,
    950,
    5,
    92,
    0,
    0,
    949,
    951,
    5,
    117,
    0,
    0,
    950,
    949,
    1,
    0,
    0,
    0,
    951,
    952,
    1,
    0,
    0,
    0,
    952,
    950,
    1,
    0,
    0,
    0,
    952,
    953,
    1,
    0,
    0,
    0,
    953,
    954,
    1,
    0,
    0,
    0,
    954,
    955,
    3,
    237,
    118,
    0,
    955,
    956,
    3,
    237,
    118,
    0,
    956,
    957,
    3,
    237,
    118,
    0,
    957,
    958,
    3,
    237,
    118,
    0,
    958,
    960,
    1,
    0,
    0,
    0,
    959,
    938,
    1,
    0,
    0,
    0,
    959,
    940,
    1,
    0,
    0,
    0,
    959,
    948,
    1,
    0,
    0,
    0,
    960,
    234,
    1,
    0,
    0,
    0,
    961,
    970,
    3,
    237,
    118,
    0,
    962,
    965,
    3,
    237,
    118,
    0,
    963,
    965,
    5,
    95,
    0,
    0,
    964,
    962,
    1,
    0,
    0,
    0,
    964,
    963,
    1,
    0,
    0,
    0,
    965,
    968,
    1,
    0,
    0,
    0,
    966,
    964,
    1,
    0,
    0,
    0,
    966,
    967,
    1,
    0,
    0,
    0,
    967,
    969,
    1,
    0,
    0,
    0,
    968,
    966,
    1,
    0,
    0,
    0,
    969,
    971,
    3,
    237,
    118,
    0,
    970,
    966,
    1,
    0,
    0,
    0,
    970,
    971,
    1,
    0,
    0,
    0,
    971,
    236,
    1,
    0,
    0,
    0,
    972,
    973,
    7,
    6,
    0,
    0,
    973,
    238,
    1,
    0,
    0,
    0,
    974,
    982,
    7,
    21,
    0,
    0,
    975,
    977,
    7,
    22,
    0,
    0,
    976,
    975,
    1,
    0,
    0,
    0,
    977,
    980,
    1,
    0,
    0,
    0,
    978,
    976,
    1,
    0,
    0,
    0,
    978,
    979,
    1,
    0,
    0,
    0,
    979,
    981,
    1,
    0,
    0,
    0,
    980,
    978,
    1,
    0,
    0,
    0,
    981,
    983,
    7,
    21,
    0,
    0,
    982,
    978,
    1,
    0,
    0,
    0,
    982,
    983,
    1,
    0,
    0,
    0,
    983,
    240,
    1,
    0,
    0,
    0,
    984,
    987,
    3,
    243,
    121,
    0,
    985,
    987,
    7,
    21,
    0,
    0,
    986,
    984,
    1,
    0,
    0,
    0,
    986,
    985,
    1,
    0,
    0,
    0,
    987,
    242,
    1,
    0,
    0,
    0,
    988,
    993,
    7,
    23,
    0,
    0,
    989,
    993,
    8,
    24,
    0,
    0,
    990,
    991,
    7,
    25,
    0,
    0,
    991,
    993,
    7,
    26,
    0,
    0,
    992,
    988,
    1,
    0,
    0,
    0,
    992,
    989,
    1,
    0,
    0,
    0,
    992,
    990,
    1,
    0,
    0,
    0,
    993,
    244,
    1,
    0,
    0,
    0,
    52,
    0,
    255,
    267,
    277,
    291,
    299,
    301,
    652,
    657,
    660,
    662,
    665,
    673,
    677,
    680,
    686,
    693,
    697,
    700,
    708,
    712,
    715,
    720,
    724,
    727,
    730,
    735,
    738,
    740,
    746,
    749,
    753,
    757,
    761,
    772,
    777,
    779,
    790,
    792,
    929,
    934,
    942,
    945,
    952,
    959,
    964,
    966,
    970,
    978,
    982,
    986,
    992,
    2,
    0,
    1,
    0,
    0,
    2,
    0
  ];
  static __ATN;
  static get _ATN() {
    return ProcessingLexer.__ATN || (ProcessingLexer.__ATN = new We().deserialize(ProcessingLexer._serializedATN)), ProcessingLexer.__ATN;
  }
  static DecisionsToDFA = ProcessingLexer._ATN.decisionToState.map((ds, index) => new Qe(ds, index));
}
class ProcessingParser extends xn {
  static T__0 = 1;
  static HexColorLiteral = 2;
  static WS = 3;
  static COMMENT = 4;
  static LINE_COMMENT = 5;
  static CHAR_LITERAL = 6;
  static ABSTRACT = 7;
  static ASSERT = 8;
  static BOOLEAN = 9;
  static BREAK = 10;
  static BYTE = 11;
  static CASE = 12;
  static CATCH = 13;
  static CHAR = 14;
  static CLASS = 15;
  static CONST = 16;
  static CONTINUE = 17;
  static DEFAULT = 18;
  static DO = 19;
  static DOUBLE = 20;
  static ELSE = 21;
  static ENUM = 22;
  static EXTENDS = 23;
  static FINAL = 24;
  static FINALLY = 25;
  static FLOAT = 26;
  static FOR = 27;
  static IF = 28;
  static GOTO = 29;
  static IMPLEMENTS = 30;
  static IMPORT = 31;
  static INSTANCEOF = 32;
  static INT = 33;
  static INTERFACE = 34;
  static LONG = 35;
  static NATIVE = 36;
  static NEW = 37;
  static PACKAGE = 38;
  static PRIVATE = 39;
  static PROTECTED = 40;
  static PUBLIC = 41;
  static RETURN = 42;
  static SHORT = 43;
  static STATIC = 44;
  static STRICTFP = 45;
  static SUPER = 46;
  static SWITCH = 47;
  static SYNCHRONIZED = 48;
  static THIS = 49;
  static THROW = 50;
  static THROWS = 51;
  static TRANSIENT = 52;
  static TRY = 53;
  static VAR = 54;
  static VOID = 55;
  static VOLATILE = 56;
  static WHILE = 57;
  static DECIMAL_LITERAL = 58;
  static HEX_LITERAL = 59;
  static OCT_LITERAL = 60;
  static BINARY_LITERAL = 61;
  static FLOAT_LITERAL = 62;
  static HEX_FLOAT_LITERAL = 63;
  static BOOL_LITERAL = 64;
  static STRING_LITERAL = 65;
  static MULTI_STRING_LIT = 66;
  static NULL_LITERAL = 67;
  static LPAREN = 68;
  static RPAREN = 69;
  static LBRACE = 70;
  static RBRACE = 71;
  static LBRACK = 72;
  static RBRACK = 73;
  static SEMI = 74;
  static COMMA = 75;
  static DOT = 76;
  static ASSIGN = 77;
  static GT = 78;
  static LT = 79;
  static BANG = 80;
  static TILDE = 81;
  static QUESTION = 82;
  static COLON = 83;
  static EQUAL = 84;
  static LE = 85;
  static GE = 86;
  static NOTEQUAL = 87;
  static AND = 88;
  static OR = 89;
  static INC = 90;
  static DEC = 91;
  static ADD = 92;
  static SUB = 93;
  static MUL = 94;
  static DIV = 95;
  static BITAND = 96;
  static BITOR = 97;
  static CARET = 98;
  static MOD = 99;
  static ADD_ASSIGN = 100;
  static SUB_ASSIGN = 101;
  static MUL_ASSIGN = 102;
  static DIV_ASSIGN = 103;
  static AND_ASSIGN = 104;
  static OR_ASSIGN = 105;
  static XOR_ASSIGN = 106;
  static MOD_ASSIGN = 107;
  static LSHIFT_ASSIGN = 108;
  static RSHIFT_ASSIGN = 109;
  static URSHIFT_ASSIGN = 110;
  static ARROW = 111;
  static COLONCOLON = 112;
  static AT = 113;
  static ELLIPSIS = 114;
  static IDENTIFIER = 115;
  static EOF = kn.EOF;
  static RULE_processingSketch = 0;
  static RULE_javaProcessingSketch = 1;
  static RULE_staticProcessingSketch = 2;
  static RULE_activeProcessingSketch = 3;
  static RULE_warnMixedModes = 4;
  static RULE_variableDeclaratorId = 5;
  static RULE_warnTypeAsVariableName = 6;
  static RULE_methodCall = 7;
  static RULE_functionWithPrimitiveTypeName = 8;
  static RULE_primitiveType = 9;
  static RULE_colorPrimitiveType = 10;
  static RULE_qualifiedName = 11;
  static RULE_literal = 12;
  static RULE_hexColorLiteral = 13;
  static RULE_compilationUnit = 14;
  static RULE_packageDeclaration = 15;
  static RULE_importDeclaration = 16;
  static RULE_typeDeclaration = 17;
  static RULE_modifier = 18;
  static RULE_classOrInterfaceModifier = 19;
  static RULE_variableModifier = 20;
  static RULE_classDeclaration = 21;
  static RULE_typeParameters = 22;
  static RULE_typeParameter = 23;
  static RULE_typeBound = 24;
  static RULE_enumDeclaration = 25;
  static RULE_enumConstants = 26;
  static RULE_enumConstant = 27;
  static RULE_enumBodyDeclarations = 28;
  static RULE_interfaceDeclaration = 29;
  static RULE_classBody = 30;
  static RULE_interfaceBody = 31;
  static RULE_classBodyDeclaration = 32;
  static RULE_memberDeclaration = 33;
  static RULE_methodDeclaration = 34;
  static RULE_methodBody = 35;
  static RULE_typeTypeOrVoid = 36;
  static RULE_genericMethodDeclaration = 37;
  static RULE_genericConstructorDeclaration = 38;
  static RULE_constructorDeclaration = 39;
  static RULE_fieldDeclaration = 40;
  static RULE_interfaceBodyDeclaration = 41;
  static RULE_interfaceMemberDeclaration = 42;
  static RULE_constDeclaration = 43;
  static RULE_constantDeclarator = 44;
  static RULE_interfaceMethodDeclaration = 45;
  static RULE_interfaceMethodModifier = 46;
  static RULE_genericInterfaceMethodDeclaration = 47;
  static RULE_variableDeclarators = 48;
  static RULE_variableDeclarator = 49;
  static RULE_variableInitializer = 50;
  static RULE_arrayInitializer = 51;
  static RULE_classOrInterfaceType = 52;
  static RULE_typeArgument = 53;
  static RULE_qualifiedNameList = 54;
  static RULE_formalParameters = 55;
  static RULE_formalParameterList = 56;
  static RULE_formalParameter = 57;
  static RULE_lastFormalParameter = 58;
  static RULE_baseStringLiteral = 59;
  static RULE_multilineStringLiteral = 60;
  static RULE_stringLiteral = 61;
  static RULE_integerLiteral = 62;
  static RULE_floatLiteral = 63;
  static RULE_annotation = 64;
  static RULE_elementValuePairs = 65;
  static RULE_elementValuePair = 66;
  static RULE_elementValue = 67;
  static RULE_elementValueArrayInitializer = 68;
  static RULE_annotationTypeDeclaration = 69;
  static RULE_annotationTypeBody = 70;
  static RULE_annotationTypeElementDeclaration = 71;
  static RULE_annotationTypeElementRest = 72;
  static RULE_annotationMethodOrConstantRest = 73;
  static RULE_annotationMethodRest = 74;
  static RULE_annotationConstantRest = 75;
  static RULE_defaultValue = 76;
  static RULE_block = 77;
  static RULE_blockStatement = 78;
  static RULE_localVariableDeclaration = 79;
  static RULE_localTypeDeclaration = 80;
  static RULE_statement = 81;
  static RULE_catchClause = 82;
  static RULE_catchType = 83;
  static RULE_finallyBlock = 84;
  static RULE_resourceSpecification = 85;
  static RULE_resources = 86;
  static RULE_resource = 87;
  static RULE_switchBlockStatementGroup = 88;
  static RULE_switchLabel = 89;
  static RULE_forControl = 90;
  static RULE_forInit = 91;
  static RULE_enhancedForControl = 92;
  static RULE_parExpression = 93;
  static RULE_expressionList = 94;
  static RULE_expression = 95;
  static RULE_lambdaExpression = 96;
  static RULE_lambdaParameters = 97;
  static RULE_lambdaBody = 98;
  static RULE_primary = 99;
  static RULE_classType = 100;
  static RULE_creator = 101;
  static RULE_createdName = 102;
  static RULE_innerCreator = 103;
  static RULE_arrayCreatorRest = 104;
  static RULE_classCreatorRest = 105;
  static RULE_explicitGenericInvocation = 106;
  static RULE_typeArgumentsOrDiamond = 107;
  static RULE_nonWildcardTypeArgumentsOrDiamond = 108;
  static RULE_nonWildcardTypeArguments = 109;
  static RULE_typeList = 110;
  static RULE_typeType = 111;
  static RULE_typeArguments = 112;
  static RULE_superSuffix = 113;
  static RULE_explicitGenericInvocationSuffix = 114;
  static RULE_arguments = 115;
  static literalNames = [
    null,
    "'color'",
    null,
    null,
    null,
    null,
    null,
    "'abstract'",
    "'assert'",
    "'boolean'",
    "'break'",
    "'byte'",
    "'case'",
    "'catch'",
    "'char'",
    "'class'",
    "'const'",
    "'continue'",
    "'default'",
    "'do'",
    "'double'",
    "'else'",
    "'enum'",
    "'extends'",
    "'final'",
    "'finally'",
    "'float'",
    "'for'",
    "'if'",
    "'goto'",
    "'implements'",
    "'import'",
    "'instanceof'",
    "'int'",
    "'interface'",
    "'long'",
    "'native'",
    "'new'",
    "'package'",
    "'private'",
    "'protected'",
    "'public'",
    "'return'",
    "'short'",
    "'static'",
    "'strictfp'",
    "'super'",
    "'switch'",
    "'synchronized'",
    "'this'",
    "'throw'",
    "'throws'",
    "'transient'",
    "'try'",
    "'var'",
    "'void'",
    "'volatile'",
    "'while'",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "'null'",
    "'('",
    "')'",
    "'{'",
    "'}'",
    "'['",
    "']'",
    "';'",
    "','",
    "'.'",
    "'='",
    "'>'",
    "'<'",
    "'!'",
    "'~'",
    "'?'",
    "':'",
    "'=='",
    "'<='",
    "'>='",
    "'!='",
    "'&&'",
    "'||'",
    "'++'",
    "'--'",
    "'+'",
    "'-'",
    "'*'",
    "'/'",
    "'&'",
    "'|'",
    "'^'",
    "'%'",
    "'+='",
    "'-='",
    "'*='",
    "'/='",
    "'&='",
    "'|='",
    "'^='",
    "'%='",
    "'<<='",
    "'>>='",
    "'>>>='",
    "'->'",
    "'::'",
    "'@'",
    "'...'"
  ];
  static symbolicNames = [
    null,
    null,
    "HexColorLiteral",
    "WS",
    "COMMENT",
    "LINE_COMMENT",
    "CHAR_LITERAL",
    "ABSTRACT",
    "ASSERT",
    "BOOLEAN",
    "BREAK",
    "BYTE",
    "CASE",
    "CATCH",
    "CHAR",
    "CLASS",
    "CONST",
    "CONTINUE",
    "DEFAULT",
    "DO",
    "DOUBLE",
    "ELSE",
    "ENUM",
    "EXTENDS",
    "FINAL",
    "FINALLY",
    "FLOAT",
    "FOR",
    "IF",
    "GOTO",
    "IMPLEMENTS",
    "IMPORT",
    "INSTANCEOF",
    "INT",
    "INTERFACE",
    "LONG",
    "NATIVE",
    "NEW",
    "PACKAGE",
    "PRIVATE",
    "PROTECTED",
    "PUBLIC",
    "RETURN",
    "SHORT",
    "STATIC",
    "STRICTFP",
    "SUPER",
    "SWITCH",
    "SYNCHRONIZED",
    "THIS",
    "THROW",
    "THROWS",
    "TRANSIENT",
    "TRY",
    "VAR",
    "VOID",
    "VOLATILE",
    "WHILE",
    "DECIMAL_LITERAL",
    "HEX_LITERAL",
    "OCT_LITERAL",
    "BINARY_LITERAL",
    "FLOAT_LITERAL",
    "HEX_FLOAT_LITERAL",
    "BOOL_LITERAL",
    "STRING_LITERAL",
    "MULTI_STRING_LIT",
    "NULL_LITERAL",
    "LPAREN",
    "RPAREN",
    "LBRACE",
    "RBRACE",
    "LBRACK",
    "RBRACK",
    "SEMI",
    "COMMA",
    "DOT",
    "ASSIGN",
    "GT",
    "LT",
    "BANG",
    "TILDE",
    "QUESTION",
    "COLON",
    "EQUAL",
    "LE",
    "GE",
    "NOTEQUAL",
    "AND",
    "OR",
    "INC",
    "DEC",
    "ADD",
    "SUB",
    "MUL",
    "DIV",
    "BITAND",
    "BITOR",
    "CARET",
    "MOD",
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
    "ARROW",
    "COLONCOLON",
    "AT",
    "ELLIPSIS",
    "IDENTIFIER"
  ];
  // tslint:disable:no-trailing-whitespace
  static ruleNames = [
    "processingSketch",
    "javaProcessingSketch",
    "staticProcessingSketch",
    "activeProcessingSketch",
    "warnMixedModes",
    "variableDeclaratorId",
    "warnTypeAsVariableName",
    "methodCall",
    "functionWithPrimitiveTypeName",
    "primitiveType",
    "colorPrimitiveType",
    "qualifiedName",
    "literal",
    "hexColorLiteral",
    "compilationUnit",
    "packageDeclaration",
    "importDeclaration",
    "typeDeclaration",
    "modifier",
    "classOrInterfaceModifier",
    "variableModifier",
    "classDeclaration",
    "typeParameters",
    "typeParameter",
    "typeBound",
    "enumDeclaration",
    "enumConstants",
    "enumConstant",
    "enumBodyDeclarations",
    "interfaceDeclaration",
    "classBody",
    "interfaceBody",
    "classBodyDeclaration",
    "memberDeclaration",
    "methodDeclaration",
    "methodBody",
    "typeTypeOrVoid",
    "genericMethodDeclaration",
    "genericConstructorDeclaration",
    "constructorDeclaration",
    "fieldDeclaration",
    "interfaceBodyDeclaration",
    "interfaceMemberDeclaration",
    "constDeclaration",
    "constantDeclarator",
    "interfaceMethodDeclaration",
    "interfaceMethodModifier",
    "genericInterfaceMethodDeclaration",
    "variableDeclarators",
    "variableDeclarator",
    "variableInitializer",
    "arrayInitializer",
    "classOrInterfaceType",
    "typeArgument",
    "qualifiedNameList",
    "formalParameters",
    "formalParameterList",
    "formalParameter",
    "lastFormalParameter",
    "baseStringLiteral",
    "multilineStringLiteral",
    "stringLiteral",
    "integerLiteral",
    "floatLiteral",
    "annotation",
    "elementValuePairs",
    "elementValuePair",
    "elementValue",
    "elementValueArrayInitializer",
    "annotationTypeDeclaration",
    "annotationTypeBody",
    "annotationTypeElementDeclaration",
    "annotationTypeElementRest",
    "annotationMethodOrConstantRest",
    "annotationMethodRest",
    "annotationConstantRest",
    "defaultValue",
    "block",
    "blockStatement",
    "localVariableDeclaration",
    "localTypeDeclaration",
    "statement",
    "catchClause",
    "catchType",
    "finallyBlock",
    "resourceSpecification",
    "resources",
    "resource",
    "switchBlockStatementGroup",
    "switchLabel",
    "forControl",
    "forInit",
    "enhancedForControl",
    "parExpression",
    "expressionList",
    "expression",
    "lambdaExpression",
    "lambdaParameters",
    "lambdaBody",
    "primary",
    "classType",
    "creator",
    "createdName",
    "innerCreator",
    "arrayCreatorRest",
    "classCreatorRest",
    "explicitGenericInvocation",
    "typeArgumentsOrDiamond",
    "nonWildcardTypeArgumentsOrDiamond",
    "nonWildcardTypeArguments",
    "typeList",
    "typeType",
    "typeArguments",
    "superSuffix",
    "explicitGenericInvocationSuffix",
    "arguments"
  ];
  get grammarFileName() {
    return "Processing.g4";
  }
  get literalNames() {
    return ProcessingParser.literalNames;
  }
  get symbolicNames() {
    return ProcessingParser.symbolicNames;
  }
  get ruleNames() {
    return ProcessingParser.ruleNames;
  }
  get serializedATN() {
    return ProcessingParser._serializedATN;
  }
  createFailedPredicateException(predicate, message) {
    return new sn(this, predicate, message);
  }
  constructor(input) {
    super(input), this._interp = new Tn(this, ProcessingParser._ATN, ProcessingParser.DecisionsToDFA, new mn());
  }
  // @RuleVersion(0)
  processingSketch() {
    let localctx = new ProcessingSketchContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, ProcessingParser.RULE_processingSketch);
    try {
      switch (this.state = 235, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 0, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 232, this.staticProcessingSketch();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 233, this.javaProcessingSketch();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 234, this.activeProcessingSketch();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  javaProcessingSketch() {
    let localctx = new JavaProcessingSketchContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, ProcessingParser.RULE_javaProcessingSketch);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 238, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 1, this._ctx)) {
          case 1:
            this.state = 237, this.packageDeclaration();
            break;
        }
        for (this.state = 243, this._errHandler.sync(this), _la = this._input.LA(1); _la === 31; )
          this.state = 240, this.importDeclaration(), this.state = 245, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 247, this._errHandler.sync(this), _la = this._input.LA(1);
        do
          this.state = 246, this.typeDeclaration(), this.state = 249, this._errHandler.sync(this), _la = this._input.LA(1);
        while ((_la & -32) === 0 && (1 << _la & 21004416) !== 0 || (_la - 34 & -32) === 0 && (1 << _la - 34 & 3297) !== 0 || _la === 74 || _la === 113);
        this.state = 251, this.match(ProcessingParser.EOF);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  staticProcessingSketch() {
    let localctx = new StaticProcessingSketchContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, ProcessingParser.RULE_staticProcessingSketch);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 258, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2639974342) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4285792215) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431727) !== 0 || _la === 113 || _la === 115; ) {
          switch (this.state = 256, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 4, this._ctx)) {
            case 1:
              this.state = 253, this.importDeclaration();
              break;
            case 2:
              this.state = 254, this.blockStatement();
              break;
            case 3:
              this.state = 255, this.typeDeclaration();
              break;
          }
          this.state = 260, this._errHandler.sync(this), _la = this._input.LA(1);
        }
        this.state = 261, this.match(ProcessingParser.EOF);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  activeProcessingSketch() {
    let localctx = new ActiveProcessingSketchContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, ProcessingParser.RULE_activeProcessingSketch);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 267, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2236664450) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 15244751) !== 0 || (_la - 70 & -32) === 0 && (1 << _la - 70 & 529) !== 0 || _la === 113 || _la === 115; ) {
          switch (this.state = 265, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 6, this._ctx)) {
            case 1:
              this.state = 263, this.importDeclaration();
              break;
            case 2:
              this.state = 264, this.classBodyDeclaration();
              break;
          }
          this.state = 269, this._errHandler.sync(this), _la = this._input.LA(1);
        }
        this.state = 270, this.match(ProcessingParser.EOF);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  warnMixedModes() {
    let localctx = new WarnMixedModesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, ProcessingParser.RULE_warnMixedModes);
    let _la;
    try {
      let _alt;
      switch (this.state = 308, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 16, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            for (this.state = 277, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 9, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; ) {
              if (_alt === 1)
                switch (this.state = 275, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 8, this._ctx)) {
                  case 1:
                    this.state = 272, this.importDeclaration();
                    break;
                  case 2:
                    this.state = 273, this.classBodyDeclaration();
                    break;
                  case 3:
                    this.state = 274, this.blockStatement();
                    break;
                }
              this.state = 279, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
            }
            for (this.state = 280, this.blockStatement(), this.state = 281, this.classBodyDeclaration(), this.state = 287, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2639974342) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4294705119) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431727) !== 0 || _la === 113 || _la === 115; ) {
              switch (this.state = 285, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 10, this._ctx)) {
                case 1:
                  this.state = 282, this.importDeclaration();
                  break;
                case 2:
                  this.state = 283, this.classBodyDeclaration();
                  break;
                case 3:
                  this.state = 284, this.blockStatement();
                  break;
              }
              this.state = 289, this._errHandler.sync(this), _la = this._input.LA(1);
            }
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            for (this.state = 295, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 13, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; ) {
              if (_alt === 1)
                switch (this.state = 293, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 12, this._ctx)) {
                  case 1:
                    this.state = 290, this.importDeclaration();
                    break;
                  case 2:
                    this.state = 291, this.classBodyDeclaration();
                    break;
                  case 3:
                    this.state = 292, this.blockStatement();
                    break;
                }
              this.state = 297, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
            }
            for (this.state = 298, this.classBodyDeclaration(), this.state = 299, this.blockStatement(), this.state = 305, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2639974342) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4294705119) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431727) !== 0 || _la === 113 || _la === 115; ) {
              switch (this.state = 303, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 14, this._ctx)) {
                case 1:
                  this.state = 300, this.importDeclaration();
                  break;
                case 2:
                  this.state = 301, this.classBodyDeclaration();
                  break;
                case 3:
                  this.state = 302, this.blockStatement();
                  break;
              }
              this.state = 307, this._errHandler.sync(this), _la = this._input.LA(1);
            }
          }
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  variableDeclaratorId() {
    let localctx = new VariableDeclaratorIdContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, ProcessingParser.RULE_variableDeclaratorId);
    let _la;
    try {
      switch (this.state = 319, this._errHandler.sync(this), this._input.LA(1)) {
        case 1:
        case 9:
        case 11:
        case 14:
        case 20:
        case 26:
        case 33:
        case 35:
        case 43:
          this.enterOuterAlt(localctx, 1), this.state = 310, this.warnTypeAsVariableName();
          break;
        case 115:
          for (this.enterOuterAlt(localctx, 2), this.state = 311, this.match(ProcessingParser.IDENTIFIER), this.state = 316, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
            this.state = 312, this.match(ProcessingParser.LBRACK), this.state = 313, this.match(ProcessingParser.RBRACK), this.state = 318, this._errHandler.sync(this), _la = this._input.LA(1);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  warnTypeAsVariableName() {
    let localctx = new WarnTypeAsVariableNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, ProcessingParser.RULE_warnTypeAsVariableName);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 321, localctx._primitiveType = this.primitiveType(), this.state = 326, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
          this.state = 322, this.match(ProcessingParser.LBRACK), this.state = 323, this.match(ProcessingParser.RBRACK), this.state = 328, this._errHandler.sync(this), _la = this._input.LA(1);
        this.notifyErrorListeners("Type names are not allowed as variable names: " + (localctx._primitiveType != null ? this._input.getText(new an(localctx._primitiveType.start, localctx._primitiveType.stop)) : void 0), this.getCurrentToken(), void 0);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  methodCall() {
    let localctx = new MethodCallContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, ProcessingParser.RULE_methodCall);
    let _la;
    try {
      switch (this.state = 350, this._errHandler.sync(this), this._input.LA(1)) {
        case 1:
        case 9:
        case 11:
        case 14:
        case 26:
        case 33:
          this.enterOuterAlt(localctx, 1), this.state = 331, this.functionWithPrimitiveTypeName();
          break;
        case 115:
          this.enterOuterAlt(localctx, 2), this.state = 332, this.match(ProcessingParser.IDENTIFIER), this.state = 333, this.match(ProcessingParser.LPAREN), this.state = 335, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 334, this.expressionList()), this.state = 337, this.match(ProcessingParser.RPAREN);
          break;
        case 49:
          this.enterOuterAlt(localctx, 3), this.state = 338, this.match(ProcessingParser.THIS), this.state = 339, this.match(ProcessingParser.LPAREN), this.state = 341, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 340, this.expressionList()), this.state = 343, this.match(ProcessingParser.RPAREN);
          break;
        case 46:
          this.enterOuterAlt(localctx, 4), this.state = 344, this.match(ProcessingParser.SUPER), this.state = 345, this.match(ProcessingParser.LPAREN), this.state = 347, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 346, this.expressionList()), this.state = 349, this.match(ProcessingParser.RPAREN);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  functionWithPrimitiveTypeName() {
    let localctx = new FunctionWithPrimitiveTypeNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, ProcessingParser.RULE_functionWithPrimitiveTypeName);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 352, _la = this._input.LA(1), (_la & -32) === 0 && (1 << _la & 67127810) !== 0 || _la === 33 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 353, this.match(ProcessingParser.LPAREN), this.state = 355, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 354, this.expressionList()), this.state = 357, this.match(ProcessingParser.RPAREN);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  primitiveType() {
    let localctx = new PrimitiveTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, ProcessingParser.RULE_primitiveType);
    try {
      switch (this.state = 368, this._errHandler.sync(this), this._input.LA(1)) {
        case 9:
          this.enterOuterAlt(localctx, 1), this.state = 359, this.match(ProcessingParser.BOOLEAN);
          break;
        case 14:
          this.enterOuterAlt(localctx, 2), this.state = 360, this.match(ProcessingParser.CHAR);
          break;
        case 11:
          this.enterOuterAlt(localctx, 3), this.state = 361, this.match(ProcessingParser.BYTE);
          break;
        case 43:
          this.enterOuterAlt(localctx, 4), this.state = 362, this.match(ProcessingParser.SHORT);
          break;
        case 33:
          this.enterOuterAlt(localctx, 5), this.state = 363, this.match(ProcessingParser.INT);
          break;
        case 35:
          this.enterOuterAlt(localctx, 6), this.state = 364, this.match(ProcessingParser.LONG);
          break;
        case 26:
          this.enterOuterAlt(localctx, 7), this.state = 365, this.match(ProcessingParser.FLOAT);
          break;
        case 20:
          this.enterOuterAlt(localctx, 8), this.state = 366, this.match(ProcessingParser.DOUBLE);
          break;
        case 1:
          this.enterOuterAlt(localctx, 9), this.state = 367, this.colorPrimitiveType();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  colorPrimitiveType() {
    let localctx = new ColorPrimitiveTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, ProcessingParser.RULE_colorPrimitiveType);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 370, this.match(ProcessingParser.T__0);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  qualifiedName() {
    let localctx = new QualifiedNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, ProcessingParser.RULE_qualifiedName);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 374, this._errHandler.sync(this), this._input.LA(1)) {
          case 115:
            this.state = 372, this.match(ProcessingParser.IDENTIFIER);
            break;
          case 1:
            this.state = 373, this.colorPrimitiveType();
            break;
          default:
            throw new dn(this);
        }
        for (this.state = 383, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 28, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; ) {
          if (_alt === 1)
            switch (this.state = 376, this.match(ProcessingParser.DOT), this.state = 379, this._errHandler.sync(this), this._input.LA(1)) {
              case 115:
                this.state = 377, this.match(ProcessingParser.IDENTIFIER);
                break;
              case 1:
                this.state = 378, this.colorPrimitiveType();
                break;
              default:
                throw new dn(this);
            }
          this.state = 385, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 28, this._ctx);
        }
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  literal() {
    let localctx = new LiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, ProcessingParser.RULE_literal);
    try {
      switch (this.state = 393, this._errHandler.sync(this), this._input.LA(1)) {
        case 58:
        case 59:
        case 60:
        case 61:
          this.enterOuterAlt(localctx, 1), this.state = 386, this.integerLiteral();
          break;
        case 62:
        case 63:
          this.enterOuterAlt(localctx, 2), this.state = 387, this.floatLiteral();
          break;
        case 6:
          this.enterOuterAlt(localctx, 3), this.state = 388, this.match(ProcessingParser.CHAR_LITERAL);
          break;
        case 65:
        case 66:
          this.enterOuterAlt(localctx, 4), this.state = 389, this.stringLiteral();
          break;
        case 64:
          this.enterOuterAlt(localctx, 5), this.state = 390, this.match(ProcessingParser.BOOL_LITERAL);
          break;
        case 67:
          this.enterOuterAlt(localctx, 6), this.state = 391, this.match(ProcessingParser.NULL_LITERAL);
          break;
        case 2:
          this.enterOuterAlt(localctx, 7), this.state = 392, this.hexColorLiteral();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  hexColorLiteral() {
    let localctx = new HexColorLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, ProcessingParser.RULE_hexColorLiteral);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 395, this.match(ProcessingParser.HexColorLiteral);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  compilationUnit() {
    let localctx = new CompilationUnitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, ProcessingParser.RULE_compilationUnit);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 398, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 30, this._ctx)) {
          case 1:
            this.state = 397, this.packageDeclaration();
            break;
        }
        for (this.state = 403, this._errHandler.sync(this), _la = this._input.LA(1); _la === 31; )
          this.state = 400, this.importDeclaration(), this.state = 405, this._errHandler.sync(this), _la = this._input.LA(1);
        for (this.state = 409, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 21004416) !== 0 || (_la - 34 & -32) === 0 && (1 << _la - 34 & 3297) !== 0 || _la === 74 || _la === 113; )
          this.state = 406, this.typeDeclaration(), this.state = 411, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 412, this.match(ProcessingParser.EOF);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  packageDeclaration() {
    let localctx = new PackageDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, ProcessingParser.RULE_packageDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 417, this._errHandler.sync(this), _la = this._input.LA(1); _la === 113; )
          this.state = 414, this.annotation(), this.state = 419, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 420, this.match(ProcessingParser.PACKAGE), this.state = 421, this.qualifiedName(), this.state = 422, this.match(ProcessingParser.SEMI);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  importDeclaration() {
    let localctx = new ImportDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, ProcessingParser.RULE_importDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 424, this.match(ProcessingParser.IMPORT), this.state = 426, this._errHandler.sync(this), _la = this._input.LA(1), _la === 44 && (this.state = 425, this.match(ProcessingParser.STATIC)), this.state = 428, this.qualifiedName(), this.state = 431, this._errHandler.sync(this), _la = this._input.LA(1), _la === 76 && (this.state = 429, this.match(ProcessingParser.DOT), this.state = 430, this.match(ProcessingParser.MUL)), this.state = 433, this.match(ProcessingParser.SEMI);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeDeclaration() {
    let localctx = new TypeDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, ProcessingParser.RULE_typeDeclaration);
    try {
      let _alt;
      switch (this.state = 448, this._errHandler.sync(this), this._input.LA(1)) {
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
            for (this.state = 438, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 36, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 435, this.classOrInterfaceModifier()), this.state = 440, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
            switch (this.state = 445, this._errHandler.sync(this), this._input.LA(1)) {
              case 15:
                this.state = 441, this.classDeclaration();
                break;
              case 22:
                this.state = 442, this.enumDeclaration();
                break;
              case 34:
                this.state = 443, this.interfaceDeclaration();
                break;
              case 113:
                this.state = 444, this.annotationTypeDeclaration();
                break;
              default:
                throw new dn(this);
            }
          }
          break;
        case 74:
          this.enterOuterAlt(localctx, 2), this.state = 447, this.match(ProcessingParser.SEMI);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  modifier() {
    let localctx = new ModifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, ProcessingParser.RULE_modifier);
    try {
      switch (this.state = 455, this._errHandler.sync(this), this._input.LA(1)) {
        case 7:
        case 24:
        case 39:
        case 40:
        case 41:
        case 44:
        case 45:
        case 113:
          this.enterOuterAlt(localctx, 1), this.state = 450, this.classOrInterfaceModifier();
          break;
        case 36:
          this.enterOuterAlt(localctx, 2), this.state = 451, this.match(ProcessingParser.NATIVE);
          break;
        case 48:
          this.enterOuterAlt(localctx, 3), this.state = 452, this.match(ProcessingParser.SYNCHRONIZED);
          break;
        case 52:
          this.enterOuterAlt(localctx, 4), this.state = 453, this.match(ProcessingParser.TRANSIENT);
          break;
        case 56:
          this.enterOuterAlt(localctx, 5), this.state = 454, this.match(ProcessingParser.VOLATILE);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classOrInterfaceModifier() {
    let localctx = new ClassOrInterfaceModifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, ProcessingParser.RULE_classOrInterfaceModifier);
    try {
      switch (this.state = 465, this._errHandler.sync(this), this._input.LA(1)) {
        case 113:
          this.enterOuterAlt(localctx, 1), this.state = 457, this.annotation();
          break;
        case 41:
          this.enterOuterAlt(localctx, 2), this.state = 458, this.match(ProcessingParser.PUBLIC);
          break;
        case 40:
          this.enterOuterAlt(localctx, 3), this.state = 459, this.match(ProcessingParser.PROTECTED);
          break;
        case 39:
          this.enterOuterAlt(localctx, 4), this.state = 460, this.match(ProcessingParser.PRIVATE);
          break;
        case 44:
          this.enterOuterAlt(localctx, 5), this.state = 461, this.match(ProcessingParser.STATIC);
          break;
        case 7:
          this.enterOuterAlt(localctx, 6), this.state = 462, this.match(ProcessingParser.ABSTRACT);
          break;
        case 24:
          this.enterOuterAlt(localctx, 7), this.state = 463, this.match(ProcessingParser.FINAL);
          break;
        case 45:
          this.enterOuterAlt(localctx, 8), this.state = 464, this.match(ProcessingParser.STRICTFP);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  variableModifier() {
    let localctx = new VariableModifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, ProcessingParser.RULE_variableModifier);
    try {
      switch (this.state = 469, this._errHandler.sync(this), this._input.LA(1)) {
        case 24:
          this.enterOuterAlt(localctx, 1), this.state = 467, this.match(ProcessingParser.FINAL);
          break;
        case 113:
          this.enterOuterAlt(localctx, 2), this.state = 468, this.annotation();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classDeclaration() {
    let localctx = new ClassDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, ProcessingParser.RULE_classDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 471, this.match(ProcessingParser.CLASS), this.state = 472, this.match(ProcessingParser.IDENTIFIER), this.state = 474, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 473, this.typeParameters()), this.state = 478, this._errHandler.sync(this), _la = this._input.LA(1), _la === 23 && (this.state = 476, this.match(ProcessingParser.EXTENDS), this.state = 477, this.typeType()), this.state = 482, this._errHandler.sync(this), _la = this._input.LA(1), _la === 30 && (this.state = 480, this.match(ProcessingParser.IMPLEMENTS), this.state = 481, this.typeList()), this.state = 484, this.classBody();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeParameters() {
    let localctx = new TypeParametersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, ProcessingParser.RULE_typeParameters);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 486, this.match(ProcessingParser.LT), this.state = 487, this.typeParameter(), this.state = 492, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
          this.state = 488, this.match(ProcessingParser.COMMA), this.state = 489, this.typeParameter(), this.state = 494, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 495, this.match(ProcessingParser.GT);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeParameter() {
    let localctx = new TypeParameterContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, ProcessingParser.RULE_typeParameter);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 500, this._errHandler.sync(this), _la = this._input.LA(1); _la === 113; )
          this.state = 497, this.annotation(), this.state = 502, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 503, this.match(ProcessingParser.IDENTIFIER), this.state = 506, this._errHandler.sync(this), _la = this._input.LA(1), _la === 23 && (this.state = 504, this.match(ProcessingParser.EXTENDS), this.state = 505, this.typeBound());
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeBound() {
    let localctx = new TypeBoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, ProcessingParser.RULE_typeBound);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 508, this.typeType(), this.state = 513, this._errHandler.sync(this), _la = this._input.LA(1); _la === 96; )
        this.state = 509, this.match(ProcessingParser.BITAND), this.state = 510, this.typeType(), this.state = 515, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  enumDeclaration() {
    let localctx = new EnumDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, ProcessingParser.RULE_enumDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 516, this.match(ProcessingParser.ENUM), this.state = 517, this.match(ProcessingParser.IDENTIFIER), this.state = 520, this._errHandler.sync(this), _la = this._input.LA(1), _la === 30 && (this.state = 518, this.match(ProcessingParser.IMPLEMENTS), this.state = 519, this.typeList()), this.state = 522, this.match(ProcessingParser.LBRACE), this.state = 524, this._errHandler.sync(this), _la = this._input.LA(1), (_la === 113 || _la === 115) && (this.state = 523, this.enumConstants()), this.state = 527, this._errHandler.sync(this), _la = this._input.LA(1), _la === 75 && (this.state = 526, this.match(ProcessingParser.COMMA)), this.state = 530, this._errHandler.sync(this), _la = this._input.LA(1), _la === 74 && (this.state = 529, this.enumBodyDeclarations()), this.state = 532, this.match(ProcessingParser.RBRACE);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  enumConstants() {
    let localctx = new EnumConstantsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, ProcessingParser.RULE_enumConstants);
    try {
      let _alt;
      for (this.enterOuterAlt(localctx, 1), this.state = 534, this.enumConstant(), this.state = 539, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 53, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
        _alt === 1 && (this.state = 535, this.match(ProcessingParser.COMMA), this.state = 536, this.enumConstant()), this.state = 541, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 53, this._ctx);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  enumConstant() {
    let localctx = new EnumConstantContext(this, this._ctx, this.state);
    this.enterRule(localctx, 54, ProcessingParser.RULE_enumConstant);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 545, this._errHandler.sync(this), _la = this._input.LA(1); _la === 113; )
          this.state = 542, this.annotation(), this.state = 547, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 548, this.match(ProcessingParser.IDENTIFIER), this.state = 550, this._errHandler.sync(this), _la = this._input.LA(1), _la === 68 && (this.state = 549, this.arguments()), this.state = 553, this._errHandler.sync(this), _la = this._input.LA(1), _la === 70 && (this.state = 552, this.classBody());
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  enumBodyDeclarations() {
    let localctx = new EnumBodyDeclarationsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 56, ProcessingParser.RULE_enumBodyDeclarations);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 555, this.match(ProcessingParser.SEMI), this.state = 559, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2236664450) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 15244751) !== 0 || (_la - 70 & -32) === 0 && (1 << _la - 70 & 529) !== 0 || _la === 113 || _la === 115; )
        this.state = 556, this.classBodyDeclaration(), this.state = 561, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceDeclaration() {
    let localctx = new InterfaceDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 58, ProcessingParser.RULE_interfaceDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 562, this.match(ProcessingParser.INTERFACE), this.state = 563, this.match(ProcessingParser.IDENTIFIER), this.state = 565, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 564, this.typeParameters()), this.state = 569, this._errHandler.sync(this), _la = this._input.LA(1), _la === 23 && (this.state = 567, this.match(ProcessingParser.EXTENDS), this.state = 568, this.typeList()), this.state = 571, this.interfaceBody();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classBody() {
    let localctx = new ClassBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 60, ProcessingParser.RULE_classBody);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 573, this.match(ProcessingParser.LBRACE), this.state = 577, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 2236664450) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 15244751) !== 0 || (_la - 70 & -32) === 0 && (1 << _la - 70 & 529) !== 0 || _la === 113 || _la === 115; )
          this.state = 574, this.classBodyDeclaration(), this.state = 579, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 580, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceBody() {
    let localctx = new InterfaceBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 62, ProcessingParser.RULE_interfaceBody);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 582, this.match(ProcessingParser.LBRACE), this.state = 586, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 89442946) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 15244751) !== 0 || _la === 74 || _la === 79 || _la === 113 || _la === 115; )
          this.state = 583, this.interfaceBodyDeclaration(), this.state = 588, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 589, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classBodyDeclaration() {
    let localctx = new ClassBodyDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 64, ProcessingParser.RULE_classBodyDeclaration);
    let _la;
    try {
      let _alt;
      switch (this.state = 604, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 64, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 591, this.match(ProcessingParser.SEMI);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 592, this.importDeclaration();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 594, this._errHandler.sync(this), _la = this._input.LA(1), _la === 44 && (this.state = 593, this.match(ProcessingParser.STATIC)), this.state = 596, this.block();
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          {
            for (this.state = 600, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 63, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 597, this.modifier()), this.state = 602, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
            this.state = 603, this.memberDeclaration();
          }
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  memberDeclaration() {
    let localctx = new MemberDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 66, ProcessingParser.RULE_memberDeclaration);
    try {
      switch (this.state = 615, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 65, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 606, this.methodDeclaration();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 607, this.genericMethodDeclaration();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 608, this.fieldDeclaration();
          break;
        case 4:
          this.enterOuterAlt(localctx, 4), this.state = 609, this.constructorDeclaration();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5), this.state = 610, this.genericConstructorDeclaration();
          break;
        case 6:
          this.enterOuterAlt(localctx, 6), this.state = 611, this.interfaceDeclaration();
          break;
        case 7:
          this.enterOuterAlt(localctx, 7), this.state = 612, this.annotationTypeDeclaration();
          break;
        case 8:
          this.enterOuterAlt(localctx, 8), this.state = 613, this.classDeclaration();
          break;
        case 9:
          this.enterOuterAlt(localctx, 9), this.state = 614, this.enumDeclaration();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  methodDeclaration() {
    let localctx = new MethodDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 68, ProcessingParser.RULE_methodDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 617, this.typeTypeOrVoid(), this.state = 618, this.match(ProcessingParser.IDENTIFIER), this.state = 619, this.formalParameters(), this.state = 624, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
          this.state = 620, this.match(ProcessingParser.LBRACK), this.state = 621, this.match(ProcessingParser.RBRACK), this.state = 626, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 629, this._errHandler.sync(this), _la = this._input.LA(1), _la === 51 && (this.state = 627, this.match(ProcessingParser.THROWS), this.state = 628, this.qualifiedNameList()), this.state = 631, this.methodBody();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  methodBody() {
    let localctx = new MethodBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 70, ProcessingParser.RULE_methodBody);
    try {
      switch (this.state = 635, this._errHandler.sync(this), this._input.LA(1)) {
        case 70:
          this.enterOuterAlt(localctx, 1), this.state = 633, this.block();
          break;
        case 74:
          this.enterOuterAlt(localctx, 2), this.state = 634, this.match(ProcessingParser.SEMI);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeTypeOrVoid() {
    let localctx = new TypeTypeOrVoidContext(this, this._ctx, this.state);
    this.enterRule(localctx, 72, ProcessingParser.RULE_typeTypeOrVoid);
    try {
      switch (this.state = 639, this._errHandler.sync(this), this._input.LA(1)) {
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
          this.enterOuterAlt(localctx, 1), this.state = 637, this.typeType();
          break;
        case 55:
          this.enterOuterAlt(localctx, 2), this.state = 638, this.match(ProcessingParser.VOID);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  genericMethodDeclaration() {
    let localctx = new GenericMethodDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 74, ProcessingParser.RULE_genericMethodDeclaration);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 641, this.typeParameters(), this.state = 642, this.methodDeclaration();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  genericConstructorDeclaration() {
    let localctx = new GenericConstructorDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 76, ProcessingParser.RULE_genericConstructorDeclaration);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 644, this.typeParameters(), this.state = 645, this.constructorDeclaration();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  constructorDeclaration() {
    let localctx = new ConstructorDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 78, ProcessingParser.RULE_constructorDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 647, this.match(ProcessingParser.IDENTIFIER), this.state = 648, this.formalParameters(), this.state = 651, this._errHandler.sync(this), _la = this._input.LA(1), _la === 51 && (this.state = 649, this.match(ProcessingParser.THROWS), this.state = 650, this.qualifiedNameList()), this.state = 653, localctx._constructorBody = this.block();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  fieldDeclaration() {
    let localctx = new FieldDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 80, ProcessingParser.RULE_fieldDeclaration);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 655, this.typeType(), this.state = 656, this.variableDeclarators(), this.state = 657, this.match(ProcessingParser.SEMI);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceBodyDeclaration() {
    let localctx = new InterfaceBodyDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 82, ProcessingParser.RULE_interfaceBodyDeclaration);
    try {
      let _alt;
      switch (this.state = 667, this._errHandler.sync(this), this._input.LA(1)) {
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
            for (this.state = 662, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 71, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 659, this.modifier()), this.state = 664, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 71, this._ctx);
            this.state = 665, this.interfaceMemberDeclaration();
          }
          break;
        case 74:
          this.enterOuterAlt(localctx, 2), this.state = 666, this.match(ProcessingParser.SEMI);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceMemberDeclaration() {
    let localctx = new InterfaceMemberDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 84, ProcessingParser.RULE_interfaceMemberDeclaration);
    try {
      switch (this.state = 676, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 73, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 669, this.constDeclaration();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 670, this.interfaceMethodDeclaration();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 671, this.genericInterfaceMethodDeclaration();
          break;
        case 4:
          this.enterOuterAlt(localctx, 4), this.state = 672, this.interfaceDeclaration();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5), this.state = 673, this.annotationTypeDeclaration();
          break;
        case 6:
          this.enterOuterAlt(localctx, 6), this.state = 674, this.classDeclaration();
          break;
        case 7:
          this.enterOuterAlt(localctx, 7), this.state = 675, this.enumDeclaration();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  constDeclaration() {
    let localctx = new ConstDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 86, ProcessingParser.RULE_constDeclaration);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 678, this.typeType(), this.state = 679, this.constantDeclarator(), this.state = 684, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
          this.state = 680, this.match(ProcessingParser.COMMA), this.state = 681, this.constantDeclarator(), this.state = 686, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 687, this.match(ProcessingParser.SEMI);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  constantDeclarator() {
    let localctx = new ConstantDeclaratorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 88, ProcessingParser.RULE_constantDeclarator);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 689, this.match(ProcessingParser.IDENTIFIER), this.state = 694, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
          this.state = 690, this.match(ProcessingParser.LBRACK), this.state = 691, this.match(ProcessingParser.RBRACK), this.state = 696, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 697, this.match(ProcessingParser.ASSIGN), this.state = 698, this.variableInitializer();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceMethodDeclaration() {
    let localctx = new InterfaceMethodDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 90, ProcessingParser.RULE_interfaceMethodDeclaration);
    let _la;
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 703, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 76, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 700, this.interfaceMethodModifier()), this.state = 705, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
        switch (this.state = 716, this._errHandler.sync(this), this._input.LA(1)) {
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
            this.state = 706, this.typeTypeOrVoid();
            break;
          case 79:
            {
              for (this.state = 707, this.typeParameters(), this.state = 711, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 77, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
                _alt === 1 && (this.state = 708, this.annotation()), this.state = 713, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 77, this._ctx);
              this.state = 714, this.typeTypeOrVoid();
            }
            break;
          default:
            throw new dn(this);
        }
        for (this.state = 718, this.match(ProcessingParser.IDENTIFIER), this.state = 719, this.formalParameters(), this.state = 724, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
          this.state = 720, this.match(ProcessingParser.LBRACK), this.state = 721, this.match(ProcessingParser.RBRACK), this.state = 726, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 729, this._errHandler.sync(this), _la = this._input.LA(1), _la === 51 && (this.state = 727, this.match(ProcessingParser.THROWS), this.state = 728, this.qualifiedNameList()), this.state = 731, this.methodBody();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  interfaceMethodModifier() {
    let localctx = new InterfaceMethodModifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 92, ProcessingParser.RULE_interfaceMethodModifier);
    try {
      switch (this.state = 739, this._errHandler.sync(this), this._input.LA(1)) {
        case 113:
          this.enterOuterAlt(localctx, 1), this.state = 733, this.annotation();
          break;
        case 41:
          this.enterOuterAlt(localctx, 2), this.state = 734, this.match(ProcessingParser.PUBLIC);
          break;
        case 7:
          this.enterOuterAlt(localctx, 3), this.state = 735, this.match(ProcessingParser.ABSTRACT);
          break;
        case 18:
          this.enterOuterAlt(localctx, 4), this.state = 736, this.match(ProcessingParser.DEFAULT);
          break;
        case 44:
          this.enterOuterAlt(localctx, 5), this.state = 737, this.match(ProcessingParser.STATIC);
          break;
        case 45:
          this.enterOuterAlt(localctx, 6), this.state = 738, this.match(ProcessingParser.STRICTFP);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  genericInterfaceMethodDeclaration() {
    let localctx = new GenericInterfaceMethodDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 94, ProcessingParser.RULE_genericInterfaceMethodDeclaration);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 741, this.typeParameters(), this.state = 742, this.interfaceMethodDeclaration();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  variableDeclarators() {
    let localctx = new VariableDeclaratorsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 96, ProcessingParser.RULE_variableDeclarators);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 744, this.variableDeclarator(), this.state = 749, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
        this.state = 745, this.match(ProcessingParser.COMMA), this.state = 746, this.variableDeclarator(), this.state = 751, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  variableDeclarator() {
    let localctx = new VariableDeclaratorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 98, ProcessingParser.RULE_variableDeclarator);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 752, this.variableDeclaratorId(), this.state = 755, this._errHandler.sync(this), _la = this._input.LA(1), _la === 77 && (this.state = 753, this.match(ProcessingParser.ASSIGN), this.state = 754, this.variableInitializer());
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  variableInitializer() {
    let localctx = new VariableInitializerContext(this, this._ctx, this.state);
    this.enterRule(localctx, 100, ProcessingParser.RULE_variableInitializer);
    try {
      switch (this.state = 759, this._errHandler.sync(this), this._input.LA(1)) {
        case 70:
          this.enterOuterAlt(localctx, 1), this.state = 757, this.arrayInitializer();
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
          this.enterOuterAlt(localctx, 2), this.state = 758, this.expression(0);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  arrayInitializer() {
    let localctx = new ArrayInitializerContext(this, this._ctx, this.state);
    this.enterRule(localctx, 102, ProcessingParser.RULE_arrayInitializer);
    let _la;
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        if (this.state = 761, this.match(ProcessingParser.LBRACE), this.state = 773, this._errHandler.sync(this), _la = this._input.LA(1), (_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431215) !== 0 || _la === 113 || _la === 115) {
          for (this.state = 762, this.variableInitializer(), this.state = 767, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 85, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
            _alt === 1 && (this.state = 763, this.match(ProcessingParser.COMMA), this.state = 764, this.variableInitializer()), this.state = 769, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
          this.state = 771, this._errHandler.sync(this), _la = this._input.LA(1), _la === 75 && (this.state = 770, this.match(ProcessingParser.COMMA));
        }
        this.state = 775, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classOrInterfaceType() {
    let localctx = new ClassOrInterfaceTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 104, ProcessingParser.RULE_classOrInterfaceType);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 777, this.match(ProcessingParser.IDENTIFIER), this.state = 779, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 88, this._ctx)) {
          case 1:
            this.state = 778, this.typeArguments();
            break;
        }
        for (this.state = 788, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 90, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; ) {
          if (_alt === 1)
            switch (this.state = 781, this.match(ProcessingParser.DOT), this.state = 782, this.match(ProcessingParser.IDENTIFIER), this.state = 784, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 89, this._ctx)) {
              case 1:
                this.state = 783, this.typeArguments();
                break;
            }
          this.state = 790, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 90, this._ctx);
        }
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeArgument() {
    let localctx = new TypeArgumentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 106, ProcessingParser.RULE_typeArgument);
    let _la;
    try {
      switch (this.state = 797, this._errHandler.sync(this), this._input.LA(1)) {
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
          this.enterOuterAlt(localctx, 1), this.state = 791, this.typeType();
          break;
        case 82:
          this.enterOuterAlt(localctx, 2), this.state = 792, this.match(ProcessingParser.QUESTION), this.state = 795, this._errHandler.sync(this), _la = this._input.LA(1), (_la === 23 || _la === 46) && (this.state = 793, _la = this._input.LA(1), _la === 23 || _la === 46 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 794, this.typeType());
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  qualifiedNameList() {
    let localctx = new QualifiedNameListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 108, ProcessingParser.RULE_qualifiedNameList);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 799, this.qualifiedName(), this.state = 804, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
        this.state = 800, this.match(ProcessingParser.COMMA), this.state = 801, this.qualifiedName(), this.state = 806, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  formalParameters() {
    let localctx = new FormalParametersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 110, ProcessingParser.RULE_formalParameters);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 807, this.match(ProcessingParser.LPAREN), this.state = 809, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 84953602) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 2098181) !== 0 || _la === 113 || _la === 115) && (this.state = 808, this.formalParameterList()), this.state = 811, this.match(ProcessingParser.RPAREN);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  formalParameterList() {
    let localctx = new FormalParameterListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 112, ProcessingParser.RULE_formalParameterList);
    let _la;
    try {
      let _alt;
      switch (this.state = 826, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 97, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            for (this.state = 813, this.formalParameter(), this.state = 818, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 95, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 814, this.match(ProcessingParser.COMMA), this.state = 815, this.formalParameter()), this.state = 820, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 95, this._ctx);
            this.state = 823, this._errHandler.sync(this), _la = this._input.LA(1), _la === 75 && (this.state = 821, this.match(ProcessingParser.COMMA), this.state = 822, this.lastFormalParameter());
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 825, this.lastFormalParameter();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  formalParameter() {
    let localctx = new FormalParameterContext(this, this._ctx, this.state);
    this.enterRule(localctx, 114, ProcessingParser.RULE_formalParameter);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 831, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 98, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 828, this.variableModifier()), this.state = 833, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
        this.state = 834, this.typeType(), this.state = 835, this.variableDeclaratorId();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  lastFormalParameter() {
    let localctx = new LastFormalParameterContext(this, this._ctx, this.state);
    this.enterRule(localctx, 116, ProcessingParser.RULE_lastFormalParameter);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 840, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 99, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 837, this.variableModifier()), this.state = 842, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
        this.state = 843, this.typeType(), this.state = 844, this.match(ProcessingParser.ELLIPSIS), this.state = 845, this.variableDeclaratorId();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  baseStringLiteral() {
    let localctx = new BaseStringLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 118, ProcessingParser.RULE_baseStringLiteral);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 847, this.match(ProcessingParser.STRING_LITERAL);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  multilineStringLiteral() {
    let localctx = new MultilineStringLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 120, ProcessingParser.RULE_multilineStringLiteral);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 849, this.match(ProcessingParser.MULTI_STRING_LIT);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  stringLiteral() {
    let localctx = new StringLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 122, ProcessingParser.RULE_stringLiteral);
    try {
      switch (this.state = 853, this._errHandler.sync(this), this._input.LA(1)) {
        case 65:
          this.enterOuterAlt(localctx, 1), this.state = 851, this.baseStringLiteral();
          break;
        case 66:
          this.enterOuterAlt(localctx, 2), this.state = 852, this.multilineStringLiteral();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  integerLiteral() {
    let localctx = new IntegerLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 124, ProcessingParser.RULE_integerLiteral);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 855, _la = this._input.LA(1), (_la - 58 & -32) === 0 && (1 << _la - 58 & 15) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  floatLiteral() {
    let localctx = new FloatLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 126, ProcessingParser.RULE_floatLiteral);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 857, _la = this._input.LA(1), _la === 62 || _la === 63 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotation() {
    let localctx = new AnnotationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 128, ProcessingParser.RULE_annotation);
    let _la;
    try {
      if (this.enterOuterAlt(localctx, 1), this.state = 859, this.match(ProcessingParser.AT), this.state = 860, this.qualifiedName(), this.state = 867, this._errHandler.sync(this), _la = this._input.LA(1), _la === 68) {
        switch (this.state = 861, this.match(ProcessingParser.LPAREN), this.state = 864, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 101, this._ctx)) {
          case 1:
            this.state = 862, this.elementValuePairs();
            break;
          case 2:
            this.state = 863, this.elementValue();
            break;
        }
        this.state = 866, this.match(ProcessingParser.RPAREN);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  elementValuePairs() {
    let localctx = new ElementValuePairsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 130, ProcessingParser.RULE_elementValuePairs);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 869, this.elementValuePair(), this.state = 874, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
        this.state = 870, this.match(ProcessingParser.COMMA), this.state = 871, this.elementValuePair(), this.state = 876, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  elementValuePair() {
    let localctx = new ElementValuePairContext(this, this._ctx, this.state);
    this.enterRule(localctx, 132, ProcessingParser.RULE_elementValuePair);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 877, this.match(ProcessingParser.IDENTIFIER), this.state = 878, this.match(ProcessingParser.ASSIGN), this.state = 879, this.elementValue();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  elementValue() {
    let localctx = new ElementValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 134, ProcessingParser.RULE_elementValue);
    try {
      switch (this.state = 884, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 104, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 881, this.expression(0);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 882, this.annotation();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 883, this.elementValueArrayInitializer();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  elementValueArrayInitializer() {
    let localctx = new ElementValueArrayInitializerContext(this, this._ctx, this.state);
    this.enterRule(localctx, 136, ProcessingParser.RULE_elementValueArrayInitializer);
    let _la;
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        if (this.state = 886, this.match(ProcessingParser.LBRACE), this.state = 895, this._errHandler.sync(this), _la = this._input.LA(1), (_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431215) !== 0 || _la === 113 || _la === 115)
          for (this.state = 887, this.elementValue(), this.state = 892, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 105, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
            _alt === 1 && (this.state = 888, this.match(ProcessingParser.COMMA), this.state = 889, this.elementValue()), this.state = 894, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
        this.state = 898, this._errHandler.sync(this), _la = this._input.LA(1), _la === 75 && (this.state = 897, this.match(ProcessingParser.COMMA)), this.state = 900, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationTypeDeclaration() {
    let localctx = new AnnotationTypeDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 138, ProcessingParser.RULE_annotationTypeDeclaration);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 902, this.match(ProcessingParser.AT), this.state = 903, this.match(ProcessingParser.INTERFACE), this.state = 904, this.match(ProcessingParser.IDENTIFIER), this.state = 905, this.annotationTypeBody();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationTypeBody() {
    let localctx = new AnnotationTypeBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 140, ProcessingParser.RULE_annotationTypeBody);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 907, this.match(ProcessingParser.LBRACE), this.state = 911, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 89180802) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 11050447) !== 0 || _la === 74 || _la === 113 || _la === 115; )
          this.state = 908, this.annotationTypeElementDeclaration(), this.state = 913, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 914, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationTypeElementDeclaration() {
    let localctx = new AnnotationTypeElementDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 142, ProcessingParser.RULE_annotationTypeElementDeclaration);
    try {
      let _alt;
      switch (this.state = 924, this._errHandler.sync(this), this._input.LA(1)) {
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
            for (this.state = 919, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 109, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 916, this.modifier()), this.state = 921, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 109, this._ctx);
            this.state = 922, this.annotationTypeElementRest();
          }
          break;
        case 74:
          this.enterOuterAlt(localctx, 2), this.state = 923, this.match(ProcessingParser.SEMI);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationTypeElementRest() {
    let localctx = new AnnotationTypeElementRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 144, ProcessingParser.RULE_annotationTypeElementRest);
    try {
      switch (this.state = 946, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 115, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 926, this.typeType(), this.state = 927, this.annotationMethodOrConstantRest(), this.state = 928, this.match(ProcessingParser.SEMI);
          break;
        case 2:
          switch (this.enterOuterAlt(localctx, 2), this.state = 930, this.classDeclaration(), this.state = 932, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 111, this._ctx)) {
            case 1:
              this.state = 931, this.match(ProcessingParser.SEMI);
              break;
          }
          break;
        case 3:
          switch (this.enterOuterAlt(localctx, 3), this.state = 934, this.interfaceDeclaration(), this.state = 936, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 112, this._ctx)) {
            case 1:
              this.state = 935, this.match(ProcessingParser.SEMI);
              break;
          }
          break;
        case 4:
          switch (this.enterOuterAlt(localctx, 4), this.state = 938, this.enumDeclaration(), this.state = 940, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 113, this._ctx)) {
            case 1:
              this.state = 939, this.match(ProcessingParser.SEMI);
              break;
          }
          break;
        case 5:
          switch (this.enterOuterAlt(localctx, 5), this.state = 942, this.annotationTypeDeclaration(), this.state = 944, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 114, this._ctx)) {
            case 1:
              this.state = 943, this.match(ProcessingParser.SEMI);
              break;
          }
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationMethodOrConstantRest() {
    let localctx = new AnnotationMethodOrConstantRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 146, ProcessingParser.RULE_annotationMethodOrConstantRest);
    try {
      switch (this.state = 950, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 116, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 948, this.annotationMethodRest();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 949, this.annotationConstantRest();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationMethodRest() {
    let localctx = new AnnotationMethodRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 148, ProcessingParser.RULE_annotationMethodRest);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 952, this.match(ProcessingParser.IDENTIFIER), this.state = 953, this.match(ProcessingParser.LPAREN), this.state = 954, this.match(ProcessingParser.RPAREN), this.state = 956, this._errHandler.sync(this), _la = this._input.LA(1), _la === 18 && (this.state = 955, this.defaultValue());
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  annotationConstantRest() {
    let localctx = new AnnotationConstantRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 150, ProcessingParser.RULE_annotationConstantRest);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 958, this.variableDeclarators();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  defaultValue() {
    let localctx = new DefaultValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 152, ProcessingParser.RULE_defaultValue);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 960, this.match(ProcessingParser.DEFAULT), this.state = 961, this.elementValue();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  block() {
    let localctx = new BlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 154, ProcessingParser.RULE_block);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 963, this.match(ProcessingParser.LBRACE), this.state = 967, this._errHandler.sync(this), _la = this._input.LA(1); (_la & -32) === 0 && (1 << _la & 488296390) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4285792215) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431727) !== 0 || _la === 113 || _la === 115; )
          this.state = 964, this.blockStatement(), this.state = 969, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 970, this.match(ProcessingParser.RBRACE);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  blockStatement() {
    let localctx = new BlockStatementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 156, ProcessingParser.RULE_blockStatement);
    try {
      switch (this.state = 977, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 119, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 972, this.localVariableDeclaration(), this.state = 973, this.match(ProcessingParser.SEMI);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 975, this.statement();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 976, this.localTypeDeclaration();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  localVariableDeclaration() {
    let localctx = new LocalVariableDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 158, ProcessingParser.RULE_localVariableDeclaration);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 982, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 120, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 979, this.variableModifier()), this.state = 984, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 120, this._ctx);
        this.state = 985, this.typeType(), this.state = 986, this.variableDeclarators();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  localTypeDeclaration() {
    let localctx = new LocalTypeDeclarationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 160, ProcessingParser.RULE_localTypeDeclaration);
    let _la;
    try {
      switch (this.state = 999, this._errHandler.sync(this), this._input.LA(1)) {
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
            for (this.state = 991, this._errHandler.sync(this), _la = this._input.LA(1); _la === 7 || _la === 24 || (_la - 39 & -32) === 0 && (1 << _la - 39 & 103) !== 0 || _la === 113; )
              this.state = 988, this.classOrInterfaceModifier(), this.state = 993, this._errHandler.sync(this), _la = this._input.LA(1);
            switch (this.state = 996, this._errHandler.sync(this), this._input.LA(1)) {
              case 15:
                this.state = 994, this.classDeclaration();
                break;
              case 34:
                this.state = 995, this.interfaceDeclaration();
                break;
              default:
                throw new dn(this);
            }
          }
          break;
        case 74:
          this.enterOuterAlt(localctx, 2), this.state = 998, this.match(ProcessingParser.SEMI);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  statement() {
    let localctx = new StatementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 162, ProcessingParser.RULE_statement);
    let _la;
    try {
      let _alt;
      switch (this.state = 1105, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 136, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1001, localctx._blockLabel = this.block();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1002, this.match(ProcessingParser.ASSERT), this.state = 1003, this.expression(0), this.state = 1006, this._errHandler.sync(this), _la = this._input.LA(1), _la === 83 && (this.state = 1004, this.match(ProcessingParser.COLON), this.state = 1005, this.expression(0)), this.state = 1008, this.match(ProcessingParser.SEMI);
          break;
        case 3:
          switch (this.enterOuterAlt(localctx, 3), this.state = 1010, this.match(ProcessingParser.IF), this.state = 1011, this.parExpression(), this.state = 1012, this.statement(), this.state = 1015, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 125, this._ctx)) {
            case 1:
              this.state = 1013, this.match(ProcessingParser.ELSE), this.state = 1014, this.statement();
              break;
          }
          break;
        case 4:
          this.enterOuterAlt(localctx, 4), this.state = 1017, this.match(ProcessingParser.FOR), this.state = 1018, this.match(ProcessingParser.LPAREN), this.state = 1019, this.forControl(), this.state = 1020, this.match(ProcessingParser.RPAREN), this.state = 1021, this.statement();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5), this.state = 1023, this.match(ProcessingParser.WHILE), this.state = 1024, this.parExpression(), this.state = 1025, this.statement();
          break;
        case 6:
          this.enterOuterAlt(localctx, 6), this.state = 1027, this.match(ProcessingParser.DO), this.state = 1028, this.statement(), this.state = 1029, this.match(ProcessingParser.WHILE), this.state = 1030, this.parExpression(), this.state = 1031, this.match(ProcessingParser.SEMI);
          break;
        case 7:
          switch (this.enterOuterAlt(localctx, 7), this.state = 1033, this.match(ProcessingParser.TRY), this.state = 1034, this.block(), this.state = 1044, this._errHandler.sync(this), this._input.LA(1)) {
            case 13:
              {
                this.state = 1036, this._errHandler.sync(this), _la = this._input.LA(1);
                do
                  this.state = 1035, this.catchClause(), this.state = 1038, this._errHandler.sync(this), _la = this._input.LA(1);
                while (_la === 13);
                this.state = 1041, this._errHandler.sync(this), _la = this._input.LA(1), _la === 25 && (this.state = 1040, this.finallyBlock());
              }
              break;
            case 25:
              this.state = 1043, this.finallyBlock();
              break;
            default:
              throw new dn(this);
          }
          break;
        case 8:
          this.enterOuterAlt(localctx, 8);
          {
            for (this.state = 1046, this.match(ProcessingParser.TRY), this.state = 1047, this.resourceSpecification(), this.state = 1048, this.block(), this.state = 1052, this._errHandler.sync(this), _la = this._input.LA(1); _la === 13; )
              this.state = 1049, this.catchClause(), this.state = 1054, this._errHandler.sync(this), _la = this._input.LA(1);
            this.state = 1056, this._errHandler.sync(this), _la = this._input.LA(1), _la === 25 && (this.state = 1055, this.finallyBlock());
          }
          break;
        case 9:
          this.enterOuterAlt(localctx, 9);
          {
            for (this.state = 1058, this.match(ProcessingParser.SWITCH), this.state = 1059, this.parExpression(), this.state = 1060, this.match(ProcessingParser.LBRACE), this.state = 1064, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 131, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 1061, this.switchBlockStatementGroup()), this.state = 1066, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 131, this._ctx);
            for (this.state = 1070, this._errHandler.sync(this), _la = this._input.LA(1); _la === 12 || _la === 18; )
              this.state = 1067, this.switchLabel(), this.state = 1072, this._errHandler.sync(this), _la = this._input.LA(1);
            this.state = 1073, this.match(ProcessingParser.RBRACE);
          }
          break;
        case 10:
          this.enterOuterAlt(localctx, 10), this.state = 1075, this.match(ProcessingParser.SYNCHRONIZED), this.state = 1076, this.parExpression(), this.state = 1077, this.block();
          break;
        case 11:
          this.enterOuterAlt(localctx, 11), this.state = 1079, this.match(ProcessingParser.RETURN), this.state = 1081, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 1080, this.expression(0)), this.state = 1083, this.match(ProcessingParser.SEMI);
          break;
        case 12:
          this.enterOuterAlt(localctx, 12), this.state = 1084, this.match(ProcessingParser.THROW), this.state = 1085, this.expression(0), this.state = 1086, this.match(ProcessingParser.SEMI);
          break;
        case 13:
          this.enterOuterAlt(localctx, 13), this.state = 1088, this.match(ProcessingParser.BREAK), this.state = 1090, this._errHandler.sync(this), _la = this._input.LA(1), _la === 115 && (this.state = 1089, this.match(ProcessingParser.IDENTIFIER)), this.state = 1092, this.match(ProcessingParser.SEMI);
          break;
        case 14:
          this.enterOuterAlt(localctx, 14), this.state = 1093, this.match(ProcessingParser.CONTINUE), this.state = 1095, this._errHandler.sync(this), _la = this._input.LA(1), _la === 115 && (this.state = 1094, this.match(ProcessingParser.IDENTIFIER)), this.state = 1097, this.match(ProcessingParser.SEMI);
          break;
        case 15:
          this.enterOuterAlt(localctx, 15), this.state = 1098, this.match(ProcessingParser.SEMI);
          break;
        case 16:
          this.enterOuterAlt(localctx, 16), this.state = 1099, localctx._statementExpression = this.expression(0), this.state = 1100, this.match(ProcessingParser.SEMI);
          break;
        case 17:
          this.enterOuterAlt(localctx, 17), this.state = 1102, localctx._identifierLabel = this.match(ProcessingParser.IDENTIFIER), this.state = 1103, this.match(ProcessingParser.COLON), this.state = 1104, this.statement();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  catchClause() {
    let localctx = new CatchClauseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 164, ProcessingParser.RULE_catchClause);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 1107, this.match(ProcessingParser.CATCH), this.state = 1108, this.match(ProcessingParser.LPAREN), this.state = 1112, this._errHandler.sync(this), _la = this._input.LA(1); _la === 24 || _la === 113; )
          this.state = 1109, this.variableModifier(), this.state = 1114, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 1115, this.catchType(), this.state = 1116, this.match(ProcessingParser.IDENTIFIER), this.state = 1117, this.match(ProcessingParser.RPAREN), this.state = 1118, this.block();
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  catchType() {
    let localctx = new CatchTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 166, ProcessingParser.RULE_catchType);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 1120, this.qualifiedName(), this.state = 1125, this._errHandler.sync(this), _la = this._input.LA(1); _la === 97; )
        this.state = 1121, this.match(ProcessingParser.BITOR), this.state = 1122, this.qualifiedName(), this.state = 1127, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  finallyBlock() {
    let localctx = new FinallyBlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 168, ProcessingParser.RULE_finallyBlock);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1128, this.match(ProcessingParser.FINALLY), this.state = 1129, this.block();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  resourceSpecification() {
    let localctx = new ResourceSpecificationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 170, ProcessingParser.RULE_resourceSpecification);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1131, this.match(ProcessingParser.LPAREN), this.state = 1132, this.resources(), this.state = 1134, this._errHandler.sync(this), _la = this._input.LA(1), _la === 74 && (this.state = 1133, this.match(ProcessingParser.SEMI)), this.state = 1136, this.match(ProcessingParser.RPAREN);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  resources() {
    let localctx = new ResourcesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 172, ProcessingParser.RULE_resources);
    try {
      let _alt;
      for (this.enterOuterAlt(localctx, 1), this.state = 1138, this.resource(), this.state = 1143, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 140, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
        _alt === 1 && (this.state = 1139, this.match(ProcessingParser.SEMI), this.state = 1140, this.resource()), this.state = 1145, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 140, this._ctx);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  resource() {
    let localctx = new ResourceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 174, ProcessingParser.RULE_resource);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 1149, this._errHandler.sync(this), _la = this._input.LA(1); _la === 24 || _la === 113; )
          this.state = 1146, this.variableModifier(), this.state = 1151, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 1152, this.classOrInterfaceType(), this.state = 1153, this.variableDeclaratorId(), this.state = 1154, this.match(ProcessingParser.ASSIGN), this.state = 1155, this.expression(0);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  switchBlockStatementGroup() {
    let localctx = new SwitchBlockStatementGroupContext(this, this._ctx, this.state);
    this.enterRule(localctx, 176, ProcessingParser.RULE_switchBlockStatementGroup);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 1158, this._errHandler.sync(this), _la = this._input.LA(1);
        do
          this.state = 1157, this.switchLabel(), this.state = 1160, this._errHandler.sync(this), _la = this._input.LA(1);
        while (_la === 12 || _la === 18);
        this.state = 1163, this._errHandler.sync(this), _la = this._input.LA(1);
        do
          this.state = 1162, this.blockStatement(), this.state = 1165, this._errHandler.sync(this), _la = this._input.LA(1);
        while ((_la & -32) === 0 && (1 << _la & 488296390) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4285792215) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431727) !== 0 || _la === 113 || _la === 115);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  switchLabel() {
    let localctx = new SwitchLabelContext(this, this._ctx, this.state);
    this.enterRule(localctx, 178, ProcessingParser.RULE_switchLabel);
    try {
      switch (this.state = 1175, this._errHandler.sync(this), this._input.LA(1)) {
        case 12:
          this.enterOuterAlt(localctx, 1);
          {
            switch (this.state = 1167, this.match(ProcessingParser.CASE), this.state = 1170, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 144, this._ctx)) {
              case 1:
                this.state = 1168, localctx._constantExpression = this.expression(0);
                break;
              case 2:
                this.state = 1169, localctx._enumConstantName = this.match(ProcessingParser.IDENTIFIER);
                break;
            }
            this.state = 1172, this.match(ProcessingParser.COLON);
          }
          break;
        case 18:
          this.enterOuterAlt(localctx, 2), this.state = 1173, this.match(ProcessingParser.DEFAULT), this.state = 1174, this.match(ProcessingParser.COLON);
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  forControl() {
    let localctx = new ForControlContext(this, this._ctx, this.state);
    this.enterRule(localctx, 180, ProcessingParser.RULE_forControl);
    let _la;
    try {
      switch (this.state = 1189, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 149, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1177, this.enhancedForControl();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1179, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 84953670) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 1178, this.forInit()), this.state = 1181, this.match(ProcessingParser.SEMI), this.state = 1183, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 1182, this.expression(0)), this.state = 1185, this.match(ProcessingParser.SEMI), this.state = 1187, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 1186, localctx._forUpdate = this.expressionList());
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  forInit() {
    let localctx = new ForInitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 182, ProcessingParser.RULE_forInit);
    try {
      switch (this.state = 1193, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 150, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1191, this.localVariableDeclaration();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1192, this.expressionList();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  enhancedForControl() {
    let localctx = new EnhancedForControlContext(this, this._ctx, this.state);
    this.enterRule(localctx, 184, ProcessingParser.RULE_enhancedForControl);
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 1198, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 151, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 1195, this.variableModifier()), this.state = 1200, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 151, this._ctx);
        this.state = 1201, this.typeType(), this.state = 1202, this.variableDeclaratorId(), this.state = 1203, this.match(ProcessingParser.COLON), this.state = 1204, this.expression(0);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  parExpression() {
    let localctx = new ParExpressionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 186, ProcessingParser.RULE_parExpression);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1206, this.match(ProcessingParser.LPAREN), this.state = 1207, this.expression(0), this.state = 1208, this.match(ProcessingParser.RPAREN);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  expressionList() {
    let localctx = new ExpressionListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 188, ProcessingParser.RULE_expressionList);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 1210, this.expression(0), this.state = 1215, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
        this.state = 1211, this.match(ProcessingParser.COMMA), this.state = 1212, this.expression(0), this.state = 1217, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  expression(_p) {
    _p === void 0 && (_p = 0);
    let _parentctx = this._ctx, _parentState = this.state, localctx = new ExpressionContext(this, this._ctx, _parentState), _prevctx = localctx, _startState = 190;
    this.enterRecursionRule(localctx, 190, ProcessingParser.RULE_expression, _p);
    let _la;
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 1249, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 156, this._ctx)) {
          case 1:
            this.state = 1219, this.primary();
            break;
          case 2:
            this.state = 1220, this.methodCall();
            break;
          case 3:
            this.state = 1221, this.match(ProcessingParser.NEW), this.state = 1222, this.creator();
            break;
          case 4:
            this.state = 1223, this.match(ProcessingParser.LPAREN), this.state = 1224, this.typeType(), this.state = 1225, this.match(ProcessingParser.RPAREN), this.state = 1226, this.expression(21);
            break;
          case 5:
            this.state = 1228, localctx._prefix = this._input.LT(1), _la = this._input.LA(1), (_la - 90 & -32) === 0 && (1 << _la - 90 & 15) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._prefix = this._errHandler.recoverInline(this), this.state = 1229, this.expression(19);
            break;
          case 6:
            this.state = 1230, localctx._prefix = this._input.LT(1), _la = this._input.LA(1), _la === 80 || _la === 81 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._prefix = this._errHandler.recoverInline(this), this.state = 1231, this.expression(18);
            break;
          case 7:
            this.state = 1232, this.lambdaExpression();
            break;
          case 8:
            switch (this.state = 1233, this.typeType(), this.state = 1234, this.match(ProcessingParser.COLONCOLON), this.state = 1240, this._errHandler.sync(this), this._input.LA(1)) {
              case 79:
              case 115:
                this.state = 1236, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1235, this.typeArguments()), this.state = 1238, this.match(ProcessingParser.IDENTIFIER);
                break;
              case 37:
                this.state = 1239, this.match(ProcessingParser.NEW);
                break;
              default:
                throw new dn(this);
            }
            break;
          case 9:
            this.state = 1242, this.classType(), this.state = 1243, this.match(ProcessingParser.COLONCOLON), this.state = 1245, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1244, this.typeArguments()), this.state = 1247, this.match(ProcessingParser.NEW);
            break;
        }
        for (this._ctx.stop = this._input.LT(-1), this.state = 1331, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 162, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; ) {
          if (_alt === 1)
            switch (this._parseListeners != null && this.triggerExitRuleEvent(), _prevctx = localctx, this.state = 1329, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 161, this._ctx)) {
              case 1:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1251, !this.precpred(this._ctx, 17))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
                  this.state = 1252, localctx._bop = this._input.LT(1), _la = this._input.LA(1), (_la - 94 & -32) === 0 && (1 << _la - 94 & 35) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._bop = this._errHandler.recoverInline(this), this.state = 1253, this.expression(18);
                }
                break;
              case 2:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1254, !this.precpred(this._ctx, 16))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
                  this.state = 1255, localctx._bop = this._input.LT(1), _la = this._input.LA(1), _la === 92 || _la === 93 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._bop = this._errHandler.recoverInline(this), this.state = 1256, this.expression(17);
                }
                break;
              case 3:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1257, !this.precpred(this._ctx, 15))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
                  switch (this.state = 1265, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 157, this._ctx)) {
                    case 1:
                      this.state = 1258, this.match(ProcessingParser.LT), this.state = 1259, this.match(ProcessingParser.LT);
                      break;
                    case 2:
                      this.state = 1260, this.match(ProcessingParser.GT), this.state = 1261, this.match(ProcessingParser.GT), this.state = 1262, this.match(ProcessingParser.GT);
                      break;
                    case 3:
                      this.state = 1263, this.match(ProcessingParser.GT), this.state = 1264, this.match(ProcessingParser.GT);
                      break;
                  }
                  this.state = 1267, this.expression(16);
                }
                break;
              case 4:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1268, !this.precpred(this._ctx, 14))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
                  this.state = 1269, localctx._bop = this._input.LT(1), _la = this._input.LA(1), (_la - 78 & -32) === 0 && (1 << _la - 78 & 387) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._bop = this._errHandler.recoverInline(this), this.state = 1270, this.expression(15);
                }
                break;
              case 5:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1271, !this.precpred(this._ctx, 12))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
                  this.state = 1272, localctx._bop = this._input.LT(1), _la = this._input.LA(1), _la === 84 || _la === 87 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._bop = this._errHandler.recoverInline(this), this.state = 1273, this.expression(13);
                }
                break;
              case 6:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1274, !this.precpred(this._ctx, 11))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
                  this.state = 1275, localctx._bop = this.match(ProcessingParser.BITAND), this.state = 1276, this.expression(12);
                }
                break;
              case 7:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1277, !this.precpred(this._ctx, 10))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
                  this.state = 1278, localctx._bop = this.match(ProcessingParser.CARET), this.state = 1279, this.expression(11);
                }
                break;
              case 8:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1280, !this.precpred(this._ctx, 9))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
                  this.state = 1281, localctx._bop = this.match(ProcessingParser.BITOR), this.state = 1282, this.expression(10);
                }
                break;
              case 9:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1283, !this.precpred(this._ctx, 8))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
                  this.state = 1284, localctx._bop = this.match(ProcessingParser.AND), this.state = 1285, this.expression(9);
                }
                break;
              case 10:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1286, !this.precpred(this._ctx, 7))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
                  this.state = 1287, localctx._bop = this.match(ProcessingParser.OR), this.state = 1288, this.expression(8);
                }
                break;
              case 11:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1289, !this.precpred(this._ctx, 6))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
                  this.state = 1290, localctx._bop = this.match(ProcessingParser.QUESTION), this.state = 1291, this.expression(0), this.state = 1292, this.match(ProcessingParser.COLON), this.state = 1293, this.expression(7);
                }
                break;
              case 12:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1295, !this.precpred(this._ctx, 5))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
                  this.state = 1296, localctx._bop = this._input.LT(1), _la = this._input.LA(1), (_la - 77 & -32) === 0 && (1 << _la - 77 & 4286578689) !== 0 || _la === 109 || _la === 110 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._bop = this._errHandler.recoverInline(this), this.state = 1297, this.expression(5);
                }
                break;
              case 13:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1298, !this.precpred(this._ctx, 25))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 25)");
                  switch (this.state = 1299, localctx._bop = this.match(ProcessingParser.DOT), this.state = 1311, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 159, this._ctx)) {
                    case 1:
                      this.state = 1300, this.match(ProcessingParser.IDENTIFIER);
                      break;
                    case 2:
                      this.state = 1301, this.methodCall();
                      break;
                    case 3:
                      this.state = 1302, this.match(ProcessingParser.THIS);
                      break;
                    case 4:
                      this.state = 1303, this.match(ProcessingParser.NEW), this.state = 1305, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1304, this.nonWildcardTypeArguments()), this.state = 1307, this.innerCreator();
                      break;
                    case 5:
                      this.state = 1308, this.match(ProcessingParser.SUPER), this.state = 1309, this.superSuffix();
                      break;
                    case 6:
                      this.state = 1310, this.explicitGenericInvocation();
                      break;
                  }
                }
                break;
              case 14:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1313, !this.precpred(this._ctx, 24))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
                  this.state = 1314, this.match(ProcessingParser.LBRACK), this.state = 1315, this.expression(0), this.state = 1316, this.match(ProcessingParser.RBRACK);
                }
                break;
              case 15:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1318, !this.precpred(this._ctx, 20))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
                  this.state = 1319, localctx._postfix = this._input.LT(1), _la = this._input.LA(1), _la === 90 || _la === 91 ? (this._errHandler.reportMatch(this), this.consume()) : localctx._postfix = this._errHandler.recoverInline(this);
                }
                break;
              case 16:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1320, !this.precpred(this._ctx, 13))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
                  this.state = 1321, localctx._bop = this.match(ProcessingParser.INSTANCEOF), this.state = 1322, this.typeType();
                }
                break;
              case 17:
                {
                  if (localctx = new ExpressionContext(this, _parentctx, _parentState), this.pushNewRecursionContext(localctx, _startState, ProcessingParser.RULE_expression), this.state = 1323, !this.precpred(this._ctx, 3))
                    throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
                  this.state = 1324, this.match(ProcessingParser.COLONCOLON), this.state = 1326, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1325, this.typeArguments()), this.state = 1328, this.match(ProcessingParser.IDENTIFIER);
                }
                break;
            }
          this.state = 1333, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
        }
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  // @RuleVersion(0)
  lambdaExpression() {
    let localctx = new LambdaExpressionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 192, ProcessingParser.RULE_lambdaExpression);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1334, this.lambdaParameters(), this.state = 1335, this.match(ProcessingParser.ARROW), this.state = 1336, this.lambdaBody();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  lambdaParameters() {
    let localctx = new LambdaParametersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 194, ProcessingParser.RULE_lambdaParameters);
    let _la;
    try {
      switch (this.state = 1354, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 165, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1338, this.match(ProcessingParser.IDENTIFIER);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1339, this.match(ProcessingParser.LPAREN), this.state = 1341, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 84953602) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 2098181) !== 0 || _la === 113 || _la === 115) && (this.state = 1340, this.formalParameterList()), this.state = 1343, this.match(ProcessingParser.RPAREN);
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            for (this.state = 1344, this.match(ProcessingParser.LPAREN), this.state = 1345, this.match(ProcessingParser.IDENTIFIER), this.state = 1350, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
              this.state = 1346, this.match(ProcessingParser.COMMA), this.state = 1347, this.match(ProcessingParser.IDENTIFIER), this.state = 1352, this._errHandler.sync(this), _la = this._input.LA(1);
            this.state = 1353, this.match(ProcessingParser.RPAREN);
          }
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  lambdaBody() {
    let localctx = new LambdaBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 196, ProcessingParser.RULE_lambdaBody);
    try {
      switch (this.state = 1358, this._errHandler.sync(this), this._input.LA(1)) {
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
          this.enterOuterAlt(localctx, 1), this.state = 1356, this.expression(0);
          break;
        case 70:
          this.enterOuterAlt(localctx, 2), this.state = 1357, this.block();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  primary() {
    let localctx = new PrimaryContext(this, this._ctx, this.state);
    this.enterRule(localctx, 198, ProcessingParser.RULE_primary);
    try {
      switch (this.state = 1378, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 168, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1360, this.match(ProcessingParser.LPAREN), this.state = 1361, this.expression(0), this.state = 1362, this.match(ProcessingParser.RPAREN);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1364, this.match(ProcessingParser.THIS);
          break;
        case 3:
          this.enterOuterAlt(localctx, 3), this.state = 1365, this.match(ProcessingParser.SUPER);
          break;
        case 4:
          this.enterOuterAlt(localctx, 4), this.state = 1366, this.literal();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5), this.state = 1367, this.match(ProcessingParser.IDENTIFIER);
          break;
        case 6:
          this.enterOuterAlt(localctx, 6), this.state = 1368, this.typeTypeOrVoid(), this.state = 1369, this.match(ProcessingParser.DOT), this.state = 1370, this.match(ProcessingParser.CLASS);
          break;
        case 7:
          switch (this.enterOuterAlt(localctx, 7), this.state = 1372, this.nonWildcardTypeArguments(), this.state = 1376, this._errHandler.sync(this), this._input.LA(1)) {
            case 46:
            case 115:
              this.state = 1373, this.explicitGenericInvocationSuffix();
              break;
            case 49:
              this.state = 1374, this.match(ProcessingParser.THIS), this.state = 1375, this.arguments();
              break;
            default:
              throw new dn(this);
          }
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classType() {
    let localctx = new ClassTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 200, ProcessingParser.RULE_classType);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 1383, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 169, this._ctx)) {
          case 1:
            this.state = 1380, this.classOrInterfaceType(), this.state = 1381, this.match(ProcessingParser.DOT);
            break;
        }
        for (this.state = 1388, this._errHandler.sync(this), _la = this._input.LA(1); _la === 113; )
          this.state = 1385, this.annotation(), this.state = 1390, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 1391, this.match(ProcessingParser.IDENTIFIER), this.state = 1393, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1392, this.typeArguments());
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  creator() {
    let localctx = new CreatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 202, ProcessingParser.RULE_creator);
    try {
      switch (this.state = 1404, this._errHandler.sync(this), this._input.LA(1)) {
        case 79:
          this.enterOuterAlt(localctx, 1), this.state = 1395, this.nonWildcardTypeArguments(), this.state = 1396, this.createdName(), this.state = 1397, this.classCreatorRest();
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
          switch (this.enterOuterAlt(localctx, 2), this.state = 1399, this.createdName(), this.state = 1402, this._errHandler.sync(this), this._input.LA(1)) {
            case 72:
              this.state = 1400, this.arrayCreatorRest();
              break;
            case 68:
              this.state = 1401, this.classCreatorRest();
              break;
            default:
              throw new dn(this);
          }
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  createdName() {
    let localctx = new CreatedNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 204, ProcessingParser.RULE_createdName);
    let _la;
    try {
      switch (this.state = 1421, this._errHandler.sync(this), this._input.LA(1)) {
        case 115:
          for (this.enterOuterAlt(localctx, 1), this.state = 1406, this.match(ProcessingParser.IDENTIFIER), this.state = 1408, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1407, this.typeArgumentsOrDiamond()), this.state = 1417, this._errHandler.sync(this), _la = this._input.LA(1); _la === 76; )
            this.state = 1410, this.match(ProcessingParser.DOT), this.state = 1411, this.match(ProcessingParser.IDENTIFIER), this.state = 1413, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1412, this.typeArgumentsOrDiamond()), this.state = 1419, this._errHandler.sync(this), _la = this._input.LA(1);
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
          this.enterOuterAlt(localctx, 2), this.state = 1420, this.primitiveType();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  innerCreator() {
    let localctx = new InnerCreatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 206, ProcessingParser.RULE_innerCreator);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1423, this.match(ProcessingParser.IDENTIFIER), this.state = 1425, this._errHandler.sync(this), _la = this._input.LA(1), _la === 79 && (this.state = 1424, this.nonWildcardTypeArgumentsOrDiamond()), this.state = 1427, this.classCreatorRest();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  arrayCreatorRest() {
    let localctx = new ArrayCreatorRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 208, ProcessingParser.RULE_arrayCreatorRest);
    let _la;
    try {
      let _alt;
      switch (this.enterOuterAlt(localctx, 1), this.state = 1429, this.match(ProcessingParser.LBRACK), this.state = 1457, this._errHandler.sync(this), this._input.LA(1)) {
        case 73:
          {
            for (this.state = 1430, this.match(ProcessingParser.RBRACK), this.state = 1435, this._errHandler.sync(this), _la = this._input.LA(1); _la === 72; )
              this.state = 1431, this.match(ProcessingParser.LBRACK), this.state = 1432, this.match(ProcessingParser.RBRACK), this.state = 1437, this._errHandler.sync(this), _la = this._input.LA(1);
            this.state = 1438, this.arrayInitializer();
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
            for (this.state = 1439, this.expression(0), this.state = 1440, this.match(ProcessingParser.RBRACK), this.state = 1447, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 180, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 1441, this.match(ProcessingParser.LBRACK), this.state = 1442, this.expression(0), this.state = 1443, this.match(ProcessingParser.RBRACK)), this.state = 1449, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 180, this._ctx);
            for (this.state = 1454, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 181, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
              _alt === 1 && (this.state = 1450, this.match(ProcessingParser.LBRACK), this.state = 1451, this.match(ProcessingParser.RBRACK)), this.state = 1456, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 181, this._ctx);
          }
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  classCreatorRest() {
    let localctx = new ClassCreatorRestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 210, ProcessingParser.RULE_classCreatorRest);
    try {
      switch (this.enterOuterAlt(localctx, 1), this.state = 1459, this.arguments(), this.state = 1461, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 183, this._ctx)) {
        case 1:
          this.state = 1460, this.classBody();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  explicitGenericInvocation() {
    let localctx = new ExplicitGenericInvocationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 212, ProcessingParser.RULE_explicitGenericInvocation);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1463, this.nonWildcardTypeArguments(), this.state = 1464, this.explicitGenericInvocationSuffix();
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeArgumentsOrDiamond() {
    let localctx = new TypeArgumentsOrDiamondContext(this, this._ctx, this.state);
    this.enterRule(localctx, 214, ProcessingParser.RULE_typeArgumentsOrDiamond);
    try {
      switch (this.state = 1469, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 184, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1466, this.match(ProcessingParser.LT), this.state = 1467, this.match(ProcessingParser.GT);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1468, this.typeArguments();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  nonWildcardTypeArgumentsOrDiamond() {
    let localctx = new NonWildcardTypeArgumentsOrDiamondContext(this, this._ctx, this.state);
    this.enterRule(localctx, 216, ProcessingParser.RULE_nonWildcardTypeArgumentsOrDiamond);
    try {
      switch (this.state = 1474, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 185, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1), this.state = 1471, this.match(ProcessingParser.LT), this.state = 1472, this.match(ProcessingParser.GT);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2), this.state = 1473, this.nonWildcardTypeArguments();
          break;
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  nonWildcardTypeArguments() {
    let localctx = new NonWildcardTypeArgumentsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 218, ProcessingParser.RULE_nonWildcardTypeArguments);
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1476, this.match(ProcessingParser.LT), this.state = 1477, this.typeList(), this.state = 1478, this.match(ProcessingParser.GT);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeList() {
    let localctx = new TypeListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 220, ProcessingParser.RULE_typeList);
    let _la;
    try {
      for (this.enterOuterAlt(localctx, 1), this.state = 1480, this.typeType(), this.state = 1485, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
        this.state = 1481, this.match(ProcessingParser.COMMA), this.state = 1482, this.typeType(), this.state = 1487, this._errHandler.sync(this), _la = this._input.LA(1);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeType() {
    let localctx = new TypeTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 222, ProcessingParser.RULE_typeType);
    let _la;
    try {
      let _alt;
      this.enterOuterAlt(localctx, 1);
      {
        switch (this.state = 1489, this._errHandler.sync(this), _la = this._input.LA(1), _la === 113 && (this.state = 1488, this.annotation()), this.state = 1494, this._errHandler.sync(this), this._input.LA(1)) {
          case 115:
            this.state = 1491, this.classOrInterfaceType();
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
            this.state = 1492, this.primitiveType();
            break;
          case 54:
            this.state = 1493, this.match(ProcessingParser.VAR);
            break;
          default:
            throw new dn(this);
        }
        for (this.state = 1500, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 189, this._ctx); _alt !== 2 && _alt !== Ge.INVALID_ALT_NUMBER; )
          _alt === 1 && (this.state = 1496, this.match(ProcessingParser.LBRACK), this.state = 1497, this.match(ProcessingParser.RBRACK)), this.state = 1502, this._errHandler.sync(this), _alt = this._interp.adaptivePredict(this._input, 189, this._ctx);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  typeArguments() {
    let localctx = new TypeArgumentsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 224, ProcessingParser.RULE_typeArguments);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        for (this.state = 1503, this.match(ProcessingParser.LT), this.state = 1504, this.typeArgument(), this.state = 1509, this._errHandler.sync(this), _la = this._input.LA(1); _la === 75; )
          this.state = 1505, this.match(ProcessingParser.COMMA), this.state = 1506, this.typeArgument(), this.state = 1511, this._errHandler.sync(this), _la = this._input.LA(1);
        this.state = 1512, this.match(ProcessingParser.GT);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  superSuffix() {
    let localctx = new SuperSuffixContext(this, this._ctx, this.state);
    this.enterRule(localctx, 226, ProcessingParser.RULE_superSuffix);
    try {
      switch (this.state = 1520, this._errHandler.sync(this), this._input.LA(1)) {
        case 68:
          this.enterOuterAlt(localctx, 1), this.state = 1514, this.arguments();
          break;
        case 76:
          switch (this.enterOuterAlt(localctx, 2), this.state = 1515, this.match(ProcessingParser.DOT), this.state = 1516, this.match(ProcessingParser.IDENTIFIER), this.state = 1518, this._errHandler.sync(this), this._interp.adaptivePredict(this._input, 191, this._ctx)) {
            case 1:
              this.state = 1517, this.arguments();
              break;
          }
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  explicitGenericInvocationSuffix() {
    let localctx = new ExplicitGenericInvocationSuffixContext(this, this._ctx, this.state);
    this.enterRule(localctx, 228, ProcessingParser.RULE_explicitGenericInvocationSuffix);
    try {
      switch (this.state = 1526, this._errHandler.sync(this), this._input.LA(1)) {
        case 46:
          this.enterOuterAlt(localctx, 1), this.state = 1522, this.match(ProcessingParser.SUPER), this.state = 1523, this.superSuffix();
          break;
        case 115:
          this.enterOuterAlt(localctx, 2), this.state = 1524, this.match(ProcessingParser.IDENTIFIER), this.state = 1525, this.arguments();
          break;
        default:
          throw new dn(this);
      }
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  arguments() {
    let localctx = new ArgumentsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 230, ProcessingParser.RULE_arguments);
    let _la;
    try {
      this.enterOuterAlt(localctx, 1), this.state = 1528, this.match(ProcessingParser.LPAREN), this.state = 1530, this._errHandler.sync(this), _la = this._input.LA(1), ((_la & -32) === 0 && (1 << _la & 68176454) !== 0 || (_la - 33 & -32) === 0 && (1 << _la - 33 & 4267779093) !== 0 || (_la - 65 & -32) === 0 && (1 << _la - 65 & 503431183) !== 0 || _la === 113 || _la === 115) && (this.state = 1529, this.expressionList()), this.state = 1532, this.match(ProcessingParser.RPAREN);
    } catch (re2) {
      if (re2 instanceof _n)
        localctx.exception = re2, this._errHandler.reportError(this, re2), this._errHandler.recover(this, re2);
      else
        throw re2;
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  sempred(localctx, ruleIndex, predIndex) {
    switch (ruleIndex) {
      case 95:
        return this.expression_sempred(localctx, predIndex);
    }
    return !0;
  }
  expression_sempred(localctx, predIndex) {
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
    return !0;
  }
  static _serializedATN = [
    4,
    1,
    115,
    1535,
    2,
    0,
    7,
    0,
    2,
    1,
    7,
    1,
    2,
    2,
    7,
    2,
    2,
    3,
    7,
    3,
    2,
    4,
    7,
    4,
    2,
    5,
    7,
    5,
    2,
    6,
    7,
    6,
    2,
    7,
    7,
    7,
    2,
    8,
    7,
    8,
    2,
    9,
    7,
    9,
    2,
    10,
    7,
    10,
    2,
    11,
    7,
    11,
    2,
    12,
    7,
    12,
    2,
    13,
    7,
    13,
    2,
    14,
    7,
    14,
    2,
    15,
    7,
    15,
    2,
    16,
    7,
    16,
    2,
    17,
    7,
    17,
    2,
    18,
    7,
    18,
    2,
    19,
    7,
    19,
    2,
    20,
    7,
    20,
    2,
    21,
    7,
    21,
    2,
    22,
    7,
    22,
    2,
    23,
    7,
    23,
    2,
    24,
    7,
    24,
    2,
    25,
    7,
    25,
    2,
    26,
    7,
    26,
    2,
    27,
    7,
    27,
    2,
    28,
    7,
    28,
    2,
    29,
    7,
    29,
    2,
    30,
    7,
    30,
    2,
    31,
    7,
    31,
    2,
    32,
    7,
    32,
    2,
    33,
    7,
    33,
    2,
    34,
    7,
    34,
    2,
    35,
    7,
    35,
    2,
    36,
    7,
    36,
    2,
    37,
    7,
    37,
    2,
    38,
    7,
    38,
    2,
    39,
    7,
    39,
    2,
    40,
    7,
    40,
    2,
    41,
    7,
    41,
    2,
    42,
    7,
    42,
    2,
    43,
    7,
    43,
    2,
    44,
    7,
    44,
    2,
    45,
    7,
    45,
    2,
    46,
    7,
    46,
    2,
    47,
    7,
    47,
    2,
    48,
    7,
    48,
    2,
    49,
    7,
    49,
    2,
    50,
    7,
    50,
    2,
    51,
    7,
    51,
    2,
    52,
    7,
    52,
    2,
    53,
    7,
    53,
    2,
    54,
    7,
    54,
    2,
    55,
    7,
    55,
    2,
    56,
    7,
    56,
    2,
    57,
    7,
    57,
    2,
    58,
    7,
    58,
    2,
    59,
    7,
    59,
    2,
    60,
    7,
    60,
    2,
    61,
    7,
    61,
    2,
    62,
    7,
    62,
    2,
    63,
    7,
    63,
    2,
    64,
    7,
    64,
    2,
    65,
    7,
    65,
    2,
    66,
    7,
    66,
    2,
    67,
    7,
    67,
    2,
    68,
    7,
    68,
    2,
    69,
    7,
    69,
    2,
    70,
    7,
    70,
    2,
    71,
    7,
    71,
    2,
    72,
    7,
    72,
    2,
    73,
    7,
    73,
    2,
    74,
    7,
    74,
    2,
    75,
    7,
    75,
    2,
    76,
    7,
    76,
    2,
    77,
    7,
    77,
    2,
    78,
    7,
    78,
    2,
    79,
    7,
    79,
    2,
    80,
    7,
    80,
    2,
    81,
    7,
    81,
    2,
    82,
    7,
    82,
    2,
    83,
    7,
    83,
    2,
    84,
    7,
    84,
    2,
    85,
    7,
    85,
    2,
    86,
    7,
    86,
    2,
    87,
    7,
    87,
    2,
    88,
    7,
    88,
    2,
    89,
    7,
    89,
    2,
    90,
    7,
    90,
    2,
    91,
    7,
    91,
    2,
    92,
    7,
    92,
    2,
    93,
    7,
    93,
    2,
    94,
    7,
    94,
    2,
    95,
    7,
    95,
    2,
    96,
    7,
    96,
    2,
    97,
    7,
    97,
    2,
    98,
    7,
    98,
    2,
    99,
    7,
    99,
    2,
    100,
    7,
    100,
    2,
    101,
    7,
    101,
    2,
    102,
    7,
    102,
    2,
    103,
    7,
    103,
    2,
    104,
    7,
    104,
    2,
    105,
    7,
    105,
    2,
    106,
    7,
    106,
    2,
    107,
    7,
    107,
    2,
    108,
    7,
    108,
    2,
    109,
    7,
    109,
    2,
    110,
    7,
    110,
    2,
    111,
    7,
    111,
    2,
    112,
    7,
    112,
    2,
    113,
    7,
    113,
    2,
    114,
    7,
    114,
    2,
    115,
    7,
    115,
    1,
    0,
    1,
    0,
    1,
    0,
    3,
    0,
    236,
    8,
    0,
    1,
    1,
    3,
    1,
    239,
    8,
    1,
    1,
    1,
    5,
    1,
    242,
    8,
    1,
    10,
    1,
    12,
    1,
    245,
    9,
    1,
    1,
    1,
    4,
    1,
    248,
    8,
    1,
    11,
    1,
    12,
    1,
    249,
    1,
    1,
    1,
    1,
    1,
    2,
    1,
    2,
    1,
    2,
    5,
    2,
    257,
    8,
    2,
    10,
    2,
    12,
    2,
    260,
    9,
    2,
    1,
    2,
    1,
    2,
    1,
    3,
    1,
    3,
    5,
    3,
    266,
    8,
    3,
    10,
    3,
    12,
    3,
    269,
    9,
    3,
    1,
    3,
    1,
    3,
    1,
    4,
    1,
    4,
    1,
    4,
    5,
    4,
    276,
    8,
    4,
    10,
    4,
    12,
    4,
    279,
    9,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    5,
    4,
    286,
    8,
    4,
    10,
    4,
    12,
    4,
    289,
    9,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    5,
    4,
    294,
    8,
    4,
    10,
    4,
    12,
    4,
    297,
    9,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    1,
    4,
    5,
    4,
    304,
    8,
    4,
    10,
    4,
    12,
    4,
    307,
    9,
    4,
    3,
    4,
    309,
    8,
    4,
    1,
    5,
    1,
    5,
    1,
    5,
    1,
    5,
    5,
    5,
    315,
    8,
    5,
    10,
    5,
    12,
    5,
    318,
    9,
    5,
    3,
    5,
    320,
    8,
    5,
    1,
    6,
    1,
    6,
    1,
    6,
    5,
    6,
    325,
    8,
    6,
    10,
    6,
    12,
    6,
    328,
    9,
    6,
    1,
    6,
    1,
    6,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    3,
    7,
    336,
    8,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    3,
    7,
    342,
    8,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    1,
    7,
    3,
    7,
    348,
    8,
    7,
    1,
    7,
    3,
    7,
    351,
    8,
    7,
    1,
    8,
    1,
    8,
    1,
    8,
    3,
    8,
    356,
    8,
    8,
    1,
    8,
    1,
    8,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    1,
    9,
    3,
    9,
    369,
    8,
    9,
    1,
    10,
    1,
    10,
    1,
    11,
    1,
    11,
    3,
    11,
    375,
    8,
    11,
    1,
    11,
    1,
    11,
    1,
    11,
    3,
    11,
    380,
    8,
    11,
    5,
    11,
    382,
    8,
    11,
    10,
    11,
    12,
    11,
    385,
    9,
    11,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    1,
    12,
    3,
    12,
    394,
    8,
    12,
    1,
    13,
    1,
    13,
    1,
    14,
    3,
    14,
    399,
    8,
    14,
    1,
    14,
    5,
    14,
    402,
    8,
    14,
    10,
    14,
    12,
    14,
    405,
    9,
    14,
    1,
    14,
    5,
    14,
    408,
    8,
    14,
    10,
    14,
    12,
    14,
    411,
    9,
    14,
    1,
    14,
    1,
    14,
    1,
    15,
    5,
    15,
    416,
    8,
    15,
    10,
    15,
    12,
    15,
    419,
    9,
    15,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    15,
    1,
    16,
    1,
    16,
    3,
    16,
    427,
    8,
    16,
    1,
    16,
    1,
    16,
    1,
    16,
    3,
    16,
    432,
    8,
    16,
    1,
    16,
    1,
    16,
    1,
    17,
    5,
    17,
    437,
    8,
    17,
    10,
    17,
    12,
    17,
    440,
    9,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    1,
    17,
    3,
    17,
    446,
    8,
    17,
    1,
    17,
    3,
    17,
    449,
    8,
    17,
    1,
    18,
    1,
    18,
    1,
    18,
    1,
    18,
    1,
    18,
    3,
    18,
    456,
    8,
    18,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    1,
    19,
    3,
    19,
    466,
    8,
    19,
    1,
    20,
    1,
    20,
    3,
    20,
    470,
    8,
    20,
    1,
    21,
    1,
    21,
    1,
    21,
    3,
    21,
    475,
    8,
    21,
    1,
    21,
    1,
    21,
    3,
    21,
    479,
    8,
    21,
    1,
    21,
    1,
    21,
    3,
    21,
    483,
    8,
    21,
    1,
    21,
    1,
    21,
    1,
    22,
    1,
    22,
    1,
    22,
    1,
    22,
    5,
    22,
    491,
    8,
    22,
    10,
    22,
    12,
    22,
    494,
    9,
    22,
    1,
    22,
    1,
    22,
    1,
    23,
    5,
    23,
    499,
    8,
    23,
    10,
    23,
    12,
    23,
    502,
    9,
    23,
    1,
    23,
    1,
    23,
    1,
    23,
    3,
    23,
    507,
    8,
    23,
    1,
    24,
    1,
    24,
    1,
    24,
    5,
    24,
    512,
    8,
    24,
    10,
    24,
    12,
    24,
    515,
    9,
    24,
    1,
    25,
    1,
    25,
    1,
    25,
    1,
    25,
    3,
    25,
    521,
    8,
    25,
    1,
    25,
    1,
    25,
    3,
    25,
    525,
    8,
    25,
    1,
    25,
    3,
    25,
    528,
    8,
    25,
    1,
    25,
    3,
    25,
    531,
    8,
    25,
    1,
    25,
    1,
    25,
    1,
    26,
    1,
    26,
    1,
    26,
    5,
    26,
    538,
    8,
    26,
    10,
    26,
    12,
    26,
    541,
    9,
    26,
    1,
    27,
    5,
    27,
    544,
    8,
    27,
    10,
    27,
    12,
    27,
    547,
    9,
    27,
    1,
    27,
    1,
    27,
    3,
    27,
    551,
    8,
    27,
    1,
    27,
    3,
    27,
    554,
    8,
    27,
    1,
    28,
    1,
    28,
    5,
    28,
    558,
    8,
    28,
    10,
    28,
    12,
    28,
    561,
    9,
    28,
    1,
    29,
    1,
    29,
    1,
    29,
    3,
    29,
    566,
    8,
    29,
    1,
    29,
    1,
    29,
    3,
    29,
    570,
    8,
    29,
    1,
    29,
    1,
    29,
    1,
    30,
    1,
    30,
    5,
    30,
    576,
    8,
    30,
    10,
    30,
    12,
    30,
    579,
    9,
    30,
    1,
    30,
    1,
    30,
    1,
    31,
    1,
    31,
    5,
    31,
    585,
    8,
    31,
    10,
    31,
    12,
    31,
    588,
    9,
    31,
    1,
    31,
    1,
    31,
    1,
    32,
    1,
    32,
    1,
    32,
    3,
    32,
    595,
    8,
    32,
    1,
    32,
    1,
    32,
    5,
    32,
    599,
    8,
    32,
    10,
    32,
    12,
    32,
    602,
    9,
    32,
    1,
    32,
    3,
    32,
    605,
    8,
    32,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    1,
    33,
    3,
    33,
    616,
    8,
    33,
    1,
    34,
    1,
    34,
    1,
    34,
    1,
    34,
    1,
    34,
    5,
    34,
    623,
    8,
    34,
    10,
    34,
    12,
    34,
    626,
    9,
    34,
    1,
    34,
    1,
    34,
    3,
    34,
    630,
    8,
    34,
    1,
    34,
    1,
    34,
    1,
    35,
    1,
    35,
    3,
    35,
    636,
    8,
    35,
    1,
    36,
    1,
    36,
    3,
    36,
    640,
    8,
    36,
    1,
    37,
    1,
    37,
    1,
    37,
    1,
    38,
    1,
    38,
    1,
    38,
    1,
    39,
    1,
    39,
    1,
    39,
    1,
    39,
    3,
    39,
    652,
    8,
    39,
    1,
    39,
    1,
    39,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    40,
    1,
    41,
    5,
    41,
    661,
    8,
    41,
    10,
    41,
    12,
    41,
    664,
    9,
    41,
    1,
    41,
    1,
    41,
    3,
    41,
    668,
    8,
    41,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    1,
    42,
    3,
    42,
    677,
    8,
    42,
    1,
    43,
    1,
    43,
    1,
    43,
    1,
    43,
    5,
    43,
    683,
    8,
    43,
    10,
    43,
    12,
    43,
    686,
    9,
    43,
    1,
    43,
    1,
    43,
    1,
    44,
    1,
    44,
    1,
    44,
    5,
    44,
    693,
    8,
    44,
    10,
    44,
    12,
    44,
    696,
    9,
    44,
    1,
    44,
    1,
    44,
    1,
    44,
    1,
    45,
    5,
    45,
    702,
    8,
    45,
    10,
    45,
    12,
    45,
    705,
    9,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    5,
    45,
    710,
    8,
    45,
    10,
    45,
    12,
    45,
    713,
    9,
    45,
    1,
    45,
    1,
    45,
    3,
    45,
    717,
    8,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    1,
    45,
    5,
    45,
    723,
    8,
    45,
    10,
    45,
    12,
    45,
    726,
    9,
    45,
    1,
    45,
    1,
    45,
    3,
    45,
    730,
    8,
    45,
    1,
    45,
    1,
    45,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    1,
    46,
    3,
    46,
    740,
    8,
    46,
    1,
    47,
    1,
    47,
    1,
    47,
    1,
    48,
    1,
    48,
    1,
    48,
    5,
    48,
    748,
    8,
    48,
    10,
    48,
    12,
    48,
    751,
    9,
    48,
    1,
    49,
    1,
    49,
    1,
    49,
    3,
    49,
    756,
    8,
    49,
    1,
    50,
    1,
    50,
    3,
    50,
    760,
    8,
    50,
    1,
    51,
    1,
    51,
    1,
    51,
    1,
    51,
    5,
    51,
    766,
    8,
    51,
    10,
    51,
    12,
    51,
    769,
    9,
    51,
    1,
    51,
    3,
    51,
    772,
    8,
    51,
    3,
    51,
    774,
    8,
    51,
    1,
    51,
    1,
    51,
    1,
    52,
    1,
    52,
    3,
    52,
    780,
    8,
    52,
    1,
    52,
    1,
    52,
    1,
    52,
    3,
    52,
    785,
    8,
    52,
    5,
    52,
    787,
    8,
    52,
    10,
    52,
    12,
    52,
    790,
    9,
    52,
    1,
    53,
    1,
    53,
    1,
    53,
    1,
    53,
    3,
    53,
    796,
    8,
    53,
    3,
    53,
    798,
    8,
    53,
    1,
    54,
    1,
    54,
    1,
    54,
    5,
    54,
    803,
    8,
    54,
    10,
    54,
    12,
    54,
    806,
    9,
    54,
    1,
    55,
    1,
    55,
    3,
    55,
    810,
    8,
    55,
    1,
    55,
    1,
    55,
    1,
    56,
    1,
    56,
    1,
    56,
    5,
    56,
    817,
    8,
    56,
    10,
    56,
    12,
    56,
    820,
    9,
    56,
    1,
    56,
    1,
    56,
    3,
    56,
    824,
    8,
    56,
    1,
    56,
    3,
    56,
    827,
    8,
    56,
    1,
    57,
    5,
    57,
    830,
    8,
    57,
    10,
    57,
    12,
    57,
    833,
    9,
    57,
    1,
    57,
    1,
    57,
    1,
    57,
    1,
    58,
    5,
    58,
    839,
    8,
    58,
    10,
    58,
    12,
    58,
    842,
    9,
    58,
    1,
    58,
    1,
    58,
    1,
    58,
    1,
    58,
    1,
    59,
    1,
    59,
    1,
    60,
    1,
    60,
    1,
    61,
    1,
    61,
    3,
    61,
    854,
    8,
    61,
    1,
    62,
    1,
    62,
    1,
    63,
    1,
    63,
    1,
    64,
    1,
    64,
    1,
    64,
    1,
    64,
    1,
    64,
    3,
    64,
    865,
    8,
    64,
    1,
    64,
    3,
    64,
    868,
    8,
    64,
    1,
    65,
    1,
    65,
    1,
    65,
    5,
    65,
    873,
    8,
    65,
    10,
    65,
    12,
    65,
    876,
    9,
    65,
    1,
    66,
    1,
    66,
    1,
    66,
    1,
    66,
    1,
    67,
    1,
    67,
    1,
    67,
    3,
    67,
    885,
    8,
    67,
    1,
    68,
    1,
    68,
    1,
    68,
    1,
    68,
    5,
    68,
    891,
    8,
    68,
    10,
    68,
    12,
    68,
    894,
    9,
    68,
    3,
    68,
    896,
    8,
    68,
    1,
    68,
    3,
    68,
    899,
    8,
    68,
    1,
    68,
    1,
    68,
    1,
    69,
    1,
    69,
    1,
    69,
    1,
    69,
    1,
    69,
    1,
    70,
    1,
    70,
    5,
    70,
    910,
    8,
    70,
    10,
    70,
    12,
    70,
    913,
    9,
    70,
    1,
    70,
    1,
    70,
    1,
    71,
    5,
    71,
    918,
    8,
    71,
    10,
    71,
    12,
    71,
    921,
    9,
    71,
    1,
    71,
    1,
    71,
    3,
    71,
    925,
    8,
    71,
    1,
    72,
    1,
    72,
    1,
    72,
    1,
    72,
    1,
    72,
    1,
    72,
    3,
    72,
    933,
    8,
    72,
    1,
    72,
    1,
    72,
    3,
    72,
    937,
    8,
    72,
    1,
    72,
    1,
    72,
    3,
    72,
    941,
    8,
    72,
    1,
    72,
    1,
    72,
    3,
    72,
    945,
    8,
    72,
    3,
    72,
    947,
    8,
    72,
    1,
    73,
    1,
    73,
    3,
    73,
    951,
    8,
    73,
    1,
    74,
    1,
    74,
    1,
    74,
    1,
    74,
    3,
    74,
    957,
    8,
    74,
    1,
    75,
    1,
    75,
    1,
    76,
    1,
    76,
    1,
    76,
    1,
    77,
    1,
    77,
    5,
    77,
    966,
    8,
    77,
    10,
    77,
    12,
    77,
    969,
    9,
    77,
    1,
    77,
    1,
    77,
    1,
    78,
    1,
    78,
    1,
    78,
    1,
    78,
    1,
    78,
    3,
    78,
    978,
    8,
    78,
    1,
    79,
    5,
    79,
    981,
    8,
    79,
    10,
    79,
    12,
    79,
    984,
    9,
    79,
    1,
    79,
    1,
    79,
    1,
    79,
    1,
    80,
    5,
    80,
    990,
    8,
    80,
    10,
    80,
    12,
    80,
    993,
    9,
    80,
    1,
    80,
    1,
    80,
    3,
    80,
    997,
    8,
    80,
    1,
    80,
    3,
    80,
    1e3,
    8,
    80,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1007,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1016,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    4,
    81,
    1037,
    8,
    81,
    11,
    81,
    12,
    81,
    1038,
    1,
    81,
    3,
    81,
    1042,
    8,
    81,
    1,
    81,
    3,
    81,
    1045,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    5,
    81,
    1051,
    8,
    81,
    10,
    81,
    12,
    81,
    1054,
    9,
    81,
    1,
    81,
    3,
    81,
    1057,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    5,
    81,
    1063,
    8,
    81,
    10,
    81,
    12,
    81,
    1066,
    9,
    81,
    1,
    81,
    5,
    81,
    1069,
    8,
    81,
    10,
    81,
    12,
    81,
    1072,
    9,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1082,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1091,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1096,
    8,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    1,
    81,
    3,
    81,
    1106,
    8,
    81,
    1,
    82,
    1,
    82,
    1,
    82,
    5,
    82,
    1111,
    8,
    82,
    10,
    82,
    12,
    82,
    1114,
    9,
    82,
    1,
    82,
    1,
    82,
    1,
    82,
    1,
    82,
    1,
    82,
    1,
    83,
    1,
    83,
    1,
    83,
    5,
    83,
    1124,
    8,
    83,
    10,
    83,
    12,
    83,
    1127,
    9,
    83,
    1,
    84,
    1,
    84,
    1,
    84,
    1,
    85,
    1,
    85,
    1,
    85,
    3,
    85,
    1135,
    8,
    85,
    1,
    85,
    1,
    85,
    1,
    86,
    1,
    86,
    1,
    86,
    5,
    86,
    1142,
    8,
    86,
    10,
    86,
    12,
    86,
    1145,
    9,
    86,
    1,
    87,
    5,
    87,
    1148,
    8,
    87,
    10,
    87,
    12,
    87,
    1151,
    9,
    87,
    1,
    87,
    1,
    87,
    1,
    87,
    1,
    87,
    1,
    87,
    1,
    88,
    4,
    88,
    1159,
    8,
    88,
    11,
    88,
    12,
    88,
    1160,
    1,
    88,
    4,
    88,
    1164,
    8,
    88,
    11,
    88,
    12,
    88,
    1165,
    1,
    89,
    1,
    89,
    1,
    89,
    3,
    89,
    1171,
    8,
    89,
    1,
    89,
    1,
    89,
    1,
    89,
    3,
    89,
    1176,
    8,
    89,
    1,
    90,
    1,
    90,
    3,
    90,
    1180,
    8,
    90,
    1,
    90,
    1,
    90,
    3,
    90,
    1184,
    8,
    90,
    1,
    90,
    1,
    90,
    3,
    90,
    1188,
    8,
    90,
    3,
    90,
    1190,
    8,
    90,
    1,
    91,
    1,
    91,
    3,
    91,
    1194,
    8,
    91,
    1,
    92,
    5,
    92,
    1197,
    8,
    92,
    10,
    92,
    12,
    92,
    1200,
    9,
    92,
    1,
    92,
    1,
    92,
    1,
    92,
    1,
    92,
    1,
    92,
    1,
    93,
    1,
    93,
    1,
    93,
    1,
    93,
    1,
    94,
    1,
    94,
    1,
    94,
    5,
    94,
    1214,
    8,
    94,
    10,
    94,
    12,
    94,
    1217,
    9,
    94,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1237,
    8,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1241,
    8,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1246,
    8,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1250,
    8,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1266,
    8,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1306,
    8,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1312,
    8,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    1,
    95,
    3,
    95,
    1327,
    8,
    95,
    1,
    95,
    5,
    95,
    1330,
    8,
    95,
    10,
    95,
    12,
    95,
    1333,
    9,
    95,
    1,
    96,
    1,
    96,
    1,
    96,
    1,
    96,
    1,
    97,
    1,
    97,
    1,
    97,
    3,
    97,
    1342,
    8,
    97,
    1,
    97,
    1,
    97,
    1,
    97,
    1,
    97,
    1,
    97,
    5,
    97,
    1349,
    8,
    97,
    10,
    97,
    12,
    97,
    1352,
    9,
    97,
    1,
    97,
    3,
    97,
    1355,
    8,
    97,
    1,
    98,
    1,
    98,
    3,
    98,
    1359,
    8,
    98,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    1,
    99,
    3,
    99,
    1377,
    8,
    99,
    3,
    99,
    1379,
    8,
    99,
    1,
    100,
    1,
    100,
    1,
    100,
    3,
    100,
    1384,
    8,
    100,
    1,
    100,
    5,
    100,
    1387,
    8,
    100,
    10,
    100,
    12,
    100,
    1390,
    9,
    100,
    1,
    100,
    1,
    100,
    3,
    100,
    1394,
    8,
    100,
    1,
    101,
    1,
    101,
    1,
    101,
    1,
    101,
    1,
    101,
    1,
    101,
    1,
    101,
    3,
    101,
    1403,
    8,
    101,
    3,
    101,
    1405,
    8,
    101,
    1,
    102,
    1,
    102,
    3,
    102,
    1409,
    8,
    102,
    1,
    102,
    1,
    102,
    1,
    102,
    3,
    102,
    1414,
    8,
    102,
    5,
    102,
    1416,
    8,
    102,
    10,
    102,
    12,
    102,
    1419,
    9,
    102,
    1,
    102,
    3,
    102,
    1422,
    8,
    102,
    1,
    103,
    1,
    103,
    3,
    103,
    1426,
    8,
    103,
    1,
    103,
    1,
    103,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    5,
    104,
    1434,
    8,
    104,
    10,
    104,
    12,
    104,
    1437,
    9,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    1,
    104,
    5,
    104,
    1446,
    8,
    104,
    10,
    104,
    12,
    104,
    1449,
    9,
    104,
    1,
    104,
    1,
    104,
    5,
    104,
    1453,
    8,
    104,
    10,
    104,
    12,
    104,
    1456,
    9,
    104,
    3,
    104,
    1458,
    8,
    104,
    1,
    105,
    1,
    105,
    3,
    105,
    1462,
    8,
    105,
    1,
    106,
    1,
    106,
    1,
    106,
    1,
    107,
    1,
    107,
    1,
    107,
    3,
    107,
    1470,
    8,
    107,
    1,
    108,
    1,
    108,
    1,
    108,
    3,
    108,
    1475,
    8,
    108,
    1,
    109,
    1,
    109,
    1,
    109,
    1,
    109,
    1,
    110,
    1,
    110,
    1,
    110,
    5,
    110,
    1484,
    8,
    110,
    10,
    110,
    12,
    110,
    1487,
    9,
    110,
    1,
    111,
    3,
    111,
    1490,
    8,
    111,
    1,
    111,
    1,
    111,
    1,
    111,
    3,
    111,
    1495,
    8,
    111,
    1,
    111,
    1,
    111,
    5,
    111,
    1499,
    8,
    111,
    10,
    111,
    12,
    111,
    1502,
    9,
    111,
    1,
    112,
    1,
    112,
    1,
    112,
    1,
    112,
    5,
    112,
    1508,
    8,
    112,
    10,
    112,
    12,
    112,
    1511,
    9,
    112,
    1,
    112,
    1,
    112,
    1,
    113,
    1,
    113,
    1,
    113,
    1,
    113,
    3,
    113,
    1519,
    8,
    113,
    3,
    113,
    1521,
    8,
    113,
    1,
    114,
    1,
    114,
    1,
    114,
    1,
    114,
    3,
    114,
    1527,
    8,
    114,
    1,
    115,
    1,
    115,
    3,
    115,
    1531,
    8,
    115,
    1,
    115,
    1,
    115,
    1,
    115,
    0,
    1,
    190,
    116,
    0,
    2,
    4,
    6,
    8,
    10,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    30,
    32,
    34,
    36,
    38,
    40,
    42,
    44,
    46,
    48,
    50,
    52,
    54,
    56,
    58,
    60,
    62,
    64,
    66,
    68,
    70,
    72,
    74,
    76,
    78,
    80,
    82,
    84,
    86,
    88,
    90,
    92,
    94,
    96,
    98,
    100,
    102,
    104,
    106,
    108,
    110,
    112,
    114,
    116,
    118,
    120,
    122,
    124,
    126,
    128,
    130,
    132,
    134,
    136,
    138,
    140,
    142,
    144,
    146,
    148,
    150,
    152,
    154,
    156,
    158,
    160,
    162,
    164,
    166,
    168,
    170,
    172,
    174,
    176,
    178,
    180,
    182,
    184,
    186,
    188,
    190,
    192,
    194,
    196,
    198,
    200,
    202,
    204,
    206,
    208,
    210,
    212,
    214,
    216,
    218,
    220,
    222,
    224,
    226,
    228,
    230,
    0,
    12,
    6,
    0,
    1,
    1,
    9,
    9,
    11,
    11,
    14,
    14,
    26,
    26,
    33,
    33,
    2,
    0,
    23,
    23,
    46,
    46,
    1,
    0,
    58,
    61,
    1,
    0,
    62,
    63,
    1,
    0,
    90,
    93,
    1,
    0,
    80,
    81,
    2,
    0,
    94,
    95,
    99,
    99,
    1,
    0,
    92,
    93,
    2,
    0,
    78,
    79,
    85,
    86,
    2,
    0,
    84,
    84,
    87,
    87,
    2,
    0,
    77,
    77,
    100,
    110,
    1,
    0,
    90,
    91,
    1717,
    0,
    235,
    1,
    0,
    0,
    0,
    2,
    238,
    1,
    0,
    0,
    0,
    4,
    258,
    1,
    0,
    0,
    0,
    6,
    267,
    1,
    0,
    0,
    0,
    8,
    308,
    1,
    0,
    0,
    0,
    10,
    319,
    1,
    0,
    0,
    0,
    12,
    321,
    1,
    0,
    0,
    0,
    14,
    350,
    1,
    0,
    0,
    0,
    16,
    352,
    1,
    0,
    0,
    0,
    18,
    368,
    1,
    0,
    0,
    0,
    20,
    370,
    1,
    0,
    0,
    0,
    22,
    374,
    1,
    0,
    0,
    0,
    24,
    393,
    1,
    0,
    0,
    0,
    26,
    395,
    1,
    0,
    0,
    0,
    28,
    398,
    1,
    0,
    0,
    0,
    30,
    417,
    1,
    0,
    0,
    0,
    32,
    424,
    1,
    0,
    0,
    0,
    34,
    448,
    1,
    0,
    0,
    0,
    36,
    455,
    1,
    0,
    0,
    0,
    38,
    465,
    1,
    0,
    0,
    0,
    40,
    469,
    1,
    0,
    0,
    0,
    42,
    471,
    1,
    0,
    0,
    0,
    44,
    486,
    1,
    0,
    0,
    0,
    46,
    500,
    1,
    0,
    0,
    0,
    48,
    508,
    1,
    0,
    0,
    0,
    50,
    516,
    1,
    0,
    0,
    0,
    52,
    534,
    1,
    0,
    0,
    0,
    54,
    545,
    1,
    0,
    0,
    0,
    56,
    555,
    1,
    0,
    0,
    0,
    58,
    562,
    1,
    0,
    0,
    0,
    60,
    573,
    1,
    0,
    0,
    0,
    62,
    582,
    1,
    0,
    0,
    0,
    64,
    604,
    1,
    0,
    0,
    0,
    66,
    615,
    1,
    0,
    0,
    0,
    68,
    617,
    1,
    0,
    0,
    0,
    70,
    635,
    1,
    0,
    0,
    0,
    72,
    639,
    1,
    0,
    0,
    0,
    74,
    641,
    1,
    0,
    0,
    0,
    76,
    644,
    1,
    0,
    0,
    0,
    78,
    647,
    1,
    0,
    0,
    0,
    80,
    655,
    1,
    0,
    0,
    0,
    82,
    667,
    1,
    0,
    0,
    0,
    84,
    676,
    1,
    0,
    0,
    0,
    86,
    678,
    1,
    0,
    0,
    0,
    88,
    689,
    1,
    0,
    0,
    0,
    90,
    703,
    1,
    0,
    0,
    0,
    92,
    739,
    1,
    0,
    0,
    0,
    94,
    741,
    1,
    0,
    0,
    0,
    96,
    744,
    1,
    0,
    0,
    0,
    98,
    752,
    1,
    0,
    0,
    0,
    100,
    759,
    1,
    0,
    0,
    0,
    102,
    761,
    1,
    0,
    0,
    0,
    104,
    777,
    1,
    0,
    0,
    0,
    106,
    797,
    1,
    0,
    0,
    0,
    108,
    799,
    1,
    0,
    0,
    0,
    110,
    807,
    1,
    0,
    0,
    0,
    112,
    826,
    1,
    0,
    0,
    0,
    114,
    831,
    1,
    0,
    0,
    0,
    116,
    840,
    1,
    0,
    0,
    0,
    118,
    847,
    1,
    0,
    0,
    0,
    120,
    849,
    1,
    0,
    0,
    0,
    122,
    853,
    1,
    0,
    0,
    0,
    124,
    855,
    1,
    0,
    0,
    0,
    126,
    857,
    1,
    0,
    0,
    0,
    128,
    859,
    1,
    0,
    0,
    0,
    130,
    869,
    1,
    0,
    0,
    0,
    132,
    877,
    1,
    0,
    0,
    0,
    134,
    884,
    1,
    0,
    0,
    0,
    136,
    886,
    1,
    0,
    0,
    0,
    138,
    902,
    1,
    0,
    0,
    0,
    140,
    907,
    1,
    0,
    0,
    0,
    142,
    924,
    1,
    0,
    0,
    0,
    144,
    946,
    1,
    0,
    0,
    0,
    146,
    950,
    1,
    0,
    0,
    0,
    148,
    952,
    1,
    0,
    0,
    0,
    150,
    958,
    1,
    0,
    0,
    0,
    152,
    960,
    1,
    0,
    0,
    0,
    154,
    963,
    1,
    0,
    0,
    0,
    156,
    977,
    1,
    0,
    0,
    0,
    158,
    982,
    1,
    0,
    0,
    0,
    160,
    999,
    1,
    0,
    0,
    0,
    162,
    1105,
    1,
    0,
    0,
    0,
    164,
    1107,
    1,
    0,
    0,
    0,
    166,
    1120,
    1,
    0,
    0,
    0,
    168,
    1128,
    1,
    0,
    0,
    0,
    170,
    1131,
    1,
    0,
    0,
    0,
    172,
    1138,
    1,
    0,
    0,
    0,
    174,
    1149,
    1,
    0,
    0,
    0,
    176,
    1158,
    1,
    0,
    0,
    0,
    178,
    1175,
    1,
    0,
    0,
    0,
    180,
    1189,
    1,
    0,
    0,
    0,
    182,
    1193,
    1,
    0,
    0,
    0,
    184,
    1198,
    1,
    0,
    0,
    0,
    186,
    1206,
    1,
    0,
    0,
    0,
    188,
    1210,
    1,
    0,
    0,
    0,
    190,
    1249,
    1,
    0,
    0,
    0,
    192,
    1334,
    1,
    0,
    0,
    0,
    194,
    1354,
    1,
    0,
    0,
    0,
    196,
    1358,
    1,
    0,
    0,
    0,
    198,
    1378,
    1,
    0,
    0,
    0,
    200,
    1383,
    1,
    0,
    0,
    0,
    202,
    1404,
    1,
    0,
    0,
    0,
    204,
    1421,
    1,
    0,
    0,
    0,
    206,
    1423,
    1,
    0,
    0,
    0,
    208,
    1429,
    1,
    0,
    0,
    0,
    210,
    1459,
    1,
    0,
    0,
    0,
    212,
    1463,
    1,
    0,
    0,
    0,
    214,
    1469,
    1,
    0,
    0,
    0,
    216,
    1474,
    1,
    0,
    0,
    0,
    218,
    1476,
    1,
    0,
    0,
    0,
    220,
    1480,
    1,
    0,
    0,
    0,
    222,
    1489,
    1,
    0,
    0,
    0,
    224,
    1503,
    1,
    0,
    0,
    0,
    226,
    1520,
    1,
    0,
    0,
    0,
    228,
    1526,
    1,
    0,
    0,
    0,
    230,
    1528,
    1,
    0,
    0,
    0,
    232,
    236,
    3,
    4,
    2,
    0,
    233,
    236,
    3,
    2,
    1,
    0,
    234,
    236,
    3,
    6,
    3,
    0,
    235,
    232,
    1,
    0,
    0,
    0,
    235,
    233,
    1,
    0,
    0,
    0,
    235,
    234,
    1,
    0,
    0,
    0,
    236,
    1,
    1,
    0,
    0,
    0,
    237,
    239,
    3,
    30,
    15,
    0,
    238,
    237,
    1,
    0,
    0,
    0,
    238,
    239,
    1,
    0,
    0,
    0,
    239,
    243,
    1,
    0,
    0,
    0,
    240,
    242,
    3,
    32,
    16,
    0,
    241,
    240,
    1,
    0,
    0,
    0,
    242,
    245,
    1,
    0,
    0,
    0,
    243,
    241,
    1,
    0,
    0,
    0,
    243,
    244,
    1,
    0,
    0,
    0,
    244,
    247,
    1,
    0,
    0,
    0,
    245,
    243,
    1,
    0,
    0,
    0,
    246,
    248,
    3,
    34,
    17,
    0,
    247,
    246,
    1,
    0,
    0,
    0,
    248,
    249,
    1,
    0,
    0,
    0,
    249,
    247,
    1,
    0,
    0,
    0,
    249,
    250,
    1,
    0,
    0,
    0,
    250,
    251,
    1,
    0,
    0,
    0,
    251,
    252,
    5,
    0,
    0,
    1,
    252,
    3,
    1,
    0,
    0,
    0,
    253,
    257,
    3,
    32,
    16,
    0,
    254,
    257,
    3,
    156,
    78,
    0,
    255,
    257,
    3,
    34,
    17,
    0,
    256,
    253,
    1,
    0,
    0,
    0,
    256,
    254,
    1,
    0,
    0,
    0,
    256,
    255,
    1,
    0,
    0,
    0,
    257,
    260,
    1,
    0,
    0,
    0,
    258,
    256,
    1,
    0,
    0,
    0,
    258,
    259,
    1,
    0,
    0,
    0,
    259,
    261,
    1,
    0,
    0,
    0,
    260,
    258,
    1,
    0,
    0,
    0,
    261,
    262,
    5,
    0,
    0,
    1,
    262,
    5,
    1,
    0,
    0,
    0,
    263,
    266,
    3,
    32,
    16,
    0,
    264,
    266,
    3,
    64,
    32,
    0,
    265,
    263,
    1,
    0,
    0,
    0,
    265,
    264,
    1,
    0,
    0,
    0,
    266,
    269,
    1,
    0,
    0,
    0,
    267,
    265,
    1,
    0,
    0,
    0,
    267,
    268,
    1,
    0,
    0,
    0,
    268,
    270,
    1,
    0,
    0,
    0,
    269,
    267,
    1,
    0,
    0,
    0,
    270,
    271,
    5,
    0,
    0,
    1,
    271,
    7,
    1,
    0,
    0,
    0,
    272,
    276,
    3,
    32,
    16,
    0,
    273,
    276,
    3,
    64,
    32,
    0,
    274,
    276,
    3,
    156,
    78,
    0,
    275,
    272,
    1,
    0,
    0,
    0,
    275,
    273,
    1,
    0,
    0,
    0,
    275,
    274,
    1,
    0,
    0,
    0,
    276,
    279,
    1,
    0,
    0,
    0,
    277,
    275,
    1,
    0,
    0,
    0,
    277,
    278,
    1,
    0,
    0,
    0,
    278,
    280,
    1,
    0,
    0,
    0,
    279,
    277,
    1,
    0,
    0,
    0,
    280,
    281,
    3,
    156,
    78,
    0,
    281,
    287,
    3,
    64,
    32,
    0,
    282,
    286,
    3,
    32,
    16,
    0,
    283,
    286,
    3,
    64,
    32,
    0,
    284,
    286,
    3,
    156,
    78,
    0,
    285,
    282,
    1,
    0,
    0,
    0,
    285,
    283,
    1,
    0,
    0,
    0,
    285,
    284,
    1,
    0,
    0,
    0,
    286,
    289,
    1,
    0,
    0,
    0,
    287,
    285,
    1,
    0,
    0,
    0,
    287,
    288,
    1,
    0,
    0,
    0,
    288,
    309,
    1,
    0,
    0,
    0,
    289,
    287,
    1,
    0,
    0,
    0,
    290,
    294,
    3,
    32,
    16,
    0,
    291,
    294,
    3,
    64,
    32,
    0,
    292,
    294,
    3,
    156,
    78,
    0,
    293,
    290,
    1,
    0,
    0,
    0,
    293,
    291,
    1,
    0,
    0,
    0,
    293,
    292,
    1,
    0,
    0,
    0,
    294,
    297,
    1,
    0,
    0,
    0,
    295,
    293,
    1,
    0,
    0,
    0,
    295,
    296,
    1,
    0,
    0,
    0,
    296,
    298,
    1,
    0,
    0,
    0,
    297,
    295,
    1,
    0,
    0,
    0,
    298,
    299,
    3,
    64,
    32,
    0,
    299,
    305,
    3,
    156,
    78,
    0,
    300,
    304,
    3,
    32,
    16,
    0,
    301,
    304,
    3,
    64,
    32,
    0,
    302,
    304,
    3,
    156,
    78,
    0,
    303,
    300,
    1,
    0,
    0,
    0,
    303,
    301,
    1,
    0,
    0,
    0,
    303,
    302,
    1,
    0,
    0,
    0,
    304,
    307,
    1,
    0,
    0,
    0,
    305,
    303,
    1,
    0,
    0,
    0,
    305,
    306,
    1,
    0,
    0,
    0,
    306,
    309,
    1,
    0,
    0,
    0,
    307,
    305,
    1,
    0,
    0,
    0,
    308,
    277,
    1,
    0,
    0,
    0,
    308,
    295,
    1,
    0,
    0,
    0,
    309,
    9,
    1,
    0,
    0,
    0,
    310,
    320,
    3,
    12,
    6,
    0,
    311,
    316,
    5,
    115,
    0,
    0,
    312,
    313,
    5,
    72,
    0,
    0,
    313,
    315,
    5,
    73,
    0,
    0,
    314,
    312,
    1,
    0,
    0,
    0,
    315,
    318,
    1,
    0,
    0,
    0,
    316,
    314,
    1,
    0,
    0,
    0,
    316,
    317,
    1,
    0,
    0,
    0,
    317,
    320,
    1,
    0,
    0,
    0,
    318,
    316,
    1,
    0,
    0,
    0,
    319,
    310,
    1,
    0,
    0,
    0,
    319,
    311,
    1,
    0,
    0,
    0,
    320,
    11,
    1,
    0,
    0,
    0,
    321,
    326,
    3,
    18,
    9,
    0,
    322,
    323,
    5,
    72,
    0,
    0,
    323,
    325,
    5,
    73,
    0,
    0,
    324,
    322,
    1,
    0,
    0,
    0,
    325,
    328,
    1,
    0,
    0,
    0,
    326,
    324,
    1,
    0,
    0,
    0,
    326,
    327,
    1,
    0,
    0,
    0,
    327,
    329,
    1,
    0,
    0,
    0,
    328,
    326,
    1,
    0,
    0,
    0,
    329,
    330,
    6,
    6,
    -1,
    0,
    330,
    13,
    1,
    0,
    0,
    0,
    331,
    351,
    3,
    16,
    8,
    0,
    332,
    333,
    5,
    115,
    0,
    0,
    333,
    335,
    5,
    68,
    0,
    0,
    334,
    336,
    3,
    188,
    94,
    0,
    335,
    334,
    1,
    0,
    0,
    0,
    335,
    336,
    1,
    0,
    0,
    0,
    336,
    337,
    1,
    0,
    0,
    0,
    337,
    351,
    5,
    69,
    0,
    0,
    338,
    339,
    5,
    49,
    0,
    0,
    339,
    341,
    5,
    68,
    0,
    0,
    340,
    342,
    3,
    188,
    94,
    0,
    341,
    340,
    1,
    0,
    0,
    0,
    341,
    342,
    1,
    0,
    0,
    0,
    342,
    343,
    1,
    0,
    0,
    0,
    343,
    351,
    5,
    69,
    0,
    0,
    344,
    345,
    5,
    46,
    0,
    0,
    345,
    347,
    5,
    68,
    0,
    0,
    346,
    348,
    3,
    188,
    94,
    0,
    347,
    346,
    1,
    0,
    0,
    0,
    347,
    348,
    1,
    0,
    0,
    0,
    348,
    349,
    1,
    0,
    0,
    0,
    349,
    351,
    5,
    69,
    0,
    0,
    350,
    331,
    1,
    0,
    0,
    0,
    350,
    332,
    1,
    0,
    0,
    0,
    350,
    338,
    1,
    0,
    0,
    0,
    350,
    344,
    1,
    0,
    0,
    0,
    351,
    15,
    1,
    0,
    0,
    0,
    352,
    353,
    7,
    0,
    0,
    0,
    353,
    355,
    5,
    68,
    0,
    0,
    354,
    356,
    3,
    188,
    94,
    0,
    355,
    354,
    1,
    0,
    0,
    0,
    355,
    356,
    1,
    0,
    0,
    0,
    356,
    357,
    1,
    0,
    0,
    0,
    357,
    358,
    5,
    69,
    0,
    0,
    358,
    17,
    1,
    0,
    0,
    0,
    359,
    369,
    5,
    9,
    0,
    0,
    360,
    369,
    5,
    14,
    0,
    0,
    361,
    369,
    5,
    11,
    0,
    0,
    362,
    369,
    5,
    43,
    0,
    0,
    363,
    369,
    5,
    33,
    0,
    0,
    364,
    369,
    5,
    35,
    0,
    0,
    365,
    369,
    5,
    26,
    0,
    0,
    366,
    369,
    5,
    20,
    0,
    0,
    367,
    369,
    3,
    20,
    10,
    0,
    368,
    359,
    1,
    0,
    0,
    0,
    368,
    360,
    1,
    0,
    0,
    0,
    368,
    361,
    1,
    0,
    0,
    0,
    368,
    362,
    1,
    0,
    0,
    0,
    368,
    363,
    1,
    0,
    0,
    0,
    368,
    364,
    1,
    0,
    0,
    0,
    368,
    365,
    1,
    0,
    0,
    0,
    368,
    366,
    1,
    0,
    0,
    0,
    368,
    367,
    1,
    0,
    0,
    0,
    369,
    19,
    1,
    0,
    0,
    0,
    370,
    371,
    5,
    1,
    0,
    0,
    371,
    21,
    1,
    0,
    0,
    0,
    372,
    375,
    5,
    115,
    0,
    0,
    373,
    375,
    3,
    20,
    10,
    0,
    374,
    372,
    1,
    0,
    0,
    0,
    374,
    373,
    1,
    0,
    0,
    0,
    375,
    383,
    1,
    0,
    0,
    0,
    376,
    379,
    5,
    76,
    0,
    0,
    377,
    380,
    5,
    115,
    0,
    0,
    378,
    380,
    3,
    20,
    10,
    0,
    379,
    377,
    1,
    0,
    0,
    0,
    379,
    378,
    1,
    0,
    0,
    0,
    380,
    382,
    1,
    0,
    0,
    0,
    381,
    376,
    1,
    0,
    0,
    0,
    382,
    385,
    1,
    0,
    0,
    0,
    383,
    381,
    1,
    0,
    0,
    0,
    383,
    384,
    1,
    0,
    0,
    0,
    384,
    23,
    1,
    0,
    0,
    0,
    385,
    383,
    1,
    0,
    0,
    0,
    386,
    394,
    3,
    124,
    62,
    0,
    387,
    394,
    3,
    126,
    63,
    0,
    388,
    394,
    5,
    6,
    0,
    0,
    389,
    394,
    3,
    122,
    61,
    0,
    390,
    394,
    5,
    64,
    0,
    0,
    391,
    394,
    5,
    67,
    0,
    0,
    392,
    394,
    3,
    26,
    13,
    0,
    393,
    386,
    1,
    0,
    0,
    0,
    393,
    387,
    1,
    0,
    0,
    0,
    393,
    388,
    1,
    0,
    0,
    0,
    393,
    389,
    1,
    0,
    0,
    0,
    393,
    390,
    1,
    0,
    0,
    0,
    393,
    391,
    1,
    0,
    0,
    0,
    393,
    392,
    1,
    0,
    0,
    0,
    394,
    25,
    1,
    0,
    0,
    0,
    395,
    396,
    5,
    2,
    0,
    0,
    396,
    27,
    1,
    0,
    0,
    0,
    397,
    399,
    3,
    30,
    15,
    0,
    398,
    397,
    1,
    0,
    0,
    0,
    398,
    399,
    1,
    0,
    0,
    0,
    399,
    403,
    1,
    0,
    0,
    0,
    400,
    402,
    3,
    32,
    16,
    0,
    401,
    400,
    1,
    0,
    0,
    0,
    402,
    405,
    1,
    0,
    0,
    0,
    403,
    401,
    1,
    0,
    0,
    0,
    403,
    404,
    1,
    0,
    0,
    0,
    404,
    409,
    1,
    0,
    0,
    0,
    405,
    403,
    1,
    0,
    0,
    0,
    406,
    408,
    3,
    34,
    17,
    0,
    407,
    406,
    1,
    0,
    0,
    0,
    408,
    411,
    1,
    0,
    0,
    0,
    409,
    407,
    1,
    0,
    0,
    0,
    409,
    410,
    1,
    0,
    0,
    0,
    410,
    412,
    1,
    0,
    0,
    0,
    411,
    409,
    1,
    0,
    0,
    0,
    412,
    413,
    5,
    0,
    0,
    1,
    413,
    29,
    1,
    0,
    0,
    0,
    414,
    416,
    3,
    128,
    64,
    0,
    415,
    414,
    1,
    0,
    0,
    0,
    416,
    419,
    1,
    0,
    0,
    0,
    417,
    415,
    1,
    0,
    0,
    0,
    417,
    418,
    1,
    0,
    0,
    0,
    418,
    420,
    1,
    0,
    0,
    0,
    419,
    417,
    1,
    0,
    0,
    0,
    420,
    421,
    5,
    38,
    0,
    0,
    421,
    422,
    3,
    22,
    11,
    0,
    422,
    423,
    5,
    74,
    0,
    0,
    423,
    31,
    1,
    0,
    0,
    0,
    424,
    426,
    5,
    31,
    0,
    0,
    425,
    427,
    5,
    44,
    0,
    0,
    426,
    425,
    1,
    0,
    0,
    0,
    426,
    427,
    1,
    0,
    0,
    0,
    427,
    428,
    1,
    0,
    0,
    0,
    428,
    431,
    3,
    22,
    11,
    0,
    429,
    430,
    5,
    76,
    0,
    0,
    430,
    432,
    5,
    94,
    0,
    0,
    431,
    429,
    1,
    0,
    0,
    0,
    431,
    432,
    1,
    0,
    0,
    0,
    432,
    433,
    1,
    0,
    0,
    0,
    433,
    434,
    5,
    74,
    0,
    0,
    434,
    33,
    1,
    0,
    0,
    0,
    435,
    437,
    3,
    38,
    19,
    0,
    436,
    435,
    1,
    0,
    0,
    0,
    437,
    440,
    1,
    0,
    0,
    0,
    438,
    436,
    1,
    0,
    0,
    0,
    438,
    439,
    1,
    0,
    0,
    0,
    439,
    445,
    1,
    0,
    0,
    0,
    440,
    438,
    1,
    0,
    0,
    0,
    441,
    446,
    3,
    42,
    21,
    0,
    442,
    446,
    3,
    50,
    25,
    0,
    443,
    446,
    3,
    58,
    29,
    0,
    444,
    446,
    3,
    138,
    69,
    0,
    445,
    441,
    1,
    0,
    0,
    0,
    445,
    442,
    1,
    0,
    0,
    0,
    445,
    443,
    1,
    0,
    0,
    0,
    445,
    444,
    1,
    0,
    0,
    0,
    446,
    449,
    1,
    0,
    0,
    0,
    447,
    449,
    5,
    74,
    0,
    0,
    448,
    438,
    1,
    0,
    0,
    0,
    448,
    447,
    1,
    0,
    0,
    0,
    449,
    35,
    1,
    0,
    0,
    0,
    450,
    456,
    3,
    38,
    19,
    0,
    451,
    456,
    5,
    36,
    0,
    0,
    452,
    456,
    5,
    48,
    0,
    0,
    453,
    456,
    5,
    52,
    0,
    0,
    454,
    456,
    5,
    56,
    0,
    0,
    455,
    450,
    1,
    0,
    0,
    0,
    455,
    451,
    1,
    0,
    0,
    0,
    455,
    452,
    1,
    0,
    0,
    0,
    455,
    453,
    1,
    0,
    0,
    0,
    455,
    454,
    1,
    0,
    0,
    0,
    456,
    37,
    1,
    0,
    0,
    0,
    457,
    466,
    3,
    128,
    64,
    0,
    458,
    466,
    5,
    41,
    0,
    0,
    459,
    466,
    5,
    40,
    0,
    0,
    460,
    466,
    5,
    39,
    0,
    0,
    461,
    466,
    5,
    44,
    0,
    0,
    462,
    466,
    5,
    7,
    0,
    0,
    463,
    466,
    5,
    24,
    0,
    0,
    464,
    466,
    5,
    45,
    0,
    0,
    465,
    457,
    1,
    0,
    0,
    0,
    465,
    458,
    1,
    0,
    0,
    0,
    465,
    459,
    1,
    0,
    0,
    0,
    465,
    460,
    1,
    0,
    0,
    0,
    465,
    461,
    1,
    0,
    0,
    0,
    465,
    462,
    1,
    0,
    0,
    0,
    465,
    463,
    1,
    0,
    0,
    0,
    465,
    464,
    1,
    0,
    0,
    0,
    466,
    39,
    1,
    0,
    0,
    0,
    467,
    470,
    5,
    24,
    0,
    0,
    468,
    470,
    3,
    128,
    64,
    0,
    469,
    467,
    1,
    0,
    0,
    0,
    469,
    468,
    1,
    0,
    0,
    0,
    470,
    41,
    1,
    0,
    0,
    0,
    471,
    472,
    5,
    15,
    0,
    0,
    472,
    474,
    5,
    115,
    0,
    0,
    473,
    475,
    3,
    44,
    22,
    0,
    474,
    473,
    1,
    0,
    0,
    0,
    474,
    475,
    1,
    0,
    0,
    0,
    475,
    478,
    1,
    0,
    0,
    0,
    476,
    477,
    5,
    23,
    0,
    0,
    477,
    479,
    3,
    222,
    111,
    0,
    478,
    476,
    1,
    0,
    0,
    0,
    478,
    479,
    1,
    0,
    0,
    0,
    479,
    482,
    1,
    0,
    0,
    0,
    480,
    481,
    5,
    30,
    0,
    0,
    481,
    483,
    3,
    220,
    110,
    0,
    482,
    480,
    1,
    0,
    0,
    0,
    482,
    483,
    1,
    0,
    0,
    0,
    483,
    484,
    1,
    0,
    0,
    0,
    484,
    485,
    3,
    60,
    30,
    0,
    485,
    43,
    1,
    0,
    0,
    0,
    486,
    487,
    5,
    79,
    0,
    0,
    487,
    492,
    3,
    46,
    23,
    0,
    488,
    489,
    5,
    75,
    0,
    0,
    489,
    491,
    3,
    46,
    23,
    0,
    490,
    488,
    1,
    0,
    0,
    0,
    491,
    494,
    1,
    0,
    0,
    0,
    492,
    490,
    1,
    0,
    0,
    0,
    492,
    493,
    1,
    0,
    0,
    0,
    493,
    495,
    1,
    0,
    0,
    0,
    494,
    492,
    1,
    0,
    0,
    0,
    495,
    496,
    5,
    78,
    0,
    0,
    496,
    45,
    1,
    0,
    0,
    0,
    497,
    499,
    3,
    128,
    64,
    0,
    498,
    497,
    1,
    0,
    0,
    0,
    499,
    502,
    1,
    0,
    0,
    0,
    500,
    498,
    1,
    0,
    0,
    0,
    500,
    501,
    1,
    0,
    0,
    0,
    501,
    503,
    1,
    0,
    0,
    0,
    502,
    500,
    1,
    0,
    0,
    0,
    503,
    506,
    5,
    115,
    0,
    0,
    504,
    505,
    5,
    23,
    0,
    0,
    505,
    507,
    3,
    48,
    24,
    0,
    506,
    504,
    1,
    0,
    0,
    0,
    506,
    507,
    1,
    0,
    0,
    0,
    507,
    47,
    1,
    0,
    0,
    0,
    508,
    513,
    3,
    222,
    111,
    0,
    509,
    510,
    5,
    96,
    0,
    0,
    510,
    512,
    3,
    222,
    111,
    0,
    511,
    509,
    1,
    0,
    0,
    0,
    512,
    515,
    1,
    0,
    0,
    0,
    513,
    511,
    1,
    0,
    0,
    0,
    513,
    514,
    1,
    0,
    0,
    0,
    514,
    49,
    1,
    0,
    0,
    0,
    515,
    513,
    1,
    0,
    0,
    0,
    516,
    517,
    5,
    22,
    0,
    0,
    517,
    520,
    5,
    115,
    0,
    0,
    518,
    519,
    5,
    30,
    0,
    0,
    519,
    521,
    3,
    220,
    110,
    0,
    520,
    518,
    1,
    0,
    0,
    0,
    520,
    521,
    1,
    0,
    0,
    0,
    521,
    522,
    1,
    0,
    0,
    0,
    522,
    524,
    5,
    70,
    0,
    0,
    523,
    525,
    3,
    52,
    26,
    0,
    524,
    523,
    1,
    0,
    0,
    0,
    524,
    525,
    1,
    0,
    0,
    0,
    525,
    527,
    1,
    0,
    0,
    0,
    526,
    528,
    5,
    75,
    0,
    0,
    527,
    526,
    1,
    0,
    0,
    0,
    527,
    528,
    1,
    0,
    0,
    0,
    528,
    530,
    1,
    0,
    0,
    0,
    529,
    531,
    3,
    56,
    28,
    0,
    530,
    529,
    1,
    0,
    0,
    0,
    530,
    531,
    1,
    0,
    0,
    0,
    531,
    532,
    1,
    0,
    0,
    0,
    532,
    533,
    5,
    71,
    0,
    0,
    533,
    51,
    1,
    0,
    0,
    0,
    534,
    539,
    3,
    54,
    27,
    0,
    535,
    536,
    5,
    75,
    0,
    0,
    536,
    538,
    3,
    54,
    27,
    0,
    537,
    535,
    1,
    0,
    0,
    0,
    538,
    541,
    1,
    0,
    0,
    0,
    539,
    537,
    1,
    0,
    0,
    0,
    539,
    540,
    1,
    0,
    0,
    0,
    540,
    53,
    1,
    0,
    0,
    0,
    541,
    539,
    1,
    0,
    0,
    0,
    542,
    544,
    3,
    128,
    64,
    0,
    543,
    542,
    1,
    0,
    0,
    0,
    544,
    547,
    1,
    0,
    0,
    0,
    545,
    543,
    1,
    0,
    0,
    0,
    545,
    546,
    1,
    0,
    0,
    0,
    546,
    548,
    1,
    0,
    0,
    0,
    547,
    545,
    1,
    0,
    0,
    0,
    548,
    550,
    5,
    115,
    0,
    0,
    549,
    551,
    3,
    230,
    115,
    0,
    550,
    549,
    1,
    0,
    0,
    0,
    550,
    551,
    1,
    0,
    0,
    0,
    551,
    553,
    1,
    0,
    0,
    0,
    552,
    554,
    3,
    60,
    30,
    0,
    553,
    552,
    1,
    0,
    0,
    0,
    553,
    554,
    1,
    0,
    0,
    0,
    554,
    55,
    1,
    0,
    0,
    0,
    555,
    559,
    5,
    74,
    0,
    0,
    556,
    558,
    3,
    64,
    32,
    0,
    557,
    556,
    1,
    0,
    0,
    0,
    558,
    561,
    1,
    0,
    0,
    0,
    559,
    557,
    1,
    0,
    0,
    0,
    559,
    560,
    1,
    0,
    0,
    0,
    560,
    57,
    1,
    0,
    0,
    0,
    561,
    559,
    1,
    0,
    0,
    0,
    562,
    563,
    5,
    34,
    0,
    0,
    563,
    565,
    5,
    115,
    0,
    0,
    564,
    566,
    3,
    44,
    22,
    0,
    565,
    564,
    1,
    0,
    0,
    0,
    565,
    566,
    1,
    0,
    0,
    0,
    566,
    569,
    1,
    0,
    0,
    0,
    567,
    568,
    5,
    23,
    0,
    0,
    568,
    570,
    3,
    220,
    110,
    0,
    569,
    567,
    1,
    0,
    0,
    0,
    569,
    570,
    1,
    0,
    0,
    0,
    570,
    571,
    1,
    0,
    0,
    0,
    571,
    572,
    3,
    62,
    31,
    0,
    572,
    59,
    1,
    0,
    0,
    0,
    573,
    577,
    5,
    70,
    0,
    0,
    574,
    576,
    3,
    64,
    32,
    0,
    575,
    574,
    1,
    0,
    0,
    0,
    576,
    579,
    1,
    0,
    0,
    0,
    577,
    575,
    1,
    0,
    0,
    0,
    577,
    578,
    1,
    0,
    0,
    0,
    578,
    580,
    1,
    0,
    0,
    0,
    579,
    577,
    1,
    0,
    0,
    0,
    580,
    581,
    5,
    71,
    0,
    0,
    581,
    61,
    1,
    0,
    0,
    0,
    582,
    586,
    5,
    70,
    0,
    0,
    583,
    585,
    3,
    82,
    41,
    0,
    584,
    583,
    1,
    0,
    0,
    0,
    585,
    588,
    1,
    0,
    0,
    0,
    586,
    584,
    1,
    0,
    0,
    0,
    586,
    587,
    1,
    0,
    0,
    0,
    587,
    589,
    1,
    0,
    0,
    0,
    588,
    586,
    1,
    0,
    0,
    0,
    589,
    590,
    5,
    71,
    0,
    0,
    590,
    63,
    1,
    0,
    0,
    0,
    591,
    605,
    5,
    74,
    0,
    0,
    592,
    605,
    3,
    32,
    16,
    0,
    593,
    595,
    5,
    44,
    0,
    0,
    594,
    593,
    1,
    0,
    0,
    0,
    594,
    595,
    1,
    0,
    0,
    0,
    595,
    596,
    1,
    0,
    0,
    0,
    596,
    605,
    3,
    154,
    77,
    0,
    597,
    599,
    3,
    36,
    18,
    0,
    598,
    597,
    1,
    0,
    0,
    0,
    599,
    602,
    1,
    0,
    0,
    0,
    600,
    598,
    1,
    0,
    0,
    0,
    600,
    601,
    1,
    0,
    0,
    0,
    601,
    603,
    1,
    0,
    0,
    0,
    602,
    600,
    1,
    0,
    0,
    0,
    603,
    605,
    3,
    66,
    33,
    0,
    604,
    591,
    1,
    0,
    0,
    0,
    604,
    592,
    1,
    0,
    0,
    0,
    604,
    594,
    1,
    0,
    0,
    0,
    604,
    600,
    1,
    0,
    0,
    0,
    605,
    65,
    1,
    0,
    0,
    0,
    606,
    616,
    3,
    68,
    34,
    0,
    607,
    616,
    3,
    74,
    37,
    0,
    608,
    616,
    3,
    80,
    40,
    0,
    609,
    616,
    3,
    78,
    39,
    0,
    610,
    616,
    3,
    76,
    38,
    0,
    611,
    616,
    3,
    58,
    29,
    0,
    612,
    616,
    3,
    138,
    69,
    0,
    613,
    616,
    3,
    42,
    21,
    0,
    614,
    616,
    3,
    50,
    25,
    0,
    615,
    606,
    1,
    0,
    0,
    0,
    615,
    607,
    1,
    0,
    0,
    0,
    615,
    608,
    1,
    0,
    0,
    0,
    615,
    609,
    1,
    0,
    0,
    0,
    615,
    610,
    1,
    0,
    0,
    0,
    615,
    611,
    1,
    0,
    0,
    0,
    615,
    612,
    1,
    0,
    0,
    0,
    615,
    613,
    1,
    0,
    0,
    0,
    615,
    614,
    1,
    0,
    0,
    0,
    616,
    67,
    1,
    0,
    0,
    0,
    617,
    618,
    3,
    72,
    36,
    0,
    618,
    619,
    5,
    115,
    0,
    0,
    619,
    624,
    3,
    110,
    55,
    0,
    620,
    621,
    5,
    72,
    0,
    0,
    621,
    623,
    5,
    73,
    0,
    0,
    622,
    620,
    1,
    0,
    0,
    0,
    623,
    626,
    1,
    0,
    0,
    0,
    624,
    622,
    1,
    0,
    0,
    0,
    624,
    625,
    1,
    0,
    0,
    0,
    625,
    629,
    1,
    0,
    0,
    0,
    626,
    624,
    1,
    0,
    0,
    0,
    627,
    628,
    5,
    51,
    0,
    0,
    628,
    630,
    3,
    108,
    54,
    0,
    629,
    627,
    1,
    0,
    0,
    0,
    629,
    630,
    1,
    0,
    0,
    0,
    630,
    631,
    1,
    0,
    0,
    0,
    631,
    632,
    3,
    70,
    35,
    0,
    632,
    69,
    1,
    0,
    0,
    0,
    633,
    636,
    3,
    154,
    77,
    0,
    634,
    636,
    5,
    74,
    0,
    0,
    635,
    633,
    1,
    0,
    0,
    0,
    635,
    634,
    1,
    0,
    0,
    0,
    636,
    71,
    1,
    0,
    0,
    0,
    637,
    640,
    3,
    222,
    111,
    0,
    638,
    640,
    5,
    55,
    0,
    0,
    639,
    637,
    1,
    0,
    0,
    0,
    639,
    638,
    1,
    0,
    0,
    0,
    640,
    73,
    1,
    0,
    0,
    0,
    641,
    642,
    3,
    44,
    22,
    0,
    642,
    643,
    3,
    68,
    34,
    0,
    643,
    75,
    1,
    0,
    0,
    0,
    644,
    645,
    3,
    44,
    22,
    0,
    645,
    646,
    3,
    78,
    39,
    0,
    646,
    77,
    1,
    0,
    0,
    0,
    647,
    648,
    5,
    115,
    0,
    0,
    648,
    651,
    3,
    110,
    55,
    0,
    649,
    650,
    5,
    51,
    0,
    0,
    650,
    652,
    3,
    108,
    54,
    0,
    651,
    649,
    1,
    0,
    0,
    0,
    651,
    652,
    1,
    0,
    0,
    0,
    652,
    653,
    1,
    0,
    0,
    0,
    653,
    654,
    3,
    154,
    77,
    0,
    654,
    79,
    1,
    0,
    0,
    0,
    655,
    656,
    3,
    222,
    111,
    0,
    656,
    657,
    3,
    96,
    48,
    0,
    657,
    658,
    5,
    74,
    0,
    0,
    658,
    81,
    1,
    0,
    0,
    0,
    659,
    661,
    3,
    36,
    18,
    0,
    660,
    659,
    1,
    0,
    0,
    0,
    661,
    664,
    1,
    0,
    0,
    0,
    662,
    660,
    1,
    0,
    0,
    0,
    662,
    663,
    1,
    0,
    0,
    0,
    663,
    665,
    1,
    0,
    0,
    0,
    664,
    662,
    1,
    0,
    0,
    0,
    665,
    668,
    3,
    84,
    42,
    0,
    666,
    668,
    5,
    74,
    0,
    0,
    667,
    662,
    1,
    0,
    0,
    0,
    667,
    666,
    1,
    0,
    0,
    0,
    668,
    83,
    1,
    0,
    0,
    0,
    669,
    677,
    3,
    86,
    43,
    0,
    670,
    677,
    3,
    90,
    45,
    0,
    671,
    677,
    3,
    94,
    47,
    0,
    672,
    677,
    3,
    58,
    29,
    0,
    673,
    677,
    3,
    138,
    69,
    0,
    674,
    677,
    3,
    42,
    21,
    0,
    675,
    677,
    3,
    50,
    25,
    0,
    676,
    669,
    1,
    0,
    0,
    0,
    676,
    670,
    1,
    0,
    0,
    0,
    676,
    671,
    1,
    0,
    0,
    0,
    676,
    672,
    1,
    0,
    0,
    0,
    676,
    673,
    1,
    0,
    0,
    0,
    676,
    674,
    1,
    0,
    0,
    0,
    676,
    675,
    1,
    0,
    0,
    0,
    677,
    85,
    1,
    0,
    0,
    0,
    678,
    679,
    3,
    222,
    111,
    0,
    679,
    684,
    3,
    88,
    44,
    0,
    680,
    681,
    5,
    75,
    0,
    0,
    681,
    683,
    3,
    88,
    44,
    0,
    682,
    680,
    1,
    0,
    0,
    0,
    683,
    686,
    1,
    0,
    0,
    0,
    684,
    682,
    1,
    0,
    0,
    0,
    684,
    685,
    1,
    0,
    0,
    0,
    685,
    687,
    1,
    0,
    0,
    0,
    686,
    684,
    1,
    0,
    0,
    0,
    687,
    688,
    5,
    74,
    0,
    0,
    688,
    87,
    1,
    0,
    0,
    0,
    689,
    694,
    5,
    115,
    0,
    0,
    690,
    691,
    5,
    72,
    0,
    0,
    691,
    693,
    5,
    73,
    0,
    0,
    692,
    690,
    1,
    0,
    0,
    0,
    693,
    696,
    1,
    0,
    0,
    0,
    694,
    692,
    1,
    0,
    0,
    0,
    694,
    695,
    1,
    0,
    0,
    0,
    695,
    697,
    1,
    0,
    0,
    0,
    696,
    694,
    1,
    0,
    0,
    0,
    697,
    698,
    5,
    77,
    0,
    0,
    698,
    699,
    3,
    100,
    50,
    0,
    699,
    89,
    1,
    0,
    0,
    0,
    700,
    702,
    3,
    92,
    46,
    0,
    701,
    700,
    1,
    0,
    0,
    0,
    702,
    705,
    1,
    0,
    0,
    0,
    703,
    701,
    1,
    0,
    0,
    0,
    703,
    704,
    1,
    0,
    0,
    0,
    704,
    716,
    1,
    0,
    0,
    0,
    705,
    703,
    1,
    0,
    0,
    0,
    706,
    717,
    3,
    72,
    36,
    0,
    707,
    711,
    3,
    44,
    22,
    0,
    708,
    710,
    3,
    128,
    64,
    0,
    709,
    708,
    1,
    0,
    0,
    0,
    710,
    713,
    1,
    0,
    0,
    0,
    711,
    709,
    1,
    0,
    0,
    0,
    711,
    712,
    1,
    0,
    0,
    0,
    712,
    714,
    1,
    0,
    0,
    0,
    713,
    711,
    1,
    0,
    0,
    0,
    714,
    715,
    3,
    72,
    36,
    0,
    715,
    717,
    1,
    0,
    0,
    0,
    716,
    706,
    1,
    0,
    0,
    0,
    716,
    707,
    1,
    0,
    0,
    0,
    717,
    718,
    1,
    0,
    0,
    0,
    718,
    719,
    5,
    115,
    0,
    0,
    719,
    724,
    3,
    110,
    55,
    0,
    720,
    721,
    5,
    72,
    0,
    0,
    721,
    723,
    5,
    73,
    0,
    0,
    722,
    720,
    1,
    0,
    0,
    0,
    723,
    726,
    1,
    0,
    0,
    0,
    724,
    722,
    1,
    0,
    0,
    0,
    724,
    725,
    1,
    0,
    0,
    0,
    725,
    729,
    1,
    0,
    0,
    0,
    726,
    724,
    1,
    0,
    0,
    0,
    727,
    728,
    5,
    51,
    0,
    0,
    728,
    730,
    3,
    108,
    54,
    0,
    729,
    727,
    1,
    0,
    0,
    0,
    729,
    730,
    1,
    0,
    0,
    0,
    730,
    731,
    1,
    0,
    0,
    0,
    731,
    732,
    3,
    70,
    35,
    0,
    732,
    91,
    1,
    0,
    0,
    0,
    733,
    740,
    3,
    128,
    64,
    0,
    734,
    740,
    5,
    41,
    0,
    0,
    735,
    740,
    5,
    7,
    0,
    0,
    736,
    740,
    5,
    18,
    0,
    0,
    737,
    740,
    5,
    44,
    0,
    0,
    738,
    740,
    5,
    45,
    0,
    0,
    739,
    733,
    1,
    0,
    0,
    0,
    739,
    734,
    1,
    0,
    0,
    0,
    739,
    735,
    1,
    0,
    0,
    0,
    739,
    736,
    1,
    0,
    0,
    0,
    739,
    737,
    1,
    0,
    0,
    0,
    739,
    738,
    1,
    0,
    0,
    0,
    740,
    93,
    1,
    0,
    0,
    0,
    741,
    742,
    3,
    44,
    22,
    0,
    742,
    743,
    3,
    90,
    45,
    0,
    743,
    95,
    1,
    0,
    0,
    0,
    744,
    749,
    3,
    98,
    49,
    0,
    745,
    746,
    5,
    75,
    0,
    0,
    746,
    748,
    3,
    98,
    49,
    0,
    747,
    745,
    1,
    0,
    0,
    0,
    748,
    751,
    1,
    0,
    0,
    0,
    749,
    747,
    1,
    0,
    0,
    0,
    749,
    750,
    1,
    0,
    0,
    0,
    750,
    97,
    1,
    0,
    0,
    0,
    751,
    749,
    1,
    0,
    0,
    0,
    752,
    755,
    3,
    10,
    5,
    0,
    753,
    754,
    5,
    77,
    0,
    0,
    754,
    756,
    3,
    100,
    50,
    0,
    755,
    753,
    1,
    0,
    0,
    0,
    755,
    756,
    1,
    0,
    0,
    0,
    756,
    99,
    1,
    0,
    0,
    0,
    757,
    760,
    3,
    102,
    51,
    0,
    758,
    760,
    3,
    190,
    95,
    0,
    759,
    757,
    1,
    0,
    0,
    0,
    759,
    758,
    1,
    0,
    0,
    0,
    760,
    101,
    1,
    0,
    0,
    0,
    761,
    773,
    5,
    70,
    0,
    0,
    762,
    767,
    3,
    100,
    50,
    0,
    763,
    764,
    5,
    75,
    0,
    0,
    764,
    766,
    3,
    100,
    50,
    0,
    765,
    763,
    1,
    0,
    0,
    0,
    766,
    769,
    1,
    0,
    0,
    0,
    767,
    765,
    1,
    0,
    0,
    0,
    767,
    768,
    1,
    0,
    0,
    0,
    768,
    771,
    1,
    0,
    0,
    0,
    769,
    767,
    1,
    0,
    0,
    0,
    770,
    772,
    5,
    75,
    0,
    0,
    771,
    770,
    1,
    0,
    0,
    0,
    771,
    772,
    1,
    0,
    0,
    0,
    772,
    774,
    1,
    0,
    0,
    0,
    773,
    762,
    1,
    0,
    0,
    0,
    773,
    774,
    1,
    0,
    0,
    0,
    774,
    775,
    1,
    0,
    0,
    0,
    775,
    776,
    5,
    71,
    0,
    0,
    776,
    103,
    1,
    0,
    0,
    0,
    777,
    779,
    5,
    115,
    0,
    0,
    778,
    780,
    3,
    224,
    112,
    0,
    779,
    778,
    1,
    0,
    0,
    0,
    779,
    780,
    1,
    0,
    0,
    0,
    780,
    788,
    1,
    0,
    0,
    0,
    781,
    782,
    5,
    76,
    0,
    0,
    782,
    784,
    5,
    115,
    0,
    0,
    783,
    785,
    3,
    224,
    112,
    0,
    784,
    783,
    1,
    0,
    0,
    0,
    784,
    785,
    1,
    0,
    0,
    0,
    785,
    787,
    1,
    0,
    0,
    0,
    786,
    781,
    1,
    0,
    0,
    0,
    787,
    790,
    1,
    0,
    0,
    0,
    788,
    786,
    1,
    0,
    0,
    0,
    788,
    789,
    1,
    0,
    0,
    0,
    789,
    105,
    1,
    0,
    0,
    0,
    790,
    788,
    1,
    0,
    0,
    0,
    791,
    798,
    3,
    222,
    111,
    0,
    792,
    795,
    5,
    82,
    0,
    0,
    793,
    794,
    7,
    1,
    0,
    0,
    794,
    796,
    3,
    222,
    111,
    0,
    795,
    793,
    1,
    0,
    0,
    0,
    795,
    796,
    1,
    0,
    0,
    0,
    796,
    798,
    1,
    0,
    0,
    0,
    797,
    791,
    1,
    0,
    0,
    0,
    797,
    792,
    1,
    0,
    0,
    0,
    798,
    107,
    1,
    0,
    0,
    0,
    799,
    804,
    3,
    22,
    11,
    0,
    800,
    801,
    5,
    75,
    0,
    0,
    801,
    803,
    3,
    22,
    11,
    0,
    802,
    800,
    1,
    0,
    0,
    0,
    803,
    806,
    1,
    0,
    0,
    0,
    804,
    802,
    1,
    0,
    0,
    0,
    804,
    805,
    1,
    0,
    0,
    0,
    805,
    109,
    1,
    0,
    0,
    0,
    806,
    804,
    1,
    0,
    0,
    0,
    807,
    809,
    5,
    68,
    0,
    0,
    808,
    810,
    3,
    112,
    56,
    0,
    809,
    808,
    1,
    0,
    0,
    0,
    809,
    810,
    1,
    0,
    0,
    0,
    810,
    811,
    1,
    0,
    0,
    0,
    811,
    812,
    5,
    69,
    0,
    0,
    812,
    111,
    1,
    0,
    0,
    0,
    813,
    818,
    3,
    114,
    57,
    0,
    814,
    815,
    5,
    75,
    0,
    0,
    815,
    817,
    3,
    114,
    57,
    0,
    816,
    814,
    1,
    0,
    0,
    0,
    817,
    820,
    1,
    0,
    0,
    0,
    818,
    816,
    1,
    0,
    0,
    0,
    818,
    819,
    1,
    0,
    0,
    0,
    819,
    823,
    1,
    0,
    0,
    0,
    820,
    818,
    1,
    0,
    0,
    0,
    821,
    822,
    5,
    75,
    0,
    0,
    822,
    824,
    3,
    116,
    58,
    0,
    823,
    821,
    1,
    0,
    0,
    0,
    823,
    824,
    1,
    0,
    0,
    0,
    824,
    827,
    1,
    0,
    0,
    0,
    825,
    827,
    3,
    116,
    58,
    0,
    826,
    813,
    1,
    0,
    0,
    0,
    826,
    825,
    1,
    0,
    0,
    0,
    827,
    113,
    1,
    0,
    0,
    0,
    828,
    830,
    3,
    40,
    20,
    0,
    829,
    828,
    1,
    0,
    0,
    0,
    830,
    833,
    1,
    0,
    0,
    0,
    831,
    829,
    1,
    0,
    0,
    0,
    831,
    832,
    1,
    0,
    0,
    0,
    832,
    834,
    1,
    0,
    0,
    0,
    833,
    831,
    1,
    0,
    0,
    0,
    834,
    835,
    3,
    222,
    111,
    0,
    835,
    836,
    3,
    10,
    5,
    0,
    836,
    115,
    1,
    0,
    0,
    0,
    837,
    839,
    3,
    40,
    20,
    0,
    838,
    837,
    1,
    0,
    0,
    0,
    839,
    842,
    1,
    0,
    0,
    0,
    840,
    838,
    1,
    0,
    0,
    0,
    840,
    841,
    1,
    0,
    0,
    0,
    841,
    843,
    1,
    0,
    0,
    0,
    842,
    840,
    1,
    0,
    0,
    0,
    843,
    844,
    3,
    222,
    111,
    0,
    844,
    845,
    5,
    114,
    0,
    0,
    845,
    846,
    3,
    10,
    5,
    0,
    846,
    117,
    1,
    0,
    0,
    0,
    847,
    848,
    5,
    65,
    0,
    0,
    848,
    119,
    1,
    0,
    0,
    0,
    849,
    850,
    5,
    66,
    0,
    0,
    850,
    121,
    1,
    0,
    0,
    0,
    851,
    854,
    3,
    118,
    59,
    0,
    852,
    854,
    3,
    120,
    60,
    0,
    853,
    851,
    1,
    0,
    0,
    0,
    853,
    852,
    1,
    0,
    0,
    0,
    854,
    123,
    1,
    0,
    0,
    0,
    855,
    856,
    7,
    2,
    0,
    0,
    856,
    125,
    1,
    0,
    0,
    0,
    857,
    858,
    7,
    3,
    0,
    0,
    858,
    127,
    1,
    0,
    0,
    0,
    859,
    860,
    5,
    113,
    0,
    0,
    860,
    867,
    3,
    22,
    11,
    0,
    861,
    864,
    5,
    68,
    0,
    0,
    862,
    865,
    3,
    130,
    65,
    0,
    863,
    865,
    3,
    134,
    67,
    0,
    864,
    862,
    1,
    0,
    0,
    0,
    864,
    863,
    1,
    0,
    0,
    0,
    864,
    865,
    1,
    0,
    0,
    0,
    865,
    866,
    1,
    0,
    0,
    0,
    866,
    868,
    5,
    69,
    0,
    0,
    867,
    861,
    1,
    0,
    0,
    0,
    867,
    868,
    1,
    0,
    0,
    0,
    868,
    129,
    1,
    0,
    0,
    0,
    869,
    874,
    3,
    132,
    66,
    0,
    870,
    871,
    5,
    75,
    0,
    0,
    871,
    873,
    3,
    132,
    66,
    0,
    872,
    870,
    1,
    0,
    0,
    0,
    873,
    876,
    1,
    0,
    0,
    0,
    874,
    872,
    1,
    0,
    0,
    0,
    874,
    875,
    1,
    0,
    0,
    0,
    875,
    131,
    1,
    0,
    0,
    0,
    876,
    874,
    1,
    0,
    0,
    0,
    877,
    878,
    5,
    115,
    0,
    0,
    878,
    879,
    5,
    77,
    0,
    0,
    879,
    880,
    3,
    134,
    67,
    0,
    880,
    133,
    1,
    0,
    0,
    0,
    881,
    885,
    3,
    190,
    95,
    0,
    882,
    885,
    3,
    128,
    64,
    0,
    883,
    885,
    3,
    136,
    68,
    0,
    884,
    881,
    1,
    0,
    0,
    0,
    884,
    882,
    1,
    0,
    0,
    0,
    884,
    883,
    1,
    0,
    0,
    0,
    885,
    135,
    1,
    0,
    0,
    0,
    886,
    895,
    5,
    70,
    0,
    0,
    887,
    892,
    3,
    134,
    67,
    0,
    888,
    889,
    5,
    75,
    0,
    0,
    889,
    891,
    3,
    134,
    67,
    0,
    890,
    888,
    1,
    0,
    0,
    0,
    891,
    894,
    1,
    0,
    0,
    0,
    892,
    890,
    1,
    0,
    0,
    0,
    892,
    893,
    1,
    0,
    0,
    0,
    893,
    896,
    1,
    0,
    0,
    0,
    894,
    892,
    1,
    0,
    0,
    0,
    895,
    887,
    1,
    0,
    0,
    0,
    895,
    896,
    1,
    0,
    0,
    0,
    896,
    898,
    1,
    0,
    0,
    0,
    897,
    899,
    5,
    75,
    0,
    0,
    898,
    897,
    1,
    0,
    0,
    0,
    898,
    899,
    1,
    0,
    0,
    0,
    899,
    900,
    1,
    0,
    0,
    0,
    900,
    901,
    5,
    71,
    0,
    0,
    901,
    137,
    1,
    0,
    0,
    0,
    902,
    903,
    5,
    113,
    0,
    0,
    903,
    904,
    5,
    34,
    0,
    0,
    904,
    905,
    5,
    115,
    0,
    0,
    905,
    906,
    3,
    140,
    70,
    0,
    906,
    139,
    1,
    0,
    0,
    0,
    907,
    911,
    5,
    70,
    0,
    0,
    908,
    910,
    3,
    142,
    71,
    0,
    909,
    908,
    1,
    0,
    0,
    0,
    910,
    913,
    1,
    0,
    0,
    0,
    911,
    909,
    1,
    0,
    0,
    0,
    911,
    912,
    1,
    0,
    0,
    0,
    912,
    914,
    1,
    0,
    0,
    0,
    913,
    911,
    1,
    0,
    0,
    0,
    914,
    915,
    5,
    71,
    0,
    0,
    915,
    141,
    1,
    0,
    0,
    0,
    916,
    918,
    3,
    36,
    18,
    0,
    917,
    916,
    1,
    0,
    0,
    0,
    918,
    921,
    1,
    0,
    0,
    0,
    919,
    917,
    1,
    0,
    0,
    0,
    919,
    920,
    1,
    0,
    0,
    0,
    920,
    922,
    1,
    0,
    0,
    0,
    921,
    919,
    1,
    0,
    0,
    0,
    922,
    925,
    3,
    144,
    72,
    0,
    923,
    925,
    5,
    74,
    0,
    0,
    924,
    919,
    1,
    0,
    0,
    0,
    924,
    923,
    1,
    0,
    0,
    0,
    925,
    143,
    1,
    0,
    0,
    0,
    926,
    927,
    3,
    222,
    111,
    0,
    927,
    928,
    3,
    146,
    73,
    0,
    928,
    929,
    5,
    74,
    0,
    0,
    929,
    947,
    1,
    0,
    0,
    0,
    930,
    932,
    3,
    42,
    21,
    0,
    931,
    933,
    5,
    74,
    0,
    0,
    932,
    931,
    1,
    0,
    0,
    0,
    932,
    933,
    1,
    0,
    0,
    0,
    933,
    947,
    1,
    0,
    0,
    0,
    934,
    936,
    3,
    58,
    29,
    0,
    935,
    937,
    5,
    74,
    0,
    0,
    936,
    935,
    1,
    0,
    0,
    0,
    936,
    937,
    1,
    0,
    0,
    0,
    937,
    947,
    1,
    0,
    0,
    0,
    938,
    940,
    3,
    50,
    25,
    0,
    939,
    941,
    5,
    74,
    0,
    0,
    940,
    939,
    1,
    0,
    0,
    0,
    940,
    941,
    1,
    0,
    0,
    0,
    941,
    947,
    1,
    0,
    0,
    0,
    942,
    944,
    3,
    138,
    69,
    0,
    943,
    945,
    5,
    74,
    0,
    0,
    944,
    943,
    1,
    0,
    0,
    0,
    944,
    945,
    1,
    0,
    0,
    0,
    945,
    947,
    1,
    0,
    0,
    0,
    946,
    926,
    1,
    0,
    0,
    0,
    946,
    930,
    1,
    0,
    0,
    0,
    946,
    934,
    1,
    0,
    0,
    0,
    946,
    938,
    1,
    0,
    0,
    0,
    946,
    942,
    1,
    0,
    0,
    0,
    947,
    145,
    1,
    0,
    0,
    0,
    948,
    951,
    3,
    148,
    74,
    0,
    949,
    951,
    3,
    150,
    75,
    0,
    950,
    948,
    1,
    0,
    0,
    0,
    950,
    949,
    1,
    0,
    0,
    0,
    951,
    147,
    1,
    0,
    0,
    0,
    952,
    953,
    5,
    115,
    0,
    0,
    953,
    954,
    5,
    68,
    0,
    0,
    954,
    956,
    5,
    69,
    0,
    0,
    955,
    957,
    3,
    152,
    76,
    0,
    956,
    955,
    1,
    0,
    0,
    0,
    956,
    957,
    1,
    0,
    0,
    0,
    957,
    149,
    1,
    0,
    0,
    0,
    958,
    959,
    3,
    96,
    48,
    0,
    959,
    151,
    1,
    0,
    0,
    0,
    960,
    961,
    5,
    18,
    0,
    0,
    961,
    962,
    3,
    134,
    67,
    0,
    962,
    153,
    1,
    0,
    0,
    0,
    963,
    967,
    5,
    70,
    0,
    0,
    964,
    966,
    3,
    156,
    78,
    0,
    965,
    964,
    1,
    0,
    0,
    0,
    966,
    969,
    1,
    0,
    0,
    0,
    967,
    965,
    1,
    0,
    0,
    0,
    967,
    968,
    1,
    0,
    0,
    0,
    968,
    970,
    1,
    0,
    0,
    0,
    969,
    967,
    1,
    0,
    0,
    0,
    970,
    971,
    5,
    71,
    0,
    0,
    971,
    155,
    1,
    0,
    0,
    0,
    972,
    973,
    3,
    158,
    79,
    0,
    973,
    974,
    5,
    74,
    0,
    0,
    974,
    978,
    1,
    0,
    0,
    0,
    975,
    978,
    3,
    162,
    81,
    0,
    976,
    978,
    3,
    160,
    80,
    0,
    977,
    972,
    1,
    0,
    0,
    0,
    977,
    975,
    1,
    0,
    0,
    0,
    977,
    976,
    1,
    0,
    0,
    0,
    978,
    157,
    1,
    0,
    0,
    0,
    979,
    981,
    3,
    40,
    20,
    0,
    980,
    979,
    1,
    0,
    0,
    0,
    981,
    984,
    1,
    0,
    0,
    0,
    982,
    980,
    1,
    0,
    0,
    0,
    982,
    983,
    1,
    0,
    0,
    0,
    983,
    985,
    1,
    0,
    0,
    0,
    984,
    982,
    1,
    0,
    0,
    0,
    985,
    986,
    3,
    222,
    111,
    0,
    986,
    987,
    3,
    96,
    48,
    0,
    987,
    159,
    1,
    0,
    0,
    0,
    988,
    990,
    3,
    38,
    19,
    0,
    989,
    988,
    1,
    0,
    0,
    0,
    990,
    993,
    1,
    0,
    0,
    0,
    991,
    989,
    1,
    0,
    0,
    0,
    991,
    992,
    1,
    0,
    0,
    0,
    992,
    996,
    1,
    0,
    0,
    0,
    993,
    991,
    1,
    0,
    0,
    0,
    994,
    997,
    3,
    42,
    21,
    0,
    995,
    997,
    3,
    58,
    29,
    0,
    996,
    994,
    1,
    0,
    0,
    0,
    996,
    995,
    1,
    0,
    0,
    0,
    997,
    1e3,
    1,
    0,
    0,
    0,
    998,
    1e3,
    5,
    74,
    0,
    0,
    999,
    991,
    1,
    0,
    0,
    0,
    999,
    998,
    1,
    0,
    0,
    0,
    1e3,
    161,
    1,
    0,
    0,
    0,
    1001,
    1106,
    3,
    154,
    77,
    0,
    1002,
    1003,
    5,
    8,
    0,
    0,
    1003,
    1006,
    3,
    190,
    95,
    0,
    1004,
    1005,
    5,
    83,
    0,
    0,
    1005,
    1007,
    3,
    190,
    95,
    0,
    1006,
    1004,
    1,
    0,
    0,
    0,
    1006,
    1007,
    1,
    0,
    0,
    0,
    1007,
    1008,
    1,
    0,
    0,
    0,
    1008,
    1009,
    5,
    74,
    0,
    0,
    1009,
    1106,
    1,
    0,
    0,
    0,
    1010,
    1011,
    5,
    28,
    0,
    0,
    1011,
    1012,
    3,
    186,
    93,
    0,
    1012,
    1015,
    3,
    162,
    81,
    0,
    1013,
    1014,
    5,
    21,
    0,
    0,
    1014,
    1016,
    3,
    162,
    81,
    0,
    1015,
    1013,
    1,
    0,
    0,
    0,
    1015,
    1016,
    1,
    0,
    0,
    0,
    1016,
    1106,
    1,
    0,
    0,
    0,
    1017,
    1018,
    5,
    27,
    0,
    0,
    1018,
    1019,
    5,
    68,
    0,
    0,
    1019,
    1020,
    3,
    180,
    90,
    0,
    1020,
    1021,
    5,
    69,
    0,
    0,
    1021,
    1022,
    3,
    162,
    81,
    0,
    1022,
    1106,
    1,
    0,
    0,
    0,
    1023,
    1024,
    5,
    57,
    0,
    0,
    1024,
    1025,
    3,
    186,
    93,
    0,
    1025,
    1026,
    3,
    162,
    81,
    0,
    1026,
    1106,
    1,
    0,
    0,
    0,
    1027,
    1028,
    5,
    19,
    0,
    0,
    1028,
    1029,
    3,
    162,
    81,
    0,
    1029,
    1030,
    5,
    57,
    0,
    0,
    1030,
    1031,
    3,
    186,
    93,
    0,
    1031,
    1032,
    5,
    74,
    0,
    0,
    1032,
    1106,
    1,
    0,
    0,
    0,
    1033,
    1034,
    5,
    53,
    0,
    0,
    1034,
    1044,
    3,
    154,
    77,
    0,
    1035,
    1037,
    3,
    164,
    82,
    0,
    1036,
    1035,
    1,
    0,
    0,
    0,
    1037,
    1038,
    1,
    0,
    0,
    0,
    1038,
    1036,
    1,
    0,
    0,
    0,
    1038,
    1039,
    1,
    0,
    0,
    0,
    1039,
    1041,
    1,
    0,
    0,
    0,
    1040,
    1042,
    3,
    168,
    84,
    0,
    1041,
    1040,
    1,
    0,
    0,
    0,
    1041,
    1042,
    1,
    0,
    0,
    0,
    1042,
    1045,
    1,
    0,
    0,
    0,
    1043,
    1045,
    3,
    168,
    84,
    0,
    1044,
    1036,
    1,
    0,
    0,
    0,
    1044,
    1043,
    1,
    0,
    0,
    0,
    1045,
    1106,
    1,
    0,
    0,
    0,
    1046,
    1047,
    5,
    53,
    0,
    0,
    1047,
    1048,
    3,
    170,
    85,
    0,
    1048,
    1052,
    3,
    154,
    77,
    0,
    1049,
    1051,
    3,
    164,
    82,
    0,
    1050,
    1049,
    1,
    0,
    0,
    0,
    1051,
    1054,
    1,
    0,
    0,
    0,
    1052,
    1050,
    1,
    0,
    0,
    0,
    1052,
    1053,
    1,
    0,
    0,
    0,
    1053,
    1056,
    1,
    0,
    0,
    0,
    1054,
    1052,
    1,
    0,
    0,
    0,
    1055,
    1057,
    3,
    168,
    84,
    0,
    1056,
    1055,
    1,
    0,
    0,
    0,
    1056,
    1057,
    1,
    0,
    0,
    0,
    1057,
    1106,
    1,
    0,
    0,
    0,
    1058,
    1059,
    5,
    47,
    0,
    0,
    1059,
    1060,
    3,
    186,
    93,
    0,
    1060,
    1064,
    5,
    70,
    0,
    0,
    1061,
    1063,
    3,
    176,
    88,
    0,
    1062,
    1061,
    1,
    0,
    0,
    0,
    1063,
    1066,
    1,
    0,
    0,
    0,
    1064,
    1062,
    1,
    0,
    0,
    0,
    1064,
    1065,
    1,
    0,
    0,
    0,
    1065,
    1070,
    1,
    0,
    0,
    0,
    1066,
    1064,
    1,
    0,
    0,
    0,
    1067,
    1069,
    3,
    178,
    89,
    0,
    1068,
    1067,
    1,
    0,
    0,
    0,
    1069,
    1072,
    1,
    0,
    0,
    0,
    1070,
    1068,
    1,
    0,
    0,
    0,
    1070,
    1071,
    1,
    0,
    0,
    0,
    1071,
    1073,
    1,
    0,
    0,
    0,
    1072,
    1070,
    1,
    0,
    0,
    0,
    1073,
    1074,
    5,
    71,
    0,
    0,
    1074,
    1106,
    1,
    0,
    0,
    0,
    1075,
    1076,
    5,
    48,
    0,
    0,
    1076,
    1077,
    3,
    186,
    93,
    0,
    1077,
    1078,
    3,
    154,
    77,
    0,
    1078,
    1106,
    1,
    0,
    0,
    0,
    1079,
    1081,
    5,
    42,
    0,
    0,
    1080,
    1082,
    3,
    190,
    95,
    0,
    1081,
    1080,
    1,
    0,
    0,
    0,
    1081,
    1082,
    1,
    0,
    0,
    0,
    1082,
    1083,
    1,
    0,
    0,
    0,
    1083,
    1106,
    5,
    74,
    0,
    0,
    1084,
    1085,
    5,
    50,
    0,
    0,
    1085,
    1086,
    3,
    190,
    95,
    0,
    1086,
    1087,
    5,
    74,
    0,
    0,
    1087,
    1106,
    1,
    0,
    0,
    0,
    1088,
    1090,
    5,
    10,
    0,
    0,
    1089,
    1091,
    5,
    115,
    0,
    0,
    1090,
    1089,
    1,
    0,
    0,
    0,
    1090,
    1091,
    1,
    0,
    0,
    0,
    1091,
    1092,
    1,
    0,
    0,
    0,
    1092,
    1106,
    5,
    74,
    0,
    0,
    1093,
    1095,
    5,
    17,
    0,
    0,
    1094,
    1096,
    5,
    115,
    0,
    0,
    1095,
    1094,
    1,
    0,
    0,
    0,
    1095,
    1096,
    1,
    0,
    0,
    0,
    1096,
    1097,
    1,
    0,
    0,
    0,
    1097,
    1106,
    5,
    74,
    0,
    0,
    1098,
    1106,
    5,
    74,
    0,
    0,
    1099,
    1100,
    3,
    190,
    95,
    0,
    1100,
    1101,
    5,
    74,
    0,
    0,
    1101,
    1106,
    1,
    0,
    0,
    0,
    1102,
    1103,
    5,
    115,
    0,
    0,
    1103,
    1104,
    5,
    83,
    0,
    0,
    1104,
    1106,
    3,
    162,
    81,
    0,
    1105,
    1001,
    1,
    0,
    0,
    0,
    1105,
    1002,
    1,
    0,
    0,
    0,
    1105,
    1010,
    1,
    0,
    0,
    0,
    1105,
    1017,
    1,
    0,
    0,
    0,
    1105,
    1023,
    1,
    0,
    0,
    0,
    1105,
    1027,
    1,
    0,
    0,
    0,
    1105,
    1033,
    1,
    0,
    0,
    0,
    1105,
    1046,
    1,
    0,
    0,
    0,
    1105,
    1058,
    1,
    0,
    0,
    0,
    1105,
    1075,
    1,
    0,
    0,
    0,
    1105,
    1079,
    1,
    0,
    0,
    0,
    1105,
    1084,
    1,
    0,
    0,
    0,
    1105,
    1088,
    1,
    0,
    0,
    0,
    1105,
    1093,
    1,
    0,
    0,
    0,
    1105,
    1098,
    1,
    0,
    0,
    0,
    1105,
    1099,
    1,
    0,
    0,
    0,
    1105,
    1102,
    1,
    0,
    0,
    0,
    1106,
    163,
    1,
    0,
    0,
    0,
    1107,
    1108,
    5,
    13,
    0,
    0,
    1108,
    1112,
    5,
    68,
    0,
    0,
    1109,
    1111,
    3,
    40,
    20,
    0,
    1110,
    1109,
    1,
    0,
    0,
    0,
    1111,
    1114,
    1,
    0,
    0,
    0,
    1112,
    1110,
    1,
    0,
    0,
    0,
    1112,
    1113,
    1,
    0,
    0,
    0,
    1113,
    1115,
    1,
    0,
    0,
    0,
    1114,
    1112,
    1,
    0,
    0,
    0,
    1115,
    1116,
    3,
    166,
    83,
    0,
    1116,
    1117,
    5,
    115,
    0,
    0,
    1117,
    1118,
    5,
    69,
    0,
    0,
    1118,
    1119,
    3,
    154,
    77,
    0,
    1119,
    165,
    1,
    0,
    0,
    0,
    1120,
    1125,
    3,
    22,
    11,
    0,
    1121,
    1122,
    5,
    97,
    0,
    0,
    1122,
    1124,
    3,
    22,
    11,
    0,
    1123,
    1121,
    1,
    0,
    0,
    0,
    1124,
    1127,
    1,
    0,
    0,
    0,
    1125,
    1123,
    1,
    0,
    0,
    0,
    1125,
    1126,
    1,
    0,
    0,
    0,
    1126,
    167,
    1,
    0,
    0,
    0,
    1127,
    1125,
    1,
    0,
    0,
    0,
    1128,
    1129,
    5,
    25,
    0,
    0,
    1129,
    1130,
    3,
    154,
    77,
    0,
    1130,
    169,
    1,
    0,
    0,
    0,
    1131,
    1132,
    5,
    68,
    0,
    0,
    1132,
    1134,
    3,
    172,
    86,
    0,
    1133,
    1135,
    5,
    74,
    0,
    0,
    1134,
    1133,
    1,
    0,
    0,
    0,
    1134,
    1135,
    1,
    0,
    0,
    0,
    1135,
    1136,
    1,
    0,
    0,
    0,
    1136,
    1137,
    5,
    69,
    0,
    0,
    1137,
    171,
    1,
    0,
    0,
    0,
    1138,
    1143,
    3,
    174,
    87,
    0,
    1139,
    1140,
    5,
    74,
    0,
    0,
    1140,
    1142,
    3,
    174,
    87,
    0,
    1141,
    1139,
    1,
    0,
    0,
    0,
    1142,
    1145,
    1,
    0,
    0,
    0,
    1143,
    1141,
    1,
    0,
    0,
    0,
    1143,
    1144,
    1,
    0,
    0,
    0,
    1144,
    173,
    1,
    0,
    0,
    0,
    1145,
    1143,
    1,
    0,
    0,
    0,
    1146,
    1148,
    3,
    40,
    20,
    0,
    1147,
    1146,
    1,
    0,
    0,
    0,
    1148,
    1151,
    1,
    0,
    0,
    0,
    1149,
    1147,
    1,
    0,
    0,
    0,
    1149,
    1150,
    1,
    0,
    0,
    0,
    1150,
    1152,
    1,
    0,
    0,
    0,
    1151,
    1149,
    1,
    0,
    0,
    0,
    1152,
    1153,
    3,
    104,
    52,
    0,
    1153,
    1154,
    3,
    10,
    5,
    0,
    1154,
    1155,
    5,
    77,
    0,
    0,
    1155,
    1156,
    3,
    190,
    95,
    0,
    1156,
    175,
    1,
    0,
    0,
    0,
    1157,
    1159,
    3,
    178,
    89,
    0,
    1158,
    1157,
    1,
    0,
    0,
    0,
    1159,
    1160,
    1,
    0,
    0,
    0,
    1160,
    1158,
    1,
    0,
    0,
    0,
    1160,
    1161,
    1,
    0,
    0,
    0,
    1161,
    1163,
    1,
    0,
    0,
    0,
    1162,
    1164,
    3,
    156,
    78,
    0,
    1163,
    1162,
    1,
    0,
    0,
    0,
    1164,
    1165,
    1,
    0,
    0,
    0,
    1165,
    1163,
    1,
    0,
    0,
    0,
    1165,
    1166,
    1,
    0,
    0,
    0,
    1166,
    177,
    1,
    0,
    0,
    0,
    1167,
    1170,
    5,
    12,
    0,
    0,
    1168,
    1171,
    3,
    190,
    95,
    0,
    1169,
    1171,
    5,
    115,
    0,
    0,
    1170,
    1168,
    1,
    0,
    0,
    0,
    1170,
    1169,
    1,
    0,
    0,
    0,
    1171,
    1172,
    1,
    0,
    0,
    0,
    1172,
    1176,
    5,
    83,
    0,
    0,
    1173,
    1174,
    5,
    18,
    0,
    0,
    1174,
    1176,
    5,
    83,
    0,
    0,
    1175,
    1167,
    1,
    0,
    0,
    0,
    1175,
    1173,
    1,
    0,
    0,
    0,
    1176,
    179,
    1,
    0,
    0,
    0,
    1177,
    1190,
    3,
    184,
    92,
    0,
    1178,
    1180,
    3,
    182,
    91,
    0,
    1179,
    1178,
    1,
    0,
    0,
    0,
    1179,
    1180,
    1,
    0,
    0,
    0,
    1180,
    1181,
    1,
    0,
    0,
    0,
    1181,
    1183,
    5,
    74,
    0,
    0,
    1182,
    1184,
    3,
    190,
    95,
    0,
    1183,
    1182,
    1,
    0,
    0,
    0,
    1183,
    1184,
    1,
    0,
    0,
    0,
    1184,
    1185,
    1,
    0,
    0,
    0,
    1185,
    1187,
    5,
    74,
    0,
    0,
    1186,
    1188,
    3,
    188,
    94,
    0,
    1187,
    1186,
    1,
    0,
    0,
    0,
    1187,
    1188,
    1,
    0,
    0,
    0,
    1188,
    1190,
    1,
    0,
    0,
    0,
    1189,
    1177,
    1,
    0,
    0,
    0,
    1189,
    1179,
    1,
    0,
    0,
    0,
    1190,
    181,
    1,
    0,
    0,
    0,
    1191,
    1194,
    3,
    158,
    79,
    0,
    1192,
    1194,
    3,
    188,
    94,
    0,
    1193,
    1191,
    1,
    0,
    0,
    0,
    1193,
    1192,
    1,
    0,
    0,
    0,
    1194,
    183,
    1,
    0,
    0,
    0,
    1195,
    1197,
    3,
    40,
    20,
    0,
    1196,
    1195,
    1,
    0,
    0,
    0,
    1197,
    1200,
    1,
    0,
    0,
    0,
    1198,
    1196,
    1,
    0,
    0,
    0,
    1198,
    1199,
    1,
    0,
    0,
    0,
    1199,
    1201,
    1,
    0,
    0,
    0,
    1200,
    1198,
    1,
    0,
    0,
    0,
    1201,
    1202,
    3,
    222,
    111,
    0,
    1202,
    1203,
    3,
    10,
    5,
    0,
    1203,
    1204,
    5,
    83,
    0,
    0,
    1204,
    1205,
    3,
    190,
    95,
    0,
    1205,
    185,
    1,
    0,
    0,
    0,
    1206,
    1207,
    5,
    68,
    0,
    0,
    1207,
    1208,
    3,
    190,
    95,
    0,
    1208,
    1209,
    5,
    69,
    0,
    0,
    1209,
    187,
    1,
    0,
    0,
    0,
    1210,
    1215,
    3,
    190,
    95,
    0,
    1211,
    1212,
    5,
    75,
    0,
    0,
    1212,
    1214,
    3,
    190,
    95,
    0,
    1213,
    1211,
    1,
    0,
    0,
    0,
    1214,
    1217,
    1,
    0,
    0,
    0,
    1215,
    1213,
    1,
    0,
    0,
    0,
    1215,
    1216,
    1,
    0,
    0,
    0,
    1216,
    189,
    1,
    0,
    0,
    0,
    1217,
    1215,
    1,
    0,
    0,
    0,
    1218,
    1219,
    6,
    95,
    -1,
    0,
    1219,
    1250,
    3,
    198,
    99,
    0,
    1220,
    1250,
    3,
    14,
    7,
    0,
    1221,
    1222,
    5,
    37,
    0,
    0,
    1222,
    1250,
    3,
    202,
    101,
    0,
    1223,
    1224,
    5,
    68,
    0,
    0,
    1224,
    1225,
    3,
    222,
    111,
    0,
    1225,
    1226,
    5,
    69,
    0,
    0,
    1226,
    1227,
    3,
    190,
    95,
    21,
    1227,
    1250,
    1,
    0,
    0,
    0,
    1228,
    1229,
    7,
    4,
    0,
    0,
    1229,
    1250,
    3,
    190,
    95,
    19,
    1230,
    1231,
    7,
    5,
    0,
    0,
    1231,
    1250,
    3,
    190,
    95,
    18,
    1232,
    1250,
    3,
    192,
    96,
    0,
    1233,
    1234,
    3,
    222,
    111,
    0,
    1234,
    1240,
    5,
    112,
    0,
    0,
    1235,
    1237,
    3,
    224,
    112,
    0,
    1236,
    1235,
    1,
    0,
    0,
    0,
    1236,
    1237,
    1,
    0,
    0,
    0,
    1237,
    1238,
    1,
    0,
    0,
    0,
    1238,
    1241,
    5,
    115,
    0,
    0,
    1239,
    1241,
    5,
    37,
    0,
    0,
    1240,
    1236,
    1,
    0,
    0,
    0,
    1240,
    1239,
    1,
    0,
    0,
    0,
    1241,
    1250,
    1,
    0,
    0,
    0,
    1242,
    1243,
    3,
    200,
    100,
    0,
    1243,
    1245,
    5,
    112,
    0,
    0,
    1244,
    1246,
    3,
    224,
    112,
    0,
    1245,
    1244,
    1,
    0,
    0,
    0,
    1245,
    1246,
    1,
    0,
    0,
    0,
    1246,
    1247,
    1,
    0,
    0,
    0,
    1247,
    1248,
    5,
    37,
    0,
    0,
    1248,
    1250,
    1,
    0,
    0,
    0,
    1249,
    1218,
    1,
    0,
    0,
    0,
    1249,
    1220,
    1,
    0,
    0,
    0,
    1249,
    1221,
    1,
    0,
    0,
    0,
    1249,
    1223,
    1,
    0,
    0,
    0,
    1249,
    1228,
    1,
    0,
    0,
    0,
    1249,
    1230,
    1,
    0,
    0,
    0,
    1249,
    1232,
    1,
    0,
    0,
    0,
    1249,
    1233,
    1,
    0,
    0,
    0,
    1249,
    1242,
    1,
    0,
    0,
    0,
    1250,
    1331,
    1,
    0,
    0,
    0,
    1251,
    1252,
    10,
    17,
    0,
    0,
    1252,
    1253,
    7,
    6,
    0,
    0,
    1253,
    1330,
    3,
    190,
    95,
    18,
    1254,
    1255,
    10,
    16,
    0,
    0,
    1255,
    1256,
    7,
    7,
    0,
    0,
    1256,
    1330,
    3,
    190,
    95,
    17,
    1257,
    1265,
    10,
    15,
    0,
    0,
    1258,
    1259,
    5,
    79,
    0,
    0,
    1259,
    1266,
    5,
    79,
    0,
    0,
    1260,
    1261,
    5,
    78,
    0,
    0,
    1261,
    1262,
    5,
    78,
    0,
    0,
    1262,
    1266,
    5,
    78,
    0,
    0,
    1263,
    1264,
    5,
    78,
    0,
    0,
    1264,
    1266,
    5,
    78,
    0,
    0,
    1265,
    1258,
    1,
    0,
    0,
    0,
    1265,
    1260,
    1,
    0,
    0,
    0,
    1265,
    1263,
    1,
    0,
    0,
    0,
    1266,
    1267,
    1,
    0,
    0,
    0,
    1267,
    1330,
    3,
    190,
    95,
    16,
    1268,
    1269,
    10,
    14,
    0,
    0,
    1269,
    1270,
    7,
    8,
    0,
    0,
    1270,
    1330,
    3,
    190,
    95,
    15,
    1271,
    1272,
    10,
    12,
    0,
    0,
    1272,
    1273,
    7,
    9,
    0,
    0,
    1273,
    1330,
    3,
    190,
    95,
    13,
    1274,
    1275,
    10,
    11,
    0,
    0,
    1275,
    1276,
    5,
    96,
    0,
    0,
    1276,
    1330,
    3,
    190,
    95,
    12,
    1277,
    1278,
    10,
    10,
    0,
    0,
    1278,
    1279,
    5,
    98,
    0,
    0,
    1279,
    1330,
    3,
    190,
    95,
    11,
    1280,
    1281,
    10,
    9,
    0,
    0,
    1281,
    1282,
    5,
    97,
    0,
    0,
    1282,
    1330,
    3,
    190,
    95,
    10,
    1283,
    1284,
    10,
    8,
    0,
    0,
    1284,
    1285,
    5,
    88,
    0,
    0,
    1285,
    1330,
    3,
    190,
    95,
    9,
    1286,
    1287,
    10,
    7,
    0,
    0,
    1287,
    1288,
    5,
    89,
    0,
    0,
    1288,
    1330,
    3,
    190,
    95,
    8,
    1289,
    1290,
    10,
    6,
    0,
    0,
    1290,
    1291,
    5,
    82,
    0,
    0,
    1291,
    1292,
    3,
    190,
    95,
    0,
    1292,
    1293,
    5,
    83,
    0,
    0,
    1293,
    1294,
    3,
    190,
    95,
    7,
    1294,
    1330,
    1,
    0,
    0,
    0,
    1295,
    1296,
    10,
    5,
    0,
    0,
    1296,
    1297,
    7,
    10,
    0,
    0,
    1297,
    1330,
    3,
    190,
    95,
    5,
    1298,
    1299,
    10,
    25,
    0,
    0,
    1299,
    1311,
    5,
    76,
    0,
    0,
    1300,
    1312,
    5,
    115,
    0,
    0,
    1301,
    1312,
    3,
    14,
    7,
    0,
    1302,
    1312,
    5,
    49,
    0,
    0,
    1303,
    1305,
    5,
    37,
    0,
    0,
    1304,
    1306,
    3,
    218,
    109,
    0,
    1305,
    1304,
    1,
    0,
    0,
    0,
    1305,
    1306,
    1,
    0,
    0,
    0,
    1306,
    1307,
    1,
    0,
    0,
    0,
    1307,
    1312,
    3,
    206,
    103,
    0,
    1308,
    1309,
    5,
    46,
    0,
    0,
    1309,
    1312,
    3,
    226,
    113,
    0,
    1310,
    1312,
    3,
    212,
    106,
    0,
    1311,
    1300,
    1,
    0,
    0,
    0,
    1311,
    1301,
    1,
    0,
    0,
    0,
    1311,
    1302,
    1,
    0,
    0,
    0,
    1311,
    1303,
    1,
    0,
    0,
    0,
    1311,
    1308,
    1,
    0,
    0,
    0,
    1311,
    1310,
    1,
    0,
    0,
    0,
    1312,
    1330,
    1,
    0,
    0,
    0,
    1313,
    1314,
    10,
    24,
    0,
    0,
    1314,
    1315,
    5,
    72,
    0,
    0,
    1315,
    1316,
    3,
    190,
    95,
    0,
    1316,
    1317,
    5,
    73,
    0,
    0,
    1317,
    1330,
    1,
    0,
    0,
    0,
    1318,
    1319,
    10,
    20,
    0,
    0,
    1319,
    1330,
    7,
    11,
    0,
    0,
    1320,
    1321,
    10,
    13,
    0,
    0,
    1321,
    1322,
    5,
    32,
    0,
    0,
    1322,
    1330,
    3,
    222,
    111,
    0,
    1323,
    1324,
    10,
    3,
    0,
    0,
    1324,
    1326,
    5,
    112,
    0,
    0,
    1325,
    1327,
    3,
    224,
    112,
    0,
    1326,
    1325,
    1,
    0,
    0,
    0,
    1326,
    1327,
    1,
    0,
    0,
    0,
    1327,
    1328,
    1,
    0,
    0,
    0,
    1328,
    1330,
    5,
    115,
    0,
    0,
    1329,
    1251,
    1,
    0,
    0,
    0,
    1329,
    1254,
    1,
    0,
    0,
    0,
    1329,
    1257,
    1,
    0,
    0,
    0,
    1329,
    1268,
    1,
    0,
    0,
    0,
    1329,
    1271,
    1,
    0,
    0,
    0,
    1329,
    1274,
    1,
    0,
    0,
    0,
    1329,
    1277,
    1,
    0,
    0,
    0,
    1329,
    1280,
    1,
    0,
    0,
    0,
    1329,
    1283,
    1,
    0,
    0,
    0,
    1329,
    1286,
    1,
    0,
    0,
    0,
    1329,
    1289,
    1,
    0,
    0,
    0,
    1329,
    1295,
    1,
    0,
    0,
    0,
    1329,
    1298,
    1,
    0,
    0,
    0,
    1329,
    1313,
    1,
    0,
    0,
    0,
    1329,
    1318,
    1,
    0,
    0,
    0,
    1329,
    1320,
    1,
    0,
    0,
    0,
    1329,
    1323,
    1,
    0,
    0,
    0,
    1330,
    1333,
    1,
    0,
    0,
    0,
    1331,
    1329,
    1,
    0,
    0,
    0,
    1331,
    1332,
    1,
    0,
    0,
    0,
    1332,
    191,
    1,
    0,
    0,
    0,
    1333,
    1331,
    1,
    0,
    0,
    0,
    1334,
    1335,
    3,
    194,
    97,
    0,
    1335,
    1336,
    5,
    111,
    0,
    0,
    1336,
    1337,
    3,
    196,
    98,
    0,
    1337,
    193,
    1,
    0,
    0,
    0,
    1338,
    1355,
    5,
    115,
    0,
    0,
    1339,
    1341,
    5,
    68,
    0,
    0,
    1340,
    1342,
    3,
    112,
    56,
    0,
    1341,
    1340,
    1,
    0,
    0,
    0,
    1341,
    1342,
    1,
    0,
    0,
    0,
    1342,
    1343,
    1,
    0,
    0,
    0,
    1343,
    1355,
    5,
    69,
    0,
    0,
    1344,
    1345,
    5,
    68,
    0,
    0,
    1345,
    1350,
    5,
    115,
    0,
    0,
    1346,
    1347,
    5,
    75,
    0,
    0,
    1347,
    1349,
    5,
    115,
    0,
    0,
    1348,
    1346,
    1,
    0,
    0,
    0,
    1349,
    1352,
    1,
    0,
    0,
    0,
    1350,
    1348,
    1,
    0,
    0,
    0,
    1350,
    1351,
    1,
    0,
    0,
    0,
    1351,
    1353,
    1,
    0,
    0,
    0,
    1352,
    1350,
    1,
    0,
    0,
    0,
    1353,
    1355,
    5,
    69,
    0,
    0,
    1354,
    1338,
    1,
    0,
    0,
    0,
    1354,
    1339,
    1,
    0,
    0,
    0,
    1354,
    1344,
    1,
    0,
    0,
    0,
    1355,
    195,
    1,
    0,
    0,
    0,
    1356,
    1359,
    3,
    190,
    95,
    0,
    1357,
    1359,
    3,
    154,
    77,
    0,
    1358,
    1356,
    1,
    0,
    0,
    0,
    1358,
    1357,
    1,
    0,
    0,
    0,
    1359,
    197,
    1,
    0,
    0,
    0,
    1360,
    1361,
    5,
    68,
    0,
    0,
    1361,
    1362,
    3,
    190,
    95,
    0,
    1362,
    1363,
    5,
    69,
    0,
    0,
    1363,
    1379,
    1,
    0,
    0,
    0,
    1364,
    1379,
    5,
    49,
    0,
    0,
    1365,
    1379,
    5,
    46,
    0,
    0,
    1366,
    1379,
    3,
    24,
    12,
    0,
    1367,
    1379,
    5,
    115,
    0,
    0,
    1368,
    1369,
    3,
    72,
    36,
    0,
    1369,
    1370,
    5,
    76,
    0,
    0,
    1370,
    1371,
    5,
    15,
    0,
    0,
    1371,
    1379,
    1,
    0,
    0,
    0,
    1372,
    1376,
    3,
    218,
    109,
    0,
    1373,
    1377,
    3,
    228,
    114,
    0,
    1374,
    1375,
    5,
    49,
    0,
    0,
    1375,
    1377,
    3,
    230,
    115,
    0,
    1376,
    1373,
    1,
    0,
    0,
    0,
    1376,
    1374,
    1,
    0,
    0,
    0,
    1377,
    1379,
    1,
    0,
    0,
    0,
    1378,
    1360,
    1,
    0,
    0,
    0,
    1378,
    1364,
    1,
    0,
    0,
    0,
    1378,
    1365,
    1,
    0,
    0,
    0,
    1378,
    1366,
    1,
    0,
    0,
    0,
    1378,
    1367,
    1,
    0,
    0,
    0,
    1378,
    1368,
    1,
    0,
    0,
    0,
    1378,
    1372,
    1,
    0,
    0,
    0,
    1379,
    199,
    1,
    0,
    0,
    0,
    1380,
    1381,
    3,
    104,
    52,
    0,
    1381,
    1382,
    5,
    76,
    0,
    0,
    1382,
    1384,
    1,
    0,
    0,
    0,
    1383,
    1380,
    1,
    0,
    0,
    0,
    1383,
    1384,
    1,
    0,
    0,
    0,
    1384,
    1388,
    1,
    0,
    0,
    0,
    1385,
    1387,
    3,
    128,
    64,
    0,
    1386,
    1385,
    1,
    0,
    0,
    0,
    1387,
    1390,
    1,
    0,
    0,
    0,
    1388,
    1386,
    1,
    0,
    0,
    0,
    1388,
    1389,
    1,
    0,
    0,
    0,
    1389,
    1391,
    1,
    0,
    0,
    0,
    1390,
    1388,
    1,
    0,
    0,
    0,
    1391,
    1393,
    5,
    115,
    0,
    0,
    1392,
    1394,
    3,
    224,
    112,
    0,
    1393,
    1392,
    1,
    0,
    0,
    0,
    1393,
    1394,
    1,
    0,
    0,
    0,
    1394,
    201,
    1,
    0,
    0,
    0,
    1395,
    1396,
    3,
    218,
    109,
    0,
    1396,
    1397,
    3,
    204,
    102,
    0,
    1397,
    1398,
    3,
    210,
    105,
    0,
    1398,
    1405,
    1,
    0,
    0,
    0,
    1399,
    1402,
    3,
    204,
    102,
    0,
    1400,
    1403,
    3,
    208,
    104,
    0,
    1401,
    1403,
    3,
    210,
    105,
    0,
    1402,
    1400,
    1,
    0,
    0,
    0,
    1402,
    1401,
    1,
    0,
    0,
    0,
    1403,
    1405,
    1,
    0,
    0,
    0,
    1404,
    1395,
    1,
    0,
    0,
    0,
    1404,
    1399,
    1,
    0,
    0,
    0,
    1405,
    203,
    1,
    0,
    0,
    0,
    1406,
    1408,
    5,
    115,
    0,
    0,
    1407,
    1409,
    3,
    214,
    107,
    0,
    1408,
    1407,
    1,
    0,
    0,
    0,
    1408,
    1409,
    1,
    0,
    0,
    0,
    1409,
    1417,
    1,
    0,
    0,
    0,
    1410,
    1411,
    5,
    76,
    0,
    0,
    1411,
    1413,
    5,
    115,
    0,
    0,
    1412,
    1414,
    3,
    214,
    107,
    0,
    1413,
    1412,
    1,
    0,
    0,
    0,
    1413,
    1414,
    1,
    0,
    0,
    0,
    1414,
    1416,
    1,
    0,
    0,
    0,
    1415,
    1410,
    1,
    0,
    0,
    0,
    1416,
    1419,
    1,
    0,
    0,
    0,
    1417,
    1415,
    1,
    0,
    0,
    0,
    1417,
    1418,
    1,
    0,
    0,
    0,
    1418,
    1422,
    1,
    0,
    0,
    0,
    1419,
    1417,
    1,
    0,
    0,
    0,
    1420,
    1422,
    3,
    18,
    9,
    0,
    1421,
    1406,
    1,
    0,
    0,
    0,
    1421,
    1420,
    1,
    0,
    0,
    0,
    1422,
    205,
    1,
    0,
    0,
    0,
    1423,
    1425,
    5,
    115,
    0,
    0,
    1424,
    1426,
    3,
    216,
    108,
    0,
    1425,
    1424,
    1,
    0,
    0,
    0,
    1425,
    1426,
    1,
    0,
    0,
    0,
    1426,
    1427,
    1,
    0,
    0,
    0,
    1427,
    1428,
    3,
    210,
    105,
    0,
    1428,
    207,
    1,
    0,
    0,
    0,
    1429,
    1457,
    5,
    72,
    0,
    0,
    1430,
    1435,
    5,
    73,
    0,
    0,
    1431,
    1432,
    5,
    72,
    0,
    0,
    1432,
    1434,
    5,
    73,
    0,
    0,
    1433,
    1431,
    1,
    0,
    0,
    0,
    1434,
    1437,
    1,
    0,
    0,
    0,
    1435,
    1433,
    1,
    0,
    0,
    0,
    1435,
    1436,
    1,
    0,
    0,
    0,
    1436,
    1438,
    1,
    0,
    0,
    0,
    1437,
    1435,
    1,
    0,
    0,
    0,
    1438,
    1458,
    3,
    102,
    51,
    0,
    1439,
    1440,
    3,
    190,
    95,
    0,
    1440,
    1447,
    5,
    73,
    0,
    0,
    1441,
    1442,
    5,
    72,
    0,
    0,
    1442,
    1443,
    3,
    190,
    95,
    0,
    1443,
    1444,
    5,
    73,
    0,
    0,
    1444,
    1446,
    1,
    0,
    0,
    0,
    1445,
    1441,
    1,
    0,
    0,
    0,
    1446,
    1449,
    1,
    0,
    0,
    0,
    1447,
    1445,
    1,
    0,
    0,
    0,
    1447,
    1448,
    1,
    0,
    0,
    0,
    1448,
    1454,
    1,
    0,
    0,
    0,
    1449,
    1447,
    1,
    0,
    0,
    0,
    1450,
    1451,
    5,
    72,
    0,
    0,
    1451,
    1453,
    5,
    73,
    0,
    0,
    1452,
    1450,
    1,
    0,
    0,
    0,
    1453,
    1456,
    1,
    0,
    0,
    0,
    1454,
    1452,
    1,
    0,
    0,
    0,
    1454,
    1455,
    1,
    0,
    0,
    0,
    1455,
    1458,
    1,
    0,
    0,
    0,
    1456,
    1454,
    1,
    0,
    0,
    0,
    1457,
    1430,
    1,
    0,
    0,
    0,
    1457,
    1439,
    1,
    0,
    0,
    0,
    1458,
    209,
    1,
    0,
    0,
    0,
    1459,
    1461,
    3,
    230,
    115,
    0,
    1460,
    1462,
    3,
    60,
    30,
    0,
    1461,
    1460,
    1,
    0,
    0,
    0,
    1461,
    1462,
    1,
    0,
    0,
    0,
    1462,
    211,
    1,
    0,
    0,
    0,
    1463,
    1464,
    3,
    218,
    109,
    0,
    1464,
    1465,
    3,
    228,
    114,
    0,
    1465,
    213,
    1,
    0,
    0,
    0,
    1466,
    1467,
    5,
    79,
    0,
    0,
    1467,
    1470,
    5,
    78,
    0,
    0,
    1468,
    1470,
    3,
    224,
    112,
    0,
    1469,
    1466,
    1,
    0,
    0,
    0,
    1469,
    1468,
    1,
    0,
    0,
    0,
    1470,
    215,
    1,
    0,
    0,
    0,
    1471,
    1472,
    5,
    79,
    0,
    0,
    1472,
    1475,
    5,
    78,
    0,
    0,
    1473,
    1475,
    3,
    218,
    109,
    0,
    1474,
    1471,
    1,
    0,
    0,
    0,
    1474,
    1473,
    1,
    0,
    0,
    0,
    1475,
    217,
    1,
    0,
    0,
    0,
    1476,
    1477,
    5,
    79,
    0,
    0,
    1477,
    1478,
    3,
    220,
    110,
    0,
    1478,
    1479,
    5,
    78,
    0,
    0,
    1479,
    219,
    1,
    0,
    0,
    0,
    1480,
    1485,
    3,
    222,
    111,
    0,
    1481,
    1482,
    5,
    75,
    0,
    0,
    1482,
    1484,
    3,
    222,
    111,
    0,
    1483,
    1481,
    1,
    0,
    0,
    0,
    1484,
    1487,
    1,
    0,
    0,
    0,
    1485,
    1483,
    1,
    0,
    0,
    0,
    1485,
    1486,
    1,
    0,
    0,
    0,
    1486,
    221,
    1,
    0,
    0,
    0,
    1487,
    1485,
    1,
    0,
    0,
    0,
    1488,
    1490,
    3,
    128,
    64,
    0,
    1489,
    1488,
    1,
    0,
    0,
    0,
    1489,
    1490,
    1,
    0,
    0,
    0,
    1490,
    1494,
    1,
    0,
    0,
    0,
    1491,
    1495,
    3,
    104,
    52,
    0,
    1492,
    1495,
    3,
    18,
    9,
    0,
    1493,
    1495,
    5,
    54,
    0,
    0,
    1494,
    1491,
    1,
    0,
    0,
    0,
    1494,
    1492,
    1,
    0,
    0,
    0,
    1494,
    1493,
    1,
    0,
    0,
    0,
    1495,
    1500,
    1,
    0,
    0,
    0,
    1496,
    1497,
    5,
    72,
    0,
    0,
    1497,
    1499,
    5,
    73,
    0,
    0,
    1498,
    1496,
    1,
    0,
    0,
    0,
    1499,
    1502,
    1,
    0,
    0,
    0,
    1500,
    1498,
    1,
    0,
    0,
    0,
    1500,
    1501,
    1,
    0,
    0,
    0,
    1501,
    223,
    1,
    0,
    0,
    0,
    1502,
    1500,
    1,
    0,
    0,
    0,
    1503,
    1504,
    5,
    79,
    0,
    0,
    1504,
    1509,
    3,
    106,
    53,
    0,
    1505,
    1506,
    5,
    75,
    0,
    0,
    1506,
    1508,
    3,
    106,
    53,
    0,
    1507,
    1505,
    1,
    0,
    0,
    0,
    1508,
    1511,
    1,
    0,
    0,
    0,
    1509,
    1507,
    1,
    0,
    0,
    0,
    1509,
    1510,
    1,
    0,
    0,
    0,
    1510,
    1512,
    1,
    0,
    0,
    0,
    1511,
    1509,
    1,
    0,
    0,
    0,
    1512,
    1513,
    5,
    78,
    0,
    0,
    1513,
    225,
    1,
    0,
    0,
    0,
    1514,
    1521,
    3,
    230,
    115,
    0,
    1515,
    1516,
    5,
    76,
    0,
    0,
    1516,
    1518,
    5,
    115,
    0,
    0,
    1517,
    1519,
    3,
    230,
    115,
    0,
    1518,
    1517,
    1,
    0,
    0,
    0,
    1518,
    1519,
    1,
    0,
    0,
    0,
    1519,
    1521,
    1,
    0,
    0,
    0,
    1520,
    1514,
    1,
    0,
    0,
    0,
    1520,
    1515,
    1,
    0,
    0,
    0,
    1521,
    227,
    1,
    0,
    0,
    0,
    1522,
    1523,
    5,
    46,
    0,
    0,
    1523,
    1527,
    3,
    226,
    113,
    0,
    1524,
    1525,
    5,
    115,
    0,
    0,
    1525,
    1527,
    3,
    230,
    115,
    0,
    1526,
    1522,
    1,
    0,
    0,
    0,
    1526,
    1524,
    1,
    0,
    0,
    0,
    1527,
    229,
    1,
    0,
    0,
    0,
    1528,
    1530,
    5,
    68,
    0,
    0,
    1529,
    1531,
    3,
    188,
    94,
    0,
    1530,
    1529,
    1,
    0,
    0,
    0,
    1530,
    1531,
    1,
    0,
    0,
    0,
    1531,
    1532,
    1,
    0,
    0,
    0,
    1532,
    1533,
    5,
    69,
    0,
    0,
    1533,
    231,
    1,
    0,
    0,
    0,
    195,
    235,
    238,
    243,
    249,
    256,
    258,
    265,
    267,
    275,
    277,
    285,
    287,
    293,
    295,
    303,
    305,
    308,
    316,
    319,
    326,
    335,
    341,
    347,
    350,
    355,
    368,
    374,
    379,
    383,
    393,
    398,
    403,
    409,
    417,
    426,
    431,
    438,
    445,
    448,
    455,
    465,
    469,
    474,
    478,
    482,
    492,
    500,
    506,
    513,
    520,
    524,
    527,
    530,
    539,
    545,
    550,
    553,
    559,
    565,
    569,
    577,
    586,
    594,
    600,
    604,
    615,
    624,
    629,
    635,
    639,
    651,
    662,
    667,
    676,
    684,
    694,
    703,
    711,
    716,
    724,
    729,
    739,
    749,
    755,
    759,
    767,
    771,
    773,
    779,
    784,
    788,
    795,
    797,
    804,
    809,
    818,
    823,
    826,
    831,
    840,
    853,
    864,
    867,
    874,
    884,
    892,
    895,
    898,
    911,
    919,
    924,
    932,
    936,
    940,
    944,
    946,
    950,
    956,
    967,
    977,
    982,
    991,
    996,
    999,
    1006,
    1015,
    1038,
    1041,
    1044,
    1052,
    1056,
    1064,
    1070,
    1081,
    1090,
    1095,
    1105,
    1112,
    1125,
    1134,
    1143,
    1149,
    1160,
    1165,
    1170,
    1175,
    1179,
    1183,
    1187,
    1189,
    1193,
    1198,
    1215,
    1236,
    1240,
    1245,
    1249,
    1265,
    1305,
    1311,
    1326,
    1329,
    1331,
    1341,
    1350,
    1354,
    1358,
    1376,
    1378,
    1383,
    1388,
    1393,
    1402,
    1404,
    1408,
    1413,
    1417,
    1421,
    1425,
    1435,
    1447,
    1454,
    1457,
    1461,
    1469,
    1474,
    1485,
    1489,
    1494,
    1500,
    1509,
    1518,
    1520,
    1526,
    1530
  ];
  static __ATN;
  static get _ATN() {
    return ProcessingParser.__ATN || (ProcessingParser.__ATN = new We().deserialize(ProcessingParser._serializedATN)), ProcessingParser.__ATN;
  }
  static DecisionsToDFA = ProcessingParser._ATN.decisionToState.map((ds, index) => new Qe(ds, index));
}
class ProcessingSketchContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  staticProcessingSketch() {
    return this.getTypedRuleContext(StaticProcessingSketchContext, 0);
  }
  javaProcessingSketch() {
    return this.getTypedRuleContext(JavaProcessingSketchContext, 0);
  }
  activeProcessingSketch() {
    return this.getTypedRuleContext(ActiveProcessingSketchContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_processingSketch;
  }
  // @Override
  accept(visitor) {
    return visitor.visitProcessingSketch ? visitor.visitProcessingSketch(this) : visitor.visitChildren(this);
  }
}
class JavaProcessingSketchContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  EOF() {
    return this.getToken(ProcessingParser.EOF, 0);
  }
  packageDeclaration() {
    return this.getTypedRuleContext(PackageDeclarationContext, 0);
  }
  importDeclaration_list() {
    return this.getTypedRuleContexts(ImportDeclarationContext);
  }
  importDeclaration(i2) {
    return this.getTypedRuleContext(ImportDeclarationContext, i2);
  }
  typeDeclaration_list() {
    return this.getTypedRuleContexts(TypeDeclarationContext);
  }
  typeDeclaration(i2) {
    return this.getTypedRuleContext(TypeDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_javaProcessingSketch;
  }
  // @Override
  accept(visitor) {
    return visitor.visitJavaProcessingSketch ? visitor.visitJavaProcessingSketch(this) : visitor.visitChildren(this);
  }
}
class StaticProcessingSketchContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  EOF() {
    return this.getToken(ProcessingParser.EOF, 0);
  }
  importDeclaration_list() {
    return this.getTypedRuleContexts(ImportDeclarationContext);
  }
  importDeclaration(i2) {
    return this.getTypedRuleContext(ImportDeclarationContext, i2);
  }
  blockStatement_list() {
    return this.getTypedRuleContexts(BlockStatementContext);
  }
  blockStatement(i2) {
    return this.getTypedRuleContext(BlockStatementContext, i2);
  }
  typeDeclaration_list() {
    return this.getTypedRuleContexts(TypeDeclarationContext);
  }
  typeDeclaration(i2) {
    return this.getTypedRuleContext(TypeDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_staticProcessingSketch;
  }
  // @Override
  accept(visitor) {
    return visitor.visitStaticProcessingSketch ? visitor.visitStaticProcessingSketch(this) : visitor.visitChildren(this);
  }
}
class ActiveProcessingSketchContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  EOF() {
    return this.getToken(ProcessingParser.EOF, 0);
  }
  importDeclaration_list() {
    return this.getTypedRuleContexts(ImportDeclarationContext);
  }
  importDeclaration(i2) {
    return this.getTypedRuleContext(ImportDeclarationContext, i2);
  }
  classBodyDeclaration_list() {
    return this.getTypedRuleContexts(ClassBodyDeclarationContext);
  }
  classBodyDeclaration(i2) {
    return this.getTypedRuleContext(ClassBodyDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_activeProcessingSketch;
  }
  // @Override
  accept(visitor) {
    return visitor.visitActiveProcessingSketch ? visitor.visitActiveProcessingSketch(this) : visitor.visitChildren(this);
  }
}
class WarnMixedModesContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  blockStatement_list() {
    return this.getTypedRuleContexts(BlockStatementContext);
  }
  blockStatement(i2) {
    return this.getTypedRuleContext(BlockStatementContext, i2);
  }
  classBodyDeclaration_list() {
    return this.getTypedRuleContexts(ClassBodyDeclarationContext);
  }
  classBodyDeclaration(i2) {
    return this.getTypedRuleContext(ClassBodyDeclarationContext, i2);
  }
  importDeclaration_list() {
    return this.getTypedRuleContexts(ImportDeclarationContext);
  }
  importDeclaration(i2) {
    return this.getTypedRuleContext(ImportDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_warnMixedModes;
  }
  // @Override
  accept(visitor) {
    return visitor.visitWarnMixedModes ? visitor.visitWarnMixedModes(this) : visitor.visitChildren(this);
  }
}
class VariableDeclaratorIdContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  warnTypeAsVariableName() {
    return this.getTypedRuleContext(WarnTypeAsVariableNameContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_variableDeclaratorId;
  }
  // @Override
  accept(visitor) {
    return visitor.visitVariableDeclaratorId ? visitor.visitVariableDeclaratorId(this) : visitor.visitChildren(this);
  }
}
class WarnTypeAsVariableNameContext extends Sn {
  _primitiveType;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  primitiveType() {
    return this.getTypedRuleContext(PrimitiveTypeContext, 0);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_warnTypeAsVariableName;
  }
  // @Override
  accept(visitor) {
    return visitor.visitWarnTypeAsVariableName ? visitor.visitWarnTypeAsVariableName(this) : visitor.visitChildren(this);
  }
}
class MethodCallContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  functionWithPrimitiveTypeName() {
    return this.getTypedRuleContext(FunctionWithPrimitiveTypeNameContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  expressionList() {
    return this.getTypedRuleContext(ExpressionListContext, 0);
  }
  THIS() {
    return this.getToken(ProcessingParser.THIS, 0);
  }
  SUPER() {
    return this.getToken(ProcessingParser.SUPER, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_methodCall;
  }
  // @Override
  accept(visitor) {
    return visitor.visitMethodCall ? visitor.visitMethodCall(this) : visitor.visitChildren(this);
  }
}
class FunctionWithPrimitiveTypeNameContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  BOOLEAN() {
    return this.getToken(ProcessingParser.BOOLEAN, 0);
  }
  BYTE() {
    return this.getToken(ProcessingParser.BYTE, 0);
  }
  CHAR() {
    return this.getToken(ProcessingParser.CHAR, 0);
  }
  FLOAT() {
    return this.getToken(ProcessingParser.FLOAT, 0);
  }
  INT() {
    return this.getToken(ProcessingParser.INT, 0);
  }
  expressionList() {
    return this.getTypedRuleContext(ExpressionListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_functionWithPrimitiveTypeName;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFunctionWithPrimitiveTypeName ? visitor.visitFunctionWithPrimitiveTypeName(this) : visitor.visitChildren(this);
  }
}
class PrimitiveTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  BOOLEAN() {
    return this.getToken(ProcessingParser.BOOLEAN, 0);
  }
  CHAR() {
    return this.getToken(ProcessingParser.CHAR, 0);
  }
  BYTE() {
    return this.getToken(ProcessingParser.BYTE, 0);
  }
  SHORT() {
    return this.getToken(ProcessingParser.SHORT, 0);
  }
  INT() {
    return this.getToken(ProcessingParser.INT, 0);
  }
  LONG() {
    return this.getToken(ProcessingParser.LONG, 0);
  }
  FLOAT() {
    return this.getToken(ProcessingParser.FLOAT, 0);
  }
  DOUBLE() {
    return this.getToken(ProcessingParser.DOUBLE, 0);
  }
  colorPrimitiveType() {
    return this.getTypedRuleContext(ColorPrimitiveTypeContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_primitiveType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitPrimitiveType ? visitor.visitPrimitiveType(this) : visitor.visitChildren(this);
  }
}
class ColorPrimitiveTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  get ruleIndex() {
    return ProcessingParser.RULE_colorPrimitiveType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitColorPrimitiveType ? visitor.visitColorPrimitiveType(this) : visitor.visitChildren(this);
  }
}
class QualifiedNameContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER_list() {
    return this.getTokens(ProcessingParser.IDENTIFIER);
  }
  IDENTIFIER(i2) {
    return this.getToken(ProcessingParser.IDENTIFIER, i2);
  }
  colorPrimitiveType_list() {
    return this.getTypedRuleContexts(ColorPrimitiveTypeContext);
  }
  colorPrimitiveType(i2) {
    return this.getTypedRuleContext(ColorPrimitiveTypeContext, i2);
  }
  DOT_list() {
    return this.getTokens(ProcessingParser.DOT);
  }
  DOT(i2) {
    return this.getToken(ProcessingParser.DOT, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_qualifiedName;
  }
  // @Override
  accept(visitor) {
    return visitor.visitQualifiedName ? visitor.visitQualifiedName(this) : visitor.visitChildren(this);
  }
}
class LiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  integerLiteral() {
    return this.getTypedRuleContext(IntegerLiteralContext, 0);
  }
  floatLiteral() {
    return this.getTypedRuleContext(FloatLiteralContext, 0);
  }
  CHAR_LITERAL() {
    return this.getToken(ProcessingParser.CHAR_LITERAL, 0);
  }
  stringLiteral() {
    return this.getTypedRuleContext(StringLiteralContext, 0);
  }
  BOOL_LITERAL() {
    return this.getToken(ProcessingParser.BOOL_LITERAL, 0);
  }
  NULL_LITERAL() {
    return this.getToken(ProcessingParser.NULL_LITERAL, 0);
  }
  hexColorLiteral() {
    return this.getTypedRuleContext(HexColorLiteralContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_literal;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLiteral ? visitor.visitLiteral(this) : visitor.visitChildren(this);
  }
}
class HexColorLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  HexColorLiteral() {
    return this.getToken(ProcessingParser.HexColorLiteral, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_hexColorLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitHexColorLiteral ? visitor.visitHexColorLiteral(this) : visitor.visitChildren(this);
  }
}
class CompilationUnitContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  EOF() {
    return this.getToken(ProcessingParser.EOF, 0);
  }
  packageDeclaration() {
    return this.getTypedRuleContext(PackageDeclarationContext, 0);
  }
  importDeclaration_list() {
    return this.getTypedRuleContexts(ImportDeclarationContext);
  }
  importDeclaration(i2) {
    return this.getTypedRuleContext(ImportDeclarationContext, i2);
  }
  typeDeclaration_list() {
    return this.getTypedRuleContexts(TypeDeclarationContext);
  }
  typeDeclaration(i2) {
    return this.getTypedRuleContext(TypeDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_compilationUnit;
  }
  // @Override
  accept(visitor) {
    return visitor.visitCompilationUnit ? visitor.visitCompilationUnit(this) : visitor.visitChildren(this);
  }
}
class PackageDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  PACKAGE() {
    return this.getToken(ProcessingParser.PACKAGE, 0);
  }
  qualifiedName() {
    return this.getTypedRuleContext(QualifiedNameContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  annotation_list() {
    return this.getTypedRuleContexts(AnnotationContext);
  }
  annotation(i2) {
    return this.getTypedRuleContext(AnnotationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_packageDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitPackageDeclaration ? visitor.visitPackageDeclaration(this) : visitor.visitChildren(this);
  }
}
class ImportDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IMPORT() {
    return this.getToken(ProcessingParser.IMPORT, 0);
  }
  qualifiedName() {
    return this.getTypedRuleContext(QualifiedNameContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  STATIC() {
    return this.getToken(ProcessingParser.STATIC, 0);
  }
  DOT() {
    return this.getToken(ProcessingParser.DOT, 0);
  }
  MUL() {
    return this.getToken(ProcessingParser.MUL, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_importDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitImportDeclaration ? visitor.visitImportDeclaration(this) : visitor.visitChildren(this);
  }
}
class TypeDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  classDeclaration() {
    return this.getTypedRuleContext(ClassDeclarationContext, 0);
  }
  enumDeclaration() {
    return this.getTypedRuleContext(EnumDeclarationContext, 0);
  }
  interfaceDeclaration() {
    return this.getTypedRuleContext(InterfaceDeclarationContext, 0);
  }
  annotationTypeDeclaration() {
    return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0);
  }
  classOrInterfaceModifier_list() {
    return this.getTypedRuleContexts(ClassOrInterfaceModifierContext);
  }
  classOrInterfaceModifier(i2) {
    return this.getTypedRuleContext(ClassOrInterfaceModifierContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeDeclaration ? visitor.visitTypeDeclaration(this) : visitor.visitChildren(this);
  }
}
class ModifierContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  classOrInterfaceModifier() {
    return this.getTypedRuleContext(ClassOrInterfaceModifierContext, 0);
  }
  NATIVE() {
    return this.getToken(ProcessingParser.NATIVE, 0);
  }
  SYNCHRONIZED() {
    return this.getToken(ProcessingParser.SYNCHRONIZED, 0);
  }
  TRANSIENT() {
    return this.getToken(ProcessingParser.TRANSIENT, 0);
  }
  VOLATILE() {
    return this.getToken(ProcessingParser.VOLATILE, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_modifier;
  }
  // @Override
  accept(visitor) {
    return visitor.visitModifier ? visitor.visitModifier(this) : visitor.visitChildren(this);
  }
}
class ClassOrInterfaceModifierContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  annotation() {
    return this.getTypedRuleContext(AnnotationContext, 0);
  }
  PUBLIC() {
    return this.getToken(ProcessingParser.PUBLIC, 0);
  }
  PROTECTED() {
    return this.getToken(ProcessingParser.PROTECTED, 0);
  }
  PRIVATE() {
    return this.getToken(ProcessingParser.PRIVATE, 0);
  }
  STATIC() {
    return this.getToken(ProcessingParser.STATIC, 0);
  }
  ABSTRACT() {
    return this.getToken(ProcessingParser.ABSTRACT, 0);
  }
  FINAL() {
    return this.getToken(ProcessingParser.FINAL, 0);
  }
  STRICTFP() {
    return this.getToken(ProcessingParser.STRICTFP, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classOrInterfaceModifier;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassOrInterfaceModifier ? visitor.visitClassOrInterfaceModifier(this) : visitor.visitChildren(this);
  }
}
class VariableModifierContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  FINAL() {
    return this.getToken(ProcessingParser.FINAL, 0);
  }
  annotation() {
    return this.getTypedRuleContext(AnnotationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_variableModifier;
  }
  // @Override
  accept(visitor) {
    return visitor.visitVariableModifier ? visitor.visitVariableModifier(this) : visitor.visitChildren(this);
  }
}
class ClassDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  CLASS() {
    return this.getToken(ProcessingParser.CLASS, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  classBody() {
    return this.getTypedRuleContext(ClassBodyContext, 0);
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  EXTENDS() {
    return this.getToken(ProcessingParser.EXTENDS, 0);
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  IMPLEMENTS() {
    return this.getToken(ProcessingParser.IMPLEMENTS, 0);
  }
  typeList() {
    return this.getTypedRuleContext(TypeListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassDeclaration ? visitor.visitClassDeclaration(this) : visitor.visitChildren(this);
  }
}
class TypeParametersContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LT() {
    return this.getToken(ProcessingParser.LT, 0);
  }
  typeParameter_list() {
    return this.getTypedRuleContexts(TypeParameterContext);
  }
  typeParameter(i2) {
    return this.getTypedRuleContext(TypeParameterContext, i2);
  }
  GT() {
    return this.getToken(ProcessingParser.GT, 0);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeParameters;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeParameters ? visitor.visitTypeParameters(this) : visitor.visitChildren(this);
  }
}
class TypeParameterContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  annotation_list() {
    return this.getTypedRuleContexts(AnnotationContext);
  }
  annotation(i2) {
    return this.getTypedRuleContext(AnnotationContext, i2);
  }
  EXTENDS() {
    return this.getToken(ProcessingParser.EXTENDS, 0);
  }
  typeBound() {
    return this.getTypedRuleContext(TypeBoundContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeParameter;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeParameter ? visitor.visitTypeParameter(this) : visitor.visitChildren(this);
  }
}
class TypeBoundContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType_list() {
    return this.getTypedRuleContexts(TypeTypeContext);
  }
  typeType(i2) {
    return this.getTypedRuleContext(TypeTypeContext, i2);
  }
  BITAND_list() {
    return this.getTokens(ProcessingParser.BITAND);
  }
  BITAND(i2) {
    return this.getToken(ProcessingParser.BITAND, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeBound;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeBound ? visitor.visitTypeBound(this) : visitor.visitChildren(this);
  }
}
class EnumDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  ENUM() {
    return this.getToken(ProcessingParser.ENUM, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  IMPLEMENTS() {
    return this.getToken(ProcessingParser.IMPLEMENTS, 0);
  }
  typeList() {
    return this.getTypedRuleContext(TypeListContext, 0);
  }
  enumConstants() {
    return this.getTypedRuleContext(EnumConstantsContext, 0);
  }
  COMMA() {
    return this.getToken(ProcessingParser.COMMA, 0);
  }
  enumBodyDeclarations() {
    return this.getTypedRuleContext(EnumBodyDeclarationsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_enumDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitEnumDeclaration ? visitor.visitEnumDeclaration(this) : visitor.visitChildren(this);
  }
}
class EnumConstantsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  enumConstant_list() {
    return this.getTypedRuleContexts(EnumConstantContext);
  }
  enumConstant(i2) {
    return this.getTypedRuleContext(EnumConstantContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_enumConstants;
  }
  // @Override
  accept(visitor) {
    return visitor.visitEnumConstants ? visitor.visitEnumConstants(this) : visitor.visitChildren(this);
  }
}
class EnumConstantContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  annotation_list() {
    return this.getTypedRuleContexts(AnnotationContext);
  }
  annotation(i2) {
    return this.getTypedRuleContext(AnnotationContext, i2);
  }
  arguments() {
    return this.getTypedRuleContext(ArgumentsContext, 0);
  }
  classBody() {
    return this.getTypedRuleContext(ClassBodyContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_enumConstant;
  }
  // @Override
  accept(visitor) {
    return visitor.visitEnumConstant ? visitor.visitEnumConstant(this) : visitor.visitChildren(this);
  }
}
class EnumBodyDeclarationsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  classBodyDeclaration_list() {
    return this.getTypedRuleContexts(ClassBodyDeclarationContext);
  }
  classBodyDeclaration(i2) {
    return this.getTypedRuleContext(ClassBodyDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_enumBodyDeclarations;
  }
  // @Override
  accept(visitor) {
    return visitor.visitEnumBodyDeclarations ? visitor.visitEnumBodyDeclarations(this) : visitor.visitChildren(this);
  }
}
class InterfaceDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  INTERFACE() {
    return this.getToken(ProcessingParser.INTERFACE, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  interfaceBody() {
    return this.getTypedRuleContext(InterfaceBodyContext, 0);
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  EXTENDS() {
    return this.getToken(ProcessingParser.EXTENDS, 0);
  }
  typeList() {
    return this.getTypedRuleContext(TypeListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceDeclaration ? visitor.visitInterfaceDeclaration(this) : visitor.visitChildren(this);
  }
}
class ClassBodyContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  classBodyDeclaration_list() {
    return this.getTypedRuleContexts(ClassBodyDeclarationContext);
  }
  classBodyDeclaration(i2) {
    return this.getTypedRuleContext(ClassBodyDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classBody;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassBody ? visitor.visitClassBody(this) : visitor.visitChildren(this);
  }
}
class InterfaceBodyContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  interfaceBodyDeclaration_list() {
    return this.getTypedRuleContexts(InterfaceBodyDeclarationContext);
  }
  interfaceBodyDeclaration(i2) {
    return this.getTypedRuleContext(InterfaceBodyDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceBody;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceBody ? visitor.visitInterfaceBody(this) : visitor.visitChildren(this);
  }
}
class ClassBodyDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  importDeclaration() {
    return this.getTypedRuleContext(ImportDeclarationContext, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  STATIC() {
    return this.getToken(ProcessingParser.STATIC, 0);
  }
  memberDeclaration() {
    return this.getTypedRuleContext(MemberDeclarationContext, 0);
  }
  modifier_list() {
    return this.getTypedRuleContexts(ModifierContext);
  }
  modifier(i2) {
    return this.getTypedRuleContext(ModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classBodyDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassBodyDeclaration ? visitor.visitClassBodyDeclaration(this) : visitor.visitChildren(this);
  }
}
class MemberDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  methodDeclaration() {
    return this.getTypedRuleContext(MethodDeclarationContext, 0);
  }
  genericMethodDeclaration() {
    return this.getTypedRuleContext(GenericMethodDeclarationContext, 0);
  }
  fieldDeclaration() {
    return this.getTypedRuleContext(FieldDeclarationContext, 0);
  }
  constructorDeclaration() {
    return this.getTypedRuleContext(ConstructorDeclarationContext, 0);
  }
  genericConstructorDeclaration() {
    return this.getTypedRuleContext(GenericConstructorDeclarationContext, 0);
  }
  interfaceDeclaration() {
    return this.getTypedRuleContext(InterfaceDeclarationContext, 0);
  }
  annotationTypeDeclaration() {
    return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0);
  }
  classDeclaration() {
    return this.getTypedRuleContext(ClassDeclarationContext, 0);
  }
  enumDeclaration() {
    return this.getTypedRuleContext(EnumDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_memberDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitMemberDeclaration ? visitor.visitMemberDeclaration(this) : visitor.visitChildren(this);
  }
}
class MethodDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeTypeOrVoid() {
    return this.getTypedRuleContext(TypeTypeOrVoidContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  formalParameters() {
    return this.getTypedRuleContext(FormalParametersContext, 0);
  }
  methodBody() {
    return this.getTypedRuleContext(MethodBodyContext, 0);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  THROWS() {
    return this.getToken(ProcessingParser.THROWS, 0);
  }
  qualifiedNameList() {
    return this.getTypedRuleContext(QualifiedNameListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_methodDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitMethodDeclaration ? visitor.visitMethodDeclaration(this) : visitor.visitChildren(this);
  }
}
class MethodBodyContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_methodBody;
  }
  // @Override
  accept(visitor) {
    return visitor.visitMethodBody ? visitor.visitMethodBody(this) : visitor.visitChildren(this);
  }
}
class TypeTypeOrVoidContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  VOID() {
    return this.getToken(ProcessingParser.VOID, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeTypeOrVoid;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeTypeOrVoid ? visitor.visitTypeTypeOrVoid(this) : visitor.visitChildren(this);
  }
}
class GenericMethodDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  methodDeclaration() {
    return this.getTypedRuleContext(MethodDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_genericMethodDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitGenericMethodDeclaration ? visitor.visitGenericMethodDeclaration(this) : visitor.visitChildren(this);
  }
}
class GenericConstructorDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  constructorDeclaration() {
    return this.getTypedRuleContext(ConstructorDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_genericConstructorDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitGenericConstructorDeclaration ? visitor.visitGenericConstructorDeclaration(this) : visitor.visitChildren(this);
  }
}
class ConstructorDeclarationContext extends Sn {
  _constructorBody;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  formalParameters() {
    return this.getTypedRuleContext(FormalParametersContext, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  THROWS() {
    return this.getToken(ProcessingParser.THROWS, 0);
  }
  qualifiedNameList() {
    return this.getTypedRuleContext(QualifiedNameListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_constructorDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitConstructorDeclaration ? visitor.visitConstructorDeclaration(this) : visitor.visitChildren(this);
  }
}
class FieldDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  variableDeclarators() {
    return this.getTypedRuleContext(VariableDeclaratorsContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_fieldDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFieldDeclaration ? visitor.visitFieldDeclaration(this) : visitor.visitChildren(this);
  }
}
class InterfaceBodyDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  interfaceMemberDeclaration() {
    return this.getTypedRuleContext(InterfaceMemberDeclarationContext, 0);
  }
  modifier_list() {
    return this.getTypedRuleContexts(ModifierContext);
  }
  modifier(i2) {
    return this.getTypedRuleContext(ModifierContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceBodyDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceBodyDeclaration ? visitor.visitInterfaceBodyDeclaration(this) : visitor.visitChildren(this);
  }
}
class InterfaceMemberDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  constDeclaration() {
    return this.getTypedRuleContext(ConstDeclarationContext, 0);
  }
  interfaceMethodDeclaration() {
    return this.getTypedRuleContext(InterfaceMethodDeclarationContext, 0);
  }
  genericInterfaceMethodDeclaration() {
    return this.getTypedRuleContext(GenericInterfaceMethodDeclarationContext, 0);
  }
  interfaceDeclaration() {
    return this.getTypedRuleContext(InterfaceDeclarationContext, 0);
  }
  annotationTypeDeclaration() {
    return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0);
  }
  classDeclaration() {
    return this.getTypedRuleContext(ClassDeclarationContext, 0);
  }
  enumDeclaration() {
    return this.getTypedRuleContext(EnumDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceMemberDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceMemberDeclaration ? visitor.visitInterfaceMemberDeclaration(this) : visitor.visitChildren(this);
  }
}
class ConstDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  constantDeclarator_list() {
    return this.getTypedRuleContexts(ConstantDeclaratorContext);
  }
  constantDeclarator(i2) {
    return this.getTypedRuleContext(ConstantDeclaratorContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_constDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitConstDeclaration ? visitor.visitConstDeclaration(this) : visitor.visitChildren(this);
  }
}
class ConstantDeclaratorContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  ASSIGN() {
    return this.getToken(ProcessingParser.ASSIGN, 0);
  }
  variableInitializer() {
    return this.getTypedRuleContext(VariableInitializerContext, 0);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_constantDeclarator;
  }
  // @Override
  accept(visitor) {
    return visitor.visitConstantDeclarator ? visitor.visitConstantDeclarator(this) : visitor.visitChildren(this);
  }
}
class InterfaceMethodDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  formalParameters() {
    return this.getTypedRuleContext(FormalParametersContext, 0);
  }
  methodBody() {
    return this.getTypedRuleContext(MethodBodyContext, 0);
  }
  typeTypeOrVoid() {
    return this.getTypedRuleContext(TypeTypeOrVoidContext, 0);
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  interfaceMethodModifier_list() {
    return this.getTypedRuleContexts(InterfaceMethodModifierContext);
  }
  interfaceMethodModifier(i2) {
    return this.getTypedRuleContext(InterfaceMethodModifierContext, i2);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  THROWS() {
    return this.getToken(ProcessingParser.THROWS, 0);
  }
  qualifiedNameList() {
    return this.getTypedRuleContext(QualifiedNameListContext, 0);
  }
  annotation_list() {
    return this.getTypedRuleContexts(AnnotationContext);
  }
  annotation(i2) {
    return this.getTypedRuleContext(AnnotationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceMethodDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceMethodDeclaration ? visitor.visitInterfaceMethodDeclaration(this) : visitor.visitChildren(this);
  }
}
class InterfaceMethodModifierContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  annotation() {
    return this.getTypedRuleContext(AnnotationContext, 0);
  }
  PUBLIC() {
    return this.getToken(ProcessingParser.PUBLIC, 0);
  }
  ABSTRACT() {
    return this.getToken(ProcessingParser.ABSTRACT, 0);
  }
  DEFAULT() {
    return this.getToken(ProcessingParser.DEFAULT, 0);
  }
  STATIC() {
    return this.getToken(ProcessingParser.STATIC, 0);
  }
  STRICTFP() {
    return this.getToken(ProcessingParser.STRICTFP, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_interfaceMethodModifier;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInterfaceMethodModifier ? visitor.visitInterfaceMethodModifier(this) : visitor.visitChildren(this);
  }
}
class GenericInterfaceMethodDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeParameters() {
    return this.getTypedRuleContext(TypeParametersContext, 0);
  }
  interfaceMethodDeclaration() {
    return this.getTypedRuleContext(InterfaceMethodDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_genericInterfaceMethodDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitGenericInterfaceMethodDeclaration ? visitor.visitGenericInterfaceMethodDeclaration(this) : visitor.visitChildren(this);
  }
}
class VariableDeclaratorsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  variableDeclarator_list() {
    return this.getTypedRuleContexts(VariableDeclaratorContext);
  }
  variableDeclarator(i2) {
    return this.getTypedRuleContext(VariableDeclaratorContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_variableDeclarators;
  }
  // @Override
  accept(visitor) {
    return visitor.visitVariableDeclarators ? visitor.visitVariableDeclarators(this) : visitor.visitChildren(this);
  }
}
class VariableDeclaratorContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  variableDeclaratorId() {
    return this.getTypedRuleContext(VariableDeclaratorIdContext, 0);
  }
  ASSIGN() {
    return this.getToken(ProcessingParser.ASSIGN, 0);
  }
  variableInitializer() {
    return this.getTypedRuleContext(VariableInitializerContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_variableDeclarator;
  }
  // @Override
  accept(visitor) {
    return visitor.visitVariableDeclarator ? visitor.visitVariableDeclarator(this) : visitor.visitChildren(this);
  }
}
class VariableInitializerContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  arrayInitializer() {
    return this.getTypedRuleContext(ArrayInitializerContext, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_variableInitializer;
  }
  // @Override
  accept(visitor) {
    return visitor.visitVariableInitializer ? visitor.visitVariableInitializer(this) : visitor.visitChildren(this);
  }
}
class ArrayInitializerContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  variableInitializer_list() {
    return this.getTypedRuleContexts(VariableInitializerContext);
  }
  variableInitializer(i2) {
    return this.getTypedRuleContext(VariableInitializerContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_arrayInitializer;
  }
  // @Override
  accept(visitor) {
    return visitor.visitArrayInitializer ? visitor.visitArrayInitializer(this) : visitor.visitChildren(this);
  }
}
class ClassOrInterfaceTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER_list() {
    return this.getTokens(ProcessingParser.IDENTIFIER);
  }
  IDENTIFIER(i2) {
    return this.getToken(ProcessingParser.IDENTIFIER, i2);
  }
  typeArguments_list() {
    return this.getTypedRuleContexts(TypeArgumentsContext);
  }
  typeArguments(i2) {
    return this.getTypedRuleContext(TypeArgumentsContext, i2);
  }
  DOT_list() {
    return this.getTokens(ProcessingParser.DOT);
  }
  DOT(i2) {
    return this.getToken(ProcessingParser.DOT, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classOrInterfaceType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassOrInterfaceType ? visitor.visitClassOrInterfaceType(this) : visitor.visitChildren(this);
  }
}
class TypeArgumentContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  QUESTION() {
    return this.getToken(ProcessingParser.QUESTION, 0);
  }
  EXTENDS() {
    return this.getToken(ProcessingParser.EXTENDS, 0);
  }
  SUPER() {
    return this.getToken(ProcessingParser.SUPER, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeArgument;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeArgument ? visitor.visitTypeArgument(this) : visitor.visitChildren(this);
  }
}
class QualifiedNameListContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  qualifiedName_list() {
    return this.getTypedRuleContexts(QualifiedNameContext);
  }
  qualifiedName(i2) {
    return this.getTypedRuleContext(QualifiedNameContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_qualifiedNameList;
  }
  // @Override
  accept(visitor) {
    return visitor.visitQualifiedNameList ? visitor.visitQualifiedNameList(this) : visitor.visitChildren(this);
  }
}
class FormalParametersContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  formalParameterList() {
    return this.getTypedRuleContext(FormalParameterListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_formalParameters;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFormalParameters ? visitor.visitFormalParameters(this) : visitor.visitChildren(this);
  }
}
class FormalParameterListContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  formalParameter_list() {
    return this.getTypedRuleContexts(FormalParameterContext);
  }
  formalParameter(i2) {
    return this.getTypedRuleContext(FormalParameterContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  lastFormalParameter() {
    return this.getTypedRuleContext(LastFormalParameterContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_formalParameterList;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFormalParameterList ? visitor.visitFormalParameterList(this) : visitor.visitChildren(this);
  }
}
class FormalParameterContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  variableDeclaratorId() {
    return this.getTypedRuleContext(VariableDeclaratorIdContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_formalParameter;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFormalParameter ? visitor.visitFormalParameter(this) : visitor.visitChildren(this);
  }
}
class LastFormalParameterContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  ELLIPSIS() {
    return this.getToken(ProcessingParser.ELLIPSIS, 0);
  }
  variableDeclaratorId() {
    return this.getTypedRuleContext(VariableDeclaratorIdContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_lastFormalParameter;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLastFormalParameter ? visitor.visitLastFormalParameter(this) : visitor.visitChildren(this);
  }
}
class BaseStringLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  STRING_LITERAL() {
    return this.getToken(ProcessingParser.STRING_LITERAL, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_baseStringLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitBaseStringLiteral ? visitor.visitBaseStringLiteral(this) : visitor.visitChildren(this);
  }
}
class MultilineStringLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  MULTI_STRING_LIT() {
    return this.getToken(ProcessingParser.MULTI_STRING_LIT, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_multilineStringLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitMultilineStringLiteral ? visitor.visitMultilineStringLiteral(this) : visitor.visitChildren(this);
  }
}
class StringLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  baseStringLiteral() {
    return this.getTypedRuleContext(BaseStringLiteralContext, 0);
  }
  multilineStringLiteral() {
    return this.getTypedRuleContext(MultilineStringLiteralContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_stringLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitStringLiteral ? visitor.visitStringLiteral(this) : visitor.visitChildren(this);
  }
}
class IntegerLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  DECIMAL_LITERAL() {
    return this.getToken(ProcessingParser.DECIMAL_LITERAL, 0);
  }
  HEX_LITERAL() {
    return this.getToken(ProcessingParser.HEX_LITERAL, 0);
  }
  OCT_LITERAL() {
    return this.getToken(ProcessingParser.OCT_LITERAL, 0);
  }
  BINARY_LITERAL() {
    return this.getToken(ProcessingParser.BINARY_LITERAL, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_integerLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitIntegerLiteral ? visitor.visitIntegerLiteral(this) : visitor.visitChildren(this);
  }
}
class FloatLiteralContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  FLOAT_LITERAL() {
    return this.getToken(ProcessingParser.FLOAT_LITERAL, 0);
  }
  HEX_FLOAT_LITERAL() {
    return this.getToken(ProcessingParser.HEX_FLOAT_LITERAL, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_floatLiteral;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFloatLiteral ? visitor.visitFloatLiteral(this) : visitor.visitChildren(this);
  }
}
class AnnotationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  AT() {
    return this.getToken(ProcessingParser.AT, 0);
  }
  qualifiedName() {
    return this.getTypedRuleContext(QualifiedNameContext, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  elementValuePairs() {
    return this.getTypedRuleContext(ElementValuePairsContext, 0);
  }
  elementValue() {
    return this.getTypedRuleContext(ElementValueContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotation;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotation ? visitor.visitAnnotation(this) : visitor.visitChildren(this);
  }
}
class ElementValuePairsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  elementValuePair_list() {
    return this.getTypedRuleContexts(ElementValuePairContext);
  }
  elementValuePair(i2) {
    return this.getTypedRuleContext(ElementValuePairContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_elementValuePairs;
  }
  // @Override
  accept(visitor) {
    return visitor.visitElementValuePairs ? visitor.visitElementValuePairs(this) : visitor.visitChildren(this);
  }
}
class ElementValuePairContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  ASSIGN() {
    return this.getToken(ProcessingParser.ASSIGN, 0);
  }
  elementValue() {
    return this.getTypedRuleContext(ElementValueContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_elementValuePair;
  }
  // @Override
  accept(visitor) {
    return visitor.visitElementValuePair ? visitor.visitElementValuePair(this) : visitor.visitChildren(this);
  }
}
class ElementValueContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  annotation() {
    return this.getTypedRuleContext(AnnotationContext, 0);
  }
  elementValueArrayInitializer() {
    return this.getTypedRuleContext(ElementValueArrayInitializerContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_elementValue;
  }
  // @Override
  accept(visitor) {
    return visitor.visitElementValue ? visitor.visitElementValue(this) : visitor.visitChildren(this);
  }
}
class ElementValueArrayInitializerContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  elementValue_list() {
    return this.getTypedRuleContexts(ElementValueContext);
  }
  elementValue(i2) {
    return this.getTypedRuleContext(ElementValueContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_elementValueArrayInitializer;
  }
  // @Override
  accept(visitor) {
    return visitor.visitElementValueArrayInitializer ? visitor.visitElementValueArrayInitializer(this) : visitor.visitChildren(this);
  }
}
class AnnotationTypeDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  AT() {
    return this.getToken(ProcessingParser.AT, 0);
  }
  INTERFACE() {
    return this.getToken(ProcessingParser.INTERFACE, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  annotationTypeBody() {
    return this.getTypedRuleContext(AnnotationTypeBodyContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationTypeDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationTypeDeclaration ? visitor.visitAnnotationTypeDeclaration(this) : visitor.visitChildren(this);
  }
}
class AnnotationTypeBodyContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  annotationTypeElementDeclaration_list() {
    return this.getTypedRuleContexts(AnnotationTypeElementDeclarationContext);
  }
  annotationTypeElementDeclaration(i2) {
    return this.getTypedRuleContext(AnnotationTypeElementDeclarationContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationTypeBody;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationTypeBody ? visitor.visitAnnotationTypeBody(this) : visitor.visitChildren(this);
  }
}
class AnnotationTypeElementDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  annotationTypeElementRest() {
    return this.getTypedRuleContext(AnnotationTypeElementRestContext, 0);
  }
  modifier_list() {
    return this.getTypedRuleContexts(ModifierContext);
  }
  modifier(i2) {
    return this.getTypedRuleContext(ModifierContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationTypeElementDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationTypeElementDeclaration ? visitor.visitAnnotationTypeElementDeclaration(this) : visitor.visitChildren(this);
  }
}
class AnnotationTypeElementRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  annotationMethodOrConstantRest() {
    return this.getTypedRuleContext(AnnotationMethodOrConstantRestContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  classDeclaration() {
    return this.getTypedRuleContext(ClassDeclarationContext, 0);
  }
  interfaceDeclaration() {
    return this.getTypedRuleContext(InterfaceDeclarationContext, 0);
  }
  enumDeclaration() {
    return this.getTypedRuleContext(EnumDeclarationContext, 0);
  }
  annotationTypeDeclaration() {
    return this.getTypedRuleContext(AnnotationTypeDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationTypeElementRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationTypeElementRest ? visitor.visitAnnotationTypeElementRest(this) : visitor.visitChildren(this);
  }
}
class AnnotationMethodOrConstantRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  annotationMethodRest() {
    return this.getTypedRuleContext(AnnotationMethodRestContext, 0);
  }
  annotationConstantRest() {
    return this.getTypedRuleContext(AnnotationConstantRestContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationMethodOrConstantRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationMethodOrConstantRest ? visitor.visitAnnotationMethodOrConstantRest(this) : visitor.visitChildren(this);
  }
}
class AnnotationMethodRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  defaultValue() {
    return this.getTypedRuleContext(DefaultValueContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationMethodRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationMethodRest ? visitor.visitAnnotationMethodRest(this) : visitor.visitChildren(this);
  }
}
class AnnotationConstantRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  variableDeclarators() {
    return this.getTypedRuleContext(VariableDeclaratorsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_annotationConstantRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitAnnotationConstantRest ? visitor.visitAnnotationConstantRest(this) : visitor.visitChildren(this);
  }
}
class DefaultValueContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  DEFAULT() {
    return this.getToken(ProcessingParser.DEFAULT, 0);
  }
  elementValue() {
    return this.getTypedRuleContext(ElementValueContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_defaultValue;
  }
  // @Override
  accept(visitor) {
    return visitor.visitDefaultValue ? visitor.visitDefaultValue(this) : visitor.visitChildren(this);
  }
}
class BlockContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  blockStatement_list() {
    return this.getTypedRuleContexts(BlockStatementContext);
  }
  blockStatement(i2) {
    return this.getTypedRuleContext(BlockStatementContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_block;
  }
  // @Override
  accept(visitor) {
    return visitor.visitBlock ? visitor.visitBlock(this) : visitor.visitChildren(this);
  }
}
class BlockStatementContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  localVariableDeclaration() {
    return this.getTypedRuleContext(LocalVariableDeclarationContext, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  statement() {
    return this.getTypedRuleContext(StatementContext, 0);
  }
  localTypeDeclaration() {
    return this.getTypedRuleContext(LocalTypeDeclarationContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_blockStatement;
  }
  // @Override
  accept(visitor) {
    return visitor.visitBlockStatement ? visitor.visitBlockStatement(this) : visitor.visitChildren(this);
  }
}
class LocalVariableDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  variableDeclarators() {
    return this.getTypedRuleContext(VariableDeclaratorsContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_localVariableDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLocalVariableDeclaration ? visitor.visitLocalVariableDeclaration(this) : visitor.visitChildren(this);
  }
}
class LocalTypeDeclarationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  classDeclaration() {
    return this.getTypedRuleContext(ClassDeclarationContext, 0);
  }
  interfaceDeclaration() {
    return this.getTypedRuleContext(InterfaceDeclarationContext, 0);
  }
  classOrInterfaceModifier_list() {
    return this.getTypedRuleContexts(ClassOrInterfaceModifierContext);
  }
  classOrInterfaceModifier(i2) {
    return this.getTypedRuleContext(ClassOrInterfaceModifierContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_localTypeDeclaration;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLocalTypeDeclaration ? visitor.visitLocalTypeDeclaration(this) : visitor.visitChildren(this);
  }
}
class StatementContext extends Sn {
  _blockLabel;
  _statementExpression;
  _identifierLabel;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  ASSERT() {
    return this.getToken(ProcessingParser.ASSERT, 0);
  }
  expression_list() {
    return this.getTypedRuleContexts(ExpressionContext);
  }
  expression(i2) {
    return this.getTypedRuleContext(ExpressionContext, i2);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  COLON() {
    return this.getToken(ProcessingParser.COLON, 0);
  }
  IF() {
    return this.getToken(ProcessingParser.IF, 0);
  }
  parExpression() {
    return this.getTypedRuleContext(ParExpressionContext, 0);
  }
  statement_list() {
    return this.getTypedRuleContexts(StatementContext);
  }
  statement(i2) {
    return this.getTypedRuleContext(StatementContext, i2);
  }
  ELSE() {
    return this.getToken(ProcessingParser.ELSE, 0);
  }
  FOR() {
    return this.getToken(ProcessingParser.FOR, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  forControl() {
    return this.getTypedRuleContext(ForControlContext, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  WHILE() {
    return this.getToken(ProcessingParser.WHILE, 0);
  }
  DO() {
    return this.getToken(ProcessingParser.DO, 0);
  }
  TRY() {
    return this.getToken(ProcessingParser.TRY, 0);
  }
  finallyBlock() {
    return this.getTypedRuleContext(FinallyBlockContext, 0);
  }
  catchClause_list() {
    return this.getTypedRuleContexts(CatchClauseContext);
  }
  catchClause(i2) {
    return this.getTypedRuleContext(CatchClauseContext, i2);
  }
  resourceSpecification() {
    return this.getTypedRuleContext(ResourceSpecificationContext, 0);
  }
  SWITCH() {
    return this.getToken(ProcessingParser.SWITCH, 0);
  }
  LBRACE() {
    return this.getToken(ProcessingParser.LBRACE, 0);
  }
  RBRACE() {
    return this.getToken(ProcessingParser.RBRACE, 0);
  }
  switchBlockStatementGroup_list() {
    return this.getTypedRuleContexts(SwitchBlockStatementGroupContext);
  }
  switchBlockStatementGroup(i2) {
    return this.getTypedRuleContext(SwitchBlockStatementGroupContext, i2);
  }
  switchLabel_list() {
    return this.getTypedRuleContexts(SwitchLabelContext);
  }
  switchLabel(i2) {
    return this.getTypedRuleContext(SwitchLabelContext, i2);
  }
  SYNCHRONIZED() {
    return this.getToken(ProcessingParser.SYNCHRONIZED, 0);
  }
  RETURN() {
    return this.getToken(ProcessingParser.RETURN, 0);
  }
  THROW() {
    return this.getToken(ProcessingParser.THROW, 0);
  }
  BREAK() {
    return this.getToken(ProcessingParser.BREAK, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  CONTINUE() {
    return this.getToken(ProcessingParser.CONTINUE, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_statement;
  }
  // @Override
  accept(visitor) {
    return visitor.visitStatement ? visitor.visitStatement(this) : visitor.visitChildren(this);
  }
}
class CatchClauseContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  CATCH() {
    return this.getToken(ProcessingParser.CATCH, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  catchType() {
    return this.getTypedRuleContext(CatchTypeContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_catchClause;
  }
  // @Override
  accept(visitor) {
    return visitor.visitCatchClause ? visitor.visitCatchClause(this) : visitor.visitChildren(this);
  }
}
class CatchTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  qualifiedName_list() {
    return this.getTypedRuleContexts(QualifiedNameContext);
  }
  qualifiedName(i2) {
    return this.getTypedRuleContext(QualifiedNameContext, i2);
  }
  BITOR_list() {
    return this.getTokens(ProcessingParser.BITOR);
  }
  BITOR(i2) {
    return this.getToken(ProcessingParser.BITOR, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_catchType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitCatchType ? visitor.visitCatchType(this) : visitor.visitChildren(this);
  }
}
class FinallyBlockContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  FINALLY() {
    return this.getToken(ProcessingParser.FINALLY, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_finallyBlock;
  }
  // @Override
  accept(visitor) {
    return visitor.visitFinallyBlock ? visitor.visitFinallyBlock(this) : visitor.visitChildren(this);
  }
}
class ResourceSpecificationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  resources() {
    return this.getTypedRuleContext(ResourcesContext, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  SEMI() {
    return this.getToken(ProcessingParser.SEMI, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_resourceSpecification;
  }
  // @Override
  accept(visitor) {
    return visitor.visitResourceSpecification ? visitor.visitResourceSpecification(this) : visitor.visitChildren(this);
  }
}
class ResourcesContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  resource_list() {
    return this.getTypedRuleContexts(ResourceContext);
  }
  resource(i2) {
    return this.getTypedRuleContext(ResourceContext, i2);
  }
  SEMI_list() {
    return this.getTokens(ProcessingParser.SEMI);
  }
  SEMI(i2) {
    return this.getToken(ProcessingParser.SEMI, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_resources;
  }
  // @Override
  accept(visitor) {
    return visitor.visitResources ? visitor.visitResources(this) : visitor.visitChildren(this);
  }
}
class ResourceContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  classOrInterfaceType() {
    return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0);
  }
  variableDeclaratorId() {
    return this.getTypedRuleContext(VariableDeclaratorIdContext, 0);
  }
  ASSIGN() {
    return this.getToken(ProcessingParser.ASSIGN, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_resource;
  }
  // @Override
  accept(visitor) {
    return visitor.visitResource ? visitor.visitResource(this) : visitor.visitChildren(this);
  }
}
class SwitchBlockStatementGroupContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  switchLabel_list() {
    return this.getTypedRuleContexts(SwitchLabelContext);
  }
  switchLabel(i2) {
    return this.getTypedRuleContext(SwitchLabelContext, i2);
  }
  blockStatement_list() {
    return this.getTypedRuleContexts(BlockStatementContext);
  }
  blockStatement(i2) {
    return this.getTypedRuleContext(BlockStatementContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_switchBlockStatementGroup;
  }
  // @Override
  accept(visitor) {
    return visitor.visitSwitchBlockStatementGroup ? visitor.visitSwitchBlockStatementGroup(this) : visitor.visitChildren(this);
  }
}
class SwitchLabelContext extends Sn {
  _constantExpression;
  _enumConstantName;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  CASE() {
    return this.getToken(ProcessingParser.CASE, 0);
  }
  COLON() {
    return this.getToken(ProcessingParser.COLON, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  DEFAULT() {
    return this.getToken(ProcessingParser.DEFAULT, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_switchLabel;
  }
  // @Override
  accept(visitor) {
    return visitor.visitSwitchLabel ? visitor.visitSwitchLabel(this) : visitor.visitChildren(this);
  }
}
class ForControlContext extends Sn {
  _forUpdate;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  enhancedForControl() {
    return this.getTypedRuleContext(EnhancedForControlContext, 0);
  }
  SEMI_list() {
    return this.getTokens(ProcessingParser.SEMI);
  }
  SEMI(i2) {
    return this.getToken(ProcessingParser.SEMI, i2);
  }
  forInit() {
    return this.getTypedRuleContext(ForInitContext, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  expressionList() {
    return this.getTypedRuleContext(ExpressionListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_forControl;
  }
  // @Override
  accept(visitor) {
    return visitor.visitForControl ? visitor.visitForControl(this) : visitor.visitChildren(this);
  }
}
class ForInitContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  localVariableDeclaration() {
    return this.getTypedRuleContext(LocalVariableDeclarationContext, 0);
  }
  expressionList() {
    return this.getTypedRuleContext(ExpressionListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_forInit;
  }
  // @Override
  accept(visitor) {
    return visitor.visitForInit ? visitor.visitForInit(this) : visitor.visitChildren(this);
  }
}
class EnhancedForControlContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  variableDeclaratorId() {
    return this.getTypedRuleContext(VariableDeclaratorIdContext, 0);
  }
  COLON() {
    return this.getToken(ProcessingParser.COLON, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  variableModifier_list() {
    return this.getTypedRuleContexts(VariableModifierContext);
  }
  variableModifier(i2) {
    return this.getTypedRuleContext(VariableModifierContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_enhancedForControl;
  }
  // @Override
  accept(visitor) {
    return visitor.visitEnhancedForControl ? visitor.visitEnhancedForControl(this) : visitor.visitChildren(this);
  }
}
class ParExpressionContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_parExpression;
  }
  // @Override
  accept(visitor) {
    return visitor.visitParExpression ? visitor.visitParExpression(this) : visitor.visitChildren(this);
  }
}
class ExpressionListContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  expression_list() {
    return this.getTypedRuleContexts(ExpressionContext);
  }
  expression(i2) {
    return this.getTypedRuleContext(ExpressionContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_expressionList;
  }
  // @Override
  accept(visitor) {
    return visitor.visitExpressionList ? visitor.visitExpressionList(this) : visitor.visitChildren(this);
  }
}
class ExpressionContext extends Sn {
  _prefix;
  _bop;
  _postfix;
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  primary() {
    return this.getTypedRuleContext(PrimaryContext, 0);
  }
  methodCall() {
    return this.getTypedRuleContext(MethodCallContext, 0);
  }
  NEW() {
    return this.getToken(ProcessingParser.NEW, 0);
  }
  creator() {
    return this.getTypedRuleContext(CreatorContext, 0);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  typeType() {
    return this.getTypedRuleContext(TypeTypeContext, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  expression_list() {
    return this.getTypedRuleContexts(ExpressionContext);
  }
  expression(i2) {
    return this.getTypedRuleContext(ExpressionContext, i2);
  }
  ADD() {
    return this.getToken(ProcessingParser.ADD, 0);
  }
  SUB() {
    return this.getToken(ProcessingParser.SUB, 0);
  }
  INC() {
    return this.getToken(ProcessingParser.INC, 0);
  }
  DEC() {
    return this.getToken(ProcessingParser.DEC, 0);
  }
  TILDE() {
    return this.getToken(ProcessingParser.TILDE, 0);
  }
  BANG() {
    return this.getToken(ProcessingParser.BANG, 0);
  }
  lambdaExpression() {
    return this.getTypedRuleContext(LambdaExpressionContext, 0);
  }
  COLONCOLON() {
    return this.getToken(ProcessingParser.COLONCOLON, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  typeArguments() {
    return this.getTypedRuleContext(TypeArgumentsContext, 0);
  }
  classType() {
    return this.getTypedRuleContext(ClassTypeContext, 0);
  }
  MUL() {
    return this.getToken(ProcessingParser.MUL, 0);
  }
  DIV() {
    return this.getToken(ProcessingParser.DIV, 0);
  }
  MOD() {
    return this.getToken(ProcessingParser.MOD, 0);
  }
  LT_list() {
    return this.getTokens(ProcessingParser.LT);
  }
  LT(i2) {
    return this.getToken(ProcessingParser.LT, i2);
  }
  GT_list() {
    return this.getTokens(ProcessingParser.GT);
  }
  GT(i2) {
    return this.getToken(ProcessingParser.GT, i2);
  }
  LE() {
    return this.getToken(ProcessingParser.LE, 0);
  }
  GE() {
    return this.getToken(ProcessingParser.GE, 0);
  }
  EQUAL() {
    return this.getToken(ProcessingParser.EQUAL, 0);
  }
  NOTEQUAL() {
    return this.getToken(ProcessingParser.NOTEQUAL, 0);
  }
  BITAND() {
    return this.getToken(ProcessingParser.BITAND, 0);
  }
  CARET() {
    return this.getToken(ProcessingParser.CARET, 0);
  }
  BITOR() {
    return this.getToken(ProcessingParser.BITOR, 0);
  }
  AND() {
    return this.getToken(ProcessingParser.AND, 0);
  }
  OR() {
    return this.getToken(ProcessingParser.OR, 0);
  }
  COLON() {
    return this.getToken(ProcessingParser.COLON, 0);
  }
  QUESTION() {
    return this.getToken(ProcessingParser.QUESTION, 0);
  }
  ASSIGN() {
    return this.getToken(ProcessingParser.ASSIGN, 0);
  }
  ADD_ASSIGN() {
    return this.getToken(ProcessingParser.ADD_ASSIGN, 0);
  }
  SUB_ASSIGN() {
    return this.getToken(ProcessingParser.SUB_ASSIGN, 0);
  }
  MUL_ASSIGN() {
    return this.getToken(ProcessingParser.MUL_ASSIGN, 0);
  }
  DIV_ASSIGN() {
    return this.getToken(ProcessingParser.DIV_ASSIGN, 0);
  }
  AND_ASSIGN() {
    return this.getToken(ProcessingParser.AND_ASSIGN, 0);
  }
  OR_ASSIGN() {
    return this.getToken(ProcessingParser.OR_ASSIGN, 0);
  }
  XOR_ASSIGN() {
    return this.getToken(ProcessingParser.XOR_ASSIGN, 0);
  }
  RSHIFT_ASSIGN() {
    return this.getToken(ProcessingParser.RSHIFT_ASSIGN, 0);
  }
  URSHIFT_ASSIGN() {
    return this.getToken(ProcessingParser.URSHIFT_ASSIGN, 0);
  }
  LSHIFT_ASSIGN() {
    return this.getToken(ProcessingParser.LSHIFT_ASSIGN, 0);
  }
  MOD_ASSIGN() {
    return this.getToken(ProcessingParser.MOD_ASSIGN, 0);
  }
  DOT() {
    return this.getToken(ProcessingParser.DOT, 0);
  }
  THIS() {
    return this.getToken(ProcessingParser.THIS, 0);
  }
  innerCreator() {
    return this.getTypedRuleContext(InnerCreatorContext, 0);
  }
  SUPER() {
    return this.getToken(ProcessingParser.SUPER, 0);
  }
  superSuffix() {
    return this.getTypedRuleContext(SuperSuffixContext, 0);
  }
  explicitGenericInvocation() {
    return this.getTypedRuleContext(ExplicitGenericInvocationContext, 0);
  }
  nonWildcardTypeArguments() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0);
  }
  LBRACK() {
    return this.getToken(ProcessingParser.LBRACK, 0);
  }
  RBRACK() {
    return this.getToken(ProcessingParser.RBRACK, 0);
  }
  INSTANCEOF() {
    return this.getToken(ProcessingParser.INSTANCEOF, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_expression;
  }
  // @Override
  accept(visitor) {
    return visitor.visitExpression ? visitor.visitExpression(this) : visitor.visitChildren(this);
  }
}
class LambdaExpressionContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  lambdaParameters() {
    return this.getTypedRuleContext(LambdaParametersContext, 0);
  }
  ARROW() {
    return this.getToken(ProcessingParser.ARROW, 0);
  }
  lambdaBody() {
    return this.getTypedRuleContext(LambdaBodyContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_lambdaExpression;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLambdaExpression ? visitor.visitLambdaExpression(this) : visitor.visitChildren(this);
  }
}
class LambdaParametersContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER_list() {
    return this.getTokens(ProcessingParser.IDENTIFIER);
  }
  IDENTIFIER(i2) {
    return this.getToken(ProcessingParser.IDENTIFIER, i2);
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  formalParameterList() {
    return this.getTypedRuleContext(FormalParameterListContext, 0);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_lambdaParameters;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLambdaParameters ? visitor.visitLambdaParameters(this) : visitor.visitChildren(this);
  }
}
class LambdaBodyContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_lambdaBody;
  }
  // @Override
  accept(visitor) {
    return visitor.visitLambdaBody ? visitor.visitLambdaBody(this) : visitor.visitChildren(this);
  }
}
class PrimaryContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  expression() {
    return this.getTypedRuleContext(ExpressionContext, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  THIS() {
    return this.getToken(ProcessingParser.THIS, 0);
  }
  SUPER() {
    return this.getToken(ProcessingParser.SUPER, 0);
  }
  literal() {
    return this.getTypedRuleContext(LiteralContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  typeTypeOrVoid() {
    return this.getTypedRuleContext(TypeTypeOrVoidContext, 0);
  }
  DOT() {
    return this.getToken(ProcessingParser.DOT, 0);
  }
  CLASS() {
    return this.getToken(ProcessingParser.CLASS, 0);
  }
  nonWildcardTypeArguments() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0);
  }
  explicitGenericInvocationSuffix() {
    return this.getTypedRuleContext(ExplicitGenericInvocationSuffixContext, 0);
  }
  arguments() {
    return this.getTypedRuleContext(ArgumentsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_primary;
  }
  // @Override
  accept(visitor) {
    return visitor.visitPrimary ? visitor.visitPrimary(this) : visitor.visitChildren(this);
  }
}
class ClassTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  classOrInterfaceType() {
    return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0);
  }
  DOT() {
    return this.getToken(ProcessingParser.DOT, 0);
  }
  annotation_list() {
    return this.getTypedRuleContexts(AnnotationContext);
  }
  annotation(i2) {
    return this.getTypedRuleContext(AnnotationContext, i2);
  }
  typeArguments() {
    return this.getTypedRuleContext(TypeArgumentsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassType ? visitor.visitClassType(this) : visitor.visitChildren(this);
  }
}
class CreatorContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  nonWildcardTypeArguments() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0);
  }
  createdName() {
    return this.getTypedRuleContext(CreatedNameContext, 0);
  }
  classCreatorRest() {
    return this.getTypedRuleContext(ClassCreatorRestContext, 0);
  }
  arrayCreatorRest() {
    return this.getTypedRuleContext(ArrayCreatorRestContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_creator;
  }
  // @Override
  accept(visitor) {
    return visitor.visitCreator ? visitor.visitCreator(this) : visitor.visitChildren(this);
  }
}
class CreatedNameContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER_list() {
    return this.getTokens(ProcessingParser.IDENTIFIER);
  }
  IDENTIFIER(i2) {
    return this.getToken(ProcessingParser.IDENTIFIER, i2);
  }
  typeArgumentsOrDiamond_list() {
    return this.getTypedRuleContexts(TypeArgumentsOrDiamondContext);
  }
  typeArgumentsOrDiamond(i2) {
    return this.getTypedRuleContext(TypeArgumentsOrDiamondContext, i2);
  }
  DOT_list() {
    return this.getTokens(ProcessingParser.DOT);
  }
  DOT(i2) {
    return this.getToken(ProcessingParser.DOT, i2);
  }
  primitiveType() {
    return this.getTypedRuleContext(PrimitiveTypeContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_createdName;
  }
  // @Override
  accept(visitor) {
    return visitor.visitCreatedName ? visitor.visitCreatedName(this) : visitor.visitChildren(this);
  }
}
class InnerCreatorContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  classCreatorRest() {
    return this.getTypedRuleContext(ClassCreatorRestContext, 0);
  }
  nonWildcardTypeArgumentsOrDiamond() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsOrDiamondContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_innerCreator;
  }
  // @Override
  accept(visitor) {
    return visitor.visitInnerCreator ? visitor.visitInnerCreator(this) : visitor.visitChildren(this);
  }
}
class ArrayCreatorRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  arrayInitializer() {
    return this.getTypedRuleContext(ArrayInitializerContext, 0);
  }
  expression_list() {
    return this.getTypedRuleContexts(ExpressionContext);
  }
  expression(i2) {
    return this.getTypedRuleContext(ExpressionContext, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_arrayCreatorRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitArrayCreatorRest ? visitor.visitArrayCreatorRest(this) : visitor.visitChildren(this);
  }
}
class ClassCreatorRestContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  arguments() {
    return this.getTypedRuleContext(ArgumentsContext, 0);
  }
  classBody() {
    return this.getTypedRuleContext(ClassBodyContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_classCreatorRest;
  }
  // @Override
  accept(visitor) {
    return visitor.visitClassCreatorRest ? visitor.visitClassCreatorRest(this) : visitor.visitChildren(this);
  }
}
class ExplicitGenericInvocationContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  nonWildcardTypeArguments() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0);
  }
  explicitGenericInvocationSuffix() {
    return this.getTypedRuleContext(ExplicitGenericInvocationSuffixContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_explicitGenericInvocation;
  }
  // @Override
  accept(visitor) {
    return visitor.visitExplicitGenericInvocation ? visitor.visitExplicitGenericInvocation(this) : visitor.visitChildren(this);
  }
}
class TypeArgumentsOrDiamondContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LT() {
    return this.getToken(ProcessingParser.LT, 0);
  }
  GT() {
    return this.getToken(ProcessingParser.GT, 0);
  }
  typeArguments() {
    return this.getTypedRuleContext(TypeArgumentsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeArgumentsOrDiamond;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeArgumentsOrDiamond ? visitor.visitTypeArgumentsOrDiamond(this) : visitor.visitChildren(this);
  }
}
class NonWildcardTypeArgumentsOrDiamondContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LT() {
    return this.getToken(ProcessingParser.LT, 0);
  }
  GT() {
    return this.getToken(ProcessingParser.GT, 0);
  }
  nonWildcardTypeArguments() {
    return this.getTypedRuleContext(NonWildcardTypeArgumentsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_nonWildcardTypeArgumentsOrDiamond;
  }
  // @Override
  accept(visitor) {
    return visitor.visitNonWildcardTypeArgumentsOrDiamond ? visitor.visitNonWildcardTypeArgumentsOrDiamond(this) : visitor.visitChildren(this);
  }
}
class NonWildcardTypeArgumentsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LT() {
    return this.getToken(ProcessingParser.LT, 0);
  }
  typeList() {
    return this.getTypedRuleContext(TypeListContext, 0);
  }
  GT() {
    return this.getToken(ProcessingParser.GT, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_nonWildcardTypeArguments;
  }
  // @Override
  accept(visitor) {
    return visitor.visitNonWildcardTypeArguments ? visitor.visitNonWildcardTypeArguments(this) : visitor.visitChildren(this);
  }
}
class TypeListContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  typeType_list() {
    return this.getTypedRuleContexts(TypeTypeContext);
  }
  typeType(i2) {
    return this.getTypedRuleContext(TypeTypeContext, i2);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeList;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeList ? visitor.visitTypeList(this) : visitor.visitChildren(this);
  }
}
class TypeTypeContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  classOrInterfaceType() {
    return this.getTypedRuleContext(ClassOrInterfaceTypeContext, 0);
  }
  primitiveType() {
    return this.getTypedRuleContext(PrimitiveTypeContext, 0);
  }
  VAR() {
    return this.getToken(ProcessingParser.VAR, 0);
  }
  annotation() {
    return this.getTypedRuleContext(AnnotationContext, 0);
  }
  LBRACK_list() {
    return this.getTokens(ProcessingParser.LBRACK);
  }
  LBRACK(i2) {
    return this.getToken(ProcessingParser.LBRACK, i2);
  }
  RBRACK_list() {
    return this.getTokens(ProcessingParser.RBRACK);
  }
  RBRACK(i2) {
    return this.getToken(ProcessingParser.RBRACK, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeType;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeType ? visitor.visitTypeType(this) : visitor.visitChildren(this);
  }
}
class TypeArgumentsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LT() {
    return this.getToken(ProcessingParser.LT, 0);
  }
  typeArgument_list() {
    return this.getTypedRuleContexts(TypeArgumentContext);
  }
  typeArgument(i2) {
    return this.getTypedRuleContext(TypeArgumentContext, i2);
  }
  GT() {
    return this.getToken(ProcessingParser.GT, 0);
  }
  COMMA_list() {
    return this.getTokens(ProcessingParser.COMMA);
  }
  COMMA(i2) {
    return this.getToken(ProcessingParser.COMMA, i2);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_typeArguments;
  }
  // @Override
  accept(visitor) {
    return visitor.visitTypeArguments ? visitor.visitTypeArguments(this) : visitor.visitChildren(this);
  }
}
class SuperSuffixContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  arguments() {
    return this.getTypedRuleContext(ArgumentsContext, 0);
  }
  DOT() {
    return this.getToken(ProcessingParser.DOT, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_superSuffix;
  }
  // @Override
  accept(visitor) {
    return visitor.visitSuperSuffix ? visitor.visitSuperSuffix(this) : visitor.visitChildren(this);
  }
}
class ExplicitGenericInvocationSuffixContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  SUPER() {
    return this.getToken(ProcessingParser.SUPER, 0);
  }
  superSuffix() {
    return this.getTypedRuleContext(SuperSuffixContext, 0);
  }
  IDENTIFIER() {
    return this.getToken(ProcessingParser.IDENTIFIER, 0);
  }
  arguments() {
    return this.getTypedRuleContext(ArgumentsContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_explicitGenericInvocationSuffix;
  }
  // @Override
  accept(visitor) {
    return visitor.visitExplicitGenericInvocationSuffix ? visitor.visitExplicitGenericInvocationSuffix(this) : visitor.visitChildren(this);
  }
}
class ArgumentsContext extends Sn {
  constructor(parser, parent, invokingState) {
    super(parent, invokingState), this.parser = parser;
  }
  LPAREN() {
    return this.getToken(ProcessingParser.LPAREN, 0);
  }
  RPAREN() {
    return this.getToken(ProcessingParser.RPAREN, 0);
  }
  expressionList() {
    return this.getTypedRuleContext(ExpressionListContext, 0);
  }
  get ruleIndex() {
    return ProcessingParser.RULE_arguments;
  }
  // @Override
  accept(visitor) {
    return visitor.visitArguments ? visitor.visitArguments(this) : visitor.visitChildren(this);
  }
}
class PConstants {
  X = 0;
  Y = 1;
  Z = 2;
  JAVA2D = "processing.awt.PGraphicsJava2D";
  P2D = "processing.opengl.PGraphics2D";
  P3D = "processing.opengl.PGraphics3D";
  /**
   * @deprecated Use PConstants.P3D instead
   */
  OPENGL = this.P3D;
  FX2D = "processing.javafx.PGraphicsFX2D";
  PDF = "processing.pdf.PGraphicsPDF";
  SVG = "processing.svg.PGraphicsSVG";
  DXF = "processing.dxf.RawDXF";
  OTHER = 0;
  WINDOWS = 1;
  MACOS = 2;
  LINUX = 3;
  /** @deprecated Marketers gonna market, use `MACOS` */
  MACOSX = 2;
  platformNames = [
    "other",
    "windows",
    "macos",
    "linux"
  ];
  EPSILON = 1e-4;
  MAX_FLOAT = Number.MAX_VALUE;
  MIN_FLOAT = -Number.MAX_VALUE;
  MAX_INT = Number.MAX_SAFE_INTEGER;
  MIN_INT = Number.MIN_SAFE_INTEGER;
  VERTEX = 0;
  BEZIER_VERTEX = 1;
  QUADRATIC_VERTEX = 2;
  CURVE_VERTEX = 3;
  BREAK = 4;
  /**@deprecated*/
  QUAD_BEZIER_VERTEX = 2;
  PI = Math.PI;
  HALF_PI = Math.PI / 2;
  THIRD_PI = Math.PI / 3;
  QUARTER_PI = Math.PI / 4;
  TWO_PI = 2 * Math.PI;
  TAU = 2 * Math.PI;
  DEG_TO_RAD = this.PI / 180;
  RAD_TO_DEG = 180 / this.PI;
  WHITESPACE = ` 	
\r\f `;
  RGB = 1;
  // image & color
  ARGB = 2;
  // image
  HSB = 3;
  // color
  ALPHA = 4;
  // image
  TIFF = 0;
  TARGA = 1;
  JPEG = 2;
  GIF = 3;
  BLUR = 11;
  GRAY = 12;
  INVERT = 13;
  OPAQUE = 14;
  POSTERIZE = 15;
  THRESHOLD = 16;
  ERODE = 17;
  DILATE = 18;
  REPLACE = 0;
  BLEND = 1;
  ADD = 2;
  SUBTRACT = 4;
  LIGHTEST = 8;
  DARKEST = 16;
  DIFFERENCE = 32;
  EXCLUSION = 64;
  MULTIPLY = 128;
  SCREEN = 256;
  OVERLAY = 512;
  HARD_LIGHT = 1024;
  SOFT_LIGHT = 2048;
  DODGE = 4096;
  BURN = 8192;
  CHATTER = 0;
  COMPLAINT = 1;
  PROBLEM = 2;
  PROJECTION = 0;
  MODELVIEW = 1;
  CUSTOM = 0;
  // user-specified fanciness
  ORTHOGRAPHIC = 2;
  // 2D isometric projection
  PERSPECTIVE = 3;
  // perspective matrix
  GROUP = 0;
  // createShape()
  POINT = 2;
  // primitive
  POINTS = 3;
  // vertices
  LINE = 4;
  // primitive
  LINES = 5;
  // beginShape(), createShape()
  LINE_STRIP = 50;
  // beginShape()
  LINE_LOOP = 51;
  TRIANGLE = 8;
  // primitive
  TRIANGLES = 9;
  // vertices
  TRIANGLE_STRIP = 10;
  // vertices
  TRIANGLE_FAN = 11;
  // vertices
  QUAD = 16;
  // primitive
  QUADS = 17;
  // vertices
  QUAD_STRIP = 18;
  // vertices
  POLYGON = 20;
  // in the end, probably cannot
  PATH = 21;
  // separate these two
  RECT = 30;
  // primitive
  ELLIPSE = 31;
  // primitive
  ARC = 32;
  // primitive
  SPHERE = 40;
  // primitive
  BOX = 41;
  // primitive
  OPEN = 1;
  CLOSE = 2;
  /** Draw mode convention to use (x, y) to (width, height) */
  CORNER = 0;
  /** Draw mode convention to use (x1, y1) to (x2, y2) coordinates */
  CORNERS = 1;
  /** Draw mode from the center, and using the radius */
  RADIUS = 2;
  /**
   * Draw from the center, using second pair of values as the diameter.
   * Formerly called CENTER_DIAMETER in alpha releases.
   */
  CENTER = 3;
  /**
   * Synonym for the CENTER constant. Draw from the center,
   * using second pair of values as the diameter.
   */
  DIAMETER = 3;
  // arc drawing modes
  //static final int OPEN = 1;  // shared
  CHORD = 2;
  PIE = 3;
  // vertically alignment modes for text
  /** Default vertical alignment for text placement */
  BASELINE = 0;
  /** Align text to the top */
  TOP = 101;
  /** Align text from the bottom, using the baseline. */
  BOTTOM = 102;
  // uv texture orientation modes
  /** texture coordinates in 0..1 range */
  NORMAL = 1;
  /** texture coordinates based on image width/height */
  IMAGE = 2;
  // texture wrapping modes
  /** textures are clamped to their edges */
  CLAMP = 0;
  REPEAT = 1;
  // text placement modes
  /**
   * textMode(MODEL) is the default, meaning that characters
   * will be affected by transformations like any other shapes.
   * <p/>
   * Changed value in 0093 to not interfere with LEFT, CENTER, and RIGHT.
   */
  MODEL = 4;
  SHAPE = 5;
  // text alignment modes
  // are inherited from LEFT, CENTER, RIGHT
  // stroke modes
  SQUARE = 1;
  // called 'butt' in the svg spec
  ROUND = 2;
  PROJECT = 4;
  // called 'square' in the svg spec
  MITER = 8;
  BEVEL = 32;
  // lighting
  AMBIENT = 0;
  DIRECTIONAL = 1;
  //static final int POINT  = 2;  // shared with shape feature
  SPOT = 3;
  // key constants
  // only including the most-used of these guys
  // if people need more esoteric keys, they can learn about
  // the esoteric java KeyEvent api and of virtual keys
  // both key and keyCode will equal these values
  // for 0125, these were changed to 'char' values, because they
  // can be upgraded to ints automatically by Java, but having them
  // as ints prevented split(blah, TAB) from working
  BACKSPACE = 8;
  TAB = 9;
  ENTER = 10;
  RETURN = 13;
  ESC = 27;
  DELETE = 127;
  // i.e. if ((key == CODED) && (keyCode == UP))
  CODED = 65535;
  // key will be CODED and keyCode will be this value
  UP = 38;
  DOWN = 40;
  LEFT = 37;
  RIGHT = 39;
  // key will be CODED and keyCode will be this value
  ALT = 18;
  CONTROL = 17;
  SHIFT = 16;
  // orientations (only used on Android, ignored on desktop)
  /** Screen orientation constant for portrait (the hamburger way). */
  PORTRAIT = 1;
  /** Screen orientation constant for landscape (the hot dog way). */
  LANDSCAPE = 2;
  /** Use with fullScreen() to indicate all available displays. */
  SPAN = 0;
  // cursor types
  ARROW = "default";
  CROSS = "crosshair";
  HAND = "grab";
  MOVE = "move";
  TEXT = "text";
  WAIT = "progress";
  // hints - hint values are positive for the alternate version,
  // negative of the same value returns to the normal/default state
  /**@deprecated*/
  ENABLE_NATIVE_FONTS = 1;
  /**@deprecated*/
  DISABLE_NATIVE_FONTS = -1;
  DISABLE_DEPTH_TEST = 2;
  ENABLE_DEPTH_TEST = -2;
  ENABLE_DEPTH_SORT = 3;
  DISABLE_DEPTH_SORT = -3;
  DISABLE_OPENGL_ERRORS = 4;
  ENABLE_OPENGL_ERRORS = -4;
  DISABLE_DEPTH_MASK = 5;
  ENABLE_DEPTH_MASK = -5;
  DISABLE_OPTIMIZED_STROKE = 6;
  ENABLE_OPTIMIZED_STROKE = -6;
  ENABLE_STROKE_PERSPECTIVE = 7;
  DISABLE_STROKE_PERSPECTIVE = -7;
  DISABLE_TEXTURE_MIPMAPS = 8;
  ENABLE_TEXTURE_MIPMAPS = -8;
  ENABLE_STROKE_PURE = 9;
  DISABLE_STROKE_PURE = -9;
  ENABLE_BUFFER_READING = 10;
  DISABLE_BUFFER_READING = -10;
  DISABLE_KEY_REPEAT = 11;
  ENABLE_KEY_REPEAT = -11;
  DISABLE_ASYNC_SAVEFRAME = 12;
  ENABLE_ASYNC_SAVEFRAME = -12;
  HINT_COUNT = 13;
}
class PImage extends PConstants {
  texture = null;
  width = 0;
  height = 0;
  parent;
  pixels = [];
  __pixel_modified__ = !1;
  constructor(parent, settings) {
    if (super(), this.parent = parent, settings) {
      const l2 = settings.width * settings.height;
      this.pixels = new Proxy(
        settings.pixels.length < l2 ? settings.pixels.concat(new Array(l2 - settings.pixels.length).fill(4278190080)) : settings.pixels.length > l2 ? settings.pixels.slice(0, l2) : settings.pixels,
        {
          set: (t2, p2, n2, r2) => (this.__pixel_modified__ = !0, Reflect.set(t2, p2, n2, r2))
        }
      ), this.width = settings.width, this.height = settings.height, this.updatePixels();
    }
  }
  async load_from_arraybuffer(buffer) {
    const blob = new Blob([buffer], { type: "image/png" });
    await this.load_from_blob(blob);
  }
  async load_from_blob(blob) {
    const bmp = await createImageBitmap(blob);
    this.texture = Texture.from(bmp), this.texture.noFrame = !1, this.width = this.texture.frame.width, this.height = this.texture.frame.height, this.__pixel_modified__ || this.loadPixels();
  }
  loadPixels() {
    if (this.texture) {
      const px = this.parent.__app__.renderer.extract.pixels({ target: this.texture }).pixels, data = new Array(px.length / 4).fill(0).map((v2, i2) => px[i2 * 4 + 3] << 24 | px[i2 * 4 + 2] << 16 | px[i2 * 4 + 1] << 8 | px[i2 * 4]);
      this.pixels = new Proxy(data, {
        set: (t2, p2, n2, r2) => (this.__pixel_modified__ = !0, Reflect.set(t2, p2, n2, r2))
      }), this.__pixel_modified__ = !1;
    }
  }
  updatePixels() {
    if (this.pixels.length > 0) {
      const data = new Uint8Array(this.pixels.length * 4);
      this.pixels.forEach((v2, i2) => {
        data[i2 * 4] = v2 & 255, data[i2 * 4 + 1] = v2 >> 8 & 255, data[i2 * 4 + 2] = v2 >> 16 & 255, data[i2 * 4 + 3] = v2 >>> 24;
      }), console.log(btoa(String.fromCharCode(...convert$1(this.width, this.height, data)))), this.load_from_blob(new Blob([convert$1(this.width, this.height, data)], { type: "image/bmp" })), this.__pixel_modified__ = !1;
    }
  }
  get(x2, y2) {
    return this.pixels[y2 * this.width + x2];
  }
}
const BMP_HEADER_BASE64 = "Qk0AAAAAAAAAAHoAAABsAAAAAAAAAAAAAAABACAAAwAAAAAAAADDDgAAww4AAAAAAAAAAAAA/wAAAAD/AAAAAP8AAAAA/0JHUnM", BMP_HEADER = Uint8Array.from(atob(BMP_HEADER_BASE64), (c2) => c2.charCodeAt(0)), BMP_HEADER_LENGTH = 122, BMP_FILESIZE_OFFSET = 2, BMP_WIDTH_OFFSET = 18, BMP_HEIGHT_OFFSET = 22, BMP_IMAGESIZE_OFFSET = 34, BMP_RED_BITFIELDS_OFFSET = 54, BMP_GREEN_BITFIELDS_OFFSET = 62, IS_WIN = "navigator" in globalThis && /Trident|Edge/.test(navigator.userAgent), convert$1 = (width, height, data, _options) => {
  const options = Object.assign({ strict: !1 }, _options), dataLength = data.byteLength, fileSize = BMP_HEADER_LENGTH + dataLength, uint8Array = new Uint8Array(fileSize), dataView = new DataView(uint8Array.buffer), setUint32 = (offset, value) => dataView.setUint32(offset, value, !0);
  if (uint8Array.set(BMP_HEADER), setUint32(BMP_FILESIZE_OFFSET, fileSize), setUint32(BMP_WIDTH_OFFSET, width), setUint32(BMP_HEIGHT_OFFSET, -height), setUint32(BMP_IMAGESIZE_OFFSET, dataLength), uint8Array.set(data, BMP_HEADER_LENGTH), options.strict || IS_WIN) {
    setUint32(BMP_RED_BITFIELDS_OFFSET, 16711680), setUint32(BMP_GREEN_BITFIELDS_OFFSET, 255);
    for (let offset = 0; offset < dataLength; offset += 4)
      uint8Array[BMP_HEADER_LENGTH + offset] = data[offset + 2], uint8Array[BMP_HEADER_LENGTH + 2 + offset] = data[offset];
  }
  return uint8Array;
}, chars = "abcdefghijklmnopqrstuvwxyz0123456789";
class PFont {
  id = "";
  name;
  constructor(name) {
    for (let i2 = 0; i2 < 12; i2++)
      this.id += chars.charAt(Math.floor(Math.random() * chars.length));
    this.name = name;
  }
  clone() {
    const f2 = new PFont(this.name);
    return f2.id = this.id.slice(), f2;
  }
}
class PGraphicsContext {
  style_buffer = [];
  texture_cache = /* @__PURE__ */ new Map();
  font_cache = /* @__PURE__ */ new Map();
  text_style;
  stroke_style;
  fill_style;
  color_mode = { mode: 1, X: 255, Y: 255, Z: 255, A: 255 };
  current_font;
  rect_mode = 0;
  ellipse_mode = 3;
  image_mode = 0;
  shape_buffer = null;
  shape_mode = 0;
  fill_enabled = !0;
  stroke_enabled = !0;
  graphics;
  canvas = null;
  constructor() {
    this.text_style = new TextStyle({ fontFamily: "Arial", fontSize: 12, fill: "#000000", align: "left" }), this.stroke_style = { width: 1, color: 0, cap: "round", join: "round", miterLimit: 10 }, this.fill_style = { color: 16777215 }, this.graphics = new Graphics(), this.current_font = this.createFont("Arial", 12);
  }
  textAlign(align) {
    let text_align = "left";
    switch (align) {
      case 37:
        text_align = "left";
        break;
      case 3:
        text_align = "center";
        break;
      case 39:
        text_align = "right";
        break;
      default:
        console.warn("Unknown text mode: " + align);
        break;
    }
    this.text_style.align = text_align;
  }
  textSize(size) {
    this.text_style.fontSize = size;
    const key = `name:${this.current_font.name},size:${size}`;
    this.font_cache.has(key) ? this.current_font = this.font_cache.get(key) : this.font_cache.set(key, this.createFont(this.current_font.name, size));
  }
  createFont(name, size) {
    const key = `name:${name},size:${size}`;
    if (this.font_cache.has(key))
      return this.font_cache.get(key).clone();
    const font = new PFont(name);
    return this.font_cache.set(key, font), BitmapFont.install({
      name: font.id,
      style: {
        fontFamily: name,
        fontSize: size,
        fill: 16777215
      }
    }), font;
  }
  textFont(font) {
    this.current_font = font;
  }
  colorMode(mode) {
    this.color_mode.mode = mode;
  }
  fill(r2, g2, b2, a2) {
    this.fill_enabled = !0, this.fill_style.color = this.color_mode.mode == 1 ? { r: r2, g: g2, b: b2, a: a2 } : { h: r2, s: g2, v: b2, a: a2 };
  }
  noFill() {
    this.fill_enabled = !1;
  }
  stroke(r2, g2, b2, a2) {
    this.stroke_enabled = !0, this.stroke_style.color = this.color_mode.mode == 1 ? { r: r2, g: g2, b: b2, a: a2 } : { h: r2, s: g2, v: b2, a: a2 };
  }
  noStroke() {
    this.stroke_enabled = !1;
  }
  strokeWeight(weight) {
    this.stroke_style.width = weight;
  }
  rectMode(mode) {
    this.rect_mode = mode;
  }
  ellipseMode(mode) {
    this.ellipse_mode = mode;
  }
  imageMode(mode) {
    this.image_mode = mode;
  }
  applySettings() {
    this.graphics.fill(this.fill_enabled ? this.fill_style : { color: 0, alpha: 0 }), this.graphics.stroke(this.stroke_enabled ? this.stroke_style : { color: 0, alpha: 0 });
  }
  encodeStyles() {
    return {
      text: {
        style: this.text_style.clone(),
        font: this.current_font.clone()
      },
      stroke: {
        style: structuredClone(this.stroke_style),
        enabled: this.stroke_enabled
      },
      fill: {
        style: structuredClone(this.fill_style),
        enabled: this.fill_enabled
      },
      mode: {
        rect: this.rect_mode,
        ellipse: this.ellipse_mode,
        image: this.image_mode
      }
    };
  }
  decodeStyles(styles) {
    this.text_style = styles.text.style, this.current_font = styles.text.font, this.stroke_style = styles.stroke.style, this.stroke_enabled = styles.stroke.enabled, this.fill_style = styles.fill.style, this.fill_enabled = styles.fill.enabled, this.rect_mode = styles.mode.rect, this.ellipse_mode = styles.mode.ellipse, this.image_mode = styles.mode.image;
  }
  pushStyle() {
    this.style_buffer.push(this.encodeStyles());
  }
  popStyle() {
    this.decodeStyles(this.style_buffer.shift());
  }
}
class PGraphics extends PImage {
  __matrix_stack__ = [];
  context;
  initialized = !1;
  constructor(parent, canvas) {
    super(parent), this.parent = parent, this.context = new PGraphicsContext(), canvas && (canvas instanceof HTMLCanvasElement ? this.context.canvas = canvas : this.texture = RenderTexture.create({ width: canvas.x, height: canvas.y }));
  }
  async init(width, height) {
    if (this.initialized) {
      this.parent.println("Renderer already initialized");
      return;
    }
    this.initialized = !0, this.width = width, this.height = height, this.context.canvas != null && (await this.parent.__app__.init({ width, height, backgroundColor: "#dddddd", clearBeforeRender: !1, preserveDrawingBuffer: !0, antialias: !0, canvas: this.context.canvas, resolution: window.devicePixelRatio || 1 }), this.parent.__app__.renderer.resize(width, height), this.parent.__app__.stage.addChild(this.context.graphics)), this.context.graphics.renderable = !1, this.__begin__();
  }
  background(c1, c2, c3, c4) {
    const mat = this.context.graphics.getTransform().clone();
    if (this.context.graphics.resetTransform(), this.context.graphics.clear(), this.context.graphics.save(), c1 instanceof PImage)
      this.image(c1, 0, 0, this.parent.__app__.renderer.width, this.parent.__app__.renderer.height);
    else {
      const _color = convert_color([c1, c2, c3, c4].filter((c5) => c5 != null), this.context.color_mode), { r: r2, g: g2, b: b2, a: a2 } = { r: _color[0], g: _color[1], b: _color[2], a: _color[3] };
      this.parent.__app__.renderer != null && (this.parent.__app__.renderer.background.color = { r: r2, g: g2, b: b2, a: a2 }), this.context.graphics.rect(0, 0, this.parent.__app__.renderer.width ?? innerWidth, this.parent.__app__.renderer.height ?? innerHeight), this.context.graphics.fill(this.context.color_mode.mode == 1 ? { color: { r: r2, g: g2, b: b2, a: a2 } } : { color: { h: r2, s: g2, v: b2, a: a2 } }), this.context.graphics.stroke({ color: 0, alpha: 0 });
    }
    this.context.graphics.restore(), this.context.graphics.setTransform(mat);
  }
  colorMode(mode, ...max) {
    max.length == 1 ? this.context.color_mode = { mode, X: max[0], Y: max[0], Z: max[0], A: this.context.color_mode.A } : this.context.color_mode = { mode, X: max[0] ?? this.context.color_mode.X, Y: max[1] ?? this.context.color_mode.Y, Z: max[2] ?? this.context.color_mode.Z, A: max[3] ?? this.context.color_mode.A }, this.context.colorMode(mode);
  }
  blendMode(mode) {
  }
  fill(...color) {
    const _color = convert_color(color, this.context.color_mode);
    this.context.fill(_color[0], _color[1], _color[2], _color[3]);
  }
  noFill() {
    this.context.noFill();
  }
  stroke(...color) {
    const _color = convert_color(color, this.context.color_mode);
    this.context.stroke(_color[0], _color[1], _color[2], _color[3]);
  }
  noStroke() {
    this.context.noStroke();
  }
  strokeWeight(weight) {
    this.context.strokeWeight(weight);
  }
  rectMode(mode) {
    this.context.rectMode(mode);
  }
  ellipseMode(mode) {
    this.context.ellipseMode(mode);
  }
  textAlign(align) {
    this.context.textAlign(align);
  }
  textSize(size) {
    this.context.textSize(size);
  }
  textWidth(str) {
    return CanvasTextMetrics.measureText(str, this.context.text_style).width;
  }
  createFont(name, size) {
    return this.context.createFont(name, size);
  }
  textFont(font) {
    this.context.textFont(font);
  }
  imageMode(mode) {
    this.context.imageMode(mode);
  }
  point(x2, y2) {
    this.circle(x2, y2, 1);
  }
  rect(x2, y2, width, height) {
    switch (this.context.rect_mode) {
      case 0:
        break;
      case 1:
        width = width - x2, height = height - y2;
        break;
      case 2:
        x2 -= width * 0.5, y2 -= height * 0.5, width *= 2, height *= 2;
        break;
      case 3:
        x2 -= width * 0.5, y2 -= height * 0.5;
        break;
      case 4:
        x2 -= width * 0.5, y2 -= height * 0.5, width *= 2, height *= 2;
        break;
      default:
        this.parent.println("Unknown rect mode: " + this.context.rect_mode);
        break;
    }
    this.context.graphics.rect(x2, y2, width, height), this.context.applySettings();
  }
  quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.context.graphics.poly([x1, y1, x2, y2, x3, y3, x4, y4]), this.context.applySettings();
  }
  ellipse(x2, y2, width, height) {
    switch (this.context.ellipse_mode) {
      case 0:
        x2 = x2 - width * 0.5, y2 = y2 - height * 0.5;
        break;
      case 1:
        width = width - x2, height = height - y2, x2 = x2 - width * 0.5, y2 = y2 - height * 0.5;
        break;
      case 2:
        width *= 2, height *= 2;
        break;
      case 3:
        break;
      default:
        this.parent.println("Unknown ellipse mode: " + this.context.ellipse_mode);
        break;
    }
    this.context.graphics.ellipse(x2, y2, width * 0.5, height * 0.5), this.context.applySettings();
  }
  circle(x2, y2, r2) {
    this.ellipse(x2, y2, r2, r2);
  }
  arc(x2, y2, width, height, start, stop) {
    const mat = this.context.graphics.getTransform().clone();
    this.context.graphics.translateTransform(x2, y2), this.context.graphics.scaleTransform(1, height / width), this.context.graphics.moveTo(width * 0.5 * Math.cos(start), width * 0.5 * Math.sin(start)), this.context.graphics.arc(0, 0, width * 0.5, start, stop), this.context.graphics.setTransform(mat), this.context.applySettings();
  }
  triangle(x1, y1, x2, y2, x3, y3) {
    this.context.graphics.moveTo(x1, y1), this.context.graphics.lineTo(x2, y2), this.context.graphics.lineTo(x3, y3), this.context.graphics.lineTo(x1, y1), this.context.applySettings();
  }
  line(x1, y1, x2, y2) {
    this.context.graphics.moveTo(x1, y1), this.context.graphics.lineTo(x2, y2), this.context.graphics.moveTo(0, 0), this.context.applySettings();
  }
  text(text, x2, y2, w2, h2) {
    if (!this.context.text_style) return;
    switch (this.context.text_style.fill = this.context.fill_style.color, this.context.text_style.align) {
      case "center":
        x2 -= this.textWidth(text) * 0.5;
        break;
      case "left":
        break;
      case "right":
        x2 -= this.textWidth(text);
        break;
    }
    w2 ? (this.context.text_style.breakWords = !0, this.context.text_style.wordWrap = !0, this.context.text_style.wordWrapWidth = w2) : (this.context.text_style.breakWords = !1, this.context.text_style.wordWrap = !1, this.context.text_style.wordWrapWidth = 0);
    const style = this.context.text_style.clone();
    style.fontFamily = this.context.current_font.id;
    const text_obj = new BitmapText({ text, style });
    this.context.graphics.getTransform().clone(), w2 && h2 && (text_obj.width = w2, text_obj.height = h2);
    const key = `font:${style.fontFamily},text:${text},size:${style.fontSize}`;
    let tex;
    this.context.texture_cache.has(key) ? (tex = this.context.texture_cache.get(key), tex.frame = this.parent.frameCount) : (tex = { texture: this.parent.__app__.renderer.generateTexture(text_obj), frame: this.parent.frameCount }, this.context.texture_cache.set(key, tex)), this.context.graphics.rect(0, 0, 0, 0), this.context.graphics.fill({ color: 16777215 }), this.context.graphics.stroke({ color: 0 }), this.context.graphics.texture(tex.texture, this.context.fill_style.color, x2, y2 - this.context.text_style.fontSize * 0.75), this.context.applySettings(), this.__render__();
  }
  image(image, x2, y2, w2, h2) {
    if (image.texture != null) {
      switch (image.__pixel_modified__ && image.updatePixels(), w2 = w2 ?? image.width, h2 = h2 ?? image.height, this.context.image_mode) {
        case 0:
          break;
        case 1:
          w2 = w2 - x2, h2 = h2 - y2;
          break;
        case 3:
          x2 -= w2 * 0.5, y2 -= h2 * 0.5;
          break;
        default:
          this.parent.println("Unknown image mode: " + this.context.image_mode);
          break;
      }
      this.context.graphics.rect(0, 0, 0, 0), this.context.graphics.fill({ color: 16777215 }), this.context.graphics.stroke({ color: 0 }), this.context.graphics.texture(image.texture, 16777215, x2, y2, w2, h2), this.context.applySettings();
    }
    this.__render__();
  }
  translate(x2, y2) {
    const mat = this.getTransform(), t2 = new Matrix().translate(x2, y2);
    mat.append(t2), this.setTransform(mat);
  }
  rotate(angle) {
    const mat = this.getTransform(), t2 = new Matrix().rotate(angle);
    mat.append(t2), this.setTransform(mat);
  }
  scale(x2, y2) {
    const mat = this.getTransform(), t2 = new Matrix().scale(x2, y2 ?? x2);
    mat.append(t2), this.setTransform(mat);
  }
  pushMatrix() {
    this.__matrix_stack__.unshift(this.getTransform());
  }
  popMatrix() {
    const mat = this.__matrix_stack__.shift();
    if (mat == null) {
      this.parent.println('You must call "pushMatrix()" first.');
      return;
    }
    this.setTransform(mat);
  }
  getTransform() {
    return this.context.graphics.getTransform().clone() ?? new Matrix();
  }
  setTransform(mat) {
    this.context.graphics.setTransform(mat.clone());
  }
  clearTransform() {
    this.context.graphics.resetTransform();
  }
  push() {
    this.context.graphics.save();
  }
  pop() {
    this.context.graphics.restore();
  }
  pushStyle() {
    this.context.pushStyle();
  }
  popStyle() {
    this.context.popStyle();
  }
  resetMatrix() {
    this.clearTransform();
  }
  beginShape(mode) {
    this.context.shape_mode = mode ?? 0, this.context.shape_buffer = [];
  }
  vertex(x2, y2) {
    this.context.shape_buffer != null && this.context.shape_buffer.push(x2, y2);
  }
  endShape(mode) {
    if (!this.context.shape_buffer) return;
    const close = mode == 2;
    switch (this.context.shape_mode) {
      case 0:
        this.context.graphics.poly(this.context.shape_buffer, close), this.context.applySettings();
        break;
      case 3:
        for (let i2 = 0; i2 < this.context.shape_buffer.length; i2 += 2)
          this.point(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1]);
        break;
      case 5:
        for (let i2 = 0; i2 < this.context.shape_buffer.length; i2 += 4)
          this.line(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[i2 + 2], this.context.shape_buffer[i2 + 3]);
        break;
      case 9:
        for (let i2 = 0; i2 < this.context.shape_buffer.length; i2 += 6)
          this.triangle(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[i2 + 2], this.context.shape_buffer[i2 + 3], this.context.shape_buffer[i2 + 4], this.context.shape_buffer[i2 + 5]);
        break;
      case 10:
        for (let i2 = 0; i2 < this.context.shape_buffer.length - 4; i2 += 2)
          this.triangle(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[i2 + 2], this.context.shape_buffer[i2 + 3], this.context.shape_buffer[i2 + 4], this.context.shape_buffer[i2 + 5]);
        break;
      case 11:
        for (let i2 = 2; i2 < this.context.shape_buffer.length; i2 += 2) {
          const x2 = i2 + 2 > this.context.shape_buffer.length ? 2 : i2 + 2, y2 = i2 + 3 > this.context.shape_buffer.length ? 3 : i2 + 3;
          this.triangle(this.context.shape_buffer[0], this.context.shape_buffer[1], this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[x2], this.context.shape_buffer[y2]);
        }
        break;
      case 17:
        for (let i2 = 0; i2 < this.context.shape_buffer.length; i2 += 8)
          this.quad(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[i2 + 2], this.context.shape_buffer[i2 + 3], this.context.shape_buffer[i2 + 4], this.context.shape_buffer[i2 + 5], this.context.shape_buffer[i2 + 6], this.context.shape_buffer[i2 + 7]);
        break;
      case 18:
        for (let i2 = 0; i2 < this.context.shape_buffer.length - 4; i2 += 4)
          this.quad(this.context.shape_buffer[i2], this.context.shape_buffer[i2 + 1], this.context.shape_buffer[i2 + 2], this.context.shape_buffer[i2 + 3], this.context.shape_buffer[i2 + 6], this.context.shape_buffer[i2 + 7], this.context.shape_buffer[i2 + 4], this.context.shape_buffer[i2 + 5]);
        break;
    }
  }
  beginDraw() {
  }
  endDraw() {
    this.texture instanceof RenderTexture && (this.context.graphics.renderable = !0, this.parent.__app__.renderer.render({ container: this.context.graphics, target: this.texture, clear: !1 }), this.context.graphics.renderable = !1), this.loadPixels();
  }
  __begin__() {
    this.context.graphics.resetTransform();
  }
  __end__() {
    this.__render__(), this.parent.__loop__ && this.context.graphics?.clear();
    for (let [k2, c2] of this.context.texture_cache)
      c2.frame < this.parent.frameCount - 60 && (c2.texture.destroy(!0), this.context.texture_cache.delete(k2));
    return 0;
  }
  __stop__() {
    this.context.graphics.renderable = !0, this.parent.__app__.render(), this.context.graphics.renderable = !1;
  }
  __render__() {
    this.push(), this.context.graphics.renderable = !0, this.parent.__app__.render(), this.context.graphics.renderable = !1, this.parent.__loop__ && this.context.graphics?.clear(), this.pop();
  }
  updateResolution(r2) {
    this.parent.__app__.renderer.resize(this.parent.__app__.renderer.width, this.parent.__app__.renderer.height, r2);
  }
}
function convert_color(color, color_mode) {
  const def = color_mode.mode == 1 ? [255, 255, 255, 1] : [360, 100, 100, 1];
  if (color.length == 1)
    color[0] < 0 || color_mode.Z < color[0] ? color = [color[0] & 255, color[0] >> 8 & 255, color[0] >> 16 & 255, color[0] >>> 24] : color = [color[0], color[0], color[0], 255];
  else if (color.length == 2)
    color[0] < 0 || color_mode.Z < color[0] ? color = [color[0] & 255, color[0] >> 8 & 255, color[0] >> 16 & 255, color[1]] : color = [color[0], color[0], color[0], color[1]];
  else if (color.length == 3)
    color = [color[0], color[1], color[2], 255];
  else if (color.length == 4)
    color = [color[0], color[1], color[2], color[3]];
  else
    throw new Error("Invalid color length: " + color.length);
  return [(color[0] ?? 0) / color_mode.X * def[0], (color[1] ?? 0) / color_mode.Y * def[1], (color[2] ?? 0) / color_mode.Z * def[2], (color[3] ?? 255) / color_mode.A * def[3]];
}
class PSurface {
  MIN_WINDOW_WIDTH = 128;
  MIN_WINDOW_HEIGHT = 128;
  current_cursor = "default";
  applet;
  constructor(applet) {
    this.applet = applet;
  }
  setCursor(...args) {
    if (args.length == 1 && args[0].constructor.name == "Number") {
      const kind = args[0];
      let name = "auto";
      switch (kind) {
        case -1:
          break;
        case 0:
          name = "default";
          break;
        case 1:
          name = "crosshair";
          break;
        case 2:
          name = "text";
          break;
        case 3:
          name = "wait";
          break;
        case 4:
          name = "sw-resize";
          break;
        case 5:
          name = "se-resize";
          break;
        case 6:
          name = "nw-resize";
          break;
        case 7:
          name = "ne-resize";
          break;
        case 8:
          name = "n-resize";
          break;
        case 9:
          name = "s-resize";
          break;
        case 10:
          name = "w-resize";
          break;
        case 11:
          name = "e-resize";
          break;
        case 12:
          name = "grab";
          break;
        case 13:
          name = "move";
          break;
      }
      this.current_cursor = name, this.setCursorStyle(name);
    } else if (args.length == 3 && args[0].constructor.name == "PImage" && args[1].constructor.name == "Number" && args[2].constructor.name == "Number") {
      const { image, hotspotX, hotspotY } = { image: args[0], hotspotX: args[1], hotspotY: args[2] };
      this.setCursorStyle({ image, x: hotspotX, y: hotspotY }), console.log(image);
    }
  }
  showCursor() {
    this.setCursorStyle(this.current_cursor);
  }
  hideCursor() {
    this.setCursorStyle("none");
  }
  setCursorStyle(arg) {
    typeof arg == "string" && (this.applet.g.context.canvas.style.cursor = arg);
  }
  setTitle(title) {
    document.title = title;
  }
}
class JSONArray {
  json;
  constructor(json) {
    this.json = json;
  }
  static parse(str) {
    return new JSONArray(JSON.parse(str));
  }
  isNull(index) {
    return this.json[index] == null;
  }
  toString() {
    return JSON.stringify(this.json);
  }
  getJSONArray(index, init) {
    return this.json[index] == null ? init : new JSONArray(this.json[index]);
  }
  setJSONArray(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  getJSONObject(index) {
    return new JSONObject(this.json[index]);
  }
  setJSONObject(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  getInt(index, init) {
    return this.json[index] == null ? init : Number(this.json[index]);
  }
  setInt(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  toIntArray() {
    let arr = [];
    for (let i2 in this.json)
      arr.push(Number(i2));
    return arr;
  }
  getFloat(index, init) {
    return this.json[index] == null ? init : Number(this.json[index]);
  }
  setFloat(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  toFloatArray() {
    let arr = [];
    for (let i2 in this.json)
      arr.push(Number(i2));
    return arr;
  }
  getString(index, init) {
    return this.json[index] == null ? init : String(this.json[index]);
  }
  setString(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  toStringArray() {
    let arr = [];
    for (let i2 in this.json)
      arr.push(i2);
    return arr;
  }
  getBoolean(index, init) {
    return this.json[index] == null ? init : !!this.json[index];
  }
  setBoolean(index, val) {
    return val != null && (this.json[index] = val), this;
  }
  toBooleanArray() {
    let arr = [];
    for (let i2 in this.json)
      arr.push(!!i2);
    return arr;
  }
  size() {
    return this.json == null ? 0 : Object.keys(this.json).length;
  }
  append(val) {
    return this.json.push(val), this;
  }
  remove(index) {
    delete this.json[index];
  }
}
class JSONObject {
  json;
  constructor(source) {
    this.json = source;
  }
  static parse(str) {
    return new JSONObject(JSON.parse(str));
  }
  hasKey(str) {
    return this.json[str] != null;
  }
  isNull(str) {
    return this.json[str] == null;
  }
  toString() {
    return JSON.stringify(this.json);
  }
  getInt(name, init) {
    return this.json[name] == null ? init : Number(this.json[name]);
  }
  setInt(name, val) {
    return val != null && (this.json[name] = val), this;
  }
  getFloat(name, init) {
    return this.json[name] == null ? init : Number(this.json[name]);
  }
  setFloat(name, val) {
    return val != null && (this.json[name] = val), this;
  }
  getString(name, init) {
    return this.json[name] == null ? init : String(this.json[name]);
  }
  setString(name, val) {
    return val != null && (this.json[name] = val), this;
  }
  getBoolean(name, init) {
    return this.json[name] == null ? init : !!this.json[name];
  }
  setBoolean(name, val) {
    return val != null && (this.json[name] = val), this;
  }
  getJSONObject(name) {
    return new JSONObject(this.json[name]);
  }
  setJSONObject(name, val) {
    return val != null && (this.json[name] = val.json), this;
  }
  getJSONArray(name) {
    return new JSONArray(this.json[name]);
  }
  setJSONArray(name, val) {
    return val != null && (this.json[name] = val.json), this;
  }
  keys() {
    return Object.keys(this.json);
  }
  remove(name) {
    delete this.json[name];
  }
}
class IOBase {
  base_path;
  preload = null;
  constructor(base_path) {
    this.base_path = base_path;
  }
  toBlob(src, mime) {
    const len = src.length, bytes = new Uint8Array(len);
    for (let i2 = 0; i2 < len; i2++)
      bytes[i2] = src.charCodeAt(i2) & 255;
    return new Blob([bytes], { type: mime });
  }
  readBlob(blob) {
    const xhr = new XMLHttpRequest(), url = URL.createObjectURL(blob);
    return xhr.overrideMimeType("text/plain; charset=x-user-defined"), xhr.open("GET", url, !1), xhr.send(), xhr.response;
  }
  save_blob(name, data) {
    window.localStorage.setItem(name, this.readBlob(data));
  }
  save_string(name, data) {
    window.localStorage.setItem(name, data);
  }
  load_buffer_as_blob(name, mime) {
    if (this.preload == null) return null;
    const result = this.preload.filter((p2) => p2.path == name);
    return result.length > 0 ? new Blob([result[0].content], { type: mime }) : null;
  }
  load_buffer_as_string(name) {
    if (this.preload == null) return null;
    const result = this.preload.filter((p2) => p2.path == name);
    return result.length > 0 ? new TextDecoder("utf-8").decode(result[0].content) : null;
  }
  load_as_blob(name, mime) {
    let result;
    return window.localStorage.getItem(name) != null && (result = this.toBlob(window.localStorage.getItem(name), mime)) != null || (result = this.load_buffer_as_blob(name, mime)) != null || (result = this.toBlob(this.request(name), mime)) != null ? result : null;
  }
  load_as_string(name) {
    let result;
    return (result = window.localStorage.getItem(name)) != null || (result = this.load_buffer_as_string(name)) != null || (result = this.request(name)) != null ? result : null;
  }
}
class XHRIO extends IOBase {
  request(path) {
    const xhr = new XMLHttpRequest();
    if (xhr.open("GET", this.base_path + path, !1), xhr.overrideMimeType("text/plain; charset=x-user-defined"), xhr.send(), xhr.status >= 200 && xhr.status < 300)
      return xhr.responseText;
    throw new Error(`XHRIO request failed: ${xhr.status} ${xhr.statusText}`);
  }
}
class PApplet extends PConstants {
  g;
  surface = new PSurface(this);
  __io__ = null;
  __fullscreen__ = !1;
  __log_listener__ = () => {
  };
  __date__ = /* @__PURE__ */ new Date();
  __start_milli_seconds__ = performance.now();
  __loop__ = !0;
  __app__;
  __exit_code__ = 0;
  max_size = { width: 0, height: 0 };
  width = 0;
  height = 0;
  pmouseX = 0;
  pmouseY = 0;
  mouseX = 0;
  mouseY = 0;
  mousePressed = !1;
  mouseButton = 0;
  // 0: left, 1: middle, 2: right
  key = "";
  keyCode = 0;
  keyPressed = !1;
  __frameRate__ = 60;
  frameRate = 60;
  frameCount = 0;
  __initialized__ = !1;
  constructor(settings) {
    super(), settings && (this.max_size = settings.max_size, this.__io__ = new XHRIO(settings.base_path)), this.__app__ = new Application(), this.g = new PGraphics(this, settings?.canvas);
  }
  __set_preload__(buffer) {
    this.__io__ && (this.__io__.preload = buffer);
  }
  async settings() {
  }
  async setup() {
  }
  async draw() {
    this.noLoop();
  }
  async size(width, height) {
    if (this.__initialized__) {
      console.warn("size() or fullScreen() can only be called once");
      return;
    }
    await this.g.init(width, height), this.width = this.g.width, this.height = this.g.height, this.__initialized__ = !0;
  }
  async fullScreen(mode) {
    if (this.__initialized__) {
      console.warn("size() or fullScreen() can only be called once");
      return;
    }
    this.width = this.max_size.width, this.height = this.max_size.height, this.__fullscreen__ = !0, await this.g.init(this.width, this.height), this.__initialized__ = !0;
  }
  getSurface() {
    return this.surface;
  }
  _frameRate(framerate) {
    this.__frameRate__ = framerate;
  }
  background(c1, c2, c3, c4) {
    this.g.background(c1, c2, c3, c4);
  }
  colorMode(mode, ...max) {
    this.g.colorMode(mode, ...max);
  }
  fill(...color) {
    this.g.fill(...color);
  }
  noFill() {
    this.g.noFill();
  }
  stroke(...color) {
    this.g.stroke(...color);
  }
  noStroke() {
    this.g.noStroke();
  }
  strokeWeight(weight) {
    this.g.strokeWeight(weight);
  }
  rectMode(mode) {
    this.g.rectMode(mode);
  }
  ellipseMode(mode) {
    this.g.ellipseMode(mode);
  }
  textAlign(align) {
    this.g.textAlign(align);
  }
  textSize(size) {
    this.g.textSize(size);
  }
  textWidth(str) {
    return this.g.textWidth(str);
  }
  createFont(name, size) {
    return this.g.createFont(name, size);
  }
  textFont(font) {
    this.g.textFont(font);
  }
  imageMode(mode) {
    this.g.imageMode(mode);
  }
  point(x2, y2) {
    this.g.point(x2, y2);
  }
  rect(x2, y2, width, height) {
    this.g.rect(x2, y2, width, height);
  }
  quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.g.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  }
  ellipse(x2, y2, width, height) {
    this.g.ellipse(x2, y2, width, height);
  }
  circle(x2, y2, r2) {
    this.g.circle(x2, y2, r2);
  }
  arc(x2, y2, width, height, start, stop) {
    this.g.arc(x2, y2, width, height, start, stop);
  }
  triangle(x1, y1, x2, y2, x3, y3) {
    this.g.triangle(x1, y1, x2, y2, x3, y3);
  }
  line(x1, y1, x2, y2) {
    this.g.line(x1, y1, x2, y2);
  }
  text(text, x2, y2, w2, h2) {
    this.g.text(text, x2, y2, w2, h2);
  }
  image(image, x2, y2, w2, h2) {
    this.g.image(image, x2, y2, w2, h2);
  }
  translate(x2, y2) {
    this.g.translate(x2, y2);
  }
  rotate(angle) {
    this.g.rotate(angle);
  }
  scale(x2, y2) {
    this.g.scale(x2, y2);
  }
  push() {
    this.g.push();
  }
  pop() {
    this.g.pop();
  }
  pushStyle() {
    this.g.pushStyle();
  }
  popStyle() {
    this.g.popStyle();
  }
  pushMatrix() {
    this.g.pushMatrix();
  }
  popMatrix() {
    this.g.popMatrix();
  }
  resetMatrix() {
    this.g.resetMatrix();
  }
  beginShape(mode) {
    this.g.beginShape(mode);
  }
  vertex(x2, y2) {
    this.g.vertex(x2, y2);
  }
  endShape(mode) {
    this.g.endShape(mode);
  }
  _keyPressed(e2) {
  }
  _keyTyped(e2) {
  }
  _keyReleased(e2) {
  }
  _mousePressed(e2) {
  }
  _mouseReleased(e2) {
  }
  _mouseMoved(e2) {
  }
  _mouseWheel(e2) {
  }
  _windowResized() {
  }
  color(...color) {
    let result = 4294967295;
    if (color = color.map((c2) => Math.max(Math.min(c2, 255), 0)), color.length == 1)
      result = 4278190080 | color[0] << 16 | color[0] << 8 | color[0];
    else if (color.length == 2)
      result = color[1] << 24 | color[0] << 16 | color[0] << 8 | color[0];
    else if (color.length == 3)
      result = 4278190080 | color[2] << 16 | color[1] << 8 | color[0];
    else if (color.length == 4)
      result = color[3] << 24 | color[2] << 16 | color[1] << 8 | color[0];
    else
      throw new Error("Invalid color length: " + color.length);
    return result;
  }
  red(c2) {
    return c2 & 255;
  }
  green(c2) {
    return c2 >> 8 & 255;
  }
  blue(c2) {
    return c2 >> 16 & 255;
  }
  alpha(c2) {
    return c2 >>> 24;
  }
  lerpColor(c1, c2, amt) {
    amt = this.constrain(amt, 0, 1);
    const c1_arr = [c1 & 255, c1 >> 8 & 255, c1 >> 16 & 255, c1 >>> 24], c2_arr = [c2 & 255, c2 >> 8 & 255, c2 >> 16 & 255, c2 >>> 24];
    return this.color(this.lerp(c1_arr[0], c2_arr[0], amt), this.lerp(c1_arr[1], c2_arr[1], amt), this.lerp(c1_arr[2], c2_arr[2], amt), this.lerp(c1_arr[3], c2_arr[3], amt));
  }
  join(list, separator) {
    return list.join(separator);
  }
  matchAll(str, regexp) {
    return str.matchAll(new RegExp(regexp, "g"));
  }
  match(str, regexp) {
    return str.match(new RegExp(regexp));
  }
  nf(num, left, right) {
    if (typeof num == "number") {
      if (!left) return num.toString();
      if (right)
        return num.toFixed(right);
      {
        const l2 = Math.max(0, left - Math.floor(num).toString().length);
        return new Array(l2).fill("0").join("").concat(num.toFixed());
      }
    } else
      return left ? right ? num.map((n2) => n2.toFixed(right)) : num.map((n2) => {
        const l2 = Math.max(0, left - Math.floor(n2).toString().length);
        return new Array(l2).fill("0").join("").concat(n2.toFixed());
      }) : num.map((n2) => n2.toString());
  }
  nfc(num, right) {
    return typeof num == "number" ? right ? new Intl.NumberFormat("en-US", { minimumFractionDigits: right }).format(num) : new Intl.NumberFormat("en-US").format(num) : right ? num.map((n2) => new Intl.NumberFormat("en-US", { minimumFractionDigits: right }).format(n2)) : num.map((n2) => new Intl.NumberFormat("en-US").format(n2));
  }
  nfp(num, left, right) {
    return typeof num == "number" ? right ? new Intl.NumberFormat(void 0, { minimumIntegerDigits: left, minimumFractionDigits: right, signDisplay: "always" }).format(num) : new Intl.NumberFormat(void 0, { minimumIntegerDigits: left, signDisplay: "always" }).format(num) : right ? num.map((n2) => new Intl.NumberFormat(void 0, { minimumIntegerDigits: left, minimumFractionDigits: right, signDisplay: "always" }).format(n2)) : num.map((n2) => new Intl.NumberFormat(void 0, { minimumIntegerDigits: left, signDisplay: "always" }).format(n2));
  }
  nfs(num, left, right) {
    const result = this.nfp(num, left, right);
    return typeof result == "string" ? result.replace("+", " ") : result.map((r2) => r2.replace("+", " "));
  }
  trim(str) {
    return typeof str == "string" ? str.trim() : str.map((s2) => s2.trim());
  }
  year() {
    return this.__date__.getFullYear();
  }
  month() {
    return this.__date__.getMonth() + 1;
  }
  day() {
    return this.__date__.getDate();
  }
  hour() {
    return this.__date__.getHours();
  }
  minute() {
    return this.__date__.getMinutes();
  }
  second() {
    return this.__date__.getSeconds();
  }
  millis() {
    return Math.round(performance.now() - this.__start_milli_seconds__);
  }
  radians(degrees) {
    return degrees * (Math.PI / 180);
  }
  degrees(radians) {
    return radians * (180 / Math.PI);
  }
  abs = Math.abs;
  floor = Math.floor;
  ceil = Math.ceil;
  min = Math.min;
  max = Math.max;
  sqrt = Math.sqrt;
  pow = Math.pow;
  constrain(x2, min, max) {
    return x2 < min ? min : x2 > max ? max : x2;
  }
  map(value, start1, stop1, start2, stop2) {
    const range1 = stop1 - start1, range2 = stop2 - start2, position = (value - start1) / range1;
    return start2 + position * range2;
  }
  norm(value, start, stop) {
    return this.map(value, start, stop, 0, 1);
  }
  dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
  exp = Math.exp;
  sin = Math.sin;
  cos = Math.cos;
  tan = Math.tan;
  asin = Math.asin;
  acos = Math.acos;
  atan = Math.atan;
  atan2 = Math.atan2;
  random(min, max) {
    return max == null && (max = min, min = 0), Math.random() * (max - min) + min;
  }
  noise(x2, y2 = 0, z2 = 0) {
    const X2 = Math.floor(x2) & 255, Y2 = Math.floor(y2) & 255, Z2 = Math.floor(z2) & 255;
    x2 -= Math.floor(x2), y2 -= Math.floor(y2), z2 -= Math.floor(z2);
    const u2 = this.__fade__(x2), v2 = this.__fade__(y2), w2 = this.__fade__(z2), A2 = this.__permutation__[X2] + Y2, AA = this.__permutation__[A2] + Z2, AB = this.__permutation__[A2 + 1] + Z2, B2 = this.__permutation__[X2 + 1] + Y2, BA = this.__permutation__[B2] + Z2, BB = this.__permutation__[B2 + 1] + Z2;
    return this.lerp(
      this.lerp(
        this.lerp(this.__grad__(this.__permutation__[AA], x2, y2, z2), this.__grad__(this.__permutation__[BA], x2 - 1, y2, z2), u2),
        this.lerp(this.__grad__(this.__permutation__[AB], x2, y2 - 1, z2), this.__grad__(this.__permutation__[BB], x2 - 1, y2 - 1, z2), u2),
        v2
      ),
      this.lerp(
        this.lerp(this.__grad__(this.__permutation__[AA + 1], x2, y2, z2 - 1), this.__grad__(this.__permutation__[BA + 1], x2 - 1, y2, z2 - 1), u2),
        this.lerp(this.__grad__(this.__permutation__[AB + 1], x2, y2 - 1, z2 - 1), this.__grad__(this.__permutation__[BB + 1], x2 - 1, y2 - 1, z2 - 1), u2),
        v2
      ),
      w2
    );
  }
  int(x2) {
    return Math.floor(x2);
  }
  float(x2) {
    return x2;
  }
  str(x2) {
    return x2.toString();
  }
  split(str, splitter) {
    return str.split(splitter);
  }
  println(...args) {
    this.__log_listener__(args);
  }
  loadStrings(path) {
    const result = this.__io__.load_as_string(path);
    return result != null ? result.split(`
`) : (console.warn(`loadStrings: ${path} not found`), null);
  }
  saveStrings(path, data) {
    this.__io__?.save_string(path, data.join(`
`));
  }
  loadImage(path) {
    const img = new PImage(this), result = this.__io__.load_as_blob(path, `image/${path.split(".").pop()?.toLowerCase() ?? "png"}`);
    return result != null ? (img.load_from_blob(result), img) : null;
  }
  createImage(width, height, format) {
    return new PImage(this, { pixels: [], width, height, format });
  }
  createGraphics(width, height, renderer) {
    return new PGraphics(this, { x: width, y: height });
  }
  loadJSONObject(path) {
    const result = this.__io__.load_as_string(path);
    return result != null ? JSONObject.parse(result) : null;
  }
  saveJSONObject(data, path) {
    this.__io__?.save_string(path, data.toString());
  }
  loadJSONArray(path) {
    const result = this.__io__.load_as_string(path);
    return result != null ? JSONArray.parse(result) : null;
  }
  saveJSONArray(data, path) {
    this.__io__?.save_string(path, data.toString());
  }
  loop() {
    this.__loop__ = !0;
  }
  noLoop() {
    this.__loop__ = !1;
  }
  exit() {
    this.__exit_code__ = 1;
  }
  __begin__() {
    this.g.__begin__(), this.__date__ = /* @__PURE__ */ new Date();
  }
  __end__() {
    return this.g.__end__(), this.__exit_code__;
  }
  __stop__() {
    this.colorMode(this.RGB, 255, 255, 255, 255), this.g.background(255), this.g.__stop__();
  }
  __fade__(t2) {
    return t2 * t2 * t2 * (t2 * (t2 * 6 - 15) + 10);
  }
  lerp(start, stop, amt) {
    return start + amt * (stop - start);
  }
  __grad__(hash, x2, y2, z2) {
    const h2 = hash & 15, u2 = h2 < 8 ? x2 : y2, v2 = h2 < 4 ? y2 : h2 === 12 || h2 === 14 ? x2 : z2;
    return ((h2 & 1) === 0 ? u2 : -u2) + ((h2 & 2) === 0 ? v2 : -v2);
  }
  __permutation__ = (() => {
    const p2 = new Uint8Array(512), perm = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180
    ];
    for (let i2 = 0; i2 < 256; i2++)
      p2[256 + i2] = p2[i2] = perm[i2];
    return p2;
  })();
}
class ProcessingVisitor extends pn {
  /**
   * Visit a parse tree produced by `ProcessingParser.processingSketch`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProcessingSketch;
  /**
   * Visit a parse tree produced by `ProcessingParser.javaProcessingSketch`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitJavaProcessingSketch;
  /**
   * Visit a parse tree produced by `ProcessingParser.staticProcessingSketch`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStaticProcessingSketch;
  /**
   * Visit a parse tree produced by `ProcessingParser.activeProcessingSketch`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitActiveProcessingSketch;
  /**
   * Visit a parse tree produced by `ProcessingParser.warnMixedModes`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitWarnMixedModes;
  /**
   * Visit a parse tree produced by `ProcessingParser.variableDeclaratorId`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariableDeclaratorId;
  /**
   * Visit a parse tree produced by `ProcessingParser.warnTypeAsVariableName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitWarnTypeAsVariableName;
  /**
   * Visit a parse tree produced by `ProcessingParser.methodCall`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMethodCall;
  /**
   * Visit a parse tree produced by `ProcessingParser.functionWithPrimitiveTypeName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFunctionWithPrimitiveTypeName;
  /**
   * Visit a parse tree produced by `ProcessingParser.primitiveType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPrimitiveType;
  /**
   * Visit a parse tree produced by `ProcessingParser.colorPrimitiveType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitColorPrimitiveType;
  /**
   * Visit a parse tree produced by `ProcessingParser.qualifiedName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitQualifiedName;
  /**
   * Visit a parse tree produced by `ProcessingParser.literal`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.hexColorLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitHexColorLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.compilationUnit`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCompilationUnit;
  /**
   * Visit a parse tree produced by `ProcessingParser.packageDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPackageDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.importDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitImportDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.modifier`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitModifier;
  /**
   * Visit a parse tree produced by `ProcessingParser.classOrInterfaceModifier`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassOrInterfaceModifier;
  /**
   * Visit a parse tree produced by `ProcessingParser.variableModifier`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariableModifier;
  /**
   * Visit a parse tree produced by `ProcessingParser.classDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeParameters`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeParameters;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeParameter`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeParameter;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeBound`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeBound;
  /**
   * Visit a parse tree produced by `ProcessingParser.enumDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEnumDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.enumConstants`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEnumConstants;
  /**
   * Visit a parse tree produced by `ProcessingParser.enumConstant`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEnumConstant;
  /**
   * Visit a parse tree produced by `ProcessingParser.enumBodyDeclarations`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEnumBodyDeclarations;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.classBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassBody;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceBody;
  /**
   * Visit a parse tree produced by `ProcessingParser.classBodyDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassBodyDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.memberDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMemberDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.methodDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMethodDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.methodBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMethodBody;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeTypeOrVoid`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeTypeOrVoid;
  /**
   * Visit a parse tree produced by `ProcessingParser.genericMethodDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitGenericMethodDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.genericConstructorDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitGenericConstructorDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.constructorDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitConstructorDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.fieldDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFieldDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceBodyDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceBodyDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceMemberDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceMemberDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.constDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitConstDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.constantDeclarator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitConstantDeclarator;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceMethodDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceMethodDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.interfaceMethodModifier`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInterfaceMethodModifier;
  /**
   * Visit a parse tree produced by `ProcessingParser.genericInterfaceMethodDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitGenericInterfaceMethodDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.variableDeclarators`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariableDeclarators;
  /**
   * Visit a parse tree produced by `ProcessingParser.variableDeclarator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariableDeclarator;
  /**
   * Visit a parse tree produced by `ProcessingParser.variableInitializer`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariableInitializer;
  /**
   * Visit a parse tree produced by `ProcessingParser.arrayInitializer`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArrayInitializer;
  /**
   * Visit a parse tree produced by `ProcessingParser.classOrInterfaceType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassOrInterfaceType;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeArgument`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeArgument;
  /**
   * Visit a parse tree produced by `ProcessingParser.qualifiedNameList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitQualifiedNameList;
  /**
   * Visit a parse tree produced by `ProcessingParser.formalParameters`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFormalParameters;
  /**
   * Visit a parse tree produced by `ProcessingParser.formalParameterList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFormalParameterList;
  /**
   * Visit a parse tree produced by `ProcessingParser.formalParameter`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFormalParameter;
  /**
   * Visit a parse tree produced by `ProcessingParser.lastFormalParameter`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLastFormalParameter;
  /**
   * Visit a parse tree produced by `ProcessingParser.baseStringLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBaseStringLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.multilineStringLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMultilineStringLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.stringLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStringLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.integerLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitIntegerLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.floatLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFloatLiteral;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotation`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotation;
  /**
   * Visit a parse tree produced by `ProcessingParser.elementValuePairs`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitElementValuePairs;
  /**
   * Visit a parse tree produced by `ProcessingParser.elementValuePair`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitElementValuePair;
  /**
   * Visit a parse tree produced by `ProcessingParser.elementValue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitElementValue;
  /**
   * Visit a parse tree produced by `ProcessingParser.elementValueArrayInitializer`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitElementValueArrayInitializer;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationTypeDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationTypeDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationTypeBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationTypeBody;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationTypeElementDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationTypeElementDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationTypeElementRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationTypeElementRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationMethodOrConstantRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationMethodOrConstantRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationMethodRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationMethodRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.annotationConstantRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnnotationConstantRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.defaultValue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDefaultValue;
  /**
   * Visit a parse tree produced by `ProcessingParser.block`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBlock;
  /**
   * Visit a parse tree produced by `ProcessingParser.blockStatement`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBlockStatement;
  /**
   * Visit a parse tree produced by `ProcessingParser.localVariableDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLocalVariableDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.localTypeDeclaration`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLocalTypeDeclaration;
  /**
   * Visit a parse tree produced by `ProcessingParser.statement`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStatement;
  /**
   * Visit a parse tree produced by `ProcessingParser.catchClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCatchClause;
  /**
   * Visit a parse tree produced by `ProcessingParser.catchType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCatchType;
  /**
   * Visit a parse tree produced by `ProcessingParser.finallyBlock`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFinallyBlock;
  /**
   * Visit a parse tree produced by `ProcessingParser.resourceSpecification`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitResourceSpecification;
  /**
   * Visit a parse tree produced by `ProcessingParser.resources`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitResources;
  /**
   * Visit a parse tree produced by `ProcessingParser.resource`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitResource;
  /**
   * Visit a parse tree produced by `ProcessingParser.switchBlockStatementGroup`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSwitchBlockStatementGroup;
  /**
   * Visit a parse tree produced by `ProcessingParser.switchLabel`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSwitchLabel;
  /**
   * Visit a parse tree produced by `ProcessingParser.forControl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitForControl;
  /**
   * Visit a parse tree produced by `ProcessingParser.forInit`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitForInit;
  /**
   * Visit a parse tree produced by `ProcessingParser.enhancedForControl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEnhancedForControl;
  /**
   * Visit a parse tree produced by `ProcessingParser.parExpression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitParExpression;
  /**
   * Visit a parse tree produced by `ProcessingParser.expressionList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExpressionList;
  /**
   * Visit a parse tree produced by `ProcessingParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExpression;
  /**
   * Visit a parse tree produced by `ProcessingParser.lambdaExpression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLambdaExpression;
  /**
   * Visit a parse tree produced by `ProcessingParser.lambdaParameters`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLambdaParameters;
  /**
   * Visit a parse tree produced by `ProcessingParser.lambdaBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLambdaBody;
  /**
   * Visit a parse tree produced by `ProcessingParser.primary`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPrimary;
  /**
   * Visit a parse tree produced by `ProcessingParser.classType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassType;
  /**
   * Visit a parse tree produced by `ProcessingParser.creator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCreator;
  /**
   * Visit a parse tree produced by `ProcessingParser.createdName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCreatedName;
  /**
   * Visit a parse tree produced by `ProcessingParser.innerCreator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitInnerCreator;
  /**
   * Visit a parse tree produced by `ProcessingParser.arrayCreatorRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArrayCreatorRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.classCreatorRest`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitClassCreatorRest;
  /**
   * Visit a parse tree produced by `ProcessingParser.explicitGenericInvocation`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExplicitGenericInvocation;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeArgumentsOrDiamond`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeArgumentsOrDiamond;
  /**
   * Visit a parse tree produced by `ProcessingParser.nonWildcardTypeArgumentsOrDiamond`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNonWildcardTypeArgumentsOrDiamond;
  /**
   * Visit a parse tree produced by `ProcessingParser.nonWildcardTypeArguments`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNonWildcardTypeArguments;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeList;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeType;
  /**
   * Visit a parse tree produced by `ProcessingParser.typeArguments`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeArguments;
  /**
   * Visit a parse tree produced by `ProcessingParser.superSuffix`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSuperSuffix;
  /**
   * Visit a parse tree produced by `ProcessingParser.explicitGenericInvocationSuffix`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExplicitGenericInvocationSuffix;
  /**
   * Visit a parse tree produced by `ProcessingParser.arguments`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArguments;
}
class Transpiler extends ProcessingVisitor {
  main_sketch;
  constructor(main_sketch) {
    super(), this.main_sketch = main_sketch;
  }
  visit = (ctx) => ctx.accept(this);
  visitChildren = (ctx) => ctx.children.map((child) => "children" in child ? this.visit(child) : child.getText()).join("");
  visitProcessingSketch = (ctx) => this.visit(ctx.children[0]);
  visitVariableInitializer = (ctx) => this.visit(ctx.getChild(0));
  visitArrayInitializer = (ctx) => {
    const child_count = ctx.getChildCount();
    let result = "";
    for (let i2 = 0; i2 < child_count; i2++) {
      const child = ctx.getChild(i2);
      child instanceof VariableInitializerContext && (result += (result != "" ? "," : "") + this.visit(child));
    }
    return `[${result}]`;
  };
  visitFormalParameter = (ctx) => ctx.variableDeclaratorId().IDENTIFIER().getText();
  visitLastFormalParameter = (ctx) => (console.log(ctx), `...${ctx.variableDeclaratorId().IDENTIFIER().getText()}`);
  visitExpression = (ctx) => {
    let result = "";
    const child_count = ctx.getChildCount();
    for (let i2 = 0; i2 < child_count; i2++) {
      const child = ctx.getChild(i2);
      if (child instanceof ExpressionContext)
        result += this.visit(child);
      else if (child instanceof CreatorContext)
        result += this.visit(child);
      else if (child instanceof PrimaryContext) {
        const has_bracket = child.LPAREN() != null && child.RPAREN() != null;
        if (has_bracket && (result += "("), child.expression() != null)
          result += this.visit(child.expression());
        else {
          const primary = child.getText(), hex = !!(child.literal()?.hexColorLiteral() ?? !1);
          result += hex ? primary.replace("#", "0x") : primary;
        }
        has_bracket && (result += ")");
      } else child instanceof MethodCallContext ? result += this.visit(child) : result += child.getText() + (child.getText() === "new" ? " " : "");
    }
    return result;
  };
  visitCreator = (ctx) => {
    const child_count = ctx.getChildCount();
    let result = "";
    for (let i2 = 0; i2 < child_count; i2++) {
      const child = ctx.getChild(i2);
      if (child instanceof CreatedNameContext) {
        const _child_count = child.getChildCount();
        for (let j2 = 0; j2 < _child_count; j2++) {
          const _child = child.getChild(j2);
          _child instanceof TypeArgumentsOrDiamondContext ? result += (j2 != 1 ? "." : "") + this.visit(_child) : result += _child.getText();
        }
      } else if (child instanceof ClassCreatorRestContext) {
        const expression_list = child.arguments().expressionList();
        result += `(${expression_list != null ? this.visit(expression_list) : ""})`;
      } else
        result += child.getText();
    }
    return result;
  };
  visitTypeArgumentsOrDiamond = () => "";
  visitTypeArguments = () => "";
  visitTypeList = (ctx) => ctx.typeType_list().map((t2) => this.visit(t2)).join(",");
  visitTypeType = (ctx) => ctx.classOrInterfaceType() ? `${ctx.classOrInterfaceType().IDENTIFIER_list().map((i2) => i2.getText()).join(".")}` : ctx.getText();
}
let class_data = /* @__PURE__ */ new Map();
const async_list = ["settings", "setup", "draw"];
class MemberAnalyzer extends Transpiler {
  class_names = [];
  arg_list = [];
  constructor(main_sketch) {
    super(main_sketch), class_data = /* @__PURE__ */ new Map();
  }
  visitActiveProcessingSketch = (ctx) => (this.class_names.push(this.main_sketch), class_data.set(this.main_sketch, { field: [], method: [], constructor: [], class: ["PApplet"], interface: [] }), this.visitChildren(ctx), this.class_names.pop(), this.mergeByHierarchy(), "");
  visitClassDeclaration = (ctx) => {
    const className = ctx.IDENTIFIER().getText();
    return this.class_names.push(className), class_data.set(className, { field: [], method: [], constructor: [], class: [], interface: [] }), ctx.typeType() != null && class_data.get(className).class.push(this.visit(ctx.typeType())), ctx.typeList()?.typeType_list().forEach((t2) => {
      class_data.get(className).interface.push(this.visit(t2));
    }), this.visit(ctx.classBody()), this.class_names.pop(), "";
  };
  visitInterfaceDeclaration = (ctx) => {
    const interfaceName = ctx.IDENTIFIER().getText();
    return this.class_names.push(interfaceName), class_data.set(interfaceName, { field: [], method: [], constructor: [], class: [], interface: [] }), ctx.typeList()?.typeType_list().forEach((t2) => {
      class_data.get(interfaceName).interface.push(this.visit(t2));
    }), this.visit(ctx.interfaceBody()), this.class_names.pop(), "";
  };
  visitConstructorDeclaration = (ctx) => {
    const data = class_data.get(get_last(this.class_names)), class_name = ctx.IDENTIFIER().getText();
    return this.arg_list = [], this.visit(ctx.formalParameters()), data.constructor.push({ name: class_name, type: class_name, async: !1, override: !1, extended: !1, args: structuredClone(this.arg_list), body: ctx._constructorBody }), "";
  };
  visitMethodDeclaration = (ctx) => {
    const data = class_data.get(get_last(this.class_names)), method_name = ctx.IDENTIFIER().getText();
    this.arg_list = [], this.visit(ctx.formalParameters());
    let is_async = get_last(this.class_names) === _main_sketch && async_list.includes(method_name);
    return data.method.push({ name: method_name, type: ctx.typeTypeOrVoid().getText(), async: is_async, override: !1, extended: !1, args: structuredClone(this.arg_list), body: ctx.methodBody().block() ?? null }), "";
  };
  visitInterfaceMethodDeclaration = (ctx) => {
    const data = class_data.get(get_last(this.class_names)), method_name = ctx.IDENTIFIER().getText();
    return this.arg_list = [], this.visit(ctx.formalParameters()), data.method.push({ name: method_name, type: ctx.typeTypeOrVoid().getText(), async: !1, override: !1, extended: !1, args: structuredClone(this.arg_list), body: ctx.methodBody().block() ?? null }), "";
  };
  visitFormalParameter = (ctx) => {
    const name = ctx.variableDeclaratorId().getText(), type = ctx.typeType().getText();
    return this.arg_list.push({ name, type }), "";
  };
  visitLastFormalParameter = (ctx) => {
    const name = ctx.variableDeclaratorId().getText(), type = ctx.typeType().getText();
    return this.arg_list.push({ name, type: type + "[]", rest: !0 }), "";
  };
  current_type = "";
  visitFieldDeclaration = (ctx) => {
    const is_array = ctx.typeType().LBRACK_list().length > 0 && ctx.typeType().RBRACK_list().length > 0, is_bool = !is_array && ctx.typeType().primitiveType() != null && ctx.typeType().primitiveType().BOOLEAN() != null, is_num = !is_array && ctx.typeType().primitiveType() != null && !is_bool;
    return this.current_type = (is_bool ? "!" : is_num ? "@" : "") + ctx.typeType().getText(), this.visitChildren(ctx), "";
  };
  visitVariableDeclarator = (ctx) => {
    const name = ctx.variableDeclaratorId().IDENTIFIER().getText();
    return class_data.get(get_last(this.class_names)).field.push({ name, init: ctx.variableInitializer(), type: this.current_type, extended: !1 }), "";
  };
  visitConstDeclaration = (ctx) => (this.current_type = ctx.typeType().getText(), this.visitChildren(ctx), "");
  visitConstantDeclarator = (ctx) => {
    const name = ctx.IDENTIFIER().getText();
    return class_data.get(get_last(this.class_names)).field.push({ name, init: ctx.variableInitializer(), type: this.current_type, extended: !1 }), "";
  };
  mergeByHierarchy() {
    const unmerged = new Map(class_data), merged = [];
    let pre_unmerged = unmerged.size;
    do
      pre_unmerged = unmerged.size, unmerged.forEach((v2, k2) => {
        const class_resolved = v2.class.length == 0 || merged.includes(v2.class[0]), interface_resolved = v2.interface.length == 0 || intersect(v2.interface, merged);
        class_resolved && interface_resolved && (this.merge(k2), unmerged.delete(k2), merged.push(k2));
      });
    while (pre_unmerged != unmerged.size);
  }
  merge(className) {
    class_data.set(className, mergeExtendedData(class_data.get(className), class_data));
  }
}
function mergeExtendedData(data, source) {
  return data.class.forEach((c2) => {
    const field_names = data.field.map((f2) => f2.name), method_names = data.method.map((m2) => m2.name), parent = source.get(c2);
    parent?.field.forEach((f2) => {
      f2.name in field_names || data.field.push({ name: f2.name, init: f2.init, type: f2.type, extended: !0 });
    }), parent?.method.forEach((m2) => {
      if (!(m2.name in method_names))
        data.method.push({ name: m2.name, type: m2.type, async: m2.async, override: m2.override, extended: !0, args: m2.args, body: m2.body });
      else {
        const target = data.method.find((_m) => _m.name == m2.name);
        target != null && (target.override = !0);
      }
    });
  }), data.interface.forEach((i2) => {
    const field_names = data.field.map((f2) => f2.name), method_names = data.method.map((m2) => m2.name), parent = source.get(i2);
    parent?.field.forEach((f2) => {
      f2.name in field_names || data.field.push(f2);
    }), parent?.method.forEach((m2) => {
      if (!(m2.name in method_names))
        data.method.push(m2);
      else {
        const target = data.method.find((_m) => _m.name == m2.name);
        target != null && (target.override = !0);
      }
    });
  }), data;
}
function intersect(a2, b2) {
  let contains = !1;
  return a2.forEach((e2) => {
    b2.includes(e2) && (contains = !0);
  }), contains;
}
const replace_list$1 = [{ before: "keyPressed", after: "_keyPressed" }, { before: "keyReleased", after: "_keyReleased" }, { before: "keyTyped", after: "_keyTyped" }, { before: "mousePressed", after: "_mousePressed" }, { before: "mouseReleased", after: "_mouseReleased" }, { before: "mouseClicked", after: "_mouseClicked" }, { before: "mouseMoved", after: "_mouseMoved" }, { before: "mouseDragged", after: "_mouseDragged" }, { before: "mouseWheel", after: "_mouseWheel" }], overloaded_functions = ["frameRate"];
class ReferenceSolver extends Transpiler {
  solved_class_data = /* @__PURE__ */ new Map();
  vatiable_list = [];
  current_class = "";
  constructor() {
    super("");
  }
  solve(class_data2) {
    this.solved_class_data.set("super", { field: [], method: [], constructor: [], class: [], interface: [] }), this.current_class = "super";
    const applet = class_data2.get(_main_sketch), globals = { field: [], method: [] };
    applet.field = applet.field.filter((f2) => (globals.field.push(f2), !1));
    const replace_name = replace_list$1.map((v2) => v2.before);
    return applet.method = applet.method.filter((m2) => !replace_name.includes(m2.name) && !overloaded_functions.includes(m2.name) && applet_instance[m2.name] == null ? (globals.method.push(m2), !1) : !0), globals.field.forEach((f2) => {
      this.solved_class_data.get("super")?.field.push({ name: f2.name, init: f2.init != null ? this.visit(f2.init) : f2.type.startsWith("!") ? "false" : f2.type.startsWith("@") ? "0" : "null", type: f2.type.replace("!", "").replace("@", ""), extended: f2.extended });
    }), globals.method.forEach((m2) => {
      this.vatiable_list = [[...m2.args.map((a2) => a2.name)]], this.solved_class_data.get("super")?.method.push({ name: m2.name, type: m2.type, async: m2.async, override: m2.override, extended: m2.extended, args: m2.args, body: m2.body != null ? this.visit(m2.body).slice(1, -1) : "" });
    }), class_data2.forEach((v2, k2) => {
      if (this.solved_class_data.set(k2, { field: [], method: [], constructor: [], class: v2.class, interface: v2.interface }), this.current_class = k2, this.vatiable_list = [[]], v2.field.forEach((f2) => {
        this.solved_class_data.get(k2)?.field.push({ name: f2.name, init: f2.init != null ? this.visit(f2.init) : f2.type.startsWith("!") ? "false" : f2.type.startsWith("@") ? "0" : "null", type: f2.type.replace("!", "").replace("@", ""), extended: f2.extended });
      }), v2.constructor.forEach((c2) => {
        this.vatiable_list = [[...c2.args.map((a2) => a2.name)]];
        const base = `${this.solved_class_data.get(k2).field.filter((f2) => !f2.extended).map((f2) => `this.${f2.name}=${f2.init}`).join(";") + (this.solved_class_data.get(k2).field.length > 0 ? ";" : "")}${c2.body != null ? this.visit(c2.body).slice(1, -1) : ""}`;
        this.solved_class_data.get(k2)?.constructor.push({ name: c2.name, type: c2.type, async: c2.async, override: c2.override, extended: c2.extended, args: c2.args, body: base });
      }), v2.method.forEach((m2) => {
        this.vatiable_list = [[...m2.args.map((a2) => a2.name)]], this.solved_class_data.get(k2)?.method.push({ name: m2.name, type: m2.type, async: m2.async, override: m2.override, extended: m2.extended, args: m2.args, body: m2.body != null ? this.visit(m2.body).slice(1, -1) : "" });
      }), k2 == _main_sketch) {
        this.solved_class_data.get(k2).constructor.push({ name: k2, type: k2, async: !1, override: !0, extended: !1, args: [], body: "super(arguments[0]);" });
        const setup = this.solved_class_data.get(k2).method.find((m2) => m2.name == "setup");
        if (setup) {
          let match = setup.body.match(/__applet__.size\(\d+,\d+(?:,(?:P2D|P3D))?\);/);
          match || (match = setup.body.match(/__applet__.fullScreen\((?:P2D|P3D|\d+)?\);/));
          let idx = 0;
          match && (idx = match.index + match[0].length), setup.body = [setup.body.slice(0, idx), this.solved_class_data.get(k2).field.filter((f2) => !f2.extended).map((f2) => `this.${f2.name}=${f2.init}`).join(";") + (this.solved_class_data.get(k2).field.length > 0 ? ";" : ""), setup.body.slice(idx)].join("");
        }
        v2.method.forEach((m2, i2) => {
          replace_list$1.forEach((replace) => {
            m2.name == replace.before && (this.solved_class_data.get(k2).method[i2].name = replace.after);
          });
        });
      }
    }), this.solved_class_data;
  }
  visitMethodDeclaration = (ctx) => {
    const method_name = ctx.IDENTIFIER().getText(), arg_list = this.visit(ctx.formalParameters());
    return `function ${method_name}${arg_list}${this.visit(ctx.methodBody())}`;
  };
  visitLocalVariableDeclaration = (ctx) => `let ${this.visit(ctx.variableDeclarators())}`;
  visitStatement = (ctx) => {
    this.vatiable_list.push([]);
    let result = "";
    switch (ctx.getChild(0).getText()) {
      case "return":
        result = `return${ctx.expression(0) != null ? ` ${this.visit(ctx.expression(0))}` : ""};`;
        break;
      case "if":
        ctx.ELSE() != null ? result = `if${this.visit(ctx.parExpression())}${this.visit(ctx.statement_list()[0])}else ${this.visit(ctx.statement_list()[1])}` : result = this.visitChildren(ctx);
        break;
      default:
        result = this.visitChildren(ctx);
        break;
    }
    return this.vatiable_list.pop(), result;
  };
  visitSwitchLabel = (ctx) => ctx.CASE() != null ? `${ctx.CASE()} ${ctx.expression() != null ? this.visit(ctx.expression()) : this.visit(ctx.IDENTIFIER())}:` : `${ctx.DEFAULT()}:`;
  visitVariableDeclaratorId = (ctx) => (this.vatiable_list[this.vatiable_list.length - 1].push(ctx.IDENTIFIER().getText()), ctx.IDENTIFIER().getText());
  visitEnhancedForControl = (ctx) => `let ${this.visit(ctx.variableDeclaratorId())} of ${this.visit(ctx.expression())}`;
  visitVariableInitializer = (ctx) => this.visitChildren(ctx);
  visitArrayInitializer = (ctx) => `[${ctx.variableInitializer_list().map((v2) => this.visit(v2)).join(",")}]`;
  visitExpression = (ctx) => {
    if (ctx.INSTANCEOF() == null) {
      if (ctx.typeType() != null)
        return this.visit(ctx.expression(0));
    }
    return this.current_class == "super" && ctx.children && ctx._bop != null && ctx.expression(0) != null && ctx.expression(0).getText() === "this" && (ctx.children = ctx.children?.slice(2)), this.visitChildren(ctx);
  };
  visitLambdaExpression = (ctx) => {
    this.vatiable_list.push([ctx.lambdaParameters().IDENTIFIER_list().map((i2) => i2.getText()).join(",")]);
    const result = `FunctionalInterface.get(${this.visit(ctx.lambdaParameters())}=>${this.visit(ctx.lambdaBody())})`;
    return this.vatiable_list.pop(), result;
  };
  visitMethodCall = (ctx) => {
    if (ctx.IDENTIFIER() != null) {
      const { is_member, is_applet_member } = isMemberMethod(class_data, this.current_class, ctx), is_overloaded = !is_member && is_applet_member && overloaded_functions.includes(ctx.IDENTIFIER().getText()), length = ctx.IDENTIFIER().getText() == "length" && !(is_member || is_applet_member) && ctx.parentCtx._bop != null && ctx.expressionList() == null;
      return (is_member ? "this." : is_applet_member ? "__applet__." : "") + (is_overloaded ? "_" : "") + ctx.IDENTIFIER() + (length ? "" : `(${ctx.expressionList() != null ? this.visit(ctx.expressionList()) : ""})`);
    } else if (ctx.functionWithPrimitiveTypeName() != null) {
      const _ctx = ctx.functionWithPrimitiveTypeName();
      return `__applet__.${_ctx.getChild(0).getText()}(${_ctx.expressionList() != null ? this.visit(_ctx.expressionList()) : ""})`;
    }
    return this.visitChildren(ctx);
  };
  visitPrimary = (ctx) => {
    if (ctx.IDENTIFIER() != null) {
      const { is_member, is_applet_member } = isMemberVariable(class_data, this.current_class, this.vatiable_list, ctx);
      return (is_member ? "this." : is_applet_member ? "__applet__." : "") + ctx.IDENTIFIER().getText();
    }
    return this.visitChildren(ctx);
  };
  visitLiteral = (ctx) => ctx.hexColorLiteral() != null ? ctx.getText().replace("#", "0x") : ctx.getText();
  visitCreator = (ctx) => {
    if (ctx.arrayCreatorRest() != null) {
      const _ctx = ctx.arrayCreatorRest();
      if (_ctx.arrayInitializer() != null)
        return this.visit(_ctx.arrayInitializer());
      let creator = "";
      return _ctx.expression_list().forEach((e2) => {
        creator += ` Array(${this.visit(e2)}).fill().map(_=>`;
      }), ctx.createdName().primitiveType() != null ? ctx.createdName().getText() == "boolean" ? creator += "false" : creator += "0" : creator += "null", creator += new Array(_ctx.expression_list().length).fill(")").join(""), creator;
    } else if (ctx.classCreatorRest() != null && ctx.classCreatorRest().classBody() != null)
      return " " + this.visit(ctx.classCreatorRest());
    return " " + this.visitChildren(ctx);
  };
  visitClassCreatorRest = (ctx) => {
    if (ctx.classBody() != null) {
      const inner_name = "anonymous", parent = ctx.parentCtx, name = parent instanceof CreatorContext ? get_last(parent.createdName().IDENTIFIER_list()).getText() : ctx.IDENTIFIER().getText(), methods = ctx.classBody().classBodyDeclaration_list().filter((c2) => c2.memberDeclaration() != null).map((m2) => m2.memberDeclaration()).filter((c2) => c2.methodDeclaration() != null).map((m2) => m2.methodDeclaration());
      return `(function(){function ${inner_name}(){};${inner_name}.prototype=new ${name}();${methods.map((m2) => `${inner_name}.prototype.${m2.IDENTIFIER().getText()}=${this.visit(m2).replace(` ${m2.IDENTIFIER().getText()}`, "")};`).join("")}return ${inner_name};}())${this.visit(ctx.arguments())}`;
    } else
      return this.visitChildren(ctx);
  };
  visitNonWildcardTypeArguments = () => "";
  visitNonWildcardTypeArgumentsOrDiamond = () => "";
  visitTypeArgumentsOrDiamond = () => "";
  visitDefaultValue = (ctx) => ctx.getText();
}
function isMemberVariable(class_data2, class_name, variable_data, ctx) {
  const primary = ctx.IDENTIFIER().getText();
  let is_local = !1;
  variable_data.forEach((vd) => {
    vd.forEach((v2) => {
      v2 === primary && (is_local = !0);
    });
  });
  let is_member = !1;
  class_data2.get(class_name)?.field.forEach((field) => {
    primary === field.name && (is_member = !0);
  });
  let is_applet_member = primary in applet_instance && typeof applet_instance[primary] != "function";
  return class_data2.get(_main_sketch)?.field.forEach((field) => {
    primary === field.name && (is_applet_member = !0);
  }), is_member = !is_local && is_member, is_applet_member = !is_local && is_applet_member, { is_member, is_applet_member };
}
function isMemberMethod(class_data2, class_name, ctx) {
  if (ctx.parentCtx.expression_list().length > 0) return { is_member: !1, is_applet_member: !1 };
  const name = ctx.IDENTIFIER().getText();
  let is_member = !1;
  class_data2.get(class_name)?.method.forEach((method) => {
    name === method.name && (is_member = !0);
  }), class_name === _main_sketch && (is_member = !1);
  let is_applet_member = name in applet_instance && (typeof applet_instance[name] == "function" || overloaded_functions.includes(name));
  return class_data2.get(_main_sketch)?.method.forEach((method) => {
    name === method.name && (console.log(name, method, typeof applet_instance[name]), is_applet_member = !0);
  }), { is_member, is_applet_member };
}
const replace_list = [], primitive = ["number", "boolean", "string"];
class Converter {
  convert(solved_class_data) {
    let result = "", globals = "";
    const s2 = solved_class_data.get("super");
    s2.field.forEach((f2) => {
      globals += `let ${f2.name}=${f2.init};
`;
    }), globals += getSafeMethod(s2.method, !1), solved_class_data.delete("super"), solved_class_data.forEach((v2, k2) => {
      result += `class ${k2}${v2.class.length > 0 ? ` extends ${v2.class[0]}` : ""}{
`, result += getSafeConstructor(v2.constructor) + `
`, result += getSafeMethod(v2.method) + `
}`;
    });
    const used_fn = /* @__PURE__ */ new Set(), regx = /__applet__.(\w+)\(/g;
    let match;
    for (; (match = regx.exec(result)) != null; )
      used_fn.add(match[1]);
    return used_fn.forEach((fn) => {
      let instance;
      (instance = applet_instance[fn]) != null && instance.constructor.name === "AsyncFunction" && (result = result.replaceAll(`__applet__.${fn}`, `await __applet__.${fn}`));
    }), replace_list.forEach((replace) => {
      result = result.replace(replace.before, replace.after);
    }), result += `
const __applet__=new ${_main_sketch}(__renderer__);
${globals}
console.log("sketch transpiled!");
return __applet__;`, result;
  }
}
function getType(type) {
  return type.includes("[]") ? type.replace("[]", "").replace(" ", "") + "[]" : type.includes("<") ? type.replace(/<.*?>/, "").replace(" ", "") : type.replace(" ", "").replace(/int|float|long|double|byte|short|color/, "number").replace("char", "string").replace("String", "string");
}
function getSafeMethod(method_data, member = !0) {
  const unique_method = /* @__PURE__ */ new Map();
  method_data.filter((m2) => !m2.extended).forEach((m2) => {
    unique_method.has(m2.name) ? unique_method.get(m2.name).push(m2) : unique_method.set(m2.name, [m2]);
  });
  const method_list = [];
  return unique_method.forEach((v2, k2) => {
    if (v2.length == 1) {
      const method = `${v2[0].async ? "async " : ""}${member ? "" : "function "}${k2}(${v2[0].args.map((a2) => `${a2.rest ? "..." : ""}${a2.name}`).join(",")}){
${v2[0].body}}
`;
      method_list.push(method);
    } else {
      let method = `${v2[0].async ? "async " : ""}${member ? "" : "function "}${k2}(...args){
`;
      v2.forEach((m2) => {
        method += `if(args.length==${m2.args.length}${m2.args.map(getIdentificationExpression)}){
${m2.body == "" && m2.override ? `super.${k2}(args);
` : m2.body}}else `;
      }), method = method.slice(0, -5) + `}
`, method_list.push(method);
    }
  }), method_list.join(`
`);
}
function getSafeConstructor(constructor_data) {
  let constructor_list = "";
  if (constructor_data.length == 0)
    constructor_list = `constructor(){}
`;
  else if (constructor_data.length == 1)
    constructor_list = `constructor(${constructor_data[0].args.map((a2) => `${a2.rest ? "..." : ""}${a2.name}`).join(",")}){
${constructor_data[0].body}}
`;
  else {
    let constructor = `constructor(...args){
`;
    constructor_data.forEach((m2) => {
      constructor += `if(args.length==${m2.args.length}${m2.args.map(getIdentificationExpression)}){
${m2.args.map((v2, i2) => `const ${v2.name}=args[${i2}];
`)}${m2.body}}else `;
    }), constructor = constructor.slice(0, -5) + `}
`, constructor_list = constructor;
  }
  return constructor_list;
}
function getIdentificationExpression(v2, i2) {
  const t2 = getType(v2.type);
  return v2.type.includes("[]") ? `&&Array.isArray(args[${i2}])` : primitive.includes(t2) ? `&&(typeof args[${i2}]==="${t2}"||args[${i2}] instanceof ${t2.charAt(0).toUpperCase() + t2.slice(1)})` : `&&args[${i2}] instanceof ${t2}`;
}
let applet_instance, _main_sketch = "", error_listener;
function transpile(sketch_content, main_sketch) {
  _main_sketch = main_sketch, applet_instance = new PApplet(null), performance.clearMarks(), performance.clearMeasures(), performance.mark("analyze_member()");
  const class_data2 = analyze_member(sketch_content);
  performance.mark("solve_reference()");
  const solved_class_data = solve_reference(class_data2);
  performance.mark("convert()");
  const converted_class_data = convert(solved_class_data);
  return performance.mark("end"), performance.measure("function analyze_member()", "analyze_member()", "solve_reference()"), performance.measure("analyze : new_instance", "new_instance", "read_stream"), performance.measure("analyze : read_stream", "read_stream", "parse_tree"), performance.measure("analyze : parse_tree", "parse_tree", "visit"), performance.measure("analyze : visit", "visit", "end_analyze"), performance.measure("function solve_reference()", "solve_reference()", "convert()"), performance.measure("function convert()", "convert()", "end"), performance.getEntriesByType("measure").forEach((e2) => console.log(`${e2.name} takes ${e2.duration}ms`)), { result: converted_class_data, error: error_listener };
}
function analyze_member(sketch_content) {
  performance.mark("new_instance");
  const member_analyzer = new MemberAnalyzer(_main_sketch);
  performance.mark("read_stream");
  const parser = new ProcessingParser(new Ze(new ProcessingLexer(Xe.fromString(sketch_content))));
  error_listener = new TranspileErrorListener(), parser.addErrorListener(error_listener), performance.mark("parse_tree");
  const tree = parser.processingSketch();
  return performance.mark("visit"), member_analyzer.visit(tree), performance.mark("end_analyze"), class_data;
}
function solve_reference(class_data2) {
  return new ReferenceSolver().solve(class_data2);
}
function convert(solved_class_data) {
  return new Converter().convert(solved_class_data);
}
function get_last(a2) {
  if (a2.length != 0)
    return a2[a2.length - 1];
}
class TranspileErrorListener extends nn {
  error = !1;
  message = "";
  column = 0;
  line = 0;
  syntaxError(recognizer, offendingSymbol, line, column, msg, e2) {
    this.error = !0, this.message = msg, this.column = column, this.line = line;
  }
  getErrorMessage() {
    return this.error ? `${this.message}
line: ${this.line},column: ${this.column}` : "";
  }
}
class Cursor {
  static CUSTOM_CURSOR = -1;
  static DEFAULT_CURSOR = 0;
  static CROSSHAIR_CURSOR = 1;
  static TEXT_CURSOR = 2;
  static WAIT_CURSOR = 3;
  static SW_RESIZE_CURSOR = 4;
  static SE_RESIZE_CURSOR = 5;
  static NW_RESIZE_CURSOR = 6;
  static NE_RESIZE_CURSOR = 7;
  static N_RESIZE_CURSOR = 8;
  static S_RESIZE_CURSOR = 9;
  static W_RESIZE_CURSOR = 10;
  static E_RESIZE_CURSOR = 11;
  static HAND_CURSOR = 12;
  static MOVE_CURSOR = 13;
  type;
  constructor(type) {
    this.type = type;
  }
  getType() {
    return this.type;
  }
}
class ArrayList extends Array {
  constructor(c2) {
    c2 ? typeof c2 == "number" ? (super(c2), this.fill(null)) : super(...c2) : super();
  }
  add(item) {
    this.push(item);
  }
  addAll(item) {
    this.push(...item);
  }
  clear() {
    this.splice(0, this.length);
  }
  contains(v2) {
    return this.includes(v2);
  }
  get(index) {
    return this[index];
  }
  isEmpty() {
    return this.length === 0;
  }
  remove(arg) {
    if (typeof arg == "number")
      arg >= 0 && arg < this.length && this.splice(arg, 1);
    else {
      const index = this.indexOf(arg);
      index !== -1 && this.splice(index, 1);
    }
  }
  removeAll(a2) {
    a2.forEach((e2) => this.remove(this.indexOf(e2)));
  }
  set(index, element) {
    this[index] = element;
  }
  size() {
    return this.length;
  }
  toArray() {
    return new Array(...this);
  }
}
class Runnable {
  run() {
  }
}
class Consumer {
  accept(v2) {
  }
  andThen(v2) {
    this.accept(v2);
  }
}
class Supplier {
  get() {
  }
}
class Function {
  apply(v2) {
  }
  andThen(after) {
    const result = new Function();
    return result.apply = (v2) => after.apply(this.apply(v2)), result;
  }
  compose(before) {
    const result = new Function();
    return result.apply = (v2) => this.apply(before.apply(v2)), result;
  }
}
class FunctionalInterface {
  static get(f2) {
    return new (function() {
      function result() {
      }
      return result.prototype = new Function(), result.prototype.get = f2, result.prototype.test = f2, result.prototype.accept = f2, result.prototype.apply = f2, result.prototype.call = f2, result.prototype.run = f2, result;
    }())();
  }
}
class Event {
  static SHIFT = 1;
  static CTRL = 2;
  static META = 4;
  static ALT = 8;
  // Types of events. As with all constants in Processing, brevity's preferred.
  static KEY = 1;
  static MOUSE = 2;
  static TOUCH = 3;
}
class KeyEvent {
  key;
  keyCode;
  modifiers;
  static PRESS = 1;
  static RELEASE = 2;
  static TYPE = 3;
  constructor(key, keyCode, modifiers) {
    this.modifiers = modifiers, this.key = key, this.keyCode = keyCode;
  }
  getKeyCode() {
    return this.keyCode;
  }
  getKey() {
    return this.key;
  }
}
class MouseEvent extends Event {
  x;
  y;
  button;
  count;
  constructor(x2, y2, button, count) {
    super(), this.x = x2, this.y = y2, this.button = button, this.count = count;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getButton() {
    return this.button;
  }
  getCount() {
    return this.count;
  }
}
class PVector {
  x;
  y;
  z = 0;
  constructor(x2 = 0, y2 = 0, z2 = 0) {
    this.x = x2, this.y = y2, this.z = z2;
  }
  /**
   * Add vector
   * @param args Argments.You can only use `add(vector:PVector)` or `add(x:number,y:number,z?:number)`.
   * @returns Returns own vector.
   */
  add(...args) {
    if (args.length == 1 && args[0].constructor.name === "PVector") {
      const v2 = args[0];
      this.x += v2.x, this.y += v2.y, this.z += v2.z;
    } else if (args.length >= 2 && args.length <= 3 && args[0].constructor.name === "Number" && args[1].constructor.name === "Number" && (args[2] ?? args[1]).constructor.name === "Number") {
      const { x: x2, y: y2, z: z2 } = { x: args[0], y: args[1], z: args[2] ?? 0 };
      this.x += x2, this.y += y2, this.z += z2;
    }
    return this;
  }
  sub(...args) {
    if (args.length == 1 && args[0].constructor.name === "PVector") {
      const v2 = args[0];
      this.x -= v2.x, this.y -= v2.y, this.z -= v2.z;
    } else if (args.length >= 2 && args.length <= 3 && args[0].constructor.name === "Number" && args[1].constructor.name === "Number" && (args[2] ?? args[1]).constructor.name === "Number") {
      const { x: x2, y: y2, z: z2 } = { x: args[0], y: args[1], z: args[2] ?? 0 };
      this.x -= x2, this.y -= y2, this.z -= z2;
    }
    return this;
  }
  mult(scalar) {
    return this.x *= scalar, this.y *= scalar, this.z *= scalar, this;
  }
  div(scalar) {
    if (scalar === 0) throw new Error("Division by zero");
    return this.x /= scalar, this.y /= scalar, this.z /= scalar, this;
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  setMag(len) {
    return this.copy().normalize().mult(len);
  }
  normalize() {
    const mag = this.mag();
    return mag === 0 ? new PVector(0, 0) : (this.x /= mag, this.y /= mag, this.z /= mag, this);
  }
  copy() {
    return new PVector(this.x, this.y, this.z);
  }
  set(...args) {
    if (args.length == 1 && args[0].constructor.name === "PVector") {
      const v2 = args[0];
      this.x = v2.x, this.y = v2.y, this.z = v2.z;
    } else if (args.length >= 2 && args.length <= 3 && args[0].constructor.name === "Number" && args[1].constructor.name === "Number" && (args[2] ?? args[1]).constructor.name === "Number") {
      const { x: x2, y: y2, z: z2 } = { x: args[0], y: args[1], z: args[2] ?? 0 };
      this.x = x2, this.y = y2, this.z = z2;
    }
    return this;
  }
  limit(max) {
    return this.mag() < max ? this : this.setMag(max);
  }
}
class HashMap {
  map;
  constructor(iterable) {
    typeof iterable == "number" ? this.map = /* @__PURE__ */ new Map() : this.map = new Map(iterable);
  }
  containsKey(key) {
    return this.map.has(key);
  }
  containsValue(value) {
    return new Array(...this.map.values()).includes(value);
  }
  get(key) {
    return this.map.get(key);
  }
  getOrDefault(key, value) {
    return this.map.get(key) ?? value;
  }
  isEmpty() {
    return this.map.size === 0;
  }
  keySet() {
    return this.map.keys();
  }
  put(key, value) {
    this.map.set(key, value);
  }
  putIfAbsent(key, value) {
    this.map.has(key) || this.map.set(key, value);
  }
  remove(k2, v2) {
    v2 ? this.map.get(k2) === v2 && this.map.delete(k2) : this.map.delete(k2);
  }
  size() {
    return this.map.size;
  }
  values() {
    return this.map.values();
  }
}
class Runner {
  pre_count = -1;
  initiated = !1;
  scaling = { x: 1, y: 1 };
  log_listeners = [];
  error_listeners = [];
  arg_classes = [{ name: "PApplet", type: PApplet }, { name: "PVector", type: PVector }, { name: "ArrayList", type: ArrayList }, { name: "HashMap", type: HashMap }, { name: "Cursor", type: Cursor }, { name: "Runnable", type: Runnable }, { name: "Consumer", type: Consumer }, { name: "Supplier", type: Supplier }, { name: "Function", type: Function }, { name: "FunctionalInterface", type: FunctionalInterface }];
  convert_button(button) {
    switch (button) {
      case 0:
        button = 37;
        break;
      case 1:
        button = 3;
        break;
      case 2:
        button = 39;
        break;
    }
    return button;
  }
  sign(x2) {
    return x2 < 0 ? -1 : x2 > 0 ? 1 : 0;
  }
  convert_mouse(x2, y2) {
    const rect = this.manager.target_element.getBoundingClientRect();
    return { x: (x2 - rect.left) * this.scaling.x, y: (y2 - rect.top) * this.scaling.y };
  }
  get_maximum_size() {
    const rect = this.manager.target_element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
  addDependency(data, override) {
    const idx = this.arg_classes.findIndex((a2) => a2.name == data.name);
    (idx == -1 || override) && this.arg_classes.push(data), override && idx !== -1 && (this.arg_classes = this.arg_classes.splice(idx, 1));
  }
  getDependentNames() {
    return this.arg_classes.map((a2) => a2.name);
  }
  getDependentClasses() {
    return this.arg_classes.map((a2) => a2.type);
  }
}
class DefaultRunner extends Runner {
  pre_count = -1;
  initiated = !1;
  manager;
  event_queue;
  //queue events to be processed in the next frame
  content_display = !0;
  applet = null;
  last_time = 0;
  constructor(manager) {
    super(), this.manager = manager, this.event_queue = [];
  }
  async init(sketch) {
    this.event_queue = [], this.applet = new globalThis.Function("__renderer__", ...this.arg_classes.map((c2) => c2.name), sketch)({ canvas: this.manager.target_element, base_path: this.manager.base_uri, max_size: this.get_maximum_size() }, ...this.arg_classes.map((c2) => c2.type)), this.applet.width = this.manager.target_element.clientWidth, this.applet.height = this.manager.target_element.clientHeight, this.applet.__log_listener__ = (args) => {
      this.log_listeners.forEach((l2) => l2(args));
    }, this.manager.sketch_resources_promise != null && this.applet.__set_preload__((await this.manager.sketch_resources_promise).map((r2) => ({ path: r2.path, content: new Uint8Array(r2.content).buffer }))), this.manager.base_uri, this.initiated = !0;
    try {
      this.applet.__begin__(), await this.applet.settings(), await this.applet.setup(), this.applet.__end__();
    } catch (e2) {
      e2 instanceof Error && this.error_listeners.forEach((l2) => l2(e2.message)), console.error(e2);
    }
    this.set_scaling(), this.loop();
  }
  async frame() {
    if (!this.applet) return;
    if (!this.initiated) {
      this.applet.__stop__(), console.log("Sketch finished with exit code 0.");
      return;
    }
    const ID = setTimeout(async () => {
      this.frame();
    }, this.content_display ? 1e3 / this.applet.__frameRate__ : 1e3), now = performance.now(), deltaTime = now - this.last_time;
    this.last_time = now, this.applet.frameRate = 1e3 / deltaTime, this.applet.__begin__();
    try {
      (this.applet.__loop__ || this.applet.frameCount == 0) && await this.applet.draw();
    } catch (e2) {
      e2 instanceof Error && this.error_listeners.forEach((l2) => l2(e2.message)), console.error(e2);
    }
    const code = this.applet.__end__();
    for (code != 0 && (clearTimeout(ID), this.applet.__stop__(), this.stop(), console.log(`Sketch finished with exit code ${code}.`)), this.applet.frameCount++, this.applet.pmouseX = this.applet.mouseX, this.applet.pmouseY = this.applet.mouseY; this.event_queue.length > 0; ) {
      const event = this.event_queue.shift();
      let mouse;
      switch (event.name) {
        case "_mousePressed":
          this.applet.mousePressed = !0, mouse = this.convert_mouse(event.event.x, event.event.y), this.applet.mouseX = mouse.x, this.applet.mouseY = mouse.y, this.applet.mouseButton = event.event.button, this.applet._mousePressed(event.event);
          break;
        case "_mouseReleased":
          this.applet.mousePressed = !1, mouse = this.convert_mouse(event.event.x, event.event.y), this.applet.mouseX = mouse.x, this.applet.mouseY = mouse.y, this.applet.mouseButton = event.event.button, this.applet._mouseReleased(event.event);
          break;
        case "_mouseMoved":
          mouse = this.convert_mouse(event.event.x, event.event.y), this.applet.mouseX = mouse.x, this.applet.mouseY = mouse.y, this.applet._mouseMoved(event.event);
          break;
        case "_keyPressed":
          this.applet.keyPressed = !0, this.applet.key = event.event.key, this.applet.keyCode = event.event.keyCode, this.applet._keyPressed(event.event), this.applet._keyTyped(event.event);
          break;
        case "_keyReleased":
          this.applet.keyPressed = !1, this.applet._keyReleased(event.event);
          break;
        case "_mouseWheel":
          this.applet._mouseWheel(event.event);
          break;
        case "_windowResized":
          this.applet._windowResized();
          break;
        default:
          console.error("Unknown event name: " + event.name);
      }
    }
  }
  loop() {
    this.frame();
  }
  stop() {
    this.initiated && (this.initiated = !1);
  }
  on_focus() {
    this.content_display = !0;
  }
  on_blur() {
    this.content_display = !1;
  }
  on_pointermove(e2) {
    this.event_queue.push({ name: "_mouseMoved", event: new MouseEvent(e2.clientX, e2.clientY, this.convert_button(e2.button), 0) });
  }
  on_pointerdown(e2) {
    this.event_queue.push({ name: "_mousePressed", event: new MouseEvent(e2.clientX, e2.clientY, this.convert_button(e2.button), 0) });
  }
  on_pointerup(e2) {
    this.event_queue.push({ name: "_mouseReleased", event: new MouseEvent(e2.clientX, e2.clientY, this.convert_button(e2.button), 0) });
  }
  on_keydown(e2) {
    const modifiers = e2.getModifierState("Shift") ? 1 : 0;
    this.event_queue.push({ name: "_keyPressed", event: new KeyEvent(e2.key, e2.keyCode, modifiers) }), e2.key === "Tab" && e2.preventDefault();
  }
  on_keyup(e2) {
    const modifiers = e2.getModifierState("Shift") ? 1 : 0;
    this.event_queue.push({ name: "_keyReleased", event: new KeyEvent(e2.key, e2.keyCode, modifiers) });
  }
  on_wheel(e2) {
    this.event_queue.push({ name: "_mouseWheel", event: new MouseEvent(e2.clientX, e2.clientY, this.convert_button(e2.button), this.sign(e2.deltaY)) });
  }
  on_resize() {
    this.event_queue.push({ name: "_windowResized", event: new Event() });
  }
  on_contextmenu;
  set_scaling() {
    if (!this.applet) return;
    const rect = this.manager.target_element.getBoundingClientRect();
    this.scaling = { x: this.applet.width / rect.width, y: this.applet.height / rect.height }, this.update_resolution(window.devicePixelRatio / Math.max(this.scaling.x, this.scaling.y));
  }
  get_applet_size() {
    return this.applet ? { w: this.applet.width, h: this.applet.height } : { w: 0, h: 0 };
  }
  get_aspect_ratio() {
    return this.applet ? this.applet.__fullscreen__ ? 0 : this.applet.width / this.applet.height : 0;
  }
  update_resolution(r2) {
    this.applet?.g.updateResolution(r2);
  }
  addEventListener(type, listener) {
    switch (type) {
      case "log":
        this.log_listeners.push(listener);
        break;
      case "error":
        this.error_listeners.push(listener);
        break;
    }
  }
}
class SketchManager {
  runner;
  settings = {
    frameRate: 60,
    thread: "main",
    keep_aspect_ratio: !1
  };
  target_element = null;
  sketch_resources_promise = null;
  base_uri = "";
  constructor(settings) {
    switch (settings && (this.settings = settings), this.settings.thread) {
      case "main":
        this.runner = new DefaultRunner(this);
        break;
      default:
        this.runner = new DefaultRunner(this);
        break;
    }
  }
  /**
   * Set canvas to draw sketch.
   * @param target Canvas which you want to use.
   */
  mountPApplet(target) {
    this.target_element = target, window.addEventListener("focus", () => {
      this.runner.on_focus();
    }), window.addEventListener("blur", () => {
      this.runner.on_blur();
    }), this.initEvent(target);
  }
  /**
   * Load sketch from relative path.
   * @param sketch_path Relative path to sketch folder or sketch data object.
   * @returns Sketch data which required to transpile.
   */
  async loadSketch(sketch_path) {
    this.base_uri = new URL(typeof sketch_path == "string" ? sketch_path : sketch_path.base_uri, document.baseURI).href;
    const sketch_property = typeof sketch_path == "string" ? await (await fetch(new URL(sketch_path + "sketch.properties", document.baseURI))).text() : "", main_sketch = typeof sketch_path == "string" ? sketch_property.match(/\n*(?<!#\s*)main\s*=\s*(.+\.pde)/)[1] : sketch_path.main_sketch;
    let m2;
    const sketch_names = typeof sketch_path == "string" ? (m2 = sketch_property.match(/\n*(?<!#\s*)sketches\s*=((\s*\w+.pde)+)/)) != null ? m2[1].split(/[\s,]+/).map((s2) => s2.trim()) : [main_sketch] : sketch_path.sketches, sketch_resources = typeof sketch_path == "string" ? (m2 = sketch_property.match(/\n*(?<!#\s*)resources\s*=[\s,]*(([\w\.]+[,\s]+)*)/)) != null ? m2[1].split(/[\s,]+/).map((s2) => s2.trim()) : [] : sketch_path.resources ?? [];
    this.sketch_resources_promise = Promise.all(sketch_resources.map(async (resource) => ({ path: resource, content: await fetch(new URL(sketch_path + resource, document.baseURI)).then((res) => res.arrayBuffer()) })));
    const sketch_content = await Promise.all(sketch_names.map(async (name) => ({ name, content: await fetch(new URL(sketch_path + name, document.baseURI)).then((res) => res.text()) })));
    return { main: main_sketch, content: sketch_content };
  }
  /**
   * Load sketch from string.
   * @param sketch Sketch source string
   * @param name Sketch name
   * @param resources Static resource path which your sketch use
   * @returns Sketch data which required to transpile
   */
  loadSketchString(sketch, name, resources) {
    return this.sketch_resources_promise = Promise.all((resources ?? []).map(async (resource) => ({ path: resource, content: await fetch(new URL(resource, document.baseURI)).then((res) => res.arrayBuffer()) }))), { main: name, content: [{ name, content: sketch }] };
  }
  /**
   * Initialize key/pointer events.
   * This method is called internally.
   * @param target_element Canvas
   */
  initEvent(target_element) {
    target_element.addEventListener("pointermove", (e2) => {
      this.runner.on_pointermove && this.runner.on_pointermove(e2);
    }), target_element.addEventListener("pointerdown", (e2) => {
      this.runner.on_pointerdown && this.runner.on_pointerdown(e2);
    }), target_element.addEventListener("pointerup", (e2) => {
      this.runner.on_pointerup && this.runner.on_pointerup(e2);
    }), window.addEventListener("keydown", (e2) => {
      this.runner.on_keydown && this.runner.on_keydown(e2);
    }), window.addEventListener("keyup", (e2) => {
      this.runner.on_keyup && this.runner.on_keyup(e2);
    }), target_element.addEventListener("wheel", (e2) => {
      this.runner.on_wheel && this.runner.on_wheel(e2);
    }, { passive: !0 }), target_element.addEventListener("contextmenu", (e2) => {
      this.runner.on_contextmenu && this.runner.on_contextmenu(e2);
    });
  }
  /**
   * Transpile sketch.
   * @param sketch_data Loaded sketch data
   * @returns Transpiled sketch.
   */
  transpileSketch(sketch_data) {
    let transpiled = transpile(sketch_data.content.map((s2) => s2.content).join(`
`), sketch_data.main.replace(".pde", ""));
    return transpiled.error.error && this.runner.error_listeners.forEach((l2) => l2(transpiled.error.getErrorMessage())), transpiled;
  }
  /**
   * Run transpiled sketch.
   * @param sketch Transpiled sketch
   */
  async runTranspiledSketch(sketch) {
    this.stopSketch(), !(sketch.error != null && sketch.error.error) && (await this.runner.init(sketch.result), this.settings.keep_aspect_ratio && this.setAspectRatio());
  }
  /**
   * Transpile and run sketch.
   * @param sketch_data Loaded sketch data
   * @returns 
   */
  async runSketch(sketch_data) {
    if (this.target_element == null) {
      console.error("target_element is not set. Please call mountPApplet() before runSketch()");
      return;
    }
    const sketch = this.transpileSketch(sketch_data);
    await this.runTranspiledSketch(sketch);
  }
  /**
   * Stop running sketch.
   */
  stopSketch() {
    this.runner.stop();
  }
  getAspectRatio() {
    return this.runner.get_aspect_ratio();
  }
  resize() {
    this.runner.on_resize && this.runner.on_resize(), this.runner.set_scaling(), this.settings.keep_aspect_ratio && this.setAspectRatio();
  }
  setAspectRatio() {
    const rect = this.target_element.parentElement.getBoundingClientRect(), size = this.runner.get_applet_size();
    if (!(size.w == 0 && size.h == 0)) {
      if (this.runner.scaling.x < this.runner.scaling.y) {
        const scale = rect.height / size.h;
        this.target_element.style.width = `${size.w * scale}px`, this.target_element.style.height = `${size.h * scale}px`;
      } else if (this.runner.scaling.y < this.runner.scaling.x) {
        const scale = rect.width / size.w;
        this.target_element.style.height = `${size.h * scale}px`, this.target_element.style.width = `${size.w * scale}px`;
      }
      this.runner.set_scaling();
    }
  }
  /**
   * Add dependent class which is necessary in your sketch.
   * @param data The name and type of dependent class.
   * @param override Whether to override the current dependency if the dependent class has a duplicated name.
   */
  addDependency(data, override) {
    this.runner.addDependency(data, override ?? !1);
  }
  getDependentNames() {
    return this.runner.getDependentNames();
  }
  getDependentClasses() {
    return this.runner.getDependentClasses();
  }
  addEventListener(type, listener) {
    this.runner.addEventListener(type, listener);
  }
}
export {
  SketchManager
};
