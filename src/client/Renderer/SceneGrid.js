//@ts-check
import * as THREE from 'three';

/**
 * A resizable grid
 */
class SceneGrid {
    /**
     * Creates a grid and sets scale to 10
     */
    constructor(){
        this.scale = 10;
        this.scene = null;
        this.gridHelper = this._createGridHelper();
    }
    /**
     * Increments grid size and divisions by given amount
     * @param {number} amount 
     */
    increaseBy(amount){
        this.scale += amount;
        this._updateGridHelper();
    }
    /**
     * Decrements grid size and divisions by given amount
     * @param {number} amount 
     */
    decreaseBy(amount){
        this.scale -= amount;
        if(this.scale < 1)
            this.scale = 1;
        this._updateGridHelper();
    }

    /**
     * Adds grid to specified scene
     * @param {THREE.Scene} scene 
     */
    addToScene(scene){
        if(this.gridHelper)
            scene.add(this.gridHelper);
        this.scene = scene;
    }

    /**
     * Removes grid from specified scene
     * @param {THREE.Scene} scene 
     */
    removeFromScene(scene){
        scene.remove(scene.getObjectByName("GridHelper"));
        this.scene = scene;
    }

    /**
     * @returns {THREE.GridHelper}
     * @private
     */
    _createGridHelper(){
        const gridHelper = new THREE.GridHelper(this.scale, this.scale);
        gridHelper.translateY(-0.001);
        gridHelper.name = "GridHelper";
        return gridHelper;
    }

    /**
     * Updates grid with new scale
     * @private
     */
    _updateGridHelper(){
        this.gridHelper = this._createGridHelper();
        this.removeFromScene(this.scene);
        this.addToScene(this.scene);
    }
}

export default SceneGrid;