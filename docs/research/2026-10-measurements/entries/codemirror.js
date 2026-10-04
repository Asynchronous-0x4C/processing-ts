import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
new EditorView({
  parent: document.body,
  state: EditorState.create({
    doc: 'void setup() {\n  size(200, 200);\n}\n',
    extensions: [lineNumbers(), highlightActiveLine(), history(), indentOnInput(), bracketMatching(),
      syntaxHighlighting(defaultHighlightStyle), keymap.of([...defaultKeymap, ...historyKeymap]), java()],
  }),
});
