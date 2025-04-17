class Scene {
   constructor(container, width, height) {
      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xe0e0e0);

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.up.set(0, -1, 0);
      this.camera.position.set(525, 400, -300);
      this.camera.lookAt(525, 400, 0);

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      container.appendChild(this.renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xFFFFFF);
      this.scene.add(ambientLight);
     
      /*
     // Controls for orbiting camera
     this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
     this.controls.enableDamping = true;
     this.controls.dampingFactor = 0.25;
     */
      // Material for sticks
      this.stickMaterial = new THREE.MeshBasicMaterial({ color: 0xff9d00 });

      // For tracking objects to remove
      this.strandbeestObjects = [];
   }

   clearBeest() {
      // Remove all beest objects from the scene
      // Properly dispose of all resources
      this.strandbeestObjects.forEach((obj) => {
         this.scene.remove(obj);

         // Dispose of geometries
         if (obj.geometry) {
            obj.geometry.dispose();
         }

         // Dispose of materials
         if (obj.material) {
            if (Array.isArray(obj.material)) {
               obj.material.forEach((material) => material.dispose());
            } else {
               obj.material.dispose();
            }
         }
      });
      this.strandbeestObjects = [];
   }

   addStick(p1, p2, color = 0xff9d00, radius = 1) {


      // Create a cylinder between two points
      const direction = new THREE.Vector3().subVectors(
         new THREE.Vector3(p2.x, p2.y, 0),
         new THREE.Vector3(p1.x, p1.y, 0)
      );
      const length = direction.length();

      // Create material with the provided color
      const material = new THREE.MeshStandardMaterial({ color });

      // Create cylinder
      const cylinder = new THREE.CylinderGeometry(radius, radius, length, 8);
      cylinder.translate(0, length / 2, 0);

      const mesh = new THREE.Mesh(cylinder, material);

      const start = new THREE.Vector3(p1.x, p1.y, 0);
      const end = new THREE.Vector3(p2.x, p2.y, 0);

      // Calculate direction and position
      mesh.position.copy(start);

      mesh.lookAt(end);
      mesh.rotateX(Math.PI/2); // Adjust to align cylinder with direction

      /*
      // Position and rotate cylinder
      mesh.position.set(p1.x, p1.y, 0);
      direction.normalize();

      // Align cylinder with direction vector
      if (direction.y > 0.99999) {
         mesh.quaternion.set(0, 0, 0, 1);
      } else if (direction.y < -0.99999) {
         mesh.quaternion.set(1, 0, 0, 0);
      } else {
         const axis = new THREE.Vector3(
            direction.z,
            0,
            -direction.x
         ).normalize();
         const radians = Math.acos(direction.y);
         mesh.quaternion.setFromAxisAngle(axis, radians);
      }
      */
      this.scene.add(mesh);
      this.strandbeestObjects.push(mesh);
      return mesh;
   }

   render() {
      //this.controls.update();
      this.renderer.render(this.scene, this.camera);
   }
}
