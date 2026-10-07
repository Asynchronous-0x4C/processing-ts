# Third-party notices

processing-ts itself is licensed under the MIT License (see [LICENSE](LICENSE)).
It includes the following third-party components, which keep their own licenses.

## Processing Sans Pro (default font)

- Files: `src/lib/runtime/fonts/ProcessingSansPro-Regular.ttf` (unmodified copy from Processing 4.5.2's core library)
- License: SIL Open Font License, Version 1.1 — full text and copyright notice in [`src/lib/runtime/fonts/ProcessingSansPro-LICENSE.txt`](src/lib/runtime/fonts/ProcessingSansPro-LICENSE.txt)
- Copyright 2010, 2012, 2014 Adobe Systems Incorporated, with Reserved Font Name "Source". "Processing Sans" is Source Sans renamed by the Processing project.
- The font remains under the OFL; it is distributed together with (not relicensed as part of) this MIT-licensed software. Converted or subsetted versions are Modified Versions under the OFL: they must keep the OFL and the copyright notice and must not use the Reserved Font Name "Source".

- Test data: `tests/visual/cases/font_vlw/data/ProcessingSansPro-20.vlw` holds glyph bitmaps rendered from this font by Processing ("Create Font" format, ASCII only). It is a Modified Version under the OFL and keeps the OFL: [`tests/visual/cases/font_vlw/ProcessingSansPro-LICENSE.txt`](tests/visual/cases/font_vlw/ProcessingSansPro-LICENSE.txt). It is not part of the distributed library.

## Lezer Java grammar

- Files: `src/compiler/grammar/processing.grammar` (forked from @lezer/java 1.1.4) and the generated `src/compiler/grammar/parser.ts`
- License: MIT — [`src/compiler/grammar/LICENSE.lezer-java`](src/compiler/grammar/LICENSE.lezer-java), Copyright (C) 2020 by Marijn Haverbeke and others

## Processing preprocessor grammar (current transpiler)

- Files: `src/lib/transpiler/antlr/*.g4` and the generated parser in `src/lib/transpiler/antlr/parser/`
- Origin: Processing's preprocessor grammar; `JavaParser.g4` carries a GNU GPL version 2 header (the parts from grammars-v4 are BSD-licensed).
- Status: scheduled to be removed from the distributed library when the new compiler replaces the current transpiler (docs/ROADMAP.md, P1-9). It will then only be used as a development-time test oracle.
