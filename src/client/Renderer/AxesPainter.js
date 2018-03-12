import * as THREE from 'three';

class AxesPainter {

    lines = [];
    axesHelper;

    constructor(size, division) {
        this.axesHelper = new THREE.AxesHelper(size / 2);

        const materialX = new THREE.LineBasicMaterial( {color: 0xf441f1});
        const materialY = new THREE.LineBasicMaterial( {color: 0xf441f1});
        const materialZ = new THREE.LineBasicMaterial( {color: 0xf441f1});

        for(let i = 0; i < division / 2; i++) {
            // rewrite this to BufferyGeometry for efficiency, maybe?
            let geometry = new THREE.Geometry();

            geometry.vertices.push(new THREE.Vector3(i / (division / size) + (size / division) / 2,0, 0.5));
            geometry.vertices.push(new THREE.Vector3(i / (division / size) + (size / division) / 2,0,-0.5));

            this.lines.push(new THREE.Line(geometry,materialX));
        }
    }

    setScene(scene) {
        scene.add(this.axesHelper);

        this.lines.forEach(function (line) {
            scene.add(line);
        })
    }
}

export default AxesPainter;