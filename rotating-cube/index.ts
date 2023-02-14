import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

declare global {
  interface Window {
    app: App;
  }
}

class App {
  container!: HTMLElement;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  mesh!: THREE.Mesh;
  stats!: Stats;
  composer!: EffectComposer;

  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    if (!WebGL.isWebGLAvailable) {
      const warning = WebGL.getWebGLErrorMessage();
      const el = document.getElementById('container');
      if (el) {
        el.appendChild(warning);
      }
      return;
    }

    this.initCamera();
    this.initScene();
    this.initLighting();
    this.initRenderer();
    this.setUpCube();
    this.addGlowingEffects();
    this.setUpPanels();

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setAnimationLoop(this.render.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 4);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    // this.scene.background = new THREE.Color(0x000000);
  }

  initLighting() {
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight();
    light.position.set(0.2, 1, 1);
    this.scene.add(light);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  setUpCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    material.emissive = new THREE.Color(0xffffff);
    material.emissiveIntensity = 10;
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  addGlowingEffects() {
    // 渲染通道
    const renderScene = new RenderPass(this.scene, this.camera);
    // glow effects 產生器
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.001;
    // 效果合成
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }

  setUpPanels() {
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    const gui = new GUI({ hideable: false });
    const cubeFolder = gui.addFolder('Cube');
    cubeFolder.add(this.mesh.rotation, 'x', 0, Math.PI * 2);
    cubeFolder.add(this.mesh.rotation, 'y', 0, Math.PI * 2);
    cubeFolder.add(this.mesh.rotation, 'z', 0, Math.PI * 2);
    cubeFolder.open();
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(this.camera.position, 'z', 0, 10);
    cameraFolder.open();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.mesh.rotateY(0.01);
    this.composer.render();
    // this.renderer?.render(this.scene, this.camera);
    this.stats.update();
  }
}

const app = new App();
window.app = app;
