// Handles the behavior of "I've read this!" button on an article.

import { parse } from "cookie";

const viewButtonEl = document.querySelector<HTMLButtonElement>(
  "#article-views > .view-button"
)!;

const { seen } = parse(document.cookie);

const articleName = /^\/articles\/([a-z-]+)$/.exec(location.pathname)!.at(1)!;

if (!seen) {
  viewButtonEl.disabled = false;
}

async function updateViewCount(method: "get" | "post") {
  fetch(`/api/views/${articleName}`, { method })
    .then((response) => {
      if (!response.ok || response.status !== 200) {
        throw response;
      } else {
        return response.text();
      }
    })
    .then(async (views) => {
      document.querySelector<HTMLSpanElement>(
        "#article-views-paragraph .count"
      )!.innerText = views;
      document
        .getElementById("article-views-paragraph")!
        .classList.add("loaded");
    })
    .catch((error) => {
      console.log(error);
    });
}

updateViewCount("get");

viewButtonEl.addEventListener("click", () => {
  if (seen) {
    return;
  }

  updateViewCount("post");
  viewButtonEl.disabled = true;
});
