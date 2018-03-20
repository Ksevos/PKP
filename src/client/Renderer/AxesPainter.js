import * as THREE from 'three';
import {Axis} from "../CustomObjects/Enum";

const DASH_LENGTH = 0.025;
const DASH_L_LENGTH = DASH_LENGTH + 0.1;

const MATERIAL_X = new THREE.LineBasicMaterial( {color: '#ff0000'} );
const MATERIAL_Y = new THREE.LineBasicMaterial( {color: '#00ff00'} );
const MATERIAL_Z = new THREE.LineBasicMaterial( {color: '#0000ff'} );

class AxesPainter extends THREE.Group {

    lines = [];
    axesHelper;

    size;
    division;
    dashes;

    constructor(size, division, dashes) {
        super();

        this.size = size            || 10;
        this.division = division    || 10;
        this.dashes = dashes        || 3;
        this.axesHelper = new THREE.AxesHelper(size / 2);

        this._paint();

        this.add(this.axesHelper);
    }

    scaleTo(size) {
        size = Math.ceil(size) * 2 + 2;

        this.size = size;
        this.division = size;

        this.remove(this.axesHelper);
        this.add(new THREE.AxesHelper(size / 2));

        this.remove(...this.lines);
        this.lines.length = 0;
        this._paint();
    }

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

                this.lines.push(AxesPainter._createAxisDash(dashX, MATERIAL_X, Axis.X));
                this.lines.push(AxesPainter._createAxisDash(dashY, MATERIAL_Y, Axis.Y));
                this.lines.push(AxesPainter._createAxisDash(dashZ, MATERIAL_Z, Axis.Z));
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

                this.lines.push(AxesPainter._createAxisDash(longerDashX, MATERIAL_X, Axis.X));
                this.lines.push(AxesPainter._createAxisDash(longerDashY, MATERIAL_Y, Axis.Y));
                this.lines.push(AxesPainter._createAxisDash(longerDashZ, MATERIAL_Z, Axis.Z));
            }
        }

        for(let i = 0; i < this.lines.length; i++) {
            this.add(this.lines[i]);
        }
    }

    // returns the point on the axis at which the next dash should be drawn
    _scaleDashDistance(gridDistance, dashIndex) {
        const dashSeparation = 1 / (this.dashes + 1);
        return gridDistance / (this.division / this.size) + (this.size / this.division) * dashSeparation * dashIndex;
    }

    // returns dash length scaled to 1 grid square
    _scaleDashLength(length) {
        return (this.size / this.division) * length;
    }

    static _createAxisDash(centerPoint, material, alignment) {
        // rewrite this to BufferyGeometry if needed later
        let geometry = new THREE.Geometry();

        switch (alignment) {
            case Axis.X:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y,-centerPoint.z ));
                break;

            case Axis.Y:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                break;

            case Axis.Z:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                break;

            default:
                throw new Error('Undefined dash alignment!');
        }

        return new THREE.Line(geometry,material);
    }
}

export default AxesPainter;