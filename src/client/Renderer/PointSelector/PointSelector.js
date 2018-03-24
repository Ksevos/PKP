//@ts-check

//For jsdoc only
/* eslint-disable */
import DataHandler from "../../DataHandler";
/* eslint-enable */

import PointInfoBox from './PointInfoBox';
import * as THREE from 'three';

//TODO change to use octree
class PointSelector {
    constructor(){
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Points.threshold = 0.01;
        this.mouse = new THREE.Vector2(0,0);
        this.clock = new THREE.Clock();
        this.toggle = 0;
        this.mouseMoved = false;

        this.infoBox = new PointInfoBox();
        this.isInfoBoxDisplayed = false;

        window.addEventListener(
            'mousemove', 
            this._onMouseMove.bind(this), 
            false );
    }

    /**
     * 
     * @param {DataHandler} dataHandler 
     * @param {THREE.Points[]} pointCloud 
     * @param {THREE.Camera} camera 
     */
    onRender(dataHandler, pointCloud, camera){
        if ( this.toggle > 0.5 && this.mouseMoved) {
            this.toggle = 0;
            this.mouseMoved = false;

            this.raycaster.setFromCamera( this.mouse, camera );
            let intersections = this.raycaster.intersectObjects( pointCloud );
            let intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

            if(intersection !== null){
                this.asyncCreateInfoBox(dataHandler,intersection.point);
            }
        }
        this.toggle += this.clock.getDelta();
    }

    async asyncCreateInfoBox(dataHandler, position){
        if(!this.pointSearchPromise){
            this.pointSearchPromise =
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve(this._getDataIndexFromPosition(dataHandler, position));
                      }, 5000);
                });
            this.infoBox.setPointIndex(this.pointSearchPromise);
            this.isInfoBoxDisplayed = true;
            console.log(this.pointSearchPromise);
        }
        this.pointSearchPromise = null;
    }

    /**
     * @param {DataHandler} dataHandler 
     * @param {THREE.Vector3} position 
     * @returns {number}
     */
    _getDataIndexFromPosition(dataHandler, position){
        let values = dataHandler.getData().values;
        let currentAxes = dataHandler.getCurrentAxes();
        let bestMatch = {
            index:0, 
            deltaDistance: Number.MAX_VALUE};

        for(let i=0; i<values.length; i++){
            let distance = 0;
            if(currentAxes.z != null)
                distance = position.distanceTo(
                    new THREE.Vector3(
                        values[i][dataHandler.getAxisIndex(currentAxes.x)],
                        values[i][dataHandler.getAxisIndex(currentAxes.y)],
                        values[i][dataHandler.getAxisIndex(currentAxes.z)]));
            else{
                distance = position.distanceTo(
                    new THREE.Vector3(
                        values[i][dataHandler.getAxisIndex(currentAxes.x)],
                        values[i][dataHandler.getAxisIndex(currentAxes.y)],
                        0));
            }
            if(bestMatch.deltaDistance > distance){
                bestMatch.deltaDistance = distance;
                bestMatch.index = i;
            }
        }
        return bestMatch.index;
    }

    _onMouseMove( event ) {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.mouseMoved = true;
        this.isInfoBoxDisplayed = false;
    }

    getInfoBoxReactComponent(){
        return this.infoBox.render();
    }
}

export default PointSelector;