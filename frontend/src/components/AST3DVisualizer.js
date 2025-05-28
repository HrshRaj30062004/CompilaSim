import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AST3DVisualizer = ({ ast }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!ast || !mountNode) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionalLight);

    // Improved label creation
    const createLabel = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Calculate text width to size canvas appropriately
      context.font = 'Bold 24px Arial';
      const textWidth = context.measureText(text).width;
      canvas.width = Math.max(textWidth + 20, 100); // Minimum width
      canvas.height = 40;
      
      // Background
      context.fillStyle = 'rgba(255, 255, 255, 0.9)';
      context.strokeStyle = '#4361ee';
      context.lineWidth = 2;
      context.roundRect(0, 0, canvas.width, canvas.height, 5);
      context.fill();
      context.stroke();
      
      // Text
      context.font = 'Bold 24px Arial';
      context.fillStyle = '#4361ee';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width/2, canvas.height/2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(canvas.width / 20, canvas.height / 20, 1);
      return sprite;
    };

    // Improved AST Node Builder with better spacing
    const buildASTNodes = (node, parentPosition = new THREE.Vector3(0, 15, 0), depth = 0, index = 0, siblingCount = 1) => {
      if (!node) return;

      // Calculate position with better spacing
      const horizontalSpread = 5 - depth * 0.5;
      const verticalDrop = 3;
      const angle = (index / siblingCount) * Math.PI * 2;
      const radius = horizontalSpread * (0.5 + depth * 0.3);

      const position = new THREE.Vector3(
        parentPosition.x + Math.cos(angle) * radius,
        parentPosition.y - verticalDrop,
        parentPosition.z + Math.sin(angle) * radius
      );

      // Node styling
      const color = new THREE.Color(
        0.2 + depth * 0.1,
        0.3 + depth * 0.05,
        0.6 - depth * 0.05
      );

      const geometry = new THREE.SphereGeometry(0.6, 16, 16);
      const material = new THREE.MeshPhongMaterial({ 
        color,
        transparent: true,
        opacity: 0.9,
        shininess: 30
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(position);
      scene.add(sphere);

      // Add label with better positioning
      const label = createLabel(node.type + (node.value ? `: ${node.value}` : ''));
      label.position.copy(position);
      label.position.y += 1.5;
      scene.add(label);

      // Add connection line
      if (depth > 0) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          parentPosition,
          position
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0x888888,
          linewidth: 2
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }

      // Process children with better distribution
      if (node.children) {
        const childCount = node.children.length;
        node.children.forEach((child, i) => {
          buildASTNodes(child, position, depth + 1, i, childCount);
        });
      }
    };

    buildASTNodes(ast);

    // Improved controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      mountNode.removeChild(renderer.domElement);
    };
  }, [ast]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '600px', // Slightly taller for better viewing
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #ddd',
        background: '#f8f9fa'
      }} 
    />
  );
};

export default AST3DVisualizer;