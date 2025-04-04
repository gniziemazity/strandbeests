function generateStrandBeests(spacing, parentStrandBeest = null) {
   const strandBeests = [];
   for (
      let y = spacing / 2;
      y < canvas.height - spacing;
      y += spacing
   ) {
      for (let x = spacing * 2; x < canvas.width; x += spacing) {
         const originVector = new Vector(x, y);
         if (!parentStrandBeest) {
            strandBeests.push(generateRandomStrandBeest(originVector));
         } else {
            const newStrandBeest =
               strandBeests.length == 0
                  ? mutateStrandBeest(parentStrandBeest, originVector, 0) // keeping the first one unmutated
                  : mutateStrandBeest(
                       parentStrandBeest,
                       originVector,
                       mutationRate.value
                    );
            strandBeests.push(newStrandBeest);
         }
      }
   }
   return strandBeests;
}

function generateRandomStrandBeest(origin) {
   return new StrandBeest(
      origin,
      {
         a: lerp(min, max, Math.random()),
         b: lerp(min, max, Math.random()),
         c: lerp(min, max, Math.random()),
         d: lerp(min, max, Math.random()),
         e: lerp(min, max, Math.random()),
         f: lerp(min, max, Math.random()),
         g: lerp(min, max, Math.random()),
         h: lerp(min, max, Math.random()),
         i: lerp(min, max, Math.random()),
         j: lerp(min, max, Math.random()),
         k: lerp(min, max, Math.random()),
         l: 7.8, //fixed
         m: 15.0, //fixed
      },
      useMotor,
      speed,
      leftLegCount,
      rightLegCount,
      attachToWall
   );
}

function mutateStrandBeest(strandBeest, originVector, mutationRate) {
   const { a, b, c, d, e, f, g, h, i, j, k, l, m } =
   strandBeest.givenLengths;

   const randomStrandBeest = generateRandomStrandBeest(originVector);

   const newStrandBeest = new StrandBeest(
      originVector,
      {
         a: lerp(a, randomStrandBeest.givenLengths.a, mutationRate),
         b: lerp(b, randomStrandBeest.givenLengths.b, mutationRate),
         c: lerp(c, randomStrandBeest.givenLengths.c, mutationRate),
         d: lerp(d, randomStrandBeest.givenLengths.d, mutationRate),
         e: lerp(e, randomStrandBeest.givenLengths.e, mutationRate),
         f: lerp(f, randomStrandBeest.givenLengths.f, mutationRate),
         g: lerp(g, randomStrandBeest.givenLengths.g, mutationRate),
         h: lerp(h, randomStrandBeest.givenLengths.h, mutationRate),
         i: lerp(i, randomStrandBeest.givenLengths.i, mutationRate),
         j: lerp(j, randomStrandBeest.givenLengths.j, mutationRate),
         k: lerp(k, randomStrandBeest.givenLengths.k, mutationRate),
         l: 7.8,  //fixed
         m: 15.0, //fixed
      },
      useMotor,
      speed,
      leftLegCount,
      rightLegCount,
      attachToWall
   );
   return newStrandBeest;
}