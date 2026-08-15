// Passage 3D WebGL Canvas Component (Three.js Interactive Background)

window.ThreeCanvas = function ThreeCanvas() {
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.THREE || !containerRef.current) return;
    const THREE = window.THREE;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Create 3D Floating Particles Mesh
    const particlesCount = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const tealColor = new THREE.Color(0x0d9488);
    const emeraldColor = new THREE.Color(0x10b981);
    const slateColor = new THREE.Color(0x38bdf8);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;
      const mixedColor = Math.random() > 0.5 ? tealColor : Math.random() > 0.5 ? emeraldColor : slateColor;
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.45
    });
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 2. Create Floating 3D Geometric Polyhedrons
    const polyGeometry = new THREE.IcosahedronGeometry(3, 1);
    const polyMaterial = new THREE.MeshPhongMaterial({
      color: 0x0d9488,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const polyMesh = new THREE.Mesh(polyGeometry, polyMaterial);
    polyMesh.position.set(-20, 10, -10);
    scene.add(polyMesh);
    const polyMesh2 = new THREE.Mesh(new THREE.TorusGeometry(4, 1, 16, 50), new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    }));
    polyMesh2.position.set(22, -12, -15);
    scene.add(polyMesh2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x0d9488, 2, 100);
    pointLight.position.set(10, 10, 20);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = event => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;
      polyMesh.rotation.x += 0.005;
      polyMesh.rotation.y += 0.007;
      polyMesh2.rotation.x -= 0.004;
      polyMesh2.rotation.z += 0.006;

      // Smooth Camera Mouse Parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: "fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-1000",
    style: {
      overflow: 'hidden'
    }
  });
};