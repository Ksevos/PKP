//@ts-check

import DataObject from '../CustomObjects/DataObject';

class DownloadEventArgs{
    /**
     * 
     * @param {DataObject} data 
     */
    constructor(data, axes){
        this.data = data;
        this.axes = axes;
    }

    getData(){
        this.data;
    }

    getAxes(){
        this.axes;
    }
}

export default DownloadEventArgs;