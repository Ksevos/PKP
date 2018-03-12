import * as THREE from 'three';

class AxesPainter {

    lines = [];
    axesHelper;

    size;
    division;

    constructor(size, division, dashes) {
        this.size = size;
        this.division = division;
        this.axesHelper = new THREE.AxesHelper(size / 2);

        const materialX = new THREE.LineBasicMaterial( {color: 'rgb(255,0,0)'} );
        const materialY = new THREE.LineBasicMaterial( {color: 'rgb(0,255,0)'} );
        const materialZ = new THREE.LineBasicMaterial( {color: 'rgb(0,0,255)'} );

        let limit = division / 2;

        for(let i = 0; i < limit; i++) {
            // rewrite this to BufferGeometry for efficiency, maybe?

            for (let j = 1; j <= dashes; j++) {

                let AxisX = {
                    x: this._getDashDistance(i,j),
                    y: 0,
                    z: this._getDashLength(0.05)
                };

                let AxisY = {
                    x: 0,
                    y: 0,
                    z: 0
                };

                let AxisZ = {
                    x: 0,
                    y: 0,
                    z: 0
                };

                this.lines.push(this._createAxisDash(AxisX.x, AxisX.y, AxisX.z, materialX));
            }

            if(i !== limit - 1) {

            }
        }
    }

    _getDashDistance(gridDistance, nextDash) {
        return gridDistance / (this.division / this.size) + (this.size / this.division) * 0.2 * nextDash;
    }

    _getDashLength(ratioToGrid) {
        return (this.size / this.division) * ratioToGrid;
    }

    setScene(scene) {
        scene.add(this.axesHelper);

        this.lines.forEach(function (line) {
            scene.add(line);
        })
    }

    _createAxisDash(x, y, z, material) {
        let geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        geometry.vertices.push(new THREE.Vector3(x, y,-z));

        return new THREE.Line(geometry,material);
    }


}

export default AxesPainter;