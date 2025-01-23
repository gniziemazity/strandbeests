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

function computeArea(path){
   let sum=0;
   for(let i=0;i<path.length-1;i++){
      sum+=path[i].x*path[i+1].y-path[i+1].x*path[i].y;
   }
   return Math.abs(sum/2);
}

function computeLength(path){
   let sum=0;
   for(let i=0;i<path.length-1;i++){
      sum+=dist(path[i],path[i+1]);
   }
   return sum;
}