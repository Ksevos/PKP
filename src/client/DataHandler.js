//@ts-check

//For jsdoc only
import DataObject from './CustomObjects/DataObject'; // eslint-disable-line

import axios from 'axios';
import ChangeEvent from "./Events/Event";

class DataHandler {
    constructor() {
        /** @type {DataObject} */
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

            this.dataChangeEvent.notify(null);
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
        this.dataChangeEvent.notify(null);
    }

    /**
     * @param {function(*,*)} listener A callback function, 
     * which will be called when Change Event fires
     */
    subscribeToChangeEvent(listener){
        this.dataChangeEvent.subscribe(listener);
    }

    /**
     * @param {function(*,*)} listener 
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

    /**
     * Return Axis max value
     * @param {string|number} axis 
     * 'x', 'y', 'z'
     * OR
     * 0, 1, 2, 
     * @returns {number}
     */
    getMaxValue(axis) {
        let axisIndex = this._getAxisIndex(this._getAxisName(axis));

        let values = [];
        for (var i = 0; i < this.fileData.values.length; i++) {
            values.push(this.fileData.values[i][axisIndex]);
        }
        return Math.max(...values);
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
     * @returns {{x:number,y:number,z:number}}
     */
    getCenterCoordinates() {
        let xValues = [];
        let yValues = [];
        let zValues = [];

        for (var i = 0; i < this.fileData.values.length; i++) {
            xValues.push(this.fileData.values[i][0]);
            yValues.push(this.fileData.values[i][1]);
            zValues.push(this.fileData.values[i][2]);
        }
        return {x: this._getMiddle(xValues), y: this._getMiddle(yValues), z: this._getMiddle(zValues)};
    }

    /**
     * Gets axis index for value list
     * @param {string} axisName 
     * @returns {number}
     */
    _getAxisIndex(axisName){
        let axisIndex = -1;
        for(let i = 0; i < this.fileData.valueNames.length; i++){
            if(this.fileData.valueNames[i] === axisName){
                axisIndex = i;
                break;
            }
        }
        return axisIndex;
    }

    /**
     * Get axis name based on current set axis
     * @param {string|number} axis 
     * 'x', 'y', 'z'
     * OR
     * 0, 1, 2, 
     * @returns {string}
     */
    _getAxisName(axis){
        if(axis === 'x' || axis === 0)
            return this.currentSetAxes.x;
        if(axis === 'y' || axis === 1)
            return this.currentSetAxes.y;
        if(axis === 'z' || axis === 2)
            return this.currentSetAxes.z;
    }
}

export default DataHandler;
