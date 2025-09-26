// Capture scrolling performance on the device.
// If the scrolling is too junky, disable background transparency and blur to improve performance.

function disableEffects() {
  localStorage.setItem("lowPerformanceMode", true);

  document.body.dataset.lowPerf = "true";

  const blurredElements = document.querySelectorAll(".glass-surface");
  for (const element of blurredElements) {
    element.classList.add("no-blur");
  }

  // Show a button to re-enable all effects
  document.querySelector("#reenable-effects-button").classList.remove("hidden");
  document
    .querySelector("#reenable-effects-button")
    .addEventListener("click", () => {
      localStorage.removeItem("lowPerformanceMode");
      location.reload();
    });
}

let focused = true;

let observing = false;
let observedDelay = 0;
let previousObserveRun = 0;
let observeRuns = 0;
function observeFPS() {
  if (!focused) {
    console.log("No focus. Resetting");
    observeRuns = 0;
    observedDelay = 0;
    observing = false;
    return;
  }

  observing = true;

  // Run for 5 frames, then capture the FPS
  if (observeRuns == 5) {
    const fps = 1000 / (observedDelay / 5);

    if (fps < 30) {
      disableEffects();
    }

    observing = false;
    observedDelay = 0;
    observeRuns = 0;
    return;
  } else if (observeRuns > 0) {
    const elapsed = performance.now() - previousObserveRun;
    observedDelay += elapsed;
  }

  previousObserveRun = performance.now();
  observeRuns++;
  requestAnimationFrame(observeFPS);
}

if (localStorage.getItem("lowPerformanceMode") === "true") {
  disableEffects();
} else {
  document.addEventListener("scroll", () => {
    if (!observing) {
      observeFPS();
    }
  });

  document.addEventListener("blur", () => {
    focused = false;
  });
  document.addEventListener("focus", () => {
    focused = true;
  });
}
