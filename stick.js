class Stick {
   constructor(p1, p2, desiredLength = null) {
      this.p1 = p1;
      this.p2 = p2;
      this.desiredLength = desiredLength || p1.dist(p2);
      this.len = p1.dist(p2);
   }

   error() {
      return Math.abs(this.len - this.desiredLength);
   }
   update() {
      if (this.p1.isStatic && this.p2.isStatic) return;

      this.len = lerp(this.len, this.desiredLength, 0.1);

      const dif = this.p1.loc.sub(this.p2.loc);
      const scaler = dif.mag() - this.len;
      const norm = dif.norm();
      const scl = norm.scale(scaler / 2);

      if (this.p1.isStatic) {
         this.p2.loc = this.p2.loc.add(scl.scale(2));
      } else if (this.p2.isStatic) {
         this.p1.loc = this.p1.loc.sub(scl.scale(2));
      } else {
         this.p1.loc = this.p1.loc.sub(scl);
         this.p2.loc = this.p2.loc.add(scl);
      }
   }

   draw(ctx, color = "red", lineWidth = 4) {
      ctx.beginPath();
      ctx.moveTo(this.p1.loc.x, this.p1.loc.y);
      ctx.lineTo(this.p2.loc.x, this.p2.loc.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
   }
}
