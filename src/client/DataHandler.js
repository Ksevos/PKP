//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import ChangeEvent from "./Events/Event";
import ChangeEventArgs from './Events/ChangeEventArgs';

class DataHandler {
    
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
