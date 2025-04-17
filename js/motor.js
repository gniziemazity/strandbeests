class Motor {
   // origin is a particle
   // positive speed means clockwise rotation
   constructor(origin, speed) {
      this.origin = origin;
      this.speed = speed;

      this.angle = -Math.PI / 2; // above origin

      this.levers = [];
   }

   addLever(segment, angleOffset = 0) {
      const tip = segment.p2;
      const lever = new Lever(this.origin, tip, this.angle + angleOffset);
      this.levers.push(lever);
   }

   update() {
      this.levers.forEach((lever) => lever.update(this.speed));
   }
}
