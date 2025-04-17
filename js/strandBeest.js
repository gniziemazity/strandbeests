class StrandBeest {
   constructor(
      originVector,
      givenLengths,
      useMotor = false,
      speed,
      leftLegCount = 6,
      rightLegCount = 6,
      staticSupport = false,
      spread = 40
   ) {
      this.givenLengths = givenLengths;

      const getAngle = (i) => (i * (2 * Math.PI)) / 3;
      const getZOffset = (i) => Math.floor(i-leftLegCount/2);
      const leftLegs = [];
      for (let i = 0; i < leftLegCount; i++) {
         const angle = getAngle(i);
         const zOffset = getZOffset(i);
         originVector.z = zOffset * spread;
         leftLegs.push(
            new Leg(originVector, givenLengths, angle, false, staticSupport)
         );
      }

      const rightLegs = [];
      for (let i = 0; i < rightLegCount; i++) {
         const angle = getAngle(i);
         const zOffset = getZOffset(i);
         originVector.z = zOffset * spread;
         rightLegs.push(
            new Leg(originVector, givenLengths, angle, true, staticSupport)
         );
      }

      this.legs = [...leftLegs, ...rightLegs];

      // connecting legs (difficult stuff...)
      const originParticle = leftLegs[0].getEndpoints().origin;

      const { p0, p1, p2, p3 } = leftLegs[0].getEndpoints();

      if (rightLegs.length > 0) {
         rightLegs[0].setEndpoints({ p0, p1, p3 });
      }
      for (let i = 1; i < leftLegs.length; i++) {
         leftLegs[i].setEndpoints({ p0, p1, p2 });

         if (rightLegs.length > 0) {
            const endPoints = rightLegs[0].getEndpoints();

            rightLegs[i].setEndpoints({
               ...endPoints,
               p3: leftLegs[i].getEndpoints().p3,
            });
         }
      }

      // extra stiks to levers at fixed angles
      this.sticks = [];
      for (let i = 0; i < leftLegs.length; i++) {
         for (let j = i + 1; j < leftLegs.length; j++) {
            this.sticks.push(
               new Stick(
                  leftLegs[i].getEndpoints().tip,
                  leftLegs[j].getEndpoints().tip,
                  0x0000ff
               )
            );
         }
      }

      if (useMotor) {
         this.motor = new Motor(originParticle, speed);

         for (let i = 0; i < leftLegs.length; i++) {
            const mStick = leftLegs[i].sticks["m"];
            const angle = (i * 2 * Math.PI) / 3;
            this.motor.addLever(mStick, angle);
         }
         for (let i = 0; i < rightLegs.length; i++) {
            const mStick = rightLegs[i].sticks["m"];
            const angle = (i * 2 * Math.PI) / 3;
            this.motor.addLever(mStick, angle);
         }
      }
      this.disqualified = false;
   }

   getBottomPoints() {
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
      });
   }

   draw3D(scene) {
      for (const leg of this.legs) {
         const particles = leg.particles;
         for(let i=0;i<particles.length;i++){
            particles[i].loc.z = leg.zOffset;
            particles[i].draw3D(scene);
         }

         const sticks = Object.values(leg.sticks).concat(this.sticks);
        
         for(let i=0;i<sticks.length;i++){
            sticks[i].p1.loc.z = leg.zOffset;
            sticks[i].p2.loc.z = leg.zOffset;
            sticks[i].draw3D(scene);
         }
      }
   }
}
