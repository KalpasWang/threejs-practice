import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

declare global {
  interface Window {
    app: App;
  }
}

class App {
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  mesh?: THREE.Mesh;
  controls?: OrbitControls;

  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    if (!WebGL.isWebGLAvailable) {
      const warning = WebGL.getWebGLErrorMessage();
      const el = document.getElementById('container');
      if (el) {
        el.appendChild(warning);
      }
      return;
    }

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 4);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight();
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.renderer.setAnimationLoop(this.render.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    if (this.renderer && this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  render() {
    if (this.renderer && this.mesh && this.scene && this.camera) {
      this.mesh.rotateY(0.01);
      this.renderer.render(this.scene, this.camera);
    }
  }
}

const app = new App();
window.app = app;
