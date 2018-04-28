//@ts-check
import * as THREE from 'three';
import * as LodashMath from 'lodash/math.js';
import {Axis, AxisColor} from "../CustomObjects/Enum";

const DASH_LENGTH_RATIO = 0.15;  // Length to separation ratio
const DASH_COUNT = 10;     // Preferred dash count

const MATERIAL_X = new THREE.LineBasicMaterial( {color: AxisColor.X_AXIS} );
const MATERIAL_Y = new THREE.LineBasicMaterial( {color: AxisColor.Y_AXIS} );
const MATERIAL_Z = new THREE.LineBasicMaterial( {color: AxisColor.Z_AXIS} );

/** 
 * @typedef {Object} AxisObject 
 * @property {THREE.Line} line Axis line
 * @property {THREE.Line[]} dashes  Array for dash lines
 * @property {THREE.Sprite[]} sprites Array for number sprites
 * @property {function(boolean)} setVisible Sets the visibility of all axis components
 */

/**
 * Used to draw x,y and z axis
 */
class AxesPainter extends THREE.Group {

    /**
     * @param {number} size Grid size
     */
    constructor(size) {
        super();
        this.is2D = false;
        this.size = size || 10;
        this.division = size || 10;
        this.dashSeparation = (this.size / this.division) / DASH_COUNT;

        /** Camera position. Needed to scale numbers
         *  @type {THREE.Vector3 | number} */
        this.cameraPosition = null;

        /** Container for axis objects
         *  @type {AxisObject[]} */
        this.axes = [];

        /** Container for mirrored axis objects. Used in 2D view
         *  @type {AxisObject[]} */
        this.mirroredAxes = [];

        for(let i = 0; i < 3; i ++) {
            this.axes.push(AxesPainter._createAxis());
            this.mirroredAxes.push(AxesPainter._createAxis());
        }

        this._paint();
    }

    /**
     * Change axes on 3D
     */
    setAxisLine3D(){
        this.axes[2].setVisible(true);
        this.axes[0].dashes.forEach(function (dash) {
            dash.rotateX(0);
        });

        this.mirroredAxes[0].dashes.forEach(function (dash) {
            dash.rotateX(0);
        });
        this.mirroredAxes[0].setVisible(false);
        this.mirroredAxes[1].setVisible(false);
        this.is2D = false;
    }

   /**
    * Extend axes on 2D
    */
   setAxisLine2D(){
       this.axes[2].setVisible(false);
       this.axes[0].dashes.forEach(function (dash) {
            dash.rotateX(1.5708);
       });

       this.mirroredAxes[0].dashes.forEach(function (dash) {
           dash.rotateX(1.5708);
       });
       this.mirroredAxes[0].setVisible(true);
       this.mirroredAxes[1].setVisible(true);
       this.is2D = true;
   }

    /**
     * Scales axes to new size
     * @param {number} size
     */
    scaleTo(size) {
        let precision = -Math.round(Math.log10(size));
        size = LodashMath.ceil(size, precision);

        this.dashSeparation = size / DASH_COUNT;
        this.size = size;
        this.division = this.size;

        this.repaint();
    }

    /**
     * Removes previous objects and paints them from scratch
     */
    repaint() {

        for(let i = 0; i < 3; i++) {
            let axis = this.axes[i];
            let mirror = this.mirroredAxes[i];

            this.remove(axis.line, mirror.line);
            this.remove(...axis.dashes, ...mirror.dashes);
            axis.dashes.length = 0;
            mirror.dashes.length = 0;
            this.remove(...axis.sprites, ...mirror.sprites);
            axis.sprites.length = 0;
            mirror.sprites.length = 0;
        }

        this._paint();

        for(let i = 0; i < 3; i++) {
            let axis = this.axes[i];
            let mirror = this.mirroredAxes[i];

            this.add(axis.line, mirror.line);
            this.add(...axis.dashes, ...mirror.dashes);
            this.add(...axis.sprites, ...mirror.sprites);
        }
    }

    /**
     * Constructs all axis objects
     * @private
     */
    _paint() {
        let geometryX = new THREE.Geometry();
        let geometryZ = new THREE.Geometry();
        let geometryY = new THREE.Geometry();

        geometryX.vertices.push(new THREE.Vector3(0,0,0));
        geometryX.vertices.push(new THREE.Vector3(this.size));

        geometryY.vertices.push(new THREE.Vector3(0,0,0));
        geometryY.vertices.push(new THREE.Vector3(0,this.size,0));

        geometryZ.vertices.push(new THREE.Vector3(0,0,0));
        geometryZ.vertices.push(new THREE.Vector3(0,0,this.size));

        this.axes[0].line = new THREE.Line(geometryX,MATERIAL_X);
        this.axes[1].line = new THREE.Line(geometryY,MATERIAL_Y);
        this.axes[2].line = new THREE.Line(geometryZ,MATERIAL_Z);

        //@ts-ignore
        this.mirroredAxes[0].line = this.axes[0].line.clone().translateX(-this.size);
        //@ts-ignore
        this.mirroredAxes[1].line = this.axes[1].line.clone().translateY(-this.size);
        //@ts-ignore
        this.mirroredAxes[2].line = this.axes[2].line.clone().translateZ(-this.size);

        for(let i = 1; i <= DASH_COUNT; i++) {
            let nextDistance = this.dashSeparation * i;
            let dashLength = this.dashSeparation * DASH_LENGTH_RATIO;
            
            let startPointX = AxesPainter._createPoint(nextDistance,0,dashLength);
            let startPointY = AxesPainter._createPoint(dashLength,nextDistance,0);
            let startPointZ = AxesPainter._createPoint(dashLength,0,nextDistance);

            this.axes[0].dashes.push(AxesPainter._createAxisDash(startPointX, Axis.X));
            this.axes[1].dashes.push(AxesPainter._createAxisDash(startPointY, Axis.Y));
            this.axes[2].dashes.push(AxesPainter._createAxisDash(startPointZ, Axis.Z));

            let mirrorPointX = Object.assign({},startPointX);
            mirrorPointX.x = -mirrorPointX.x;
            let mirrorPointY = Object.assign({},startPointY);
            mirrorPointY.y = -mirrorPointY.y;
            let mirrorPointZ = Object.assign({},startPointZ);
            mirrorPointZ.z = -mirrorPointZ.z;

            this.mirroredAxes[0].dashes.push(AxesPainter._createAxisDash(mirrorPointX, Axis.X));
            this.mirroredAxes[1].dashes.push(AxesPainter._createAxisDash(mirrorPointY, Axis.Y));
            this.mirroredAxes[2].dashes.push(AxesPainter._createAxisDash(mirrorPointZ, Axis.Z));

            let text = Math.round(startPointX.x * 10) / 10; 
            this.axes[0].sprites.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointX, Axis.X, this.size));
            this.mirroredAxes[0].sprites.push(AxesPainter._makeTextSprite((-text).toString(), 30, mirrorPointX, Axis.X, this.size));

            text = Math.round(startPointY.y * 10) / 10;
            this.axes[1].sprites.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointY, Axis.Y, this.size));
            this.mirroredAxes[1].sprites.push(AxesPainter._makeTextSprite((-text).toString(), 30, mirrorPointY, Axis.Y, this.size));

            text = Math.round(startPointZ.z * 10) / 10;
            this.axes[2].sprites.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointZ, Axis.Z, this.size));
            this.mirroredAxes[2].sprites.push(AxesPainter._makeTextSprite((-text).toString(), 30, mirrorPointZ, Axis.Z, this.size));
        }

        this.mirroredAxes[0].setVisible(false);
        this.mirroredAxes[1].setVisible(false);
        this.mirroredAxes[2].setVisible(false);

        if(this.cameraPosition)
            this.onTextScaleShouldUpdate(this.cameraPosition);
    }

    /**
     * Returns container object for axis elements
     * @returns {AxisObject}
     * @private
     */
    static _createAxis() {
        return {
            line : null,
            dashes : [],
            sprites: [],

            setVisible: function(visible) {
                this.line.visible = visible;
                this.dashes.forEach(function (dash) {
                    dash.visible = visible;
                });
                this.sprites.forEach(function (sprite) {
                    sprite.visible = visible;
                });
            }

        }
    }

    /**
     * Creates a simple point Object
     * @param {number} x Defaults to 0
     * @param {number} y Defaults to 0
     * @param {number} z Defaults to 0
     * @returns {{x: number, y: number, z: number}}
     * @private
     */
    static _createPoint(x,y,z) {
        return {
            x: x || 0,
            y: y || 0,
            z: z || 0
        };
    }

    /**
     * Creates a new dash on axis point
     * @param {Object} startingPoint Point on the axis
     * @param {number} alignment Used to align dashes with Enum.Axis
     * @returns {THREE.Line}
     * @private
     */
    static _createAxisDash(startingPoint, alignment) {
        // TODO: rewrite this to BufferGeometry if needed later
        let geometry = new THREE.Geometry();
        let material;

        switch (alignment) {
            case Axis.X:
                geometry.vertices.push(new THREE.Vector3( startingPoint.x, startingPoint.y, startingPoint.z ));
                geometry.vertices.push(new THREE.Vector3( startingPoint.x, startingPoint.y,-startingPoint.z ));
                material = MATERIAL_X;
                break;

            case Axis.Y:
                geometry.vertices.push(new THREE.Vector3( startingPoint.x, startingPoint.y, startingPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-startingPoint.x, startingPoint.y, startingPoint.z ));
                material = MATERIAL_Y;
                break;

            case Axis.Z:
                geometry.vertices.push(new THREE.Vector3( startingPoint.x, startingPoint.y, startingPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-startingPoint.x, startingPoint.y, startingPoint.z ));
                material = MATERIAL_Z;
                break;

            default:
                throw new Error('Invalid dash alignment!');
        }

        return new THREE.Line(geometry,material);
    }
    
    /**
     * Creates a new text sprite
     * @param {String} text Text to set
     * @param {number} fontsize Text font size
     * @param {Object} position Text position
     * @param {number} alignment Used to align text with Enum.Axis
     * @returns {THREE.Sprite}
     * @private
     */
    static  _makeTextSprite(text, fontsize, position, alignment, scale) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        ctx.font = fontsize + "px Arial";  
        // setting canvas width/height before ctx draw, else canvas is empty
        canvas.width = ctx.measureText(text).width;
        canvas.height = fontsize;

        let aspectRatio = canvas.width/canvas.height;

        // after setting the canvas width/height we have to re-set font to apply
        ctx.font = fontsize + "px Arial"; 
        ctx.fillText(text, 0, fontsize);

        let texture = new THREE.CanvasTexture(canvas);

        let spriteMaterial = new THREE.SpriteMaterial({map : texture});
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(
            scale * 0.05 * aspectRatio,
            scale * 0.05, 
            0
        );

        switch (alignment) {
            case Axis.X:
                sprite.position.set(position.x, 0.3 * (scale/10), 0);
                break;

            case Axis.Y:
                sprite.position.set(0.3* (scale/10), position.y+0.05* (scale/10), 0);
                break;

            case Axis.Z:
                sprite.position.set(0, 0.3* (scale/10), position.z);
                break;

            default:
                throw new Error('Invalid text alignment!');
        }
        return sprite;   
    }

    /**
     * Scale numbers to camera
     * @param {THREE.Vector3 | number} args Camera position or zoom
     */
    onTextScaleShouldUpdate(args){
        this.cameraPosition = args;
        let vec = new THREE.Vector3(0,0,0);
        let scaleControl = this.is2D ? 0.03 : 0.02;

        for(let i=0; i<this.axes.length; i++){
            for(let j=0; j<this.axes[i].sprites.length; j++){
                let aspectRatio = this.axes[i].sprites[j].scale.x / this.axes[i].sprites[j].scale.y;
                //@ts-ignore
                let scale =  scaleControl * (this.is2D ? 1/args : vec.distanceTo( args ));
                
                this.axes[i].sprites[j].scale.x = scale * aspectRatio;
                this.axes[i].sprites[j].scale.y = scale;

                if(this.is2D){
                    aspectRatio = this.mirroredAxes[i].sprites[j].scale.x / this.mirroredAxes[i].sprites[j].scale.y;                   
                    this.mirroredAxes[i].sprites[j].scale.x = scale * aspectRatio;
                    this.mirroredAxes[i].sprites[j].scale.y = scale;
                }
            }
            
        }
    }
}

export default AxesPainter;