//@ts-check

import DataObject from './CustomObjects/DataObject';
import axios from 'axios';
import DataFormatter from "./DataFormatter";

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

            let dataFormatter = new DataFormatter(data);
            let dataCloud = dataFormatter.getDataCloud();

            for(let i = 0; i < dataCloud.length; i++){
                scene.add(dataCloud[i]);
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
}

export default DataReader;
