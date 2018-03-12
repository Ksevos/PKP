// Paimta is https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
//@ts-check

import React from 'react';
import dat from "dat.gui"
import DataReader from './DataReader';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';
import SocketIOClient from 'socket.io-client';

class Visualization extends React.Component {
    toolbar;
    Controls = function () {
        this.color = "#000";
    };

    constructor(props) {
        super(props);

        this.dataReader = new DataReader();

        //Listens for "dataUploaded" message from the server
        this.socket = SocketIOClient("http://localhost:4000/");
        this.socket.on('dataUploaded', (message) => {
            if(message && this.threeRenderer)
                this.dataReader.downloadData();
          });
    }

    componentDidMount() {
        if(!this.threeRenderer)
            this.threeRenderer = new Renderer(this.mount.clientWidth, this.mount.clientHeight);
        this.dataReader.subscribeToDownloadEvent(this.threeRenderer.onDataDownloaded.bind(this.threeRenderer));
        this.mount.appendChild(this.threeRenderer.getRenderer().domElement);
        this.threeRenderer.start();

        if(!this.dataReader.getData()){
            this.dataReader.downloadData();
        }
        else{
            this.threeRenderer.addToScene(
                this.dataReader.getData(), 
                this.dataReader.getAllAxes()[0],
                this.dataReader.getAllAxes()[1],
                this.dataReader.getAllAxes()[2]);
        }
        
        //ControlsGUI
        const text = new this.Controls();
        this.toolbar = new dat.GUI();
        const background = this.toolbar.addFolder('Background');
        let renderer = this.threeRenderer.getRenderer();
        background.addColor(text, 'color')
            .onChange(function () {
                renderer.setClearColor(text.color);
            });
        const scale = this.toolbar.addFolder('Scale');
    }

    componentWillUnmount() {
        this.toolbar.destroy();
        this.threeRenderer.stop();
        this.dataReader.unsubscribeFromDownloadEvent(this.threeRenderer.onDataDownloaded);
        this.mount.removeChild(this.threeRenderer.getRenderer().domElement);
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
