class Leg {
   static rigidity =50; // the larger the more rigid
   constructor(x, y, a, b, c, d, e, f, g, h, i, j, k, l, m,isFlipped) {
      this.originVector = new Vector(x, y);
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
      this.f = f;
      this.g = g;
      this.h = h;
      this.i = i;
      this.j = j;
      this.k = k;
      this.l = l;
      this.m = m;

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
         m,
         isFlipped
      );
      this.tipPath = [];
      this.score = null;
      this.discarded=false;
   }

   static mutate(leg, x, y, mutationRate = 0.1, stepSize = 30) {
      const newLeg = new Leg(
         x,
         y,
         lerp(leg.a, leg.a + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.b, leg.b + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.c, leg.c + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.d, leg.d + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.e, leg.e + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.f, leg.f + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.g, leg.g + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.h, leg.h + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.i, leg.i + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.j, leg.j + (Math.random() - 0.5) * stepSize, mutationRate),
         lerp(leg.k, leg.k + (Math.random() - 0.5) * stepSize, mutationRate),
         leg.l,
         leg.m
      );
      return newLeg;
   }

   calibrate(force, canvas) {
      let err = 1000;
      let prevErr = 1001;
      while (err < prevErr) {
         prevErr = err;
         err = this.update(force, canvas, false,false);
      }

      while(this.motor.angle > -Math.PI * 2 - Math.PI / 2){
         this.update(force, canvas, true, false);
      }
      
      this.tipPath = [];
      this.motor.angle = -Math.PI/2;
      while(this.motor.angle > -Math.PI * 2 - Math.PI / 2){
         this.update(force, canvas, true, true);
      }

   }

   #scoringFirstDraft() {
      let score = 0;
      for (let i = 1; i < this.tipPath.length; i++) {
         const prevPoint = this.tipPath[i - 1];
         const curPoint = this.tipPath[i];
         if (prevPoint.x < curPoint.x) {
            // tip moving towards the right
            const deltaY = Math.abs(curPoint.y - prevPoint.y);
            const deltaX = Math.abs(curPoint.x - prevPoint.x);
            score += deltaX / deltaY;
         }
      }
      return score;
   }

   #scoringSecondDraft() {
      const yDiffs = [];
      for (let i = 1; i < this.tipPath.length; i++) {
         const prevPoint = this.tipPath[i - 1];
         const curPoint = this.tipPath[i];
         yDiffs.push(curPoint.y - prevPoint.y);
      }

      const stDev = Math.sqrt(
         yDiffs.map((y) => Math.pow(y, 2)).reduce((a, b) => a + b, 0) /
            yDiffs.length
      );

      return stDev;
   }

   scorePath() {
      this.score = 0;

      if(this.discarded){
         return;
      }

      const bounds = {
         minX: Math.min(...this.tipPath.map((p) => p.x)),
         maxX: Math.max(...this.tipPath.map((p) => p.x)),
         minY: Math.min(...this.tipPath.map((p) => p.y)),
         maxY: Math.max(...this.tipPath.map((p) => p.y)),
      };
      this.centerOfMass={
         x:this.tipPath.map((p) => p.x).reduce((a,b)=>a+b,0)/this.tipPath.length,
         y:this.tipPath.map((p) => p.y).reduce((a,b)=>a+b,0)/this.tipPath.length
      }
      
      const yOffset=1-(bounds.maxY-this.centerOfMass.y)/(bounds.maxY-bounds.minY);
      const area=computeArea(this.tipPath);
      const length=computeLength(this.tipPath);
      const radiusOfCircle=length/(2*Math.PI);
      const areaOfCircle=Math.PI*radiusOfCircle**2;
      const roundness = area/areaOfCircle;
      // roundness is between 0 and 1, 1 being a perfect circle
      // yOffset is between 0 and 1, bigger is better
      this.score =roundness**0.4 + yOffset;

   }

   #kneeBelowTip(){
      let kneeBelowTip=false;
      const tip = this.getTipLocation();
      for(let i=0;i<this.particles.length;i++){
         const loc=this.particles[i].loc;
         if(loc!=tip && loc.y>tip.y){
            kneeBelowTip=true;
            this.particles[i].marked=true;
         }
      }
      return kneeBelowTip;
   }

   #sticksIntersect(){
      let foundIntersection=false;
      const selectedSticks=[];
      for(let i=0;i<this.sticks.length;i++){
         if(i!=0 && i!=11 && i!=12){
            selectedSticks.push(this.sticks[i]);
         }
      }
      for (let i = 0; i < selectedSticks.length; i++) {
         for (let j = i+1; j < selectedSticks.length; j++) {
            const stick1 = selectedSticks[i];
            const stick2 = selectedSticks[j];
            const intersection = stick1.intersect(stick2);
            if(intersection){
               foundIntersection=true;
               stick1.intersected=true;
               stick2.intersected=true;
            }
         }
      }
      return foundIntersection;
   }

   #generateLeg(originVector, a, b, c, d, e, f, g, h, i, j, k, l, m,isFlipped) {
      const xScaler=isFlipped?-1:1;
      this.particles = [
         new Particle(originVector, true), //0
         new Particle(originVector.add(new Vector(0*xScaler, l)), true), //1
         new Particle(originVector.add(new Vector(0*xScaler, -m)), true), //2
         new Particle(originVector.add(new Vector(-50*xScaler, -70))), //3
         new Particle(originVector.add(new Vector(-a*xScaler, l)), true), //4
         new Particle(originVector.add(new Vector(-20*xScaler, 70))), //5
         new Particle(originVector.add(new Vector(-100*xScaler, 20))), //6
         new Particle(originVector.add(new Vector(-80*xScaler, 70))), //7
         new Particle(originVector.add(new Vector(-20*xScaler, 110))), //8
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

   update(force, canvas, moveMotor = true, scorePath = true) {
      if (moveMotor) {
         this.motor.update();
      }
      for (const particle of this.particles) {
         particle.update(force);
         particle.constraint(canvas.width, canvas.height);
      }
      

      for (let i = 1; i <= Leg.rigidity; i++) {
         for (const stick of this.sticks) {
            stick.update();
         }
         for (const particle of this.particles) {
            particle.constraint(canvas.width, canvas.height);
            
         }
      }
      

      this.tipPath.push(this.getTipLocation());
      
      if (scorePath) {
         if(this.#sticksIntersect()){
            this.discarded=true;
         }else if(this.#kneeBelowTip()){
            this.discarded=true;
         }
         if (
            this.motor.angle <= -Math.PI * 2 - Math.PI / 2 &&
            this.score == null
         ) {
            this.scorePath();
         }
      }

      const avErr =
         this.sticks.map((s) => s.error()).reduce((a, b) => a + b, 0) /
         this.sticks.length;
      return avErr;
   }

   draw(ctx, pathColor) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = pathColor;
      for (const point of this.tipPath) {
         ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      if(this.centerOfMass){
         ctx.beginPath();
         ctx.arc(this.centerOfMass.x, this.centerOfMass.y, 5, 0, 2 * Math.PI);
         ctx.fillStyle = pathColor;
         ctx.fill();
      }

      for (const stick of this.sticks) {
         stick.draw(ctx);
      }
      for (const particle of this.particles) {
         particle.draw(ctx);
      }
   }
}
