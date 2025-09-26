interface Transformation {
  moveX: number;
  moveY: number;
  scaleX: number;
  scaleY: number;
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: true)"
);

class DialogAnimation {
  private trigger: HTMLElement;
  private target: HTMLDialogElement;
  private backdrop: HTMLElement | null = null;

  private lock: boolean = false;

  private opts: KeyframeAnimationOptions = {
    duration: 480,
    easing: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
  };
  private reverseOpts: KeyframeAnimationOptions = {
    duration: 240,
    easing: "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
  };

  get lowPerf() {
    return "lowPerf" in document.body.dataset;
  }

  constructor(trigger: HTMLElement, target: HTMLDialogElement) {
    this.trigger = trigger;
    this.target = target;

    this.trigger.addEventListener("click", this.open.bind(this));
    this.target.addEventListener("cancel", this.close.bind(this));
    this.target
      .querySelector("form.close > .button")
      ?.addEventListener("click", this.close.bind(this));
  }

  /**
   * Primary transform is for transforming trigger into target,
   * reverse transform is for transforming target into trigger
   */
  private computeTransforms() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();

    const triggerCenterX = triggerRect.x + triggerRect.width / 2;
    const triggerCenterY = triggerRect.y + triggerRect.height / 2;
    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;

    return {
      primary: {
        moveX: targetCenterX - triggerCenterX,
        moveY: targetCenterY - triggerCenterY,
        scaleX: targetRect.width / triggerRect.width,
        scaleY: targetRect.height / triggerRect.height,
      },
      reverse: {
        moveX: triggerCenterX - targetCenterX,
        moveY: triggerCenterY - targetCenterY,
        scaleX: triggerRect.width / targetRect.width,
        scaleY: triggerRect.height / targetRect.height,
      },
    };
  }

  private buildTransformString(t: Transformation, progress: number): string {
    return `translate(${t.moveX * progress}px, ${t.moveY * progress}px) scale(${
      t.scaleX * progress
    }, ${t.scaleY * progress})`;
  }

  /**
   * 1. animate button spinning
   * 2. at 50% progress, make button transparent and show dialog instead
   * 3. scale dialog to full size
   * 4. make backdrop opaque
   */
  async open() {
    if (this.lock) return;
    this.lock = true;

    this.target.showModal();

    const { primary, reverse } = this.computeTransforms();

    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("dialog-backdrop");
    this.target.insertAdjacentElement("beforebegin", this.backdrop);

    const triggerAnim = this.trigger.animate(
      this.lowPerf
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            {},
            {
              opacity: 1.0,
              borderRadius: 0,
              offset: 0.5,
            },
            {
              transform: this.buildTransformString(primary, 1),
              borderRadius: 0,
              opacity: 0,
            },
          ],
      this.opts
    );
    const dialogAnim = this.target.animate(
      this.lowPerf
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            {
              borderRadius: 0,
              transform: this.buildTransformString(reverse, 1),
              opacity: 0,
            },
            { opacity: 1.0 },
          ],
      this.opts
    );
    const backdropAnim = this.backdrop.animate(
      this.lowPerf
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            {
              offset: 0.5,
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
      this.opts
    );

    try {
      await Promise.all([
        dialogAnim.finished,
        triggerAnim.finished,
        backdropAnim.finished,
      ]);
    } catch (e) {
      return;
    }

    // Remove transforms from button but keep its opacity at 0
    this.trigger.style.opacity = "0";
    this.backdrop.style.opacity = "1";

    this.lock = false;
  }

  async close(event: Event) {
    // prevent default, behavior, play our custom animation instead
    event.preventDefault();

    if (this.lock) return;
    this.lock = true;

    const { reverse } = this.computeTransforms();

    const backdropAnim = this.backdrop!.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      this.reverseOpts
    );
    const targetAnim = this.target.animate(
      this.lowPerf
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            {},
            {
              transform: this.buildTransformString(reverse, 1),
              opacity: 0,
            },
          ],
      this.reverseOpts
    );
    const triggerAnim = this.trigger.animate(
      this.lowPerf
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            {
              // transform: this.buildTransformString(primary, 1),
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
      this.reverseOpts
    );

    await Promise.all([
      backdropAnim.finished,
      triggerAnim.finished,
      targetAnim.finished,
    ]);

    this.target.close();
    this.trigger.style.opacity = "1";
    this.backdrop!.remove();

    this.lock = false;
  }
}

const elementsWithDialogs = document.querySelectorAll<HTMLElement>(
  '[data-toggle="dialog"]'
);

const animations = [];

for (const el of elementsWithDialogs) {
  const target = document.getElementById(el.dataset.target!)!;
  animations.push(new DialogAnimation(el, target as HTMLDialogElement));
}

console.log(`registered ${animations.length} animated dialogs`, animations);
