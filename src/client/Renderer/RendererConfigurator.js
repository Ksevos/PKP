//@ts-check

import * as THREE from 'three';
import Enum from '../CustomObjects/Enum'

class RendererConfigurator{
    constructor(width, height){
        this.currentDimension = Enum.DimensionType.NONE;
        /**@type {THREE.Camera} */
        this.camera = null;
        this.width = width;
        this.height = height;

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#FFF');
        this.renderer.setSize(width, height);

        this.turnOn3D();
    }
    turnOn3D(){
        if(this.currentDimension == Enum.DimensionType.THREE_D)
            return null;
        
        this.camera = this._createPerspectiveCamera();

        this.currentDimension = Enum.DimensionType.THREE_D;
        return {camera: this.camera}
    }   
    turnOn2D(){
        if(this.currentDimension == Enum.DimensionType.TWO_D)
            return null;
        
        this.camera = this._createOrthographicCamera();
        this.camera.rotation.set(0,0,0);

        this.currentDimension = Enum.DimensionType.TWO_D;
        return {camera: this.camera}
    } 
    _createOrthographicCamera(){
        let a = 1 / (this.height / this.width);
        const camera = new THREE.OrthographicCamera(
            -a, 
            a,
            1,
            -1,
            0.1,
            2000);
        camera.position.z = 5;
        return camera;
    }
    _createPerspectiveCamera(){
        const camera = new THREE.PerspectiveCamera(
            75, 
            this.width / this.height,
            0.001);
        camera.position.z = 5;
        return camera;
    }

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
            camera.left = this.width / - 2; 
            camera.right = this.width / 2;
            camera.top = this.height / 2;
            camera.bottom = this.height / - 2;
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