class Physics {
   constructor(gravity, wind, rigidity = 150) {
      this.gravity = gravity;
      this.wind = wind;
      this.rigidity = rigidity;
      this.forces = [gravity, wind];
   }

   getAllObjects(objects) {
      const particles = objects.flatMap(
         (object) => object.getMovingParts().particles
      );
      const sticks = objects.flatMap(
         (object) => object.getMovingParts().sticks
      );
      const motors = objects.flatMap((object) => object.getMovingParts().motor);

      return { particles, sticks, motors };
   }
   
   update(objects, width, height) {
      for (const object of objects) {
         const { particles, sticks, motors } = this.getAllObjects([object]);

         const oldParticleLocations = particles.map((particle) => particle.loc);
         motors.forEach((motor) => {
            if (motor) {
               motor.update();
            }
         });
         const wereConstrained = [];
         particles.forEach((particle, index) => {
            this.forces.forEach((force) => {
               particle.update(force);
            });
            const wasConstrained = particle.constraint(0, width, height);
            wereConstrained[index] = wasConstrained;
         });

         for (let i = 1; i <= this.rigidity; i++) {
            for (const stick of sticks) {
               stick.update();
            }
            particles.forEach((particle, index) => {
               const wasConstrained = particle.constraint(0, width, height);
               wereConstrained[index] = wasConstrained;
            });
         }

         for (let i = 0; i < particles.length; i++) {
            if (wereConstrained[i]) {
               particles[i].loc = oldParticleLocations[i];
            }
         }
      }
   }
}
