// Image files for save()/saveFrame(): PNG and JPEG through the canvas, TIFF and TGA (which browsers
// cannot encode) written here from the ARGB pixels: uncompressed, 8 bits per channel (Processing's
// TGA is run-length encoded; both are valid TGA files).

/** Uncompressed baseline TIFF: RGB, or RGBA (unassociated alpha) for ARGB images, as Processing's .tif. */
export function encodeTIFF(pixels: Int32Array, width: number, height: number, alpha = false): Uint8Array {
  const spp = alpha ? 4 : 3;
  const entries = alpha ? 11 : 10;
  const ifd = 8;
  const bitsAt = ifd + 2 + entries * 12 + 4;
  const dataAt = bitsAt + spp * 2;
  const size = width * height * spp;
  const out = new Uint8Array(dataAt + size);
  const v = new DataView(out.buffer);
  out.set([0x4d, 0x4d, 0, 42]); // big-endian "MM", 42
  v.setUint32(4, ifd);
  v.setUint16(ifd, entries);
  let at = ifd + 2;
  const tag = (id: number, type: number, count: number, value: number) => {
    v.setUint16(at, id);
    v.setUint16(at + 2, type);
    v.setUint32(at + 4, count);
    if (type === 3 && count === 1) v.setUint16(at + 8, value);
    else v.setUint32(at + 8, value);
    at += 12;
  };
  tag(256, 4, 1, width); // ImageWidth
  tag(257, 4, 1, height); // ImageLength
  tag(258, 3, spp, bitsAt); // BitsPerSample 8 each
  tag(259, 3, 1, 1); // Compression: none
  tag(262, 3, 1, 2); // Photometric: RGB
  tag(273, 4, 1, dataAt); // StripOffsets
  tag(277, 3, 1, spp); // SamplesPerPixel
  tag(278, 4, 1, height); // RowsPerStrip
  tag(279, 4, 1, size); // StripByteCounts
  tag(284, 3, 1, 1); // PlanarConfiguration: chunky
  if (alpha) tag(338, 3, 1, 2); // ExtraSamples: unassociated alpha
  v.setUint32(at, 0);
  for (let i = 0; i < spp; i++) v.setUint16(bitsAt + i * 2, 8);
  for (let i = 0, j = dataAt; i < width * height; i++, j += spp) {
    const c = pixels[i];
    out[j] = (c >> 16) & 0xff;
    out[j + 1] = (c >> 8) & 0xff;
    out[j + 2] = c & 0xff;
    if (alpha) out[j + 3] = (c >>> 24) & 0xff;
  }
  return out;
}

/** Uncompressed true-color TGA, top-left origin; 32 bits with alpha for ARGB images, else 24. */
export function encodeTGA(pixels: Int32Array, width: number, height: number, alpha: boolean): Uint8Array {
  const bpp = alpha ? 4 : 3;
  const out = new Uint8Array(18 + width * height * bpp);
  out[2] = 2; // uncompressed true color
  out[12] = width & 0xff;
  out[13] = width >> 8;
  out[14] = height & 0xff;
  out[15] = height >> 8;
  out[16] = bpp * 8;
  out[17] = 0x20 | (alpha ? 8 : 0); // top-left origin, alpha bits
  for (let i = 0, j = 18; i < width * height; i++, j += bpp) {
    const c = pixels[i];
    out[j] = c & 0xff;
    out[j + 1] = (c >> 8) & 0xff;
    out[j + 2] = (c >> 16) & 0xff;
    if (alpha) out[j + 3] = (c >>> 24) & 0xff;
  }
  return out;
}
