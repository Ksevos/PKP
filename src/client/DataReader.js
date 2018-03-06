//@ts-check

import * as THREE from "three";
import DataObject from './DataObject';
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
            const geometry = new THREE.SphereGeometry(0.05, 64, 64);
            const elements = data.values[0].length;
            const material = new THREE.MeshBasicMaterial({ color: '#433F81' });

            for (var i = 0; i < elements; i++) {
                let dot = new THREE.Mesh(geometry, material);
                dot.position.x = data.values[0][i];
                dot.position.y = data.values[1][i];
                dot.position.z = data.values[2][i];
                scene.add(dot);
            }
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

    /** 
     * @returns {DataObject} 
     */
    getData(){
        return this.fileData;
    }
}

export default DataReader;
