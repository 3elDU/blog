export class Color {
  color: [number, number, number];

  get r() {
    return this.color[0];
  }
  get g() {
    return this.color[1];
  }
  get b() {
    return this.color[2];
  }

  constructor(r: number, g: number, b: number) {
    this.color = [r, g, b];
  }

  static random() {
    return new Color(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    );
  }

  static fromHex(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? new Color(
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        )
      : null;
  }
}

export interface GradientConfig {
  pixelSize: number;
  fps: number;
  cursorColor: {
    from: Color;
    to: Color;
  };
  overrides: Color[];
}

export type FieldCorner = {
  from: Color;
  to: Color;
  current: Color;
};

export type Field = [FieldCorner, FieldCorner, FieldCorner, FieldCorner];

// Global mutable configuration
export const config: GradientConfig = {
  pixelSize: 64,
  fps: 30,
  cursorColor: {
    from: new Color(255, 255, 255),
    to: new Color(255, 255, 255),
  },
  overrides: [],
};
