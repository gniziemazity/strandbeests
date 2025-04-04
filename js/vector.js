class Vector {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }
   
   sub(v) {
      return new Vector(this.x - v.x, this.y - v.y);
   }

   add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
   }

   scale(s) {
      return new Vector(this.x * s, this.y * s);
   }

   mag() {
      return Math.hypot(this.x, this.y);
   }

   norm() {
      return this.scale(1 / this.mag());
   }
   
   rotate(theta) {
      const x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
      const y = this.x * Math.sin(theta) + this.y * Math.cos(theta);
      return new Vector(x, y);
   }
}
