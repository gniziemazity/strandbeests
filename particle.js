class Particle {
   constructor(loc, isStatic = false) {
      this.loc = loc;
      this.oldLoc = loc;
      this.isStatic = isStatic;
   }

   update(force) {
      if (this.isStatic) return;

      if(this.hasFriction){
         this.loc=this.oldLoc;
      }
      const vel = this.loc.sub(this.oldLoc);
      this.oldLoc = this.loc;
      this.loc = this.loc.add(vel).add(force);
   }

   constraint(right, bottom) {
      this.loc.x=clamp(this.loc.x, 0, right);
      this.loc.y=clamp(this.loc.y, 0, bottom);
      this.oldLoc = this.loc;
   }

   dist(anotherParticle){
      return dist(this.loc, anotherParticle.loc);
   }

   draw(ctx, rad = 3) {
      ctx.beginPath();
      ctx.arc(this.loc.x, this.loc.y, rad, 0, 2 * Math.PI);
      if(this.marked){
         ctx.fillStyle = "gray";
      }else{
         ctx.fillStyle = "black";
      }
      ctx.fill();
   }
}
