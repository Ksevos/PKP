//@ts-check

//For Jsdoc
/* eslint-disable */
import DataObject from "../CustomObjects/DataObject"
/* eslint-enable */

import * as THREE from "three";
import SceneGrid from './SceneGrid';
import Enum from '../CustomObjects/Enum';
import DataFormatter from './DataFormatter';
import AxesPainter from "./AxesPainter";

class SceneConfigurator{
    /**
     * Creates scene, adds axes and grid
     */
    constructor(){
        this.currentDimension = Enum.DimensionType.NONE;
        const scene = new THREE.Scene();

        this.sceneGrid = new SceneGrid();

        const axesPainter = new AxesPainter(this.sceneGrid.scale, this.sceneGrid.scale, 3);
        axesPainter.setScene(scene);

        this.scene = scene;
        this.turnOn3D();
    }

    /**
     * Shows grid and turns on z axis
     */
    turnOn3D(){
        if(this.currentDimension == Enum.DimensionType.THREE_D)
            return null;
        
        this.sceneGrid.addToScene(this.scene);
        // Turn on z axis
    }   

    /**
     * Hides grid and z axis
     */
    turnOn2D(){
        if(this.currentDimension == Enum.DimensionType.TWO_D)
            return null;
        
        this.sceneGrid.removeFromScene(this.scene);
        // Turn off z axis
    } 

    /**
     * Adds data to the scene
     * @param {DataObject} data 
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     */
    addData(data, xAxis, yAxis, zAxis){
        if(!data)
            return;

        console.log(xAxis,yAxis,zAxis);
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
}

export default SceneConfigurator;