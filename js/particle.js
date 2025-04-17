class Particle {
   static ID=0;
   constructor(loc, isStatic = false) {
      this.loc = loc;
      this.oldLoc = loc;
      this.isStatic = isStatic;
      this.isConstrained = false; // for drawing purposes
      this.id = Particle.ID++;
   }

   update(force) {
      if (this.isStatic) return;

      const vel = this.loc.sub(this.oldLoc);
      this.oldLoc = this.loc;
      this.loc = this.loc.add(vel).add(force);
   }

   constraint(left, right, bottom) {
      const clamppedLoc = {
         x: clamp(this.loc.x, left, right),
         y: clamp(this.loc.y, 0, bottom),
      };
      this.isConstrained =
         clamppedLoc.x !== this.loc.x || clamppedLoc.y !== this.loc.y;
      this.loc.x = clamppedLoc.x;
      this.loc.y = clamppedLoc.y;
      this.oldLoc = this.loc;
      return this.isConstrained;
   }


   draw(ctx, rad = 3) {
      ctx.beginPath();
      ctx.arc(this.loc.x, this.loc.y, rad, 0, 2 * Math.PI);
      if (this.isConstrained) {
         ctx.fillStyle = "gray";
      } else {
         ctx.fillStyle = "black";
      }
      ctx.fill();
   }

   draw3D(scene) {
      const index = this.id;
      scene.addParticle(this,index);
   }
}
