import { parse } from 'opentype.js';
export async function load(url) {
  const font = parse(await (await fetch(url)).arrayBuffer());
  const path = font.getPath('Hello', 0, 0, 72);
  return [path.commands.length, font.getAdvanceWidth('Hello', 72)];
}
load('/font.ttf');
