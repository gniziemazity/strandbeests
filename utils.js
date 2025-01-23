function clamp(value, min, max) {
   return Math.max(min, Math.min(value, max));
}

function dist(a, b) {
   return Math.hypot(a.x - b.x, a.y - b.y);
}

function average(a, b) {
   return new Vector((a.x + b.x) / 2, (a.y + b.y) / 2);
}

function lerp(a, b, t) {
   return a + (b - a) * t;
}
