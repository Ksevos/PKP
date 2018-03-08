//@ts-check

import * as THREE from "three";
import DataObject from './CustomObjects/DataObject';
import axios from 'axios';

class DataReader {
    constructor(props) {
        this.fileData = DataObject;
    }

    /**
     * Checks if values are in array and are not empty
     * @param {DataObject} fileData 
     */
    _isDataValid(fileData) {
        return Array.isArray(fileData.values) && fileData.values.length;
    }

    /**
     * Asynchronously adds data to the scene
     * @param {THREE.Scene} scene 
     */
    addDataToScene(scene) {
        this._queryForData().then(data=>{
            if(!data)
                return;
            var dotGeometry = new THREE.Geometry();

            for (var i = 0; i < data.values.length; i++) {
                dotGeometry.vertices.push(
                    new THREE.Vector3( 
                        data.values[i][0], 
                        data.values[i][1], 
                        data.values[i][2]));
            }
            var dotMaterial = new THREE.PointsMaterial( { 
                size: 5, 
                sizeAttenuation: false, 
                color: '#FF00FF' } );
            var dot = new THREE.Points( dotGeometry, dotMaterial );
            scene.add(dot);
        });
    }

    /**
     * Returns request to the server
     * @returns {Promise<DataObject>}
     */
    _queryForData(){
        return axios.get("/storage/current")
            .then(response => {
                const fileData = JSON.parse(JSON.stringify(response.data[0]));
                if (this.fileData !== fileData
                    && this._isDataValid(fileData)) {
                    this.fileData = fileData;
                    return fileData;
                }
                else
                    return null;
            }).catch(error=>console.log(error));
    }
}

export default DataReader;
