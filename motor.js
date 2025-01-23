class Motor {
   constructor(origin, tip, speed = 0.01) {
      this.origin = origin;
      this.tip = tip;
      this.speed = speed;
      this.len = origin.dist(tip);
   }
   update() {
      let angle = Math.atan2(
         this.tip.loc.y - this.origin.loc.y,
         this.tip.loc.x - this.origin.loc.x
      );
      angle += this.speed;
      this.tip.loc.x = this.origin.loc.x + Math.cos(angle) * this.len;
      this.tip.loc.y = this.origin.loc.y + Math.sin(angle) * this.len;
   }
}
