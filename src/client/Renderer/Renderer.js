//@ts-check

//For jsdoc only
/* eslint-disable */
import DataHandler from "../DataHandler";
import DataObject from "../CustomObjects/DataObject"
/* eslint-enable */

import * as THREE from "three";
import OrbitControls from '../LocalOrbitControls/OrbitControls.js';
import DataFormatter from "./DataFormatter.js";
import AxesPainter from "./AxesPainter";

const GRID_SIZE = 10;
const GRID_DIVISION = 10;

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
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.maxDistance = 1500;
        this.controls.minDistance = 0;

        this.scene = this._createScene();

        window.addEventListener('resize', this._onWindowResize.bind(this), false);
    }

    /**
     * Create camera and set it's initial position
     * @param {number} width 
     * @param {number} height
     * @returns {THREE.PerspectiveCamera} 
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

        const axesPainter = new AxesPainter(GRID_SIZE, GRID_DIVISION, 3);
        const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISION);
        gridHelper.translateY(-0.01);

        scene.add(gridHelper);

        axesPainter.setScene(scene);

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
     * @param {DataHandler} sender 
     * @param {null} args 
     */
    onDataChange(sender, args){
        this.removeDataFromScene();

        this.addDataToScene(
            sender.getData(),
            sender.getCurrentAxes().x,
            sender.getCurrentAxes().y,
            sender.getCurrentAxes().z);
        
        this.centerCameraToData(sender);
    }

    /**
     * @param {DataObject} data 
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

    _onWindowResize(){

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
}

export default Renderer;