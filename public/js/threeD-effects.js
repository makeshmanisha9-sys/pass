// Passage 3D WebGL & Interactive 3D Perspective Engine
const ThreeDEffects = {
  scene: null,
  camera: null,
  renderer: null,
  globeGroup: null,
  particles: null,
  targetRotationX: 0,
  targetRotationY: 0,

  init() {
    this.initWebGLHero();
    this.init3DCardTilts();
    this.initScrollParallax();
  },

  /* 1. THREE.JS INTERACTIVE 3D GLOBE & GOLDEN BEAMS */
  initWebGLHero() {
    const container = document.getElementById('webglHeroContainer');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 280;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // 3D Wireframe Globe Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(75, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xc27f3a,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.globeGroup.add(globeMesh);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(65, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc27f3a,
      transparent: true,
      opacity: 0.08
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.globeGroup.add(coreMesh);

    // Floating Golden Particle Ring
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 90 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = 0.76;     // Red (Gold)
      colors[i * 3 + 1] = 0.50; // Green
      colors[i * 3 + 2] = 0.23; // Blue
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.globeGroup.add(this.particles);

    // 3D City Pins for Chennai, Bangalore, Mumbai, Delhi, Goa, Hyderabad
    const cityCoords = [
      { lat: 13.08, lng: 80.27, name: "Chennai" },
      { lat: 12.97, lng: 77.59, name: "Bangalore" },
      { lat: 19.07, lng: 72.87, name: "Mumbai" },
      { lat: 28.61, lng: 77.20, name: "Delhi" },
      { lat: 15.29, lng: 73.98, name: "Goa" },
      { lat: 17.38, lng: 78.48, name: "Hyderabad" }
    ];

    cityCoords.forEach(city => {
      const phi = (90 - city.lat) * (Math.PI / 180);
      const theta = (city.lng + 180) * (Math.PI / 180);
      const radius = 76;

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));

      const pinGeo = new THREE.SphereGeometry(2.5, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y, z);
      this.globeGroup.add(pinMesh);
    });

    // Mouse Move Listener for 3D Interactive Parallax
    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      this.targetRotationY = mouseX * 0.5;
      this.targetRotationX = mouseY * 0.3;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Render Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.globeGroup) {
        this.globeGroup.rotation.y += 0.004;
        this.globeGroup.rotation.x += (this.targetRotationX - this.globeGroup.rotation.x) * 0.05;
        this.globeGroup.rotation.y += (this.targetRotationY - this.globeGroup.rotation.y) * 0.05;
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  },

  /* 2. DYNAMIC 3D PERSPECTIVE CARD TILT ENGINE */
  init3DCardTilts() {
    const selectors = '.property-card, .city-card, .stat, .why-card, .search-bar-card, .form-shell';
    
    document.querySelectorAll(selectors).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease-out';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // -12deg to +12deg tilt
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = `0 24px 50px rgba(194, 127, 58, 0.2), 0 10px 20px rgba(0, 0, 0, 0.15)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
      });
    });
  },

  /* 3. 3D SCROLL PARALLAX DEPTH ENGINE */
  initScrollParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroContent = document.querySelector('.hero .wrap');
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${scrolled * 0.18}px, 0)`;
        heroContent.style.opacity = `${1 - scrolled / 700}`;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => ThreeDEffects.init(), 200);
});
