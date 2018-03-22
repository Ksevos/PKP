import * as THREE from 'three';
import {Axis} from "../CustomObjects/Enum";

const DASH_LENGTH = 0.025;
const DASH_L_LENGTH = DASH_LENGTH + 0.1;

const MATERIAL_X = new THREE.LineBasicMaterial( {color: '#ff0000'} );
const MATERIAL_Y = new THREE.LineBasicMaterial( {color: '#00ff00'} );
const MATERIAL_Z = new THREE.LineBasicMaterial( {color: '#0000ff'} );

export default class AxesPainter extends THREE.Group {

    /**
     * Paints AxesHelper and dashes on top of it, meant to be scaled with GridHelper
     * @param {number} size Grid size
     * @param {number} division Grid division
     * @param {number} dashes Amount of dashes in each grid square
     */
    constructor(size, division, dashes) {
        super();

        this.size = size            || 10;
        this.division = division    || 10;
        this.dashes = dashes        || 3;
        this.axesHelper = new THREE.AxesHelper(this.size / 2);
        this.lines = [];

        // TODO: refactor this and it's uses
        this.dashesX = [];

        this._paint();

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
           0, 0, -this.size/2,	0, 0, this.size/2
       ]);
       let axis = this.axesHelper.geometry.attributes.position.array;
       axis.set(axisLines);

       this.dashesX.forEach(function (line) {
           line.rotateX(1.5708);
       })
   }

    /**
     * Scales axes to new grid size
     * @param {number} size
     */
    scaleTo(size) {
        size = Math.ceil(size) * 2 + 2;

        this.size = size;
        this.division = size;

        this.repaint();
    }

    /**
     * Removes previous objects and paints them from scratch
     */
    repaint() {
        this.remove(this.axesHelper);
        this.axesHelper = new THREE.AxesHelper(this.size / 2);
        this.add(this.axesHelper);

        this.remove(...this.lines);
        this.lines.length = 0;
        this.dashesX.length = 0;
        this._paint();
        this.add(...this.lines);

        console.log(this.dashesX);
    }

    /**
     * Paints axis dashes scaled with grid size and division
     * @private
     */
    _paint() {
        let limit = this.division / 2;

        for(let i = 0; i < limit; i++) {
            for (let j = 1; j <= this.dashes; j++) {

                let dashX = {
                    x: this._scaleDashDistance(i, j),
                    y: 0,
                    z: this._scaleDashLength(DASH_LENGTH)
                };

                let dashY = {
                    x: this._scaleDashLength(DASH_LENGTH),
                    y: this._scaleDashDistance(i, j),
                    z: 0
                };

                let dashZ = {
                    x: this._scaleDashLength(DASH_LENGTH),
                    y: 0,
                    z: this._scaleDashDistance(i, j)
                };

                this.lines.push(AxesPainter._createAxisDash(dashX, Axis.X));
                this.dashesX.push(this.lines[this.lines.length - 1]);
                this.lines.push(AxesPainter._createAxisDash(dashY, Axis.Y));
                this.lines.push(AxesPainter._createAxisDash(dashZ, Axis.Z));
            }

            // intermediate (longer) dashes
            if(i !== limit - 1) {
                let longerDashX = {
                    x: this._scaleDashDistance(i + 1, 0),
                    y: 0,
                    z: this._scaleDashLength(DASH_L_LENGTH)
                };

                let longerDashY = {
                    x: this._scaleDashLength(DASH_L_LENGTH),
                    y: this._scaleDashDistance(i + 1, 0),
                    z: 0
                };

                let longerDashZ = {
                    x: this._scaleDashLength(DASH_L_LENGTH),
                    y: 0,
                    z: this._scaleDashDistance(i + 1, 0)
                };

                this.lines.push(AxesPainter._createAxisDash(longerDashX, Axis.X));
                this.dashesX.push(this.lines[this.lines.length - 1]);
                this.lines.push(AxesPainter._createAxisDash(longerDashY, Axis.Y));
                this.lines.push(AxesPainter._createAxisDash(longerDashZ, Axis.Z));
            }
        }
    }

    /**
     * Returns the point on the axis at which the next dash should be drawn
     * @param {number} gridDistance
     * @param {number} dashIndex
     * @returns {number}
     * @private
     */
    _scaleDashDistance(gridDistance, dashIndex) {
        const dashSeparation = 1 / (this.dashes + 1);
        return gridDistance / (this.division / this.size) + (this.size / this.division) * dashSeparation * dashIndex;
    }

    /**
     * Returns dash length scaled to one grid square
     * @param {number} length
     * @returns {number}
     * @private
     */
    _scaleDashLength(length) {
        return (this.size / this.division) * length;
    }

    /**
     * Creates a new dash on axis point
     * @param {Object} centerPoint Point on the axis
     * @param {number} alignment Used to align dashes with Enum.Axis
     * @returns {Line}
     * @private
     */
    static _createAxisDash(centerPoint, alignment) {
        // rewrite this to BufferGeometry if needed later
        let geometry = new THREE.Geometry();
        let material;

        switch (alignment) {
            case Axis.X:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y,-centerPoint.z ));
                material = MATERIAL_X;
                break;

            case Axis.Y:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                material = MATERIAL_Y;
                break;

            case Axis.Z:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                material = MATERIAL_Z;
                break;

            default:
                throw new Error('Undefined dash alignment!');
        }

        return new THREE.Line(geometry,material);
    }
}