import * as THREE from 'three';
export const Materials = {
  woodFloor: new THREE.MeshStandardMaterial({ color: '#8c6b4a', roughness: 0.4, metalness: 0.1 }),
  wallpaper: new THREE.MeshStandardMaterial({ color: '#e8e5df', roughness: 0.9, metalness: 0.0 }),
  blind: new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.8, side: THREE.DoubleSide }),
  windowFrame: new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.2, metalness: 0.8 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 }),
  sofa: new THREE.MeshStandardMaterial({ color: '#d4cebe', roughness: 0.8 }),
  table: new THREE.MeshStandardMaterial({ color: '#2d2d2d', roughness: 0.3, metalness: 0.5 }),
};
