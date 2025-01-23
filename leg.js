class Leg {
   static rigidity = 10; // the larger the more rigid
   constructor(x, y, a, b, c, d, e, f, g, h, i, j, k, l, m) {
      this.originVector = new Vector(x, y);
      this.#generateLeg(
         this.originVector,
         a,
         b,
         c,
         d,
         e,
         f,
         g,
         h,
         i,
         j,
         k,
         l,
         m
      );
   }

   calibrate(force, canvas, errTolerance=0.01){
      let err = 1000;
      while (err > errTolerance) {
         err = this.update(force, canvas);
      }
   }

   #generateLeg(originVector, a, b, c, d, e, f, g, h, i, j, k, l, m) {
      this.particles = [
         new Particle(originVector, true), //0
         new Particle(originVector.add(new Vector(0, l)), true), //1
         new Particle(originVector.add(new Vector(0, -m)), true), //2
         new Particle(originVector.add(new Vector(-50, -70))), //3
         new Particle(originVector.add(new Vector(-a, l)), true), //4
         new Particle(originVector.add(new Vector(-20, 70))), //5
         new Particle(originVector.add(new Vector(-100, 20))), //6
         new Particle(originVector.add(new Vector(-80, 70))), //7
         new Particle(originVector.add(new Vector(-20, 110))), //8
      ];

      this.sticks = [
         new Stick(this.particles[4], this.particles[1], a),
         new Stick(this.particles[3], this.particles[4], b),
         new Stick(this.particles[5], this.particles[4], c),
         new Stick(this.particles[6], this.particles[4], d),
         new Stick(this.particles[3], this.particles[6], e),
         new Stick(this.particles[7], this.particles[6], f),
         new Stick(this.particles[5], this.particles[7], g),
         new Stick(this.particles[8], this.particles[7], h),
         new Stick(this.particles[5], this.particles[8], i),
         new Stick(this.particles[2], this.particles[3], j),
         new Stick(this.particles[2], this.particles[5], k),
         new Stick(this.particles[0], this.particles[1], l),
         new Stick(this.particles[0], this.particles[2], m),
      ];

      this.motor = new Motor(this.particles[0], this.particles[2]);
   }

   getTipLocation() {
      return this.particles[8].loc;
   }

   update(force, canvas) {
      this.motor.update();

      for (let i = 1; i <= Leg.rigidity; i++) {
         for (const particle of this.particles) {
            particle.update(force);
            particle.constraint(canvas.width, canvas.height);
         }

         for (const stick of this.sticks) {
            stick.update();
         }
      }

      const avErr =
         this.sticks.map((s) => s.error()).reduce((a, b) => a + b, 0) /
         this.sticks.length;
      return avErr;
   }

   draw(ctx) {
      for (const stick of this.sticks) {
         stick.draw(ctx);
      }
      for (const particle of this.particles) {
         particle.draw(ctx);
      }
   }
}
