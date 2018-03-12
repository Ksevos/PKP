//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import UploadEvent from "./Events/Event";
import DownloadEventArgs from './Events/DownloadEventArgs';

class DataReader {
    
    constructor(props) {
        this.fileData = DataObject;
        this.dataDownloadEvent = new UploadEvent(this); 
        this.axes = [];
    }

    /**
     * Checks if values are in array and are not empty
     * @param {DataObject} fileData 
     */
    _isDataValid(fileData) {
        return Array.isArray(fileData.values) && fileData.values.length;
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
                        index != data.valueNames.length - 1});
            
            console.log("Notifying subscribers");
            this.dataDownloadEvent.notify(
                new DownloadEventArgs(
                    data, 
                    this._getDefaultAxes()));
        });
    }

    /*
    addDataToScene(scene) {
        this.scene = scene;
        this._queryForData().then(data=>{
            if(!data)
                return;
            this.dataDownloadEvent.notify(data);
            
            // Get only axis names
            this.axes = 
                data.valueNames.filter(
                    (name,index) => {
                        index != data.valueNames.length - 1});

            // Set default axis names based on data
            this._readDefaultAxes(data);

            this._addToScene(
                scene, 
                this.xAxis,
                this.yAxis,
                this.zAxis);
        });
    }
*/
    /*
    changeAxes(xAxis, yAxis, zAxis){
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.zAxis = zAxis;

        this._addToScene(
            this.scene, 
            this.xAxis,
            this.yAxis,
            this.zAxis);
    }
*/
    _getDefaultAxes(){
        if(!this.axes)
            return null;

        return {
            x: this.axes[0],
            y: this.axes[1],
            z: this.axes[2]};
    }
/*
    _addToScene(scene, xAxis, yAxis, zAxis){
        if(!this.fileData)
            return;

        let dataFormatter = 
            new DataFormatter(
                this.fileData,
                xAxis, 
                yAxis, 
                zAxis);
        let dataCloud = dataFormatter.getDataCloud();

        for(let i = 0; i < dataCloud.length; i++){
            scene.add(dataCloud[i]);
        }
    }
*/
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
        console.log(listener + " subscribed to download event");
        this.dataDownloadEvent.subscribe(listener);
    }
    unsubscribeFromDownloadEvent(listener){
        console.log(listener + " unsubscribed from download event");
        this.dataDownloadEvent.unsubscribe(listener);
    }

    getData(){
        return this.fileData;
    }
}

export default DataReader;
