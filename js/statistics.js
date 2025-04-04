class Statistics {
   constructor(strandBeests, speed) {
      // speed is the 'step' a fraction of 2 PI
      this.strandBeests = strandBeests;
      this.bottomPointPaths = []; // the points that should be touching the ground
      this.scores = [];
      this.speed = speed;
   }

   update() {
      for (let i = 0; i < this.strandBeests.length; i++) {
         if (!this.bottomPointPaths[i]) {
            this.bottomPointPaths[i] = [];
         }
         const strandBeest = this.strandBeests[i];
         if (this.bottomPointPaths[i].length < (2 * Math.PI) / this.speed) {
            this.bottomPointPaths[i].push(strandBeest.getBottomPoints()[0].loc);
         }
      }
   }

   scorePaths() {
      this.scores = this.bottomPointPaths.map((path) => {
         const bounds = {
            minX: Math.min(...path.map((p) => p.x)),
            maxX: Math.max(...path.map((p) => p.x)),
            minY: Math.min(...path.map((p) => p.y)),
            maxY: Math.max(...path.map((p) => p.y)),
         };
         const centerOfMass = {
            x: path.map((p) => p.x).reduce((a, b) => a + b, 0) / path.length,
            y: path.map((p) => p.y).reduce((a, b) => a + b, 0) / path.length,
         };

         const yOffset =
            1 - (bounds.maxY - centerOfMass.y) / (bounds.maxY - bounds.minY);
         const area = computeArea(path);
         const length = computeLength(path);
         const radiusOfCircle = length / (2 * Math.PI);
         const areaOfCircle = Math.PI * radiusOfCircle ** 2;
         const roundness = area / areaOfCircle;
         // roundness is between 0 and 1, 1 being a perfect circle
         // yOffset is between 0 and 1, bigger is better
         return roundness ** 4 + yOffset;
      });
   }

   drawPaths(ctx) {
      this.scorePaths();
      ctx.save();
      ctx.lineWidth = 2;
      this.bottomPointPaths.forEach((path, index) => {
         const score = this.scores[index];
         ctx.strokeStyle = `hsl(${score * 360}, 100%, 50%)`;
         ctx.beginPath();
         path.forEach((point, i) => {
            if (i === 0) {
               ctx.moveTo(point.x, point.y);
            } else {
               ctx.lineTo(point.x, point.y);
            }
         });
         ctx.stroke();
      });
      ctx.restore();
   }
}
