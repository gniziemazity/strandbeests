class Motor {
   constructor(origin, tip, speed = -0.01) {
      this.origin = origin;
      this.tip = tip;
      this.speed = speed;
      this.len = origin.dist(tip);
      this.angle=-Math.PI/2;
   }
   update() {
      this.angle += this.speed;
      this.tip.loc.x = this.origin.loc.x + Math.cos(this.angle) * this.len;
      this.tip.loc.y = this.origin.loc.y + Math.sin(this.angle) * this.len;
   }
}
