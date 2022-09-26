let randomStart= 0;

export class Color {
  h: number = 0;
  s: number = 0;
  l: number = 0;
  a: number = 1;
  
  constructor(h: number, s: number, l: number, a?: number) {
    this.h = h;
    this.s = s;
    this.l = l;
    if (a !== undefined) {
      this.a = a;
    }
  }

  lighten(percent: number) {
    return new Color(this.h, this.s, this.l + percent, this.a);
  }

  darken(percent: number) {
    return new Color(this.h, this.s, this.l - percent, this.a);
  }

  toString() {
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
  }

  static fromString(str: string) {
    const reg = /hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(\d+)\)/;
    const match = str.match(reg);
    if (match) {
      return new Color(
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        Number(match[4]),
      );
    }
    return new Color(0, 0, 0);
  }

  static random() {
    randomStart += 60 + Math.floor(Math.random() * 9);
    randomStart = randomStart % 360;
    return new Color(randomStart, 50, 60);
  }
}
