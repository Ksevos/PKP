//@ts-check

import * as THREE from "three";

class Renderer{
    constructor(width, height) {
        this._animate = this._animate.bind(this);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#FFFFFF');
        this.renderer.setSize(width, height);

        this.camera = this._createCamera(width, height);  

        this.scene = this._createScene();
    }

    /**
     * Create camera and set it's initial position
     * @param {number} width 
     * @param {number} height 
     */
    _createCamera(width, height){
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000);
        camera.position.z = 5;
        camera.position.y = 1;
        return camera;
    }

    /** 
     * Create scene and add basic objects to it
     */
    _createScene(){
        const scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(100000);

        const gridHelper = new THREE.GridHelper(10, 10);
        gridHelper.translateY(-0.01);

        scene.add(gridHelper);
        scene.add(axesHelper);

        return scene;
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
    /** 
     * @returns {THREE.WebGLRenderer}
    */
    getRenderer(){
        return this.renderer;
    }
    removeDataFromScene(){
        const children = this.scene.children;
        console.log(children);
        for(let i=0; i<children.length; i++){ 
            if(children[i].constructor == THREE.Points)
                this.scene.remove(children[i]); 
        }
    }
}

export default Renderer;