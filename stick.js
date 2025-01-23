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
      const scl = norm.scale(scaler / 2)

      if (this.p1.isStatic) {
         this.p2.loc = this.p2.loc.add(scl.scale(2));
      } else if (this.p2.isStatic) {
         this.p1.loc = this.p1.loc.sub(scl.scale(2));
      } else {
         this.p1.loc = this.p1.loc.sub(scl);
         this.p2.loc = this.p2.loc.add(scl);
      }
   }

   intersect(anotherStick) {
      const x1 = this.p1.loc.x;
      const y1 = this.p1.loc.y;
      const x2 = this.p2.loc.x;
      const y2 = this.p2.loc.y;
      const x3 = anotherStick.p1.loc.x;
      const y3 = anotherStick.p1.loc.y;
      const x4 = anotherStick.p2.loc.x;
      const y4 = anotherStick.p2.loc.y;
   
      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (Math.abs(den) < 1e-9) { // Check for parallel or coincident lines
         return false; // Segments are parallel or coincident
      }
   
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
   
      // Use tolerance for comparison to avoid floating-point precision issues
      const epsilon = 0.1;
      if (t >= epsilon && t <= 1 - epsilon && u >= epsilon && u <= 1 - epsilon) {
         return true; // Intersection exists
      }
      return false; // No intersection
   }
   

   draw(ctx, color = "red", lineWidth = 4) {
      const hue = lerp(30, 0, this.error()*10000000000000);
      color = `hsl(${hue},100%,50%)`;
      if(this.intersected){
         color = "gray";
      }
      ctx.beginPath();
      ctx.moveTo(this.p1.loc.x, this.p1.loc.y);
      ctx.lineTo(this.p2.loc.x, this.p2.loc.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
   }
}
