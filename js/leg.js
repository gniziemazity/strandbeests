class Leg {
   constructor(
      originVector,
      givenLengths,
      rotation = 0,
      isFlipped = false,
      staticSupport = false
   ) {
      this.originVector = originVector;
      this.zOffset=this.originVector.z;

      this.#generateLeg(
         this.originVector,
         givenLengths,
         isFlipped,
         rotation,
         staticSupport
      );
      this.tipPath = [];
      this.score = null;
      this.discarded = false;
   }

   // Pieter's implementation
   // a, b, c, d, e, f, g, h, i, j, k, l, m come from diagram
   // n comes later
   #generateCoordinates(originVector, givenLengths, direction, rotation) {
      const { a, b, c, d, e, f, g, h, i, j, k, l, m } = givenLengths;
      const p0 = originVector; //locked
      const p1 = p0.sub(new Vector(0, l)); //locked
      const p2 = p0.add(new Vector(direction * -a, 0)); //locked
      const p3 = p1.add(new Vector(0, -m).rotate(rotation)); //locked

      //Calculate angle of p2 to p3
      const theta1 = Math.atan2(
         l + Math.cos(rotation) * m,
         a + direction * Math.sin(rotation) * m
      );

      //Calculate position of p4
      let w = dist(p2, p3); //Imaginary line between p2 and p3
      const thetaP4a = Math.acos((w ** 2 + b ** 2 - j ** 2) / (2 * w * b)); // Use cosine rule to calculate angle w to b
      const thetaP4 = theta1 + thetaP4a; // Total angle from a to b
      //Calculate position of p4 relative to p2
      const p4 = new Vector(
         p2.x + direction * b * Math.cos(thetaP4),
         p2.y - b * Math.sin(thetaP4)
      );

      //Calculate position of p5
      const thetaP5a = Math.acos((d ** 2 + b ** 2 - e ** 2) / (2 * d * b)); // Use cosine rule to calculate angle b to d
      const thetaP5 = thetaP4 + thetaP5a; // Total angle from a to d
      //Calculate position of p5 relative to p2
      const p5 = new Vector(
         p2.x + direction * d * Math.cos(thetaP5),
         p2.y - d * Math.sin(thetaP5)
      );

      //Calculate position of p6
      const thetaP6a = Math.acos((w ** 2 + c ** 2 - k ** 2) / (2 * w * c)); // Use cosine rule to calculate angle w to c
      const thetaP6 = thetaP6a - theta1; //Total angle from a to c
      //Calculate position of p6 relative to p2
      const p6 = new Vector(
         p2.x + direction * c * Math.cos(thetaP6),
         p2.y + c * Math.sin(thetaP6)
      );

      // //Calculate position of p7
      let v = dist(p5, p6); //Imaginary line between p5 and p6
      const thetaP7a = Math.acos((v ** 2 + d ** 2 - c ** 2) / (2 * v * d)); //Cosine rule to calculate angle d to v
      const thetaP7b = Math.acos((v ** 2 + f ** 2 - g ** 2) / (2 * v * f)); //Cosine rule to calculate angle v to f

      const thetaP7 = thetaP7a + thetaP7b; //Total angle from d to f
      //Calculate position of p7 relative to p5
      let dir = p2.sub(p5).norm(); //Get direction vector from p5 to p2
      const p7 = p5.add(dir.rotate(direction * thetaP7).scale(f)); //Rotate the direction vector by the angle from d to f and scale it by f

      // //Calculate position of p8
      const thetaP8 = Math.acos((g ** 2 + h ** 2 - i ** 2) / (2 * g * h)); //Cosine rule to calculate angle g to h
      // //Calculate position of p8 relative to p7
      dir = p6.sub(p7).norm(); //Get direction vector from p7 to p6
      const p8 = p7.add(dir.rotate(direction * thetaP8).scale(h)); //Rotate the direction vector by the angle from g to h and scale it by h

      return [p0, p1, p2, p3, p4, p5, p6, p7, p8];
   }

   #generateLeg(
      originVector,
      givenLengths,
      isFlipped,
      rotation,
      staticSupport
   ) {
      const dir = isFlipped ? -1 : 1;
      const p = this.#generateCoordinates(
         originVector,
         givenLengths,
         dir,
         rotation
      );
      this.particles = p.map((p) => new Particle(p));
      if (staticSupport) {
         this.particles[0].isStatic = true;
         this.particles[1].isStatic = true;
         this.particles[2].isStatic = true;
      }

      this.sticks = {
         a: new Stick(this.particles[0], this.particles[2]),
         b: new Stick(this.particles[2], this.particles[4]),
         c: new Stick(this.particles[2], this.particles[6]),
         d: new Stick(this.particles[2], this.particles[5]),
         e: new Stick(this.particles[4], this.particles[5]),
         f: new Stick(this.particles[5], this.particles[7]),
         g: new Stick(this.particles[6], this.particles[7]),
         h: new Stick(this.particles[7], this.particles[8]),
         i: new Stick(this.particles[6], this.particles[8]),
         j: new Stick(this.particles[3], this.particles[4]),
         k: new Stick(this.particles[3], this.particles[6]),
         l: new Stick(this.particles[0], this.particles[1]),
         m: new Stick(this.particles[1], this.particles[3], 0xff0000),
         n: new Stick(this.particles[1], this.particles[2]),
      };
   }

   setEndpoints(endpoints) {
      this.particles[0] = endpoints.p0;
      this.particles[1] = endpoints.p1;
      this.sticks["l"] = new Stick(this.particles[0], this.particles[1]);

      if (endpoints.p2) {
         this.particles[2] = endpoints.p2;
         this.sticks["b"] = new Stick(this.particles[2], this.particles[4]);
         this.sticks["c"] = new Stick(this.particles[2], this.particles[6]);
         this.sticks["d"] = new Stick(this.particles[2], this.particles[5]);
         this.sticks["e"] = new Stick(this.particles[4], this.particles[5]);
      }

      this.sticks["a"] = new Stick(this.particles[0], this.particles[2]);
      this.sticks["n"] = new Stick(this.particles[1], this.particles[2]);

      if (endpoints.p3) {
         this.particles[3] = endpoints.p3;
         this.sticks["j"] = new Stick(this.particles[3], this.particles[4]);
         this.sticks["k"] = new Stick(this.particles[3], this.particles[6]);
      }

      this.sticks["m"] = new Stick(this.particles[1], this.particles[3], 0xff0000);
   }

   getEndpoints() {
      return {
         origin: this.particles[1],
         tip: this.particles[3],
         p0: this.particles[0],
         p1: this.particles[1],
         p2: this.particles[2],
         p3: this.particles[3],
         bottom: this.particles[8],
      };
   }

   update(force, canvas, rigidity) {
      for (const particle of this.particles) {
         particle.update(force);
         particle.constraint(canvas.width, canvas.height);
      }

      for (let i = 1; i <= rigidity; i++) {
         for (const key in this.sticks) {
            const stick = this.sticks[key];
            stick.update();
         }
         for (const particle of this.particles) {
            particle.constraint(canvas.width, canvas.height);
         }
      }
   }
}
