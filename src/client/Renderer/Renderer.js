//@ts-check

//For jsdoc only
/* eslint-disable */
import DataHandler from "../DataHandler";
import DataObject from "../CustomObjects/DataObject"
/* eslint-enable */

// import * as THREE from "three";
import RendererConfigurator from "./RendererConfigurator";
import SceneConfigurator from "./SceneConfigurator";
import Controls from "./Controls";

class Renderer{
    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this._animate = this._animate.bind(this);
        /** @type {DataObject} */
        this.dataHandler = null;
        this.rendererConfigurator = new RendererConfigurator(width, height);
        this.renderer = this.rendererConfigurator.getRenderer();
        this.camera = this.rendererConfigurator.getCamera();  

        this.controls = new Controls(this.camera, this.renderer.domElement);

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
        this.controls.setCamera(this.camera);
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

    /**
     * Callback function to change between 2D and 3D modes
     * @param {DataHandler} sender 
     * @param {boolean} status true means go 2D, false means go 3D 
     */
    on2DToggled(sender, status){
        if(status){ // Go 2D
            this.sceneConfigurator.turnOn2D();
            this.rendererConfigurator.turnOn2D();
            this.controls.turnOn2D();
        }
        else{ // Go 3D
            this.sceneConfigurator.turnOn3D();
            this.rendererConfigurator.turnOn3D();
            this.controls.turnOn3D();
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

        let absMax = this.dataHandler.getAbsMax();
        this.sceneConfigurator.sceneGrid.scaleTo(absMax);
        this.sceneConfigurator.axesPainter.scaleTo(absMax);
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

        this.controls.changePivotPoint(coordinates);
    }
}

export default Renderer;