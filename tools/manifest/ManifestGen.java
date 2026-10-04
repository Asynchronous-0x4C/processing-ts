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

  // Library model for the compiler's type checker: the Processing classes above, PGL, and the parts of
  // the JDK that sketches use. Supertypes are added automatically.
  static final String[] LIBRARY_ROOTS = {
    "processing.opengl.PGL",
    // java.lang
    "java.lang.Object", "java.lang.String", "java.lang.StringBuilder", "java.lang.StringBuffer", "java.lang.CharSequence",
    "java.lang.Comparable", "java.lang.Iterable", "java.lang.Runnable", "java.lang.Cloneable", "java.lang.AutoCloseable",
    "java.lang.Math", "java.lang.Number", "java.lang.Integer", "java.lang.Long", "java.lang.Short", "java.lang.Byte",
    "java.lang.Float", "java.lang.Double", "java.lang.Character", "java.lang.Boolean", "java.lang.Void", "java.lang.System",
    "java.lang.Thread", "java.lang.Class", "java.lang.Enum", "java.lang.Throwable", "java.lang.Exception",
    "java.lang.RuntimeException", "java.lang.Error", "java.lang.ArithmeticException", "java.lang.ArrayIndexOutOfBoundsException",
    "java.lang.IndexOutOfBoundsException", "java.lang.StringIndexOutOfBoundsException", "java.lang.ClassCastException",
    "java.lang.IllegalArgumentException", "java.lang.IllegalStateException", "java.lang.NullPointerException",
    "java.lang.NumberFormatException", "java.lang.UnsupportedOperationException", "java.lang.InterruptedException",
    "java.lang.CloneNotSupportedException", "java.lang.NegativeArraySizeException", "java.lang.OutOfMemoryError",
    "java.lang.StackOverflowError", "java.lang.AssertionError", "java.lang.Override", "java.lang.Deprecated",
    "java.lang.SuppressWarnings", "java.lang.FunctionalInterface", "java.lang.SafeVarargs",
    // java.io
    "java.io.File", "java.io.Reader", "java.io.Writer", "java.io.BufferedReader", "java.io.BufferedWriter", "java.io.PrintWriter",
    "java.io.PrintStream", "java.io.InputStream", "java.io.OutputStream", "java.io.FileInputStream", "java.io.FileOutputStream",
    "java.io.InputStreamReader", "java.io.OutputStreamWriter", "java.io.FileReader", "java.io.FileWriter", "java.io.StringReader",
    "java.io.StringWriter", "java.io.ByteArrayInputStream", "java.io.ByteArrayOutputStream", "java.io.IOException",
    "java.io.FileNotFoundException", "java.io.UncheckedIOException", "java.io.EOFException",
    // java.util
    "java.util.ArrayList", "java.util.LinkedList", "java.util.HashSet", "java.util.LinkedHashSet", "java.util.TreeSet",
    "java.util.HashMap", "java.util.LinkedHashMap", "java.util.TreeMap", "java.util.Hashtable", "java.util.ArrayDeque",
    "java.util.PriorityQueue", "java.util.Stack", "java.util.Vector", "java.util.Iterator", "java.util.ListIterator",
    "java.util.Map$Entry", "java.util.Collections", "java.util.Arrays", "java.util.Objects", "java.util.Random",
    "java.util.Comparator", "java.util.Optional", "java.util.Date", "java.util.Calendar", "java.util.GregorianCalendar",
    "java.util.Locale", "java.util.Scanner", "java.util.StringJoiner", "java.util.StringTokenizer", "java.util.BitSet",
    "java.util.NoSuchElementException", "java.util.ConcurrentModificationException",
    "java.util.concurrent.ConcurrentHashMap", "java.util.concurrent.CopyOnWriteArrayList",
    // java.util.function
    "java.util.function.Function", "java.util.function.BiFunction", "java.util.function.Consumer", "java.util.function.BiConsumer",
    "java.util.function.Supplier", "java.util.function.Predicate", "java.util.function.BiPredicate", "java.util.function.UnaryOperator",
    "java.util.function.BinaryOperator", "java.util.function.IntFunction", "java.util.function.IntPredicate",
    "java.util.function.IntUnaryOperator", "java.util.function.IntBinaryOperator", "java.util.function.IntConsumer",
    "java.util.function.ToIntFunction", "java.util.function.ToDoubleFunction", "java.util.function.DoubleUnaryOperator",
    "java.util.function.BooleanSupplier", "java.util.function.IntSupplier", "java.util.function.DoubleSupplier",
    // others seen in sketches
    "java.util.regex.Pattern", "java.util.regex.Matcher", "java.text.DecimalFormat", "java.text.SimpleDateFormat",
    "java.math.BigInteger", "java.math.BigDecimal",
    "java.nio.ByteBuffer", "java.nio.IntBuffer", "java.nio.FloatBuffer", "java.nio.ShortBuffer", "java.nio.DoubleBuffer",
    "java.nio.CharBuffer", "java.nio.LongBuffer", "java.nio.ByteOrder",
  };

  public static void main(String[] args) throws Exception {
    if (args.length > 0 && args[0].equals("library")) {
      System.out.print(library());
      return;
    }
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

  // --- compact library model ------------------------------------------------------------------------
  // One JSON array per class: [name, flags, typeParams, superclass, [interfaces], [fields], [constructors], [methods]]
  //   field: [name, signature, flags, constant?]   constructor: [signature, flags]   method: [name, signature, flags]
  // Signatures use the JVM generic signature grammar (JVMS 4.7.9.1) with '.' as the package separator.
  // Flags: 1 static, 2 final, 4 abstract, 8 interface, 16 enum, 32 protected, 64 varargs, 128 default method, 256 annotation,
  // 512 non-public class.

  static String library() throws Exception {
    LinkedHashMap<String, Class<?>> all = new LinkedHashMap<>();
    ArrayDeque<Class<?>> queue = new ArrayDeque<>();
    ClassLoader loader = ManifestGen.class.getClassLoader();
    for (String n : CLASSES) queue.add(Class.forName(n, false, loader));
    for (String n : LIBRARY_ROOTS) queue.add(Class.forName(n, false, loader));
    while (!queue.isEmpty()) {
      Class<?> c = queue.poll();
      // Non-public classes are kept when they are supertypes (StringBuilder's methods are declared in the
      // package-private AbstractStringBuilder); they are flagged so sketches cannot name them.
      if (all.containsKey(c.getName())) continue;
      // java.lang.constant (Constable, ConstantDesc) is implemented by String, Integer, Enum... but is
      // irrelevant to sketches; leaving it out keeps the model consistent after pruning.
      if (c.getName().startsWith("java.lang.constant.")) continue;
      all.put(c.getName(), c);
      if (c.getSuperclass() != null) queue.add(c.getSuperclass());
      Collections.addAll(queue, c.getInterfaces());
      if (c.getDeclaringClass() != null) queue.add(c.getDeclaringClass());
    }
    List<String> names = new ArrayList<>(all.keySet());
    Collections.sort(names);
    StringBuilder b = new StringBuilder("[\n");
    for (int i = 0; i < names.size(); i++) {
      b.append(libraryClass(all.get(names.get(i))));
      b.append(i < names.size() - 1 ? ",\n" : "\n");
    }
    return b.append("]\n").toString();
  }

  static boolean visible(int m) {
    return Modifier.isPublic(m) || Modifier.isProtected(m);
  }

  static int memberFlags(int m) {
    int f = 0;
    if (Modifier.isStatic(m)) f |= 1;
    if (Modifier.isFinal(m)) f |= 2;
    if (Modifier.isAbstract(m)) f |= 4;
    if (Modifier.isProtected(m)) f |= 32;
    return f;
  }

  static String libraryClass(Class<?> c) throws Exception {
    int flags = memberFlags(c.getModifiers()) & ~32;
    if (c.isInterface()) flags = (flags | 8) & ~4;
    if (c.isEnum()) flags |= 16;
    if (c.isAnnotation()) flags |= 256;
    if (!Modifier.isPublic(c.getModifiers())) flags |= 512;
    StringBuilder b = new StringBuilder("[").append(q(c.getName())).append(",").append(flags).append(",");
    b.append(q(typeParams(c.getTypeParameters()))).append(",");
    b.append(c.getGenericSuperclass() == null ? "null" : q(sig(c.getGenericSuperclass()))).append(",[");
    Type[] ifs = c.getGenericInterfaces();
    for (int i = 0; i < ifs.length; i++) b.append(i > 0 ? "," : "").append(q(sig(ifs[i])));
    b.append("],\n  [");

    List<Field> fields = new ArrayList<>();
    for (Field f : c.getDeclaredFields()) if (visible(f.getModifiers()) && !f.isSynthetic()) fields.add(f);
    fields.sort(Comparator.comparing(Field::getName));
    for (int i = 0; i < fields.size(); i++) {
      Field f = fields.get(i);
      int m = f.getModifiers();
      int ff = memberFlags(m) | (f.isEnumConstant() ? 16 : 0);
      b.append(i > 0 ? "," : "").append("[").append(q(f.getName())).append(",").append(q(sig(f.getGenericType()))).append(",").append(ff);
      if (Modifier.isStatic(m) && Modifier.isFinal(m) && Modifier.isPublic(m) && (f.getType().isPrimitive() || f.getType() == String.class)) {
        Object v = f.get(null);
        b.append(",").append(v instanceof String ? q((String) v) : v instanceof Character ? String.valueOf((int) (Character) v) : v instanceof Boolean ? v.toString() : jsonNumber(v));
      }
      b.append("]");
    }
    b.append("],\n  [");

    List<Constructor<?>> ctors = new ArrayList<>();
    for (Constructor<?> k : c.getDeclaredConstructors()) if (visible(k.getModifiers()) && !k.isSynthetic()) ctors.add(k);
    Map<String, Integer> order = declarationOrder(c);
    ctors.sort(Comparator.comparing((Constructor<?> k) -> order.getOrDefault("<init>" + descriptor(k.getParameterTypes(), void.class), Integer.MAX_VALUE)));
    for (int i = 0; i < ctors.size(); i++) {
      Constructor<?> k = ctors.get(i);
      int kf = memberFlags(k.getModifiers()) | (k.isVarArgs() ? 64 : 0);
      b.append(i > 0 ? "," : "").append("[").append(q(methodSig(k.getTypeParameters(), k.getGenericParameterTypes(), void.class, k.getGenericExceptionTypes()))).append(",").append(kf).append("]");
    }
    b.append("],\n  [");

    List<Method> methods = new ArrayList<>();
    for (Method m : c.getDeclaredMethods()) if (visible(m.getModifiers()) && !m.isSynthetic() && !m.isBridge()) methods.add(m);
    // Class file order (= source order): the Java compiler names the first candidates in its messages.
    methods.sort(Comparator.comparing((Method m) -> order.getOrDefault(m.getName() + descriptor(m.getParameterTypes(), m.getReturnType()), Integer.MAX_VALUE)));
    for (int i = 0; i < methods.size(); i++) {
      Method m = methods.get(i);
      int mf = memberFlags(m.getModifiers()) | (m.isVarArgs() ? 64 : 0) | (m.isDefault() ? 128 : 0);
      b.append(i > 0 ? ",\n   " : "").append("[").append(q(m.getName())).append(",")
        .append(q(methodSig(m.getTypeParameters(), m.getGenericParameterTypes(), m.getGenericReturnType(), m.getGenericExceptionTypes()))).append(",").append(mf).append("]");
    }
    return b.append("]]").toString();
  }

  /** JVM descriptor "(IF)V" of an erased signature. */
  static String descriptor(Class<?>[] params, Class<?> ret) {
    StringBuilder s = new StringBuilder("(");
    for (Class<?> p : params) s.append(erasedDescriptor(p));
    return s.append(")").append(erasedDescriptor(ret)).toString();
  }

  static String erasedDescriptor(Class<?> c) {
    if (c.isArray()) return "[" + erasedDescriptor(c.getComponentType());
    if (c.isPrimitive()) return sig(c);
    return "L" + c.getName().replace('.', '/') + ";";
  }

  /**
   * Position of each method ("name" + descriptor) in the class file's method table, which follows the
   * source order. Reflection does not keep it. Read with a minimal class file parser (JVMS 4.1).
   */
  static Map<String, Integer> declarationOrder(Class<?> c) {
    Map<String, Integer> order = new HashMap<>();
    String resource = "/" + c.getName().replace('.', '/') + ".class";
    try (java.io.InputStream raw = c.getResourceAsStream(resource)) {
      if (raw == null) return order;
      java.io.DataInputStream d = new java.io.DataInputStream(new java.io.BufferedInputStream(raw));
      d.readInt();
      d.readUnsignedShort();
      d.readUnsignedShort();
      int count = d.readUnsignedShort();
      String[] utf8 = new String[count];
      for (int i = 1; i < count; i++) {
        int tag = d.readUnsignedByte();
        switch (tag) {
          case 1: utf8[i] = d.readUTF(); break;
          case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: d.readInt(); break;
          case 5: case 6: d.readLong(); i++; break;
          case 7: case 8: case 16: case 19: case 20: d.readUnsignedShort(); break;
          case 15: d.readUnsignedByte(); d.readUnsignedShort(); break;
          default: throw new java.io.IOException("constant pool tag " + tag + " in " + c.getName());
        }
      }
      d.readUnsignedShort();
      d.readUnsignedShort();
      d.readUnsignedShort();
      int interfaces = d.readUnsignedShort();
      for (int i = 0; i < interfaces; i++) d.readUnsignedShort();
      int fields = d.readUnsignedShort();
      for (int i = 0; i < fields; i++) {
        d.readUnsignedShort();
        d.readUnsignedShort();
        d.readUnsignedShort();
        skipAttributes(d);
      }
      int methods = d.readUnsignedShort();
      for (int i = 0; i < methods; i++) {
        d.readUnsignedShort();
        String name = utf8[d.readUnsignedShort()];
        String desc = utf8[d.readUnsignedShort()];
        order.putIfAbsent(name + desc, i);
        skipAttributes(d);
      }
    } catch (java.io.IOException e) {
      throw new RuntimeException(e);
    }
    return order;
  }

  static void skipAttributes(java.io.DataInputStream d) throws java.io.IOException {
    int n = d.readUnsignedShort();
    for (int i = 0; i < n; i++) {
      d.readUnsignedShort();
      int len = d.readInt();
      d.skipNBytes(len);
    }
  }

  static String sig(Type t) {
    if (t instanceof Class) {
      Class<?> c = (Class<?>) t;
      if (c.isArray()) return "[" + sig(c.getComponentType());
      if (c.isPrimitive()) {
        if (c == void.class) return "V";
        if (c == boolean.class) return "Z";
        if (c == byte.class) return "B";
        if (c == char.class) return "C";
        if (c == short.class) return "S";
        if (c == int.class) return "I";
        if (c == long.class) return "J";
        if (c == float.class) return "F";
        return "D";
      }
      return "L" + c.getName() + ";";
    }
    if (t instanceof ParameterizedType) {
      ParameterizedType p = (ParameterizedType) t;
      StringBuilder s = new StringBuilder("L").append(((Class<?>) p.getRawType()).getName()).append("<");
      for (Type a : p.getActualTypeArguments()) s.append(sig(a));
      return s.append(">;").toString();
    }
    if (t instanceof TypeVariable) return "T" + ((TypeVariable<?>) t).getName() + ";";
    if (t instanceof GenericArrayType) return "[" + sig(((GenericArrayType) t).getGenericComponentType());
    if (t instanceof WildcardType) {
      WildcardType w = (WildcardType) t;
      if (w.getLowerBounds().length > 0) return "-" + sig(w.getLowerBounds()[0]);
      Type up = w.getUpperBounds()[0];
      return up == Object.class ? "*" : "+" + sig(up);
    }
    throw new IllegalArgumentException("unknown type " + t);
  }

  static String typeParams(TypeVariable<?>[] tps) {
    if (tps.length == 0) return "";
    StringBuilder s = new StringBuilder("<");
    for (TypeVariable<?> tv : tps) {
      s.append(tv.getName());
      Type[] bounds = tv.getBounds();
      for (int i = 0; i < bounds.length; i++) {
        Type bnd = bounds[i];
        Class<?> raw = bnd instanceof Class ? (Class<?>) bnd : bnd instanceof ParameterizedType ? (Class<?>) ((ParameterizedType) bnd).getRawType() : null;
        // The first bound is the class bound; an interface (or type variable) first bound leaves it empty ("::").
        if (i == 0 && (raw == null || raw.isInterface())) s.append(":");
        s.append(":").append(sig(bnd));
      }
    }
    return s.append(">").toString();
  }

  // Thrown exceptions follow as ^Type (JVMS ThrowsSignature).
  static String methodSig(TypeVariable<?>[] tps, Type[] params, Type ret, Type[] exceptions) {
    StringBuilder s = new StringBuilder(typeParams(tps)).append("(");
    for (Type p : params) s.append(sig(p));
    s.append(")").append(sig(ret));
    for (Type e : exceptions) s.append("^").append(sig(e));
    return s.toString();
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
