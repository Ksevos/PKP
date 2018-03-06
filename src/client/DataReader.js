import * as THREE from "three";
import axios from 'axios';

class DataReader {
    constructor(props) {
        this.lastData = '';
    }

    checkFileData(fileData) {
        if (!Array.isArray(JSON.parse(JSON.stringify(fileData)).values) ||
            !JSON.parse(JSON.stringify(fileData)).values.length) {
            return false;
        } else {
            return true;
        }
    }

    addDataToScene(scene) {
        const geometry = new THREE.SphereGeometry(0.05, 64, 64);
        const elements = JSON.parse(JSON.stringify(this.lastData)).values[0].length;
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' });

        for (var i = 0; i < elements; i++) {
            let dot = new THREE.Mesh(geometry, material);
            dot.position.x = JSON.parse(JSON.stringify(this.lastData)).values[0][i];
            dot.position.y = JSON.parse(JSON.stringify(this.lastData)).values[1][i];
            dot.position.z = JSON.parse(JSON.stringify(this.lastData)).values[2][i];
            scene.add(dot);
        }
    }

    readDataFromJSON(scene) {
        axios.get("/storage/current")
            .then(response => {
                const fileData = response.data[0];
                if (JSON.stringify(this.lastData) !== JSON.stringify(fileData)
                    && this.checkFileData(fileData)) {
                    this.lastData = fileData;
                    this.addDataToScene(scene);
                }
            })
    }
}


export default DataReader;
