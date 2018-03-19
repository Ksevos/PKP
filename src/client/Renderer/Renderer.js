//@ts-check

//For jsdoc only
/* eslint-disable */
import DataHandler from "../DataHandler";
import DataObject from "../CustomObjects/DataObject"
/* eslint-enable */

import * as THREE from "three";
import OrbitControls from '../LocalOrbitControls/OrbitControls.js';
import DataFormatter from "./DataFormatter.js";
import RendererConfigurator from "./RendererConfigurator";
import SceneConfigurator from "./SceneConfigurator";

class Renderer{
    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this._animate = this._animate.bind(this);
        this.dataHandler = null;
        this.rendererConfigurator = new RendererConfigurator(width, height);
        this.renderer = this.rendererConfigurator.getRenderer();
        this.camera = this.rendererConfigurator.getCamera();  

        //Orbit controls (Rotate, pan, resize)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.maxDistance = 1500;
        this.controls.minDistance = 0;

        this.sceneConfigurator = new SceneConfigurator();
        this.scene = this.sceneConfigurator.getScene();

        window.addEventListener(
            'resize', 
            this.rendererConfigurator.onWindowResize.bind(this.rendererConfigurator), 
            false);
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

    updateCamera(){
        this.camera = this.rendererConfigurator.getCamera();

        let isEnabled = this.controls.enableRotate;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = isEnabled;
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

    on2DToggled(sender, status){
        if(status){ // Go 2D
            this.sceneConfigurator.turnOn2D();
            this.rendererConfigurator.turnOn2D();
            this.controls.enableRotate = false;
        }
        else{ // Go 3D
            this.sceneConfigurator.turnOn3D();
            this.rendererConfigurator.turnOn3D();
            this.controls.enableRotate = true;
        }
        this.updateCamera();
        this.centerCameraToData(this.dataHandler);
    }

    /**
     * Callback function to change data in the scene
     * @param {DataHandler} sender 
     * @param {boolean} newDataDownloaded 
     */
    onDataChange(sender, newDataDownloaded){
        this.dataHandler = sender;
        this.sceneConfigurator.removeAllData();

        this.sceneConfigurator.addData(
            sender.getData(),
            sender.getCurrentAxes().x,
            sender.getCurrentAxes().y,
            sender.getCurrentAxes().z);
        
        if(newDataDownloaded)
            this.centerCameraToData(sender);
    }

    /**
     * Update camera and controls position
     * @param {DataHandler} dataHandler
     */
    centerCameraToData(dataHandler) {   
        let coordinates = dataHandler.getCenterCoordinates();
        let x = dataHandler.getMaxValue(0) - coordinates.x;
        let y = (dataHandler.getMaxValue(1) * 2) - (coordinates.y * 2);
        let z = dataHandler.getMaxValue(2) * 1.5 + x;

        this.camera.position.set(coordinates.x, coordinates.y, Math.max(x, y, z));

        this._changeControlsPivotPoint(coordinates);
    }

    /**
     * Change a point around which controls rotate. Default is 0;0;0
     * @param {{x:number,y:number,z:number}} coordinates
     */
    _changeControlsPivotPoint(coordinates) {
        this.controls.target.set(coordinates.x, coordinates.y, coordinates.z);
        this.controls.update();
    }
}

export default Renderer;