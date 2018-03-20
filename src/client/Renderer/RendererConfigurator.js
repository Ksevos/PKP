//@ts-check

import * as THREE from 'three';
import Enum from '../CustomObjects/Enum'

/**
 * A class for dealing with camera and renderer
 */
class RendererConfigurator{
    
    /**
     * Creates a renderer with perspective camera
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height){
        this.currentDimension = Enum.DimensionType.NONE;

        this.width = width;
        this.height = height;

        /**@type {THREE.Camera} */
        this.camera = null;

        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.setClearColor('#FFF');
        this.renderer.setSize(width, height);

        this.turnOn3D();
    }

    /**
     * Sets perspective camera
     */
    turnOn3D(){
        if(this.currentDimension == Enum.DimensionType.THREE_D)
            return null;
        
        this.camera = this._createPerspectiveCamera();

        this.currentDimension = Enum.DimensionType.THREE_D;
    }   

    /**
     * Sets orthographic camera and resets any rotation 
     */
    turnOn2D(){
        if(this.currentDimension == Enum.DimensionType.TWO_D)
            return null;
        
        this.camera = this._createOrthographicCamera();
        this.camera.rotation.set(0,0,0);

        this.currentDimension = Enum.DimensionType.TWO_D;
    } 

    /**
     * @private
     */
    _createOrthographicCamera(){
        let aspectRatio = 1 / (this.height / this.width);
        const camera = new THREE.OrthographicCamera(
            -aspectRatio, 
            aspectRatio,
            1,
            -1,
            0.1,
            2000);
        camera.position.z = 5;
        return camera;
    }

    /**
     * @private
     */
    _createPerspectiveCamera(){
        const camera = new THREE.PerspectiveCamera(
            75, 
            this.width / this.height,
            0.001);
        camera.position.z = 5;
        return camera;
    }

    /**
     * Callback to window resize event
     */
    onWindowResize(){
        if(this.currentDimension = Enum.DimensionType.THREE_D){
            /** @type {THREE.PerspectiveCamera} */
            //@ts-ignore
            let camera = this.camera;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
        else if(this.currentDimension = Enum.DimensionType.TWO_D){
            /** @type {THREE.OrthographicCamera} */
            //@ts-ignore
            let camera = this.camera;
            let aspectRatio = 1 / (this.height / this.width);
            camera.left = -aspectRatio; 
            camera.right = aspectRatio;
            camera.top = 1;
            camera.bottom = -1;
            camera.updateProjectionMatrix();
        }

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    getCamera(){
        return this.camera;
    }
    getRenderer(){
        return this.renderer;
    }
}

export default RendererConfigurator;