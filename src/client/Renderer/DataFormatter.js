import * as THREE from "three";
import DataObject from '../CustomObjects/DataObject';

/**
 * Used for data convertion into format, that three.js can use
 */
class DataFormatter{
    /**
     * @param {DataObject} data 
     * @param {string} xAxis 
     * @param {string} yAxis 
     * @param {string} zAxis 
     */
    constructor(data, xAxis, yAxis, zAxis){
        this.defaultColors = ["#FF0000", "#00FFFF", "#FF00FF"];
        this.xAxis = xAxis; 
        this.yAxis = yAxis; 
        this.zAxis = zAxis;
        this.dataCloud = this._createDataCloud(data);
    }
    
    /**
     * @param {DataObject} data 
     * @returns {THREE.Points[]}
     */
    _createDataCloud(data){
        let pointGeometries = {};
        let pointMaterials = {};
        let dataClasses = [];

        for (let i = 0; i < data.values.length; i++) {
            let dataClass = data.values[i][data.values[i].length-1];

            if(!dataClasses.find(e=>e === dataClass))
                dataClasses.push(dataClass);
            if(!pointGeometries[dataClass])
                pointGeometries[dataClass] = new THREE.Geometry();
            if(!pointMaterials[dataClass])
                pointMaterials[dataClass] = this._createPointMaterial();

            pointGeometries[dataClass].vertices.push(this._getAxisVector(data,i));
        }

        //Create a new Points object for each data class
        return this._mergePoints(pointGeometries, pointMaterials, dataClasses);
    }
    /**
     * @param {DataObject} data 
     * @param {number} index Index of value
     * @returns {THREE.Vector3}
     */
    _getAxisVector(data, index){
        if(!data)
            return new THREE.Vector3(0,0,0);

        let x = 0, y = 0, z = 0;

        for(let i = 0; i < data.valueNames.length; i++){
            if(data.valueNames[i] === this.xAxis)
                x = data.values[index][i];
            if(data.valueNames[i] === this.yAxis)
                y = data.values[index][i];
            if(data.valueNames[i] === this.zAxis)
                z = data.values[index][i];
        }
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Relate geometry and materials together into a data cloud
     * @param {THREE.Geometry} pointGeometries
     * @param {THREE.PointsMaterial} pointMaterials
     * @param {THREE.string} dataClasses
     * @returns {THREE.Points[]}
     */
    _mergePoints(pointGeometries, pointMaterials, dataClasses){
        let dataCloud = [];
        for(let i = 0; i < dataClasses.length; i++){
            dataCloud.push(
                new THREE.Points( 
                    pointGeometries[dataClasses[i]], 
                    pointMaterials[dataClasses[i]] ));
        }
        return dataCloud;
    }

    /** 
     * @returns {THREE.PointsMaterial}
     */
    _createPointMaterial(){
        return new THREE.PointsMaterial( { 
            size: 5, 
            sizeAttenuation: false, 
            color: this._getColor() } );
    }

    /** 
     * Get one of default colors. If none found create a random color
     * @returns {string}
     */
    _getColor(){
        let color = this.defaultColors[this.defaultColors.length-1];
        if(color)
            this.defaultColors.pop();
        else{
            //If predefined colors ended generate something random
            color = new THREE.Color( 0xffffff );
            color.setHex( Math.random() * 0xffffff );
        }
        return color;
    }

    /** 
     * @returns {THREE.Points[]}
     */
    getDataCloud(){
        return this.dataCloud;
    }
}

export default DataFormatter;