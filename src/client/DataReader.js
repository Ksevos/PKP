//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import UploadEvent from "./Events/Event";
import DownloadEventArgs from './Events/DownloadEventArgs';

class DataReader {
    
    constructor(props) {
        this.fileData = null;
        this.dataDownloadEvent = new UploadEvent(this); 
        this.axes = [];
    }

    /**
     * Checks if values are in array and are not empty
     * @param {DataObject} data 
     */
    _isDataValid(data) {
        return Array.isArray(data.values) && data.values.length;
    }

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
            
            this.dataDownloadEvent.notify(
                new DownloadEventArgs(
                    data, 
                    this._getDefaultAxes()));
        });
    }

    _getDefaultAxes(){
        if(!this.axes)
            return null;

        return {
            x: this.axes[0],
            y: this.axes[1],
            z: this.axes[2]};
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
     * 
     * @param {function} listener 
     */
    subscribeToDownloadEvent(listener){
        this.dataDownloadEvent.subscribe(listener);
    }
    unsubscribeFromDownloadEvent(listener){
        this.dataDownloadEvent.unsubscribe(listener);
    }

    getData(){
        return this.fileData;
    }
}

export default DataReader;
