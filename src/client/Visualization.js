// Paimta is https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
//@ts-check

import React from 'react';
import * as THREE from "three";
import DataReader from './DataReader';

class Visualization extends React.Component {
    constructor(props) {
      super(props)

      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.animate = this.animate.bind(this)
    }
  
    componentDidMount() {
      const axesHelper = new THREE.axesHelper(10000);

      const width = this.mount.clientWidth
      const height = this.mount.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
      )
      camera.position.z = 5
      camera.position.y = 0

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      const geometry = new THREE.BoxGeometry(1, 1, 1)

      let size = 100;
      let divisions = 100;
      let gridHelper = new THREE.GridHelper(size, divisions);
      scene.add(gridHelper);

      renderer.setClearColor('#000000')
      renderer.setSize(width, height)

      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;

      const uploadData = new DataReader();
      this.uploadData = uploadData;

      scene.add(axesHelper);

      this.mount.appendChild(this.renderer.domElement)
      this.start()
    }

    componentWillUnmount() {
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
    start() {
        if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }
  
    stop() {
      cancelAnimationFrame(this.frameId)
    }
  
    animate() {
      this.uploadData.readDataFromJSON(this.scene);

      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
      this.renderer.render(this.scene, this.camera)
    }
  
    render() {
      return (
        <div className="Visualization"
          style={{ width: '1000px', 
                   height: '800px'}}
          ref={(mount) => { this.mount = mount }}
        />
      )
    }
  }
  

export default Visualization;
