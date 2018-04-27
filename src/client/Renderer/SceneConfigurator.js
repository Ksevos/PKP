//@ts-check

//For Jsdoc
/* eslint-disable */
import DataObject from "../CustomObjects/DataObject"
/* eslint-enable */

import * as THREE from "three";
import Enum from '../CustomObjects/Enum';
import DataFormatter from './DataFormatter';
import AxesPainter from "./AxesPainter";
import * as Rx from "rxjs/Subject";

class SceneConfigurator{
    /**
     * Creates scene, adds axes
     */
    constructor(){
        this.currentDimension = Enum.DimensionType.NONE;
        const scene = new THREE.Scene();


        this.axesPainter = new AxesPainter(3);
        scene.add(this.axesPainter);

        this.scene = scene;

        /**
         * Needs to check when objects are added to scene
         * @type {Rx.Subject<any>}
         */
        this.sceneCreated = new Rx.Subject();
        this.turnOn3D();
    }

    /**
     *  Turns on z axis
     */
    turnOn3D(){
        if(this.currentDimension === Enum.DimensionType.THREE_D)
            return null;
        
        this.axesPainter.setAxisLine3D();

        // Turn on z axis
    }   

    /**
     * Hides grid and z axis
     */
    turnOn2D(){
        if(this.currentDimension === Enum.DimensionType.TWO_D)
            return null;
        
        this.axesPainter.setAxisLine2D();
        // Turn off z axis
    } 

    /**
     * Adds data to the scene
     * @param {DataObject} data 
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     * @returns {THREE.Points[]}
     */
    addData(data, xAxis, yAxis, zAxis){
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

        this.sceneCreated.next(true);

        return dataCloud;
    }

    /**
     * Removes data only from the scene
     */
    removeAllData(){
        const children = this.scene.children.slice();

        for(let i=0; i<children.length; i++){
            if(children[i].constructor === THREE.Points){
                this.scene.remove(children[i]);
            }
        }
    }

    /**
     * @returns {THREE.Scene}
     */
    getScene(){
        return this.scene;
    }

    /**
     * Returns object from scene by name
     * @param name: string
     * @returns {THREE.Object3D}
     */
    getSceneObjectByName(name) {
        return this.scene.getObjectByName(name);
    }

    /**
     *
     * @returns {Rx.Subject<any>}
     */
    getSceneCreated() {
        return this.sceneCreated;
    }

    onTextScaleShouldUpdate(args){
        this.axesPainter.onTextScaleShouldUpdate(args);
    }
}

export default SceneConfigurator;