//@ts-check

//For jsdoc only
/* eslint-disable */
import DataHandler from "../DataHandler";
import DataObject from "../CustomObjects/DataObject"
import * as THREE from "three";
/* eslint-enable */

import RendererConfigurator from "./RendererConfigurator";
import SceneConfigurator from "./SceneConfigurator";
import Controls from "./Controls";
import PointSelector from "./PointSelector";
import { Vector3 } from "three";

class Renderer{
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this._animate = this._animate.bind(this);
        /** @type {DataHandler} */
        this.dataHandler = null;
        this.rendererConfigurator = new RendererConfigurator(width, height);
        this.renderer = this.rendererConfigurator.getRenderer();
        this.camera = this.rendererConfigurator.getCamera();
        this.oldCameraDistance = 0;
        this.oldCameraZoom = 1;

        this.controls = new Controls(this.camera, this.renderer.domElement);

        this.sceneConfigurator = new SceneConfigurator();
        this.scene = this.sceneConfigurator.getScene();

        this.pointSelector = new PointSelector();
        this.zoomCount2D = null;

        window.addEventListener(
            'resize',
            this.rendererConfigurator.onWindowResize.bind(this.rendererConfigurator),
            false);

    }

    /** Begin render loop */
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this._animate);
        }
    }

    /** Stop render loop */
    stop() {
        cancelAnimationFrame(this.frameId);
    }

    /** 
     * Outer render loop 
     * @private 
     */
    _animate() {
        this._renderScene();
        this.frameId = window.requestAnimationFrame(this._animate);
    }

    /**
     * Inner render loop
     * @private
     */
    _renderScene() {
        if(this.dataHandler && this.pointCloud)
            this.pointSelector.onRender( this.dataHandler, this.pointCloud, this.camera);

        if(this.camera.position.distanceTo(new Vector3(0,0,0)) != this.oldCameraDistance && 
            this.camera.constructor.name == "PerspectiveCamera"){
            this.oldCameraDistance = this.camera.position.distanceTo(new Vector3(0,0,0));
            this.sceneConfigurator.onTextScaleShouldUpdate(this.camera.position);
        }
        //@ts-ignore
        else if(this.camera.zoom != this.oldCameraZoom && 
            this.camera.constructor.name == "OrthographicCamera"){
            //@ts-ignore
            this.oldCameraZoom = this.camera.zoom;
            //@ts-ignore
            this.sceneConfigurator.onTextScaleShouldUpdate(this.camera.zoom);
        }
        this.renderer.render(this.scene, this.camera);
    }

    /** 
     * Update camera type 
     * 
     */
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
        if(status){
            //@ts-ignore
            this.center2DCameraToData(this.dataHandler);
            this.sceneConfigurator.onTextScaleShouldUpdate(this.camera.zoom);
        }else{
            this.center2DCameraToData(this.dataHandler);
            this.sceneConfigurator.onTextScaleShouldUpdate(this.camera.position);
        }
    }

    /**
     * Callback function to change data in the scene
     * @param {DataHandler} sender
     * @param {boolean} newDataDownloaded
     */
    onDataChange(sender, newDataDownloaded){
        this.dataHandler = sender;
        this.sceneConfigurator.removeAllData();

        this.pointCloud = 
            this.sceneConfigurator.addData(
                sender.getData(),
                sender.getCurrentAxes().x,
                sender.getCurrentAxes().y,
                sender.getCurrentAxes().z);
        
        if(newDataDownloaded)
            this.center3DCameraToData(sender);

        let absMax = this.dataHandler.getAbsMax(this.dataHandler.getCurrentAxes());
        this.sceneConfigurator.axesPainter.scaleTo(absMax);
    }

    /**
     * Update 3D camera and controls position
     * @param {DataHandler} dataHandler
     */
    center3DCameraToData(dataHandler) {
        let coordinates = dataHandler.getCenterCoordinates();
        let x = dataHandler.getMaxValue(0) - coordinates.x;
        let y = (dataHandler.getMaxValue(1) * 2) - (coordinates.y * 2);
        let z = dataHandler.getMaxValue(2) * 1.5 + x;

        this.camera.position.set(coordinates.x, coordinates.y, Math.max(x, y, z));

        this.controls.changePivotPoint(coordinates);
    }

    /**
     * Update 2D camera and controls position
     * @param {DataHandler} dataHandler
     */
    center2DCameraToData(dataHandler) {
        let coordinates = this.dataHandler.getCenterCoordinates();
       
        let dataCenterToAxisCenterX = coordinates.x > 2.5 ? coordinates.x + 2.5 : 1; 
        let dataCenterToAxisCenterY = coordinates.y > 2 ? coordinates.y + 2 : 1; 

        let centerToMaxValueX = Math.abs(dataHandler.getMaxValue(0) - coordinates.x);
        let centerToMaxValueY = Math.abs(dataHandler.getMaxValue(1) - coordinates.y);
        
        let maxZoomValueX = centerToMaxValueX > 2.5 && centerToMaxValueX > coordinates.x-2.5? centerToMaxValueX + 2.5: 1; 
        let maxZoomValueY = centerToMaxValueY > 2 && centerToMaxValueY > coordinates.y-2 ? centerToMaxValueY + 2 : 1; 
        
        coordinates.z = 0;
        this.camera.position.set(coordinates.x, coordinates.y, 1);
        if (!this.zoomCount2D){
            this.controls.controls.dollyOut(Math.max(dataCenterToAxisCenterX,dataCenterToAxisCenterY,maxZoomValueX,maxZoomValueY));
            this.zoomCount2D =  this.controls.controls.scope.object.zoom;
        }else{
            this.controls.controls.scope.object.zoom = this.zoomCount2D;
            this.controls.controls.dollyOut(1);
        }
        this.controls.changePivotPoint(coordinates);
    }

    /**
     * @returns {SceneConfigurator}
     */
    getSceneConfigurator() {
        return this.sceneConfigurator;
    }

    /**
     * @param {function(*)} listener 
     */
    subscribeToHoveredOnPointEvent(listener){
        this.pointSelector.subscribeToHoveredOnPointEvent(listener);
    }

    /**
     * Enable point selection
     */
    enablePointSelection(){
        this.pointSelector.enable();
    }

    /**
     * Disable point selection
     */
    disablePointSelection(){
        this.pointSelector.disable();
    }
}

export default Renderer;