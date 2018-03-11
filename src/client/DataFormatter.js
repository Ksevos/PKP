import * as THREE from "three";

class DataFormatter{
    /**
     * @param {DataObject} data 
     */
    constructor(data){
        this.defaultColors = ["#FF0000", "#00FFFF", "#FF00FF"];
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

            pointGeometries[dataClass].vertices.push(
                new THREE.Vector3( 
                    data.values[i][0], 
                    data.values[i][1], 
                    data.values[i][2]));
        }

        //Create a new Points object for each data class
        return this._mergePoints(pointGeometries, pointMaterials, dataClasses);
    }

    /**
     * @param {THREE.Geometry} pointGeometries
     * @param {THREE.PointsMaterial} pointMaterials
     * @param {THREE.string} dataClasses
     * @returns {THREE.Points[]}
     */
    _mergePoints(pointGeometries, pointMaterials, dataClasses){
        let dataCloud = [];
        for(let i = 0; i < dataClasses.length; i++){
            this.dataCloud.push(
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
        console.log(this.defaultColors.length);
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