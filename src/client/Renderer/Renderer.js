//@ts-check

import * as THREE from "three";
import OrbitControls from '../LocalOrbitControls/OrbitControls.js';
import ChangeEventArgs from '../Events/ChangeEventArgs';
import DataFormatter from "./DataFormatter.js";

class Renderer{
    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this._animate = this._animate.bind(this);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#FFFFFF');
        this.renderer.setSize(width, height);

        this.camera = this._createCamera(width, height);  

        //Orbit controls (Rotate, pan, resize)
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enabled = true;
        controls.maxDistance = 1500;
        controls.minDistance = 0;

        this.scene = this._createScene();
    }

    /**
     * Create camera and set it's initial position
     * @param {number} width 
     * @param {number} height
     * @returns {THREE.Camera} 
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
     * @returns {THREE.Scene}
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

    /**
     * @returns {THREE.Scene}
     */
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
        for(let i=0; i<children.length; i++){ 
            if(children[i].constructor === THREE.Points)
                this.scene.remove(children[i]); 
        }
    }

    /**
     * Callback function to change data in the scene
     * @param {object} sender 
     * @param {ChangeEventArgs} args 
     */
    onDataChange(sender, args){
        this.removeDataFromScene();

        this.addDataToScene(
            args.getData(),
            args.getAxes().x,
            args.getAxes().y,
            args.getAxes().z);
    }

    /**
     * @param {{valueNames:string[], values: any}} data 
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     */
    addDataToScene(data, xAxis, yAxis, zAxis){
        if(!data)
            return;

        let dataFormatter = 
            new DataFormatter(
                data,
                xAxis, 
                yAxis, 
                zAxis);
        let dataCloud = dataFormatter.getDataCloud();

        for(let i = 0; i < dataCloud.length; i++){
            this.scene.add(dataCloud[i]);
        }
    }
}

export default Renderer;