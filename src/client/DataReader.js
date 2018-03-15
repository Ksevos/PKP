//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import DataFormatter from "./DataFormatter";
import OrbitControls from './LocalOrbitControls/OrbitControls.js';

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
    * Return Axis max value
    * @param {DataObject} data
    * @param {number} axis
    * @returns {number}
    */
    _getMaxValue(data, axis) {
        let values = [];
        for (var i = 0; i < data.values.length; i++) {
            values.push(data.values[i][axis]);
        }
        return Math.max(...values);
    }

    /**
    * Change camera position
    * @param {DataObject} data
    * @param {THREE.PerspectiveCamera} camera
    */
    _changeCameraPosition(data, camera) {
        let coordinates = this._getCenterCoordinates(data);
        let x = this._getMaxValue(data, 0) - coordinates[0];
        let y = (this._getMaxValue(data, 1) * 2) - (coordinates[1] * 2);
        let z = this._getMaxValue(data, 2)*1.5 + x;

        camera.position.set(coordinates[0], coordinates[1], Math.max(x, y, z));
    }

    /**
    * Change controls center point
    * @param {DataObject} data
    * @param {OrbitControls} controls
    */
    _changeControlsCenter(data, controls) {
        let coordinates = this._getCenterCoordinates(data);
        controls.target.set(coordinates[0], coordinates[1], coordinates[2]);
        controls.update();
    }

    /**
     * Returns axis middle value
     * @param {Array} values
     * @returns {number}
     */
    _getMiddle(values) {
        return (Math.max(...values) + Math.min(...values)) / 2;
    }

    /**
     * Returns data center point (x,y,z)
     * @param {DataObject} data
     * @returns {Array}
     */
    _getCenterCoordinates(data) {
        let xValues = [];
        let yValues = [];
        let zValues = [];

        for (var i = 0; i < data.values.length; i++) {
            xValues.push(data.values[i][0]);
            yValues.push(data.values[i][1]);
            zValues.push(data.values[i][2]);
        }
        return [this._getMiddle(xValues), this._getMiddle(yValues), this._getMiddle(zValues)];
    }

    /**
     * Asynchronously adds data to the scene
     * @param {THREE.Scene} scene
     */
    addDataToScene(scene) {
        this._queryForData().then(data=>{
            if(!data)
                return;

            let dataFormatter = new DataFormatter(data);
            let dataCloud = dataFormatter.getDataCloud();

            for(let i = 0; i < dataCloud.length; i++){
                scene.add(dataCloud[i]);
            }
        });
    }

    /**
    * Update camera and controls position
    * @param {THREE.PerspectiveCamera} camera
    * @param {OrbitControls} controls
    */
    updateCamera(camera, controls) {
        axios.get("/storage/current")
            .then(response => {
                const fileData = JSON.parse(JSON.stringify(response.data[0]));
                if (this._isDataValid(fileData)) {
                    this._changeCameraPosition(fileData, camera);
                    this._changeControlsCenter(fileData, controls);
                }
            }).catch(error => console.log(error));
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
