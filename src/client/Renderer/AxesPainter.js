import * as THREE from 'three';

const DASH_LENGTH = 0.025;
const DASH_L_LENGTH = DASH_LENGTH + 0.1;
const AXIS = Object.freeze({'X': 1, 'Y': 2, 'Z': 3});

class AxesPainter {

    lines = [];
    axesHelper;

    size;
    division;
    dashes;

    constructor(size, division, dashes) {
        this.size = size            || 10;
        this.division = division    || 10;
        this.dashes = dashes        || 3;
        this.axesHelper = new THREE.AxesHelper(size / 2);

        const materialX = new THREE.LineBasicMaterial( {color: '#ff0000'} );
        const materialY = new THREE.LineBasicMaterial( {color: '#00ff00'} );
        const materialZ = new THREE.LineBasicMaterial( {color: '#0000ff'} );

        let limit = division / 2;

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

                this.lines.push(AxesPainter._createAxisDash(dashX, materialX, AXIS.X));
                this.lines.push(AxesPainter._createAxisDash(dashY, materialY, AXIS.Y));
                this.lines.push(AxesPainter._createAxisDash(dashZ, materialZ, AXIS.Z));
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

                this.lines.push(AxesPainter._createAxisDash(longerDashX, materialX, AXIS.X));
                this.lines.push(AxesPainter._createAxisDash(longerDashY, materialY, AXIS.Y));
                this.lines.push(AxesPainter._createAxisDash(longerDashZ, materialZ, AXIS.Z));
            }
        }
    }

    setScene(scene) {
        scene.add(this.axesHelper);

        this.lines.forEach(function (line) {
            scene.add(line);
        })
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
            case AXIS.X:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y,-centerPoint.z ));
                break;

            case AXIS.Y:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                break;

            case AXIS.Z:
                geometry.vertices.push(new THREE.Vector3( centerPoint.x, centerPoint.y, centerPoint.z ));
                geometry.vertices.push(new THREE.Vector3(-centerPoint.x, centerPoint.y, centerPoint.z ));
                break;
        }

        return new THREE.Line(geometry,material);
    }
}

export default AxesPainter;