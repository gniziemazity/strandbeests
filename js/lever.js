class Lever {
   // pivot and tip are particles
   constructor(pivot, tip, angle = 0) {
      this.pivot = pivot;
      this.tip = tip;
      this.len = dist(this.pivot.loc, this.tip.loc);
      this.angle = angle;
   }

   update(speed) {
      this.angle += speed;
      this.tip.loc.x = this.pivot.loc.x + Math.cos(this.angle) * this.len;
      this.tip.loc.y = this.pivot.loc.y + Math.sin(this.angle) * this.len;
   }
}
