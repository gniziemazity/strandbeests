class Scene {
   constructor(
      container,
      width,
      height,
      lookAtVector,
      distanceFromObject = 400
   ) {
      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.up.set(0, -1, 0);
      this.camera.position.set(
         lookAtVector.x,
         lookAtVector.y,
         -distanceFromObject
      );

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      container.appendChild(this.renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);

      // Controls for orbiting camera
      this.controls = new THREE.OrbitControls(
         this.camera,
         this.renderer.domElement
      );
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.target.set(lookAtVector.x, lookAtVector.y, 0);

      // Material for sticks
      this.stickMaterial = new THREE.MeshBasicMaterial({ color: 0xff9d00 });

      // For tracking objects to remove
      this.strandbeestParticles = {};
      this.strandbeestSticks = {};
   }

   addParticle(p, index, radius = 2) {
      const color = p.isConstrained ? 0xff0000 : 0x000000;

      const material = new THREE.MeshStandardMaterial({ color });

      const loc = p.loc;

      if (!this.strandbeestParticles[index]) {
         const geometry = new THREE.SphereGeometry(radius, 8, 8);
         const sphere = new THREE.Mesh(geometry, material);
         this.strandbeestParticles[index] = sphere;
         this.scene.add(sphere);
      }
      this.strandbeestParticles[index].material.color.set(color);
      this.strandbeestParticles[index].position.set(loc.x, loc.y, loc.z);
   }

   addStick(p1, p2, index, color = 0xff9d00, radius = 1) {
      if (!this.strandbeestSticks[index]) {
         const direction = new THREE.Vector3().subVectors(
            new THREE.Vector3(p2.x, p2.y, p2.z),
            new THREE.Vector3(p1.x, p1.y, p1.z)
         );
         const length = direction.length();
         const cylinder = new THREE.CylinderGeometry(radius, radius, length, 8);
         cylinder.translate(0, length / 2, 0);
         const material = new THREE.MeshStandardMaterial({ color });
         const mesh = new THREE.Mesh(cylinder, material);
         this.scene.add(mesh);
         this.strandbeestSticks[index] = mesh;
      }

      const start = new THREE.Vector3(p1.x, p1.y, p1.z);
      const end = new THREE.Vector3(p2.x, p2.y, p2.z);
      this.strandbeestSticks[index].position.copy(start);
      this.strandbeestSticks[index].lookAt(end);
      this.strandbeestSticks[index].rotateX(Math.PI / 2);
   }

   render() {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
   }
}
