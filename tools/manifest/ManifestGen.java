// Dumps the public API of Processing's core classes as JSON (run by tools/manifest/generate.ts).
// Only reflection is used; no Processing source is copied.
import java.lang.reflect.*;
import java.util.*;

public class ManifestGen {
  static final String[] CLASSES = {
    "processing.core.PApplet", "processing.core.PConstants", "processing.core.PGraphics", "processing.core.PImage",
    "processing.core.PShape", "processing.core.PFont", "processing.core.PVector", "processing.core.PMatrix",
    "processing.core.PMatrix2D", "processing.core.PMatrix3D", "processing.core.PStyle", "processing.core.PSurface",
    "processing.opengl.PShader", "processing.opengl.PGraphicsOpenGL", "processing.opengl.PGraphics2D", "processing.opengl.PGraphics3D",
    "processing.data.IntList", "processing.data.FloatList", "processing.data.StringList", "processing.data.DoubleList", "processing.data.LongList",
    "processing.data.IntDict", "processing.data.FloatDict", "processing.data.StringDict", "processing.data.DoubleDict", "processing.data.LongDict",
    "processing.data.Table", "processing.data.TableRow", "processing.data.XML", "processing.data.JSONObject", "processing.data.JSONArray",
    "processing.event.Event", "processing.event.KeyEvent", "processing.event.MouseEvent", "processing.event.TouchEvent",
  };

  public static void main(String[] args) throws Exception {
    StringBuilder out = new StringBuilder();
    out.append("{\n  \"classes\": [\n");
    for (int i = 0; i < CLASSES.length; i++) {
      Class<?> c = Class.forName(CLASSES[i], false, ManifestGen.class.getClassLoader());
      out.append(classJson(c));
      out.append(i < CLASSES.length - 1 ? ",\n" : "\n");
    }
    out.append("  ]\n}\n");
    System.out.print(out);
  }

  static String classJson(Class<?> c) throws Exception {
    StringBuilder b = new StringBuilder();
    b.append("    {\"name\": ").append(q(c.getName()));
    b.append(", \"kind\": ").append(q(c.isInterface() ? "interface" : Modifier.isAbstract(c.getModifiers()) ? "abstract class" : "class"));
    if (c.getSuperclass() != null) b.append(", \"superclass\": ").append(q(c.getSuperclass().getName()));
    b.append(", \"interfaces\": [");
    Class<?>[] ifs = c.getInterfaces();
    for (int i = 0; i < ifs.length; i++) b.append(i > 0 ? ", " : "").append(q(ifs[i].getName()));
    b.append("],\n");

    // Fields declared by this class (inherited ones are listed under their declaring class).
    List<Field> fields = new ArrayList<>();
    for (Field f : c.getDeclaredFields()) if (Modifier.isPublic(f.getModifiers())) fields.add(f);
    fields.sort(Comparator.comparing(Field::getName));
    b.append("     \"fields\": [");
    for (int i = 0; i < fields.size(); i++) {
      Field f = fields.get(i);
      int m = f.getModifiers();
      b.append(i > 0 ? ",\n       " : "\n       ");
      b.append("{\"name\": ").append(q(f.getName())).append(", \"type\": ").append(q(f.getGenericType().getTypeName()));
      if (Modifier.isStatic(m)) b.append(", \"static\": true");
      if (Modifier.isFinal(m)) b.append(", \"final\": true");
      if (Modifier.isStatic(m) && Modifier.isFinal(m) && (f.getType().isPrimitive() || f.getType() == String.class)) {
        Object v = f.get(null);
        b.append(", \"value\": ").append(v instanceof String ? q((String) v) : v instanceof Character ? q(v.toString()) : jsonNumber(v));
      }
      b.append("}");
    }
    b.append(fields.isEmpty() ? "],\n" : "\n     ],\n");

    List<Constructor<?>> ctors = new ArrayList<>();
    for (Constructor<?> k : c.getDeclaredConstructors()) if (Modifier.isPublic(k.getModifiers())) ctors.add(k);
    ctors.sort(Comparator.comparing(ManifestGen::paramKey));
    b.append("     \"constructors\": [");
    for (int i = 0; i < ctors.size(); i++) {
      Constructor<?> k = ctors.get(i);
      b.append(i > 0 ? ",\n       " : "\n       ");
      b.append("{\"params\": ").append(params(k.getGenericParameterTypes()));
      if (k.isVarArgs()) b.append(", \"varargs\": true");
      b.append("}");
    }
    b.append(ctors.isEmpty() ? "],\n" : "\n     ],\n");

    List<Method> methods = new ArrayList<>();
    for (Method m : c.getDeclaredMethods()) if (Modifier.isPublic(m.getModifiers()) && !m.isSynthetic() && !m.isBridge()) methods.add(m);
    methods.sort(Comparator.comparing(Method::getName).thenComparing(ManifestGen::paramKey));
    b.append("     \"methods\": [");
    for (int i = 0; i < methods.size(); i++) {
      Method m = methods.get(i);
      int mod = m.getModifiers();
      b.append(i > 0 ? ",\n       " : "\n       ");
      b.append("{\"name\": ").append(q(m.getName())).append(", \"returns\": ").append(q(m.getGenericReturnType().getTypeName()));
      b.append(", \"params\": ").append(params(m.getGenericParameterTypes()));
      if (Modifier.isStatic(mod)) b.append(", \"static\": true");
      if (Modifier.isAbstract(mod)) b.append(", \"abstract\": true");
      if (m.isVarArgs()) b.append(", \"varargs\": true");
      if (m.isAnnotationPresent(Deprecated.class)) b.append(", \"deprecated\": true");
      b.append("}");
    }
    b.append(methods.isEmpty() ? "]" : "\n     ]");
    b.append("}");
    return b.toString();
  }

  static String paramKey(Executable e) {
    StringBuilder s = new StringBuilder(String.valueOf(e.getParameterCount()));
    for (Class<?> p : e.getParameterTypes()) s.append(',').append(p.getName());
    return s.toString();
  }

  static String params(Type[] types) {
    StringBuilder s = new StringBuilder("[");
    for (int i = 0; i < types.length; i++) s.append(i > 0 ? ", " : "").append(q(types[i].getTypeName()));
    return s.append("]").toString();
  }

  static String jsonNumber(Object v) {
    if (v instanceof Float && (((Float) v).isInfinite() || ((Float) v).isNaN())) return q(v.toString());
    if (v instanceof Double && (((Double) v).isInfinite() || ((Double) v).isNaN())) return q(v.toString());
    return String.valueOf(v);
  }

  static String q(String s) {
    StringBuilder b = new StringBuilder("\"");
    for (char ch : s.toCharArray()) {
      switch (ch) {
        case '"': b.append("\\\""); break;
        case '\\': b.append("\\\\"); break;
        case '\n': b.append("\\n"); break;
        case '\r': b.append("\\r"); break;
        case '\t': b.append("\\t"); break;
        default:
          if (ch < 0x20 || ch > 0x7e) b.append(String.format("\\u%04x", (int) ch));
          else b.append(ch);
      }
    }
    return b.append('"').toString();
  }
}
