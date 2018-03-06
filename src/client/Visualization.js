// Paimta is https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
//@ts-check

import React from 'react';
import dat from "dat.gui"
import DataReader from './DataReader';
import Renderer from './Renderer/Renderer';
import SocketIOClient from 'socket.io-client';

class Visualization extends React.Component {
    constructor(props) {
        super(props);

        this.dataReader = new DataReader();
      
        componentWillReceiveProps(nextProps) {
            this.renderer.setClearColor(nextProps.bgColor)

        this.socket = SocketIOClient("http://localhost:4000/");
        this.socket.on('dataUploaded', (message) => {
            if(message && this.threeRenderer)
                this.onDataLoaded();
          });
    }

    componentDidMount() {
        this.threeRenderer = new Renderer(this.mount.clientWidth, this.mount.clientHeight);
        this.mount.appendChild(this.threeRenderer.getRenderer().domElement);
        this.threeRenderer.start();
        this.dataReader.addDataToScene(this.threeRenderer.getScene());
      
        //ControlsGUI
        const Controls = function () {
            this.color = "#000";
        };

        const text = new Controls(),
        gui = new dat.GUI();
        const background = gui.addFolder('Background');
        background.addColor(text, 'color')
            .onChange(function () {
                renderer.setClearColor(text.color)
            });
        const scale = gui.addFolder('Scale');
    }

    componentWillUnmount() {
        this.threeRenderer.stop();
        this.mount.removeChild(this.threeRenderer.getRenderer().domElement);
    }

    onDataLoaded(){
        this.threeRenderer.removeDataFromScene();
        this.dataReader.addDataToScene(this.threeRenderer.getScene());
    }

    render() {
        return (
            <div className="Visualization"
                 style={{
                     width: '1000px',
                     height: '800px'
                 }}
                 ref={(mount) => {
                     this.mount = mount
                 }}
            />
        )
    }
}


export default Visualization;
