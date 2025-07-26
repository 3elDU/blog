// Handles the behavior of "I've read this!" button on an article.

document
  .querySelector<HTMLFormElement>("#ive-read-this")!
  .addEventListener("submit", (event) => {
    event.preventDefault();

    if (document.cookie.includes("seen=true")) {
      return;
    }

    const form = event.target as HTMLFormElement;
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        "X-Requested-With": "fetch",
      },
    })
      .then((response) => response.text())
      .then((response) => {
        document.querySelector<HTMLSpanElement>(
          "#ive-read-this .view-counter"
        )!.innerText = response;

        document.querySelector<HTMLButtonElement>(
          '#ive-read-this > button[type="submit"]'
        )!.disabled = true;
      });
  });
