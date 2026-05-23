// Custom, styled, accessible range input

import html from "./range.html";
import glass from "../../css/glass";
import base from "../../css/base";

export default class RangeInput extends HTMLElement {
  static observedAttributes = ["min", "max", "value", "step"];

  #shadow = this.attachShadow({ mode: "open" });
  #input?: HTMLInputElement;
  #thumb?: HTMLElement;

  get min() {
    const attr = this.getAttribute("min");
    return attr ? Number.parseFloat(attr) : 0;
  }

  get max() {
    const attr = this.getAttribute("max");
    return attr ? Number.parseFloat(attr) : 100;
  }

  get value() {
    return Number.parseFloat(this.#input!.value);
  }

  constructor() {
    super();

    this.#shadow.innerHTML = html;
    this.#shadow.adoptedStyleSheets = [base, glass];

    this.#input = this.#shadow.getElementById("real") as HTMLInputElement;
    this.#thumb = this.#shadow.getElementById("thumb")!;

    this.#input = this.#shadow.getElementById("real") as HTMLInputElement;
    this.#input.addEventListener("input", this.onChange.bind(this));
  }

  connectedCallback() {
    this.updateThumb();
    this.updateInputAttributes();
  }

  updateInputAttributes() {
    this.#input!.min = this.getAttribute("min") ?? "";
    this.#input!.max = this.getAttribute("max") ?? "";
    this.#input!.value = this.getAttribute("value") ?? "";
    this.#input!.step = this.getAttribute("step") ?? "";
  }

  updateThumb() {
    const offset = ((this.value - this.min) / (this.max - this.min)) * 100;
    this.#thumb!.style.setProperty("--value", `${offset}%`);
  }

  attributeChangedCallback() {
    this.updateInputAttributes();
  }

  onChange() {
    this.updateThumb();
  }

  reset() {
    this.updateInputAttributes();
    this.updateThumb();
  }
}

window.customElements.define("styled-range-input", RangeInput);
