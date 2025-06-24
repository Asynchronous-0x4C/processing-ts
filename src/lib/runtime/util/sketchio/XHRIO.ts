import { IOBase } from "./IOBase";

export class XHRIO extends IOBase {
  request(path: string): string {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this.base_path + path, false);
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.send();
    if (xhr.status >= 200 && xhr.status < 300) {
      return xhr.responseText;
    } else {
      throw new Error(`XHRIO request failed: ${xhr.status} ${xhr.statusText}`);
    }
  }
}