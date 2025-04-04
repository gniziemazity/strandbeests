class StrandBeest {
   constructor(
      originVector,
      givenLengths,
      useMotor = false,
      speed,
      leftLegCount = 3,
      rightLegCount = 3,
      staticSupport = false
   ) {
      this.givenLengths = givenLengths;

      const leftLegs = [];
      for (let i = 0; i < leftLegCount; i++) {
         const angle = (i * 2 * Math.PI) / 3;
         leftLegs.push(new Leg(originVector, givenLengths, angle, false, staticSupport));
      }

      const rightLegs = [];
      for (let i = 0; i < rightLegCount; i++) {
         const angle = (i * 2 * Math.PI) / 3;
         rightLegs.push(new Leg(originVector, givenLengths, angle, true, staticSupport));
      }

      this.legs = [...leftLegs, ...rightLegs];

      // connecting legs (difficult stuff...)
      const originParticle = leftLegs[0].getEndpoints().origin;

      const { p0, p1, p2, p3 } = leftLegs[0].getEndpoints();

      [1, 2].forEach((i) => {
         if (leftLegs.length > i) {
            leftLegs[i].setEndpoints({ p0, p1, p2 });
         }
      });

      if (rightLegs.length > 0) {
         rightLegs[0].setEndpoints({ p0, p1, p3 });

         const endPoints = rightLegs[0].getEndpoints();

         [1, 2].forEach((i) => {
            rightLegs[i].setEndpoints({
               ...endPoints,
               p3: leftLegs[i].getEndpoints().p3,
            });
         });
      }

      // keeping levers at fixed angles
      this.sticks = [];
      for (let i = 0; i < leftLegs.length; i++) {
         for (let j = i + 1; j < leftLegs.length; j++) {
            this.sticks.push(
               new Stick(
                  leftLegs[i].getEndpoints().tip,
                  leftLegs[j].getEndpoints().tip
               )
            );
         }
      }

      if (useMotor) {
         this.motor = new Motor(originParticle, speed);

         for (let i = 0; i < leftLegs.length; i++) {
            const leftLegEndpoints = leftLegs[i].getEndpoints();
            const angle = (i * 2 * Math.PI) / 3;
            this.motor.addLever(leftLegEndpoints.tip, angle);
         }
         for (let i = 0; i < rightLegs.length; i++) {
            const rightLegEndpoints = rightLegs[i].getEndpoints();
            const angle = (i * 2 * Math.PI) / 3;
            this.motor.addLever(rightLegEndpoints.tip, angle);
         }
      }
      this.disqualified = false;
   }

   getBottomPoints(){
      return this.legs.flatMap((leg) => leg.getEndpoints().bottom);
   }

   getMovingParts() {
      const particles = this.legs.flatMap((leg) => leg.particles);
      const sticks = this.legs.flatMap((leg) => Object.values(leg.sticks));
      for (const stick of this.sticks) {
         sticks.push(stick);
      }
      return { particles, sticks, motor: this.motor };
   }

   draw(ctx) {
      const { particles, sticks } = this.getMovingParts();
      const objects = [...particles, ...sticks];
      objects.forEach((object) => {
         object.draw(ctx);
      });   }
}
