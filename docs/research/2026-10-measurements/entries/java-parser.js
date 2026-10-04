import { parse } from 'java-parser';
const cst = parse('class A { void f(){ int x = 1; } }');
console.log(cst.name);
