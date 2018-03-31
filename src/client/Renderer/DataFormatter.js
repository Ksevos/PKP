//@ts-check

//For jsdoc only
import DataObject from '../CustomObjects/DataObject'; // eslint-disable-line

import * as THREE from "three";
import ColorGeneratorInstance from "../shared/ColorGenerator";

/**
 * Used for data convertion into format, that three.js can use
 */
class DataFormatter {
    /**
     * @param {DataObject} data
     * @param {string} xAxis
     * @param {string} yAxis
     * @param {string} zAxis
     */
    constructor(data, xAxis, yAxis, zAxis) {
        this.colorGeneratorInstance = ColorGeneratorInstance;
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
    _createDataCloud(data) {
        /** @type {Object.<string,THREE.BufferGeometry>} */
        let pointGeometries = {};
        /** @type {Object.<string,THREE.PointsMaterial>} */
        let pointMaterials = {};
        /** @type {Object.<string,number>} */
        let indexes = {};
        /** @type {string[]} */
        let dataClasses = [];
        /** @type {Object.<string,Float32Array>} */
        var positions = {};

        var counts = this._countDataInEachClass(data);

        for (let i = 0; i < data.values.length; i++) {
            let dataClass = data.values[i][data.values[i].length-1];

            // Add keys to dictionaries
            if(!dataClasses.find(e=>e === dataClass))
                dataClasses.push(dataClass);
            if(!pointGeometries[dataClass])
                pointGeometries[dataClass] = new THREE.BufferGeometry();
            if(!pointMaterials[dataClass])
                pointMaterials[dataClass] = this._createPointMaterial(dataClass);
            if(typeof indexes[dataClass] === 'undefined')
                indexes[dataClass] = 0;
            if(!positions[dataClass])
                positions[dataClass] = new Float32Array( counts[dataClass] * 3);

            // Sort positions to their classes
            let pos = this._getAxisVector(data,i);
            positions[dataClass][ 3 * indexes[dataClass] ] = pos.x;
			positions[dataClass][ 3 * indexes[dataClass] + 1 ] = pos.y;
            positions[dataClass][ 3 * indexes[dataClass] + 2 ] = pos.z;
            
            indexes[dataClass]++;

        }
        //Create a new Points object for each data class
        return this._mergePoints(positions, pointGeometries, pointMaterials, dataClasses);
    }

    /**
     * Count number of values each in class
     * @param {DataObject} data 
     * @returns {Object.<string,number>}
     */
    _countDataInEachClass(data){
        /** @type {Object.<string,number>} */
        var counts = {};
        for (let i = 0; i < data.values.length; i++) {
            let dataClass = data.values[i][data.values[i].length-1];

            if(typeof counts[dataClass] === 'undefined')
                counts[dataClass] = 0;
            counts[dataClass]++;
        }
        return counts;
    }

    /**
     * @param {DataObject} data
     * @param {number} index Index of value
     * @returns {THREE.Vector3}
     */
    _getAxisVector(data, index) {
        if (!data)
            return new THREE.Vector3(0, 0, 0);

        let x = 0, y = 0, z = 0;

        for (let i = 0; i < data.valueNames.length; i++) {
            if (data.valueNames[i] === this.xAxis)
                x = data.values[index][i];
            if (data.valueNames[i] === this.yAxis)
                y = data.values[index][i];
            if (data.valueNames[i] === this.zAxis)
                z = data.values[index][i];
        }

        return new THREE.Vector3(x, y, z);
    }

    /**
     * Relate geometry and materials together into a data cloud
     * @param {Object.<string,Float32Array>} positions
     * @param {Object<string, THREE.BufferGeometry>} pointGeometries
     * @param {Object<string, THREE.PointsMaterial>} pointMaterials
     * @param {string[]} dataClasses
     * @returns {THREE.Points[]}
     */
    _mergePoints(positions, pointGeometries, pointMaterials, dataClasses){
        let dataCloud = [];
        for(let i = 0; i < dataClasses.length; i++){
            pointGeometries[dataClasses[i]].addAttribute( 
                'position', 
                new THREE.BufferAttribute( positions[dataClasses[i]], 3 ) );

            pointGeometries[dataClasses[i]].computeBoundingBox();

            let points = new THREE.Points( 
                pointGeometries[dataClasses[i]], 
                pointMaterials[dataClasses[i]]);

            points.name = 'name__' + dataClasses[i];

            dataCloud.push(points);
        }
        return dataCloud;
    }

    /**
     * @returns {THREE.PointsMaterial}
     */
    _createPointMaterial(dataClass) {
        return new THREE.PointsMaterial({
            size: 5,
            sizeAttenuation: false,
            color: this._getColor(dataClass)
        });
    }

    /**
     * Get one of default colors. If none found create a random color
     * @returns {THREE.Color}
     */
    _getColor(dataClass) {
        return new THREE.Color(this.colorGeneratorInstance.getColor(dataClass));
    }

    /**
     * @returns {THREE.Points[]}
     */
    getDataCloud() {
        return this.dataCloud;
    }
}

export default DataFormatter;