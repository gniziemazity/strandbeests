function clamp(value, min, max) {
   return Math.max(min, Math.min(value, max));
}

function dist(a, b) {
   return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerp(a, b, t) {
   return a + (b - a) * t;
}

function computeArea(path) {
   let sum = 0;
   for (let i = 0; i < path.length - 1; i++) {
      sum += path[i].x * path[i + 1].y - path[i + 1].x * path[i].y;
   }
   return Math.abs(sum / 2);
}

function computeArea(path) {
   if (!Array.isArray(path) || path.length < 3) {
      return 0; // Return 0 for invalid or too small paths
   }
   let area = 0;
   const numPoints = path.length;
   for (let i = 0; i < numPoints; i++) {
      const current = path[i];
      const next = path[(i + 1) % numPoints];
      if (!current?.x || !current?.y || !next?.x || !next?.y) {
         return 0; // Return 0 if any point is invalid
      }
      area += current.x * next.y - next.x * current.y;
   }
   return Math.abs(area / 2);
}

function computeLength(path) {
   let sum = 0;
   for (let i = 0; i < path.length - 1; i++) {
      sum += dist(path[i], path[i + 1]);
   }
   return sum;
}
