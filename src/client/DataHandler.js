//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import ChangeEvent from "./Events/Event";
import ChangeEventArgs from './Events/ChangeEventArgs';
import OrbitControls from './LocalOrbitControls/OrbitControls'
class DataHandler {
    
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
    constructor() {
        this.fileData = null;
        this.dataChangeEvent = new ChangeEvent(this); 
        this.axes = [];
        this.currentSetAxes = {x: null, y: null, z: null};
    }

    /**
     * Checks if values are in array and are not empty
     * @param {DataObject} data 
     */
    _isDataValid(data) {
        return Array.isArray(data.values) && data.values.length;
    }

    /**
     * Asynchronously downloads data from the server and when it's finished, fires Change Event
     */
    downloadData(){
        this._queryForData().then(data=>{
            if(!data)
                return;
            this.fileData = data;

            // Get only axis names
            this.axes = 
                data.valueNames.filter(
                    (name,index) => {
                        return index !== data.valueNames.length - 1;});
            
            this.currentSetAxes = this._getDefaultAxes();

            this.dataChangeEvent.notify(
                new ChangeEventArgs(
                    data, 
                    this.currentSetAxes));
        });
    }

    /**
     * Gets axes set by default
     * @returns {{x:string,y:string,z:string}}
     */
    _getDefaultAxes(){
        if(!this.axes)
            return null;

        return {
            x: this.axes[0],
            y: this.axes[1],
            z: this.axes[2]};
    }

    /**
     * Queries for uploaded data and returns response from the server
     * @returns {Promise<DataObject>}
     */
    _queryForData(){
        return axios.get("/storage/current")
            .then(response => {
                const fileData = JSON.parse(JSON.stringify(response.data[0]));
                if (this.fileData !== fileData
                    && this._isDataValid(fileData)) {        
                    this.fileData = fileData
                    return fileData;
                }
                else
                    return null;
            }).catch(error=>console.log(error));
    }

    /**
     * @returns {string[]}
     */
    getAllAxes(){
        return this.axes;
    }

    /**
     * Gets currently set axes
     * @returns {{x:string,y:string,z:string}}
     */
    getCurrentAxes(){
        return this.currentSetAxes;
    }

    /**
     * Changes axis and fires Changed Event
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     */
    changeAxes(xAxis, yAxis, zAxis){
        this.currentSetAxes = { 
            x:xAxis,
            y:yAxis,
            z:zAxis
        };
        this.dataChangeEvent.notify(
            new ChangeEventArgs(
                this.fileData, 
                this.currentSetAxes));
    }

    /**
     * @param {function({}, ChangeEventArgs)} listener A callback function, 
     * which will be called when Change Event fires
     */
    subscribeToChangeEvent(listener){
        this.dataChangeEvent.subscribe(listener);
    }

    /**
     * @param {function({}, ChangeEventArgs)} listener 
     */
    unsubscribeFromChangeEvent(listener){
        this.dataChangeEvent.unsubscribe(listener);
    }

    /**
     * @returns {DataObject}
     */
    getData(){
        return this.fileData;
    }
}

export default DataHandler;
