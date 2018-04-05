//@ts-check
import * as THREE from 'three';
import * as LodashMath from 'lodash/math.js';
import {Axis, AxisColor} from "../CustomObjects/Enum";

const DASH_LENGTH_RATIO = 0.1; // Length to separation ratio
const DASH_COUNT = 10;

const MATERIAL_X = new THREE.LineBasicMaterial( {color: AxisColor.X_AXIS} );
const MATERIAL_Y = new THREE.LineBasicMaterial( {color: AxisColor.Y_AXIS} );
const MATERIAL_Z = new THREE.LineBasicMaterial( {color: AxisColor.Z_AXIS} );

export default class AxesPainter extends THREE.Group {

    /**
     * Paints AxesHelper and dashes on top of it, meant to be scaled with GridHelper
     * @param {number} size Grid size
     * @param {number} division Grid division
     */
    constructor(size, division) {
        super();

        this.size = size            || 10;
        this.division = division    || 10;
        this.dashSeparation = (this.size / this.division) / DASH_COUNT;
        this.axesHelper = new THREE.AxesHelper(this.size / 2);
        this.lines = [];

        // TODO: refactor this and it's uses
        this.dashesX = [];
        this.numberSprites2D = [];
        this.numbersZAxis = [];

        this._paint();

        this.add(...this.numberSprites2D);
        this.add(this.axesHelper);
        this.add(...this.lines);
    }

    /**
     * Change axis on 3D
     */
   setAxisLine3D(){
       let axisLines = ([
           0, 0, 0,	this.size/2, 0, 0,
           0, 0, 0,	0, this.size/2, 0,
           0, 0, 0,	0, 0, this.size/2
       ]);
       let axis = this.axesHelper.geometry.attributes.position.array;
       axis.set(axisLines);

       this.add(...this.numbersZAxis);
       this.dashesX.forEach(function (line) {
           line.rotateX(0);
       })
   }

   /**
    * Extend axis on 2D
    */
   setAxisLine2D(){
       let axisLines = ([
           -this.size/2, 0, 0,	this.size/2, 0, 0,
           0, -this.size/2, 0,	0, this.size/2, 0,
           0, 0, 0,	0, 0, 0
       ]);
       let axis = this.axesHelper.geometry.attributes.position.array;
       axis.set(axisLines);

       this.remove(...this.numbersZAxis);
       this.dashesX.forEach(function (line) {
           line.rotateX(1.5708);
       })
   }

    /**
     * Scales axes to new grid size
     * @param {number} size
     */
    scaleTo(size) {
        size = Math.ceil(size);

        this.size = size * 2;
        this.division = this.size;
        this.dashSeparation = size / DASH_COUNT;

        this.repaint();
    }

    /**
     * Removes previous objects and paints them from scratch
     */
    repaint() {
        this.remove(this.axesHelper);
        this.axesHelper = new THREE.AxesHelper(this.size / 2);
        this.add(this.axesHelper);

        this.remove(...this.numberSprites2D);
        this.numberSprites2D = [];
        this.remove(...this.numbersZAxis);
        this.numbersZAxis = [];

        this.remove(...this.lines);
        this.lines.length = 0;
        this.dashesX.length = 0;
        this._paint();

        this.add(...this.lines);
        this.add(...this.numberSprites2D);
        this.add(...this.numbersZAxis);
    }

    /**
     * Paints axis dashes scaled with grid size and division
     * @private
     */
    _paint() {
        for(let i = 1; i <= DASH_COUNT; i++) {
            let nextDistance = this.dashSeparation * i;
            let dashLength = this.dashSeparation * DASH_LENGTH_RATIO;
            
            let startPointX = AxesPainter._createPoint(nextDistance,0,dashLength);
            let startPointY = AxesPainter._createPoint(dashLength,nextDistance,0);
            let startPointZ = AxesPainter._createPoint(dashLength,0,nextDistance);

            this.lines.push(AxesPainter._createAxisDash(startPointX, Axis.X));
            this.dashesX.push(this.lines[this.lines.length - 1]);
            this.lines.push(AxesPainter._createAxisDash(startPointY, Axis.Y));
            this.lines.push(AxesPainter._createAxisDash(startPointZ, Axis.Z));

            let text = Math.round(startPointX.x * 10) / 10; 
            this.numberSprites2D.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointX, Axis.X)); 

            text = Math.round(startPointY.y * 10) / 10;
            this.numberSprites2D.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointY, Axis.Y)); 

            text = Math.round(startPointZ.z * 10) / 10;
            this.numbersZAxis.push(AxesPainter._makeTextSprite(text.toString(), 30, startPointZ, Axis.Z)); 
        }
    }

    /**
     * Creates a simple point Object
     * @param {number} x Defaults to 0
     * @param {number} y Defaults to 0
     * @param {number} z Defaults to 0
     * @returns {{x: *, y: *, z: *}}
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
        // rewrite this to BufferGeometry if needed later
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
    static  _makeTextSprite(text, fontsize, position, alignment) {
        var ctx, texture, sprite, spriteMaterial, 
            canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        ctx.font = fontsize + "px Arial";

        // setting canvas width/height before ctx draw, else canvas is empty
        canvas.width = ctx.measureText(text).width;
        canvas.height = fontsize * 2;

        // after setting the canvas width/height we have to re-set font to apply
        ctx.font = fontsize + "px Arial";        
        ctx.fillText(text, 0, fontsize);

        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        spriteMaterial = new THREE.SpriteMaterial({map : texture});
        sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(
            0.04 + text.length * 0.025,
            0.15, 
            0.15
        );

        switch (alignment) {
            case Axis.X:
                sprite.position.set(position.x, 0.01, 0);
                break;

            case Axis.Y:
                sprite.position.set(0.07, position.y-0.025, 0);
                break;

            case Axis.Z:
                sprite.position.set(0, 0.01, position.z);
                break;

            default:
                throw new Error('Invalid text alignment!');
        }
        return sprite;   
    }
}