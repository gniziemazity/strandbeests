class Motor {
   // origin is a particle
   // positive speed means clockwise rotation
   constructor(origin, speed) {
      this.origin = origin;
      this.speed = speed;

      this.angle = -Math.PI / 2; // above origin

      this.levers = [];
   }

   // tip is a particle
   addLever(tip, angleOffset = 0) {
      const lever = new Lever(this.origin, tip, this.angle + angleOffset);
      this.levers.push(lever);
   }

   update() {
      this.levers.forEach((lever) => lever.update(this.speed));
   }
}
