import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // Add a dark fog to fade out the grid in the distance
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position the camera slightly above the grid, looking forward
    camera.position.set(0, 4, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Lock the canvas securely behind your UI
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.pointerEvents = 'none'; // Ensure it doesn't block UI clicks
    mountRef.current.appendChild(renderer.domElement);

    // 2. The Infinite Cyberpunk Grid (Neon Cyan)
    // GridHelper(size, divisions, colorCenterLine, colorGrid)
    const gridHelper = new THREE.GridHelper(150, 60, 0x00ffff, 0x00ffff);
    gridHelper.position.y = -2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15; // Keep it subtle so it doesn't distract from the UI
    scene.add(gridHelper);

    // 3. The Floating Core (Neon Pink Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(3, 0); // Geometric, edgy shape
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff00ff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.6 
    });
    const core = new THREE.Mesh(geometry, material);
    core.position.y = 2; // Float above the grid
    scene.add(core);

    // 4. Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to control the camera sway
      mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 5. The Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the floating core
      core.rotation.x += 0.002;
      core.rotation.y += 0.005;

      // Move the grid towards the camera to create a forward-motion illusion
      gridHelper.position.z += 0.03;
      // Reset the grid position smoothly to make it infinite
      if (gridHelper.position.z > 2.5) {
        gridHelper.position.z = 0; 
      }

      // Smooth camera sway based on mouse position (Interactive Element!)
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y + 4) * 0.05;
      camera.lookAt(core.position); // Keep the camera focused on the core

      renderer.render(scene, camera);
    };
    animate();

    // 6. Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Strict React Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeBackground;