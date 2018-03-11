// Paimta is https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
//@ts-check

import React from 'react';
import DataReader from './DataReader';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';
import SocketIOClient from 'socket.io-client';
import Toolbar from "./Toolbar/Toolbar";

class Visualization extends React.Component {
    toolbar;

    constructor(props) {
        super(props);

        this.dataReader = new DataReader();
      
        //componentWillReceiveProps(nextProps) {
        //    this.renderer.setClearColor(nextProps.bgColor)
        //}

        //Listens for "dataUploaded" message from the server
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
        this.toolbar = new Toolbar(this.threeRenderer, this.dataReader);
    }

    componentWillUnmount() {
        this.toolbar.destroy();
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
                     width: '100vw',
                     height: '100vh'
                 }}
                 ref={(mount) => {
                     this.mount = mount
                 }}
            >
                <Link to={"/"}><span className="close thick"></span></Link>
            </div>
        )
    }
}

export default Visualization;
