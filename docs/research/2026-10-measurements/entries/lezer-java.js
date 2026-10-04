import { parser } from '@lezer/java';
import { Tree } from '@lezer/common';
const t = parser.parse('class A { void f(){ int x = 1; } }');
let errs = 0;
t.iterate({ enter(n) { if (n.type.isError) errs++; } });
console.log(t instanceof Tree, errs);
