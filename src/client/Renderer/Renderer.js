//@ts-check

import * as THREE from "three";
//import DataReader from '../DataReader';

class Renderer{
    constructor(width, height) {
        this._animate = this._animate.bind(this);

        const axesHelper = new THREE.AxesHelper(10000);

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
        )
        camera.position.z = 5
        camera.position.y = 0

        const renderer = new THREE.WebGLRenderer({ antialias: true })
  //      const geometry = new THREE.BoxGeometry(1, 1, 1)

        let size = 100;
        let divisions = 100;
        let gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.translateY(-0.01);
        scene.add(gridHelper);

        renderer.setClearColor('#000000')
        renderer.setSize(width, height)

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        scene.add(axesHelper);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this._animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    _animate() {
        this._renderScene();
        this.frameId = window.requestAnimationFrame(this._animate);
    }

    _renderScene() {
        this.renderer.render(this.scene, this.camera);
     }

    getScene(){
        return this.scene;
    }
    getRenderer(){
        return this.renderer;
    }
}

export default Renderer;