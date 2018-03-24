//@ts-check

import React from 'react';

import Toolbar from "./Toolbar/Toolbar";
import DataHandler from './DataHandler';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';
import DataInfoBox from "./DataInfoBox";

//CSS
import './Visualization.css';
import './DataInfoBox.css';

class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.dataHandler = new DataHandler();
        this.reactComponents = null;
    }

    componentDidMount() {
        if(!this.threeRenderer)
            this.threeRenderer = new Renderer(this.mount.clientWidth, this.mount.clientHeight);
        this.dataHandler.subscribeToChangeEvent(this.threeRenderer.onDataChange.bind(this.threeRenderer));
        this.dataHandler.subscribeToChangeEvent(this._onDataChange.bind(this));
        this.mount.appendChild(this.threeRenderer.getRenderer().domElement);
        this.threeRenderer.start();

        this.dataHandler.downloadData();

        //ControlsGUI
        this.toolbar = new Toolbar(this.threeRenderer, this.dataHandler);
        this.toolbar.subscribeToToggle2DEvent(this.threeRenderer.on2DToggled.bind(this.threeRenderer));
    }

    componentWillUnmount() {
        this.toolbar.destroy();
        this.threeRenderer.stop();
        this.dataHandler.unsubscribeFromChangeEvent(this.threeRenderer.onDataChange);
        //Remove all children
        while(this.mount.firstChild){
            this.mount.removeChild(this.mount.firstChild);
        }
    }

    _onDataChange(sender, args){
        if(this.dataInfoBox)
            this.mount.removeChild(this.dataInfoBox.getDom());
        this.dataInfoBox = new DataInfoBox(sender);
        this.mount.appendChild(this.dataInfoBox.getDom());
    }

    _onChildComponentsUpdate(sender, args){
        this.reactComponents = args
    }

    render() {
        return (
            <div>
                <div className="Visualization"
                    ref={(mount) => {
                        this.mount = mount
                    }}>
                    <Link to={"/"}><span className="close-back thick"></span></Link>
                </div>
                {this.reactComponents}
            </div>
        )
    }
}

export default Visualization;
