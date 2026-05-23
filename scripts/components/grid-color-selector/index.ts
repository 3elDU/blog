import { matches } from "../../helpers/dom";
import html from "./grid-color-selector.html";

export default class GridColorSelector extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });

  static observedAttributes = ["columns", "button-size"];

  static colors = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#cccccc",
    "#ffffff",
    "#3584e4",
    "#069494",
    "#33d17a",
    "#f6d32d",
    "#ff7800",
    "#e01b24",
    "#9141ac",
    "#e68fac",
    "#986a44",
  ];

  constructor() {
    super();

    this.#shadow.innerHTML = html;

    const grid = this.#shadow.querySelector(".color-grid")! as HTMLElement;
    const template = this.#shadow.getElementById(
      "color-button-template",
    ) as HTMLTemplateElement;

    for (const color of GridColorSelector.colors) {
      const clone = template.content.cloneNode(true);
      (clone.childNodes[0] as HTMLElement).style.setProperty("--color", color);
      grid.appendChild(clone);
    }

    grid.addEventListener("click", this.onClick);
  }

  onClick(event: MouseEvent) {
    if (!matches(event.target, "button.color")) return;

    this.dispatchEvent(
      new CustomEvent("selectcolor", {
        bubbles: true,
        composed: true,
        detail: {
          color: (event.target as HTMLElement).style.getPropertyValue(
            "--color",
          ),
        },
      }),
    );
  }

  attributeChangedCallback() {
    this.style.setProperty("--cols", this.getAttribute("columns"));
    this.style.setProperty("--size", this.getAttribute("button-size"));
  }
}

window.customElements.define("grid-color-selector", GridColorSelector);
