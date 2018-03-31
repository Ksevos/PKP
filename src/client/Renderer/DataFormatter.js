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
        let pointGeometries = {};
        let pointMaterials = {};
        let dataClasses = [];

        for (let i = 0; i < data.values.length; i++) {
            let dataClass = data.values[i][data.values[i].length - 1];
            if (!dataClasses.find(e => e === dataClass))
                dataClasses.push(dataClass);
            if (!pointGeometries[dataClasses.indexOf(dataClass)])
                pointGeometries[dataClasses.indexOf(dataClass)] = new THREE.Geometry();
            if (!pointMaterials[dataClasses.indexOf(dataClass)])
                pointMaterials[dataClasses.indexOf(dataClass)] = this._createPointMaterial(dataClass);
            pointGeometries[dataClasses.indexOf(dataClass)].vertices.push(this._getAxisVector(data, i));
        }
        //Create a new Points object for each data class
        return this._mergePoints(pointGeometries, pointMaterials, dataClasses);
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
     * @param {Object<string, THREE.Geometry>} pointGeometries
     * @param {Object<string, THREE.PointsMaterial>} pointMaterials
     * @param {string[]} dataClasses
     * @returns {THREE.Points[]}
     */
    _mergePoints(pointGeometries, pointMaterials, dataClasses) {
        let dataCloud = [];
        for (let dataClass of dataClasses) {
            let points = new THREE.Points(
                pointGeometries[dataClasses.indexOf(dataClass)],
                pointMaterials[dataClasses.indexOf(dataClass)]);
            points.name = 'name__' + dataClass;
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