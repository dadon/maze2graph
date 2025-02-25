const QUARTER = Math.PI / 2;
const HALF = Math.PI;
const THREE_QUARTER = (3 * Math.PI) / 2;
const FULL = 2 * Math.PI;

class SVGPath {
  svg: string;
  dots: string;
  colour: string;
  stroke_width: number;
  opacity: number;
  faint: any;
  S: number;
  S2: number;
  B: number;
  B2: number;
  A: number;
  A2: number;
  R3: number;
  R4: number;
  G: number;
  N: number;
  R: number;
  R2: number;
  Q: number;
  V: number;
  delta: number;
  theta: number;
  draw_with_curves: any;

  constructor(
    colour: string,
    stroke_width: number,
    opacity: number,
    s: number,
    draw_with_curves = false,
    faint = false
  ) {
    this.svg = "";
    this.dots = "";
    this.colour = colour;
    this.stroke_width = stroke_width;
    this.opacity = opacity;
    this.faint = faint;

    this.S = s;
    this.S2 = s / 2.0;
    const g = s * 0.2;
    this.B = s - g;
    const k = 0.5;

    const n =
      -(g / k) +
      0.5 * (s - Math.sqrt((g * (4.0 * g - 3.0 * g * k + 2 * k * s)) / k));

    const r = g / k;
    const q = n + r;
    const v = (g * (-1 + k)) / k;

    const theta = Math.asin(
      (2.0 * g - 2.0 * g * k + k * s) / (2.0 * g - g * k + k * s)
    );

    const delta = theta - Math.PI / 2.0;

    // inside loop
    this.A = g;
    this.A2 = g / 2.0;
    this.B = s - g;
    this.B2 = s - g / 2.0;
    this.R3 = s / 2.0 - g / 2.0;
    this.R4 = s / 2.0 - g;

    this.G = g;
    this.N = n;
    this.R = r;
    this.R2 = s - g - g;
    this.S = s;
    this.S2 = s / 2;
    this.Q = q;
    this.V = v;
    this.delta = delta;
    this.theta = theta;

    this.draw_with_curves = draw_with_curves;
  }

  path(): string {
    return `<path stroke-opacity='${this.opacity}' stroke-width='${this.stroke_width}' stroke='${this.colour}' d='${this.svg}' /> ${this.dots}`;
  }

  dot(x: number, y: number) {
    const a = this.round(x + this.S2);
    const b = this.round(y + this.S2);
    const r = this.round(this.S / 3.0);

    this.dots += `<circle cx='${a}' cy='${b}' r='${r}' fill-opacity='1.0' stroke-opacity='0' fill='#E51919' />`;
  }

  polar(x: number, y: number, radius: number, angle: number): number[] {
    return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)];
  }

  posAngle(angle: number): number {
    if (angle < 0) {
      return angle + FULL;
    }
    return angle;
  }

  round(x: number): string {
    // round and strip trailing zeros after the decimal point
    let s = x.toFixed(2);
    if (s.indexOf(".") > -1) {
      while (s.endsWith("0")) {
        s = s.slice(0, -1);
      }
      if (s.endsWith(".")) {
        s = s.slice(0, -1);
      }
    }
    return s;
  }

  a(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    dir: number = 1
  ) {
    const _s = this.posAngle(startAngle);
    const _e = this.posAngle(endAngle);
    const [a, b] = this.polar(x, y, radius, _s);
    const [c, d] = this.polar(x, y, radius, _e);

    const diff = _e - _s;
    const large = 0 < diff && diff <= Math.PI ? 1 - dir : dir;

    this.svg += `L${this.round(a)} ${this.round(b)} A ${this.round(
      radius
    )} ${this.round(radius)} 0 ${large} ${dir} ${this.round(c)} ${this.round(
      d
    )} `;
  }

  m(x: number, y: number) {
    this.svg += `M ${this.round(x)} ${this.round(y)} `;
  }

  l(x: number, y: number) {
    this.svg += `L ${this.round(x)} ${this.round(y)} `;
  }

  ml(a: number, b: number, c: number, d: number) {
    this.m(a, b);
    this.l(c, d);
  }

  mh(a: number, b: number, x: number) {
    this.ml(a, b, a + x, b);
  }

  mv(a: number, b: number, y: number) {
    this.ml(a, b, a, b + y);
  }

  h(x: number, y: number, v: number) {
    this.ml(x, y + v, x + this.S, y + v);
  }

  v(x: number, y: number, h: number) {
    this.ml(x + h, y, x + h, y + this.S);
  }
}

class SVGPathMazeWalls extends SVGPath {
  render = (grid: number[][]) => {
    const TILES: Record<number, any> = {
      1: this.c1,
      2: this.c2,
      3: this.c3,
      4: this.c4,
      5: this.c5,
      6: this.c6,
      7: this.c7,
      8: this.c8,
      9: this.c9,
      10: this.ca,
      11: this.cb,
      12: this.cc,
      13: this.cd,
      14: this.ce,
      15: this.cf,
      19: this.cg,
      28: this.ch,
    };
    const left_margin = 0;
    const top_margin = 0;

    for (let j = 0; j < grid.length; j++) {
      const row = grid[j];
      const y = top_margin + j * this.S;

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];
        const x = left_margin + i * this.S;

        // if (
        //   (i === 0 && j === 0) ||
        //   (i === row.length - 1 && j === grid.length - 1)
        // ) {
        //   this.dot(x, y);
        // } else {
        try {
          TILES[cell](x, y);
        } catch (e) {
          console.log(`Error: ${e} at ${i}, ${j}`, cell);
        }
        // }
      }
    }
  };

  s0 = (x: number, y: number, radius?: number) => {
    // ┘
    this.m(x + this.A, y);
    if (this.draw_with_curves) {
      if (!radius) {
        radius = this.A;
      }
      this.a(x, y, radius, 0, QUARTER);
    } else {
      this.l(x + this.A, y + this.A);
    }
    this.l(x, y + this.A);
  };

  s1 = (x: number, y: number, radius?: number) => {
    // ┐
    this.m(x, y + this.B);
    if (this.draw_with_curves) {
      if (!radius) {
        radius = this.A;
      }
      this.a(x, y + this.S, radius, THREE_QUARTER, FULL);
    } else {
      this.l(x + this.A, y + this.B);
    }
    this.l(x + this.A, y + this.S);
  };

  s2 = (x: number, y: number, radius?: number) => {
    // └
    this.m(x + this.S, y + this.A);
    if (this.draw_with_curves) {
      if (!radius) {
        radius = this.A;
      }
      this.a(x + this.S, y, radius, QUARTER, HALF);
    } else {
      this.l(x + this.B, y + this.A);
    }
    this.l(x + this.B, y);
  };

  s3 = (x: number, y: number, radius?: number) => {
    // ┌
    this.m(x + this.S, y + this.B);
    if (this.draw_with_curves) {
      if (!radius) {
        radius = this.A;
      }
      this.a(x + this.S, y + this.S, radius, THREE_QUARTER, HALF, 0);
    } else {
      this.l(x + this.B, y + this.B);
    }
    this.l(x + this.B, y + this.S);
  };

  c1 = (x: number, y: number) => {
    this.mv(x + this.B, y, this.Q);
    if (this.draw_with_curves) {
      this.a(
        x + this.S - this.V,
        y + this.N + this.R,
        this.R,
        HALF,
        HALF + this.delta,
        0
      );
      this.a(
        x + this.S2,
        y + this.S2,
        this.S2 - this.G / 2,
        this.theta - QUARTER,
        THREE_QUARTER - this.theta
      );
      this.a(
        x + this.V,
        y + this.N + this.R,
        this.R,
        QUARTER - this.theta,
        THREE_QUARTER + this.theta - this.delta,
        0
      );
    } else {
      this.l(x + this.B, y + this.B);
      this.l(x + this.A, y + this.B);
    }
    this.l(x + this.G, y);
  };

  c2 = (x: number, y: number) => {
    // return;

    this.m(x + this.B, y + this.S);
    if (this.draw_with_curves) {
      this.a(
        x + this.S - this.V,
        y + this.S - this.N - this.R,
        this.R,
        HALF,
        HALF - this.delta
      );
      this.a(
        x + this.S2,
        y + this.S2,
        this.S2 - this.G / 2,
        QUARTER - this.theta,
        this.theta - THREE_QUARTER,
        0
      );
      this.a(
        x + this.V,
        y + this.S - this.N - this.R,
        this.R,
        THREE_QUARTER + this.theta,
        THREE_QUARTER + this.theta - this.delta
      );
    } else {
      this.l(x + this.B, y + this.A);
      this.l(x + this.A, y + this.A);
    }
    this.l(x + this.A, y + this.S);
  };

  c4 = (x: number, y: number) => {
    // ┌──
    // └──
    this.m(x + this.S, y + this.B);
    if (this.draw_with_curves) {
      this.a(
        x + this.S - this.N - this.R,
        y + this.S - this.V,
        this.R,
        THREE_QUARTER,
        THREE_QUARTER + this.delta,
        0
      );
      this.a(
        x + this.S2,
        y + this.S2,
        this.S2 - this.G / 2.0,
        QUARTER + this.delta,
        QUARTER + this.delta - 2 * this.theta
      );
      this.a(
        x + this.S - this.N - this.R,
        y + this.V,
        this.R,
        HALF - this.theta,
        HALF - this.theta + this.delta,
        0
      );
    } else {
      this.l(x + this.G, y + this.B);
      this.l(x + this.A, y + this.A);
    }
    this.l(x + this.S, y + this.A);
  };

  c8 = (x: number, y: number) => {
    this.m(x, y + this.B);
    if (this.draw_with_curves) {
      this.a(
        x + this.N + this.R,
        y + this.S - this.V,
        this.R,
        THREE_QUARTER,
        THREE_QUARTER - this.delta
      );
      this.a(
        x + this.S2,
        y + this.S2,
        this.S2 - this.G / 2.0,
        QUARTER - this.delta,
        QUARTER - this.delta + 2.0 * this.theta,
        0
      );
      this.a(
        x + this.N + this.R,
        y + this.V,
        this.R,
        this.theta,
        this.theta - this.delta
      );
    } else {
      this.l(x + this.B, y + this.B);
      this.l(x + this.B, y + this.A);
    }
    this.l(x, y + this.A);
  };

  c5 = (x: number, y: number) => {
    this.s2(x, y);
    // Big arc
    this.m(x + this.S, y + this.B);
    if (this.draw_with_curves) {
      this.a(x + this.B, y + this.A, this.R2, QUARTER, HALF);
    } else {
      this.l(x + this.A, y + this.B);
    }
    this.l(x + this.A, y);
  };

  c6 = (x: number, y: number) => {
    this.s3(x, y);
    this.m(x + this.S, y + this.A);
    if (this.draw_with_curves) {
      this.a(x + this.B, y + this.B, this.R2, THREE_QUARTER, HALF, 0);
    } else {
      this.l(x + this.A, y + this.A);
    }
    this.l(x + this.A, y + this.S);
  };

  c9 = (x: number, y: number) => {
    this.s0(x, y);
    this.m(x + this.B, y);
    if (this.draw_with_curves) {
      this.a(x + this.A, y + this.A, this.R2, 0, QUARTER);
    } else {
      this.l(x + this.B, y + this.B);
    }
    this.l(x, y + this.B);
  };

  ca = (x: number, y: number) => {
    this.s1(x, y);
    this.m(x, y + this.A);
    if (this.draw_with_curves) {
      this.a(x + this.A, y + this.B, this.R2, THREE_QUARTER, FULL);
    } else {
      this.l(x + this.B, y + this.A);
    }
    this.l(x + this.B, y + this.S);
  };

  c7 = (x: number, y: number) => {
    this.v(x, y, this.A);
    this.s2(x, y);
    this.s3(x, y);
  };

  cb = (x: number, y: number) => {
    this.v(x, y, this.B);
    this.s0(x, y);
    this.s1(x, y);
  };

  c3 = (x: number, y: number) => {
    this.v(x, y, this.A);
    this.v(x, y, this.B);
  };

  cc = (x: number, y: number) => {
    this.h(x, y, this.A);
    this.h(x, y, this.B);
  };

  cd = (x: number, y: number) => {
    this.h(x, y, this.B);
    this.s0(x, y);
    this.s2(x, y);
  };

  ce = (x: number, y: number) => {
    this.h(x, y, this.A);
    this.s1(x, y);
    this.s3(x, y);
  };

  cf = (x: number, y: number) => {
    this.s0(x, y);
    this.s1(x, y);
    this.s2(x, y);
    this.s3(x, y);
  };

  cg = (x: number, y: number) => {
    this.v(x, y, this.A);
    this.v(x, y, this.B);

    this.mh(x, y + this.A, this.A);
    this.mh(x, y + this.B, this.A);

    this.mh(x + this.S, y + this.A, this.B - this.S);
    this.mh(x + this.S, y + this.B, this.B - this.S);
  };

  ch = (x: number, y: number) => {
    this.h(x, y, this.A);
    this.h(x, y, this.B);

    this.mv(x + this.A, y, this.A);
    this.mv(x + this.B, y, this.A);

    this.mv(x + this.A, y + this.B, this.S - this.B);
    this.mv(x + this.B, y + this.B, this.S - this.B);
  };
}

export class SVG {
  stroke_width: number;
  dots: string;
  walls: SVGPathMazeWalls;
  width: number;
  height: number;
  pageWidth: number;
  pageHeight: number;
  S: number;

  constructor(
    grid: number[][],
    { width, height, draw_with_curves, pageWidth, pageHeight, color }: any
  ) {
    this.dots = "";

    const left_margin = 0;

    const page_width = pageWidth;
    const page_height = pageHeight;
    this.pageWidth = page_width;
    this.pageHeight = page_height;

    if (height / width > page_height / page_width) {
      width = Math.ceil((page_width / page_height) * height);
    }

    const s = (page_width - 2 * left_margin) / width;

    this.stroke_width = 1;

    this.walls = new SVGPathMazeWalls(
      color,
      this.stroke_width,
      1.0,
      s,
      draw_with_curves
    );

    this.width = width;
    this.height = height;
    this.S = s;
    this.walls.render(grid);
  }

  image() {
    const w = this.width * this.S;
    const h = this.height * this.S;
    const viewBox = `viewBox="0 0 ${w} ${h}"`;
    const head = `<svg id='maze' xmlns='http://www.w3.org/2000/svg' ${viewBox} width='${w}px' height='${h}px' stroke-width='${this.stroke_width}' fill-opacity='0.0' stroke='black'>`;

    return `${head} ${this.walls.path()} ${this.dots} </svg>`.toString();
  }
}
