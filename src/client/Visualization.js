//@ts-check

import React from 'react';
import dat from "dat.gui"
import DataHandler from './DataHandler';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';
//import SocketIOClient from 'socket.io-client';

class Visualization extends React.Component {
    toolbar;
    Controls = function () {
        this.color = "#000";
    };

    constructor(props) {
        super(props);

        this.dataHandler = new DataHandler();

        /*
        //Listens for "dataUploaded" message from the server
        this.socket = SocketIOClient("http://localhost:4000/");
        this.socket.on('dataUploaded', (message) => {
            if(message && this.threeRenderer)
                this.dataReader.downloadData();
          });
          */
    }

    componentDidMount() {
        if(!this.threeRenderer)
            this.threeRenderer = new Renderer(this.mount.clientWidth, this.mount.clientHeight);
        this.dataHandler.subscribeToChangeEvent(this.threeRenderer.onDataChange.bind(this.threeRenderer));
        this.mount.appendChild(this.threeRenderer.getRenderer().domElement);
        this.threeRenderer.start();


        this.dataHandler.downloadData();
        //this.dataReader.updateCamera(this.threeRenderer.camera, this.threeRenderer.controls);

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
        this.dataHandler.unsubscribeFromChangeEvent(this.threeRenderer.onDataChange);
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
