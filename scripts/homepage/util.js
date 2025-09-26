// Interpolate between two values
function lerp(x, y, t) {
  return x * (1 - t) + y * t;
}

// Interpolate between two RGB colors
export function lerpColor([r1, g1, b1], [r2, g2, b2], percent) {
  return [lerp(r1, r2, percent), lerp(g1, g2, percent), lerp(b1, b2, percent)];
}

export function randomColor() {
  return [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ];
}

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
