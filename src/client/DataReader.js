//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import DataFormatter from './DataFormatter';

class DataReader {
    constructor(props) {
        this.fileData = DataObject;
        this.axes = [];
        this.xAxis = null;
        this.yAxis = null;
        this.zAxis = null;
        this.scene = null;
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
        this.scene = scene;
        this._queryForData().then(data=>{
            if(!data)
                return;

            // Get only axis names
            this.axes = data.valueNames;
            this.axes.pop();

            // Set default axis names based on data
            this._readDefaultAxes(data);

            this._addToScene(
                scene, 
                this.xAxis,
                this.yAxis,
                this.zAxis);
        });
    }

    /**
     * 
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     */
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

    _readDefaultAxes(data){
        if(!data.valueNames)
            return;
        this.xAxis = data.valueNames[0];
        this.yAxis = data.valueNames[1];
        this.zAxis = data.valueNames[2];
    }

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
     * @returns {string[]}
     */
    getAllAxes(){
        return this.axes;
    }

    /**
     * @param {THREE.Scene} scene 
     */
    setTHREEScene(scene){
        this.scene = scene;
    }
}

export default DataReader;
