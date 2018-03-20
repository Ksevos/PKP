//@ts-check

import OrbitControls from '../LocalOrbitControls/OrbitControls.js';
import Enum from '../CustomObjects/Enum';

class Controls {
    /** Creates orbit controlls */
    constructor(camera, domElement){
        this.currentDimension = Enum.DimensionType.NONE;

        this.camera = camera;
        this.targetDomElement = domElement;

        this.controls = new OrbitControls(camera, domElement);
        this.controls.enabled = true;
        this.controls.maxDistance = 1500;
        this.controls.minDistance = 0;
    }

    /**
     * Configures controls for 3D
     */
    turnOn3D(){
        if(this.currentDimension == Enum.DimensionType.THREE_D)
            return null;
        
        this.controls.enableRotate = true;

        this.currentDimension = Enum.DimensionType.THREE_D;
    }
    
    /**
     * Configures controls for 2D
     */   
    turnOn2D(){
        if(this.currentDimension == Enum.DimensionType.TWO_D)
            return null;
        
        this.controls.enableRotate = false;

        this.currentDimension = Enum.DimensionType.TWO_D;
    }
    
    /**
     * 
     * @param {THREE.Camera} camera 
     */
    setCamera(camera){
        this.camera = camera;

        let isEnabled = this.controls.enableRotate;

        this.controls = new OrbitControls(camera, this.targetDomElement);
        this.controls.enableRotate = isEnabled;
    }

    /**
     * Change a point around which controls rotate. Default is 0;0;0
     * @param {{x:number,y:number,z:number}} coordinates
     */
    changePivotPoint(coordinates) {
        this.controls.target.set(coordinates.x, coordinates.y, coordinates.z);
        this.controls.update();
    }
}

export default Controls;