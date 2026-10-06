// match() and matchAll(): String[] / String[][] with the whole match first, null when nothing matches.
String html = "<a href=\"one.html\">1</a> <A HREF=\"no\"> <a  href = \"two.html\">";
String[] m = match(html, "href=\"(.*?)\"");
printArray(m);
println(m.length);
println(match(html, "zzz") == null);
String[][] all = matchAll(html, "<\\s*a\\s+href\\s*=\\s*\"(.*?)\"");
println(all.length);
for (String[] row : all) println(row.length + " " + row[0] + " | " + row[1]);
println(matchAll(html, "zzz") == null);
String[] opt = match("ac", "a(b)?(c)");
println(opt.length + " " + opt[1] + " " + opt[2]);
String[][] digits = matchAll("x1y22z333", "[0-9]+");
for (String[] d : digits) print(d[0] + " ");
println();
// Pattern flags: does . match a newline, do ^/$ match at line breaks?
println((match("a\nb", "a.b") != null) + " " + (match("x\nab", "^ab") != null) + " " + (match("ab\nx", "ab$") != null));
