//@ts-check

import * as THREE from "three";
import SceneGrid from './SceneGrid';
import Enum from '../CustomObjects/Enum';
import DataFormatter from './DataFormatter';

class SceneConfigurator{
    constructor(){
        this.currentDimension = Enum.DimensionType.NONE;
        const scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(100000);
        scene.add(axesHelper);
        
        this.sceneGrid = new SceneGrid();

        this.scene = scene;
        this.turnOn3D();
    }

    turnOn3D(){
        if(this.currentDimension == Enum.DimensionType.THREE_D)
            return null;
        
        this.sceneGrid.addToScene(this.scene);
        // Turn on z axis
    }   
    turnOn2D(){
        if(this.currentDimension == Enum.DimensionType.TWO_D)
            return null;
        
        this.sceneGrid.removeFromScene(this.scene);
        // Turn off z axis
    } 

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

    removeAllData(){
        const children = this.scene.children.slice();

        for(let i=0; i<children.length; i++){
            if(children[i].constructor === THREE.Points){
                this.scene.remove(children[i]);
            }
        }
    }

    getScene(){
        return this.scene;
    }
}

export default SceneConfigurator;