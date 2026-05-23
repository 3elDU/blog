import { randomColor, lerpColor } from "../util";
import { Color, config, Field } from "./model";
import "./controls";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasContainer =
  document.querySelector<HTMLElement>("#canvas-container")!;
const ctx = canvas.getContext("2d")!;

let screenHeight = canvasContainer.clientWidth / config.pixelSize;
let screenWidth = canvasContainer.clientHeight / config.pixelSize;

const mousePixels: {
  x: number;
  y: number;
  alpha: number;
}[] = [];

// top-left, top-right, bottom-left, bottom-right corners
const colors = Array.from({ length: 4 }).map(() => {
  const color = Color.random();

  return {
    from: color,
    to: Color.random(),
    current: color,
  };
}) as Field;
let changingColor = Math.floor(Math.random() * 4);

function render() {
  for (let x = 0; x < screenWidth; x++) {
    for (let y = 0; y < screenHeight; y++) {
      let [r, g, b] = lerpColor(
        (config.overrides[0] ?? colors[0].current).color,
        (config.overrides[1] ?? colors[1].current).color,
        x / screenWidth,
      );
      let [r2, g2, b2] = lerpColor(
        (config.overrides[2] ?? colors[2].current).color,
        (config.overrides[3] ?? colors[3].current).color,
        y / screenHeight,
      );

      ctx.fillStyle = `rgb(${(r + r2) / 2}, ${(g + g2) / 2}, ${(b + b2) / 2})`;
      ctx.fillRect(
        x * config.pixelSize,
        y * config.pixelSize,
        config.pixelSize + 1,
        config.pixelSize + 1,
      );
    }
  }

  for (const pixel of mousePixels) {
    // interpolate cursor color as it fades
    const { from, to } = config.cursorColor;
    const [r, g, b] = lerpColor(from.color, to.color, pixel.alpha);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pixel.alpha / 3})`;
    ctx.fillRect(
      pixel.x * config.pixelSize,
      pixel.y * config.pixelSize,
      config.pixelSize,
      config.pixelSize,
    );
    pixel.alpha -= 1 / config.fps;
    if (pixel.alpha <= 0) {
      mousePixels.splice(mousePixels.indexOf(pixel), 1);
    }
  }
}
setInterval(render, 1000 / config.fps);

let i = 1 / config.fps;
function updateColors() {
  let orig = colors[changingColor].from;
  let newColor = colors[changingColor].to;
  colors[changingColor].current = new Color(
    ...lerpColor(orig.color, newColor.color, i),
  );
  i += 1 / config.fps;

  if (i >= 1) {
    colors[changingColor].from = colors[changingColor].current;
    colors[changingColor].to = Color.random();
    changingColor = Math.floor(Math.random() * 4);
    i = 1 / config.fps;
  }
}
let intervalId = setInterval(updateColors, 1000 / config.fps);

export function recreateInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(updateColors, 1000 / config.fps);
  i = 1 / config.fps;
}

window.onresize = () => {
  updateCanvasSize();
  render();
};

const previousMouseCell = [NaN, NaN];
window.onmousemove = (event) => {
  const x = Math.floor(event.clientX / config.pixelSize);
  const y = Math.floor(event.clientY / config.pixelSize);
  if (x !== previousMouseCell[0] || y !== previousMouseCell[1]) {
    mousePixels.push({
      x,
      y,
      alpha: 1,
    });
    previousMouseCell[0] = x;
    previousMouseCell[1] = y;
  }
};

export function updateCanvasSize() {
  // Scale canvas up to the screen size
  canvas.width = canvasContainer.clientWidth;
  canvas.height = canvasContainer.clientHeight;
  screenWidth = canvasContainer.clientWidth / config.pixelSize;
  screenHeight = canvasContainer.clientHeight / config.pixelSize;
  render();
}
updateCanvasSize();
