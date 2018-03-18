//@ts-check

//For jsdoc only
import DataHandler from './DataHandler'; // eslint-disable-line

class DataInfoBox{
    /**
     * 
     * @param {DataHandler} dataHandler 
     */
    constructor(dataHandler){
        this.dom = null;
        let newDiv = document.createElement("div");
        newDiv.className = "DataInfoBox";
        
        let title = document.createElement("h4");
        title.textContent = "Data bounds";
        
        let xInfo = document.createElement("p");
        xInfo.textContent = `X: [ ${dataHandler.getMinValue('x')}; ${dataHandler.getMaxValue('x')} ]`;
        xInfo.id = 'X';

        let yInfo = document.createElement("p");
        yInfo.textContent = `Y: [ ${dataHandler.getMinValue('y')}; ${dataHandler.getMaxValue('y')} ]`;
        yInfo.id = 'Y';

        let zInfo = document.createElement("p");
        zInfo.textContent = `Z: [ ${dataHandler.getMinValue('z')}; ${dataHandler.getMaxValue('z')} ]`;
        zInfo.id = 'Z';

        newDiv.appendChild(title)
        newDiv.appendChild(xInfo)
        newDiv.appendChild(yInfo)
        newDiv.appendChild(zInfo);

        this.dom = newDiv;
    }

    getDom(){
        return this.dom;
    }
}

export default DataInfoBox;