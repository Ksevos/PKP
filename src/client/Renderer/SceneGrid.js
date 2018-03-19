//@ts-check
import * as THREE from 'three';

class SceneGrid {
    constructor(){
        this.scale = 10;
        this.scene = null;
        this.gridHelper = this._createGridHelper();
    }
    increaseBy(amount){
        this.scale += amount;
        this._updateGridHelper();
    }
    decreaseBy(amount){
        this.scale -= amount;
        this._updateGridHelper();
    }
    addToScene(scene){
        if(this.gridHelper)
            scene.add(this.gridHelper);
        this.scene = scene;
    }
    removeFromScene(scene){
        scene.remove(scene.getObjectByName("GridHelper"));
        this.scene = scene;
    }
    _createGridHelper(){
        const gridHelper = new THREE.GridHelper(this.scale, this.scale);
        gridHelper.translateY(-0.001);
        gridHelper.name = "GridHelper";
        return gridHelper;
    }
    _updateGridHelper(){
        this.gridHelper = this._createGridHelper();
        this.removeFromScene(this.scene);
        this.addToScene(this.scene);
    }
}

export default SceneGrid;