declare module "libtess" {
  export class GluTesselator {
    gluTessCallback(which: number, fn: ((...args: any[]) => any) | null): void;
    gluTessProperty(which: number, value: number): void;
    gluTessNormal(x: number, y: number, z: number): void;
    gluTessBeginPolygon(data?: unknown): void;
    gluTessBeginContour(): void;
    gluTessVertex(coords: number[], data: unknown): void;
    gluTessEndContour(): void;
    gluTessEndPolygon(): void;
  }
  export const gluEnum: Record<string, number>;
  export const windingRule: Record<string, number>;
  const libtess: { GluTesselator: typeof GluTesselator; gluEnum: typeof gluEnum; windingRule: typeof windingRule };
  export default libtess;
}
