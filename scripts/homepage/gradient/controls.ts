import { recreateInterval, updateCanvasSize } from ".";
import type ExpandablePane from "../../components/expandable-pane";
import type GridColorSelector from "../../components/grid-color-selector";
import type RangeInput from "../../components/range";
import { matches } from "../../helpers/dom";
import { Color, config } from "./model";

const panel = document.getElementById("control-panel")! as ExpandablePane;
const actions = document.getElementById("control-panel-actions") as HTMLElement;

const panelClose = actions.querySelector(".close") as HTMLButtonElement;
const panelOpen = document.getElementById(
  "control-panel-open",
) as HTMLButtonElement;
const cornerButtons = panel.querySelector(".color-buttons") as HTMLElement;
const colorSelector = panel.querySelector(
  "grid-color-selector",
) as GridColorSelector;
const fpsControl = panel.querySelector("#ctrl-fps")! as RangeInput;
const resolutionControl = panel.querySelector(
  "#ctrl-resolution",
)! as RangeInput;

panel.addEventListener("click", () => {
  if (!panel.expanded.value) panel.toggleExpanded();
});

panelClose.addEventListener("click", () => panel.toggleExpanded());

// Reset button
actions.querySelector(".reset")!.addEventListener("click", () => {
  config.overrides = [];

  config.pixelSize = 64;
  config.fps = 30;
  updateCanvasSize();

  fpsControl.reset();
  resolutionControl.reset();

  for (const child of cornerButtons.children) {
    (child as HTMLElement).style.removeProperty("--input-selected-color");
  }
});

let selectingCorner: number;
cornerButtons.addEventListener("click", (event) => {
  if (!matches(event.target, ".styled-color-input")) return;

  event.preventDefault();
  cornerButtons.parentElement!.classList.add("selecting-color");
  selectingCorner = Number.parseInt((event.target as HTMLElement).dataset.idx!);
});

colorSelector.addEventListener("selectcolor", (event) => {
  cornerButtons.parentElement!.classList.remove("selecting-color");

  const color = (event as CustomEvent).detail.color as string;
  (cornerButtons.children[selectingCorner] as HTMLElement).style.setProperty(
    "--input-selected-color",
    color,
  );

  config.overrides[selectingCorner] = Color.fromHex(color)!;
});

fpsControl.addEventListener("input", (event) => {
  config.fps = (event.target as RangeInput).value;
  recreateInterval();
});
resolutionControl.addEventListener("input", (event) => {
  config.pixelSize = (event.target as RangeInput).value;
  updateCanvasSize();
});
