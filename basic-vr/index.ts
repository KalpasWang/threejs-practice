import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

declare global {
  interface Window {
    app: App;
  }
}

class App {
  camera!: THREE.PerspectiveCamera;
  clock!: THREE.Clock;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  mesh!: THREE.Mesh;
  stats!: Stats;

  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    if (!WebGL.isWebGLAvailable) {
      this.setWebGLWarnings();
    }
    // 初始化 clock scene, camera, renderer
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x505050);
    this.initCameraAndLighting();
    this.initRenderer();
    container.appendChild(this.renderer.domElement);

    // 初始化物件
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    const stats = Stats();
    document.body.appendChild(stats.dom);

    const gui = new GUI();
    // mesh
    const cubeFolder = gui.addFolder('Cube');
    cubeFolder.add(this.mesh?.rotation, 'x', 0, Math.PI * 2);
    cubeFolder.add(this.mesh?.rotation, 'y', 0, Math.PI * 2);
    cubeFolder.add(this.mesh?.rotation, 'z', 0, Math.PI * 2);
    cubeFolder.open();
    // camera
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(this.camera?.position, 'z', 0, 10);
    cameraFolder.open();

    this.renderer.setAnimationLoop(this.render.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
  }

  setWebGLWarnings() {
    const warning = WebGL.getWebGLErrorMessage();
    const el = document.getElementById('container');
    if (el) {
      el.appendChild(warning);
    }
  }

  initCameraAndLighting() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.6, 3);
    const ambient = new THREE.HemisphereLight(0x606060, 0x404040);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
      this.stats?.update();
    }
  }
}

const app = new App();
window.app = app;
