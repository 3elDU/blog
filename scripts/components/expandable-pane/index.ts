import base from "../../css/base";
import { prefersReducedMotion } from "../../css/media";
import html from "./expandable-pane.html";

const openTransitionDuration = () => (prefersReducedMotion.matches ? 0 : 480);
const closeTransitionDuration = () => (prefersReducedMotion.matches ? 0 : 240);

export default class ExpandablePane extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  #panel: HTMLElement;
  #closedContent: HTMLElement;
  #openContent: HTMLElement;

  expanded: { value: boolean };

  constructor() {
    super();

    this.#shadow.adoptedStyleSheets = [base];
    this.#shadow.innerHTML = html;
    this.#panel = this.#shadow.getElementById("panel")!;
    this.#closedContent = this.#shadow.getElementById("closed-content")!;
    this.#openContent = this.#shadow.getElementById("open-content")!;

    this.expanded = new Proxy(
      { value: this.#panel.dataset.open == "true" },
      {
        get: (target, prop) => {
          if (prop === "value") return target.value;
        },
        set: (target, prop, value) => {
          if (prop !== "value" || typeof value !== "boolean") return false;

          target.value = value;
          this.#panel.dataset.open = value.toString();
          return true;
        },
      },
    );
  }

  #measurePanelSize(): {
    closedSize: DOMRect;
    openSize: DOMRect;
  } {
    const prevValue = this.expanded.value;

    this.expanded.value = false;
    const closedSize = this.#panel.getBoundingClientRect();

    this.expanded.value = true;
    const openSize = this.#panel.getBoundingClientRect();

    this.expanded.value = prevValue;
    return { closedSize, openSize };
  }

  async #open() {
    const { closedSize, openSize } = this.#measurePanelSize();

    const panelAnim = this.#panel.animate(
      [
        { width: closedSize.width + "px", height: closedSize.height + "px" },
        {
          width: openSize.width + "px",
          height: openSize.height + "px",
        },
      ],
      {
        duration: openTransitionDuration(),
        easing: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
      },
    );
    const contentAnim = this.#closedContent.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: openTransitionDuration() / 2,
        easing: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
        fill: "forwards",
      },
    );

    await Promise.all([panelAnim.finished, contentAnim.finished]);

    this.expanded.value = true;

    this.#openContent.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: openTransitionDuration() / 2,
      easing: "ease-in-out",
      fill: "forwards",
    });
  }

  async #close() {
    const { closedSize, openSize } = this.#measurePanelSize();

    const panelAnim = this.#panel.animate(
      [
        { width: openSize.width + "px", height: openSize.height + "px" },
        {
          width: closedSize.width + "px",
          height: closedSize.height + "px",
        },
      ],
      {
        duration: closeTransitionDuration(),
        easing: "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
      },
    );
    const contentAnim = this.#openContent.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: closeTransitionDuration() / 2,
        easing: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
        fill: "forwards",
      },
    );

    await Promise.all([panelAnim.finished, contentAnim.finished]);

    this.expanded.value = false;

    this.#closedContent.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: closeTransitionDuration() / 2,
      easing: "ease-in-out",
      fill: "forwards",
    });
  }

  toggleExpanded() {
    if (this.expanded.value) this.#close();
    else this.#open();
  }
}

window.customElements.define("expandable-pane", ExpandablePane);
