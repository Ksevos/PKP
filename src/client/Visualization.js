//@ts-check

import React from 'react';

import Toolbar from "./Toolbar/Toolbar";
import DataHandler from './DataHandler';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';
//import SocketIOClient from 'socket.io-client';

class Visualization extends React.Component {
    toolbar;

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

        //ControlsGUI
        this.toolbar = new Toolbar(this.threeRenderer, this.dataHandler);
    }

    componentWillUnmount() {
        this.toolbar.destroy();
        this.threeRenderer.stop();
        this.dataHandler.unsubscribeFromChangeEvent(this.threeRenderer.onDataDownloaded);
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
